export type ProductBadge = "Popular" | "Nuevo";

export interface ProductCategory {
  id: string;
  slug: string;
  label: string;
  imageUrl: string | null;
  description?: string;
}

// ─── Option groups (storefront read model) ────────────────────────────────────

export interface StorefrontOptionItem {
  id: string;
  name: string;
  extraPrice: number;
  isAvailable: boolean;
  imageUrl: string | null;
}

export interface StorefrontOptionGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  options: StorefrontOptionItem[];
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string | null;
  includes: string | null;
  categoryId: string;
  price: number | null;
  imageUrl: string | null;
  badge?: ProductBadge;
  optionGroups: StorefrontOptionGroup[];
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface SelectedOptionItem {
  optionId: string;
  name: string;
  extraPrice: number;
}

export interface SelectedOptionGroup {
  groupId: string;
  groupName: string;
  items: SelectedOptionItem[];
}

export interface CartItem {
  /** Stable unique key per line. For products without options: equals product.id. */
  _cartId: string;
  product: Product;
  quantity: number;
  selectedOptions: SelectedOptionGroup[];
  /** Sum of extraPrice for all selected options. */
  extraPrice: number;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export interface OrderSummary {
  id: string;
  code: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
