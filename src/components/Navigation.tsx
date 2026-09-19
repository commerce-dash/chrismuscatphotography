import { useEffect, useState } from 'react';
import { Link, usePath } from '../lib/router';
import { SITE } from '../lib/site';

const LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
];

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
              key={l.to}
              to={l.to}
              className={`nav__link ${isActive(l.to) ? 'nav__link--active' : ''}`}
              aria-current={isActive(l.to) ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

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
      >
        <nav className="menu__links" aria-label="Mobile">
          {LINKS.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              className="menu__link"
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
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
