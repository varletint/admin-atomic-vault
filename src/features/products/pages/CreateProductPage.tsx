import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/config";
import { useCreateProduct } from "../hooks/useProducts";
import { ProductForm } from "../components/ProductForm";

export function CreateProductPage() {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  return (
    <>
      <Helmet>
        <title>Create Product — Atomic Admin</title>
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
              Create Product
            </h1>
            <p className='text-sm text-admin-muted mt-1'>
              Add a new product to your catalog
            </p>
          </div>
        </div>

        <ProductForm
          mode='create'
          isSubmitting={createMutation.isPending}
          onCancel={() => navigate(-1)}
          onSubmit={(data, imageFiles) => {
            createMutation.mutate(
              { data, imageFiles },
              {
                onSuccess: () => {
                  toast.success("Product created successfully!");
                  navigate(ROUTES.PRODUCTS);
                },
                onError: (error) => {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Failed to create product"
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
