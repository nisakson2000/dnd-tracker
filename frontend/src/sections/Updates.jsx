import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { CHANGELOG } from '../data/changelog';
import { useUpdateCheck } from '../hooks/useUpdateCheck';
import { invoke } from '@tauri-apps/api/core';

export default function Updates() {
  const { updateAvailable, latestVersion, checking, lastChecked, checkForUpdates, currentVersion } = useUpdateCheck();
  const [expandedVersion, setExpandedVersion] = useState(CHANGELOG[0]?.version || null);

  return (
    <div style={{ maxWidth: '640px' }}>
      <h2 className="font-display text-2xl text-amber-100 mb-1">Updates & Changelog</h2>
      <p className="text-sm text-amber-200/30 mb-6">Current version: {currentVersion}</p>

      {/* Update status */}
      <div className="mb-6">
        {updateAvailable ? (
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)' }}>
            <AlertCircle size={20} className="text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-200 font-semibold">Update available: {latestVersion}</p>
              <p className="text-xs text-amber-200/40 mt-1">Pull the latest from GitHub to get the new version.</p>
            </div>
            <button
              onClick={() => {
                try { invoke('plugin:shell|open', { path: 'https://github.com/nisakson2000/dnd-tracker' }); } catch {}
              }}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors bg-transparent border-none cursor-pointer"
            >
              <ExternalLink size={12} /> GitHub
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)' }}>
            <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'rgba(74,222,128,0.8)' }}>You're up to date</p>
              <p className="text-xs text-amber-200/30 mt-0.5">Running the latest version.</p>
            </div>
            <button
              onClick={checkForUpdates}
              disabled={checking}
              className="flex items-center gap-1.5 text-xs text-amber-200/40 hover:text-amber-200/70 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40"
            >
              <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
              {checking ? 'Checking...' : 'Check now'}
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
      <h3 className="text-[10px] font-mono tracking-widest uppercase text-amber-200/25 mb-3">Recent Versions</h3>
      <div className="space-y-3">
        {CHANGELOG.map((entry) => {
          const isExpanded = expandedVersion === entry.version;
          const isCurrent = entry.version === currentVersion || entry.version === `v${currentVersion}` || `v${entry.version}` === currentVersion;

          return (
            <div
              key={entry.version}
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: isCurrent ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                background: isCurrent ? 'rgba(201,168,76,0.03)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <button
                onClick={() => setExpandedVersion(isExpanded ? null : entry.version)}
                className="w-full flex items-center gap-3 p-4 text-left transition-colors bg-transparent border-none cursor-pointer"
                style={{ fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display font-semibold text-amber-100">{entry.version}</span>
                    <span className="text-xs text-amber-200/30">—</span>
                    <span className="text-xs text-amber-200/50">{entry.title}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-amber-500/15 text-amber-400/70 px-1.5 py-0.5 rounded font-mono">CURRENT</span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-200/25 mt-1">{entry.date}</p>
                </div>
                {isExpanded ? (
                  <ChevronUp size={14} className="text-amber-200/30 flex-shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-amber-200/30 flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="px-4 pb-4 space-y-2">
                      {entry.changes.map((change, i) => (
                        <li key={i} className="flex gap-2.5 text-xs text-amber-200/50">
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

    </div>
  );
}
