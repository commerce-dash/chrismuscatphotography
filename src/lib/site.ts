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

interface SiteConfig {
  name: string;
  role: string;
  location: string;
  locations: string;
  email: string;
  instagram: string;
  instagramHandle: string;
  statement: string;
  nav: NavItem[];
}

export const SITE: SiteConfig & { url: string } = {
  ...(siteJson as SiteConfig),
  url: (
    (import.meta.env.VITE_SITE_URL as string | undefined) ??
    'https://chrismuscatphotography.com'
  ).replace(/\/$/, ''),
};
