import { api } from '@/lib/axios';
import {
  Category,
  CategoryAdminItem,
  CategoryPayload,
  Product,
  UpdateCategoryPayload,
} from '@/types/product.types';
import { CreateProductPayload } from '@/types/product-form.types';

export const productService = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<{ url: string }>('/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
  },

  getProducts: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/products');
    return data;
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },

  getAllCategoriesAdmin: async (): Promise<CategoryAdminItem[]> => {
    const { data } = await api.get<CategoryAdminItem[]>('/categories/admin');
    return data;
  },

  createCategory: async (payload: CategoryPayload): Promise<Category> => {
    const { data } = await api.post<Category>('/categories', payload);
    return data;
  },

  updateCategory: async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<Category> => {
    const { data } = await api.patch<Category>(`/categories/${id}`, payload);
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const { data } = await api.post<Product>('/products', payload);
    return data;
  },

  updateProduct: async (
    id: string,
    payload: Partial<CreateProductPayload>,
  ): Promise<Product> => {
    const { data } = await api.patch<Product>(`/products/${id}`, payload);
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
