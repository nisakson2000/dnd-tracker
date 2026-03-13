import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, Tag, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';
import { getArticle } from '../api/wiki';
import { getCategoryConfig } from '../data/wikiCategoryConfig';
import ArcaneWidget from '../components/ArcaneWidget';
import StatBlockRouter from '../components/wiki/statblocks/StatBlockRouter';
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

function formatContent(content) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];

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
        <h3 key={i} id={id} className="font-display text-amber-100 mt-6 mb-2 scroll-mt-20">
          {line.slice(3)}
        </h3>
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
          {renderInlineFormatting(text)}
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-3" />);
    } else {
      elements.push(
        <p key={i} className="text-amber-200/70 mb-2 leading-relaxed">
          {renderInlineFormatting(line)}
        </p>
      );
    }
  }

  if (inTable) flushTable();
  return elements;
}

function renderInlineFormatting(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-amber-100 font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
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
  const { toggleBookmark, isBookmarked } = useWikiBookmarks();
  const { recordVisit } = useWikiHistory();

  useEffect(() => {
    setLoading(true);
    getArticle(slug)
      .then(data => {
        setArticle(data);
        recordVisit({ slug: data.slug, title: data.title, category: data.category });
      })
      .catch(err => {
        toast.error(err.message);
        navigate('/wiki');
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const headings = extractHeadings(article.content);
  const relatedGroups = {};
  (article.related_articles || []).forEach(rel => {
    const type = rel.relationship_type || 'related';
    if (!relatedGroups[type]) relatedGroups[type] = [];
    relatedGroups[type].push(rel);
  });

  return (
    <div className="min-h-screen py-8 px-4 max-w-5xl mx-auto">
      {/* Breadcrumb — proper links instead of navigate(-1) */}
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
                <button
                  onClick={() => toggleBookmark(article)}
                  className={`shrink-0 mt-1 p-1.5 rounded-lg transition-colors ${
                    isBookmarked(slug)
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-amber-200/30 hover:text-amber-200/60 hover:bg-white/5'
                  }`}
                  aria-label={isBookmarked(slug) ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <Bookmark size={18} fill={isBookmarked(slug) ? 'currentColor' : 'none'} />
                </button>
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

            {/* Stat Block — category-specific metadata rendering */}
            <StatBlockRouter category={article.category} metadata={article.metadata_json} />

            <hr className="divider-gold my-4" />

            {/* Article content */}
            <div className="mt-4">
              {formatContent(article.content)}
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
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="lg:w-72 flex-shrink-0 space-y-4"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Table of Contents */}
          {headings.length > 2 && (
            <div className="card-grimoire">
              <h4 className="font-display text-sm text-amber-200/60 mb-3 uppercase tracking-wider">
                Contents
              </h4>
              <nav className="space-y-1">
                {headings.map((h, i) => (
                  <a
                    key={i}
                    href={`#${h.id}`}
                    className="block text-sm text-amber-200/60 hover:text-amber-100 transition-colors"
                    style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Related Articles */}
          {Object.keys(relatedGroups).length > 0 && (
            <div className="card-grimoire">
              <h4 className="font-display text-sm text-amber-200/60 mb-3 uppercase tracking-wider flex items-center gap-2">
                <ExternalLink size={12} />
                Related Articles
              </h4>
              <div className="space-y-4">
                {Object.entries(relatedGroups).map(([type, items]) => (
                  <div key={type}>
                    <p className="text-xs text-amber-200/40 uppercase tracking-wide mb-1">
                      {RELATIONSHIP_LABELS[type] || type}
                    </p>
                    <ul className="space-y-1">
                      {items.map(rel => {
                        const relConfig = getCategoryConfig(rel.category);
                        return (
                          <li key={rel.slug}>
                            <Link
                              to={`/wiki/${rel.slug}`}
                              replace
                              className="text-sm text-amber-200/70 hover:text-amber-100 transition-colors flex items-center gap-1.5"
                            >
                              <BookOpen size={10} style={{ color: relConfig.color }} className="flex-shrink-0" />
                              {rel.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
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
