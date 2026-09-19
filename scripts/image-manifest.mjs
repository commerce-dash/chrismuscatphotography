/**
 * Image manifest — the single source of truth for every photograph on the site.
 *
 * Each entry downloads a master from picsum.photos (placeholder photography)
 * and produces responsive WebP files at multiple widths plus a blur placeholder.
 *
 * To swap in real photography: replace the files in public/images/ keeping the
 * same naming convention ({name}-{width}.webp), or point a CDN at the same
 * structure and set CDN_BASE in src/lib/images.ts. Re-run `npm run images`
 * after adding entries here.
 */

const landscape = { w: 2400, h: 1600 }; // 3:2
const portrait = { w: 1600, h: 2000 }; // 4:5
const wide = { w: 2400, h: 1350 }; // 16:9

const projects = {
  'new-york-after-dark': {
    cover: portrait,
    gallery: [landscape, portrait, portrait, wide, portrait, landscape],
  },
  'silk-and-shadow': {
    cover: portrait,
    gallery: [landscape, portrait, portrait, portrait, landscape, portrait],
  },
  'form-and-void': {
    cover: landscape,
    gallery: [landscape, portrait, landscape, portrait, wide, portrait],
  },
  'the-quiet-hour': {
    cover: portrait,
    gallery: [landscape, portrait, landscape, portrait, portrait, wide],
  },
  'portraits-of-strangers': {
    cover: portrait,
    gallery: [portrait, portrait, landscape, portrait, portrait, landscape],
  },
  'terra-australis': {
    cover: landscape,
    gallery: [landscape, wide, portrait, landscape, landscape, portrait],
  },
  'sunday-morning': {
    cover: portrait,
    gallery: [portrait, landscape, portrait, portrait, landscape, portrait],
  },
  'desert-light': {
    cover: portrait,
    gallery: [wide, portrait, landscape, portrait, landscape, wide],
  },
};

const site = {
  hero: { w: 2400, h: 1500 },
  'about-portrait': portrait,
};

const entries = [];

for (const [slug, def] of Object.entries(projects)) {
  entries.push({ name: `projects/${slug}/cover`, seed: `${slug}-cover`, ...def.cover });
  def.gallery.forEach((size, i) => {
    entries.push({
      name: `projects/${slug}/${String(i + 1).padStart(2, '0')}`,
      seed: `${slug}-${i + 1}`,
      ...size,
    });
  });
}

for (const [name, size] of Object.entries(site)) {
  entries.push({ name: `site/${name}`, seed: `site-${name}`, ...size });
}

export default entries;
