import { ProductStatus } from './product.types';

export type ProductFormMode = 'create' | 'edit';

// ─── OptionGroup / Option form state (strings for controlled inputs) ───────────
export type OptionFormItem = {
  _key: string; // stable React key, never sent to backend
  name: string;
  extraPrice: string;
  isAvailable: boolean;
};

export type OptionGroupFormField = {
  _key: string; // stable React key, never sent to backend
  name: string;
  isRequired: boolean;
  minSelections: string;
  maxSelections: string;
  sortOrder: string;
  options: OptionFormItem[];
};

// ─── Form fields ──────────────────────────────────────────────────────────────
// What the form fields hold internally (all strings for controlled inputs)
export type CreateProductFormFields = {
  name: string;
  description: string;
  includes: string;
  categoryId: string;
  price: string;
  status: ProductStatus;
  imageUrl: string;
  optionGroups: OptionGroupFormField[];
};

// ─── Payloads sent to the backend ─────────────────────────────────────────────
export type CreateOptionPayload = {
  name: string;
  extraPrice?: number;
  isAvailable: boolean;
};

export type CreateOptionGroupPayload = {
  name: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  sortOrder: number;
  options: CreateOptionPayload[];
};

export type CreateProductPayload = {
  name: string;
  description?: string;
  includes?: string;
  categoryId: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  optionGroups?: CreateOptionGroupPayload[];
};

// ─── Form errors ──────────────────────────────────────────────────────────────
export type CreateProductFormErrors = {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: string;
  status?: string;
  imageUrl?: string;
};
