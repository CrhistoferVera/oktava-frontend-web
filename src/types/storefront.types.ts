export type ProductCategoryId =
  | "combos"
  | "pollos"
  | "guarniciones"
  | "bebidas"
  | "postres";

export type ProductFilterCategory = ProductCategoryId | "all";

export type ProductBadge = "Popular" | "Nuevo";

export interface ProductCategory {
  id: ProductCategoryId;
  label: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: ProductCategoryId;
  price: number;
  imageUrl: string;
  prepTimeMinutes: number;
  badge?: ProductBadge;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export interface OrderSummary {
  id: string;
  code: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
