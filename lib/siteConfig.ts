export const CONTACT_EMAIL = "contact@entraide-aafd-valdesaone.fr";

export const CONTACT_PHONE = "06 81 21 80 24";

export const CONTACT_PERSON = "Sylvie Orgeret";

export const CONTACT_PHONE_E164 = "+33681218024";

export const INSTAGRAM_HANDLE = "@aafd_asso";
export const INSTAGRAM_URL = "https://www.instagram.com/aafd_asso/";

export const HELLOASSO_URL =
  "https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.entraide-aafd-valdesaone.fr";

export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

export const ASSOCIATION_NAME = "AAFD";

export const ASSOCIATION_FULL_NAME =
  "Association d'Aide aux Familles en Difficulté";

export const ASSOCIATION_FOUNDING_YEAR = 2007;

export const ASSOCIATION_ADDRESS = {
  streetAddress: "28 rue Ampère",
  postalCode: "69270",
  addressLocality: "Fontaines-sur-Saône",
  addressRegion: "Auvergne-Rhône-Alpes",
  addressCountry: "FR",
} as const;

export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

export const MAIL_FROM = {
  contact: `${ASSOCIATION_NAME} Contact <${CONTACT_EMAIL}>`,
  reservations: `${ASSOCIATION_NAME} Réservations <${CONTACT_EMAIL}>`,
  general: `${ASSOCIATION_NAME} <${CONTACT_EMAIL}>`,
} as const;
