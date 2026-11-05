"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="wrap py-24 sm:py-32">
      <p className="text-[12px] font-medium uppercase tracking-label text-danger">Something went wrong</p>
      <h1 className="display-lg mt-6 max-w-[20ch]">This page could not load just now.</h1>
      <p className="lede mt-6 max-w-[56ch]">Please try again. If the problem continues, email info@gmac-group.com.</p>
      <div className="mt-10 flex gap-4">
        <button type="button" onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-secondary">Go to the homepage</Link>
      </div>
    </section>
  );
}
