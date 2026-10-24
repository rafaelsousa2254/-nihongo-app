export default function HiraganaLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[var(--bg-tertiary)] rounded-lg" />
      <div className="h-4 w-64 bg-[var(--bg-tertiary)] rounded-lg" />

      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-[var(--bg-tertiary)] rounded-lg" />
        ))}
      </div>

      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-[var(--bg-tertiary)] rounded-md" />
        ))}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-3">
        {Array.from({ length: 46 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-[var(--bg-tertiary)]" />
        ))}
      </div>
    </div>
  );
}
