import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  rootMargin?: string;
  threshold?: number;
}

export function LazyImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full overflow-hidden bg-zinc-900/80 rounded-xl',
  aspectRatio = 'aspect-[16/9]',
  rootMargin = '200px',
  threshold = 0.01,
}: LazyImageProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, load immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      className={`${containerClassName} ${aspectRatio}`}
    >
      {/* Skeleton placeholder while waiting to intersect or while downloading */}
      {(!shouldLoad || !isLoaded) && !hasError && (
        <div
          className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-700"
          aria-hidden="true"
        >
          <svg
            className="w-8 h-8 opacity-40 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-4 text-center text-zinc-500 font-mono text-xs">
          <span>Failed to load visual artifact</span>
          <span className="text-[10px] text-zinc-600 truncate max-w-full mt-1">{alt}</span>
        </div>
      )}

      {/* Real Image, injected only after IntersectionObserver fires */}
      {shouldLoad && !hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
