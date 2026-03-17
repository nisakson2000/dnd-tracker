import { useState, useEffect, useCallback } from 'react';
import { Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFeatures, updateFeature } from '../api/features';

export default function ClassResourceBar({ characterId, onUpdate }) {
  const [resources, setResources] = useState([]);

  const loadResources = useCallback(async () => {
    try {
      const feats = await getFeatures(characterId);
      const tracked = (feats || [])
        .filter(f => (f.uses_total ?? 0) > 0)
        .sort((a, b) => (b.uses_total - a.uses_total))
        .slice(0, 5);
      setResources(tracked);
    } catch { /* ignore */ }
  }, [characterId]);

  useEffect(() => { loadResources(); }, [loadResources]);

  // Reload on rest events
  useEffect(() => {
    const handler = () => loadResources();
    window.addEventListener('codex-character-reload', handler);
    return () => window.removeEventListener('codex-character-reload', handler);
  }, [loadResources]);

  const spendUse = async (e, feat) => {
    e.stopPropagation();
    if ((feat.uses_remaining ?? 0) <= 0) {
      toast(`${feat.name} — no uses remaining`, { icon: '\u26A0\uFE0F', duration: 2000, style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' } });
      return;
    }
    const newRemaining = feat.uses_remaining - 1;
    try {
      await updateFeature(characterId, feat.id, { ...feat, uses_remaining: newRemaining });
      setResources(prev => prev.map(f => f.id === feat.id ? { ...f, uses_remaining: newRemaining } : f));
      toast(`${feat.name}: ${newRemaining}/${feat.uses_total}`, {
        icon: '\u26A1', duration: 2000,
        style: { background: '#1a1520', color: '#fde68a', border: '1px solid rgba(201,168,76,0.3)', fontSize: '12px' },
      });
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to update: ' + (err.message || err));
    }
  };

  const recoverUse = async (e, feat) => {
    e.preventDefault();
    e.stopPropagation();
    if ((feat.uses_remaining ?? 0) >= feat.uses_total) {
      toast(`${feat.name} — already at max`, { duration: 1500, style: { background: '#1a1520', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)' } });
      return;
    }
    const newRemaining = (feat.uses_remaining ?? 0) + 1;
    try {
      await updateFeature(characterId, feat.id, { ...feat, uses_remaining: newRemaining });
      setResources(prev => prev.map(f => f.id === feat.id ? { ...f, uses_remaining: newRemaining } : f));
      toast(`${feat.name}: ${newRemaining}/${feat.uses_total}`, {
        icon: '\u2705', duration: 2000,
        style: { background: '#1a1520', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)', fontSize: '12px' },
      });
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to update: ' + (err.message || err));
    }
  };

  if (resources.length === 0) return null;

  return (
    <>
      <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
      {resources.map(feat => {
        const pct = feat.uses_total > 0 ? (feat.uses_remaining ?? 0) / feat.uses_total : 0;
        const isEmpty = (feat.uses_remaining ?? 0) <= 0;
        const color = isEmpty ? 'rgba(253,230,138,0.35)' : '#fde68a';
        const bg = isEmpty ? 'rgba(201,168,76,0.05)' : 'rgba(201,168,76,0.1)';
        const border = isEmpty ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.25)';
        // Truncate long names
        const shortName = feat.name.length > 12 ? feat.name.slice(0, 11) + '\u2026' : feat.name;
        return (
          <button
            key={feat.id}
            onClick={(e) => spendUse(e, feat)}
            onContextMenu={(e) => recoverUse(e, feat)}
            title={`${feat.name}: ${feat.uses_remaining ?? 0}/${feat.uses_total}\nClick to spend \u00B7 Right-click to recover`}
            style={{
              background: bg,
              border: `1px solid ${border}`,
              color,
              fontSize: '9px',
              padding: '1px 6px',
              borderRadius: '5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-ui)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
          >
            <Zap size={8} style={{ opacity: 0.7 }} />
            <span style={{ fontWeight: 600, fontSize: '8px' }}>{shortName}</span>
            <span style={{ opacity: 0.8 }}>{feat.uses_remaining ?? 0}/{feat.uses_total}</span>
          </button>
        );
      })}
    </>
  );
}
