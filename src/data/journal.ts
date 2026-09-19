/**
 * Journal data — loaded from content/journal/*.json so the CMS (/admin)
 * can create and edit articles. Ordered by date, newest first.
 */

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'image'; src: string; caption?: string };

export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO
  excerpt: string;
  hero: string;
  intro: string;
  body: ArticleBlock[];
  relatedProjects: string[]; // project slugs
}

type ArticleJson = Omit<Article, 'slug'>;

const files = import.meta.glob('../../content/journal/*.json', { eager: true });

export const articles: Article[] = Object.entries(files)
  .map(([path, mod]) => {
    const slug = path.split('/').pop()!.replace(/\.json$/, '');
    const data = (mod as { default: ArticleJson }).default;
    return { slug, ...data };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function articleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
