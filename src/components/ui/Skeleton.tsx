/** Branded shimmer skeleton used for loading states. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-xl bg-slate-200/60 dark:bg-slate-800/60 " +
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer " +
        "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent " +
        "dark:before:via-white/10 " +
        className
      }
    />
  );
}

/** Dashboard loading skeleton (admin area). */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

/** Grid list loading skeleton (public project list). */
export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-6 space-y-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}

