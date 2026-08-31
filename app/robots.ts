import { MetadataRoute } from 'next'
import { SITE_URL as siteUrl } from '@/lib/siteConfig'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/nous-soutenir'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
