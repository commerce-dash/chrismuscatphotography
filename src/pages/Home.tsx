import { featuredProjects } from '../data/projects';
import { Link } from '../lib/router';
import { SITE } from '../lib/site';
import { usePageMeta } from '../lib/usePageMeta';
import { Hero } from '../components/Hero';
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

  // Every featured project renders; the five-position editorial
  // composition repeats per row group.
  const featured = featuredProjects;

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
            <Reveal key={p.id} className={`editorial-grid__cell editorial-grid__cell--${i % 5}`} delay={i * 60}>
              <WorkItem
                project={p}
                sizes="(min-width: 1024px) 60vw, (min-width: 768px) 70vw, 100vw"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {SITE.home.showStatement && (
        <section className="section section--statement" aria-label="Statement">
          <Reveal>
            <p className="statement">{SITE.statement}</p>
          </Reveal>
        </section>
      )}
    </>
  );
}
