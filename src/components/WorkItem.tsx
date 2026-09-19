import { CSSProperties } from 'react';
import { Project } from '../data/projects';
import { Link } from '../lib/router';
import { OptimizedImage } from './OptimizedImage';

interface WorkItemProps {
  project: Project;
  /** CSS classes controlling grid placement / aspect on editorial grids. */
  className?: string;
  sizes?: string;
  style?: CSSProperties;
  eager?: boolean;
}

/**
 * A project in a listing: image + quiet caption. Hover is a gentle image
 * scale and a caption underline — nothing else moves.
 */
export function WorkItem({ project, className = '', sizes, style, eager }: WorkItemProps) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className={`work-item ${className}`}
      style={style}
      data-cursor="View"
      aria-label={`${project.title} — ${project.category}, ${project.year}. View project`}
    >
      <figure className="work-item__figure">
        <OptimizedImage
          src={project.coverImage}
          alt={`${project.title} — ${project.category} photography, ${project.location}`}
          sizes={sizes ?? '(min-width: 768px) 50vw, 100vw'}
          eager={eager}
          className="work-item__image"
        />
      </figure>
      <div className="work-item__caption">
        <h3 className="work-item__title">{project.title}</h3>
        <p className="work-item__meta">
          {project.category} · {project.year}
        </p>
      </div>
    </Link>
  );
}
