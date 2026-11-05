// Past speakers at Gmac Group events (NIS Webinar Series and Leadership 2050 Summit).
// Source: Gmac Webinars Profile (January 2026). Photos in /public/images/speakers.

export type Speaker = { name: string; role: string; photo: string };

const s = (name: string, role: string, photo: string): Speaker => ({ name, role, photo: `/images/speakers/${photo}.jpg` });

export const PAST_SPEAKERS: Speaker[] = [
  s("Dr. Genevieve Duncan Obuobi", "Lead Consultant, Tarragon Edge", "genevieve-duncan-obuobi"),
  s("Dr. Yaw Perbi", "Global CEO, The HuD Group Global", "yaw-perbi"),
  s("H.E. Amb. Simone Giger", "Swiss Ambassador to Ghana, Togo and Benin", "simone-giger"),
  s("Yaw Nsarko", "Corporate Executive and Pan African Advocate", "yaw-nsarko"),
  s("David Meltzer", "Founder, David Meltzer Enterprises", "david-meltzer"),
  s("Prof. Phoebe Koundouri", "Chair, World Council of Environmental and Natural Resource Economists Associations; SDSN Global Climate Hub; AE4RIA", "phoebe-koundouri"),
  s("Emmaline Datey", "Founder, ICS Africa", "emmaline-datey"),
  s("Kweku Awotwi", "Board Chairman, UBA Group Ghana", "kweku-awotwi"),
  s("Dr. Sam Ankrah", "CEO, Africa Investment Group International", "sam-ankrah"),
  s("Raffaello Follieri", "Chairman and CEO, Follieri Energy Group SA", "raffaello-follieri"),
  s("Dr. Jamie Beaton", "CEO and Co-Founder, Crimson Education", "jamie-beaton"),
  s("Dr. Priscilla Twumasi", "Economist and Senior Lecturer, University of Ghana", "priscilla-twumasi"),
  s("H.E. Yara Mutola", "Vice President, African Union of Youth Assembly (AUYA), Mozambique", "yara-mutola"),
  s("Nyimbi Odero", "Group Managing Director, Del-York Group", "nyimbi-odero"),
  s("Dr. Theophilus Excel", "Secretary General, Nigeria Council (Nigerian Gas Association)", "theophilus-excel"),
  s("James N. Quaye", "Banker and Financial Adviser, Ednworld Trainings Service", "james-n-quaye"),
  s("Amb. Adeshola Onadipe", "Diplomat; President, African-Arab Women Chamber of Commerce", "adeshola-onadipe"),
  s("Andrea Bulnes", "Trade Consultant, ITO (WTO/UN)", "andrea-bulnes"),
  s("Dr. Kwame A. Opoku", "Chief Executive Officer, Reset Global People", "kwame-a-opoku"),
  s("Ifesinachi Okoli-Okpagu", "Group CMO, Heirs Holdings Group Retail Portfolios", "ifesinachi-okoli-okpagu"),
  s("Edward Asare", "Digital Marketing Officer, UBA Ghana", "edward-asare"),
  s("Skye McMahan", "Sustainable Real Estate Developer; President, Bird Dog Group", "skye-mcmahan"),
  s("Blossom Martins", "CEO, BM Studios", "blossom-martins"),
  s("Mozez Praiz", "TV Presenter, SuperSport", "mozez-praiz"),
  s("Barry Rodrigues", "Founder, NexGen Digital", "barry-rodrigues"),
  s("Mona Iddrisu", "Head of Youth Employment and Skills, ACET", "mona-iddrisu"),
  s("Eyram Agbemava", "Special Project Coordinator, African Center for Economic Transformation (ACET)", "eyram-agbemava"),
  s("Tsonam Cleanse Akpeloo", "Chair, AU ECOSOCC Trade and Industry Cluster", "tsonam-cleanse-akpeloo"),
  s("Simran Massey", "Policy Advisor, Department for Transport (DfT), United Kingdom", "simran-massey"),
  s("Miguel Padilla", "University Professor, Universidad Rafael Landívar", "miguel-padilla"),
  s("Albert Kusi", "Founder, LEC Group", "albert-kusi"),
  s("Kingsford Onyina", "Educational YouTuber", "kingsford-onyina"),
  s("Sochima Ezeoke", "Actress and Nollywood Film Producer", "sochima-ezeoke"),
  s("Lilian Daniel-Ojieh", "Recruitment Consultant, Rock Recruitment", "lilian-daniel-ojieh"),
  s("Bhhavya Kapoor", "Research and Policy Associate, Institute for Governance and Sustainable Development (IGSD)", "bhhavya-kapoor"),
  s("Evanah Serumola", "Director, EduSmart Botswana", "evanah-serumola"),
  s("Prince Ampofo", "Founder, LeadaValley", "prince-ampofo"),
];
