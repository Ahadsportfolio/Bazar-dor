import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">৪০৪</p>
      <h1 className="mt-3 text-3xl font-black text-slate-900">পেজটি খুঁজে পাওয়া যায় নি</h1>
      <p className="mt-3 text-slate-600">এই লিংকটি ভুল বা অনুপস্থিত হতে পারে।</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
