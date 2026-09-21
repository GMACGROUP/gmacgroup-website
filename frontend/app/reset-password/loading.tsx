export default function ResetPasswordLoading() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="relative w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-elevate overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-navy via-brand-cyan to-brand-red" />

        {/* Logo Header Skeleton */}
        <div className="text-center mb-8 pt-2 space-y-3">
          <div className="h-9 w-32 bg-slate-200 rounded-lg mx-auto animate-pulse" />
          <div className="h-7 w-48 bg-slate-200 rounded-xl mx-auto animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Form Skeleton */}
        <div className="space-y-4 animate-pulse">
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 bg-slate-200 rounded" />
            <div className="h-12 w-full bg-slate-100 rounded-xl border border-slate-200" />
          </div>

          <div className="space-y-1.5">
            <div className="h-3.5 w-28 bg-slate-200 rounded" />
            <div className="h-12 w-full bg-slate-100 rounded-xl border border-slate-200" />
          </div>

          <div className="h-12 w-full bg-brand-navy/20 rounded-xl mt-2" />
        </div>
      </div>
    </div>
  );
}
