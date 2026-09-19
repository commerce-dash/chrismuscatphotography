/**
 * Generates public/sitemap.xml and public/robots.txt from the project and
 * journal data. Runs automatically before `vite dev` and `vite build`, so new
 * projects are added to the sitemap as soon as they exist in src/data.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const siteUrl = (
  process.env.VITE_SITE_URL || 'https://commerce-dash.github.io/chrismuscatphotography'
).replace(/\/$/, '');

const slugs = async (file) => {
  const src = await readFile(join(root, 'src', 'data', file), 'utf8');
  return [...src.matchAll(/slug:\s*'([\w-]+)'/g)].map((m) => m[1]);
};

const [projects, articles] = await Promise.all([slugs('projects.ts'), slugs('journal.ts')]);

const routes = [
  '/',
  '/work',
  '/about',
  '/journal',
  '/contact',
  ...projects.map((s) => `/work/${s}`),
  ...articles.map((s) => `/journal/${s}`),
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

Sitemap: ${siteUrl}/sitemap.xml
`;

await writeFile(join(root, 'public', 'sitemap.xml'), sitemap);
await writeFile(join(root, 'public', 'robots.txt'), robots);
console.log(`sitemap.xml: ${routes.length} routes -> ${siteUrl}`);
