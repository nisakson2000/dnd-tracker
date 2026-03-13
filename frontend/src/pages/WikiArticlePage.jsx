import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { getArticle } from '../api/wiki';
import ArcaneWidget from '../components/ArcaneWidget';

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
              <tr key={`row-${i}`} className={i % 2 === 0 ? 'bg-white/2' : ''}>
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

    // Table row (pipe-separated)
    if (line.includes('|') && line.trim().startsWith('|')) {
      // Skip separator rows like |---|---|
      if (/^\|[\s\-:|]+\|$/.test(line.trim())) continue;
      const cells = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
      if (cells.length > 0) {
        inTable = true;
        tableRows.push(cells);
        continue;
      }
    }

    if (inTable) flushTable();

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="font-display text-amber-100 mt-5 mb-2 text-base">
          {line.slice(4)}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="font-display text-amber-100 mt-6 mb-2">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h2 key={i} className="font-display text-amber-100 mt-6 mb-3">
          {line.slice(2)}
        </h2>
      );
    }
    // Bullet points
    else if (line.match(/^\s*[-*]\s/)) {
      const text = line.replace(/^\s*[-*]\s/, '');
      elements.push(
        <li key={i} className="text-amber-200/70 ml-5 list-disc mb-1">
          {renderInlineFormatting(text)}
        </li>
      );
    }
    // Empty lines
    else if (line.trim() === '') {
      elements.push(<div key={i} className="h-3" />);
    }
    // Regular paragraphs
    else {
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
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-amber-100 font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function MetadataPanel({ metadata }) {
  if (!metadata) return null;

  let parsed = metadata;
  if (typeof metadata === 'string') {
    try { parsed = JSON.parse(metadata); } catch { return null; }
  }

  if (!parsed || typeof parsed !== 'object' || Object.keys(parsed).length === 0) return null;

  return (
    <div className="card-grimoire mt-6">
      <h4 className="font-display text-sm text-amber-200/60 mb-3 uppercase tracking-wider">
        Details
      </h4>
      <dl className="space-y-2">
        {Object.entries(parsed).map(([key, value]) => {
          if (value === null || value === undefined || value === '') return null;
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          let display;

          if (Array.isArray(value)) {
            display = value.join(', ');
          } else if (typeof value === 'object') {
            display = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
          } else if (typeof value === 'boolean') {
            display = value ? 'Yes' : 'No';
          } else {
            display = String(value);
          }

          return (
            <div key={key}>
              <dt className="text-xs text-amber-200/40 uppercase tracking-wide">{label}</dt>
              <dd className="text-sm text-amber-200/70">{display}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export default function WikiArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    getArticle(slug)
      .then(setArticle)
      .catch(err => {
        toast.error(err.message);
        navigate('/wiki');
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-200/40">
        Opening the tome...
      </div>
    );
  }

  if (!article) return null;

  const relatedGroups = {};
  (article.related_articles || []).forEach(rel => {
    const type = rel.relationship_type || 'related';
    if (!relatedGroups[type]) relatedGroups[type] = [];
    relatedGroups[type].push(rel);
  });

  return (
    <div className="min-h-screen py-8 px-4 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <motion.div
        className="flex items-center gap-2 text-sm mb-6 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-amber-200/60 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft size={14} />
          Wiki
        </button>
        <span className="text-amber-200/30">/</span>
        <button
          onClick={() => navigate(-1)}
          className="text-amber-200/60 hover:text-amber-200 transition-colors"
        >
          {formatCategoryName(article.category)}
        </button>
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
              <h1 className="text-3xl md:text-4xl font-display font-bold text-amber-100 mb-3">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs bg-amber-900/30 text-amber-200/60 px-2 py-0.5 rounded">
                  {formatCategoryName(article.category)}
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
                <p className="text-amber-200/60 italic border-l-2 border-gold/30 pl-4">
                  {article.summary}
                </p>
              )}
            </div>

            <hr className="divider-gold" />

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
          {/* Metadata */}
          <MetadataPanel metadata={article.metadata_json} />

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
                      {items.map(rel => (
                        <li key={rel.slug}>
                          <Link
                            to={`/wiki/${rel.slug}`}
                            replace
                            className="text-sm text-amber-200/70 hover:text-amber-100 transition-colors flex items-center gap-1"
                          >
                            <BookOpen size={10} className="flex-shrink-0 opacity-40" />
                            {rel.title}
                          </Link>
                        </li>
                      ))}
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
