import { HomeCategoryStrip } from "@/components/client/home/home-category-strip";
import { HomeFeaturedProducts } from "@/components/client/home/home-featured-products";
import { HomeHero } from "@/components/client/home/home-hero";
import { HomeValuePillars } from "@/components/client/home/home-value-pillars";
import { storefrontService } from "@/services/storefront.service";

export default async function PublicHomePage() {
  const [categories, featuredProducts] = await Promise.all([
    storefrontService.getCategories(),
    storefrontService.getFeaturedProducts(),
  ]);

  return (
    <div className="space-y-10">
      <HomeHero />
      <HomeCategoryStrip categories={categories} />
      <HomeFeaturedProducts products={featuredProducts} />
      <HomeValuePillars />
    </div>
  );
}
