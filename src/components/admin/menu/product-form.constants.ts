import { ProductStatus } from '@/types/product.types';
import { CreateProductFormFields } from '@/types/product-form.types';

export const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];

export const INITIAL_FORM_FIELDS: CreateProductFormFields = {
  name: '',
  description: '',
  categoryId: '',
  price: '',
  status: 'active',
  imageUrl: '',
};
