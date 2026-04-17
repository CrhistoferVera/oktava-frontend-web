import type {
  OrderSummary,
  Product,
  ProductCategory,
} from "@/types/storefront.types";

const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: string;
  price: number | null;
  isAvailable: boolean;
}

export const storefrontService = {
  async getCategories(): Promise<ProductCategory[]> {
    const data = await apiFetch<ApiCategory[]>("/categories");
    return data.map((c) => ({
      id: c.id,
      slug: c.slug,
      label: c.name,
    }));
  },

  async getProducts(): Promise<Product[]> {
    const data = await apiFetch<ApiProduct[]>("/products");
    return data
      .filter((p) => p.isAvailable)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        categoryId: p.categoryId,
        price: p.price,
      }));
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.slice(0, 3);
  },

  async getOrderSummaries(): Promise<OrderSummary[]> {
    return [];
  },
};
