import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const lastIndexRef = useRef(index);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (lastIndexRef.current !== index) {
      setOutgoing(lastIndexRef.current);
      lastIndexRef.current = index;
      setZoomed(false);
      setPan({ x: 0, y: 0 });
    }
  }, [index]);

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

  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const draggedRef = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button, a')) return;
    touchRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = pan;
    draggedRef.current = false;
    // No pointer capture: it retargets the click to this element, which
    // would swallow the image's tap-to-zoom. The viewer covers the whole
    // viewport, so moves are always delivered here anyway.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const start = touchRef.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      draggedRef.current = true;
      setDragging(true);
    }
    if (zoomed) {
      const stage = rootRef.current?.querySelector('.lightbox__stage');
      const maxX = stage ? stage.clientWidth / 2 : 0;
      const maxY = stage ? stage.clientHeight / 2 : 0;
      setPan({
        x: Math.min(maxX, Math.max(-maxX, panStartRef.current.x + dx)),
        y: Math.min(maxY, Math.max(-maxY, panStartRef.current.y + dy)),
      });
    } else {
      setDragX(dx);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    setDragging(false);
    setDragX(0);
    if (!start || zoomed) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    } else if (dy > SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
      onClose();
    }
  };

  const image = images[index];

  // Portal escapes any ancestor containing-block quirks (transforms,
  // scroll containers) so position:fixed is always viewport-relative.
  return createPortal(
    <div
      ref={rootRef}
      className={`lightbox ${dragging ? 'lightbox--dragging' : ''} ${zoomed ? 'lightbox--zoomed' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={label ?? 'Image viewer'}
      tabIndex={-1}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="lightbox__top">
        <p className="lightbox__counter" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </p>
        <button className="lightbox__close" onClick={onClose} aria-label="Close viewer">
          <span aria-hidden="true">✕</span> Close
        </button>
      </div>

      <figure
        className="lightbox__stage"
        onClick={(e) => {
          if (e.target === e.currentTarget && !draggedRef.current) onClose();
        }}
      >
        {outgoing !== null && outgoing !== index && (
          <div
            className="lightbox__layer lightbox__layer--out"
            aria-hidden="true"
            onAnimationEnd={() => setOutgoing(null)}
          >
            <OptimizedImage
              src={images[outgoing].src}
              alt=""
              sizes="100vw"
              eager
              className="lightbox__image"
            />
          </div>
        )}
        <div
          className="lightbox__layer lightbox__layer--in"
          key={index}
          style={{
            transform: dragX ? `translateX(${dragX}px)` : undefined,
            transition: dragging ? 'none' : 'transform 0.35s var(--ease-out)',
          }}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            sizes="100vw"
            eager
            className="lightbox__image"
            style={{
              transform: zoomed
                ? `translate(${pan.x}px, ${pan.y}px) scale(2)`
                : undefined,
              transition: dragging ? 'none' : 'transform 0.35s var(--ease-out)',
            }}
            onClick={() => {
              if (!draggedRef.current) {
                setZoomed((z) => !z);
                setPan({ x: 0, y: 0 });
              }
            }}
          />
        </div>
      </figure>

      <button className="lightbox__zone lightbox__zone--prev" onClick={prev} aria-label="Previous image">
        <span aria-hidden="true">←</span>
      </button>
      <button className="lightbox__zone lightbox__zone--next" onClick={next} aria-label="Next image">
        <span aria-hidden="true">→</span>
      </button>
    </div>,
    document.body
  );
}
