import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MapPin, Users, Scroll, Swords, FileText, Wifi, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const pulseKeyframes = `
@keyframes readiness-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
`;

export default function ReadinessChecklist({ campaign, scenes, connectedPlayers, npcCount, questCount, encounterCount, guidanceMode, onNavigate }) {
  const checks = [
    { id: 'description', label: 'Campaign description filled in', passed: !!(campaign?.description?.trim()), icon: FileText, section: 'campaign-hub', hint: 'A description sets the tone for your entire campaign.' },
    { id: 'scenes', label: 'At least 1 scene created', passed: (scenes?.length || 0) > 0, icon: MapPin, section: 'campaign-hub', hint: 'Scenes are locations and events — the building blocks of your session.' },
    { id: 'npcs', label: 'At least 1 NPC added', passed: npcCount > 0, icon: Users, section: 'npcs', hint: 'NPCs bring your world to life. Start with a quest giver or tavern keeper.' },
    { id: 'quests', label: 'At least 1 quest written', passed: questCount > 0, icon: Scroll, section: 'quests', hint: 'Quests give players direction and objectives to work toward.' },
    { id: 'encounters', label: 'At least 1 encounter prepped', passed: encounterCount > 0, icon: Swords, section: 'encounter-builder', hint: 'Pre-built encounters make combat smooth and balanced.' },
    { id: 'players', label: 'Players connected', passed: (connectedPlayers?.length || 0) > 0, icon: Wifi, section: null, hint: 'Optional — connect players when you\'re ready to go live.', optional: true },
  ];

  const requiredPassed = checks.filter(c => !c.optional).every(c => c.passed);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (requiredPassed && guidanceMode === 'free') setCollapsed(true);
  }, [requiredPassed, guidanceMode]);

  return (
    <div data-tutorial="readiness-checklist" style={{
      borderRadius: 10,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
    }}>
      <style>{pulseKeyframes}</style>

      {/* Header */}
      <button
        onClick={() => setCollapsed(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '10px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.03em',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Readiness Checklist
          {requiredPassed && (
            <span style={{ color: '#4ade80', fontSize: 10, fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
              All set!
            </span>
          )}
        </span>
        {collapsed ? <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} /> : <ChevronUp size={14} style={{ color: 'var(--text-mute)' }} />}
      </button>

      {/* Checklist items */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 6px 8px' }}>
              {checks.map(check => {
                const Icon = check.icon;
                const isClickable = !check.passed && check.section;
                const isHovered = hoveredId === check.id;

                return (
                  <div
                    key={check.id}
                    onClick={() => isClickable && onNavigate(check.section)}
                    onMouseEnter={() => setHoveredId(check.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '8px 12px',
                      borderRadius: 6,
                      cursor: isClickable ? 'pointer' : 'default',
                      background: isHovered && isClickable ? 'rgba(255,255,255,0.03)' : 'transparent',
                      transition: 'background 0.15s',
                      animation: !check.passed && guidanceMode === 'guided' ? 'readiness-pulse 2.5s ease-in-out infinite' : 'none',
                    }}
                  >
                    <Icon size={14} style={{
                      color: check.passed ? '#4ade80' : '#f59e0b',
                      flexShrink: 0,
                      marginTop: 1,
                    }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 11,
                        fontFamily: 'var(--font-ui)',
                        color: check.passed ? 'var(--text-dim)' : 'var(--text)',
                        fontWeight: check.passed ? 400 : 500,
                      }}>
                        {check.label}
                        {check.optional && (
                          <span style={{ fontSize: 9, color: 'var(--text-mute)', fontStyle: 'italic' }}>optional</span>
                        )}
                      </div>

                      {/* Hint text — guided mode only, incomplete items */}
                      {guidanceMode === 'guided' && !check.passed && (
                        <div style={{
                          fontSize: 10,
                          color: 'var(--text-mute)',
                          marginTop: 3,
                          lineHeight: 1.4,
                          fontFamily: 'var(--font-ui)',
                        }}>
                          {check.hint}
                        </div>
                      )}
                    </div>

                    {/* Status icon */}
                    {check.passed ? (
                      <CheckCircle size={14} style={{ color: '#4ade80', flexShrink: 0, marginTop: 1 }} />
                    ) : (
                      <XCircle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                    )}

                    {/* Go button on hover for clickable items */}
                    {isClickable && isHovered && (
                      <span style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: '#c9a84c',
                        fontFamily: 'var(--font-ui)',
                        flexShrink: 0,
                        marginTop: 1,
                      }}>
                        Go &rarr;
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
