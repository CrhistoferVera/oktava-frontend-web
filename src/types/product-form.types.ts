import { ProductStatus } from './product.types';

export type ProductFormMode = 'create' | 'edit';

// What the form fields hold internally (all strings for controlled inputs)
export type CreateProductFormFields = {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  status: ProductStatus;
  imageUrl: string;
};

// What gets sent to the backend (POST /products or PATCH /products/:id)
// stock and margin do not exist in the backend schema — omitted intentionally.
export type CreateProductPayload = {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean; // derived from status: 'active' → true, 'inactive' → false
};

export type CreateProductFormErrors = {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: string;
  status?: string;
  imageUrl?: string;
};
