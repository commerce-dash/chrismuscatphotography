/**
 * Site-wide configuration. Change these values to re-skin the portfolio
 * for a different photographer — nothing else needs to change.
 */
export const SITE = {
  name: 'Chris Muscat',
  role: 'Photographer',
  location: 'Melbourne',
  locations: 'Melbourne · Sydney',
  email: 'hello@chrismuscatphotography.com',
  instagram: 'https://instagram.com/chrismuscatphotography',
  instagramHandle: '@chrismuscatphotography',
  url: (
    (import.meta.env.VITE_SITE_URL as string | undefined) ??
    'https://commerce-dash.github.io/chrismuscatphotography'
  ).replace(/\/$/, ''),
} as const;
