import { useState, useCallback, useMemo } from 'react';
import {
  ScrollText, Copy, Check, X, ChevronDown, ChevronUp,
  Clock, Star, Skull, Swords, MapPin, Dice5, Heart, Shield, Save,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

/* ── Formatting helpers ── */

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function StatCard({ icon: Icon, label, value, color = 'var(--text-dim)', iconColor }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '12px 16px', borderRadius: '10px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      minWidth: '100px', flex: '1 1 100px',
    }}>
      {Icon && <Icon size={16} style={{ color: iconColor || color, marginBottom: '6px' }} />}
      <div style={{
        fontSize: '18px', fontWeight: 800, color,
        fontFamily: 'var(--font-display, "Cinzel", serif)',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '10px', fontWeight: 600, color: 'var(--text-mute)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        fontFamily: 'var(--font-mono, monospace)', marginTop: '2px',
      }}>
        {label}
      </div>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 700, color: 'var(--text-mute)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      fontFamily: 'var(--font-mono, monospace)',
      marginTop: '16px', marginBottom: '8px',
      paddingBottom: '4px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {children}
    </div>
  );
}

function ListItem({ text, subtext, icon: Icon, iconColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '6px 10px', borderRadius: '6px',
      background: 'rgba(255,255,255,0.02)',
      marginBottom: '4px',
    }}>
      {Icon && <Icon size={12} style={{ color: iconColor || 'var(--text-mute)', flexShrink: 0 }} />}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
          {text}
        </div>
        {subtext && (
          <div style={{ fontSize: '10px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SessionRecap — Post-session summary screen.
 *
 * Props (all optional — the component gracefully handles missing data):
 * - sessionId:      string
 * - duration:       number (seconds)
 * - totalXp:        number
 * - monstersDefeated: [{ name, count }]
 * - scenesVisited:  [string]
 * - notableRolls:   [{ expression, total, type ('nat20'|'nat1'), roller }]
 * - combatStats:    { totalDamage, totalHealing, rounds }
 * - playerActions:  [{ player, action, count }]
 * - actionLog:      [{ text, timestamp }]
 * - campaignId:     string
 */
export default function SessionRecap({
  sessionId,
  duration = 0,
  totalXp = 0,
  monstersDefeated = [],
  scenesVisited = [],
  notableRolls = [],
  combatStats = {},
  playerActions = [],
  actionLog = [],
  campaignId,
}) {
  const [generatedRecap, setGeneratedRecap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Derive notable rolls from actionLog if not provided explicitly
  const derivedNotableRolls = useMemo(() => {
    if (notableRolls.length > 0) return notableRolls;
    const nat20s = [];
    const nat1s = [];
    for (const entry of actionLog) {
      if (!entry.text) continue;
      const text = entry.text;
      if (text.includes('Roll:') || text.includes('roll')) {
        if (text.includes('= 20') || text.includes('Critical!') || text.includes('nat 20')) {
          nat20s.push({ expression: text, total: 20, type: 'nat20', roller: text.match(/\[([^\]]+)\]/)?.[1] || 'Unknown' });
        }
        if (text.includes('= 1') || text.includes('Critical Fail') || text.includes('nat 1')) {
          nat1s.push({ expression: text, total: 1, type: 'nat1', roller: text.match(/\[([^\]]+)\]/)?.[1] || 'Unknown' });
        }
      }
    }
    return [...nat20s, ...nat1s];
  }, [notableRolls, actionLog]);

  // Derive monsters from actionLog if not provided
  const derivedMonsters = useMemo(() => {
    if (monstersDefeated.length > 0) return monstersDefeated;
    const counts = {};
    for (const entry of actionLog) {
      if (!entry.text) continue;
      const match = entry.text.match(/Monster killed:\s*(.+)/i);
      if (match) {
        const name = match[1].trim();
        counts[name] = (counts[name] || 0) + 1;
      }
    }
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [monstersDefeated, actionLog]);

  // Derive scenes from actionLog if not provided
  const derivedScenes = useMemo(() => {
    if (scenesVisited.length > 0) return scenesVisited;
    const scenes = new Set();
    for (const entry of actionLog) {
      if (!entry.text) continue;
      const match = entry.text.match(/Scene advanced|New location:\s*(.+)/i);
      if (match && match[1]) scenes.add(match[1].trim());
    }
    return [...scenes];
  }, [scenesVisited, actionLog]);

  const hasSessionData = duration > 0 || totalXp > 0 || derivedMonsters.length > 0 ||
    derivedScenes.length > 0 || derivedNotableRolls.length > 0 ||
    combatStats.totalDamage > 0 || playerActions.length > 0;

  const handleGenerate = useCallback(async () => {
    if (!sessionId) {
      toast.error('No session ID available');
      return;
    }
    setLoading(true);
    try {
      const md = await invoke('generate_session_recap', { sessionId });
      setGeneratedRecap(md);
      setExpanded(true);
    } catch (e) {
      toast.error('Failed to generate recap');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const handleCopy = useCallback(async () => {
    const text = generatedRecap || buildRecapText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Recap copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, [generatedRecap]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveToCampaign = useCallback(async () => {
    if (!campaignId || !sessionId) {
      toast.error('Missing campaign or session ID');
      return;
    }
    setSaving(true);
    try {
      const recapData = {
        sessionId,
        duration,
        totalXp,
        monstersDefeated: derivedMonsters,
        scenesVisited: derivedScenes,
        notableRolls: derivedNotableRolls,
        combatStats,
        playerActions,
        savedAt: Date.now(),
      };
      // Persist to localStorage as campaign recap
      const key = `codex-session-recaps-${campaignId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(recapData);
      localStorage.setItem(key, JSON.stringify(existing.slice(-50))); // keep last 50
      setSaved(true);
      toast.success('Recap saved to campaign');
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      toast.error('Failed to save recap');
      console.error(e);
    } finally {
      setSaving(false);
    }
  }, [campaignId, sessionId, duration, totalXp, derivedMonsters, derivedScenes, derivedNotableRolls, combatStats, playerActions]);

  function buildRecapText() {
    const lines = ['# Session Recap\n'];
    if (duration > 0) lines.push(`**Duration:** ${formatDuration(duration)}`);
    if (totalXp > 0) lines.push(`**XP Awarded:** ${totalXp}`);
    if (derivedMonsters.length > 0) {
      lines.push('\n## Monsters Defeated');
      derivedMonsters.forEach(m => lines.push(`- ${m.name}${m.count > 1 ? ` x${m.count}` : ''}`));
    }
    if (derivedScenes.length > 0) {
      lines.push('\n## Scenes Visited');
      derivedScenes.forEach(s => lines.push(`- ${s}`));
    }
    if (derivedNotableRolls.length > 0) {
      lines.push('\n## Notable Rolls');
      derivedNotableRolls.forEach(r => lines.push(`- ${r.type === 'nat20' ? 'NAT 20' : 'NAT 1'} by ${r.roller}`));
    }
    if (combatStats.totalDamage > 0 || combatStats.totalHealing > 0) {
      lines.push('\n## Combat Stats');
      if (combatStats.totalDamage) lines.push(`- Total Damage: ${combatStats.totalDamage}`);
      if (combatStats.totalHealing) lines.push(`- Total Healing: ${combatStats.totalHealing}`);
      if (combatStats.rounds) lines.push(`- Combat Rounds: ${combatStats.rounds}`);
    }
    return lines.join('\n');
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 14px',
          background: 'none', border: 'none', cursor: loading ? 'wait' : 'pointer',
          color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600,
          fontFamily: 'var(--font-ui)', transition: 'color 0.15s',
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; }}
      >
        <ScrollText size={13} />
        Session Recap
        <span style={{ marginLeft: 'auto' }}>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </span>
      </button>

      {expanded && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '16px',
        }}>
          {/* Stat cards row */}
          {hasSessionData && (
            <div style={{
              display: 'flex', gap: '8px', flexWrap: 'wrap',
              marginBottom: '12px',
            }}>
              {duration > 0 && (
                <StatCard icon={Clock} label="Duration" value={formatDuration(duration)} color="#fbbf24" iconColor="#fbbf24" />
              )}
              {totalXp > 0 && (
                <StatCard icon={Star} label="XP Awarded" value={totalXp.toLocaleString()} color="#c9a84c" iconColor="#c9a84c" />
              )}
              {derivedMonsters.length > 0 && (
                <StatCard icon={Skull} label="Monsters Slain" value={derivedMonsters.reduce((s, m) => s + m.count, 0)} color="#ef4444" iconColor="#ef4444" />
              )}
              {(combatStats.rounds > 0) && (
                <StatCard icon={Swords} label="Combat Rounds" value={combatStats.rounds} color="#c084fc" iconColor="#c084fc" />
              )}
            </div>
          )}

          {/* Combat stats */}
          {(combatStats.totalDamage > 0 || combatStats.totalHealing > 0) && (
            <>
              <SectionHeader>Combat Summary</SectionHeader>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {combatStats.totalDamage > 0 && (
                  <StatCard icon={Swords} label="Total Damage" value={combatStats.totalDamage.toLocaleString()} color="#ef4444" iconColor="#ef4444" />
                )}
                {combatStats.totalHealing > 0 && (
                  <StatCard icon={Heart} label="Total Healing" value={combatStats.totalHealing.toLocaleString()} color="#4ade80" iconColor="#4ade80" />
                )}
              </div>
            </>
          )}

          {/* Monsters defeated */}
          {derivedMonsters.length > 0 && (
            <>
              <SectionHeader>Monsters Defeated</SectionHeader>
              {derivedMonsters.map((m, i) => (
                <ListItem
                  key={i}
                  icon={Skull}
                  iconColor="#ef4444"
                  text={m.name}
                  subtext={m.count > 1 ? `x${m.count}` : null}
                />
              ))}
            </>
          )}

          {/* Scenes visited */}
          {derivedScenes.length > 0 && (
            <>
              <SectionHeader>Scenes Visited</SectionHeader>
              {derivedScenes.map((s, i) => (
                <ListItem key={i} icon={MapPin} iconColor="#60a5fa" text={s} />
              ))}
            </>
          )}

          {/* Notable rolls */}
          {derivedNotableRolls.length > 0 && (
            <>
              <SectionHeader>Notable Rolls</SectionHeader>
              {derivedNotableRolls.map((r, i) => (
                <ListItem
                  key={i}
                  icon={Dice5}
                  iconColor={r.type === 'nat20' ? '#4ade80' : '#ef4444'}
                  text={`${r.type === 'nat20' ? 'Natural 20' : 'Natural 1'} by ${r.roller}`}
                  subtext={r.expression !== r.roller ? r.expression : null}
                />
              ))}
            </>
          )}

          {/* Player actions */}
          {playerActions.length > 0 && (
            <>
              <SectionHeader>Player Actions</SectionHeader>
              {playerActions.map((pa, i) => (
                <ListItem
                  key={i}
                  icon={Shield}
                  iconColor="#c084fc"
                  text={`${pa.player}: ${pa.action}`}
                  subtext={pa.count > 1 ? `${pa.count} times` : null}
                />
              ))}
            </>
          )}

          {/* Generated AI recap (if available) */}
          {generatedRecap && (
            <>
              <SectionHeader>AI-Generated Recap</SectionHeader>
              <div style={{
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                lineHeight: 1.6,
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-ui)',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '8px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '6px',
              }}>
                {generatedRecap}
              </div>
            </>
          )}

          {/* Action bar */}
          <div style={{
            display: 'flex', gap: '8px', marginTop: '16px',
            flexWrap: 'wrap',
          }}>
            {sessionId && !generatedRecap && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 14px', borderRadius: '8px',
                  background: 'rgba(155,89,182,0.1)',
                  border: '1px solid rgba(155,89,182,0.2)',
                  color: '#c084fc', fontSize: '11px', fontWeight: 600,
                  cursor: loading ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
                }}
              >
                <ScrollText size={11} />
                {loading ? 'Generating...' : 'Generate AI Recap'}
              </button>
            )}
            {generatedRecap && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 14px', borderRadius: '8px',
                  background: 'rgba(155,89,182,0.1)',
                  border: '1px solid rgba(155,89,182,0.2)',
                  color: '#c084fc', fontSize: '11px', fontWeight: 600,
                  cursor: loading ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
                }}
              >
                Regenerate
              </button>
            )}
            <button
              onClick={handleCopy}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 14px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: copied ? '#4ade80' : 'var(--text-mute)',
                fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
              }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            {campaignId && (
              <button
                onClick={handleSaveToCampaign}
                disabled={saving || saved}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 14px', borderRadius: '8px',
                  background: saved ? 'rgba(74,222,128,0.1)' : 'rgba(201,168,76,0.1)',
                  border: `1px solid ${saved ? 'rgba(74,222,128,0.25)' : 'rgba(201,168,76,0.25)'}`,
                  color: saved ? '#4ade80' : '#c9a84c',
                  fontSize: '11px', fontWeight: 600,
                  cursor: saving ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
                }}
              >
                {saved ? <Check size={11} /> : <Save size={11} />}
                {saved ? 'Saved' : saving ? 'Saving...' : 'Save to Campaign'}
              </button>
            )}
            <button
              onClick={() => setExpanded(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 14px', borderRadius: '8px',
                background: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-mute)', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              <X size={11} /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
