import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, X } from 'lucide-react';
import { getCategoryConfig } from '../../data/wikiCategoryConfig';

export default function BookmarksList({ bookmarks, onRemove }) {
  const navigate = useNavigate();

  if (!bookmarks || bookmarks.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <h2 className="font-display text-sm text-amber-200/50 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Bookmark size={14} className="text-amber-400/50" />
        Bookmarks
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {bookmarks.slice(0, 10).map((item, i) => {
          const config = getCategoryConfig(item.category);
          const Icon = config.icon;
          return (
            <motion.div
              key={item.slug}
              className="card-grimoire cursor-pointer hover:border-gold/60 p-2.5 relative group"
              style={{ borderLeft: `2px solid ${config.color}` }}
              onClick={() => navigate(`/wiki/${item.slug}`)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(item.slug); }}
                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 text-amber-200/30 hover:text-amber-200 transition-opacity"
                aria-label="Remove bookmark"
              >
                <X size={12} />
              </button>
              <Icon size={12} style={{ color: config.color }} className="mb-1.5" />
              <p className="text-xs font-display text-amber-100 line-clamp-2 leading-snug">
                {item.title}
              </p>
              <p className="text-[10px] text-amber-200/35 mt-1">{config.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
