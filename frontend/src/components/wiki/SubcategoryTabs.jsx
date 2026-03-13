function formatName(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const activeCls =
  'bg-amber-700/40 text-amber-100 border-gold/60';
const inactiveCls =
  'bg-white/5 text-amber-200/60 hover:bg-white/10 border-transparent';
const baseCls =
  'border rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer';

export default function SubcategoryTabs({ subcategories, activeSubcategory, onSelect }) {
  if (!subcategories || subcategories.length === 0) return null;

  const totalCount = subcategories.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="overflow-x-auto flex gap-2 pb-2 scrollbar-none">
      <button
        className={`${baseCls} ${activeSubcategory === null ? activeCls : inactiveCls}`}
        onClick={() => onSelect(null)}
      >
        All
        <span className="ml-1.5 opacity-60">{totalCount}</span>
      </button>

      {subcategories.map(({ subcategory, count }) => (
        <button
          key={subcategory}
          className={`${baseCls} ${activeSubcategory === subcategory ? activeCls : inactiveCls}`}
          onClick={() => onSelect(subcategory)}
        >
          {formatName(subcategory)}
          <span className="ml-1.5 opacity-60">{count}</span>
        </button>
      ))}
    </div>
  );
}
