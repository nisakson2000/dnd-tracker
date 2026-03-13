import { useState, useEffect, useRef } from 'react';
import { List } from 'lucide-react';

/**
 * Active scroll-spy Table of Contents.
 * Highlights the heading currently in view using IntersectionObserver.
 */
export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (headings.length === 0) return;

    // Disconnect previous observer
    observerRef.current?.disconnect();

    const callback = (entries) => {
      // Find the topmost visible heading
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    });

    // Observe all heading elements
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className="card-grimoire">
      <h4 className="font-display text-sm text-amber-200/60 mb-3 uppercase tracking-wider flex items-center gap-2">
        <List size={12} />
        Contents
      </h4>
      <nav className="space-y-0.5">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block text-sm py-0.5 transition-colors border-l-2 ${
                isActive
                  ? 'text-amber-100 border-amber-400 bg-amber-400/5'
                  : 'text-amber-200/50 border-transparent hover:text-amber-200/80 hover:border-amber-200/20'
              }`}
              style={{ paddingLeft: `${(h.level - 1) * 12 + 8}px` }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {h.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
