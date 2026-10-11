export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="skeleton mb-6 h-10 w-32 rounded-full" />
      <div className="grid gap-8 rounded-3xl bg-white p-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-36 w-full rounded-2xl" />
        </div>
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    </div>
  );
}
