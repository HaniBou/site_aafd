// Photos fixes du site que l'admin peut remplacer. Chaque emplacement garde
// sa photo d'origine (dans /public/images) tant qu'aucune autre n'a ete choisie.
// Les remplacements sont stockes dans le document Firestore config/photosSite.

export const EMPLACEMENTS_PHOTOS = [
  {
    cle: 'accueil_hero',
    page: 'Accueil',
    chemin: '/',
    nom: 'Grande photo du haut',
    aide: 'La première image que voient les visiteurs. Sur ordinateur elle est en hauteur, sur téléphone en largeur : gardez le sujet bien au centre.',
    defaut: '/images/hero_accueil.webp',
  },
  {
    cle: 'accueil_qui_sommes_nous',
    page: 'Accueil',
    chemin: '/',
    nom: 'Photo « Qui sommes-nous ? »',
    aide: 'À côté du texte de présentation de l’association.',
    defaut: '/images/v4.webp',
  },
  {
    cle: 'accueil_sensibiliser',
    page: 'Accueil',
    chemin: '/',
    nom: 'Carte « Sensibiliser »',
    aide: 'Première des trois cartes « Ce qui nous anime ».',
    defaut: '/images/help.webp',
  },
  {
    cle: 'accueil_creer_du_lien',
    page: 'Accueil',
    chemin: '/',
    nom: 'Carte « Créer du lien »',
    aide: 'Deuxième des trois cartes « Ce qui nous anime ».',
    defaut: '/images/v5.webp',
  },
  {
    cle: 'accueil_recolter_des_fonds',
    page: 'Accueil',
    chemin: '/',
    nom: 'Carte « Récolter des fonds »',
    aide: 'Troisième des trois cartes « Ce qui nous anime ».',
    defaut: '/images/donate.webp',
  },
  {
    cle: 'bandeau_notre_association',
    page: 'Bandeaux des pages',
    chemin: '/notre-association',
    nom: 'Notre association',
    aide: 'Bandeau très large en haut de la page : choisissez une photo en largeur, le haut et le bas seront rognés.',
    defaut: '/images/hero_nous_connaitre.webp',
  },
  {
    cle: 'bandeau_actualites',
    page: 'Bandeaux des pages',
    chemin: '/actualites',
    nom: 'Actualités',
    aide: 'Aussi affiché en haut de chaque article. Photo en largeur conseillée.',
    defaut: '/images/hero_actu.webp',
  },
  {
    cle: 'bandeau_vente_plats',
    page: 'Bandeaux des pages',
    chemin: '/vente-plats',
    nom: 'Nos plats',
    aide: 'Bandeau très large en haut de la page : choisissez une photo en largeur.',
    defaut: '/images/hero_plats.webp',
  },
  {
    cle: 'bandeau_temoignages',
    page: 'Bandeaux des pages',
    chemin: '/temoignages',
    nom: 'Témoignages',
    aide: 'Bandeau très large en haut de la page : choisissez une photo en largeur.',
    defaut: '/images/hero_temoignages.webp',
  },
  {
    cle: 'bandeau_nous_rejoindre',
    page: 'Bandeaux des pages',
    chemin: '/nous-rejoindre',
    nom: 'Nous rejoindre',
    aide: 'Bandeau très large en haut de la page : choisissez une photo en largeur.',
    defaut: '/images/hero_nous_rejoindre.webp',
  },
  {
    cle: 'bandeau_contact',
    page: 'Bandeaux des pages',
    chemin: '/contact',
    nom: 'Contact',
    aide: 'Bandeau très large en haut de la page : choisissez une photo en largeur.',
    defaut: '/images/hero_contact.webp',
  },
] as const;

export type EmplacementPhoto = (typeof EMPLACEMENTS_PHOTOS)[number];
export type ClePhoto = EmplacementPhoto['cle'];
export type PhotosSite = Record<ClePhoto, string>;

export function trouverEmplacement(cle: string): EmplacementPhoto | undefined {
  return EMPLACEMENTS_PHOTOS.find(e => e.cle === cle);
}

// Garde uniquement les remplacements valides d'un document Firestore brut.
export function lirePhotosPersonnalisees(
  data: Record<string, unknown> | undefined,
): Partial<PhotosSite> {
  const out: Partial<PhotosSite> = {};
  for (const { cle } of EMPLACEMENTS_PHOTOS) {
    const valeur = data?.[cle];
    if (typeof valeur === 'string' && valeur) out[cle] = valeur;
  }
  return out;
}

export function completerPhotos(personnalisees: Partial<PhotosSite>): PhotosSite {
  const photos = {} as PhotosSite;
  for (const { cle, defaut } of EMPLACEMENTS_PHOTOS) {
    photos[cle] = personnalisees[cle] ?? defaut;
  }
  return photos;
}
