
export type AccentLien =
  | "blue"
  | "orange"
  | "emerald"
  | "violet"
  | "rose"
  | "amber"
  | "sky"
  | "indigo";

export type LienUtile = {
  nom: string;
  url: string;
  description: string;
  accent: AccentLien;
  logo?: string;
  hauteurLogo?: string;
  fondOpaque?: boolean;
};

export const LIENS_UTILES: readonly LienUtile[] = [
  {
    nom: "La Cimade",
    url: "https://www.lacimade.org/",
    description:
      "Accompagnement juridique des personnes étrangères et défense de leurs droits.",
    accent: "blue",
    logo: "/images/liens/cimade.svg",
    hauteurLogo: "h-20",
  },
  {
    nom: "RESF — Réseau Éducation Sans Frontières",
    url: "https://reseau-resf.fr/",
    description:
      "Soutien aux jeunes scolarisés sans papiers et à leurs familles.",
    accent: "orange",
    logo: "/images/liens/resf.svg",
    hauteurLogo: "h-20",
  },
  {
    nom: "Coordination Urgence Migrants",
    url: "https://www.coordination-urgence-migrants.org/",
    description:
      "Collectif d'associations lyonnaises mobilisées sur l'accueil des personnes exilées.",
    accent: "violet",
    logo: "/images/liens/coordination-urgence-migrants.png",
    hauteurLogo: "h-20",
  },
  {
    nom: "Forum réfugiés",
    url: "https://www.forumrefugies.org/",
    description:
      "Accueil des demandeurs d'asile et défense du droit d'asile en Auvergne-Rhône-Alpes.",
    accent: "emerald",
    logo: "/images/liens/forum-refugies.png",
    hauteurLogo: "h-20",
  },
  {
    nom: "Jamais Sans Toit",
    url: "https://www.facebook.com/jamaissanstoit69/",
    description:
      "Collectif du Rhône contre les expulsions et pour l'hébergement des familles.",
    accent: "rose",
    logo: "/images/liens/jamais-sans-toit.jpg",
    hauteurLogo: "h-20",
    fondOpaque: true,
  },
  {
    nom: "InfoMIE",
    url: "https://www.infomie.net/",
    description: "Centre de ressources sur les mineurs isolés étrangers.",
    accent: "amber",
    logo: "/images/liens/infomie.svg",
    hauteurLogo: "h-10",
  },
  {
    nom: "Watizat",
    url: "https://watizat.org/",
    description:
      "Guides d'information pratiques à destination des personnes exilées.",
    accent: "sky",
    logo: "/images/liens/watizat.webp",
    hauteurLogo: "h-20",
  },
  {
    nom: "Les Chant' sans pap' yé !",
    url: "https://www.chantsanspapier.click/",
    description: "Chorale engagée aux côtés des personnes sans papiers.",
    accent: "indigo",
    logo: "/images/liens/chant-sans-pap.jpg",
    hauteurLogo: "h-20",
    fondOpaque: true,
  },
];


export const ACCENTS_LIENS: Record<
  AccentLien,
  { fleche: string; repli: string }
> = {
  blue: {
    fleche: "bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white",
    repli: "text-blue-900",
  },
  orange: {
    fleche: "bg-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white",
    repli: "text-orange-900",
  },
  emerald: {
    fleche: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    repli: "text-emerald-900",
  },
  violet: {
    fleche: "bg-violet-50 text-violet-700 group-hover:bg-violet-600 group-hover:text-white",
    repli: "text-violet-900",
  },
  rose: {
    fleche: "bg-rose-50 text-rose-700 group-hover:bg-rose-600 group-hover:text-white",
    repli: "text-rose-900",
  },
  amber: {
    fleche: "bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white",
    repli: "text-amber-900",
  },
  sky: {
    fleche: "bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white",
    repli: "text-sky-900",
  },
  indigo: {
    fleche: "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white",
    repli: "text-indigo-900",
  },
};

export function domaineLisible(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}
