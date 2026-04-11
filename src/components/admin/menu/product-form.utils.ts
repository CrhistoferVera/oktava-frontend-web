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

  if (!fields.category) {
    errors.category = 'La categoría es obligatoria.';
  }

  if (!fields.price.trim()) {
    errors.price = 'El precio es obligatorio.';
  } else if (Number(fields.price) <= 0) {
    errors.price = 'El precio debe ser mayor que 0.';
  }

  if (!fields.stock.trim()) {
    errors.stock = 'El stock es obligatorio.';
  } else if (Number(fields.stock) < 0) {
    errors.stock = 'El stock no puede ser negativo.';
  }

  if (!fields.status) {
    errors.status = 'El estado es obligatorio.';
  }

  if (!fields.imageUrl.trim()) {
    errors.imageUrl = 'La URL de imagen es obligatoria.';
  }

  if (!fields.margin.trim()) {
    errors.margin = 'El margen es obligatorio.';
  } else if (Number(fields.margin) < 0) {
    errors.margin = 'El margen no puede ser negativo.';
  }

  return errors;
}

export function productToFormFields(product: Product): CreateProductFormFields {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    price: String(product.price),
    stock: String(product.stock),
    status: product.status,
    imageUrl: product.imageUrl,
    margin: String(product.margin),
  };
}
