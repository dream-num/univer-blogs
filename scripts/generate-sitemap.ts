import { getPostsFromCache } from '../src/lib/notion';
import { writeFileSync } from 'fs';
import { join } from 'path';

function generateSitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.com';
  const postsEn = getPostsFromCache('en');
  const postsZh = getPostsFromCache('zh');

  const items: string[] = [];

  items.push(
    `<url>\n  <loc>${siteUrl}</loc>\n  <lastmod>${new Date().toISOString()}</lastmod>\n  <changefreq>daily</changefreq>\n  <priority>1.0</priority>\n</url>`,
    `<url>\n  <loc>${siteUrl}/zh/</loc>\n  <lastmod>${new Date().toISOString()}</lastmod>\n  <changefreq>daily</changefreq>\n  <priority>1.0</priority>\n</url>`
  );

  items.push(
    ...postsEn.map(post => `<url>\n  <loc>${siteUrl}/posts/${post.slug}</loc>\n  <lastmod>${new Date(post.date).toISOString()}</lastmod>\n  <changefreq>weekly</changefreq>\n  <priority>0.8</priority>\n</url>`),
    ...postsZh.map(post => `<url>\n  <loc>${siteUrl}/zh/posts/${post.slug}</loc>\n  <lastmod>${new Date(post.date).toISOString()}</lastmod>\n  <changefreq>weekly</changefreq>\n  <priority>0.8</priority>\n</url>`)
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</urlset>`;

  writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  console.log('✓ Generated sitemap.xml with', postsEn.length + postsZh.length, 'posts (en + zh)');
}

generateSitemap();