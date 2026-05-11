function SkeletonItem() {
  return (
    <div className="flex gap-3 p-4 bg-white rounded-card border border-line-base mb-3 animate-pulse">
      <div className="w-10 h-10 bg-surface-card rounded-card flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-card rounded w-3/4" />
        <div className="h-3 bg-surface-card rounded w-1/2" />
      </div>
    </div>
  )
}

export default function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="px-5 pt-2">
      {Array.from({ length: count }).map((_, i) => <SkeletonItem key={i} />)}
    </div>
  )
}
