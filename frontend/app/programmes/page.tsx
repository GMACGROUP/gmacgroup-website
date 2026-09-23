import { Programme } from "@/types";
import ProgrammesClient from "@/components/catalogue/ProgrammesClient";

export const dynamic = "force-dynamic";

async function getProgrammes(): Promise<Programme[]> {
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
}

export default async function ProgrammesPage() {
  const programmes = await getProgrammes();
  return <ProgrammesClient programmes={programmes} />;
}
