export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-4xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3 max-w-xl mx-auto text-center">
          <div className="h-4 w-32 bg-slate-200 rounded-full mx-auto" />
          <div className="h-8 w-3/4 bg-slate-200 rounded-xl mx-auto" />
          <div className="h-4 w-full bg-slate-100 rounded-lg mx-auto" />
        </div>

        {/* Content Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="h-56 bg-slate-100 rounded-2xl border border-slate-200/60 p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="h-3 w-5/6 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="h-56 bg-slate-100 rounded-2xl border border-slate-200/60 p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="h-3 w-5/6 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="h-56 bg-slate-100 rounded-2xl border border-slate-200/60 p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="h-3 w-5/6 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
