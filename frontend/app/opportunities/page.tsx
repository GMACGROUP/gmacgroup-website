import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { Opportunity } from "@/types";
import OpportunitiesClient from "@/components/catalogue/OpportunitiesClient";

export const dynamic = "force-dynamic";

const getOpportunities = unstable_cache(async (): Promise<Opportunity[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  try {
    const response = await fetch(`${apiUrl}/opportunities/`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}, ["public-opportunities"], { revalidate: 60 });

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OpportunitiesClient opportunities={opportunities} />
    </Suspense>
  );
}
