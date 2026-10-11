export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="skeleton mb-6 h-12 w-full rounded-3xl" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="skeleton h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
