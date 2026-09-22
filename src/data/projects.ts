/**
 * Portfolio data — loaded from content/projects/*.json so the CMS
 * (/admin) can edit it. Adding a project in the CMS creates a JSON file;
 * this loader turns the folder into typed data. Nothing else changes.
 *
 * `images`/`coverImage` may be managed names ('projects/slug/01') or
 * public paths ('/images/uploads/photo.jpg') — src/lib/images.ts
 * normalizes both.
 *
 * Gallery blocks compose each project page:
 *   full    — one edge-to-edge photograph
 *   feature — one large photograph, inset
 *   pair    — two photographs, side by side
 *   offset  — photographs on an asymmetric staggered grid
 *   trio    — one tall anchor beside two stacked horizontals
 *   mosaic  — many photos as a seamless edge-to-edge square grid
 */

export const CATEGORIES = [
  'All',
  'Urban',
  'Travel',
  'Portraits',
  'Family',
  'Music',
  'Animals',
  'Landscapes',
] as const;

export type Category = (typeof CATEGORIES)[number];

export type BlockLayout =
  | 'full'
  | 'feature'
  | 'pair'
  | 'offset'
  | 'trio'
  | 'mosaic';

export interface GalleryBlock {
  layout: BlockLayout;
  images: string[];
  caption?: string;
  /** trio only — which side the first (tall) image sits on. Default left. */
  side?: 'left' | 'right';
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: Exclude<Category, 'All'>;
  year: number;
  /** Optional end year for work spanning a period, e.g. 2019–2026. */
  yearTo?: number;
  location?: string;
  description?: string;
  coverImage: string;
  blocks: GalleryBlock[];
  featured: boolean;
  /** Lower = earlier in listings. CMS-managed. */
  order?: number;
  tags: string[];
}

type ProjectJson = Omit<Project, 'id' | 'slug'> & { slug?: string };

const files = import.meta.glob('../../content/projects/*.json', { eager: true });

export const projects: Project[] = Object.entries(files)
  .map(([path, mod]) => {
    const fileSlug = path.split('/').pop()!.replace(/\.json$/, '');
    const { slug: dataSlug, ...data } = (mod as { default: ProjectJson }).default;
    return { id: fileSlug, slug: dataSlug || fileSlug, ...data };
  })
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export const featuredProjects = projects.filter((p) => p.featured);

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
