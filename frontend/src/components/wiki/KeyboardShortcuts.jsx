import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['/'], description: 'Open search palette' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['b'], description: 'Toggle bookmark (article page)' },
  { keys: ['n'], description: 'Next article in category' },
  { keys: ['p'], description: 'Previous article in category' },
  { keys: ['Esc'], description: 'Close overlay / go back' },
  { keys: ['↑', '↓'], description: 'Navigate search results' },
  { keys: ['Enter'], description: 'Select search result' },
];

/**
 * Keyboard shortcuts help overlay.
 * Press "?" to toggle visibility.
 */
export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      {/* Visible trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 left-6 z-50 w-8 h-8 rounded-full bg-amber-900/60 border border-gold/20 text-amber-200/40 hover:text-amber-200/80 hover:border-gold/40 shadow-lg flex items-center justify-center transition-colors text-xs font-mono"
          title="Keyboard shortcuts (?)"
        >
          ?
        </button>
      )}
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            className="relative card-grimoire w-full max-w-sm p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-amber-100 flex items-center gap-2">
                <Keyboard size={16} />
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-amber-200/40 hover:text-amber-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {SHORTCUTS.map((s) => (
                <div key={s.description} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-amber-200/60">{s.description}</span>
                  <div className="flex gap-1">
                    {s.keys.map((key) => (
                      <kbd
                        key={key}
                        className="text-xs px-2 py-0.5 rounded bg-white/5 border border-amber-200/10 text-amber-200/70 font-mono"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-amber-200/25 mt-4 text-center">
              Press <kbd className="px-1 bg-white/5 border border-amber-200/10 rounded">?</kbd> to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
