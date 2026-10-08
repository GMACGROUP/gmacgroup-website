import Link from "next/link";

const POINTS = [
  "Follow your programme enrolments and event registrations",
  "See where each application stands",
  "Keep your contact details up to date",
];

/** Two column layout for sign in, registration and password pages. */
export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-rule">
      <div className="wrap grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-6 xl:col-span-5">
          <p className="text-[12px] font-medium uppercase tracking-label text-clay">{eyebrow}</p>
          <h1 className="display-lg mt-4">{title}</h1>
          {intro && <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-ink-500">{intro}</p>}
          <div className="mt-10">{children}</div>
        </div>
        <aside className="hidden lg:col-span-5 lg:col-start-8 lg:block">
          <div className="border-t-4 border-ink bg-stone p-10">
            <p className="font-display text-2xl leading-snug">Your Gmac Group account</p>
            <ul className="mt-6 border-t border-ink/15">
              {POINTS.map((p, i) => (
                <li key={p} className="grid grid-cols-[2.5rem_1fr] border-b border-ink/15 py-4 text-[15px] text-ink-600">
                  <span className="tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink-500">
              Commissioning research or advisory work? You do not need an account.{" "}
              <Link href="/contact?topic=institution" className="text-accent underline underline-offset-4">
                Start a conversation
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
      {children}
    </p>
  );
}
