import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function SubclassSelectModal({ show, className, subclasses, onSelect, onClose }) {
  const [selected, setSelected] = useState('');

  if (!show || !subclasses?.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#09090f] border border-white/10 rounded-lg w-full max-w-md mx-4 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={20} style={{ color: 'var(--accent-l)' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>
                Choose Your Subclass
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
              Your {className} has reached the level to specialize. Select a subclass to define your path.
            </p>
          </div>

          {/* Subclass list */}
          <div style={{ padding: '16px 24px', maxHeight: '50vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subclasses.map(sc => (
                <button
                  key={sc}
                  onClick={() => setSelected(sc)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: selected === sc ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: selected === sc ? 'var(--accent-xl)' : 'var(--bg-panel)',
                    color: selected === sc ? 'var(--accent-l)' : 'var(--text)',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: selected === sc ? 600 : 400,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Decide Later
            </button>
            <button
              onClick={() => { if (selected) onSelect(selected); }}
              disabled={!selected}
              className="btn-primary"
              style={{ fontSize: '13px', padding: '8px 16px', opacity: selected ? 1 : 0.4 }}
            >
              Confirm Subclass
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
