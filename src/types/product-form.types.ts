import { ProductCategory, ProductStatus } from './product.types';

export type ProductFormMode = 'create' | 'edit';

export type CreateProductPayload = {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl: string;
  margin: number;
};

export type CreateProductFormErrors = {
  name?: string;
  description?: string;
  category?: string;
  price?: string;
  stock?: string;
  status?: string;
  imageUrl?: string;
  margin?: string;
};

export type CreateProductFormFields = {
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  stock: string;
  status: ProductStatus;
  imageUrl: string;
  margin: string;
};
