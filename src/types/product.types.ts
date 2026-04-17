// ─── Category ─────────────────────────────────────────────────────────────────
// Shape returned by GET /categories
export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
};

// ─── Product ──────────────────────────────────────────────────────────────────
// Shape returned by GET /products and GET /products/:id
// Aligns exactly with backend mapProduct() response.
export type ProductStatus = 'active' | 'inactive';

export type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: string;
  category: string | null; // display name from DB (e.g. "Pollos")
  price: number | null;    // from base ProductVariant; null if no variant exists
  status: ProductStatus;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Category admin ───────────────────────────────────────────────────────────
// Shape returned by GET /categories/admin (includes inactive + productCount)
export type CategoryAdminItem = Category & { productCount: number };

export type CategoryPayload = {
  name: string;
  imageUrl?: string;
};

export type UpdateCategoryPayload = {
  name?: string;
  isActive?: boolean;
  imageUrl?: string;
};

// ─── Filter ───────────────────────────────────────────────────────────────────
// 'all' or a category UUID — avoids coupling to DB slugs
export type ProductFilterCategory = 'all' | (string & {});
