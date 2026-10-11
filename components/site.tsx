"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, ChevronDown, Menu, ShoppingCart, UserCircle2, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  categoryMeta,
  formatBanglaCurrency,
  formatBanglaNumber,
  getCategoryList,
  getChangeBadge,
  getChangeClass,
  products,
  type Product,
} from "@/lib/data";
import type { MarketCategory } from "@/lib/market-api";

const subscribeToNothing = () => () => {};
const getBanglaDate = () => new Date().toLocaleDateString("bn-BD");
const getServerBanglaDate = () => "";

function ProductCard({ product }: { product: Product }) {
  const badgeClass = getChangeClass(product.change);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl shadow-inner">
          {product.emoji}
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
          {getChangeBadge(product.change)}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-500">{product.unit}</p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
            আজকের দাম
          </p>
          <p className="mt-1 text-xl font-extrabold text-slate-900">
            {formatBanglaCurrency(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function SiteFrame({
  children,
  marketProducts = products,
  categories = getCategoryList(),
}: {
  children: React.ReactNode;
  marketProducts?: Product[];
  categories?: MarketCategory[];
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const tickerItems = marketProducts.slice(0, 8);
  const banglaDate = useSyncExternalStore(
    subscribeToNothing,
    getBanglaDate,
    getServerBanglaDate
  );

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে লগ আউট হয়েছে।");
        },
        onError: (context) => {
          toast.error(context.error.message || "লগ আউট করা যায়নি।");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Toaster position="top-right" />
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl text-emerald-700 shadow-sm">
                <ShoppingCart size={18} />
              </div>
              <div>
                <p className="text-xl font-black leading-none">বাজার দর</p>
                <p suppressHydrationWarning className="text-[11px] text-slate-500">{banglaDate}</p>
              </div>
            </Link>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              aria-expanded={mobileMenuOpen}
              aria-controls="category-navigation"
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav
            id="category-navigation"
            aria-label="পণ্যের ক্যাটাগরি"
            className={`mt-3 ${mobileMenuOpen ? "flex" : "hidden"} gap-2 overflow-x-auto pb-1 md:flex md:justify-center`}
          >
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    pathname === `/category/${category.slug}`
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {category.icon} {category.label}
                </Link>
              ))}
          </nav>

          <div className="mt-3 flex items-center justify-end gap-2">
              {isPending ? (
                <div className="h-9 w-24 animate-pulse rounded-full bg-slate-200" />
              ) : user ? (
                <>
                  <Link
                    href="/profile"
                    className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:border-emerald-200 hover:text-emerald-700 sm:flex"
                  >
                    <UserCircle2 size={16} className="text-emerald-600" />
                    {user.name || user.email}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-rose-200 hover:text-rose-600"
                  >
                    সাইন আউট
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
                  >
                    সাইন ইন
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                  >
                    সাইন আপ
                  </Link>
                </>
              )}
          </div>

          <div className="mt-3 overflow-hidden rounded-full border border-emerald-100 bg-emerald-50 py-2">
            <div className="marquee-track flex items-center gap-6 whitespace-nowrap text-sm font-medium text-slate-700">
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div key={`${item.slug}-${idx}`} className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                  <span className="text-slate-500">{formatBanglaCurrency(item.price)} / {item.unit}</span>
                  <span className={item.change > 0 ? "text-rose-600" : item.change < 0 ? "text-emerald-600" : "text-slate-500"}>
                    {item.change > 0 ? "▲" : item.change < 0 ? "▼" : "—"} {formatBanglaNumber(Math.abs(item.change))}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-slate-700">বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
        </div>
      </footer>
    </div>
  );
}

