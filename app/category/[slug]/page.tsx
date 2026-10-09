import { notFound } from "next/navigation";
import { CategoryPageClient } from "@/components/site";
import { categoryMeta, getProductsByCategory } from "@/lib/data";

export async function generateStaticParams() {
  return Object.keys(categoryMeta).map((slug) => ({ slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = getProductsByCategory(slug);

  if (!categoryMeta[slug] || products.length === 0) {
    notFound();
  }

  return <CategoryPageClient category={slug} products={products} />;
}
