export type ProductCategory = 'pollos' | 'guarniciones' | 'bebidas' | 'postres';

export type ProductStatus = 'active' | 'inactive';

export type ProductFilterCategory = ProductCategory | 'all';

export type Product = {
  margin: number;
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl: string;
}