import { articleBySlug } from '../data/journal';
import { projectBySlug } from '../data/projects';
import { Link } from '../lib/router';
import { usePageMeta } from '../lib/usePageMeta';
import { OptimizedImage } from '../components/OptimizedImage';
import { Reveal } from '../components/Reveal';
import { NotFound } from './NotFound';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export function Article({ slug }: { slug: string }) {
  const article = articleBySlug(slug);

  usePageMeta({
    title: article?.title ?? 'Article not found',
    description: article?.excerpt,
    image: article?.hero,
    path: `/journal/${slug}`,
  });

  if (!article) return <NotFound kind="article" />;

  const related = article.relatedProjects
    .map(projectBySlug)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <article className="article">
      <header className="article__head">
        <Reveal>
          <p className="article__meta">
            {article.category} — {formatDate(article.date)}
          </p>
          <h1 className="article__title">{article.title}</h1>
          <p className="article__intro">{article.intro}</p>
        </Reveal>
      </header>

      <Reveal className="article__hero">
        <OptimizedImage
          src={article.hero}
          alt={article.title}
          sizes="100vw"
          eager
        />
      </Reveal>

      <div className="article__body">
        {article.body.map((block, i) => {
          switch (block.type) {
            case 'p':
              return (
                <Reveal key={i} as="p" className="article__p">
                  {block.text}
                </Reveal>
              );
            case 'h2':
              return (
                <Reveal key={i} as="h2" className="article__h2">
                  {block.text}
                </Reveal>
              );
            case 'quote':
              return (
                <Reveal key={i} as="blockquote" className="article__quote">
                  <p>{block.text}</p>
                  {block.attribution && <cite>{block.attribution}</cite>}
                </Reveal>
              );
            case 'image':
              return (
                <Reveal key={i} as="figure" className="article__figure">
                  <OptimizedImage src={block.src} alt={block.caption ?? article.title} sizes="(min-width: 768px) 62vw, 100vw" />
                  {block.caption && <figcaption className="block__caption">{block.caption}</figcaption>}
                </Reveal>
              );
          }
        })}
      </div>

      {related.length > 0 && (
        <aside className="article__related" aria-label="Related projects">
          <h2 className="article__related-title">Related Work</h2>
          <ul>
            {related.map((p) => (
              <li key={p.id}>
                <Link to={`/work/${p.slug}`}>
                  {p.title} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
