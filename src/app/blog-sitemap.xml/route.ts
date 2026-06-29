import { getServerSideSitemap } from 'next-sitemap'

export const dynamic = 'force-dynamic'

export async function GET() {
  let blogs = [
    'ayushman-bharat-pm-jay-guide',
    'emergency-blood-services',
    'hospital-pricing-transparency',
  ]

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apex-backend-theta.vercel.app/api'
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        // Map to slugs, fallback to _id if slug doesn't exist
        blogs = data.map((blog: any) => blog.slug || blog._id)
      }
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  const fields = blogs.map((slug) => ({
    loc: `https://www.pillora.in/blog/${slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly' as const,
    priority: 0.8,
  }))

  return getServerSideSitemap(fields)
}
