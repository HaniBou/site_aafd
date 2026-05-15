import type { Metadata } from 'next'
import { getActualiteByIdAdmin } from '@/lib/firebase/fetchers'
import ActualiteDetailClient from '@/components/ActualiteDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const actualite = await getActualiteByIdAdmin(id)

  if (!actualite) {
    return {
      title: 'Actualité introuvable',
      description: "Cette actualité n'existe pas ou a été supprimée.",
    }
  }

  const description = actualite.content.length > 160
    ? actualite.content.substring(0, 157) + '...'
    : actualite.content

  return {
    title: actualite.title,
    description,
    alternates: {
      canonical: `/actualites/${id}`,
    },
    openGraph: {
      title: actualite.title,
      description,
      url: `/actualites/${id}`,
      type: 'article',
      publishedTime: actualite.date,
      ...(actualite.image && actualite.image !== 'none'
        ? { images: [{ url: actualite.image, alt: actualite.title }] }
        : {}),
    },
  }
}

export default async function ActualiteDetailPage({ params }: Props) {
  const { id } = await params
  return <ActualiteDetailClient id={id} />
}
