import { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { GLOSSARY, ACTION_ECONOMY } from '../data/helpText';

const CATEGORIES = [...new Set(GLOSSARY.map(g => g.category))];

function highlightText(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={i} style={{ background: 'rgba(201,168,76,0.3)', color: 'inherit' }}>{part}</mark> : part
  );
}

export default function RulesReference() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = GLOSSARY.filter(entry => {
    const matchesCategory = activeCategory === 'all' || entry.category === activeCategory;
    const matchesSearch = !search ||
      entry.term.toLowerCase().includes(search.toLowerCase()) ||
      entry.definition.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-none">
      <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
        <BookOpen size={20} /> Rules Reference
      </h2>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200/30" />
        <input
          className="input w-full pl-10"
          placeholder="Search rules (e.g. 'advantage', 'spell slot', 'grappled')..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`text-xs px-3 py-1 rounded ${activeCategory === 'all' ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10'}`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1 rounded ${activeCategory === cat ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Action Economy Quick Ref */}
      {(activeCategory === 'all' || activeCategory === 'Combat') && !search && (
        <div className="card border-gold/20">
          <h3 className="font-display text-amber-100 mb-3">{ACTION_ECONOMY.title}</h3>
          {ACTION_ECONOMY.sections.map(section => (
            <div key={section.label} className="mb-3 last:mb-0">
              <h4 className="text-xs text-gold font-semibold mb-1.5">{section.label}</h4>
              <ul className="space-y-1">
                {section.items.map((item, i) => (
                  <li key={i} className="text-xs text-amber-200/60 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gold/40">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Glossary Entries */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card text-center text-amber-200/30 py-8">
            No matching rules found. Try a different search term.
          </div>
        ) : (
          filtered.map(entry => (
            <div key={entry.term} className="card py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-amber-100 font-medium text-sm">{highlightText(entry.term, search)}</h4>
                  <p className="text-xs text-amber-200/60 mt-1 leading-relaxed">{highlightText(entry.definition, search)}</p>
                </div>
                <span className="text-xs text-purple-300/40 whitespace-nowrap">{entry.category}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-amber-200/20 text-center">
        {filtered.length} of {GLOSSARY.length} entries shown
      </div>
    </div>
  );
}
