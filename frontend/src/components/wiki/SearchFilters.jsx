import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { getCategoryConfig } from '../../data/wikiCategoryConfig';

const RULESET_OPTIONS = [
  { value: null, label: 'All Editions' },
  { value: '5e-2014', label: '2014 Rules' },
  { value: '5e-2024', label: '2024 Rules' },
  { value: 'universal', label: 'Universal' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'title', label: 'Alphabetical' },
];

export default function SearchFilters({ filters, onChange, categories }) {
  const [expanded, setExpanded] = useState(false);

  if (!categories || categories.length === 0) return null;

  const activeCount = [filters.category, filters.ruleset, filters.sort !== 'relevance' ? filters.sort : null]
    .filter(Boolean).length;

  return (
    <div className="w-full mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs text-amber-200/50 hover:text-amber-200/80 transition-colors"
      >
        <Filter size={12} />
        Filters
        {activeCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-amber-700/40 text-amber-100 text-[10px] font-medium">
            {activeCount}
          </span>
        )}
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {expanded && (
        <div className="mt-3 p-3 card-grimoire space-y-4">
          {/* Category filter */}
          <div>
            <p className="text-[10px] text-amber-200/40 uppercase tracking-wider mb-2">Category</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onChange({ ...filters, category: null })}
                className={`text-[10px] px-2 py-1 rounded-full font-medium transition-colors ${
                  !filters.category ? 'bg-amber-700/40 text-amber-100' : 'bg-white/5 text-amber-200/50 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {categories.map(cat => {
                const config = getCategoryConfig(cat.category);
                const active = filters.category === cat.category;
                return (
                  <button
                    key={cat.category}
                    onClick={() => onChange({ ...filters, category: active ? null : cat.category })}
                    className={`text-[10px] px-2 py-1 rounded-full font-medium transition-colors ${
                      active ? 'text-white' : 'text-amber-200/50 hover:bg-white/10'
                    }`}
                    style={active ? { backgroundColor: `${config.color}40`, color: config.color } : { backgroundColor: 'rgba(255,255,255,0.03)' }}
                  >
                    {config.label}
                    <span className="ml-1 opacity-50">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ruleset filter */}
          <div>
            <p className="text-[10px] text-amber-200/40 uppercase tracking-wider mb-2">Edition</p>
            <div className="flex gap-1.5">
              {RULESET_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => onChange({ ...filters, ruleset: opt.value })}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                    filters.ruleset === opt.value ? 'bg-amber-700/40 text-amber-100' : 'bg-white/5 text-amber-200/50 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-[10px] text-amber-200/40 uppercase tracking-wider mb-2">Sort</p>
            <div className="flex gap-1.5">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ ...filters, sort: opt.value })}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                    filters.sort === opt.value ? 'bg-amber-700/40 text-amber-100' : 'bg-white/5 text-amber-200/50 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {activeCount > 0 && (
            <button
              onClick={() => onChange({ category: null, ruleset: null, sort: 'relevance' })}
              className="text-[10px] text-amber-200/40 hover:text-amber-200 transition-colors underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
