import { ProductCategory, ProductStatus } from '@/types/product.types';
import { CreateProductFormFields } from '@/types/product-form.types';

export const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'pollos', label: 'Pollos' },
  { value: 'guarniciones', label: 'Guarniciones' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'postres', label: 'Postres' },
];

export const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];

export const INITIAL_FORM_FIELDS: CreateProductFormFields = {
  name: '',
  description: '',
  category: 'pollos',
  price: '',
  stock: '',
  status: 'active',
  imageUrl: '',
  margin: '',
};
