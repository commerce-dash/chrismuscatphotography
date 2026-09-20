import { useEffect, useState } from 'react';
import { Link, usePath } from '../lib/router';
import { SITE } from '../lib/site';

// Nav items are CMS-editable (content/site.json → Site Settings → Navigation).
const LINKS = SITE.nav;

export function Navigation() {
  const path = usePath();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu on route change and lock body scroll while open.
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (to: string) => path === to || path.startsWith(`${to}/`);

  return (
    <>
      <header className={`nav ${scrolled || open ? 'nav--solid' : ''}`}>
        <Link to="/" className="nav__brand" aria-label={`${SITE.name} — home`}>
          {SITE.name}
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`nav__link ${isActive(l.path) ? 'nav__link--active' : ''}`}
              aria-current={isActive(l.path) ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/search"
          className={`nav__search ${isActive('/search') ? 'nav__link--active' : ''}`}
          aria-label="Search photos"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </Link>

        <button
          className="nav__toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      <div
        id="mobile-menu"
        className={`menu ${open ? 'menu--open' : ''}`}
        aria-hidden={!open}
        ref={(el) => el?.toggleAttribute('inert', !open)}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('a')) setOpen(false);
        }}
      >
        <nav className="menu__links" aria-label="Mobile">
          <Link
            to="/search"
            className="menu__link"
            style={{ transitionDelay: open ? '120ms' : '0ms' }}
          >
            Search
          </Link>
          {LINKS.map((l, i) => (
            <Link
              key={l.path}
              to={l.path}
              className="menu__link"
              style={{ transitionDelay: open ? `${180 + i * 60}ms` : '0ms' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="menu__meta">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>
    </>
  );
}