export function HomePageClient({
  marketProducts = products,
  categories = getCategoryList(),
}: {
  marketProducts?: Product[];
  categories?: MarketCategory[];
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const topRisers = useMemo(
    () => marketProducts.filter((product) => product.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 6),
    [marketProducts]
  );
  const topFallers = useMemo(
    () => marketProducts.filter((product) => product.change < 0)
      .sort((a, b) => a.change - b.change)
      .slice(0, 6),
    [marketProducts]
  );

  return (
    <SiteFrame marketProducts={marketProducts} categories={categories}>
      <section className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <div className="grid items-center gap-8 rounded-4xl bg-linear-to-br from-emerald-600 to-emerald-500 p-8 text-white shadow-lg md:grid-cols-2 lg:p-12">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-50">
              বাজারের সেরা দর
            </p>
            <h1 className="max-w-xl text-4xl font-black leading-tight md:text-5xl">
              আপনার দরকারি পণ্যের দাম এক নজরে
            </h1>
            <p className="mt-5 max-w-lg text-base text-emerald-50/90 md:text-lg">
              দৈনিক বাজারের মূল্য, খুচরা দর, ও পরিবর্তন দেখে নিন—সবকিছু সহজে, দ্রুত ও নির্ভুলভাবে।
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#সব-পণ্য"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                সব পণ্য দেখুন
              </a>
              <Link
                href="/signin"
                className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
              >
                সাইন ইন
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-6 rounded-full bg-white/10 blur-3xl" />
            <div className="relative rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-3">
                {marketProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="rounded-2xl bg-white p-4 text-slate-800 shadow-md">
                    <div className="text-3xl">{product.emoji}</div>
                    <p className="mt-2 text-sm font-bold">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.unit}</p>
                    <p className="mt-2 text-sm font-extrabold text-emerald-700">
                      {formatBanglaCurrency(product.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-60 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <>
            <Section title="আজ দাম বেড়েছে ▲" items={topRisers} />
            <Section title="আজ দাম কমেছে ▼" items={topFallers} />
          </>
        )}
      </section>

      <section id="সব-পণ্য" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">সব পণ্য</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">সকল পণ্য দেখতে নিন</h2>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {marketProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}

function Section({ title, items }: { title: string; items: Product[] }) {
  return (
    <div className="mb-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900">{title}</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}

export function CategoryPageClient({
  category,
  products: categoryItems,
  categoryInfo,
  categories = getCategoryList(),
}: {
  category: string;
  products: Product[];
  categoryInfo?: MarketCategory;
  categories?: MarketCategory[];
}) {
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");
  const meta = categoryInfo ?? categoryMeta[category] ?? { label: "Unknown", icon: "📦", description: "" };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, [category]);

  const sortedProducts = useMemo(() => {
    const next = [...categoryItems];
    if (sort === "low") return next.sort((a, b) => a.price - b.price);
    if (sort === "high") return next.sort((a, b) => b.price - a.price);
    return next;
  }, [categoryItems, sort]);

  return (
    <SiteFrame marketProducts={categoryItems} categories={categories}>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700">
            <ArrowLeft size={16} /> হোম
          </Link>
          <div className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="appearance-none rounded-full border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none ring-0 focus:border-emerald-400"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
              {meta.icon}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">ক্যাটাগরি</p>
              <h1 className="text-3xl font-black text-slate-900">{meta.label}</h1>
            </div>
          </div>
          <p className="mt-4 text-slate-600">{meta.description}</p>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-64 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteFrame>
  );
}

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("এই পণ্যের বিস্তারিত দেখতে সাইন ইন করুন।");
      router.replace(`/signin?callbackUrl=${encodeURIComponent(`/product/${product.slug}`)}`);
    }
  }, [isPending, product.slug, router, session]);

  if (isPending || !session) {
    return (
      <SiteFrame>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </SiteFrame>
    );
  }

  const minPrice = Math.min(...product.bazarData.map((row) => row.min));
  const maxPrice = Math.max(...product.bazarData.map((row) => row.max));
  const averagePrice = Math.round(
    product.bazarData.reduce((sum, row) => sum + row.avg, 0) / product.bazarData.length
  );
  const marketsByDivision = product.bazarData.reduce<Record<string, typeof product.bazarData>>(
    (groups, row) => {
      const division = row.division || "বিভাগের তথ্য নেই";
      (groups[division] ??= []).push(row);
      return groups;
    },
    {},
  );

  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
          >
            <ArrowLeft size={16} /> ফিরে যান
          </button>
        </div>

        <nav aria-label="ব্রেডক্রাম্ব" className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-700">হোম</Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${product.category}`} className="hover:text-emerald-700">
            {categoryMeta[product.category]?.label ?? "ক্যাটাগরি"}
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page" className="font-medium text-slate-800">{product.name}</span>
        </nav>

        <div className="overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-slate-100">
          <div className="grid gap-8 bg-linear-to-r from-emerald-50 to-white p-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-4xl">
                  {product.emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">পণ্যের বিবরণ</p>
                  <h1 className="mt-1 text-3xl font-black text-slate-900">{product.name}</h1>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-base text-slate-600">{product.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "সর্বনিম্ন দাম", value: formatBanglaCurrency(minPrice) },
                  { label: "সর্বোচ্চ দাম", value: formatBanglaCurrency(maxPrice) },
                  { label: "গড় দাম", value: formatBanglaCurrency(averagePrice) },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{item.label}</p>
                    <p className="mt-3 text-xl font-black text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-emerald-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">আজকের মূল্য</p>
              <div className="mt-4 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm text-slate-500">{product.unit}</p>
                  <p className="mt-2 text-4xl font-black text-slate-900">{formatBanglaCurrency(product.price)}</p>
                </div>
                <span className={`rounded-full px-3 py-2 text-sm font-bold ${getChangeClass(product.change)}`}>
                  {getChangeBadge(product.change)}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {Object.entries(marketsByDivision).map(([division, markets]) => (
                  <div key={division} className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500">{division}</p>
                    {markets.map((row) => (
                      <div key={row.market} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                        <span className="font-medium text-slate-700">{row.market}</span>
                        <span className="text-right font-bold text-slate-900">
                          {formatBanglaCurrency(row.min)}–{formatBanglaCurrency(row.max)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">দামের তুলনা</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "আজ", value: product.price },
              { label: "গতকাল", value: product.priceHistory?.yesterday },
              { label: "গত সপ্তাহ", value: product.priceHistory?.lastWeek },
              { label: "গত মাস", value: product.priceHistory?.lastMonth },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 font-bold text-slate-900">
                  {item.value === undefined ? "তথ্য নেই" : formatBanglaCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteFrame>
  );
}

export function ProfilePageClient() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <SiteFrame>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">আমার প্রোফাইল</p>
          {isPending ? (
            <div className="mt-6 space-y-3">
              <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
            </div>
          ) : session ? (
            <>
              <h1 className="mt-3 text-3xl font-black text-slate-900">{session.user.name}</h1>
              <p className="mt-2 text-slate-600">{session.user.email}</p>
              <Link
                href="/profile/update"
                className="mt-7 inline-flex rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500"
              >
                তথ্য আপডেট করুন
              </Link>
            </>
          ) : (
            <ProfileSignInPrompt />
          )}
        </div>
      </div>
    </SiteFrame>
  );
}

export function ProfileUpdatePageClient() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = (name ?? session?.user.name ?? "").trim();
    if (!trimmedName) {
      toast.error("নাম লিখুন।");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({ name: trimmedName });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি।");
        return;
      }

      toast.success("প্রোফাইল আপডেট হয়েছে।");
      router.push("/profile");
    } catch {
      toast.error("তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SiteFrame>
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link href="/profile" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            <ArrowLeft className="mr-2 inline" size={16} /> প্রোফাইলে ফিরুন
          </Link>
          <h1 className="mt-6 text-3xl font-black text-slate-900">নাম আপডেট করুন</h1>
          {isPending ? (
            <div className="mt-6 h-24 animate-pulse rounded-2xl bg-slate-100" />
          ) : session ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="profile-name">
                নাম
              </label>
              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                required
                value={name ?? session.user.name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-emerald-400 focus:bg-white"
              />
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
              >
                {isSaving ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
              </button>
            </form>
          ) : (
            <ProfileSignInPrompt />
          )}
        </div>
      </div>
    </SiteFrame>
  );
}

function ProfileSignInPrompt() {
  return (
    <div className="mt-5">
      <p className="text-slate-600">প্রোফাইল দেখতে সাইন ইন করুন।</p>
      <Link href="/signin?callbackUrl=%2Fprofile" className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500">
        সাইন ইন
      </Link>
    </div>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getSafeNextPath(path: string | null) {
  return path?.startsWith("/") && !path.startsWith("//") && !path.includes("\\")
    ? path
    : "/";
}

function SocialAuthButtons({ callbackURL }: { callbackURL: string }) {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | "demo" | null>(null);

  const handleSocialLogin = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      const { error } = await authClient.signIn.social(
        { provider, callbackURL, errorCallbackURL: "/signin" },
        {
          onSuccess: () => {
            toast.success(`${provider === "google" ? "Google" : "GitHub"} দিয়ে লগইন সফল হয়েছে।`);
          },
        }
      );

      if (error) {
        toast.error(error.message || `${provider} দিয়ে লগইন করা যায়নি।`);
      }
    } catch {
      toast.error("এই Social Login provider কনফিগার করা নেই বা সংযোগ করা যায়নি।");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleDemoLogin = async () => {
    const credentials = {
      email: "demo@bazardor.test",
      password: "BazarDor-Demo-Access-2026",
    };
    setLoadingProvider("demo");

    try {
      const { error: signInError } = await authClient.signIn.email({
        ...credentials,
        callbackURL,
      });

      if (signInError) {
        const { error: signUpError } = await authClient.signUp.email({
          ...credentials,
          name: "BazarDor Demo",
          callbackURL,
        });

        if (signUpError) {
          const { error: retryError } = await authClient.signIn.email({
            ...credentials,
            callbackURL,
          });

          if (retryError) {
            toast.error("ডেমো অ্যাকাউন্টে প্রবেশ করা যায়নি। আবার চেষ্টা করুন।");
            return;
          }
        }
      }

      toast.success("ডেমো অ্যাকাউন্টে প্রবেশ সফল হয়েছে।");
      router.push(callbackURL);
    } catch {
      toast.error("ডেমো অ্যাকাউন্টে প্রবেশ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      {(["google", "github"] as const).map((provider) => (
        <button
          key={provider}
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => handleSocialLogin(provider)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 disabled:cursor-wait disabled:opacity-60"
        >
          {loadingProvider === provider
            ? "সংযোগ করা হচ্ছে..."
            : `${provider === "google" ? "Google" : "GitHub"} দিয়ে চালিয়ে যান`}
        </button>
      ))}
      <div className="divider my-1 text-xs text-slate-400">অথবা ডেমো দিয়ে দেখুন</div>
      <button
        type="button"
        disabled={loadingProvider !== null}
        onClick={handleDemoLogin}
        className="w-full rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 disabled:cursor-wait disabled:opacity-60"
      >
        {loadingProvider === "demo" ? "ডেমো অ্যাকাউন্টে প্রবেশ হচ্ছে..." : "ডেমো অ্যাকাউন্টে প্রবেশ করুন"}
      </button>
      <p className="text-center text-xs text-slate-500">
        সবার জন্য একই ডেমো অ্যাকাউন্ট; প্রথম ব্যবহারে স্বয়ংক্রিয়ভাবে তৈরি হবে।
      </p>
    </div>
  );
}

export function SigninPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(
    searchParams.get("callbackUrl") ?? searchParams.get("next"),
  );
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("reason") === "auth-required") {
      toast.error("এই পেজটি দেখতে আগে সাইন ইন করুন।");
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = form.email.trim();
    if (!email || !form.password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন।");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.email(
        { email, password: form.password, callbackURL: nextPath },
        {
          onSuccess: () => {
            toast.success("সাইন ইন সফল হয়েছে।");
            router.push(nextPath);
          },
        },
      );

      if (error) {
        toast.error(error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।");
      }
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteFrame>
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">সাইন ইন</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">আপনার অ্যাকাউন্টে যান</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">ইমেইল</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">পাসওয়ার্ড</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "লগইন হচ্ছে..." : "লগইন"}
            </button>
          </form>

          <SocialAuthButtons callbackURL={nextPath} />

          <p className="mt-6 text-center text-sm text-slate-600">
            অ্যাকাউন্ট নেই? <Link href="/signup" className="font-semibold text-emerald-700">রেজিস্টার করুন</Link>
          </p>
        </div>
      </div>
    </SiteFrame>
  );
}

export function SignupPageClient() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email || !form.password) {
      toast.error("নাম, ইমেইল ও পাসওয়ার্ড লিখুন।");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }
    if (form.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email(
        { name, email, password: form.password },
        {
          onSuccess: () => {
            toast.success("রেজিস্টেশন সফল হয়েছে।");
            router.push("/signin");
          },
        },
      );

      if (error) {
        toast.error(error.message || "রেজিস্টেশন ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.error("রেজিস্টেশন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteFrame>
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">সাইন আপ</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">নাম</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                placeholder="আপনার নাম"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">ইমেইল</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">পাসওয়ার্ড</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "রেজিস্টার হচ্ছে..." : "রেজিস্টার করুন"}
            </button>
          </form>

          <SocialAuthButtons callbackURL="/" />

          <p className="mt-6 text-center text-sm text-slate-600">
            ইতিমধ্যে অ্যাকাউন্ট আছে? <Link href="/signin" className="font-semibold text-emerald-700">লগইন করুন</Link>
          </p>
        </div>
      </div>
    </SiteFrame>
  );
}

export function CategoryEmptyState({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">৪০৪</p>
      <h1 className="mt-3 text-3xl font-black text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">এই ক্যাটাগরি খুঁজে পাওয়া যায় নি।</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

export function HomeEmptyState() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">No data</p>
      <h1 className="mt-3 text-3xl font-black text-slate-900">কোনো পণ্য পাওয়া যায় নি</h1>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

export function formatProductListSummary(product: Product) {
  const totalMarketCount = product.bazarData.length;
  const averagePrice = Math.round(
    product.bazarData.reduce((sum, row) => sum + row.price, 0) / totalMarketCount
  );
  return `${product.name} · ${formatBanglaNumber(averagePrice)} টাকা · ${product.unit}`;
}
