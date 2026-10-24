export default function SettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[var(--bg-tertiary)] rounded-lg" />
      <div className="h-4 w-64 bg-[var(--bg-tertiary)] rounded-lg" />

      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass rounded-xl p-6">
          <div className="h-5 w-32 bg-[var(--bg-tertiary)] rounded mb-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded mb-1" />
                <div className="h-3 w-48 bg-[var(--bg-tertiary)] rounded" />
              </div>
              <div className="h-6 w-12 bg-[var(--bg-tertiary)] rounded-full" />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="h-4 w-40 bg-[var(--bg-tertiary)] rounded mb-1" />
                <div className="h-3 w-56 bg-[var(--bg-tertiary)] rounded" />
              </div>
              <div className="h-6 w-12 bg-[var(--bg-tertiary)] rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
