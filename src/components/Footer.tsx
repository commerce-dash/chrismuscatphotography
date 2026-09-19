import { Link } from '../lib/router';
import { SITE } from '../lib/site';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <Link to="/" className="footer__brand">
          {SITE.name}
        </Link>

        <nav className="footer__nav" aria-label="Footer">
          {SITE.nav.map((l) => (
            <Link key={l.path} to={l.path}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="footer__contact">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
            {SITE.instagramHandle}
          </a>
        </div>
      </div>

      <div className="footer__base">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span>{SITE.locations}</span>
      </div>
    </footer>
  );
}
