import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'

// Blog post sitemap, built from the live blog API.
// lastmod comes from the post's own dates (not "now"), and if the API is
// unavailable the sitemap is empty rather than listing guessed URLs.
export const revalidate = 3600

export async function GET() {
  let fields: ISitemapField[] = []

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apex-backend-theta.vercel.app/api'
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })

    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data)) {
        fields = data
          .filter((blog: any) => blog && (blog.slug || blog._id))
          .map((blog: any) => {
            const d = new Date(blog.updatedAt || blog.date || blog.createdAt || '')
            return {
              loc: `https://www.pillora.in/blog/${blog.slug || blog._id}`,
              ...(isNaN(d.getTime()) ? {} : { lastmod: d.toISOString() }),
              changefreq: 'weekly' as const,
              priority: 0.8,
            }
          })
      }
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  return getServerSideSitemap(fields)
}
