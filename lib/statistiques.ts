import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import { adminDb } from './firebase/admin';
import { SITE_DOMAIN } from './siteConfig';

// Compteur de fréquentation « maison ».
//
// Volontairement anonyme et agrégé : on n'enregistre que des totaux, jamais
// d'adresse IP, d'identifiant de visiteur ni de parcours individuel. C'est ce
// qui le fait entrer dans l'exemption de consentement prévue par la CNIL pour
// la mesure d'audience, et donc compter 100 % des visiteurs — contrairement à
// Google Analytics, qui ne voit que ceux ayant accepté la bannière.

const COLL_GLOBAL = 'statistiques';
const DOC_GLOBAL = 'global';
const COLL_JOURS = 'statistiques_jours';
const COLL_PAGES = 'statistiques_pages';
const COLL_SOURCES = 'statistiques_sources';

/** Nombre de jours affichés dans le graphique du tableau de bord. */
export const JOURS_AFFICHES = 14;

const PAGES_AFFICHEES = 5;
const SOURCES_AFFICHEES = 6;

export type StatistiquesVisites = {
  totalVisites: number;
  totalVues: number;
  visitesAujourdhui: number;
  visitesCeMois: number;
  /** Jour de la première mesure, ou `null` si le compteur est vierge. */
  depuis: string | null;
  jours: { date: string; visites: number }[];
  pages: { chemin: string; vues: number }[];
  sources: { source: string; visites: number }[];
};

export const SOURCE_DIRECTE = 'Accès direct';
const SOURCE_AUTRE = 'Autre site';

// Regroupement des domaines référents en sources lisibles. Les préfixes de
// redirection des réseaux sociaux (l.instagram.com, lm.facebook.com, t.co…)
// sont couverts par le `(^|\.)` de chaque motif.
const SOURCES_CONNUES: [RegExp, string][] = [
  [/(^|\.)google\./, 'Google'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)facebook\.com$/, 'Facebook'],
  [/^t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/, 'X (Twitter)'],
  [/(^|\.)helloasso\.com$/, 'HelloAsso'],
  [/(^|\.)linkedin\.com$/, 'LinkedIn'],
  [/(^|\.)youtube\.com$/, 'YouTube'],
  [/(^|\.)whatsapp\.com$/, 'WhatsApp'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'],
  [/(^|\.)ecosia\.org$/, 'Ecosia'],
  [/(^|\.)qwant\.com$/, 'Qwant'],
  [/(^|\.)yahoo\./, 'Yahoo'],
];

const DOMAINE_PROPRE = SITE_DOMAIN.replace(/^www\./, '');

/**
 * Transforme l'en-tête référent en une source affichable. Seul le nom de
 * domaine est retenu — jamais l'URL complète, qui pourrait contenir des
 * paramètres identifiants.
 */
export function normaliserSource(referent: unknown): string {
  if (typeof referent !== 'string' || referent === '') return SOURCE_DIRECTE;

  let hote: string;
  try {
    hote = new URL(referent).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return SOURCE_DIRECTE;
  }

  // Une nouvelle session ouverte depuis le site lui-même (lien en nouvel
  // onglet) n'est pas une provenance externe.
  if (!hote || hote === DOMAINE_PROPRE) return SOURCE_DIRECTE;

  for (const [motif, nom] of SOURCES_CONNUES) {
    if (motif.test(hote)) return nom;
  }

  // Domaine inconnu : conservé tel quel s'il ressemble à un nom d'hôte, sinon
  // regroupé, pour que la collection ne puisse pas être noyée de valeurs
  // fantaisistes envoyées directement à l'API.
  return /^[a-z0-9.-]{4,60}$/.test(hote) && hote.includes('.') ? hote : SOURCE_AUTRE;
}

/** Identifiant de document Firestore dérivé d'un nom de source. */
export function idSource(source: string): string {
  return (
    source
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 80) || 'inconnu'
  );
}

/**
 * Date du jour au format YYYY-MM-DD, en heure de Paris. Vercel exécute en UTC :
 * sans ce calage, les visites du soir seraient comptées sur le lendemain.
 * `fr-CA` est la locale qui produit nativement le format ISO.
 */
export function jourParis(date = new Date()): string {
  return new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Les `n` derniers jours, du plus ancien au plus récent. */
function derniersJours(n: number): string[] {
  const [annee, mois, jour] = jourParis().split('-').map(Number);
  // Ancrage à midi UTC : la date calendaire reste juste quels que soient les
  // changements d'heure.
  const ancre = Date.UTC(annee, mois - 1, jour, 12);

  const jours: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    jours.push(new Date(ancre - i * 86_400_000).toISOString().slice(0, 10));
  }
  return jours;
}

