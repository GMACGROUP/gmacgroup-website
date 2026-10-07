/*
 * Fallback team list, used only when the team API is unreachable
 * (for example during a build without the backend). The live list is
 * managed in the admin panel under Team.
 */
export type TeamMember = {
  id: string;
  name: string;
  position: string;
  country: string;
  team: string;
  photo_url?: string | null;
  bio?: string | null;
  linkedin_url?: string | null;
  is_lead?: boolean;
  sort_order?: number;
};

const raw: [string, string, string, string, boolean?][] = [
  ["Richard", "Business Development Intern", "Ghana", "Business Development and Partnerships"],
  ["Saani", "Research Lead", "Ghana", "Research", true],
  ["Oluwafemi", "Research Consultant", "Nigeria", "Research"],
  ["Domson", "Research Consultant", "United States", "Research"],
  ["Evans", "Research Consultant", "Ghana", "Research"],
  ["Benjamin", "Research Consultant", "Ghana", "Research"],
  ["Maureen Mushwimba", "Head of Marketing and Communications", "Zambia", "Marketing and Communications", true],
  ["Victoria", "Marketing and Communications Intern", "Ghana", "Marketing and Communications"],
  ["Favour", "Marketing and Communications Intern", "Nigeria", "Marketing and Communications"],
  ["Yolanda", "Design Lead", "Zimbabwe", "Graphic Design and Web", true],
  ["Silas", "Designer", "Rwanda", "Graphic Design and Web"],
  ["Christian", "Designer", "Ghana", "Graphic Design and Web"],
  ["Wendy", "Designer", "Ghana", "Graphic Design and Web"],
  ["Maranatha", "Design Intern", "Ghana", "Graphic Design and Web"],
  ["Ramadhani", "Programme Manager", "Tanzania", "Operations and Programmes"],
  ["Samantha", "Programme Manager", "Nigeria", "Operations and Programmes"],
  ["Edwin", "Programme Manager", "Cameroon", "Operations and Programmes"],
  ["Delasi", "Programmes Intern", "Ghana", "Operations and Programmes"],
  ["Faustino", "Programmes Intern", "Burkina Faso", "Operations and Programmes"],
  ["Richmond", "Programmes Intern", "Ghana", "Operations and Programmes"],
  ["Thole", "Programmes Intern", "Botswana", "Operations and Programmes"],
  ["Emmanuel", "Programmes Intern", "Ghana", "Operations and Programmes"],
];

export const TEAM_SEED: TeamMember[] = raw.map(([name, position, country, team, is_lead], i) => ({
  id: `seed-${i + 1}`,
  name,
  position,
  country,
  team,
  is_lead: Boolean(is_lead),
  sort_order: i + 1,
  photo_url: null,
}));
