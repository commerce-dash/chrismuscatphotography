import metaJson from '../data/image-meta.json';
import placeholderJson from '../data/placeholders.json';

/**
 * Image resolution layer.
 *
 * Every image on the site is referenced by a stable name (e.g.
 * 'projects/new-york-after-dark/01'). Files live in public/images/ following
 * the convention {name}-{width}.webp.
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

const LOCAL_BASE = `${import.meta.env.BASE_URL}images/`;

export function imageMeta(name: string): ImageMeta | undefined {
  return META[name];
}

export function imagePlaceholder(name: string): string | undefined {
  return PLACEHOLDERS[name];
}

/** True when `name` is a managed image (present in the generated manifest). */
export function isManagedImage(name: string): boolean {
  return name in META;
}

/** Single-file URL. Defaults to the largest available width. */
export function imageSrc(name: string, width?: number): string {
  const meta = META[name];
  const w = width ?? meta?.widths[meta.widths.length - 1] ?? 1600;
  const path = `${name}-${w}.webp`;
  return CDN_BASE ? `${CDN_BASE}${path}` : `${LOCAL_BASE}${path}`;
}

/** srcset string covering every generated width. */
export function imageSrcSet(name: string): string | undefined {
  const meta = META[name];
  if (!meta) return undefined;
  return meta.widths.map((w) => `${imageSrc(name, w)} ${w}w`).join(', ');
}

/** 'w / h' aspect-ratio string for CSS, preventing layout shift. */
export function imageAspect(name: string): string | undefined {
  const meta = META[name];
  return meta ? `${meta.w} / ${meta.h}` : undefined;
}
