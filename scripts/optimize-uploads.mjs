/**
 * One-shot: re-encode CMS-uploaded originals in public/images/uploads to
 * <=2560px WebP (q85) so full-size camera files don't bloat the repo.
 * Keeps the basename (content references resolve extension-agnostically).
 * Run: node scripts/optimize-uploads.mjs
 */
import { readdir, stat, rename, unlink, access } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'uploads');
// webp files are already optimized masters — skip them to avoid a
// lossy re-encode on every run.
const ORIGINAL = /\.(jpe?g|png|avif)$/i;
const GENERATED = /-\d{3,4}\.(webp|avif)$/i;

const files = (await readdir(dir)).filter((f) => ORIGINAL.test(f) && !GENERATED.test(f));
let done = 0, saved = 0;

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

for (const file of files) {
  const src = join(dir, file);
  const name = file.slice(0, -extname(file).length);
  // A master .webp with this name may already exist (e.g. camera counter
  // reused across shoots) — pick a -2/-3 suffix instead of overwriting it.
  let out = name;
  for (let i = 2; await exists(join(dir, `${out}.webp`)); i++) out = `${name}-${i}`;
  const dest = join(dir, `${out}.webp`);
  const before = (await stat(src)).size;
  const img = sharp(src).rotate(); // honour EXIF orientation
  const meta = await img.metadata();
  const buf = await img
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  const tmp = `${dest}.tmp`;
  await (await import('node:fs/promises')).writeFile(tmp, buf);
  if (src !== dest) await unlink(src);
  await rename(tmp, dest);
  saved += before - buf.length;
  console.log(`${file} -> ${out}.webp  ${(before / 1e6).toFixed(1)}MB -> ${(buf.length / 1e3).toFixed(0)}KB  (${meta.width}x${meta.height})`);
  done++;
}

console.log(`Done: ${done} originals re-encoded, ${(saved / 1e6).toFixed(0)}MB saved.`);
