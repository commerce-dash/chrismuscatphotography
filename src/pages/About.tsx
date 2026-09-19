import { about } from '../data/about';
import { SITE } from '../lib/site';
import { usePageMeta } from '../lib/usePageMeta';
import { OptimizedImage } from '../components/OptimizedImage';
import { Reveal } from '../components/Reveal';
import { Link } from '../lib/router';

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="about__list">
      <h3 className="about__list-title">{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function About() {
  usePageMeta({
    title: 'About',
    description: `${SITE.name} is a photographer based in ${SITE.location} — editorial, portrait and architectural photography.`,
    image: about.portrait,
    path: '/about',
  });

  return (
    <article className="about">
      <div className="about__grid">
        <Reveal className="about__media">
          <OptimizedImage
            src={about.portrait}
            alt={`Portrait of ${SITE.name}`}
            sizes="(min-width: 1024px) 42vw, 100vw"
            eager
          />
        </Reveal>

        <div className="about__body">
          <Reveal>
            <p className="about__overline">{SITE.location}</p>
            <h1 className="about__name">{SITE.name}</h1>
            <div className="about__bio">
              {about.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Link to="/contact" className="about__cta">
              Work together →
            </Link>
          </Reveal>

          <Reveal className="about__lists" delay={80}>
            <List title="Selected Clients" items={about.clients} />
            <List title="Publications" items={about.publications} />
            <List title="Awards" items={about.awards} />
            <List title="Exhibitions" items={about.exhibitions} />
          </Reveal>
        </div>
      </div>
    </article>
  );
}
