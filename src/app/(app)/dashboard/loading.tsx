export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-[var(--bg-tertiary)] rounded-lg" />
      <div className="h-4 w-48 bg-[var(--bg-tertiary)] rounded-lg" />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="h-6 w-6 bg-[var(--bg-tertiary)] rounded mb-2" />
            <div className="h-6 w-16 bg-[var(--bg-tertiary)] rounded mb-1" />
            <div className="h-3 w-20 bg-[var(--bg-tertiary)] rounded" />
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-6">
        <div className="h-5 w-32 bg-[var(--bg-tertiary)] rounded mb-3" />
        <div className="h-3 w-full bg-[var(--bg-tertiary)] rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-5">
            <div className="h-10 w-10 bg-[var(--bg-tertiary)] rounded mb-3" />
            <div className="h-4 w-24 bg-[var(--bg-tertiary)] rounded mb-2" />
            <div className="h-3 w-20 bg-[var(--bg-tertiary)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
