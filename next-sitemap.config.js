// Pages that need a login, are part of a flow, or are internal: keep them out of search
const PRIVATE_PATHS = [
  '/dashboard',
  '/hospital/*',
  '/cart',
  '/checkout',
  '/checkout/*',
  '/my-orders',
  '/my-orders/*',
  '/my-blood-requests',
  '/my-donor-profile',
  '/order/*',
  '/order-success/*',
  '/auth/*',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/upload-prescription',
  '/api/*',
  // Served by route handlers and listed below as their own sitemaps
  '/blog-sitemap.xml',
  '/health-hub-sitemap.xml',
]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.pillora.in',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: PRIVATE_PATHS,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/hospital/',
          '/cart',
          '/checkout',
          '/my-orders',
          '/my-blood-requests',
          '/my-donor-profile',
          '/order/',
          '/order-success/',
          '/auth/',
          '/api/',
        ],
      },
    ],
    additionalSitemaps: [
      'https://www.pillora.in/blog-sitemap.xml',
      'https://www.pillora.in/health-hub-sitemap.xml',
    ],
  },
}
