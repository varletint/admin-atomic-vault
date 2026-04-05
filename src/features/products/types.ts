/* ── Product Types (synced with backend ProductWithStock + IProduct model) ── */

export interface ProductImage {
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  variantOptions: VariantOption[];
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  weight?: number;
  images?: ProductImage[];
  isActive: boolean;
}

export interface ProductSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
  unit: "cm" | "in";
}

export interface Product {
  _id: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  category: string;
  brand?: string;
  tags: string[];
  productType: "physical" | "digital" | "service";
  images: ProductImage[];
  hasVariants: boolean;
  variants: ProductVariant[];
  variantOptionNames: string[];
  weight?: number;
  weightUnit: "g" | "kg" | "lb" | "oz";
  dimensions?: Dimensions;
  material?: string;
  careInstructions?: string;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  minOrderQty: number;
  seo?: ProductSeo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /* Inventory aggregates (from ProductWithStock) */
  stock: number;
  reserved: number;
  available: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  tag?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price" | "name" | "createdAt" | "avgRating";
  sortOrder?: "asc" | "desc";
}
