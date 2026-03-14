import { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { SHORTCUTS, getShortcutLabel } from '../utils/keyboardShortcuts';

const kbdStyle = {
  background: 'rgba(253,230,138,0.08)',
  border: '1px solid rgba(253,230,138,0.15)',
  borderRadius: '4px',
  padding: '2px 7px',
  fontSize: '10px',
  color: 'rgba(253,230,138,0.65)',
  fontFamily: 'var(--font-mono, monospace)',
  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
};

const sectionHeadingStyle = {
  fontFamily: 'var(--font-heading)',
  fontSize: '11px',
  letterSpacing: '0.08em',
  color: 'rgba(253,230,138,0.4)',
  textTransform: 'uppercase',
  marginBottom: '10px',
};

function ShortcutRow({ keyLabel, description }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'rgba(253,230,138,0.55)' }}>{description}</span>
      <kbd style={kbdStyle}>{keyLabel}</kbd>
    </div>
  );
}

// Navigation shortcuts (section keys 1-9)
const NAV_SHORTCUTS = [
  'overview', 'backstory', 'spellbook', 'inventory',
  'features', 'combat', 'journal', 'npcs', 'quests',
];

// Action shortcuts
const ACTION_SHORTCUTS = ['save', 'new-entry', 'command-palette'];
const COMBAT_SHORTCUTS = ['quick-roll'];
const GENERAL_ENTRIES = [
  { key: '?', label: 'Toggle this help' },
  { key: 'Escape', label: 'Close modals / overlays' },
  { key: 'Ctrl+Enter', label: 'Save form' },
  { key: 'Ctrl+Shift+R', label: 'Roll initiative' },
  { key: 'Ctrl+Shift+N', label: 'Quick journal note' },
];

export default function KeyboardShortcutsHelp({ open, onClose }) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(4,4,11,0.88)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div style={{
        background: 'rgba(12,10,20,0.97)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: '16px',
        padding: '32px 40px',
        maxWidth: '720px',
        width: '90vw',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 1px rgba(201,168,76,0.3)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Keyboard size={20} style={{ color: '#fde68a' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fde68a', fontWeight: 600 }}>
              Keyboard Shortcuts
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(253,230,138,0.06)', border: '1px solid rgba(253,230,138,0.15)',
              borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
              color: 'rgba(253,230,138,0.5)', fontSize: '11px', fontFamily: 'var(--font-ui)',
              display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s',
            }}
          >
            <X size={12} /> <span>Esc</span>
          </button>
        </div>

        {/* Shortcut grid - 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 40px', fontSize: '12px', fontFamily: 'var(--font-ui)' }}>

          {/* Left column: Navigation */}
          <div>
            <div style={sectionHeadingStyle}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {NAV_SHORTCUTS.map(action => {
                const def = SHORTCUTS[action];
                if (!def) return null;
                return (
                  <ShortcutRow
                    key={action}
                    keyLabel={getShortcutLabel(action)}
                    description={def.label}
                  />
                );
              })}
            </div>
          </div>

          {/* Right column: Actions, Combat, General */}
          <div>
            <div style={sectionHeadingStyle}>Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {ACTION_SHORTCUTS.map(action => {
                const def = SHORTCUTS[action];
                if (!def) return null;
                return (
                  <ShortcutRow
                    key={action}
                    keyLabel={getShortcutLabel(action)}
                    description={def.label}
                  />
                );
              })}
            </div>

            <div style={{ ...sectionHeadingStyle, marginTop: '20px' }}>Combat</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {COMBAT_SHORTCUTS.map(action => {
                const def = SHORTCUTS[action];
                if (!def) return null;
                return (
                  <ShortcutRow
                    key={action}
                    keyLabel={getShortcutLabel(action)}
                    description={def.label}
                  />
                );
              })}
              <ShortcutRow keyLabel="Ctrl+Shift+R" description="Roll initiative" />
            </div>

            <div style={{ ...sectionHeadingStyle, marginTop: '20px' }}>General</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {GENERAL_ENTRIES.map(({ key, label }) => (
                <ShortcutRow key={key} keyLabel={key} description={label} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: 'rgba(253,230,138,0.25)', fontFamily: 'var(--font-ui)' }}>
          Press <kbd style={{ background: 'rgba(253,230,138,0.06)', border: '1px solid rgba(253,230,138,0.1)', borderRadius: '3px', padding: '0 4px', fontSize: '10px', color: 'rgba(253,230,138,0.4)', fontFamily: 'var(--font-mono, monospace)' }}>?</kbd> or <kbd style={{ background: 'rgba(253,230,138,0.06)', border: '1px solid rgba(253,230,138,0.1)', borderRadius: '3px', padding: '0 4px', fontSize: '10px', color: 'rgba(253,230,138,0.4)', fontFamily: 'var(--font-mono, monospace)' }}>Esc</kbd> to dismiss
        </div>
      </div>
    </div>
  );
}
