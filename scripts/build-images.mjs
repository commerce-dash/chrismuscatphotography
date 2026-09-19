/**
 * Image pipeline.
 *
 *   node scripts/build-images.mjs
 *
 * For every entry in image-manifest.mjs this script:
 *   1. Downloads a master JPEG (picsum.photos placeholder photography)
 *   2. Emits responsive WebP files: public/images/{name}-{width}.webp
 *   3. Emits a tiny blur placeholder -> src/data/placeholders.json
 *   4. Emits intrinsic dimensions + available widths -> src/data/image-meta.json
 *
 * The script is idempotent: images that already exist are skipped, so adding a
 * new manifest entry only fetches the new file. Real photography can be dropped
 * into public/images/ using the same {name}-{width}.webp convention.
 */

import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import manifest from './image-manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images');
const metaPath = join(root, 'src', 'data', 'image-meta.json');
const placeholdersPath = join(root, 'src', 'data', 'placeholders.json');

const OUTPUT_WIDTHS = [800, 1200, 1600, 2400];
const CONCURRENCY = 4;

const exists = (p) => access(p).then(() => true).catch(() => false);

async function fetchMaster(entry, attempt = 0) {
  const url = `https://picsum.photos/seed/${entry.seed}/${entry.w}/${entry.h}.jpg`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (attempt < 2) return fetchMaster(entry, attempt + 1);
    throw new Error(`Failed to fetch ${url}: ${err.message}`);
  }
}

async function buildEntry(entry) {
  const widths = OUTPUT_WIDTHS.filter((w) => w <= entry.w);
  const first = join(outDir, `${entry.name}-${widths[0]}.webp`);
  if (await exists(first)) return { entry, widths, skipped: true };

  const master = await fetchMaster(entry);
  const target = join(outDir, dirname(entry.name));
  await mkdir(target, { recursive: true });

  await Promise.all(
    widths.map((w) =>
      sharp(master)
        .resize({ width: w })
        .webp({ quality: 78 })
        .toFile(join(outDir, `${entry.name}-${w}.webp`))
    )
  );

  const placeholder = await sharp(master)
    .resize({ width: 24 })
    .webp({ quality: 40 })
    .toBuffer();

  return {
    entry,
    widths,
    placeholder: `data:image/webp;base64,${placeholder.toString('base64')}`,
    skipped: false,
  };
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(dirname(metaPath), { recursive: true });

  let meta = {};
  let placeholders = {};
  try {
    meta = JSON.parse(await readFile(metaPath, 'utf8'));
    placeholders = JSON.parse(await readFile(placeholdersPath, 'utf8'));
  } catch {
    /* first run */
  }

  let downloaded = 0;
  let skipped = 0;

  for (let i = 0; i < manifest.length; i += CONCURRENCY) {
    const batch = manifest.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(buildEntry));
    for (const r of results) {
      meta[r.entry.name] = { w: r.entry.w, h: r.entry.h, widths: r.widths };
      if (r.placeholder) placeholders[r.entry.name] = r.placeholder;
      r.skipped ? skipped++ : downloaded++;
    }
    process.stdout.write(`\rimages: ${Math.min(i + CONCURRENCY, manifest.length)}/${manifest.length}`);
  }

  await writeFile(metaPath, JSON.stringify(meta, null, 2));
  await writeFile(placeholdersPath, JSON.stringify(placeholders));
  console.log(`\nDone. ${downloaded} downloaded, ${skipped} already present.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
