import { useMemo, useRef, useState } from 'react';
import { imageAlt, searchPhotos } from '../lib/images';
import { usePageMeta } from '../lib/usePageMeta';
import { Lightbox } from '../components/Lightbox';
import { OptimizedImage } from '../components/OptimizedImage';
import { Reveal } from '../components/Reveal';

/**
 * Subject search over the photo library — matches query terms against the
 * reviewed alt text in content/image-alt.json. Results open in the lightbox.
 */
export function Search() {
  usePageMeta({
    title: 'Search',
    description: 'Search the photography archive by subject.',
    path: '/search',
  });

  const [query, setQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchPhotos(query), [query]);
  const lightboxImages = useMemo(
    () => results.map((src) => ({ src, alt: imageAlt(src) ?? 'Photograph' })),
    [results]
  );

  return (
    <div className="search-page">
      <header className="search-page__head">
        <Reveal>
          <h1 className="section__title">Search the archive</h1>
          <label className="search-page__field">
            <span className="visually-hidden">Search photographs by subject</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “boat”, “monk”, “temple”, “snow”…"
              autoFocus
              className="search-page__input"
            />
          </label>
          {query.trim() && (
            <p className="search-page__count" role="status">
              {results.length === 0
                ? 'No photographs match'
                : `${results.length} photograph${results.length === 1 ? '' : 's'}`}
            </p>
          )}
        </Reveal>
      </header>

      {results.length > 0 && (
        <div className="search-grid">
          {results.map((src, i) => (
            <button
              key={src}
              type="button"
              className="search-grid__item"
              onClick={() => setLightboxIndex(i)}
              data-cursor="View"
              aria-label={`Enlarge: ${imageAlt(src) ?? 'photograph'}`}
            >
              <OptimizedImage src={src} sizes="(min-width: 768px) 33vw, 50vw" />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          label="Search results"
        />
      )}
    </div>
  );
}
