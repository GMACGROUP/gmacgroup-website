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
  ["Richard Klutse", "Head of Programs & Business Development", "Ghana", "Business Development and Partnerships", true],
  ["Atigsimah Richard Akamboe", "Business Development Intern", "Ghana", "Business Development and Partnerships"],
  ["Ismail Saani", "Research Consultant, Interim Team Lead", "Ghana", "Research", true],
  ["Benjamin Asiedu", "Research Consultant", "Ghana", "Research"],
  ["Evans Essene Dzidzienyo", "Research Consultant", "Ghana", "Research"],
  ["Oluwatosin Temitope Ogungbade", "Research Consultant", "Nigeria", "Research"],
  ["Atta Gyasi Domson", "Research Consultant", "United States", "Research"],
  ["Maureen Mushwimba", "Digital Marketing & Communications Strategist", "Zambia", "Marketing and Communications"],
  ["Jude Van-Tagoe", "Digital Marketing & Communications Strategist", "Ghana", "Marketing and Communications"],
  ["Victoria Dzifa Atisoe", "Digital Marketing & Communications Intern", "Ghana", "Marketing and Communications"],
  ["Favour Ohiemi", "Digital Marketing & Communications Intern", "Nigeria", "Marketing and Communications"],
  ["Yolanda Chibaya", "Graphic & Web Designer", "Zimbabwe", "Graphic Design and Web"],
  ["Silas Bivamwijuru", "Graphic & Web Designer", "Rwanda", "Graphic Design and Web"],
  ["Christian Agyapong", "Graphic & Web Designer", "Ghana", "Graphic Design and Web"],
  ["Maranatha Okeley Odai", "Graphic & Web Designer", "Ghana", "Graphic Design and Web"],
  ["Wendy Gerrar Otu", "Graphic & Web Design Intern", "Ghana", "Graphic Design and Web"],
  ["Ramadhani Athumani Mbiaji", "Operations & Program Manager", "Tanzania", "Operations and Programmes"],
  ["Apollo Samantha Dorcas", "Operations & Program Manager", "Nigeria", "Operations and Programmes"],
  ["Edwin Camichael Ngyfo Teno", "Operations & Program Manager", "Cameroon", "Operations and Programmes"],
  ["Delasi Kumapley", "Operations & Program Intern", "Ghana", "Operations and Programmes"],
  ["Faustino Albert", "Operations & Program Intern", "Burkina Faso", "Operations and Programmes"],
  ["Addai Kojo Richmond", "Operations & Program Intern", "Ghana", "Operations and Programmes"],
  ["Mphoyame Thole", "Operations & Program Intern", "Botswana", "Operations and Programmes"],
  ["Emmanuel Nyamekye", "Operations & Program Intern", "Ghana", "Operations and Programmes"],
];

const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const PHOTOS = new Set(["addai-kojo-richmond", "apollo-samantha-dorcas", "atigsimah-richard-akamboe", "atta-gyasi-domson", "christian-agyapong", "delasi-kumapley", "emmanuel-nyamekye", "evans-essene-dzidzienyo", "faustino-albert", "favour-ohiemi", "ismail-saani", "jude-van-tagoe", "maranatha-okeley-odai", "maureen-mushwimba", "mphoyame-thole", "oluwatosin-temitope-ogungbade", "richard-klutse", "silas-bivamwijuru", "victoria-dzifa-atisoe", "wendy-gerrar-otu", "yolanda-chibaya"]);

export const TEAM_SEED: TeamMember[] = raw.map(([name, position, country, team, is_lead], i) => ({
  id: `seed-${i + 1}`,
  name,
  position,
  country,
  team,
  is_lead: Boolean(is_lead),
  sort_order: i + 1,
  photo_url: PHOTOS.has(slug(name)) ? `/images/people/${slug(name)}.jpg` : null,
}));
