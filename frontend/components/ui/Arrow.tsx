export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="square" d="M4 12h15m0 0l-6-6m6 6l-6 6" />
    </svg>
  );
}
