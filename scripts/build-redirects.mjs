/**
 * Emits static redirect pages into dist/ for renamed project slugs.
 * GitHub Pages can't send 301s, so each old URL gets a page with a
 * 0-second meta refresh + canonical link + JS replace — treated as a
 * permanent redirect by browsers and search engines.
 *
 * Sources per project JSON:
 *   redirect: true  + slug != filename  -> /work/<filename> -> /work/<slug>
 *   redirectFrom: ["old-slug", ...]     -> /work/<old-slug> -> /work/<slug>
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SAFE = /^[\w-]+$/;

const files = (await readdir(join(root, 'content', 'projects'))).filter((f) =>
  f.endsWith('.json')
);

let count = 0;

for (const file of files) {
  const fileSlug = file.replace(/\.json$/, '');
  let json;
  try {
    json = JSON.parse(await readFile(join(root, 'content', 'projects', file), 'utf8'));
  } catch {
    continue;
  }

  const slug = json.slug || fileSlug;
  const sources = new Set(json.redirectFrom ?? []);
  if (json.redirect && slug !== fileSlug) sources.add(fileSlug);

  for (const old of sources) {
    if (!SAFE.test(old) || old === slug) continue;
    const target = `/work/${slug}`;
    const dir = join(root, 'dist', 'work', old);
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, 'index.html'),
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="https://chrismuscatphotography.com${target}"><title>Moved</title></head><body><script>location.replace(${JSON.stringify(target)})</script><a href="${target}">This page has moved</a></body></html>\n`
    );
    count++;
  }
}

console.log(`redirects: ${count} page(s) written to dist/work/`);
