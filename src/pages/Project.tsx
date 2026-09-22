import { useMemo, useState } from 'react';
import { nextProject, projectBySlug } from '../data/projects';
import { imageAlt } from '../lib/images';
import { Link } from '../lib/router';
import { usePageMeta } from '../lib/usePageMeta';
import { Lightbox } from '../components/Lightbox';
import { OptimizedImage } from '../components/OptimizedImage';
import { Reveal } from '../components/Reveal';
import { NotFound } from './NotFound';

/**
 * Project page — a digital exhibition. The gallery composition is described
 * by blocks in the project data (full / feature / pair / offset); clicking
 * any photograph opens the immersive viewer.
 */
export function Project({ slug }: { slug: string }) {
  const project = projectBySlug(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxImages = useMemo(
    () =>
      project
        ? project.blocks.flatMap((b) =>
            b.images.map((src) => ({
              src,
              alt: imageAlt(src) ?? `${project.title} — photograph`,
            }))
          )
        : [],
    [project]
  );

  usePageMeta({
    title: project?.title ?? 'Project not found',
    description: project?.description,
    image: project?.coverImage,
    path: `/work/${slug}`,
  });

  if (!project) {
    return <NotFound kind="project" />;
  }

  // Flat index of each image for the lightbox.
  const indexOf = (block: number, within: number) =>
    project.blocks.slice(0, block).reduce((n, b) => n + b.images.length, 0) + within;

  const next = nextProject(slug);

  return (
    <article className="project">
      <header className="project__head">
        <Reveal>
          <p className="project__overline">
            {project.category} — {project.location} — {project.year}
          </p>
          <h1 className="project__title">{project.title}</h1>
          {project.description && (
            <p className="project__desc">{project.description}</p>
          )}
        </Reveal>
      </header>

      <div className="project__gallery">
        {project.blocks.map((block, bi) => (
          <div key={bi} className={`block block--${block.layout}`}>
            {block.images.map((src, ii) => {
              const flatIndex = indexOf(bi, ii);
              return (
                <Reveal as="figure" key={src} className={`block__item block__item--${ii}`}>
                  <button
                    type="button"
                    className="block__button"
                    onClick={() => setLightboxIndex(flatIndex)}
                    data-cursor="View"
                    aria-label={`Enlarge photograph ${flatIndex + 1} of ${lightboxImages.length}`}
                  >
                    <OptimizedImage
                      src={src}
                      alt={imageAlt(src) ?? `${project.title} — photograph ${flatIndex + 1}`}
                      sizes={
                        block.layout === 'full'
                          ? '100vw'
                          : block.layout === 'feature'
                            ? '(min-width: 1024px) 72vw, 100vw'
                            : '(min-width: 768px) 50vw, 100vw'
                      }
                    />
                  </button>
                </Reveal>
              );
            })}
            {block.caption && <p className="block__caption">{block.caption}</p>}
          </div>
        ))}
      </div>

      <nav className="project__next" aria-label="Next project">
        <Reveal>
          <Link to={`/work/${next.slug}`} className="project__next-link" data-cursor="Next">
            <span className="project__next-label">Next Project</span>
            <span className="project__next-title">{next.title}</span>
            <OptimizedImage
              src={next.coverImage}
              alt=""
              sizes="(min-width: 768px) 30vw, 60vw"
              className="project__next-image"
            />
          </Link>
        </Reveal>
      </nav>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          label={`${project.title} — image viewer`}
        />
      )}
    </article>
  );
}
