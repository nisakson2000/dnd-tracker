import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { getCategoryConfig } from '../../data/wikiCategoryConfig';

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentlyViewed({ history }) {
  const navigate = useNavigate();

  if (!history || history.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <h2 className="font-display text-sm text-amber-200/50 uppercase tracking-wider mb-3 flex items-center gap-2">
        <History size={14} className="text-amber-400/50" />
        Recently Viewed
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {history.slice(0, 12).map((item, i) => {
          const config = getCategoryConfig(item.category);
          const Icon = config.icon;
          return (
            <motion.button
              key={item.slug}
              className="card-grimoire shrink-0 w-36 cursor-pointer hover:border-gold/60 p-2.5 text-left"
              style={{ borderTop: `2px solid ${config.color}` }}
              onClick={() => navigate(`/wiki/${item.slug}`)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={11} style={{ color: config.color }} />
                <span className="text-[9px] text-amber-200/35">{config.label}</span>
              </div>
              <p className="text-xs font-display text-amber-100 line-clamp-2 leading-snug mb-1">
                {item.title}
              </p>
              <p className="text-[9px] text-amber-200/25">{timeAgo(item.visitedAt)}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
