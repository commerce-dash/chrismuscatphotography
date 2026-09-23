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

import { mkdir, writeFile, access, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import manifest from './image-manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images');
// Generated size variants live outside uploads/ so the CMS asset picker
// only shows originals.
const genDir = join(outDir, 'generated');
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
  const first = join(genDir, `${entry.name}-${widths[0]}.webp`);
  if (await exists(first)) return { entry, widths, skipped: true };

  const master = await fetchMaster(entry);
  const target = join(genDir, dirname(entry.name));
  await mkdir(target, { recursive: true });

  await Promise.all(
    widths.map((w) =>
      sharp(master)
        .resize({ width: w })
        .webp({ quality: 78 })
        .toFile(join(genDir, `${entry.name}-${w}.webp`))
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
  console.log(`\nManifest: ${downloaded} downloaded, ${skipped} already present.`);

  await processUploads(meta, placeholders);
}

/**
 * Phase 2 — CMS uploads. Any original photograph dropped into
 * public/images/ (e.g. via /admin drag-and-drop) that doesn't follow the
 * generated {name}-{width}.webp convention gets the full responsive
 * WebP treatment + blur placeholder at build time.
 */
async function processUploads(meta, placeholders) {
  const ORIGINAL = /\.(jpe?g|png|webp|avif)$/i;
  const GENERATED = /-\d{3,4}\.(webp|avif)$/i;

  const files = (await readdir(outDir, { recursive: true }))
    .filter((f) => typeof f === 'string')
    .map((f) => f.replace(/\\/g, '/'));

  const uploads = files.filter(
    (f) => ORIGINAL.test(f) && !GENERATED.test(f) && !f.startsWith('generated/')
  );
  let processed = 0;

  for (const file of uploads) {
    const name = file.slice(0, -extname(file).length);
    const firstWidth = OUTPUT_WIDTHS[0];

    // A master can be replaced under the same filename (e.g. a CMS upload
    // with a colliding name). Fingerprint the file so stale variants,
    // meta and placeholders are regenerated instead of served forever.
    const abs = join(outDir, file);
    const buf = await readFile(abs);
    const sha = createHash('sha256').update(buf).digest('hex').slice(0, 16);
    if (
      meta[name]?.sha === sha &&
      (await exists(join(genDir, `${name}-${firstWidth}.webp`)))
    )
      continue;

    const image = sharp(buf);
    const info = await image.metadata();
    const w0 = info.width ?? OUTPUT_WIDTHS[OUTPUT_WIDTHS.length - 1];
    const h0 = info.height ?? w0;
    const widths = OUTPUT_WIDTHS.filter((w) => w <= w0);
    if (widths.length === 0) widths.push(w0);

    await mkdir(join(genDir, dirname(name)), { recursive: true });
    await Promise.all(
      widths.map((w) =>
        sharp(abs)
          .resize({ width: w })
          .webp({ quality: 78 })
          .toFile(join(genDir, `${name}-${w}.webp`))
      )
    );

    const placeholder = await sharp(abs)
      .resize({ width: 24 })
      .webp({ quality: 40 })
      .toBuffer();

    meta[name] = { w: w0, h: h0, widths, sha };
    placeholders[name] = `data:image/webp;base64,${placeholder.toString('base64')}`;
    processed++;
  }

  if (processed > 0) {
    await writeFile(metaPath, JSON.stringify(meta, null, 2));
    await writeFile(placeholdersPath, JSON.stringify(placeholders));
  }
  console.log(`Uploads: ${processed} processed (${uploads.length} originals found).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
