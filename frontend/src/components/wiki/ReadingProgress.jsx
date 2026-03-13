import { useState, useEffect } from 'react';

/**
 * Thin progress bar fixed below the dev banner.
 * Shows how far the user has scrolled through the article.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, (scrollTop / docHeight) * 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress < 1) return null;

  // Position below the dev banner (--dev-banner-h is set by DevBanner in dev builds)
  return (
    <div
      className="fixed left-0 right-0 z-[100000] h-1 bg-black/20"
      style={{ top: 'var(--dev-banner-h, 0px)' }}
    >
      <div
        className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
