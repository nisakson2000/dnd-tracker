import { useState } from 'react';
import { motion } from 'framer-motion';
import { getCategoryConfig } from '../../data/wikiCategoryConfig.js';

export default function CategoryCard({ category, count, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const config = getCategoryConfig(category);

  return (
    <motion.button
      className="card-grimoire w-full text-left cursor-pointer"
      style={{
        borderLeft: `3px solid ${config.color}`,
        boxShadow: hovered ? `0 0 20px ${config.color}33` : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 p-3">
        <div className="mt-0.5 shrink-0">
          {config.icon && (
            <config.icon
              className="w-5 h-5"
              style={{ color: config.color }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-amber-100 truncate">
              {config.label}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-amber-200/70 font-medium shrink-0">
              {count}
            </span>
          </div>

          {config.description && (
            <p className="text-xs text-amber-200/40 leading-snug line-clamp-2">
              {config.description}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
