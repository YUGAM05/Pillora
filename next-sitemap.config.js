/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.pillora.in',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  additionalSitemaps: [
    'https://www.pillora.in/blog-sitemap.xml',
  ],
}
