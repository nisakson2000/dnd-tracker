import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategoryConfig } from '../../data/wikiCategoryConfig';

/**
 * Previous / Next article navigation bar.
 * Shows adjacent articles within the same category.
 */
export default function ArticleNav({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <div className="flex items-stretch gap-3 mt-8">
      {prev ? (
        <Link
          to={`/wiki/${prev.slug}`}
          className="flex-1 card-grimoire group hover:border-gold/50 transition-colors flex items-center gap-3 p-4"
        >
          <ChevronLeft size={16} className="text-amber-200/30 group-hover:text-amber-200/60 shrink-0" />
          <div className="min-w-0 text-left">
            <p className="text-[10px] text-amber-200/30 uppercase tracking-wide mb-0.5">Previous</p>
            <p className="text-sm font-display text-amber-100 truncate group-hover:text-amber-50">
              {prev.title}
            </p>
            <CategoryBadge category={prev.category} />
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          to={`/wiki/${next.slug}`}
          className="flex-1 card-grimoire group hover:border-gold/50 transition-colors flex items-center justify-end gap-3 p-4"
        >
          <div className="min-w-0 text-right">
            <p className="text-[10px] text-amber-200/30 uppercase tracking-wide mb-0.5">Next</p>
            <p className="text-sm font-display text-amber-100 truncate group-hover:text-amber-50">
              {next.title}
            </p>
            <CategoryBadge category={next.category} />
          </div>
          <ChevronRight size={16} className="text-amber-200/30 group-hover:text-amber-200/60 shrink-0" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

function CategoryBadge({ category }) {
  const config = getCategoryConfig(category);
  return (
    <span
      className="inline-block text-[10px] px-1.5 py-0.5 rounded mt-1"
      style={{ backgroundColor: `${config.color}15`, color: `${config.color}99` }}
    >
      {config.label}
    </span>
  );
}
