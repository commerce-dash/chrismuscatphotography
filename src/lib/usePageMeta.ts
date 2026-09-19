import { useEffect } from 'react';
import { SITE } from './site';
import { imageSrc } from './images';
import { stripBase } from './router';

interface PageMeta {
  /** Page-specific title; the site name is appended automatically. */
  title?: string;
  description?: string;
  /** Managed image name or absolute URL for og:image. */
  image?: string;
  /** Current route path for canonical/og:url (e.g. '/work/foo'). */
  path?: string;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Per-page SEO: title, description, canonical URL and social metadata.
 * Values are also set statically in index.html for crawlers that never
 * execute JavaScript.
 */
export function usePageMeta({ title, description, image, path }: PageMeta) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.role}`;
    document.title = fullTitle;

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:site_name', SITE.name);

    const pageUrl = `${SITE.url}${path ?? stripBase(window.location.pathname)}`;
    setMeta('property', 'og:url', pageUrl);
    setCanonical(pageUrl);

    if (image) {
      const url = image.startsWith('http') ? image : `${SITE.url}${imageSrc(image, 1600)}`;
      setMeta('property', 'og:image', url);
      setMeta('name', 'twitter:card', 'summary_large_image');
    }
  }, [title, description, image, path]);
}
