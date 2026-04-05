import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useProducts, useCategories, useBrands } from "../hooks/useProducts";
import { ProductsTable } from "../components/ProductsTable";
import { ROUTES } from "@/config";

const ACTIVE_FILTERS: { label: string; value: boolean | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

export function ProductsPage() {
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sortBy, setSortBy] = useState<
    "price" | "name" | "createdAt" | "avgRating"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const categories = categoriesData ?? [];
  const brands = brandsData ?? [];

  const { data, isLoading, isError } = useProducts({
    page,
    limit: 15,
    isActive,
    search: search || undefined,
    category: category || undefined,
    brand: brand || undefined,
    sortBy,
    sortOrder,
  });

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <>
      <Helmet>
        <title>Products — Atomic Admin</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-[var(--color-border)] pb-6'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-admin-ink md:text-3xl'>
              Products
            </h1>
            <p className='mt-1 text-sm text-admin-muted'>
              Manage your product catalog · {total} product
              {total !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to={ROUTES.PRODUCT_CREATE}
            className='btn btn-primary inline-flex items-center gap-2 no-underline'>
            <Plus size={16} />
            <span className='hidden sm:inline'>Add Product</span>
          </Link>
        </div>

        {/* Filters */}
        <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
          {/* Search */}
          <div className='relative flex-1 sm:max-w-xs'>
            <Search
              size={16}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-admin-faint'
            />
            <input
              type='text'
              placeholder='Search products...'
              className='input-field pl-9'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Status pills */}
          <div className='flex flex-wrap gap-1'>
            {ACTIVE_FILTERS.map((f) => (
              <button
                key={String(f.value)}
                type='button'
                onClick={() => {
                  setIsActive(f.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  isActive === f.value
                    ? "bg-admin-bg text-admin-ink"
                    : "bg-[var(--color-bg-muted)] text-admin-muted hover:text-admin-ink"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns row */}
        <div className='mt-3 flex flex-wrap gap-2'>
          {/* Category filter */}
          {categories.length > 0 && (
            <select
              className='input-field text-xs py-1.5 px-3 w-auto'
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}>
              <option value=''>All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Brand filter */}
          {brands.length > 0 && (
            <select
              className='input-field text-xs py-1.5 px-3 w-auto'
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setPage(1);
              }}>
              <option value=''>All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}

          {/* Sort */}
          <select
            className='input-field text-xs py-1.5 px-3 w-auto'
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split("-");
              setSortBy(sb as typeof sortBy);
              setSortOrder(so as typeof sortOrder);
              setPage(1);
            }}>
            <option value='createdAt-desc'>Newest First</option>
            <option value='createdAt-asc'>Oldest First</option>
            <option value='name-asc'>Name A–Z</option>
            <option value='name-desc'>Name Z–A</option>
            <option value='price-asc'>Price: Low → High</option>
            <option value='price-desc'>Price: High → Low</option>
            <option value='avgRating-desc'>Top Rated</option>
          </select>
        </div>

        {/* Content */}
        <div className='mt-6'>
          {isLoading ? (
            <div className='border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
              <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
                Loading products…
              </p>
            </div>
          ) : isError ? (
            <div className='border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
              <p className='text-sm font-semibold text-[var(--color-error)]'>
                Failed to load products. Please try again.
              </p>
            </div>
          ) : (
            <ProductsTable products={products} />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4'>
            <p className='text-xs text-admin-faint'>
              Page {page} of {totalPages}
            </p>
            <div className='flex gap-2'>
              <button
                type='button'
                className='btn btn-secondary'
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} />
                <span className='hidden sm:inline'>Prev</span>
              </button>
              <button
                type='button'
                className='btn btn-secondary'
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}>
                <span className='hidden sm:inline'>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
