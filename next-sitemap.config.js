/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

// Private / utility routes: noindex on the page AND excluded from the sitemap.
// Keep in sync with PRIVATE_ROUTE_PATTERNS in src/lib/seo.ts.
const PRIVATE = [
  '/login', '/register', '/forgot-password', '/reset-password', '/auth/*',
  '/dashboard', '/cart', '/checkout', '/checkout/*', '/my-orders', '/my-orders/*',
  '/my-blood-requests', '/my-donor-profile', '/order/*', '/order-success/*',
  '/upload-prescription', '/hospital/*', '/products/*', '/lab-tests', '/safety-checker',
  '/api/*',
];

/**
 * Keep the sitemap consistent with each page's robots meta: any route whose
 * built HTML says noindex (e.g. city pages below the donor threshold, hidden
 * drafts) is left out automatically.
 */
const isNoindex = (route) => {
  const file = path.join(__dirname, '.next', 'server', 'app', `${route === '/' ? 'index' : route.replace(/^\//, '')}.html`);
  try {
    return /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(fs.readFileSync(file, 'utf8'));
  } catch {
    return false;
  }
};

module.exports = {
  siteUrl: 'https://www.pillora.in',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // Dynamic sitemaps are route handlers; don't list them as pages.
  exclude: [...PRIVATE, '/blog-sitemap.xml', '/server-sitemap.xml'],
  transform: async (config, route) => {
    if (isNoindex(route)) return null;
    return {
      loc: route,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    additionalSitemaps: [
      'https://www.pillora.in/blog-sitemap.xml',
      'https://www.pillora.in/server-sitemap.xml',
    ],
    // Drop the non-standard "Host:" directive next-sitemap adds by default.
    transformRobotsTxt: async (_config, robotsTxt) =>
      robotsTxt.replace(/\n# Host\nHost: .*\n/, '\n'),
  },
}
