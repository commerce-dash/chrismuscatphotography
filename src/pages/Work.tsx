import { useMemo, useState } from 'react';
import { Category, projects } from '../data/projects';
import { usePageMeta } from '../lib/usePageMeta';
import { FilterBar } from '../components/FilterBar';
import { Reveal } from '../components/Reveal';
import { WorkItem } from '../components/WorkItem';

/**
 * Work index: quiet text filtering over an asymmetric two-column editorial
 * grid. Items re-enter with a gentle stagger when the filter changes.
 */
export function Work() {
  usePageMeta({
    title: 'Work',
    description: 'Selected photographs and projects — portrait, fashion, editorial, architecture and travel photography by Chris Muscat.',
    path: '/work',
  });

  const [category, setCategory] = useState<Category>('All');
  const visible = useMemo(
    () => (category === 'All' ? projects : projects.filter((p) => p.category === category)),
    [category]
  );

  return (
    <>
      <header className="page-head">
        <Reveal>
          <h1 className="page-head__title">Work</h1>
          <p className="page-head__sub">
            Selected photographs and projects, 2019–2026
          </p>
        </Reveal>
      </header>

      <Reveal>
        <FilterBar active={category} onChange={setCategory} />
      </Reveal>

      <section className="section section--flush" aria-live="polite">
        {visible.length === 0 ? (
          <p className="empty">No projects in this category yet.</p>
        ) : (
          <div className="work-grid" key={category}>
            {visible.map((p, i) => (
              <WorkItem
                key={p.id}
                project={p}
                className={`work-grid__cell work-grid__cell--${i % 4}`}
                style={{ animationDelay: `${i * 60}ms` }}
                sizes="(min-width: 768px) 55vw, 100vw"
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
