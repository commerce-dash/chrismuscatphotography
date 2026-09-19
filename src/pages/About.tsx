import { SITE } from '../lib/site';
import { usePageMeta } from '../lib/usePageMeta';
import { OptimizedImage } from '../components/OptimizedImage';
import { Reveal } from '../components/Reveal';
import { Link } from '../lib/router';

const CLIENTS = ['Kinfolk', 'Cereal Magazine', 'COS', 'Aesop', 'The Row', 'Vogue Italia'];
const PUBLICATIONS = ['British Journal of Photography', 'IGNANT', 'Foam Magazine', 'The New Yorker — Photo Booth'];
const AWARDS = [
  'LensCulture Portrait Awards — Finalist, 2025',
  'International Photography Awards — Editorial, 2024',
  'PX3 Prix de la Photographie — Gold, 2023',
];
const EXHIBITIONS = [
  'The Quiet Hour — Gallery Paramo, Guadalajara, 2025',
  'New York After Dark — Site 109, New York, 2026',
  'Group show — Photo London, Somerset House, 2024',
];

function List({ title, items }: { title: string; items: string[] }) {
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
    description:
      'Chris Muscat is a photographer based in Melbourne — editorial, portrait and architectural photography.',
    image: 'site/about-portrait',
    path: '/about',
  });

  return (
    <article className="about">
      <div className="about__grid">
        <Reveal className="about__media">
          <OptimizedImage
            src="site/about-portrait"
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
              <p>
                Chris Muscat is a photographer based in Melbourne, working
                worldwide. His practice moves between editorial commissions and
                long personal projects — united by an interest in quiet light,
                honest rooms and the pause before a subject settles.
              </p>
              <p>
                Trained first as an architect, he photographs buildings the way he
                photographs people: waiting for the moment structure becomes
                atmosphere. His work has appeared in international publications and
                exhibitions, and he lectures occasionally on photographic process.
              </p>
              <p>
                He is available for editorial, portrait and select commercial
                commissions worldwide.
              </p>
            </div>
            <Link to="/contact" className="about__cta">
              Work together →
            </Link>
          </Reveal>

          <Reveal className="about__lists" delay={80}>
            <List title="Selected Clients" items={CLIENTS} />
            <List title="Publications" items={PUBLICATIONS} />
            <List title="Awards" items={AWARDS} />
            <List title="Exhibitions" items={EXHIBITIONS} />
          </Reveal>
        </div>
      </div>
    </article>
  );
}
