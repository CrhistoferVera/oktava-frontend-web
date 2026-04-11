import { Product } from "@/types/product.types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Pollo a la Brasa Clásico",
    description: "Pollo entero crocante con receta especial de la casa.",
    category: "pollos",
    margin: 35,
    price: 98,
    stock: 12,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "1/4 de Pollo",
    description: "Porción personal acompañada de guarnición a elección.",
    category: "pollos",
    margin: 28,
    price: 32,
    stock: 20,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Papas Fritas Familiares",
    description: "Papas crujientes ideales para compartir.",
    category: "guarniciones",
    margin: 22,
    price: 18,
    stock: 15,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Inca Kola 2L",
    description: "Bebida gaseosa tradicional peruana.",
    category: "bebidas",
    margin: 18,
    price: 14,
    stock: 9,
    status: "inactive",
    imageUrl:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop",
  },
];
