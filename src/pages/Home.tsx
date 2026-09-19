import { articles } from '../data/journal';
import { featuredProjects } from '../data/projects';
import { Link } from '../lib/router';
import { usePageMeta } from '../lib/usePageMeta';
import { Hero } from '../components/Hero';
import { OptimizedImage } from '../components/OptimizedImage';
import { Reveal } from '../components/Reveal';
import { WorkItem } from '../components/WorkItem';

/**
 * Home: cinematic hero, then an editorial composition of selected work —
 * varied spans and offsets rather than a uniform card grid.
 */
export function Home() {
  usePageMeta({
    description:
      'Chris Muscat is a photographer based in Melbourne. Editorial, portrait, fashion and architectural photography — selected work 2019–2026.',
    image: 'site/hero',
    path: '/',
  });

  const featured = featuredProjects.slice(0, 5);
  const notes = articles.slice(0, 2);

  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="selected-work">
        <Reveal className="section__head">
          <h2 id="selected-work" className="section__title">
            Selected Work
          </h2>
          <Link to="/work" className="section__link">
            View all →
          </Link>
        </Reveal>

        <div className="editorial-grid">
          {featured.map((p, i) => (
            <Reveal key={p.id} className={`editorial-grid__cell editorial-grid__cell--${i}`} delay={i * 60}>
              <WorkItem
                project={p}
                sizes="(min-width: 1024px) 60vw, (min-width: 768px) 70vw, 100vw"
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section--statement" aria-label="Statement">
        <Reveal>
          <p className="statement">
            Photographs made slowly — <em>available light, long pauses,</em> and the
            conviction that restraint is a form of attention.
          </p>
        </Reveal>
      </section>

      <section className="section" aria-labelledby="journal-teaser">
        <Reveal className="section__head">
          <h2 id="journal-teaser" className="section__title">
            The Journal
          </h2>
          <Link to="/journal" className="section__link">
            All entries →
          </Link>
        </Reveal>

        <div className="journal-teaser">
          {notes.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <Link to={`/journal/${a.slug}`} className="journal-teaser__item" data-cursor="Read">
                <OptimizedImage
                  src={a.hero}
                  alt={a.title}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="journal-teaser__image"
                />
                <div className="journal-teaser__body">
                  <p className="journal-teaser__meta">
                    {a.category} · {new Date(a.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="journal-teaser__title">{a.title}</h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
