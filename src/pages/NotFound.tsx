import { Link } from '../lib/router';
import { usePageMeta } from '../lib/usePageMeta';
import { Reveal } from '../components/Reveal';

interface NotFoundProps {
  kind?: 'page' | 'project' | 'article';
}

const LABEL = {
  page: 'Page not found',
  project: 'Project not found',
  article: 'Article not found',
};

export function NotFound({ kind = 'page' }: NotFoundProps) {
  usePageMeta({ title: LABEL[kind], description: 'The requested page does not exist.' });

  return (
    <div className="notfound">
      <Reveal>
        <p className="notfound__code">404</p>
        <h1 className="notfound__title">{LABEL[kind]}</h1>
        <Link to="/work" className="notfound__link">
          Return to Work →
        </Link>
      </Reveal>
    </div>
  );
}
