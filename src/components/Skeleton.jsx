export function CardSkeleton() {
  return (
    <div className="block bg-white dark:bg-navy-800 rounded-lg border border-navy-100 dark:border-navy-600 overflow-hidden animate-pulse">
      <div className="aspect-square bg-navy-100 dark:bg-navy-700" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-navy-100 dark:bg-navy-700 rounded w-3/4" />
        <div className="h-3 bg-navy-100 dark:bg-navy-700 rounded w-1/2" />
        <div className="h-4 bg-mustard-200 dark:bg-mustard-900 rounded w-1/3" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-white dark:bg-navy-800 rounded-lg border border-navy-100 dark:border-navy-600 p-6 space-y-4">
        <div className="h-6 bg-navy-100 dark:bg-navy-700 rounded w-2/3" />
        <div className="h-4 bg-navy-100 dark:bg-navy-700 rounded w-1/3" />
        <div className="h-48 bg-navy-100 dark:bg-navy-700 rounded" />
        <div className="h-4 bg-navy-100 dark:bg-navy-700 rounded w-full" />
        <div className="h-4 bg-navy-100 dark:bg-navy-700 rounded w-3/4" />
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-navy-800 rounded-lg border border-navy-100 dark:border-navy-600 p-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-navy-100 dark:bg-navy-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-navy-100 dark:bg-navy-700 rounded w-1/3" />
        <div className="h-3 bg-navy-100 dark:bg-navy-700 rounded w-2/3" />
      </div>
    </div>
  );
}
