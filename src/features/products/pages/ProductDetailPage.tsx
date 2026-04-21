import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Edit,
  Power,
  PowerOff,
  Star,
  Warehouse,
} from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/config";
import {
  useProduct,
  useDeactivateProduct,
  useReactivateProduct,
} from "../hooks/useProducts";
import { ProductStatusBadge } from "../components/ProductStatusBadge";
import type { ProductVariant } from "../types";
import { formatCurrency, formatDate } from "@/utils/format";

// function getPrimaryImage(product: Product): string | null {
//   const primary = product.images.find((img) => img.isPrimary);
//   return primary?.url ?? product.images[0]?.url ?? null;
// }F

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='flex justify-between py-2 border-b border-[var(--color-border)] last:border-b-0'>
      <span className='text-xs text-admin-faint'>{label}</span>
      <span className='text-sm text-admin-text text-right'>{value}</span>
    </div>
  );
}

function VariantRow({ variant }: { variant: ProductVariant }) {
  const options = variant.variantOptions
    .map((o) => `${o.name}: ${o.value}`)
    .join(" · ");
  return (
    <div className='flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] last:border-b-0'>
      <div>
        <p className='text-sm font-semibold text-admin-ink'>{options}</p>
        <p className='text-[10px] text-admin-faint tracking-wide'>
          {variant.sku}
        </p>
      </div>
      <div className='text-right'>
        <p className='text-sm font-bold tabular-nums text-admin-ink'>
          {formatCurrency(variant.price)}
        </p>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider ${
            variant.isActive
              ? "text-[var(--color-success)]"
              : "text-[var(--color-error)]"
          }`}>
          {variant.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id ?? "");
  const deactivate = useDeactivateProduct();
  const reactivate = useReactivateProduct();
  const [showConfirm, setShowConfirm] = useState(false);

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

  const toggleAction = product.isActive ? deactivate : reactivate;
  const toggleLabel = product.isActive ? "Deactivate" : "Reactivate";
  const togglePending = deactivate.isPending || reactivate.isPending;

  return (
    <>
      <Helmet>
        <title>{product.name} — Atomic Admin</title>
      </Helmet>

      <div className='p-4 md:p-8'>
        {/* Back link */}
        <Link
          to={ROUTES.PRODUCTS}
          className='inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-admin-muted no-underline hover:text-admin-ink'>
          <ArrowLeft size={14} /> Back to Products
        </Link>

        {/* Header */}
        <div className='mt-4 flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-xl font-bold tracking-tight text-admin-ink md:text-2xl'>
              {product.name}
            </h1>
            <div className='mt-2 flex flex-wrap items-center gap-3'>
              <ProductStatusBadge isActive={product.isActive} />
              <span className='text-[10px] text-admin-faint tracking-wide'>
                {product.sku}
              </span>
              {product.isFeatured && (
                <span className='inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-yellow-500'>
                  <Star size={12} fill='currentColor' /> Featured
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-2'>
            <Link
              to={`/products/${product._id}/edit`}
              className='btn btn-primary inline-flex items-center uppercase gap-2'>
              <Edit size={14} /> Edit
            </Link>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={() => setShowConfirm(true)}>
              {product.isActive ? <PowerOff size={14} /> : <Power size={14} />}
              <span className='hidden sm:inline'>{toggleLabel}</span>
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className='mt-6 grid gap-6 lg:grid-cols-3'>
          {/* Left Column */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Images */}
            {product.images.length > 0 && (
              <section className='border border-[var(--color-border)] bg-admin-surface'>
                <div className='border-b border-[var(--color-border)] px-4 py-3'>
                  <h2 className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                    Images
                  </h2>
                </div>
                <div className='p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                  {product.images
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((img, i) => (
                      <div
                        key={i}
                        className={`relative aspect-square border overflow-hidden ${
                          img.isPrimary
                            ? "border-2 border-admin-accent"
                            : "border-[var(--color-border)]"
                        }`}>
                        <img
                          src={img.url}
                          alt={img.altText || product.name}
                          className='w-full h-full object-cover'
                        />
                        {img.isPrimary && (
                          <div className='absolute bottom-0 inset-x-0 bg-admin-accent text-white text-[8px] font-bold uppercase tracking-widest text-center py-0.5'>
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Description */}
            <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
              <h2 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Description
              </h2>
              {product.shortDescription && (
                <p className='text-sm font-semibold text-admin-ink mb-2'>
                  {product.shortDescription}
                </p>
              )}
              <p className='text-sm text-admin-text whitespace-pre-wrap'>
                {product.description}
              </p>
            </section>

            {/* Variants */}
            {product.hasVariants && product.variants.length > 0 && (
              <section className='border border-[var(--color-border)] bg-admin-surface'>
                <div className='border-b border-[var(--color-border)] px-4 py-3'>
                  <h2 className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                    Variants ({product.variants.length})
                  </h2>
                </div>
                {product.variants.map((v) => (
                  <VariantRow key={v._id} variant={v} />
                ))}
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Pricing */}
            <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
              <h2 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Pricing
              </h2>
              <InfoRow
                label='Price'
                value={
                  <span className='font-bold'>
                    {formatCurrency(product.price)}
                  </span>
                }
              />
              {product.compareAtPrice !== undefined && (
                <InfoRow
                  label='Compare-at'
                  value={formatCurrency(product.compareAtPrice)}
                />
              )}
              {product.costPrice !== undefined && (
                <InfoRow
                  label='Cost'
                  value={formatCurrency(product.costPrice)}
                />
              )}
            </section>

            {/* Inventory */}
            <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
              <h2 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Inventory
              </h2>
              <InfoRow label='Total Stock' value={product.stock} />
              <InfoRow label='Reserved' value={product.reserved} />
              <InfoRow
                label='Available'
                value={
                  <span
                    className={
                      product.available <= 0
                        ? "text-[var(--color-error)] font-bold"
                        : ""
                    }>
                    {product.available}
                  </span>
                }
              />
              <InfoRow label='Min. Order Qty' value={product.minOrderQty} />
              <Link
                to={`/products/${product._id}/inventory`}
                className='mt-3 btn btn-secondary w-full inline-flex items-center justify-center gap-2 no-underline'>
                <Warehouse size={14} />
                Manage Inventory
              </Link>
            </section>

            {/* Details */}
            <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
              <h2 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Details
              </h2>
              <InfoRow label='Category' value={product.category} />
              {product.brand && <InfoRow label='Brand' value={product.brand} />}
              <InfoRow label='Type' value={product.productType} />
              {product.tags.length > 0 && (
                <InfoRow label='Tags' value={product.tags.join(", ")} />
              )}
              {product.weight !== undefined && (
                <InfoRow
                  label='Weight'
                  value={`${product.weight} ${product.weightUnit}`}
                />
              )}
              {product.material && (
                <InfoRow label='Material' value={product.material} />
              )}
              <InfoRow
                label='Avg. Rating'
                value={`${product.avgRating} (${product.reviewCount} reviews)`}
              />
            </section>

            {/* SEO */}
            {product.seo && (
              <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
                <h2 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  SEO
                </h2>
                {product.seo.metaTitle && (
                  <InfoRow label='Meta Title' value={product.seo.metaTitle} />
                )}
                {product.seo.metaDescription && (
                  <InfoRow
                    label='Meta Description'
                    value={product.seo.metaDescription}
                  />
                )}
                {product.seo.metaKeywords &&
                  product.seo.metaKeywords.length > 0 && (
                    <InfoRow
                      label='Keywords'
                      value={product.seo.metaKeywords.join(", ")}
                    />
                  )}
              </section>
            )}

            {/* Timestamps */}
            <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
              <h2 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Metadata
              </h2>
              <InfoRow label='Slug' value={product.slug} />
              <InfoRow label='Created' value={formatDate(product.createdAt)} />
              <InfoRow label='Updated' value={formatDate(product.updatedAt)} />
            </section>
          </div>
        </div>
      </div>

      {/* Deactivate/Reactivate Confirmation */}
      {showConfirm && (
        <>
          <div
            className='fixed inset-0 z-50 bg-black/40'
            onClick={() => setShowConfirm(false)}
            aria-hidden='true'
          />
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-sm border border-[var(--color-border)] bg-admin-surface p-6 animate-fadeIn'>
              <h3 className='text-sm font-bold uppercase tracking-[0.12em] text-admin-ink'>
                {toggleLabel} Product
              </h3>
              <p className='mt-2 text-sm text-admin-text'>
                {product.isActive
                  ? "This will hide the product from the storefront. You can reactivate it later."
                  : "This will make the product visible on the storefront again."}
              </p>
              <div className='mt-6 flex gap-3 justify-end'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setShowConfirm(false)}
                  disabled={togglePending}>
                  Cancel
                </button>
                <button
                  type='button'
                  className='btn btn-primary'
                  disabled={togglePending}
                  onClick={() => {
                    toggleAction.mutate(product._id, {
                      onSuccess: () => {
                        toast.success(
                          `Product ${
                            product.isActive ? "deactivated" : "reactivated"
                          }`
                        );
                        setShowConfirm(false);
                      },
                      onError: () => {
                        toast.error(
                          `Failed to ${toggleLabel.toLowerCase()} product`
                        );
                      },
                    });
                  }}>
                  {togglePending ? "Processing…" : toggleLabel}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
