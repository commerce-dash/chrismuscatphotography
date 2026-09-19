import {
  AnchorHTMLAttributes,
  MouseEvent,
  forwardRef,
  useCallback,
  useSyncExternalStore,
} from 'react';

/**
 * Minimal client-side router tuned for GitHub Pages.
 *
 * Uses the History API for clean URLs. Deep links and refreshes are handled
 * by public/404.html + the restore script in index.html.
 */

const BASE = import.meta.env.BASE_URL as string; // '/' or '/repo-name/'
const NAV_EVENT = 'app:navigate';

/** '/repo-name/work/foo' -> '/work/foo' */
export function stripBase(pathname: string): string {
  const bare = BASE.slice(0, -1); // '/repo-name'
  if (BASE !== '/' && (pathname.startsWith(BASE) || pathname === bare)) {
    const rest = pathname.slice(bare.length);
    return rest === '' ? '/' : rest.replace(/\/$/, '');
  }
  return pathname.replace(/\/$/, '') || '/';
}

/** '/work/foo' -> '/repo-name/work/foo' */
export function withBase(path: string): string {
  if (path === '/') return BASE;
  return BASE === '/' ? path : `${BASE.slice(0, -1)}${path}`;
}

function currentPath(): string {
  return stripBase(window.location.pathname);
}

export function navigate(to: string): void {
  if (to === currentPath()) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history.pushState({}, '', withBase(to));
  window.dispatchEvent(new Event(NAV_EVENT));
  window.scrollTo(0, 0);
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('popstate', callback);
  window.addEventListener(NAV_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(NAV_EVENT, callback);
  };
}

export function usePath(): string {
  return useSyncExternalStore(subscribe, currentPath, () => '/');
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

/**
 * Anchor that routes client-side. Falls back to a normal navigation for
 * modified clicks (cmd/ctrl/shift/alt, middle click, target=_blank).
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, onClick, children, ...rest },
  ref
) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        rest.target === '_blank'
      ) {
        return;
      }
      event.preventDefault();
      navigate(to);
    },
    [to, onClick, rest.target]
  );

  return (
    <a ref={ref} href={withBase(to)} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
});
