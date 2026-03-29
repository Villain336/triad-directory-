/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://triaddirectory.com",
  generateRobotsTxt: false,
  generateIndexSitemap: false,
};
