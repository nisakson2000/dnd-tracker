import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, Tag, Bookmark, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { getArticle, getAdjacentArticles } from '../api/wiki';
import { getCategoryConfig } from '../data/wikiCategoryConfig';
import ArcaneWidget from '../components/ArcaneWidget';
import StatBlockRouter from '../components/wiki/statblocks/StatBlockRouter';
import TableOfContents from '../components/wiki/TableOfContents';
import ReadingProgress from '../components/wiki/ReadingProgress';
import ArticleFooter from '../components/wiki/ArticleFooter';
import ArticleNav from '../components/wiki/ArticleNav';
import BackToTop from '../components/wiki/BackToTop';
import KeyboardShortcuts from '../components/wiki/KeyboardShortcuts';
import CrossRefPreview from '../components/wiki/CrossRefPreview';
import useWikiBookmarks from '../hooks/useWikiBookmarks';
import useWikiHistory from '../hooks/useWikiHistory';

const RELATIONSHIP_LABELS = {
  'related': 'Related',
  'subclass': 'Subclass',
  'parent_class': 'Parent Class',
  'subrace': 'Subrace',
  'see_also': 'See Also',
  'caused_by': 'Caused By',
  'causes': 'Causes',
  'cured_by': 'Cured By',
  'countered_by': 'Countered By',
  'includes': 'Includes',
  'variant': 'Variant',
  'opposite': 'Opposite',
};

function formatCategoryName(str) {
  return (str || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Build a map of related article titles → slugs for inline linking.
 * Uses case-insensitive matching. Only includes titles with 3+ characters
 * to avoid false positives on short words.
 */
function buildCrossRefMap(relatedArticles) {
  const map = new Map();
  (relatedArticles || []).forEach(rel => {
    if (rel.title && rel.title.length >= 3) {
      map.set(rel.title.toLowerCase(), { slug: rel.slug, title: rel.title, category: rel.category });
    }
  });
  return map;
}

/**
 * Render inline formatting: bold, and cross-reference links.
 * Cross-refs are detected by matching known related article titles in text.
 */
function renderInlineFormatting(text, crossRefMap) {
  // First split by bold markers
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  return boldParts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      // Check if the bold text itself is a cross-reference
      const ref = crossRefMap.get(inner.toLowerCase());
      if (ref) {
        return (
          <Link key={i} to={`/wiki/${ref.slug}`} className="font-semibold text-amber-300 hover:text-amber-200 underline decoration-amber-400/30 hover:decoration-amber-400/60 transition-colors">
            {inner}
          </Link>
        );
      }
      return <strong key={i} className="text-amber-100 font-semibold">{inner}</strong>;
    }

    // For non-bold text, scan for cross-reference matches
    if (crossRefMap.size === 0) return part;
    return linkifyCrossRefs(part, crossRefMap, i);
  });
}

/**
 * Scan plain text for cross-reference matches and wrap them in Links.
 * Uses a greedy approach: longest match first to avoid partial matches.
 */
