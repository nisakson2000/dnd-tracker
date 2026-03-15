import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ArrowLeft, BookOpen, ChevronLeft, ChevronRight, X, Shuffle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  searchArticles, getCategories, listArticles,
  getWikiStats, getSubcategories, getRandomArticles,
} from '../api/wiki';
import { getCategoryConfig } from '../data/wikiCategoryConfig';
import ArcaneWidget from '../components/ArcaneWidget';
import WikiHero from '../components/wiki/WikiHero';
import CategoryCard from '../components/wiki/CategoryCard';
import SubcategoryTabs from '../components/wiki/SubcategoryTabs';
import WikiSearchPalette from '../components/wiki/WikiSearchPalette';
import SearchFilters from '../components/wiki/SearchFilters';
import BookmarksList from '../components/wiki/BookmarksList';
import RecentlyViewed from '../components/wiki/RecentlyViewed';
import ViewToggle from '../components/wiki/ViewToggle';
import KeyboardShortcuts from '../components/wiki/KeyboardShortcuts';
import BackToTop from '../components/wiki/BackToTop';
import useWikiBookmarks from '../hooks/useWikiBookmarks';
import useWikiHistory from '../hooks/useWikiHistory';

function formatCategoryName(str) {
  return (str || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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

  // New state for redesign
  const [stats, setStats] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({ category: null, ruleset: null, sort: 'relevance' });
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('codex-wiki-view') || 'list');

  // Hooks
  const { bookmarks, removeBookmark } = useWikiBookmarks();
  const { history } = useWikiHistory();

  // Keyboard shortcut: "/" to open search palette
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Load stats, categories, and featured on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(err => toast.error(`Failed to load categories: ${err?.message || err}`));
    getWikiStats()
      .then(setStats)
      .catch(() => {});
    getRandomArticles(6)
      .then(setFeatured)
      .catch(() => {});
  }, []);

  // Load subcategories when a category is selected
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      setActiveSubcategory(null);
      return;
    }
    getSubcategories(selectedCategory)
      .then(setSubcategories)
      .catch(() => setSubcategories([]));
  }, [selectedCategory]);

  // Search with debounce (uses filters)
  const doSearch = useCallback((q, pg = 1, filters = {}) => {
    if (!q.trim()) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    const params = { page: pg, per_page: 20 };
    if (filters.category) params.category = filters.category;
    if (filters.ruleset) params.ruleset = filters.ruleset;
    searchArticles(q, params)
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
        doSearch(value, 1, searchFilters);
      } else {
        setSearchParams({}, { replace: true });
        setSearchResults(null);
      }
    }, 300);
  };

  // Re-search when filters change
  const handleFilterChange = (newFilters) => {
    setSearchFilters(newFilters);
    if (query.trim()) {
      doSearch(query, 1, newFilters);
    }
  };

  const clearSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery('');
    setSearchResults(null);
    setSearchParams({}, { replace: true });
  };

  // Browse by category
  const browseCategory = useCallback((category, pg = 1, subcat = null) => {
    setLoading(true);
    setSelectedCategory(category);
    setQuery('');
    setSearchResults(null);
    const params = { category };
    if (subcat) params.subcategory = subcat;
    setSearchParams(params, { replace: true });
    listArticles({ category, subcategory: subcat || undefined, page: pg, per_page: 50, sort_by: 'title' })
      .then(data => {
        setArticles(data.items);
        setTotalPages(data.total_pages);
        setTotal(data.total);
        setPage(data.page);
      })
      .catch(err => toast.error(`Failed to load articles: ${err.message}`))
      .finally(() => setLoading(false));
  }, [setSearchParams]);

  // Handle subcategory selection
  const handleSubcategorySelect = (subcat) => {
    setActiveSubcategory(subcat);
    if (selectedCategory) {
      browseCategory(selectedCategory, 1, subcat);
    }
  };

  // Random article navigation
  const goToRandomArticle = () => {
    getRandomArticles(1)
      .then(items => {
        if (items.length > 0) navigate(`/wiki/${items[0].slug}`);
      })
      .catch(() => toast.error('Could not fetch a random article'));
  };

  // Restore state from URL on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    if (cat) browseCategory(cat);
    else if (q) doSearch(q);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage) => {
    if (searchResults !== null && query.trim()) {
      doSearch(query, newPage, searchFilters);
    } else if (selectedCategory) {
      browseCategory(selectedCategory, newPage, activeSubcategory);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayItems = searchResults !== null ? searchResults : articles;
  const showHome = searchResults === null && !selectedCategory;

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 max-w-6xl mx-auto">
      {/* Global overlays */}
      <WikiSearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <KeyboardShortcuts />
      <BackToTop />

      {/* Back button */}
      <div className="w-full flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-amber-200/60 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Hero Section */}
      {showHome && <WikiHero stats={stats} />}

      {/* Search Bar */}
      <div className="w-full max-w-2xl mb-6 relative">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200/40 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => { if (!query.trim()) setPaletteOpen(true); }}
            placeholder="Search spells, monsters, rules, items..."
            className="input w-full pr-20 text-lg"
            style={{ paddingLeft: '2.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query ? (
              <button
                onClick={clearSearch}
                className="text-amber-200/40 hover:text-amber-200"
              >
                <X size={18} />
              </button>
            ) : (
              <kbd
                onClick={() => setPaletteOpen(true)}
                className="text-[10px] text-amber-200/25 border border-amber-200/10 rounded px-1.5 py-0.5 cursor-pointer hover:text-amber-200/40"
              >
                /
              </kbd>
            )}
          </div>
        </div>
        {searchResults !== null && (
          <p className="text-sm text-amber-200/40 mt-2">
            {total} result{total !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
        )}
      </div>

      {/* Search Filters (shown when searching) */}
      {searchResults !== null && (
        <div className="w-full max-w-2xl">
          <SearchFilters filters={searchFilters} onChange={handleFilterChange} categories={categories} />
        </div>
      )}

      {/* Quick Actions */}
      {showHome && (
        <div className="flex gap-3 mb-8">
          <button
            onClick={goToRandomArticle}
            className="btn-secondary flex items-center gap-2 text-xs"
          >
            <Shuffle size={14} />
            Random Article
          </button>
        </div>
      )}

      {/* Bookmarks Rail */}
      {showHome && <BookmarksList bookmarks={bookmarks} onRemove={removeBookmark} />}

      {/* Recently Viewed Rail */}
      {showHome && <RecentlyViewed history={history} />}

      {/* Featured Articles Rail */}
      {showHome && featured.length > 0 && (
        <div className="w-full mb-8">
          <h2 className="font-display text-sm text-amber-200/50 uppercase tracking-wider mb-3">
            Discover
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {featured.map((item, i) => {
              const config = getCategoryConfig(item.category);
              const Icon = config.icon;
              return (
                <motion.div
                  key={item.slug}
                  className="card-grimoire cursor-pointer hover:border-gold/60 p-3"
                  style={{ borderTop: `2px solid ${config.color}` }}
                  onClick={() => navigate(`/wiki/${item.slug}`)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <Icon size={14} style={{ color: config.color }} className="mb-2" />
                  <p className="text-xs font-display text-amber-100 line-clamp-2 mb-1">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-amber-200/40">{config.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Grid */}
      {showHome && (
        <div className="w-full mb-8">
          <h2 className="font-display text-sm text-amber-200/50 uppercase tracking-wider mb-3">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.category}
                category={cat.category}
                count={cat.count}
                index={i}
                onClick={() => browseCategory(cat.category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category browsing header */}
      {selectedCategory && (
        <CategoryBrowseHeader
          category={selectedCategory}
          total={total}
          subcategories={subcategories}
          activeSubcategory={activeSubcategory}
          onSubcategorySelect={handleSubcategorySelect}
          onBack={() => {
            setSelectedCategory(null);
            setArticles([]);
            setActiveSubcategory(null);
            setSearchParams({}, { replace: true });
          }}
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="w-full space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card-grimoire animate-pulse">
              <div className="h-5 bg-white/5 rounded w-1/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/4" />
            </div>
          ))}
        </div>
      )}

      {/* Results header with view toggle */}
      {!loading && displayItems.length > 0 && (
        <div className="w-full flex items-center justify-between mb-3">
          <span className="text-xs text-amber-200/40">
            {total} article{total !== 1 ? 's' : ''}
          </span>
          <ViewToggle mode={viewMode} onChange={(m) => { setViewMode(m); localStorage.setItem('codex-wiki-view', m); }} />
        </div>
      )}

      {/* Results — List View */}
      {!loading && displayItems.length > 0 && viewMode === 'list' && (
        <div className="w-full space-y-2">
          {displayItems.map((item, i) => {
            const config = getCategoryConfig(item.category);
            return (
              <motion.div
                key={item.id || item.slug}
                className="card-grimoire cursor-pointer hover:border-gold/60"
                style={{ borderLeft: `3px solid ${config.color}` }}
                onClick={() => navigate(`/wiki/${item.slug}`)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base text-amber-100 mb-1">
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
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-medium"
                        style={{ backgroundColor: `${config.color}20`, color: `${config.color}cc` }}
                      >
                        {config.label}
                      </span>
                      {item.subcategory && (
                        <span className="text-[10px] bg-purple-900/20 text-purple-300/60 px-2 py-0.5 rounded">
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
            );
          })}
        </div>
      )}

      {/* Results — Grid View */}
      {!loading && displayItems.length > 0 && viewMode === 'grid' && (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayItems.map((item, i) => {
            const config = getCategoryConfig(item.category);
            const Icon = config.icon;
            return (
              <motion.div
                key={item.id || item.slug}
                className="card-grimoire cursor-pointer hover:border-gold/60 p-3 flex flex-col"
                style={{ borderTop: `2px solid ${config.color}` }}
                onClick={() => navigate(`/wiki/${item.slug}`)}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.015 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: config.color }} className="shrink-0" />
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${config.color}20`, color: `${config.color}cc` }}
                  >
                    {config.label}
                  </span>
                </div>
                <h3 className="font-display text-sm text-amber-100 mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[11px] text-amber-200/50 line-clamp-2 mt-auto">
                  {item.summary}
                </p>
              </motion.div>
            );
          })}
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
        <Pagination page={page} totalPages={totalPages} total={total} onChange={handlePageChange} />
      )}

      <div className="h-12" />
      <ArcaneWidget section="rules" />
    </div>
  );
}

/** Category browsing header with subcategory tabs */
function CategoryBrowseHeader({ category, total, subcategories, activeSubcategory, onSubcategorySelect, onBack }) {
  const config = getCategoryConfig(category);
  const Icon = config.icon;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="text-amber-200/60 hover:text-amber-200 transition-colors text-sm"
        >
          All Categories
        </button>
        <span className="text-amber-200/30">/</span>
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color: config.color }} />
          <span className="font-display text-lg text-amber-100">{config.label}</span>
          <span className="text-xs text-amber-200/40">({total} articles)</span>
        </div>
      </div>
      {config.description && (
        <p className="text-sm text-amber-200/50 mb-4">{config.description}</p>
      )}
      <SubcategoryTabs
        subcategories={subcategories}
        activeSubcategory={activeSubcategory}
        onSelect={onSubcategorySelect}
      />
    </div>
  );
}

/** Pagination with page numbers */
function Pagination({ page, totalPages, total, onChange }) {
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center gap-2 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="btn-secondary flex items-center gap-1 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onChange(1)} className="btn-secondary text-xs px-3">1</button>
          {start > 2 && <span className="text-amber-200/30 text-xs">...</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`text-xs px-3 py-1.5 rounded transition-colors ${
            p === page
              ? 'bg-amber-700/40 text-amber-100 border border-gold/60'
              : 'btn-secondary'
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-amber-200/30 text-xs">...</span>}
          <button onClick={() => onChange(totalPages)} className="btn-secondary text-xs px-3">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="btn-secondary flex items-center gap-1 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next <ChevronRight size={14} />
      </button>

      <span className="text-[10px] text-amber-200/30 ml-2">
        {total} total
      </span>
    </div>
  );
}
