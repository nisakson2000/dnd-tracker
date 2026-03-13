import { Grid3X3, List } from 'lucide-react';

/**
 * Grid / List view toggle for article browsing.
 */
export default function ViewToggle({ mode, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
      <button
        onClick={() => onChange('list')}
        className={`p-1.5 rounded transition-colors ${
          mode === 'list'
            ? 'bg-amber-700/40 text-amber-100'
            : 'text-amber-200/30 hover:text-amber-200/60'
        }`}
        aria-label="List view"
        title="List view"
      >
        <List size={14} />
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`p-1.5 rounded transition-colors ${
          mode === 'grid'
            ? 'bg-amber-700/40 text-amber-100'
            : 'text-amber-200/30 hover:text-amber-200/60'
        }`}
        aria-label="Grid view"
        title="Grid view"
      >
        <Grid3X3 size={14} />
      </button>
    </div>
  );
}
