import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import {
  getActualiteBySlugAdmin,
  getActualiteByIdAdmin,
} from '@/lib/firebase/fetchers'
import ActualiteDetail from '@/components/ActualiteDetail'
import { looksLikeFirestoreId } from '@/lib/slug'
import { SITE_URL, ASSOCIATION_NAME, ASSOCIATION_FULL_NAME } from '@/lib/siteConfig'
import { JsonLd } from '@/components/JsonLd'
import type { Actualite } from '@/types'

// Pas de `revalidate` ici volontairement : avec la mise en cache, Next sert la
// page d'erreur de notFound() avec un statut 200 (soft 404, indexé par Google).
// Vérifié : sans revalidate, /actualites/<slug-inexistant> renvoie bien 404.

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Cherche l'article par son slug. Si le segment est un ancien identifiant
 * Firestore, on retourne aussi le slug cible pour rediriger en 301.
 */
async function resolveActualite(
  slug: string,
): Promise<{ actualite: Actualite | null; redirectTo?: string }> {
  const bySlug = await getActualiteBySlugAdmin(slug)
  if (bySlug) return { actualite: bySlug }

  // Ancienne URL /actualites/<id> : les liens déjà partagés doivent survivre.
  if (looksLikeFirestoreId(slug)) {
    const byId = await getActualiteByIdAdmin(slug)
    if (byId?.slug && byId.slug !== slug) {
      return { actualite: byId, redirectTo: `/actualites/${byId.slug}` }
    }
    if (byId) return { actualite: byId }
  }

  return { actualite: null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { actualite } = await resolveActualite(slug)

  if (!actualite) {
    return {
      title: 'Actualité introuvable',
      description: "Cette actualité n'existe pas ou a été supprimée.",
      robots: { index: false, follow: false },
    }
  }

  const description =
    actualite.content.length > 160
      ? actualite.content.substring(0, 157) + '...'
      : actualite.content

  const canonical = `/actualites/${actualite.slug ?? actualite.id}`

  return {
    title: actualite.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: actualite.title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: actualite.date,
      modifiedTime: actualite.uploadedAt ?? actualite.date,
      ...(actualite.image && actualite.image !== 'none'
        ? { images: [{ url: actualite.image, alt: actualite.title }] }
        : {}),
    },
  }
}

export default async function ActualiteDetailPage({ params }: Props) {
  const { slug } = await params
  const { actualite, redirectTo } = await resolveActualite(slug)

  if (redirectTo) permanentRedirect(redirectTo)
  if (!actualite) notFound()

  const url = `${SITE_URL}/actualites/${actualite.slug ?? actualite.id}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: actualite.title,
    description: actualite.content.slice(0, 200),
    datePublished: actualite.date,
    dateModified: actualite.uploadedAt ?? actualite.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    ...(actualite.image && actualite.image !== 'none'
      ? { image: [actualite.image] }
      : {}),
    author: { '@type': 'Organization', name: `${ASSOCIATION_NAME} Val de Saône` },
    publisher: {
      '@type': 'Organization',
      name: `${ASSOCIATION_NAME} Val de Saône`,
      alternateName: ASSOCIATION_FULL_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/test-logo.webp` },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Actualités', item: `${SITE_URL}/actualites` },
      { '@type': 'ListItem', position: 3, name: actualite.title, item: url },
    ],
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ActualiteDetail actualite={actualite} />
    </>
  )
}
