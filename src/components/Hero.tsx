import { SITE } from '../lib/site';
import { OptimizedImage } from './OptimizedImage';

/**
 * Cinematic homepage hero: full-viewport photograph, slow settle-in scale,
 * minimal editorial overlay. Image, text and alignment are CMS-editable
 * (Site Settings → Homepage). One-shot motion only — nothing loops.
 */
export function Hero() {
  const hero = SITE.hero;

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__media">
        <OptimizedImage
          src={hero.image}
          alt={`Signature photograph by ${SITE.name}`}
          sizes="100vw"
          eager
          className="hero__image"
        />
      </div>

      <div className="hero__overlay" aria-hidden="true" />

      <div className={`hero__content ${hero.align === 'center' ? 'hero__content--center' : ''}`}>
        {hero.overline && <p className="hero__overline">{hero.overline}</p>}
        <h1 className="hero__title">{hero.title}</h1>
        {hero.subtitle && <p className="hero__sub">{hero.subtitle}</p>}
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
