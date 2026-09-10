import type { APIRoute } from 'astro';
import { SITE_URL, siteConfig } from '../config/siteConfig';
import { getAllPosts } from '../utils/contentLoader';

export const GET: APIRoute = () => {
  const base = SITE_URL.replace(/\/+$/, '');
  const posts = getAllPosts();

  // Static indexable routes
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/about/', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact/', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy-policy/', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms/', priority: '0.3', changefreq: 'yearly' },
    { url: '/disclaimer/', priority: '0.3', changefreq: 'yearly' }
  ];

  // Category routes
  const categoryPages = siteConfig.categories.map((cat) => ({
    url: `/${cat.slug}/`,
    priority: '0.8',
    changefreq: 'daily'
  }));

  // Individual post routes
  const postPages = posts.map((post) => {
    let lastmod = new Date().toISOString().split('T')[0];
    try {
      lastmod = new Date(post.created_at).toISOString().split('T')[0];
    } catch {
      // fallback
    }
    return {
      url: `/${post.category}/${post.slug}/`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod
    };
  });

  const allUrls = [
    ...staticPages.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
    ...categoryPages.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
    ...postPages.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`)
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
