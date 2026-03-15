import { useState, useEffect, useMemo } from 'react';
import {
  Swords, Users, MapPin, ChevronRight, Megaphone,
  Scroll, Play, CheckCircle, Circle,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

const BEAT_COLOR_MAP = {
  story: '#c9a84c',
  combat: '#ef4444',
  social: '#60a5fa',
  exploration: '#4ade80',
  puzzle: '#a78bfa',
};

function BeatTypeBadge({ type }) {
  const color = BEAT_COLOR_MAP[type] || '#888';
  return (
    <span style={{
      fontSize: '9px', fontWeight: 600,
      padding: '1px 5px', borderRadius: '4px',
      background: `${color}22`, color,
      border: `1px solid ${color}44`,
      fontFamily: 'var(--font-ui)', textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {type}
    </span>
  );
}

function StatusDot({ status }) {
  const colors = {
    completed: '#4ade80',
    active: '#c9a84c',
    pending: '#555',
  };
  const c = colors[status] || colors.pending;
  const isActive = status === 'active';
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8,
      borderRadius: '50%', background: c, flexShrink: 0,
      boxShadow: isActive ? `0 0 6px ${c}88` : 'none',
      animation: isActive ? 'questRunnerPulse 2s ease-in-out infinite' : 'none',
    }} />
  );
}

