import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ArrowLeft, BookOpen, Sword, Sparkles, Shield, Skull,
  ScrollText, Globe, Users, Star, Flame, Crosshair, Heart,
  Gem, Map, Compass, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { searchArticles, getCategories, listArticles } from '../api/wiki';
import ArcaneWidget from '../components/ArcaneWidget';

const CATEGORY_ICONS = {
  'conditions': Heart,
  'rules': ScrollText,
  'ability-scores': Star,
  'skills': Crosshair,
  'classes': Users,
  'subclasses': Users,
  'races': Globe,
  'backgrounds': BookOpen,
  'feats': Flame,
  'equipment': Shield,
  'magic-items': Gem,
  'tools': Compass,
  'spells': Sparkles,
  'monsters': Skull,
  'gods': Star,
  'planes': Map,
  'languages': ScrollText,
  'settings': Globe,
  'poisons': Flame,
  'diseases': Heart,
  'adventuring': Compass,
  'combat': Sword,
  'dm-tools': BookOpen,
  'alignments': Globe,
  'schools-of-magic': Sparkles,
  'creature-types': Skull,
  'character-options': Users,
};

function getCategoryIcon(category) {
  const key = category.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_ICONS[key] || BookOpen;
}

function formatCategoryName(category) {
  return category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function sanitizeHTML(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, iframe, object, embed, link[rel="import"]').forEach(el => el.remove());
  doc.querySelectorAll('*').forEach(el => {
    for (const attr of [...el.attributes]) {
      if (attr.name.startsWith('on') || attr.value.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
}

export default function WikiPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const debounceRef = useRef(null);

  // Load categories on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(err => toast.error(`Failed to load categories: ${err.message}`));
  }, []);

  // Search with debounce
  const doSearch = useCallback((q, pg = 1) => {
    if (!q.trim()) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    searchArticles(q, { page: pg, per_page: 20 })
      .then(data => {
        setSearchResults(data.items);
        setTotalPages(data.total_pages);
        setTotal(data.total);
        setPage(data.page);
      })
      .catch(err => toast.error(`Search failed: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  const handleQueryChange = (value) => {
    setQuery(value);
    setSelectedCategory(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        setSearchParams({ q: value }, { replace: true });
        doSearch(value);
      } else {
        setSearchParams({}, { replace: true });
        setSearchResults(null);
      }
    }, 300);
  };

  const clearSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery('');
    setSearchResults(null);
    setSearchParams({}, { replace: true });
  };

  // Browse by category
  const browseCategory = useCallback((category, pg = 1) => {
    setLoading(true);
    setSelectedCategory(category);
    setQuery('');
    setSearchResults(null);
    setSearchParams({ category }, { replace: true });
    listArticles({ category, page: pg, per_page: 50, sort_by: 'title' })
      .then(data => {
        setArticles(data.items);
        setTotalPages(data.total_pages);
        setTotal(data.total);
        setPage(data.page);
      })
      .catch(err => toast.error(`Failed to load articles: ${err.message}`))
      .finally(() => setLoading(false));
  }, [setSearchParams]);

  // Restore state from URL on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    if (cat) browseCategory(cat);
    else if (q) doSearch(q);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage) => {
    if (searchResults !== null && query.trim()) {
      doSearch(query, newPage);
    } else if (selectedCategory) {
      browseCategory(selectedCategory, newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayItems = searchResults !== null ? searchResults : articles;
  const showCategoryGrid = searchResults === null && !selectedCategory;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="w-full flex items-center gap-4 mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-amber-200/60 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <motion.div
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1
          className="text-4xl md:text-5xl font-display font-bold tracking-wider"
          style={{
            background: 'linear-gradient(135deg, #f0d878, #c9a84c, #f0d878)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        >
          Arcane Encyclopedia
        </h1>
        <p className="text-amber-200/40 mt-2 flex items-center justify-center gap-2">
          <BookOpen size={16} />
          1,350+ articles of D&D knowledge
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mb-8 relative">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200/40 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search spells, monsters, rules, items..."
            className="input w-full pr-10 text-lg"
            style={{ paddingLeft: '2.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
            autoFocus
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-200/40 hover:text-amber-200"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {searchResults !== null && (
          <p className="text-sm text-amber-200/40 mt-2">
            {total} result{total !== 1 ? 's' : ''} for "{query}"
          </p>
        )}
      </div>

      {/* Category breadcrumb when browsing */}
      {selectedCategory && (
        <div className="w-full mb-6 flex items-center gap-2 text-sm">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setArticles([]);
              setSearchParams({}, { replace: true });
            }}
            className="text-amber-200/60 hover:text-amber-200 transition-colors"
          >
            All Categories
          </button>
          <span className="text-amber-200/30">/</span>
          <span className="text-amber-100">{formatCategoryName(selectedCategory)}</span>
          <span className="text-amber-200/40 ml-2">({total} articles)</span>
        </div>
      )}

      {/* Category Grid */}
      {showCategoryGrid && (
        <motion.div
          className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map((cat, i) => {
            const Icon = getCategoryIcon(cat.category);
            return (
              <motion.button
                key={cat.category}
                onClick={() => browseCategory(cat.category)}
                className="card-grimoire flex flex-col items-center gap-3 py-5 px-3 text-center hover:border-gold/60 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Icon size={24} className="text-amber-200/60" />
                <span className="font-display text-sm text-amber-100">
                  {formatCategoryName(cat.category)}
                </span>
                <span className="text-xs text-amber-200/40">
                  {cat.count} article{cat.count !== 1 ? 's' : ''}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-12 text-amber-200/40">Searching the archives...</div>
      )}

      {/* Results List */}
      {!loading && displayItems.length > 0 && (
        <div className="w-full space-y-3">
          {displayItems.map((item, i) => (
            <motion.div
              key={item.id || item.slug}
              className="card-grimoire cursor-pointer hover:border-gold/60"
              onClick={() => navigate(`/wiki/${item.slug}`)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg text-amber-100 mb-1">
                    {item.title}
                  </h3>
                  {item.snippet ? (
                    <p
                      className="text-sm text-amber-200/60 mb-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(item.snippet) }}
                    />
                  ) : (
                    <p className="text-sm text-amber-200/60 mb-2 line-clamp-2">
                      {item.summary}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs bg-amber-900/30 text-amber-200/60 px-2 py-0.5 rounded">
                      {formatCategoryName(item.category)}
                    </span>
                    {item.subcategory && (
                      <span className="text-xs bg-purple-900/20 text-purple-300/60 px-2 py-0.5 rounded">
                        {formatCategoryName(item.subcategory)}
                      </span>
                    )}
                    {item.ruleset && item.ruleset !== 'universal' && (
                      <span className="text-[10px] bg-amber-900/20 text-amber-200/40 px-1.5 py-0.5 rounded">
                        {item.ruleset === '5e-2024' ? '2024 PHB' : '2014 PHB'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && displayItems.length === 0 && (searchResults !== null || selectedCategory) && (
        <div className="py-12 text-center text-amber-200/40">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p>No articles found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="btn-secondary flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-sm text-amber-200/50">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="btn-secondary flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}

      <div className="h-12" />

      <ArcaneWidget section="rules" />
    </div>
  );
}
