import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/config";
import { useProduct, useUpdateProduct } from "../hooks/useProducts";
import { ProductForm } from "../components/ProductForm";

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id ?? "");
  const updateMutation = useUpdateProduct();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-12'>
        <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
          Loading product…
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className='p-4 md:p-8'>
        <Link
          to={ROUTES.PRODUCTS}
          className='inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-admin-muted no-underline hover:text-admin-ink'>
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <div className='mt-6 border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
          <p className='text-sm font-semibold text-[var(--color-error)]'>
            Product not found or failed to load.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit {product.name} — Atomic Admin</title>
      </Helmet>
      <div className='p-4 md:p-8 max-w-4xl'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='p-2 border border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)] transition-colors'>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className='text-2xl font-black uppercase tracking-tight text-admin-ink flex items-center gap-3'>
              <Package size={24} />
              Edit Product
            </h1>
            <p className='text-sm text-admin-muted mt-1'>
              {product.name} · {product.sku}
            </p>
          </div>
        </div>

        <ProductForm
          mode='edit'
          defaultValues={product}
          isSubmitting={updateMutation.isPending}
          onCancel={() => navigate(`/products/${product._id}`)}
          onSubmit={(data, imageFiles) => {
            updateMutation.mutate(
              { id: product._id, data, imageFiles },
              {
                onSuccess: () => {
                  toast.success("Product updated!");
                  navigate(`/products/${product._id}`);
                },
                onError: (error) => {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Failed to update product"
                  );
                },
              }
            );
          }}
        />
      </div>
    </>
  );
}
