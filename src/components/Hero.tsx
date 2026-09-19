import { SITE } from '../lib/site';
import { OptimizedImage } from './OptimizedImage';

/**
 * Cinematic homepage hero: full-viewport photograph, slow settle-in scale,
 * minimal editorial overlay. One-shot motion only — nothing loops.
 */
export function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__media">
        <OptimizedImage
          src="site/hero"
          alt={`Signature photograph by ${SITE.name}`}
          sizes="100vw"
          eager
          className="hero__image"
        />
      </div>

      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content">
        <p className="hero__overline">{SITE.locations}</p>
        <h1 className="hero__title">{SITE.name}</h1>
        <p className="hero__sub">Selected Work</p>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
