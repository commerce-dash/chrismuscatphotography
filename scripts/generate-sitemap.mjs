/**
 * Generates public/sitemap.xml and public/robots.txt from the project
 * data. Runs automatically before `vite dev` and `vite build`, so new
 * projects are added to the sitemap as soon as they exist in content/.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const siteUrl = (
  process.env.VITE_SITE_URL || 'https://chrismuscatphotography.com'
).replace(/\/$/, '');

const slugs = async (dir) => {
  const files = await readdir(join(root, 'content', dir));
  return Promise.all(
    files
      .filter((f) => f.endsWith('.json'))
      .map(async (f) => {
        const fileSlug = f.replace(/\.json$/, '');
        try {
          const json = JSON.parse(await readFile(join(root, 'content', dir, f), 'utf8'));
          return json.slug || fileSlug;
        } catch {
          return fileSlug;
        }
      })
  );
};

const projects = await slugs('projects');

const routes = [
  '/',
  '/work',
  '/about',
  '/search',
  '/contact',
  ...projects.map((s) => `/work/${s}`),
];

const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`;

await writeFile(join(root, 'public', 'sitemap.xml'), sitemap);
await writeFile(join(root, 'public', 'robots.txt'), robots);
console.log(`sitemap.xml: ${routes.length} routes -> ${siteUrl}`);