function linkifyCrossRefs(text, crossRefMap, keyPrefix) {
  if (!text || crossRefMap.size === 0) return text;

  // Sort titles by length descending for greedy matching
  const titles = Array.from(crossRefMap.keys()).sort((a, b) => b.length - a.length);

  // Build a regex that matches any title (case-insensitive, word boundaries)
  const escaped = titles.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const ref = crossRefMap.get(match[0].toLowerCase());
    if (ref) {
      const config = getCategoryConfig(ref.category);
      parts.push(
        <CrossRefPreview key={`${keyPrefix}-xref-${match.index}`} slug={ref.slug}>
          <Link
            to={`/wiki/${ref.slug}`}
            className="text-amber-300 hover:text-amber-200 underline decoration-dotted transition-colors"
            style={{ textDecorationColor: `${config.color}60` }}
          >
            {match[0]}
          </Link>
        </CrossRefPreview>
      );
    } else {
      parts.push(match[0]);
    }
    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function formatContent(content, crossRefMap) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let isFirstParagraph = true;

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const headerRow = tableRows[0];
    const dataRows = tableRows.slice(1);
    elements.push(
      <div key={`table-${elements.length}`} className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-gold/20 rounded">
          <thead>
            <tr className="bg-amber-900/20">
              {headerRow.map((cell, j) => (
                <th key={`header-${j}`} className="text-left px-3 py-2 text-amber-100 font-display text-xs border-b border-gold/20">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, i) => (
              <tr key={`row-${i}`} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                {row.map((cell, j) => (
                  <td key={`cell-${i}-${j}`} className="px-3 py-2 text-amber-200/70 border-b border-gold/10">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('|') && line.trim().startsWith('|')) {
      if (/^\|[\s\-:|]+\|$/.test(line.trim())) continue;
      const cells = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
      if (cells.length > 0) {
        inTable = true;
        tableRows.push(cells);
        continue;
      }
    }

    if (inTable) flushTable();

    if (line.startsWith('### ')) {
      const id = `section-${line.slice(4).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      elements.push(
        <h4 key={i} id={id} className="font-display text-amber-100 mt-5 mb-2 text-base scroll-mt-20">
          {line.slice(4)}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      const id = `section-${line.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      elements.push(
        <div key={`divider-${i}`} className="flex items-center gap-3 mt-8 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
          <h3 id={id} className="font-display text-amber-100 scroll-mt-20 shrink-0">
            {line.slice(3)}
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        </div>
      );
    } else if (line.startsWith('# ')) {
      const id = `section-${line.slice(2).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      elements.push(
        <h2 key={i} id={id} className="font-display text-amber-100 mt-6 mb-3 scroll-mt-20">
          {line.slice(2)}
        </h2>
      );
    } else if (line.match(/^\s*[-*]\s/)) {
      const text = line.replace(/^\s*[-*]\s/, '');
      elements.push(
        <li key={i} className="text-amber-200/70 ml-5 list-disc mb-1">
          {renderInlineFormatting(text, crossRefMap)}
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-3" />);
    } else {
      if (isFirstParagraph && line.trim().length > 0) {
        isFirstParagraph = false;
        elements.push(
          <p key={i} className="text-amber-200/70 mb-2 leading-relaxed first-letter:text-4xl first-letter:font-display first-letter:text-amber-300 first-letter:float-left first-letter:mr-1.5 first-letter:mt-0.5 first-letter:leading-none">
            {renderInlineFormatting(line, crossRefMap)}
          </p>
        );
      } else {
        elements.push(
          <p key={i} className="text-amber-200/70 mb-2 leading-relaxed">
            {renderInlineFormatting(line, crossRefMap)}
          </p>
        );
      }
    }
  }

  if (inTable) flushTable();
  return elements;
}

/** Extract headings from content for table of contents */
function extractHeadings(content) {
  if (!content) return [];
  return content.split('\n')
    .filter(line => /^#{1,3}\s/.test(line))
    .map(line => {
      const level = line.match(/^(#+)/)[1].length;
      const text = line.replace(/^#+\s/, '');
      const id = `section-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      return { level, text, id };
    });
}

export default function WikiArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjacent, setAdjacent] = useState({ prev: null, next: null });
  const [copied, setCopied] = useState(false);
  const { toggleBookmark, isBookmarked } = useWikiBookmarks();
  const { recordVisit } = useWikiHistory();

  useEffect(() => {
    setLoading(true);
    setAdjacent({ prev: null, next: null });
    window.scrollTo({ top: 0 });

    getArticle(slug)
      .then(data => {
        setArticle(data);
        recordVisit({ slug: data.slug, title: data.title, category: data.category });
        // Fetch adjacent articles for navigation
        getAdjacentArticles(data.category, data.slug)
          .then(setAdjacent)
          .catch(() => {});
      })
      .catch(err => {
        toast.error(err.message);
        navigate('/wiki');
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const crossRefMap = useMemo(
    () => article ? buildCrossRefMap(article.related_articles) : new Map(),
    [article]
  );

  const headings = useMemo(
    () => article ? extractHeadings(article.content) : [],
    [article]
  );

  // Keyboard shortcuts: b=bookmark, n=next, p=prev
  const handleKeyShortcut = useCallback((e) => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'b' && article) {
      e.preventDefault();
      toggleBookmark(article);
    } else if (e.key === 'n' && adjacent.next) {
      e.preventDefault();
      navigate(`/wiki/${adjacent.next.slug}`);
    } else if (e.key === 'p' && adjacent.prev) {
      e.preventDefault();
      navigate(`/wiki/${adjacent.prev.slug}`);
    }
  }, [article, adjacent, toggleBookmark, navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyShortcut);
    return () => document.removeEventListener('keydown', handleKeyShortcut);
  }, [handleKeyShortcut]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-10 bg-white/5 rounded w-2/3" />
          <div className="h-3 bg-white/5 rounded w-full" />
          <div className="h-3 bg-white/5 rounded w-5/6" />
          <div className="h-3 bg-white/5 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!article) return null;

  const config = getCategoryConfig(article.category);
  const Icon = config.icon;
  const relatedGroups = {};
  (article.related_articles || []).forEach(rel => {
    const type = rel.relationship_type || 'related';
    if (!relatedGroups[type]) relatedGroups[type] = [];
    relatedGroups[type].push(rel);
  });

  return (
    <div className="min-h-screen py-8 px-4 max-w-5xl mx-auto">
      <ReadingProgress />
      <BackToTop />
      <KeyboardShortcuts />

      {/* Breadcrumb */}
      <motion.div
        className="flex items-center gap-2 text-sm mb-6 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Link
          to="/wiki"
          className="flex items-center gap-1 text-amber-200/60 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft size={14} />
          Wiki
        </Link>
        <span className="text-amber-200/30">/</span>
        <Link
          to={`/wiki?category=${article.category}`}
          className="text-amber-200/60 hover:text-amber-200 transition-colors flex items-center gap-1"
        >
          <Icon size={12} style={{ color: config.color }} />
          {config.label}
        </Link>
        {article.subcategory && (
          <>
            <span className="text-amber-200/30">/</span>
            <span className="text-amber-200/40">{formatCategoryName(article.subcategory)}</span>
          </>
        )}
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="panel-parchment">
            {/* Title and badges */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-amber-100 mb-3">
                  {article.title}
                </h1>
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 rounded-lg text-amber-200/30 hover:text-amber-200/60 hover:bg-white/5 transition-colors"
                    aria-label="Copy article link"
                    title="Copy link"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => toggleBookmark(article)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked(slug)
                        ? 'text-amber-400 bg-amber-400/10'
                        : 'text-amber-200/30 hover:text-amber-200/60 hover:bg-white/5'
                    }`}
                    aria-label={isBookmarked(slug) ? 'Remove bookmark' : 'Bookmark article'}
                  >
                    <Bookmark size={18} fill={isBookmarked(slug) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{ backgroundColor: `${config.color}20`, color: `${config.color}cc` }}
                >
                  {config.label}
                </span>
                {article.subcategory && (
                  <span className="text-xs bg-purple-900/20 text-purple-300/60 px-2 py-0.5 rounded">
                    {formatCategoryName(article.subcategory)}
                  </span>
                )}
                {article.ruleset && article.ruleset !== 'universal' && (
                  <span className="text-[10px] bg-amber-900/20 text-amber-200/40 px-1.5 py-0.5 rounded">
                    {article.ruleset === '5e-2024' ? '2024 Rules' : '2014 Rules'}
                  </span>
                )}
                {article.source && (
                  <span className="text-[10px] text-amber-200/30">
                    {article.source}
                  </span>
                )}
              </div>
              {article.summary && (
                <p className="text-amber-200/60 italic border-l-2 pl-4" style={{ borderColor: `${config.color}50` }}>
                  {article.summary}
                </p>
              )}
            </div>

            {/* Stat Block */}
            <StatBlockRouter category={article.category} metadata={article.metadata_json} />

            <hr className="divider-gold my-4" />

            {/* Article content with inline cross-reference links */}
            <div className="mt-4">
              {formatContent(article.content, crossRefMap)}
            </div>

            {/* Tags */}
            {article.tags && (
              <div className="mt-8 pt-4 border-t border-gold/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={12} className="text-amber-200/30" />
                  {article.tags.split(',').map(tag => (
                    <span key={tag.trim()} className="text-xs text-amber-200/40 bg-amber-900/15 px-2 py-0.5 rounded">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Article Footer — word count, reading time, source */}
            <ArticleFooter
              content={article.content}
              source={article.source}
              ruleset={article.ruleset}
            />
          </div>

          {/* Next / Previous navigation */}
          <ArticleNav prev={adjacent.prev} next={adjacent.next} />
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="lg:w-72 flex-shrink-0 space-y-4"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Active scroll-spy Table of Contents */}
          <TableOfContents headings={headings} />

          {/* Related Articles — enhanced cards */}
          {Object.keys(relatedGroups).length > 0 && (
            <div className="card-grimoire">
              <h4 className="font-display text-sm text-amber-200/60 mb-3 uppercase tracking-wider flex items-center gap-2">
                <ExternalLink size={12} />
                Related Articles
              </h4>
              <div className="space-y-4">
                {Object.entries(relatedGroups).map(([type, items]) => (
                  <div key={type}>
                    <p className="text-xs text-amber-200/40 uppercase tracking-wide mb-2">
                      {RELATIONSHIP_LABELS[type] || type}
                    </p>
                    <div className="space-y-1.5">
                      {items.map(rel => {
                        const relConfig = getCategoryConfig(rel.category);
                        const RelIcon = relConfig.icon;
                        return (
                          <Link
                            key={rel.slug}
                            to={`/wiki/${rel.slug}`}
                            replace
                            className="block p-2 rounded-lg border border-transparent hover:border-gold/20 hover:bg-white/[0.02] transition-all group"
                            style={{ borderLeftWidth: '2px', borderLeftColor: `${relConfig.color}40` }}
                          >
                            <div className="flex items-center gap-2">
                              <RelIcon size={12} style={{ color: relConfig.color }} className="shrink-0" />
                              <span className="text-sm text-amber-200/70 group-hover:text-amber-100 transition-colors truncate">
                                {rel.title}
                              </span>
                            </div>
                            <span
                              className="text-[10px] mt-0.5 inline-block px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: `${relConfig.color}10`, color: `${relConfig.color}80` }}
                            >
                              {relConfig.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cross-reference count indicator */}
          {crossRefMap.size > 0 && (
            <div className="card-grimoire">
              <div className="flex items-center gap-2 text-xs text-amber-200/40">
                <BookOpen size={12} />
                <span>{crossRefMap.size} linked article{crossRefMap.size !== 1 ? 's' : ''} in text</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="h-12" />

      <ArcaneWidget
        section="wiki-article"
        sectionData={{ articleTitle: article.title, articleCategory: article.category, articleSummary: article.summary }}
      />
    </div>
  );
}
