import { Product } from '@/types/product.types';
import { CreateProductFormErrors, CreateProductFormFields } from '@/types/product-form.types';

export function validateProductForm(
  fields: CreateProductFormFields,
): CreateProductFormErrors {
  const errors: CreateProductFormErrors = {};

  if (!fields.name.trim()) {
    errors.name = 'El nombre es obligatorio.';
  }

  if (!fields.description.trim()) {
    errors.description = 'La descripción es obligatoria.';
  }

  if (!fields.categoryId) {
    errors.categoryId = 'La categoría es obligatoria.';
  }

  if (!fields.price.trim()) {
    errors.price = 'El precio es obligatorio.';
  } else if (Number(fields.price) <= 0) {
    errors.price = 'El precio debe ser mayor que 0.';
  }

  if (!fields.status) {
    errors.status = 'El estado es obligatorio.';
  }

  if (!fields.imageUrl.trim()) {
    errors.imageUrl = 'La URL de imagen es obligatoria.';
  }

  return errors;
}

export function productToFormFields(product: Product): CreateProductFormFields {
  return {
    name: product.name,
    description: product.description ?? '',
    categoryId: product.categoryId,
    price: String(product.price ?? ''),
    status: product.status,
    imageUrl: product.imageUrl ?? '',
  };
}
