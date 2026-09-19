import siteJson from '../../content/site.json';

/**
 * Site-wide configuration. Identity, contact details, the homepage
 * statement and the navigation menu are all CMS-editable at /admin
 * (content/site.json). `url` stays env-driven since it is build config.
 */
export interface NavItem {
  label: string;
  path: string;
}

export interface HeroConfig {
  image: string;
  overline: string;
  title: string;
  subtitle: string;
  align: 'left' | 'center';
}

export interface HomeConfig {
  showStatement: boolean;
}

export interface ThemeConfig {
  /** Editorial serif — one of the preloaded Google families. */
  serif: 'Fraunces' | 'Cormorant Garamond' | 'Playfair Display';
}

interface SiteConfig {
  name: string;
  role: string;
  location: string;
  locations: string;
  email: string;
  instagram: string;
  instagramHandle: string;
  statement: string;
  hero: HeroConfig;
  home: HomeConfig;
  theme: ThemeConfig;
  nav: NavItem[];
}

const json = siteJson as Partial<SiteConfig>;

export const SITE = {
  name: '',
  role: '',
  location: '',
  locations: '',
  email: '',
  instagram: '',
  instagramHandle: '',
  statement: '',
  nav: [] as NavItem[],
  ...json,
  hero: {
    image: 'site/hero',
    overline: '',
    title: '',
    subtitle: '',
    align: 'left' as const,
    ...json.hero,
  },
  home: { showStatement: true, ...json.home },
  theme: { serif: 'Fraunces' as ThemeConfig['serif'], ...json.theme },
  url: (
    (import.meta.env.VITE_SITE_URL as string | undefined) ??
    'https://chrismuscatphotography.com'
  ).replace(/\/$/, ''),
} as SiteConfig & { url: string };
