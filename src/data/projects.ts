/**
 * Portfolio data — the single source of truth for all projects.
 *
 * Adding a project means adding an entry here (plus its images in
 * scripts/image-manifest.mjs). No UI code needs to change.
 *
 * `images` reference managed image names resolved by src/lib/images.ts.
 * `blocks` describe the gallery composition of the project page:
 *   full    — one edge-to-edge photograph
 *   feature — one large photograph, inset
 *   pair    — two photographs, side by side
 *   offset  — two photographs on an asymmetric grid
 */

export const CATEGORIES = [
  'All',
  'Portrait',
  'Fashion',
  'Editorial',
  'Architecture',
  'Travel',
  'Lifestyle',
  'Personal',
] as const;

export type Category = (typeof CATEGORIES)[number];

export type BlockLayout = 'full' | 'feature' | 'pair' | 'offset';

export interface GalleryBlock {
  layout: BlockLayout;
  images: string[];
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: Exclude<Category, 'All'>;
  year: number;
  location: string;
  description: string;
  coverImage: string;
  blocks: GalleryBlock[];
  featured: boolean;
  tags: string[];
}

export const projects: Project[] = [
  {
    id: 'new-york-after-dark',
    slug: 'new-york-after-dark',
    title: 'New York After Dark',
    category: 'Editorial',
    year: 2026,
    location: 'New York',
    description:
      'A study of the city between midnight and dawn — empty avenues, lit windows, and the few people still awake. Shot over four winters on available light only.',
    coverImage: 'projects/new-york-after-dark/cover',
    blocks: [
      { layout: 'full', images: ['projects/new-york-after-dark/01'] },
      { layout: 'pair', images: ['projects/new-york-after-dark/02', 'projects/new-york-after-dark/03'] },
      { layout: 'feature', images: ['projects/new-york-after-dark/04'], caption: 'West 23rd Street, 3:40 am' },
      { layout: 'offset', images: ['projects/new-york-after-dark/05', 'projects/new-york-after-dark/06'] },
    ],
    featured: true,
    tags: ['portrait', 'editorial', 'night', 'city'],
  },
  {
    id: 'silk-and-shadow',
    slug: 'silk-and-shadow',
    title: 'Silk & Shadow',
    category: 'Fashion',
    year: 2025,
    location: 'Milan',
    description:
      'Commissioned editorial exploring restraint in silhouette — matte silk against raw plaster, single-source light, and long quiet pauses between frames.',
    coverImage: 'projects/silk-and-shadow/cover',
    blocks: [
      { layout: 'full', images: ['projects/silk-and-shadow/01'] },
      { layout: 'pair', images: ['projects/silk-and-shadow/02', 'projects/silk-and-shadow/03'] },
      { layout: 'full', images: ['projects/silk-and-shadow/05'] },
      { layout: 'offset', images: ['projects/silk-and-shadow/04', 'projects/silk-and-shadow/06'] },
    ],
    featured: true,
    tags: ['fashion', 'editorial', 'studio'],
  },
  {
    id: 'form-and-void',
    slug: 'form-and-void',
    title: 'Form & Void',
    category: 'Architecture',
    year: 2026,
    location: 'Copenhagen',
    description:
      'An ongoing series on Nordic minimalism — buildings reduced to mass, shadow and weather. Photographed mostly in the hour after rain.',
    coverImage: 'projects/form-and-void/cover',
    blocks: [
      { layout: 'full', images: ['projects/form-and-void/01'] },
      { layout: 'offset', images: ['projects/form-and-void/02', 'projects/form-and-void/03'] },
      { layout: 'feature', images: ['projects/form-and-void/05'], caption: 'Harbour bath, November' },
      { layout: 'pair', images: ['projects/form-and-void/04', 'projects/form-and-void/06'] },
    ],
    featured: true,
    tags: ['architecture', 'minimal', 'travel'],
  },
  {
    id: 'the-quiet-hour',
    slug: 'the-quiet-hour',
    title: 'The Quiet Hour',
    category: 'Personal',
    year: 2024,
    location: 'Melbourne',
    description:
      'Domestic light and small rituals. A personal record of one slow year — mornings at the kitchen table, the dog asleep, weather moving through the house.',
    coverImage: 'projects/the-quiet-hour/cover',
    blocks: [
      { layout: 'full', images: ['projects/the-quiet-hour/01'] },
      { layout: 'offset', images: ['projects/the-quiet-hour/02', 'projects/the-quiet-hour/03'] },
      { layout: 'pair', images: ['projects/the-quiet-hour/04', 'projects/the-quiet-hour/05'] },
      { layout: 'feature', images: ['projects/the-quiet-hour/06'] },
    ],
    featured: true,
    tags: ['personal', 'documentary', 'home'],
  },
  {
    id: 'portraits-of-strangers',
    slug: 'portraits-of-strangers',
    title: 'Portraits of Strangers',
    category: 'Portrait',
    year: 2024,
    location: 'New York',
    description:
      'Sixty-second encounters. Each portrait was made within a minute of meeting — no direction, no rehearsal, just the first honest frame.',
    coverImage: 'projects/portraits-of-strangers/cover',
    blocks: [
      { layout: 'pair', images: ['projects/portraits-of-strangers/01', 'projects/portraits-of-strangers/02'] },
      { layout: 'full', images: ['projects/portraits-of-strangers/03'] },
      { layout: 'pair', images: ['projects/portraits-of-strangers/04', 'projects/portraits-of-strangers/05'] },
      { layout: 'feature', images: ['projects/portraits-of-strangers/06'] },
    ],
    featured: true,
    tags: ['portrait', 'street', 'documentary'],
  },
  {
    id: 'terra-australis',
    slug: 'terra-australis',
    title: 'Terra Australis',
    category: 'Travel',
    year: 2025,
    location: 'Tasmania',
    description:
      'Three weeks on the Tasmanian coast — dolerite cliffs, cold water, and weather that changed faster than the light could be metered.',
    coverImage: 'projects/terra-australis/cover',
    blocks: [
      { layout: 'full', images: ['projects/terra-australis/01'] },
      { layout: 'feature', images: ['projects/terra-australis/02'], caption: 'Bay of Fires, first light' },
      { layout: 'offset', images: ['projects/terra-australis/03', 'projects/terra-australis/04'] },
      { layout: 'pair', images: ['projects/terra-australis/05', 'projects/terra-australis/06'] },
    ],
    featured: false,
    tags: ['travel', 'landscape', 'coast'],
  },
  {
    id: 'sunday-morning',
    slug: 'sunday-morning',
    title: 'Sunday Morning',
    category: 'Lifestyle',
    year: 2025,
    location: 'Boston',
    description:
      'Commissioned lifestyle story for a slow-living journal — bread, coffee, newspapers, and the particular quality of light on a brownstone stoop.',
    coverImage: 'projects/sunday-morning/cover',
    blocks: [
      { layout: 'pair', images: ['projects/sunday-morning/01', 'projects/sunday-morning/02'] },
      { layout: 'full', images: ['projects/sunday-morning/03'] },
      { layout: 'offset', images: ['projects/sunday-morning/04', 'projects/sunday-morning/05'] },
      { layout: 'feature', images: ['projects/sunday-morning/06'] },
    ],
    featured: false,
    tags: ['lifestyle', 'editorial', 'interior'],
  },
  {
    id: 'desert-light',
    slug: 'desert-light',
    title: 'Desert Light',
    category: 'Travel',
    year: 2024,
    location: 'Marrakech',
    description:
      'Heat, dust and geometry. Photographs from the medina and the Agafay desert — made mostly in the twenty minutes when the light turns horizontal.',
    coverImage: 'projects/desert-light/cover',
    blocks: [
      { layout: 'full', images: ['projects/desert-light/01'] },
      { layout: 'offset', images: ['projects/desert-light/02', 'projects/desert-light/03'] },
      { layout: 'pair', images: ['projects/desert-light/04', 'projects/desert-light/05'] },
      { layout: 'feature', images: ['projects/desert-light/06'], caption: 'Agafay, dusk' },
    ],
    featured: false,
    tags: ['travel', 'desert', 'architecture'],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
