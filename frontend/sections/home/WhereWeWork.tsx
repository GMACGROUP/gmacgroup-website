import { AfricaMap } from "@/components/editorial/AfricaMap";
import { FOCUS_MARKETS } from "@/lib/content/site";

export function WhereWeWork() {
  return (
    <section aria-labelledby="where-title" className="border-b border-rule">
      <div className="wrap grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <p className="eyebrow">
            <span className="eyebrow-num">Fig. 1</span> Where we work
          </p>
          <h2 id="where-title" className="display-md mt-6">Ten focus markets, one regional team.</h2>
          <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-ink-500">
            Fieldwork, programmes and partnerships across {FOCUS_MARKETS.length} markets in West, East and Southern Africa,
            delivered by colleagues who live in the region.
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <AfricaMap />
        </div>
      </div>
    </section>
  );
}
