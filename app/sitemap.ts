import { MetadataRoute } from 'next'
import { getActualitesAdmin } from '@/lib/firebase/fetchers'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://site-aafd.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/actualites`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/notre-association`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/nous-rejoindre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/nous-soutenir`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/vente-plats`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/temoignages`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  let actualitePages: MetadataRoute.Sitemap = []
  try {
    const actualites = await getActualitesAdmin()
    actualitePages = actualites.map((actu) => ({
      url: `${siteUrl}/actualites/${actu.id}`,
      lastModified: actu.uploadedAt ? new Date(actu.uploadedAt) : new Date(actu.date),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error('Sitemap: erreur lors du chargement des actualités', e)
  }

  return [...staticPages, ...actualitePages]
}
