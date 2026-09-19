import { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';
import {
  imageAspect,
  imageMeta,
  imagePlaceholder,
  imageSrc,
  imageSrcSet,
  isManagedImage,
} from '../lib/images';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /**
   * Managed image name ('projects/slug/01') resolved through src/lib/images.ts,
   * or a direct URL for one-off external assets.
   */
  src: string;
  alt: string;
  /** CSS sizes descriptor — required for correct srcset selection. */
  sizes?: string;
  /** Load eagerly + high priority (use for hero/LCP images only). */
  eager?: boolean;
  /** Override aspect ratio for unmanaged images. */
  aspect?: string;
  className?: string;
}

/**
 * Responsive image with blur-up placeholder, lazy loading and explicit
 * dimensions to prevent layout shift. All image behaviour lives here —
 * pages and galleries never construct URLs themselves.
 */
export function OptimizedImage({
  src,
  alt,
  sizes = '100vw',
  eager = false,
  aspect,
  className = '',
  ...imgProps
}: OptimizedImageProps) {
  const managed = isManagedImage(src);
  const meta = imageMeta(src);
  const placeholder = imagePlaceholder(src);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // An image that was already cached before React mounted never fires onLoad.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const ratio = aspect ?? imageAspect(src);

  return (
    <div
      className={`oi ${loaded ? 'oi--loaded' : ''} ${failed ? 'oi--failed' : ''} ${className}`}
      style={{
        aspectRatio: ratio,
        backgroundImage: placeholder ? `url("${placeholder}")` : undefined,
      }}
    >
      <img
        ref={imgRef}
        src={managed ? imageSrc(src) : src}
        srcSet={managed ? imageSrcSet(src) : undefined}
        sizes={managed ? sizes : undefined}
        width={meta?.w}
        height={meta?.h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        {...imgProps}
      />
      {failed && (
        <span className="oi__fallback" role="img" aria-label={alt}>
          {alt}
        </span>
      )}
    </div>
  );
}
