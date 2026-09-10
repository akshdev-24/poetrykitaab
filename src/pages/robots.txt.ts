import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/siteConfig';

export const GET: APIRoute = () => {
  const sitemapUrl = `${SITE_URL.replace(/\/+$/, '')}/sitemap.xml`;

  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Allow: /generated/
Allow: /favicon.svg
Allow: /og-image.svg

# Disallow search query pages to prevent crawl budget waste
Disallow: /search?*
Disallow: /search/

# Sitemap Location
Sitemap: ${sitemapUrl}
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
