import type {
  OrderSummary,
  Product,
  ProductCategory,
} from "@/types/storefront.types";

export const storefrontCategories: ProductCategory[] = [
  {
    id: "combos",
    slug: "combos",
    label: "Combos",
    description: "Packs para compartir y resolver la comida completa.",
  },
  {
    id: "pollos",
    slug: "pollos",
    label: "Pollos",
    description: "Cortes y porciones con la receta signature Oktava.",
  },
  {
    id: "guarniciones",
    slug: "guarniciones",
    label: "Guarniciones",
    description: "Acompanamientos crocantes y de alta rotacion.",
  },
  {
    id: "bebidas",
    slug: "bebidas",
    label: "Bebidas",
    description: "Refrescos frios para cualquier pedido.",
  },
  {
    id: "postres",
    slug: "postres",
    label: "Postres",
    description: "Cierre dulce para el combo perfecto.",
  },
];

export const storefrontProducts: Product[] = [
  {
    id: "combo-1",
    name: "Combo Fuego Oktava",
    description: "Pollo entero, papas familiares y 2 bebidas de 1L.",
    includes: null,
    categoryId: "combos",
    price: 129,
    badge: "Popular",
    imageUrl:
      "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=1600&auto=format&fit=crop",
    optionGroups: [],
  },
  {
    id: "combo-2",
    name: "Combo Doble Crunch",
    description: "Medio pollo, alitas crispy, papas medianas y 2 salsas.",
    includes: null,
    categoryId: "combos",
    price: 94,
    imageUrl:
      "https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=1600&auto=format&fit=crop",
    optionGroups: [],
  },
  {
    id: "pollo-1",
    name: "Pollo Entero Premium",
    description: "Asado a lena con costra especiada y jugoso por dentro.",
    includes: null,
    categoryId: "pollos",
    price: 98,
    badge: "Popular",
    imageUrl:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1600&auto=format&fit=crop",
    optionGroups: [],
  },
  {
    id: "pollo-2",
    name: "Cuarto de Pollo",
    description: "Porcion individual con sabor ahumado y piel crocante.",
    includes: null,
    categoryId: "pollos",
    price: 36,
    imageUrl:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1600&auto=format&fit=crop",
    optionGroups: [],
  },
  {
    id: "side-1",
    name: "Papas Rusticas",
    description: "Corte grueso, doradas y sazonadas con paprika.",
    includes: null,
    categoryId: "guarniciones",
    price: 22,
    badge: "Nuevo",
    imageUrl:
      "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1600&auto=format&fit=crop",
    optionGroups: [],
  },
  {
    id: "side-2",
    name: "Ensalada Fresh Mix",
    description: "Mix verde con tomate cherry y aderezo citrico.",
    includes: null,
    categoryId: "guarniciones",
    price: 19,
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop",
    optionGroups: [],
  },
  {
    id: "drink-1",
    name: "Inca Kola 2L",
    description: "Clasico refresco peruano para pedidos familiares.",
    includes: null,
    categoryId: "bebidas",
    price: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1629203432180-71e9b85f49ff?q=80&w=1600&auto=format&fit=crop",
    optionGroups: [],
  },
  {
    id: "drink-2",
    name: "Limonada de la Casa",
    description: "Limon natural con hielo molido y toque de hierbabuena.",
    includes: null,
    categoryId: "bebidas",
    price: 12,
    badge: "Nuevo",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1600&auto=format&fit=crop",
    optionGroups: [],
  },
  {
    id: "dessert-1",
    name: "Brownie de Cacao",
    description: "Brownie tibio con centro suave y topping de chocolate.",
    includes: null,
    categoryId: "postres",
    price: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1600&auto=format&fit=crop",
    optionGroups: [],
  },
];

export const featuredProductIds = ["combo-1", "pollo-1", "side-1"];

export const mockOrderSummaries: OrderSummary[] = [];
