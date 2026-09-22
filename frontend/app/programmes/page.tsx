import { Programme } from "@/types";
import { unstable_cache } from "next/cache";
import ProgrammesClient from "@/components/catalogue/ProgrammesClient";

export const dynamic = "force-dynamic";

const getProgrammes = unstable_cache(async (): Promise<Programme[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  try {
    const response = await fetch(`${apiUrl}/programmes/`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}, ["public-programmes"], { revalidate: 60 });

export default async function ProgrammesPage() {
  const programmes = await getProgrammes();
  return <ProgrammesClient programmes={programmes} />;
}
