// Transforme un titre en segment d'URL lisible.
// « Vente de plats du 12 décembre ! » → « vente-de-plats-du-12-decembre »
export function buildSlug(title: string): string {
  const slug = String(title ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-+|-+$/g, '');

  return slug || 'actualite';
}

// Lien vers un article. On retombe sur l'id tant qu'un vieux document
// n'a pas de slug.
export function actualiteHref(actu: { id: string; slug?: string }): string {
  return `/actualites/${actu.slug || actu.id}`;
}

// Un identifiant Firestore auto-généré : 20 caractères alphanumériques.
// Sert à reconnaître les anciennes URLs /actualites/<id> et à les rediriger.
export function looksLikeFirestoreId(value: string): boolean {
  return /^[A-Za-z0-9]{20}$/.test(value);
}