/** Tous les jours écoulés du mois en cours, du 1er à aujourd'hui. */
function joursDuMois(): string[] {
  const [annee, mois, dernier] = jourParis().split('-').map(Number);

  const jours: string[] = [];
  for (let jour = 1; jour <= dernier; jour++) {
    jours.push(
      `${annee}-${String(mois).padStart(2, '0')}-${String(jour).padStart(2, '0')}`,
    );
  }
  return jours;
}

/** Identifiant de document Firestore dérivé d'un chemin d'URL. */
export function idPage(chemin: string): string {
  const slug = chemin.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_-]+/g, '_');
  return slug === '' ? 'accueil' : slug.slice(0, 200);
}

/**
 * Incrémente les compteurs. Une seule écriture groupée pour les trois documents :
 * total général, total du jour, total de la page.
 */
export async function enregistrerVue(
  chemin: string,
  nouvelleVisite: boolean,
  referent?: unknown,
): Promise<void> {
  const batch = adminDb.batch();
  const visites = FieldValue.increment(nouvelleVisite ? 1 : 0);

  batch.set(
    adminDb.collection(COLL_GLOBAL).doc(DOC_GLOBAL),
    { vues: FieldValue.increment(1), visites },
    { merge: true },
  );

  batch.set(
    adminDb.collection(COLL_JOURS).doc(jourParis()),
    { vues: FieldValue.increment(1), visites },
    { merge: true },
  );

  batch.set(
    adminDb.collection(COLL_PAGES).doc(idPage(chemin)),
    { chemin, vues: FieldValue.increment(1) },
    { merge: true },
  );

  // La provenance ne se compte qu'à l'entrée sur le site : sur les pages
  // suivantes, le référent est le site lui-même.
  if (nouvelleVisite) {
    const source = normaliserSource(referent);
    batch.set(
      adminDb.collection(COLL_SOURCES).doc(idSource(source)),
      { source, visites: FieldValue.increment(1) },
      { merge: true },
    );
  }

  await batch.commit();
}

export async function getStatistiquesVisites(): Promise<StatistiquesVisites> {
  const jours = adminDb.collection(COLL_JOURS);

  const joursAffiches = derniersJours(JOURS_AFFICHES);
  const aujourdhui = jourParis();
  const moisEnCours = aujourdhui.slice(0, 7);

  // Les dates recherchées sont connues d'avance : on lit ces documents-là
  // plutôt que d'ordonner la collection. Un `orderBy` décroissant sur
  // l'identifiant exigerait un index composite à créer à la main dans la
  // console Firebase, que cette lecture directe évite.
  const idsUtiles = [...new Set([...joursDuMois(), ...joursAffiches])];

  const [global, quotidiens, premier, pages, sources] = await Promise.all([
    adminDb.collection(COLL_GLOBAL).doc(DOC_GLOBAL).get(),
    adminDb.getAll(...idsUtiles.map(id => jours.doc(id))),
    // L'ordre croissant sur l'identifiant, lui, est fourni d'office.
    jours.orderBy(FieldPath.documentId(), 'asc').limit(1).get(),
    adminDb.collection(COLL_PAGES).orderBy('vues', 'desc').limit(PAGES_AFFICHEES).get(),
    adminDb.collection(COLL_SOURCES).orderBy('visites', 'desc').limit(SOURCES_AFFICHEES).get(),
  ]);

  const parJour = new Map<string, number>();
  for (const doc of quotidiens) {
    if (doc.exists) parJour.set(doc.id, Number(doc.data()?.visites) || 0);
  }

  let visitesCeMois = 0;
  for (const [date, visites] of parJour) {
    if (date.startsWith(moisEnCours)) visitesCeMois += visites;
  }

  return {
    totalVisites: Number(global.data()?.visites) || 0,
    totalVues: Number(global.data()?.vues) || 0,
    visitesAujourdhui: parJour.get(aujourdhui) ?? 0,
    visitesCeMois,
    depuis: premier.docs[0]?.id ?? null,
    // Les jours sans visite n'ont pas de document : on les rétablit à zéro pour
    // que le graphique garde un pas de temps régulier.
    jours: joursAffiches.map(date => ({
      date,
      visites: parJour.get(date) ?? 0,
    })),
    pages: pages.docs.map(doc => ({
      chemin: String(doc.data().chemin ?? '/'),
      vues: Number(doc.data().vues) || 0,
    })),
    sources: sources.docs.map(doc => ({
      source: String(doc.data().source ?? SOURCE_AUTRE),
      visites: Number(doc.data().visites) || 0,
    })),
  };
}
