import { getServerSideSitemap } from 'next-sitemap'
import { HEALTH_HUB_ARTICLES } from '@/data/healthHubData'

export const dynamic = 'force-dynamic'

// Health Hub articles: the curated ones in src/data plus tips published from the admin panel
export async function GET() {
  const paths = new Set<string>(HEALTH_HUB_ARTICLES.map((a) => a.slug || a._id))

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apex-backend-theta.vercel.app/api'
    const response = await fetch(`${API_BASE_URL}/health-hub`, {
      next: { revalidate: 3600 },
    })
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data)) {
        for (const tip of data) {
          // External-link tips open another site, so they have no page of their own
          if (tip?._id && tip.mediaType !== 'url') paths.add(String(tip._id))
        }
      }
    }
  } catch (error) {
    console.error('Error fetching health hub tips for sitemap:', error)
  }

  const fields = Array.from(paths).map((slug) => ({
    loc: `https://www.pillora.in/health-hub/${encodeURIComponent(slug)}`,
    lastmod: new Date().toISOString(),
    changefreq: 'monthly' as const,
    priority: 0.7,
  }))

  return getServerSideSitemap(fields)
}
