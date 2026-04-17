export type ProductFilterCategory = string;

export type ProductBadge = "Popular" | "Nuevo";

export interface ProductCategory {
  id: string;
  slug: string;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  price: number | null;
  imageUrl: string | null;
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
