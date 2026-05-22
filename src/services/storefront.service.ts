import type {
  OrderSummary,
  Product,
  ProductCategory,
  StorefrontOptionGroup,
  StorefrontOptionItem,
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

interface ApiOptionItem {
  id: string;
  name: string;
  extraPrice: number;
  isAvailable: boolean;
  sortOrder: number;
  imageUrl: string | null;
}

interface ApiOptionGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  sortOrder: number;
  options: ApiOptionItem[];
}

interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  includes: string | null;
  imageUrl: string | null;
  categoryId: string;
  price: number | null;
  isAvailable: boolean;
  optionGroups: ApiOptionGroup[];
}

function mapOptionItem(o: ApiOptionItem): StorefrontOptionItem {
  return { id: o.id, name: o.name, extraPrice: o.extraPrice, isAvailable: o.isAvailable, imageUrl: o.imageUrl ?? null };
}

function mapOptionGroup(g: ApiOptionGroup): StorefrontOptionGroup {
  return {
    id: g.id,
    name: g.name,
    isRequired: g.isRequired,
    minSelections: g.minSelections,
    maxSelections: g.maxSelections,
    options: g.options.filter((o) => o.isAvailable).map(mapOptionItem),
  };
}

export const storefrontService = {
  async getCategories(): Promise<ProductCategory[]> {
    const data = await apiFetch<ApiCategory[]>("/categories");
    return data.map((c) => ({ id: c.id, slug: c.slug, label: c.name }));
  },

  async getProducts(): Promise<Product[]> {
    const data = await apiFetch<ApiProduct[]>("/products");
    return data
      .filter((p) => p.isAvailable)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        includes: p.includes,
        imageUrl: p.imageUrl,
        categoryId: p.categoryId,
        price: p.price,
        optionGroups: (p.optionGroups ?? []).map(mapOptionGroup),
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
