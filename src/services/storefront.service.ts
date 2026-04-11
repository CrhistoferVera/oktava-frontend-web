import {
  featuredProductIds,
  mockOrderSummaries,
  storefrontCategories,
  storefrontProducts,
} from "@/mocks/storefront.mock";
import type {
  OrderSummary,
  Product,
  ProductCategory,
} from "@/types/storefront.types";

export const storefrontService = {
  async getCategories(): Promise<ProductCategory[]> {
    return storefrontCategories;
  },

  async getProducts(): Promise<Product[]> {
    return storefrontProducts;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    return storefrontProducts.filter((product) =>
      featuredProductIds.includes(product.id),
    );
  },

  async getOrderSummaries(): Promise<OrderSummary[]> {
    return mockOrderSummaries;
  },
};
