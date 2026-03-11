import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { CHANGELOG } from '../data/changelog';
import { useUpdateCheck } from '../hooks/useUpdateCheck';
import { invoke } from '@tauri-apps/api/core';

export default function UpdatesPanel({ show, onClose }) {
  const { updateAvailable, latestVersion, checking, lastChecked, checkForUpdates, currentVersion } = useUpdateCheck();
  const [expandedVersion, setExpandedVersion] = useState(CHANGELOG[0]?.version || null);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-[#0e0e16] border border-amber-200/15 rounded-lg w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div>
              <h2 className="font-display text-lg text-amber-100">Updates & Changelog</h2>
              <p className="text-xs text-amber-200/30 mt-0.5">Current: {currentVersion}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/5 text-amber-200/40 hover:text-amber-200/70 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Update status banner */}
          <div className="px-5 pt-4">
            {updateAvailable ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/8 border border-amber-500/20">
                <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-amber-200 font-medium">Update available: {latestVersion}</p>
                  <p className="text-xs text-amber-200/40 mt-0.5">
                    Pull the latest from GitHub to update.
                  </p>
                </div>
                <a
                  href="https://github.com/nisakson2000/dnd-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    try { invoke('plugin:shell|open', { path: 'https://github.com/nisakson2000/dnd-tracker' }); } catch {}
                  }}
                >
                  <ExternalLink size={12} /> View
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/15">
                <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-green-200/80 font-medium">You're up to date</p>
                  <p className="text-xs text-amber-200/30 mt-0.5">Running {currentVersion}</p>
                </div>
                <button
                  onClick={checkForUpdates}
                  disabled={checking}
                  className="flex items-center gap-1.5 text-xs text-amber-200/40 hover:text-amber-200/70 transition-colors disabled:opacity-40"
                >
                  <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
                  {checking ? 'Checking...' : 'Check'}
                </button>
              </div>
            )}
            {lastChecked && (
              <p className="text-[10px] text-amber-200/20 mt-2 flex items-center gap-1">
                <Clock size={9} />
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Changelog */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <h3 className="text-[10px] font-mono tracking-widest uppercase text-amber-200/25 mb-2">Recent Updates</h3>

            {CHANGELOG.map((entry) => {
              const isExpanded = expandedVersion === entry.version;
              const isCurrent = entry.version === currentVersion;

              return (
                <div
                  key={entry.version}
                  className="rounded-lg border overflow-hidden transition-colors"
                  style={{
                    borderColor: isCurrent ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                    background: isCurrent ? 'rgba(201,168,76,0.03)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  {/* Version header — clickable */}
                  <button
                    onClick={() => setExpandedVersion(isExpanded ? null : entry.version)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-display font-semibold text-amber-100">{entry.version}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-amber-500/15 text-amber-400/70 px-1.5 py-0.5 rounded font-mono">CURRENT</span>
                        )}
                      </div>
                      <p className="text-xs text-amber-200/40 mt-0.5">{entry.title} — {entry.date}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={14} className="text-amber-200/30 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={14} className="text-amber-200/30 flex-shrink-0" />
                    )}
                  </button>

                  {/* Expanded changes */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <ul className="px-3 pb-3 space-y-1.5">
                          {entry.changes.map((change, i) => (
                            <li key={i} className="flex gap-2 text-xs text-amber-200/50">
                              <span className="text-amber-200/20 mt-0.5 flex-shrink-0">•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
