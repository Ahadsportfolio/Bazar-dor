import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/site";
import { requireSession } from "@/lib/auth-guard";
import { getMarketProduct } from "@/lib/market-api";

export const instant = false;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireSession(`/product/${encodeURIComponent(slug)}`);
  const product = await getMarketProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
