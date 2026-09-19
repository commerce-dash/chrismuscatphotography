import { articles } from '../data/journal';
import { Link } from '../lib/router';
import { usePageMeta } from '../lib/usePageMeta';
import { OptimizedImage } from '../components/OptimizedImage';
import { Reveal } from '../components/Reveal';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/**
 * Journal index — an editorial list, not a card wall. Alternating
 * image/text rows with quiet metadata.
 */
export function Journal() {
  usePageMeta({
    title: 'Journal',
    description:
      'Stories, field notes and process — behind the scenes, locations, equipment and travel, from the studio of Chris Muscat.',
    path: '/journal',
  });

  return (
    <>
      <header className="page-head">
        <Reveal>
          <h1 className="page-head__title">The Journal</h1>
          <p className="page-head__sub">Stories · Process · Locations · Equipment</p>
        </Reveal>
      </header>

      <section className="section section--flush">
        {articles.map((a, i) => (
          <Reveal key={a.slug}>
            <Link
              to={`/journal/${a.slug}`}
              className={`journal-row ${i % 2 ? 'journal-row--flip' : ''}`}
              data-cursor="Read"
            >
              <OptimizedImage
                src={a.hero}
                alt={a.title}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="journal-row__image"
              />
              <div className="journal-row__body">
                <p className="journal-row__meta">
                  {a.category} — {formatDate(a.date)}
                </p>
                <h2 className="journal-row__title">{a.title}</h2>
                <p className="journal-row__excerpt">{a.excerpt}</p>
                <span className="journal-row__more">Read →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
    </>
  );
}
