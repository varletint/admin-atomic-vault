import { Link } from "react-router-dom";
import { ProductStatusBadge } from "./ProductStatusBadge";
import type { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

function getPrimaryImage(product: Product): string | null {
  const primary = product.images.find((img) => img.isPrimary);
  return primary?.url ?? product.images[0]?.url ?? null;
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className='border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
        <p className='text-sm font-semibold text-admin-muted'>
          No products found
        </p>
        <p className='mt-1 text-xs text-admin-faint'>
          Try adjusting your filters or add a new product.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className='hidden md:block border border-[var(--color-border)] bg-admin-surface'>
        <table className='w-full text-left'>
          <thead>
            <tr className='border-b border-[var(--color-border)]'>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted w-12' />
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Product
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Category
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Price
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Stock
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Status
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const thumb = getPrimaryImage(product);
              return (
                <tr
                  key={product._id}
                  className='border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-bg-subtle)]'>
                  {/* Thumbnail */}
                  <td className='px-4 py-3'>
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={product.name}
                        className='size-10 object-cover border border-[var(--color-border)]'
                      />
                    ) : (
                      <div className='size-10 bg-[var(--color-bg-muted)] border border-[var(--color-border)] flex items-center justify-center'>
                        <span className='text-[8px] font-bold text-admin-faint uppercase'>
                          N/A
                        </span>
                      </div>
                    )}
                  </td>
                  {/* Name + SKU */}
                  <td className='px-4 py-3'>
                    <Link
                      to={`/products/${product._id}`}
                      className='text-sm font-bold text-admin-ink no-underline hover:underline block'>
                      {product.name}
                    </Link>
                    <span className='text-[10px] text-admin-faint tracking-wide'>
                      {product.sku}
                    </span>
                  </td>
                  {/* Category */}
                  <td className='px-4 py-3 text-sm text-admin-text'>
                    {product.category}
                  </td>
                  {/* Price */}
                  <td className='px-4 py-3 text-sm font-semibold text-admin-ink tabular-nums'>
                    {formatCurrency(product.price)}
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <span className='ml-2 text-xs text-admin-faint line-through'>
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                  </td>
                  {/* Stock */}
                  <td className='px-4 py-3 text-sm tabular-nums'>
                    <span
                      className={
                        product.available <= 0
                          ? "text-[var(--color-error)] font-bold"
                          : "text-admin-text"
                      }>
                      {product.available}
                    </span>
                    <span className='text-admin-faint text-xs'>
                      {" "}
                      / {product.stock}
                    </span>
                  </td>
                  {/* Status */}
                  <td className='px-4 py-3'>
                    <ProductStatusBadge isActive={product.isActive} />
                  </td>
                  {/* Date */}
                  <td className='px-4 py-3 text-xs text-admin-faint'>
                    {formatDate(product.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className='flex flex-col gap-3 md:hidden'>
        {products.map((product) => {
          const thumb = getPrimaryImage(product);
          return (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className='block border border-[var(--color-border)] bg-admin-surface p-4 no-underline transition-colors hover:bg-[var(--color-bg-subtle)]'>
              <div className='flex items-start gap-3'>
                {thumb ? (
                  <img
                    src={thumb}
                    alt={product.name}
                    className='size-12 object-cover border border-[var(--color-border)] shrink-0'
                  />
                ) : (
                  <div className='size-12 bg-[var(--color-bg-muted)] border border-[var(--color-border)] shrink-0 flex items-center justify-center'>
                    <span className='text-[8px] font-bold text-admin-faint uppercase'>
                      N/A
                    </span>
                  </div>
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-sm font-bold text-admin-ink truncate'>
                      {product.name}
                    </span>
                    <ProductStatusBadge isActive={product.isActive} />
                  </div>
                  <p className='text-[10px] text-admin-faint tracking-wide'>
                    {product.sku}
                  </p>
                </div>
              </div>
              <div className='mt-2 flex items-center justify-between text-xs text-admin-muted'>
                <span>{product.category}</span>
                <span className='font-semibold text-admin-ink tabular-nums'>
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className='mt-1 flex items-center justify-between text-xs text-admin-faint'>
                <span>
                  Stock: {product.available} / {product.stock}
                </span>
                <span>{formatDate(product.createdAt)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
