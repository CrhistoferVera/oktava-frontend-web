import { MenuCatalog } from "@/components/client/menu/menu-catalog";
import { storefrontService } from "@/services/storefront.service";

export default async function ClientMenuPage() {
  const [categories, products] = await Promise.all([
    storefrontService.getCategories(),
    storefrontService.getProducts(),
  ]);

  return <MenuCatalog categories={categories} products={products} />;
}
