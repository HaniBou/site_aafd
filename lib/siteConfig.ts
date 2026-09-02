// Coordonnées et identité du site. Un changement d'adresse ou de domaine
// se fait ici, et nulle part ailleurs.

export const CONTACT_EMAIL = "contact@entraide-aafd-valdesaone.fr";

export const CONTACT_PHONE = "06 81 21 80 24";

// Bénévole joignable sur ce numéro, affichée sous le téléphone de la page
// Contact. Mettre la chaîne à "" fait disparaître la ligne sans autre retouche.
export const CONTACT_PERSON = "Sylvie Orgeret";

// Même numéro au format international, pour les données structurées : Google
// rapproche mieux une fiche d'établissement d'un numéro en +33 que d'un 06.
export const CONTACT_PHONE_E164 = "+33681218024";

export const INSTAGRAM_HANDLE = "@aafd_asso";
export const INSTAGRAM_URL = "https://www.instagram.com/aafd_asso/";

export const HELLOASSO_URL =
  "https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.entraide-aafd-valdesaone.fr";

// Version affichable de SITE_URL, sans le protocole.
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

export const ASSOCIATION_NAME = "AAFD";

export const ASSOCIATION_FULL_NAME =
  "Association d'Aide aux Familles en Difficulté";

// Année de création. Le site dit « depuis 2007 » et jamais « depuis N ans » :
// une ancienneté en années doit être corrigée chaque janvier dans chaque page,
// et c'est ainsi que la carte de partage a fini par annoncer 17 ans quand le
// site en annonçait 19.
export const ASSOCIATION_FOUNDING_YEAR = 2007;

// Adresse du siège. Elle alimente les données structurées lues par Google :
// c'est ce qui permet à l'association de remonter sur les recherches locales
// (« aide familles réfugiées Val de Saône »).
export const ASSOCIATION_ADDRESS = {
  streetAddress: "28 rue Ampère",
  postalCode: "69270",
  addressLocality: "Fontaines-sur-Saône",
  addressRegion: "Auvergne-Rhône-Alpes",
  addressCountry: "FR",
} as const;

// Code de validation Google Search Console (balise meta). Facultatif : sans lui,
// la propriété se vérifie par le DNS ou par le fichier HTML fourni par Google.
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

// Expéditeurs Resend. Le domaine doit être vérifié dans Resend,
// sinon les envois échouent en 403.
export const MAIL_FROM = {
  contact: `${ASSOCIATION_NAME} Contact <${CONTACT_EMAIL}>`,
  reservations: `${ASSOCIATION_NAME} Réservations <${CONTACT_EMAIL}>`,
  general: `${ASSOCIATION_NAME} <${CONTACT_EMAIL}>`,
} as const;
