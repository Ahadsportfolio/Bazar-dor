import {
  categoryMeta,
  products as fallbackProducts,
  type Product,
} from "@/lib/data";

export type MarketCategory = {
  slug: string;
  label: string;
  icon: string;
  description: string;
};

const apiBases = [
  process.env.BAZARDOR_API_URL || "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
].filter((base, index, bases) => bases.indexOf(base) === index);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function firstValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const normalized = value
    .replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit)))
    .replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function asText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function unwrapList(payload: unknown, keys: string[]): unknown[] {
  if (Array.isArray(payload)) return payload;
  const record = asRecord(payload);
  if (!record) return [];
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value;
    const nested = asRecord(value);
    if (nested) {
      for (const nestedKey of keys) {
        if (Array.isArray(nested[nestedKey])) return nested[nestedKey] as unknown[];
      }
    }
  }
  return [];
}

async function fetchApi(path: string): Promise<unknown | null> {
  for (const base of apiBases) {
    try {
      const response = await fetch(`${base}${path}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      });
      if (response.ok) return await response.json();
    } catch {
      continue;
    }
  }
  return null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function categorySlug(value: unknown): string {
  const record = asRecord(value);
  const text = record
    ? asText(firstValue(record, ["slug", "key", "name", "title", "id"])) ?? ""
    : asText(value) ?? "";
  const known = Object.entries(categoryMeta).find(
    ([slug, meta]) => slug === text || meta.label === text
  );
  return (known?.[0] ?? slugify(text)) || "other";
}

function normalizeUnit(value: unknown, fallback: string) {
  const unit = asText(value);
  if (!unit) return fallback;
  if (unit.startsWith("প্রতি ")) return unit;
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    kilogram: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    l: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
  };
  return units[unit.toLowerCase()] ?? unit;
}

function marketRows(value: unknown): Product["bazarData"] {
  if (!Array.isArray(value)) return [];
  const rows = value.flatMap((item, index) => {
    const row = asRecord(item);
    if (!row) return [];
    const priceRecord = asRecord(firstValue(row, ["price", "prices"])) ?? row;
    const minimum = asNumber(firstValue(priceRecord, ["min", "minimum", "minPrice", "minimumPrice"]));
    const maximum = asNumber(firstValue(priceRecord, ["max", "maximum", "maxPrice", "maximumPrice"]));
    const average = asNumber(firstValue(priceRecord, ["avg", "average", "averagePrice", "current", "value"]))
      ?? asNumber(firstValue(row, ["price", "currentPrice", "todayPrice"]))
      ?? (minimum !== undefined && maximum !== undefined ? Math.round((minimum + maximum) / 2) : undefined);
    if (average === undefined) return [];
    const market = asText(firstValue(row, ["market", "bazar", "name", "title", "district"])) ?? `বাজার ${index + 1}`;
    return [{
      market,
      division: asText(firstValue(row, ["division", "region"])),
      price: average,
      min: minimum ?? average,
      max: maximum ?? average,
      avg: average,
    }];
  });
  return rows;
}

function normalizeProduct(value: unknown, index: number): Product | null {
  const record = asRecord(value);
  if (!record) return null;
  const idValue = firstValue(record, ["id", "_id", "productId"]);
  const id = asNumber(idValue) ?? index + 1;
  const sourceName = asText(firstValue(record, ["name", "nameBn", "title", "productName", "label"]));
  const fallback = fallbackProducts.find(
    (product) => product.id === id || product.name === sourceName
  ) ?? fallbackProducts[index % fallbackProducts.length];
  const name = sourceName ?? fallback.name;
  const category = categorySlug(firstValue(record, ["category", "categorySlug", "categoryName", "categoryId"])
    ?? fallback.category);
  const rawPrice = firstValue(record, ["price", "currentPrice", "today", "todayPrice", "priceToday", "averagePrice"]);
  const priceRecord = asRecord(rawPrice);
  const markets = firstValue(record, ["bazarData", "markets", "marketPrices", "bazars", "bazaars"]);
  const marketPrices = marketRows(markets);
  const price = asNumber(priceRecord
    ? firstValue(priceRecord, ["avg", "average", "current", "value", "price"])
    : rawPrice) ?? (marketPrices.length
      ? marketPrices.reduce((sum, row) => sum + row.price, 0) / marketPrices.length
      : fallback.price);
  const rows = marketPrices.length ? marketPrices : [{
    market: "ঢাকা",
    price,
    min: price,
    max: price,
    avg: price,
  }];
  const rawChange = firstValue(record, ["change", "changePercent", "priceChange", "percentageChange", "change_percentage"]);
  const changeRecord = asRecord(rawChange);
  const changeValue = asNumber(
    changeRecord ? firstValue(changeRecord, ["pct", "percent", "percentage", "value"]) : rawChange,
  ) ?? fallback.change;
  const direction = asText(changeRecord ? firstValue(changeRecord, ["dir", "direction"]) : undefined)
    ?.toLowerCase();
  const change = direction === "down"
    ? -Math.abs(changeValue)
    : direction === "up"
      ? Math.abs(changeValue)
      : direction === "flat"
        ? 0
        : changeValue;
  const slug = asText(firstValue(record, ["slug", "urlSlug"]))
    ?? (typeof idValue === "string" || typeof idValue === "number" ? String(idValue) : fallback.slug);
  const emoji = asText(firstValue(record, ["emoji", "icon"])) ?? fallback.emoji;
  const suppliedTags = firstValue(record, ["tags", "categoryTags"]);
  const tags = Array.isArray(suppliedTags)
    ? suppliedTags.filter((tag): tag is string => typeof tag === "string")
    : fallback.tags;
  const history = asRecord(firstValue(record, ["history", "priceHistory", "historicalPrices"]));
  const priceHistory = {
    yesterday:
      asNumber(firstValue(record, ["yesterday", "priceYesterday", "previousDayPrice"])) ??
      (history ? asNumber(firstValue(history, ["yesterday", "day", "previousDay"])) : undefined),
    lastWeek:
      asNumber(firstValue(record, ["lastWeek", "priceLastWeek", "weekAgoPrice"])) ??
      (history ? asNumber(firstValue(history, ["lastWeek", "week", "weekAgo"])) : undefined),
    lastMonth:
      asNumber(firstValue(record, ["lastMonth", "priceLastMonth", "monthAgoPrice"])) ??
      (history ? asNumber(firstValue(history, ["lastMonth", "month", "monthAgo"])) : undefined),
  };

  return {
    id,
    slug,
    name,
    category,
    unit: normalizeUnit(firstValue(record, ["unit", "unitName", "measurement"]), fallback.unit),
    emoji,
    price: Math.round(price),
    change,
    description: asText(firstValue(record, ["description", "summary", "details"])) ?? fallback.description,
    tags,
    ...(Object.values(priceHistory).some((value) => value !== undefined) ? { priceHistory } : {}),
    bazarData: rows,
  };
}

function normalizeCategory(value: unknown): MarketCategory | null {
  const record = asRecord(value);
  if (!record) return null;
  const slug = categorySlug(firstValue(record, ["slug", "key", "id", "name", "title"]));
  const fallback = categoryMeta[slug];
  const label = asText(firstValue(record, ["label", "name", "title", "nameBn"])) ?? fallback?.label;
  if (!label) return null;
  return {
    slug,
    label,
    icon: asText(firstValue(record, ["icon", "emoji"])) ?? fallback?.icon ?? "📦",
    description: asText(firstValue(record, ["description", "summary"])) ?? fallback?.description ?? "",
  };
}

export async function getMarketProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const payload = await fetchApi(`/products${query}`);
  const remoteProducts = unwrapList(payload, ["data", "products", "results", "items"])
    .map(normalizeProduct)
    .filter((product): product is Product => product !== null);
  if (remoteProducts.length) return remoteProducts;
  return category
    ? fallbackProducts.filter((product) => product.category === category)
    : fallbackProducts;
}

export async function getMarketProduct(slug: string): Promise<Product | undefined> {
  const products = await getMarketProducts();
  const match = products.find((product) => product.slug === slug || String(product.id) === slug);
  if (match) return match;

  const payload = await fetchApi(`/products/${encodeURIComponent(slug)}`);
  const candidate = asRecord(payload);
  const product = normalizeProduct(candidate?.data ?? payload, 0);
  return product && (product.slug === slug || String(product.id) === slug)
    ? product
    : undefined;
}

export async function getMarketCategories(): Promise<MarketCategory[]> {
  const payload = await fetchApi("/categories");
  const categories = unwrapList(payload, ["data", "categories", "results", "items"])
    .map(normalizeCategory)
    .filter((category): category is MarketCategory => category !== null);
  if (categories.length) return categories;
  return Object.entries(categoryMeta).map(([slug, category]) => ({ slug, ...category }));
}

export async function getMarketCategory(slug: string): Promise<MarketCategory | undefined> {
  const payload = await fetchApi(`/categories/${encodeURIComponent(slug)}`);
  const candidate = asRecord(payload);
  const category = normalizeCategory(candidate?.data ?? payload);
  if (category?.slug === slug) return category;
  const categories = await getMarketCategories();
  return categories.find((item) => item.slug === slug);
}
