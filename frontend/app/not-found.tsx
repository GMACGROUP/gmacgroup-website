import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";

export default function NotFound() {
  return (
    <section className="wrap py-24 sm:py-32">
      <p className="text-[12px] font-medium uppercase tracking-label text-accent">Error 404</p>
      <h1 className="display-lg mt-6 max-w-[18ch]">We could not find that page.</h1>
      <p className="lede mt-6 max-w-[56ch]">It may have moved, or the link may be out of date. These are good places to continue.</p>
      <ul className="mt-12 grid max-w-3xl grid-cols-1 border-t border-ink sm:grid-cols-2">
        {[
          ["/", "Home"],
          ["/expertise", "Our expertise"],
          ["/events", "Events"],
          ["/contact", "Contact us"],
        ].map(([href, label]) => (
          <li key={href} className="border-b border-rule">
            <Link href={href} className="link-arrow py-5">
              {label}
              <Arrow />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
