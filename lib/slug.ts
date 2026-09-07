export function buildSlug(title: string): string {
  const slug = String(title ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-+|-+$/g, '');

  return slug || 'actualite';
}

export function actualiteHref(actu: { id: string; slug?: string }): string {
  return `/actualites/${actu.slug || actu.id}`;
}

export function looksLikeFirestoreId(value: string): boolean {
  return /^[A-Za-z0-9]{20}$/.test(value);
}