function ActionButton({ icon: Icon, label, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        padding: '5px 9px', borderRadius: '6px',
        background: disabled ? 'rgba(255,255,255,0.02)' : `${color}15`,
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : `${color}44`}`,
        color: disabled ? 'rgba(255,255,255,0.15)' : color,
        fontSize: '10px', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-ui)',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={12} />
      <span style={{ display: 'none' }}>{label}</span>
    </button>
  );
}

export default function QuestRunner({
  quests, npcs, scenes,
  onLoadEncounter, onRevealNpcs, onSetScene, onAdvanceBeat, onBroadcast,
}) {
  const [selectedQuestId, setSelectedQuestId] = useState(null);
  const [beats, setBeats] = useState([]);
  const [loadingBeats, setLoadingBeats] = useState(false);

  // Show all quests to the DM (active, hidden, revealed) — only hide completed
  const activeQuests = useMemo(
    () => (quests || []).filter(q => q.status !== 'completed'),
    [quests],
  );

  const selectedQuest = useMemo(
    () => activeQuests.find(q => q.id === selectedQuestId) || null,
    [activeQuests, selectedQuestId],
  );

  // Auto-select first active quest if none selected
  useEffect(() => {
    if (!selectedQuestId && activeQuests.length > 0) {
      setSelectedQuestId(activeQuests[0].id);
    }
  }, [activeQuests, selectedQuestId]);

  // Load beats when quest changes
  useEffect(() => {
    if (!selectedQuestId) { setBeats([]); return; }
    setLoadingBeats(true);
    invoke('list_quest_beats', { questId: selectedQuestId })
      .then(data => setBeats(data || []))
      .catch(err => {
        console.error('[QuestRunner] list_quest_beats:', err);
        setBeats([]);
      })
      .finally(() => setLoadingBeats(false));
  }, [selectedQuestId]);

  const currentBeat = useMemo(() => {
    if (!selectedQuest || !beats.length) return null;
    if (selectedQuest.active_beat_id) {
      return beats.find(b => b.id === selectedQuest.active_beat_id) || beats[0];
    }
    return beats[0];
  }, [selectedQuest, beats]);

  const getBeatStatus = (beat) => {
    if (!selectedQuest || !currentBeat) return 'pending';
    if (beat.id === currentBeat.id) return 'active';
    const currentIdx = beats.findIndex(b => b.id === currentBeat.id);
    const beatIdx = beats.findIndex(b => b.id === beat.id);
    return beatIdx < currentIdx ? 'completed' : 'pending';
  };

  const parseJson = (str) => {
    try { return JSON.parse(str || '[]'); } catch { return []; }
  };

  const linkedNpcs = useMemo(() => {
    if (!currentBeat) return [];
    const ids = parseJson(currentBeat.linked_npc_ids_json);
    return (npcs || []).filter(n => ids.includes(n.id));
  }, [currentBeat, npcs]);

  const linkedScene = useMemo(() => {
    if (!currentBeat?.linked_scene_id) return null;
    return (scenes || []).find(s => s.id === currentBeat.linked_scene_id) || null;
  }, [currentBeat, scenes]);

  const encounter = useMemo(() => {
    if (!currentBeat) return null;
    const enc = parseJson(currentBeat.linked_encounter_json);
    return enc.length > 0 ? enc : null;
  }, [currentBeat]);

  const handleLoadEncounter = () => {
    if (encounter && onLoadEncounter) onLoadEncounter(encounter);
  };

  const handleRevealNpcs = () => {
    const ids = parseJson(currentBeat?.linked_npc_ids_json);
    if (ids.length > 0 && onRevealNpcs) onRevealNpcs(ids);
  };

  const handleSetScene = () => {
    if (currentBeat?.linked_scene_id && onSetScene) onSetScene(currentBeat.linked_scene_id);
  };

  const handleAdvance = () => {
    if (onAdvanceBeat && selectedQuestId) onAdvanceBeat(selectedQuestId);
  };

  const handleBroadcast = () => {
    if (currentBeat?.description && onBroadcast) onBroadcast(currentBeat.description);
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--text-mute)',
        fontFamily: 'var(--font-mono, monospace)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Play size={11} style={{ color: '#c9a84c' }} /> Quest Runner
      </div>

      <div style={{ padding: '10px 12px' }}>
        {/* Quest selector */}
        <select
          style={{
            width: '100%', padding: '7px 10px', borderRadius: '6px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text)', fontSize: '12px',
            fontFamily: 'var(--font-ui)', outline: 'none',
            cursor: 'pointer', marginBottom: '10px',
          }}
          value={selectedQuestId || ''}
          onChange={e => setSelectedQuestId(e.target.value || null)}
        >
          <option value="">— Select Quest —</option>
          {activeQuests.map(q => (
            <option key={q.id} value={q.id}>
              {q.status === 'hidden' ? '[Hidden] ' : q.status === 'active' ? '' : `[${q.status}] `}{q.title || `Quest ${q.id}`}
            </option>
          ))}
        </select>

        {activeQuests.length === 0 && (
          <div style={{
            padding: '16px', textAlign: 'center',
            fontSize: '11px', color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)',
          }}>
            No quests found. Create quests in the Campaign Lobby first.
          </div>
        )}

        {selectedQuest && !loadingBeats && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Main: current beat */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {currentBeat ? (
                <>
                  {/* Beat title + type */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginBottom: '6px',
                  }}>
                    <Scroll size={12} style={{ color: '#c9a84c', flexShrink: 0 }} />
                    <span style={{
                      fontSize: '13px', fontWeight: 700, color: 'var(--text)',
                      fontFamily: 'var(--font-heading)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {currentBeat.title || 'Untitled Beat'}
                    </span>
                    <BeatTypeBadge type={currentBeat.beat_type || 'story'} />
                  </div>

                  {/* Description */}
                  {currentBeat.description && (
                    <div style={{
                      fontSize: '11px', lineHeight: 1.5,
                      color: 'var(--text-dim)', fontFamily: 'var(--font-ui)',
                      marginBottom: '6px',
                    }}>
                      {currentBeat.description}
                    </div>
                  )}

                  {/* DM notes */}
                  {currentBeat.dm_notes && (
                    <div style={{
                      padding: '6px 10px', borderRadius: '6px',
                      background: 'rgba(167,139,250,0.08)',
                      border: '1px solid rgba(167,139,250,0.15)',
                      fontSize: '10px', lineHeight: 1.5,
                      color: '#c4b5fd', fontFamily: 'var(--font-ui)',
                      marginBottom: '6px',
                    }}>
                      {currentBeat.dm_notes}
                    </div>
                  )}

                  {/* Linked NPCs */}
                  {linkedNpcs.length > 0 && (
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: '4px',
                      marginBottom: '6px',
                    }}>
                      {linkedNpcs.map(npc => (
                        <span key={npc.id} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '3px',
                          padding: '2px 7px', borderRadius: '4px',
                          background: 'rgba(96,165,250,0.1)',
                          border: '1px solid rgba(96,165,250,0.2)',
                          fontSize: '10px', color: '#60a5fa',
                          fontFamily: 'var(--font-ui)',
                        }}>
                          <Users size={9} />
                          {npc.name || `NPC ${npc.id}`}
                          {npc.disposition && (
                            <span style={{
                              fontSize: '8px', opacity: 0.7,
                              marginLeft: '2px',
                            }}>
                              ({npc.disposition})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Linked Scene */}
                  {linkedScene && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '2px 7px', borderRadius: '4px',
                      background: 'rgba(167,139,250,0.1)',
                      border: '1px solid rgba(167,139,250,0.2)',
                      fontSize: '10px', color: '#a78bfa',
                      fontFamily: 'var(--font-ui)',
                      marginBottom: '8px',
                    }}>
                      <MapPin size={9} />
                      {linkedScene.name || linkedScene.title || `Scene ${linkedScene.id}`}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '4px',
                    marginTop: '4px',
                  }}>
                    <ActionButton
                      icon={Swords} label="Load Encounter" color="#ef4444"
                      onClick={handleLoadEncounter}
                      disabled={!encounter}
                    />
                    <ActionButton
                      icon={Users} label="Reveal NPCs" color="#4ade80"
                      onClick={handleRevealNpcs}
                      disabled={linkedNpcs.length === 0}
                    />
                    <ActionButton
                      icon={MapPin} label="Set Scene" color="#a78bfa"
                      onClick={handleSetScene}
                      disabled={!currentBeat?.linked_scene_id}
                    />
                    <ActionButton
                      icon={ChevronRight} label="Advance" color="#c9a84c"
                      onClick={handleAdvance}
                    />
                    <ActionButton
                      icon={Megaphone} label="Broadcast" color="#f59e0b"
                      onClick={handleBroadcast}
                      disabled={!currentBeat?.description}
                    />
                  </div>
                </>
              ) : (
                <div style={{
                  padding: '12px', textAlign: 'center',
                  fontSize: '11px', color: 'var(--text-mute)',
                  fontFamily: 'var(--font-ui)',
                }}>
                  No beats for this quest yet.
                </div>
              )}
            </div>

            {/* Beat timeline sidebar */}
            {beats.length > 0 && (
              <div style={{
                flex: '0 0 110px',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                paddingLeft: '8px',
                maxHeight: 220, overflowY: 'auto',
              }}>
                <div style={{
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--text-mute)',
                  fontFamily: 'var(--font-mono, monospace)',
                  marginBottom: '6px',
                }}>
                  Beats
                </div>
                {beats.map(beat => {
                  const status = getBeatStatus(beat);
                  return (
                    <div key={beat.id || beat.sort_order} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '5px',
                      padding: '3px 0',
                      opacity: status === 'pending' ? 0.5 : 1,
                    }}>
                      <div style={{ paddingTop: '3px' }}>
                        <StatusDot status={status} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontSize: '10px', fontWeight: status === 'active' ? 700 : 500,
                          color: status === 'active' ? '#c9a84c' : 'var(--text-dim)',
                          fontFamily: 'var(--font-ui)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          lineHeight: 1.3,
                        }}>
                          {beat.title || 'Untitled'}
                        </div>
                        <BeatTypeBadge type={beat.beat_type || 'story'} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {loadingBeats && (
          <div style={{
            padding: '16px', textAlign: 'center',
            fontSize: '11px', color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)',
          }}>
            Loading beats...
          </div>
        )}
      </div>

      <style>{`
        @keyframes questRunnerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
