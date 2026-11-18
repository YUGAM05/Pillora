import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'

// Dynamic sitemap for pages generated from API data: hospital detail pages and
// Health Hub tips from the database. Curated Health Hub articles are pre-rendered
// and already listed in sitemap-0.xml; blog posts are in /blog-sitemap.xml.
export const revalidate = 3600

const SITE = 'https://www.pillora.in'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apex-backend-theta.vercel.app/api'

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

const iso = (d?: string) => {
  const t = d ? new Date(d) : null
  return t && !isNaN(t.getTime()) ? t.toISOString() : undefined
}

export async function GET() {
  const fields: ISitemapField[] = []

  const hospitals = await getJson<Array<{ slug?: string; _id: string; updatedAt?: string }>>('/hospitals')
  for (const h of Array.isArray(hospitals) ? hospitals : []) {
    fields.push({
      loc: `${SITE}/hospitals/${h.slug || h._id}`,
      lastmod: iso(h.updatedAt),
      changefreq: 'weekly',
      priority: 0.7,
    })
  }

  const tips = await getJson<Array<{ _id: string; date?: string; updatedAt?: string }>>('/health-hub')
  for (const t of Array.isArray(tips) ? tips : []) {
    fields.push({ loc: `${SITE}/health-hub/${t._id}`, lastmod: iso(t.updatedAt || t.date), changefreq: 'monthly', priority: 0.5 })
  }

  return getServerSideSitemap(fields)
}
