import metaJson from '../data/image-meta.json';
import placeholderJson from '../data/placeholders.json';
import altJson from '../../content/image-alt.json';

/**
 * Image resolution layer.
 *
 * Every image on the site is referenced by a stable name (e.g.
 * 'projects/new-york-after-dark/01'). Files live in public/images/ following
 * the convention {name}-{width}.webp.
 *
 * CMS-managed content may store a public path instead
 * ('/images/uploads/photo.jpg' or '/images/projects/x/01-1600.webp') —
 * resolveName() maps both forms to the same managed name, so srcset,
 * placeholders and dimensions work regardless of which form is stored.
 *
 * To move photography to an external CDN or image host later, set CDN_BASE —
 * every <OptimizedImage> resolves through this module, so nothing else
 * needs to change.
 */
const CDN_BASE: string | undefined = undefined;

export interface ImageMeta {
  /** intrinsic width of the master */
  w: number;
  /** intrinsic height of the master */
  h: number;
  /** widths that exist on disk, ascending */
  widths: number[];
}

const META = metaJson as Record<string, ImageMeta>;
const PLACEHOLDERS = placeholderJson as Record<string, string>;
const ALTS = (altJson as { alts?: Record<string, string> }).alts ?? {};

const LOCAL_BASE = `${import.meta.env.BASE_URL}images/`;

/**
 * Normalize any image reference to its managed name:
 *   'projects/x/01'                    -> 'projects/x/01'
 *   '/images/projects/x/01-1600.webp'  -> 'projects/x/01'
 *   '/images/uploads/photo.jpg'        -> 'uploads/photo'
 *   'https://cdn…/x.jpg'               -> unchanged (external)
 */
export function resolveName(src: string): string {
  const m = src.match(/(?:^|\/)images\/(.+?)\.(?:jpe?g|png|webp|avif)$/i);
  if (!m) return src;
  return m[1].replace(/-\d{3,4}$/, '');
}

/** True when `src` resolves to a managed image (present in the manifest). */
export function isManagedImage(src: string): boolean {
  return resolveName(src) in META;
}

export function imageMeta(src: string): ImageMeta | undefined {
  return META[resolveName(src)];
}

export function imagePlaceholder(src: string): string | undefined {
  return PLACEHOLDERS[resolveName(src)];
}

/**
 * Reviewed alt text for a managed/CMS image (keyed by resolved name, e.g.
 * 'uploads/NIK_7833'). Editable in the CMS under Site Settings → Image Alt Text.
 */
export function imageAlt(src: string): string | undefined {
  return ALTS[resolveName(src)];
}

/**
 * Subject search across the reviewed photo library. Matches every query
 * term against the image's reviewed description plus its filename tokens.
 * Returns managed names ('uploads/…') usable directly by OptimizedImage.
 */
export function searchPhotos(query: string): string[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return Object.keys(ALTS)
    .filter((name) => {
      const haystack = `${name} ${ALTS[name]}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    })
    .sort();
}

/** Single-file URL. Defaults to the largest available width. */
export function imageSrc(src: string, width?: number): string {
  const name = resolveName(src);
  const meta = META[name];
  if (!meta) {
    // Unmanaged file (e.g. a CMS upload not yet processed): serve as-is.
    if (/^https?:\/\//.test(src)) return src;
    return src.startsWith('/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : `${LOCAL_BASE}${src}`;
  }
  const w = width ?? meta.widths[meta.widths.length - 1];
  const path = `${name}-${w}.webp`;
  return CDN_BASE ? `${CDN_BASE}${path}` : `${LOCAL_BASE}${path}`;
}

/** srcset string covering every generated width. */
export function imageSrcSet(src: string): string | undefined {
  const name = resolveName(src);
  const meta = META[name];
  if (!meta) return undefined;
  const base = CDN_BASE ?? LOCAL_BASE;
  return meta.widths.map((w) => `${base}${name}-${w}.webp ${w}w`).join(', ');
}

/** 'w / h' aspect-ratio string for CSS, preventing layout shift. */
export function imageAspect(src: string): string | undefined {
  const meta = imageMeta(src);
  return meta ? `${meta.w} / ${meta.h}` : undefined;
}
