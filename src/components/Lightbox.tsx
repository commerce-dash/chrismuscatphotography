import { useCallback, useEffect, useRef } from 'react';
import { OptimizedImage } from './OptimizedImage';

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  label?: string;
}

const SWIPE_THRESHOLD = 48;

/**
 * Immersive full-screen gallery.
 * Desktop: click zones / keyboard arrows / Esc. Mobile: swipe, tap zones.
 * Restores focus to the invoking element on close.
 */
export function Lightbox({ images, index, onClose, onNavigate, label }: LightboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const prev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate]
  );
  const next = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate]
  );

  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    rootRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Tab') {
        // Minimal focus trap: keep focus inside the dialog.
        const focusables = rootRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      restoreFocusRef.current?.focus();
    };
  }, [onClose, prev, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

  const image = images[index];

  return (
    <div
      ref={rootRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={label ?? 'Image viewer'}
      tabIndex={-1}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lightbox__top">
        <p className="lightbox__counter" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </p>
        <button className="lightbox__close" onClick={onClose} aria-label="Close viewer">
          Close
        </button>
      </div>

      <figure className="lightbox__stage" key={index}>
        <OptimizedImage
          src={image.src}
          alt={image.alt}
          sizes="100vw"
          eager
          className="lightbox__image"
        />
      </figure>

      <button className="lightbox__zone lightbox__zone--prev" onClick={prev} aria-label="Previous image">
        <span aria-hidden="true">←</span>
      </button>
      <button className="lightbox__zone lightbox__zone--next" onClick={next} aria-label="Next image">
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
