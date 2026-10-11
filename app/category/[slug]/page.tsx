import { notFound } from "next/navigation";
import { CategoryPageClient } from "@/components/site";
import { getMarketCategories, getMarketCategory, getMarketProducts } from "@/lib/market-api";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    getMarketCategory(slug),
    getMarketProducts(slug),
    getMarketCategories(),
  ]);

  if (!category || products.length === 0) {
    notFound();
  }

  return (
    <CategoryPageClient
      category={slug}
      products={products}
      categoryInfo={category}
      categories={categories}
    />
  );
}
