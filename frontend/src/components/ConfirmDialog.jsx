import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ show, title, message, warning, confirmText, onConfirm, onCancel }) {
  const [typed, setTyped] = useState('');

  useEffect(() => { if (!show) setTyped(''); }, [show]);

  const canConfirm = !confirmText || typed === confirmText;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onCancel()}
        >
          <motion.div
            className="bg-[#14121c] border border-red-800/50 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
            initial={{ scale: 0.92, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-900/40 border border-red-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-display text-lg text-red-300 mb-1">{title}</h3>
                <p className="text-sm text-amber-200/60 leading-relaxed">{message}</p>
              </div>
            </div>

            {warning && (
              <div className="bg-red-950/40 border border-red-800/40 rounded p-3 mb-4">
                <p className="text-xs text-red-300/80 leading-relaxed">{warning}</p>
              </div>
            )}

            {confirmText && (
              <div className="mb-5">
                <label className="label text-amber-200/50 mb-2">
                  Type <span className="text-red-300 font-mono">{confirmText}</span> to confirm
                </label>
                <input
                  className="input w-full"
                  value={typed}
                  onChange={e => setTyped(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && canConfirm && onConfirm()}
                  placeholder={`Type "${confirmText}" here...`}
                  autoFocus
                  autoComplete="off"
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button onClick={onCancel} className="btn-secondary text-sm">
                {confirmText ? 'Keep Character' : 'Cancel'}
              </button>
              <button
                onClick={onConfirm}
                disabled={!canConfirm}
                className={`btn-danger text-sm transition-all ${!canConfirm ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              >
                {confirmText ? 'Delete Forever' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
