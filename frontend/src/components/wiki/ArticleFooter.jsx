import { Clock, FileText, BookOpen } from 'lucide-react';

/**
 * Article metadata footer showing word count, reading time, and source.
 */
export default function ArticleFooter({ content, source, ruleset }) {
  if (!content) return null;

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 225));

  return (
    <div className="mt-8 pt-4 border-t border-gold/10 flex flex-wrap items-center gap-4 text-xs text-amber-200/35">
      <span className="flex items-center gap-1.5">
        <FileText size={11} />
        {wordCount.toLocaleString()} words
      </span>
      <span className="flex items-center gap-1.5">
        <Clock size={11} />
        {readingTime} min read
      </span>
      {source && (
        <span className="flex items-center gap-1.5">
          <BookOpen size={11} />
          {source}
        </span>
      )}
      {ruleset && ruleset !== 'universal' && (
        <span className="px-1.5 py-0.5 rounded bg-amber-900/20">
          {ruleset === '5e-2024' ? '2024 Rules' : '2014 Rules'}
        </span>
      )}
    </div>
  );
}
