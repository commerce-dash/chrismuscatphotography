import { CATEGORIES, Category } from '../data/projects';

interface FilterBarProps {
  active: Category;
  onChange: (category: Category) => void;
}

/**
 * Text-only filter — quiet uppercase links, active state is a subtle
 * underline and full opacity. No buttons, no pills.
 */
export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="filter" role="group" aria-label="Filter projects by category">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          type="button"
          className={`filter__item ${active === c ? 'filter__item--active' : ''}`}
          onClick={() => onChange(c)}
          aria-pressed={active === c}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
