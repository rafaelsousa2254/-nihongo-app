export default function FlashcardsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-40 bg-[var(--bg-tertiary)] rounded-lg" />
      <div className="h-4 w-56 bg-[var(--bg-tertiary)] rounded-lg" />

      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-28 bg-[var(--bg-tertiary)] rounded-lg" />
        ))}
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md h-64 bg-[var(--bg-tertiary)] rounded-2xl" />
      </div>

      <div className="flex justify-center gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 w-20 bg-[var(--bg-tertiary)] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
