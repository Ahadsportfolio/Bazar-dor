import { HomePageClient } from "@/components/site";
import { getMarketCategories, getMarketProducts } from "@/lib/market-api";

export default async function Home() {
  const [marketProducts, categories] = await Promise.all([
    getMarketProducts(),
    getMarketCategories(),
  ]);

  return <HomePageClient marketProducts={marketProducts} categories={categories} />;
}
