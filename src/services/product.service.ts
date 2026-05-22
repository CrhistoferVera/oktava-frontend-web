import { api } from '@/lib/axios';
import {
  Category,
  CategoryAdminItem,
  CategoryPayload,
  OptionGroup,
  OptionItem,
  Product,
  UpdateCategoryPayload,
} from '@/types/product.types';
import {
  CreateOptionGroupPayload,
  CreateOptionPayload,
  CreateProductPayload,
} from '@/types/product-form.types';

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
    const { data } = await api.get<Product[]>('/products/admin');
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

  toggleProductStatus: async (id: string, isAvailable: boolean): Promise<Product> => {
    const { data } = await api.patch<Product>(`/products/${id}`, { isAvailable });
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  permanentlyDeleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}/permanently`);
  },

  // ─── OptionGroups ──────────────────────────────────────────────────────────

  createOptionGroup: async (
    productId: string,
    payload: CreateOptionGroupPayload,
  ): Promise<OptionGroup> => {
    const { data } = await api.post<OptionGroup>(
      `/products/${productId}/option-groups`,
      payload,
    );
    return data;
  },

  updateOptionGroup: async (
    groupId: string,
    payload: Partial<CreateOptionGroupPayload>,
  ): Promise<OptionGroup> => {
    const { data } = await api.patch<OptionGroup>(`/option-groups/${groupId}`, payload);
    return data;
  },

  deleteOptionGroup: async (groupId: string): Promise<void> => {
    await api.delete(`/option-groups/${groupId}`);
  },

  // ─── Options ───────────────────────────────────────────────────────────────

  createOption: async (
    groupId: string,
    payload: CreateOptionPayload,
  ): Promise<OptionItem> => {
    const { data } = await api.post<OptionItem>(
      `/option-groups/${groupId}/options`,
      payload,
    );
    return data;
  },

  updateOption: async (
    groupId: string,
    optionId: string,
    payload: Partial<CreateOptionPayload>,
  ): Promise<OptionItem> => {
    const { data } = await api.patch<OptionItem>(
      `/option-groups/${groupId}/options/${optionId}`,
      payload,
    );
    return data;
  },

  deleteOption: async (groupId: string, optionId: string): Promise<void> => {
    await api.delete(`/option-groups/${groupId}/options/${optionId}`);
  },
};
