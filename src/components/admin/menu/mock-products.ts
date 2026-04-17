import { Product } from "@/types/product.types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Pollo a la Brasa Clásico",
    description: "Pollo entero crocante con receta especial de la casa.",
    category: "Pollos",
    categoryId: "cat-pollos",
    price: 98,
    status: "active",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "1/4 de Pollo",
    description: "Porción personal acompañada de guarnición a elección.",
    category: "Pollos",
    categoryId: "cat-pollos",
    price: 32,
    status: "active",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=1200&auto=format&fit=crop",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Papas Fritas Familiares",
    description: "Papas crujientes ideales para compartir.",
    category: "Guarniciones",
    categoryId: "cat-guarniciones",
    price: 18,
    status: "active",
    isAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1200&auto=format&fit=crop",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Inca Kola 2L",
    description: "Bebida gaseosa tradicional peruana.",
    category: "Bebidas",
    categoryId: "cat-bebidas",
    price: 14,
    status: "inactive",
    isAvailable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];
