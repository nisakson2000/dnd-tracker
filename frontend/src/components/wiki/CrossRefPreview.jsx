import { useState, useEffect, useRef } from 'react';
import { getCategoryConfig } from '../../data/wikiCategoryConfig';
import { getArticle } from '../../api/wiki';

/**
 * Tooltip preview card for cross-reference links.
 * Shows article summary and category on hover after a short delay.
 */
export default function CrossRefPreview({ slug, children, style }) {
  const [preview, setPreview] = useState(null);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef(null);
  const triggerRef = useRef(null);

  const handleEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPos({
          top: rect.bottom + window.scrollY + 4,
          left: Math.min(rect.left, window.innerWidth - 320),
        });
      }
      setShow(true);
      if (!preview) {
        getArticle(slug)
          .then(data => setPreview({ title: data.title, summary: data.summary, category: data.category }))
          .catch(() => {});
      }
    }, 400);
  };

  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setShow(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={style}
      >
        {children}
      </span>
      {show && preview && (
        <div
          className="fixed z-[9999] w-72 card-grimoire p-3 shadow-xl pointer-events-none"
          style={{ top: pos.top, left: pos.left }}
        >
          <p className="text-xs font-display text-amber-100 mb-1">{preview.title}</p>
          <CategoryBadge category={preview.category} />
          {preview.summary && (
            <p className="text-[11px] text-amber-200/50 mt-1.5 line-clamp-3 leading-relaxed">
              {preview.summary}
            </p>
          )}
        </div>
      )}
    </>
  );
}

function CategoryBadge({ category }) {
  const config = getCategoryConfig(category);
  return (
    <span
      className="inline-block text-[10px] px-1.5 py-0.5 rounded"
      style={{ backgroundColor: `${config.color}15`, color: `${config.color}99` }}
    >
      {config.label}
    </span>
  );
}
