import { useEffect, useRef, useState } from 'react';

/**
 * Subtle desktop cursor: a thin ring that expands into a labelled circle
 * ("View") over interactive imagery. Disabled on touch devices and under
 * reduced motion; never required for navigation — purely decorative.
 */
export function Cursor() {
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const move = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null;
      setLabel(target?.dataset.cursor ?? null);
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('mouseover', over);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className={`cursor ${label ? 'cursor--labelled' : ''}`}
      aria-hidden="true"
    >
      <span className="cursor__label">{label}</span>
    </div>
  );
}
