// Coordonnées et identité du site. Un changement d'adresse ou de domaine
// se fait ici, et nulle part ailleurs.

export const CONTACT_EMAIL = "contact@entraide-aafd-valdesaone.fr";

// TODO avant mise en ligne : remplacer par le vrai numéro de l'association.
export const CONTACT_PHONE = "06 12 34 56 78";

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

// Expéditeurs Resend. Le domaine doit être vérifié dans Resend,
// sinon les envois échouent en 403.
export const MAIL_FROM = {
  contact: `${ASSOCIATION_NAME} Contact <${CONTACT_EMAIL}>`,
  reservations: `${ASSOCIATION_NAME} Réservations <${CONTACT_EMAIL}>`,
  general: `${ASSOCIATION_NAME} <${CONTACT_EMAIL}>`,
} as const;
