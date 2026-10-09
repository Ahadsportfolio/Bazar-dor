"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, ChevronDown, ShoppingCart, UserCircle2 } from "lucide-react";
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

const tickerItems = products.slice(0, 8).map((product) => ({
  ...product,
  value: product.price,
}));

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

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    if (typeof window === "undefined") return null;
    const savedUser = window.localStorage.getItem("bazarDorUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleSignOut = () => {
    localStorage.removeItem("bazarDorUser");
    setUser(null);
    toast.success("সফলভাবে লগ আউট হয়েছে।");
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
                <p className="text-[11px] text-slate-500">{new Date().toLocaleDateString("bn-BD")}</p>
              </div>
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              {getCategoryList().map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    pathname === `/category/${category.slug}`
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {category.icon} {category.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 sm:flex">
                    <UserCircle2 size={16} className="text-emerald-600" />
                    {user.name || user.email}
                  </div>
                  <button
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
          </div>

          <div className="mt-3 overflow-hidden rounded-full border border-emerald-100 bg-emerald-50 py-2">
            <div className="marquee-track flex items-center gap-6 whitespace-nowrap text-sm font-medium text-slate-700">
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div key={`${item.slug}-${idx}`} className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                  <span className="text-slate-500">{formatBanglaCurrency(item.price)}</span>
                  <span className={item.change >= 0 ? "text-emerald-600" : "text-rose-600"}>
                    {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(1)}%
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

export function HomePageClient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const topRisers = useMemo(
    () => [...products].sort((a, b) => b.change - a.change).slice(0, 6),
    []
  );
  const topFallers = useMemo(
    () => [...products].sort((a, b) => a.change - b.change).slice(0, 6),
    []
  );

  return (
    <SiteFrame>
      <section className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <div className="grid items-center gap-8 rounded-[32px] bg-gradient-to-br from-emerald-600 to-emerald-500 p-8 text-white shadow-lg md:grid-cols-2 lg:p-12">
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
                {products.slice(0, 4).map((product) => (
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
          {products.map((product) => (
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
}: {
  category: string;
  products: Product[];
}) {
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");
  const meta = categoryMeta[category] ?? { label: "Unknown", icon: "📦", description: "" };

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
    <SiteFrame>
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
  const isLoggedIn =
    typeof window !== "undefined" && Boolean(window.localStorage.getItem("bazarDorUser"));

  if (!isLoggedIn) {
    return (
      <SiteFrame>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">প্রবেশ সীমিত</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">আপনি লগইন করেন নি</h1>
            <p className="mt-3 text-slate-600">এই পণ্যের বিস্তারিত দেখতে সাইন ইন করুন।</p>
            <div className="mt-6 flex justify-center gap-4">
              <Link href={`/signin?next=${encodeURIComponent(`/product/${product.slug}`)}`} className="rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500">
                সাইন ইন
              </Link>
              <Link href="/" className="rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:border-slate-300">
                হোম পেজে ফিরে যান
              </Link>
            </div>
          </div>
        </div>
      </SiteFrame>
    );
  }

  const minPrice = Math.min(...product.bazarData.map((row) => row.price));
  const maxPrice = Math.max(...product.bazarData.map((row) => row.price));
  const averagePrice = Math.round(
    product.bazarData.reduce((sum, row) => sum + row.price, 0) / product.bazarData.length
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

        <div className="overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-slate-100">
          <div className="grid gap-8 bg-gradient-to-r from-emerald-50 to-white p-8 md:grid-cols-[1.1fr_0.9fr]">
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
                {product.bazarData.map((row) => (
                  <div key={row.market} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-medium text-slate-700">{row.market}</span>
                    <span className="font-bold text-slate-900">{formatBanglaCurrency(row.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}

export function SigninPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const savedUsers = JSON.parse(localStorage.getItem("bazarDorUsers") || "[]");
    const user = savedUsers.find(
      (item: { email: string; password: string }) =>
        item.email === form.email && item.password === form.password
    );

    if (!user) {
      toast.error("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।");
      return;
    }

    localStorage.setItem(
      "bazarDorUser",
      JSON.stringify({ name: user.name || "User", email: user.email })
    );
    toast.success("সাইন ইন সফল হয়েছে।");
    router.push(nextPath);
  };

  const handleSocialLogin = (provider: string) => {
    localStorage.setItem(
      "bazarDorUser",
      JSON.stringify({ name: "Google User", email: `${provider.toLowerCase()}@example.com` })
    );
    toast.success(`${provider} দিয়ে লগইন সফল হয়েছে।`);
    router.push(nextPath);
  };

  return (
    <SiteFrame>
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">সাইন ইন</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">আপনার অ্যাকাউন্টে যান</h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-emerald-500"
            >
              লগইন
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              Google দিয়ে চালিয়ে যান
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("GitHub")}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              GitHub দিয়ে চালিয়ে যান
            </button>
          </div>

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const savedUsers = JSON.parse(localStorage.getItem("bazarDorUsers") || "[]");
    const alreadyExists = savedUsers.some(
      (item: { email: string }) => item.email === form.email
    );

    if (alreadyExists) {
      toast.error("এই ইমেইলটি আগে থেকে আছে।");
      return;
    }

    const nextUsers = [...savedUsers, { ...form }];
    localStorage.setItem("bazarDorUsers", JSON.stringify(nextUsers));
    toast.success("রেজিস্টেশন সফল হয়েছে।");
    router.push("/signin");
  };

  return (
    <SiteFrame>
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">সাইন আপ</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-emerald-500"
            >
              রেজিস্টার করুন
            </button>
          </form>

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
