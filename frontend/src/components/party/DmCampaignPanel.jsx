import { useState, useEffect } from 'react';
import { Play, Square, Clock, Users, RefreshCw, MapPin, Swords, ScrollText, Eye, ChevronRight, Sparkles, Map, FileText, Moon, Coffee, Gift, Navigation, Compass, Search, AlertTriangle } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';
import { useLiveSession } from '../../contexts/LiveSessionContext';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useParty } from '../../contexts/PartyContext';
import { useSession } from '../../contexts/SessionContext';

const ACTION_ICONS = {
  encounter: Swords,
  npc: Users,
  quest: Map,
  handout: FileText,
  prompt: Sparkles,
};

const ACTION_COLORS = {
  encounter: '#ef4444',
  npc: '#4ade80',
  quest: '#60a5fa',
  handout: '#fbbf24',
  prompt: '#c084fc',
};

/**
 * Merged Campaign panel — session header + scene navigator + quick actions
 * Replaces DmSessionPanel + DmScenePanel
 */
export default function DmCampaignPanel() {
  const {
    sessionActive, campaignName, elapsed,
    startLiveSession, endLiveSession, refreshData,
    currentScene, scenes, actionLog, sessionXp,
    setActiveScene, getSceneActions,
    discoverNpc, revealQuest, revealHandout,
    startSceneEncounter, activeEncounterId,
    logEvent,
  } = useLiveSession();
  const { combatActive, round, sendPrompt, sendRestSync, sendXpAward, sendBroadcast, currentMood, sendMoodChange, clearMood } = useCampaignSync();
  const { members, myClientId, memberPresence } = useParty();
  const sessionCtx = useSession();

  const [activeCampaignId, setActiveCampaignIdLocal] = useState(null);

  const presenceColor = (clientId) => {
    const status = memberPresence[clientId]?.status;
    if (status === 'online') return '#4ade80';
    if (status === 'idle') return '#fbbf24';
    return '#ef4444';
  };

  const [loading, setLoading] = useState(false);
  const [showSceneList, setShowSceneList] = useState(false);
  const [recoverableSession, setRecoverableSession] = useState(null);
  const [campaignDisplayName, setCampaignDisplayName] = useState('');

  // Travel calculator state
  const [showTravel, setShowTravel] = useState(false);
  const [travelDistance, setTravelDistance] = useState('');
  const [travelSpeed, setTravelSpeed] = useState('normal'); // slow/normal/fast
  const [travelTerrain, setTravelTerrain] = useState('normal'); // normal/difficult/very_difficult
  const [travelEncounterType, setTravelEncounterType] = useState('road'); // road/forest/wilderness
  const [travelResult, setTravelResult] = useState(null); // { days, encounterResults }

  const TRAVEL_SPEEDS = { slow: 18, normal: 24, fast: 30 };
  const TERRAIN_MODS = { normal: 1, difficult: 0.5, very_difficult: 0.33 };
  const ENCOUNTER_CHANCES = { road: 10, forest: 15, wilderness: 20 };

  const handleCalculateTravel = () => {
    const dist = parseFloat(travelDistance);
    if (!dist || dist <= 0) return;
    const milesPerDay = TRAVEL_SPEEDS[travelSpeed] * TERRAIN_MODS[travelTerrain];
    const days = Math.ceil(dist / milesPerDay);
    setTravelResult({ days, milesPerDay: Math.round(milesPerDay * 10) / 10, encounterResults: null });
  };

  const handleRollEncounters = () => {
    if (!travelResult) return;
    const chance = ENCOUNTER_CHANCES[travelEncounterType];
    const results = [];
    for (let i = 0; i < travelResult.days; i++) {
      const roll = Math.floor(Math.random() * 20) + 1;
      results.push({ day: i + 1, roll, encounter: roll <= (chance / 5) }); // d20: 10%=roll<=2, 15%=roll<=3, 20%=roll<=4
    }
    setTravelResult(prev => ({ ...prev, encounterResults: results }));
    // Log to session
    const encounterDays = results.filter(r => r.encounter).map(r => r.day);
    if (logEvent) {
      logEvent('travel', `Travel: ${travelDistance} mi over ${travelResult.days} days (${travelSpeed}, ${travelTerrain} terrain). Encounters on day${encounterDays.length !== 1 ? 's' : ''}: ${encounterDays.length > 0 ? encounterDays.join(', ') : 'none'}`);
    }
  };

  const playerCount = members.filter(m => m.client_id !== myClientId).length;

  // Auto-select campaign from SessionContext (set by CharacterView in DM mode)
  useEffect(() => {
    if (sessionCtx?.campaignId) {
      setActiveCampaignIdLocal(sessionCtx.campaignId);
      setCampaignDisplayName(sessionCtx.campaignName || 'Campaign');
    }
  }, [sessionCtx?.campaignId, sessionCtx?.campaignName]);

  // Check for recoverable (incomplete) sessions on mount
  useEffect(() => {
    if (sessionActive || !activeCampaignId) return;
    invoke('get_latest_incomplete_session', { campaignId: activeCampaignId })
      .then(json => {
        if (json) {
          try { setRecoverableSession(JSON.parse(json)); } catch {}
        }
      })
      .catch(() => {});
  }, [activeCampaignId, sessionActive]);

  // Display name is set by the auto-select effect above — no separate tracking needed

  const formatElapsed = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (!activeCampaignId) {
      toast.error('No campaign selected — create one in Campaign Manager first');
      return;
    }
    setLoading(true);
    try {
      await startLiveSession(activeCampaignId, campaignDisplayName || 'Campaign');
    } catch (e) {
      console.error('[DmCampaign] Failed to start session:', e);
      toast.error(`Session start failed: ${e?.message || e}`);
    }
    setLoading(false);
  };

  const handleEnd = async () => {
    setLoading(true);
    await endLiveSession();
    setLoading(false);
  };

  const handleAction = (action) => {
    switch (action.action) {
      case 'start_encounter':
        if (!currentScene?.id) return;
        startSceneEncounter(currentScene.id);
        break;
      case 'discover_npc':
        discoverNpc(action.id);
        break;
      case 'reveal_quest':
        revealQuest(action.id);
        break;
      case 'reveal_handout':
        revealHandout(action.id);
        break;
      case 'perception_check':
        sendPrompt('roll_check', { label: 'Perception Check', body: 'The DM requests a Perception check.', dc: 12 });
        break;
      case 'stealth_check':
        sendPrompt('roll_check', { label: 'Stealth Check', body: 'The DM requests a Stealth check.', dc: 13 });
        break;
      default:
        break;
    }
  };

  const handleRest = (type) => {
    sendRestSync(type);
    sendBroadcast('announcement',
      type === 'long' ? 'Long Rest' : 'Short Rest',
      type === 'long'
        ? 'The party settles down for a long rest. 8 hours pass...'
        : 'The party takes a short rest. 1 hour passes...'
    );
    logEvent('rest', `${type === 'long' ? 'Long' : 'Short'} rest triggered for all players`);
  };

  // ── Not started — campaign selector ──
  if (!sessionActive) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recoverableSession && !sessionActive && (
          <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 8, padding: 12, marginBottom: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24', marginBottom: 4 }}>Session Recovery Available</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
              An incomplete session was found from {new Date(recoverableSession.timestamp).toLocaleString()}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={async () => {
                setLoading(true);
                try {
                  await startLiveSession(recoverableSession.campaignId, recoverableSession.campaignName || campaignDisplayName);
                  setRecoverableSession(null);
                } catch (e) {
                  console.error('[DmCampaign] Failed to resume session:', e);
                  toast.error('Failed to resume session');
                }
                setLoading(false);
              }} disabled={loading} style={{ padding: '6px 16px', borderRadius: 6, background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', cursor: 'pointer', fontSize: 12, fontWeight: 600, opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Resuming...' : 'Resume Session'}
              </button>
              <button onClick={() => {
                invoke('mark_session_complete', { sessionId: recoverableSession.sessionId }).catch(() => {});
                setRecoverableSession(null);
              }} style={{ padding: '6px 16px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12 }}>
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Campaign display — auto-selected from DMLobby, no dropdown needed */}
        {campaignDisplayName ? (
          <div style={{
            padding: '8px 12px', borderRadius: 8,
            background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
            color: '#c9a84c', fontSize: 13, fontWeight: 600,
            fontFamily: 'var(--font-heading)', letterSpacing: '0.03em',
          }}>
            {campaignDisplayName}
          </div>
        ) : (
          <div style={{
            padding: '8px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center',
          }}>
            No campaign loaded — select one from Campaign Manager
          </div>
        )}

        {/* Ready indicator when players are connected */}
        {playerCount > 0 && activeCampaignId && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            padding: '8px 12px', borderRadius: 8,
            background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.5)', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, color: 'rgba(74,222,128,0.7)' }}>
                {playerCount} player{playerCount !== 1 ? 's' : ''} ready
              </span>
            </div>
            {members.filter(m => m.client_id !== myClientId).map(m => (
              <div key={m.client_id} style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 14 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: presenceColor(m.client_id), flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
                  {m.character?.name || m.display_name || 'Player'}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={!activeCampaignId || loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: activeCampaignId ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${activeCampaignId ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.06)'}`,
            color: activeCampaignId ? '#4ade80' : 'rgba(255,255,255,0.2)',
            cursor: activeCampaignId ? 'pointer' : 'default',
            fontFamily: 'var(--font-heading)', letterSpacing: '0.05em',
            opacity: loading ? 0.5 : 1,
          }}
        >
          <Play size={13} /> Start Live Session
        </button>
      </div>
    );
  }

  const actions = getSceneActions();

  // ── Active session — compact header + scene + quick actions ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Session header (compact) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px', borderRadius: 8,
        background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.5)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e8d9b5', fontFamily: 'var(--font-heading)' }}>
            {campaignName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={9} /> {formatElapsed(elapsed)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Users size={9} /> {playerCount}
            {members.filter(m => m.client_id !== myClientId).map(m => (
              <span key={m.client_id} style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: presenceColor(m.client_id) }} title={m.character?.name || m.display_name || 'Player'} />
            ))}
          </span>
          {combatActive && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#ef4444' }}>
              <Swords size={9} /> R{round}
            </span>
          )}
          {sessionXp > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#fbbf24' }}>
              <Sparkles size={9} /> {sessionXp}xp
            </span>
          )}
        </div>
      </div>

      {/* ── Current scene card ── */}
      {currentScene ? (
        <div style={{
          background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)',
          borderRadius: 8, padding: '10px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <MapPin size={11} style={{ color: '#c9a84c' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#e8d9b5', fontFamily: 'var(--font-heading)' }}>
              {currentScene.name}
            </span>
          </div>
          {currentScene.description && (
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: 4 }}>
              {currentScene.description.slice(0, 120)}{currentScene.description.length > 120 ? '...' : ''}
            </div>
          )}
          {currentScene.dm_notes && (
            <div style={{
              fontSize: 9, color: 'rgba(192,132,252,0.55)', lineHeight: 1.4,
              padding: '4px 6px', background: 'rgba(192,132,252,0.04)',
              borderRadius: 4, borderLeft: '2px solid rgba(192,132,252,0.15)',
            }}>
              <Eye size={8} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
              {currentScene.dm_notes.slice(0, 100)}{currentScene.dm_notes.length > 100 ? '...' : ''}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 8, color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>
          No scene selected
        </div>
      )}

      {/* ── Scene list (collapsible) ── */}
      <button
        onClick={() => setShowSceneList(!showSceneList)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '5px 8px', borderRadius: 5, fontSize: 10,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
        }}
      >
        <span>Scenes ({scenes.length})</span>
        <ChevronRight size={10} style={{ transform: showSceneList ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {showSceneList && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 140, overflowY: 'auto' }}>
          {scenes.map(scene => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 8px', borderRadius: 5, fontSize: 10, textAlign: 'left',
                background: currentScene?.id === scene.id ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.015)',
                border: `1px solid ${currentScene?.id === scene.id ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.03)'}`,
                color: currentScene?.id === scene.id ? '#e8d9b5' : 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
              }}
            >
              <MapPin size={9} style={{ color: currentScene?.id === scene.id ? '#c9a84c' : 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{scene.name}</span>
              {scene.completed && <span style={{ fontSize: 8, color: 'rgba(74,222,128,0.5)' }}>Done</span>}
            </button>
          ))}
        </div>
      )}

      {/* ── Quick actions ── */}
      {actions.length > 0 && (
        <>
          <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(201,168,76,0.4)', fontFamily: 'var(--font-heading)' }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {actions.map((action, i) => {
              const Icon = ACTION_ICONS[action.type] || Sparkles;
              const color = ACTION_COLORS[action.type] || '#c9a84c';
              return (
                <button
                  key={i}
                  onClick={() => handleAction(action)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 8px', borderRadius: 5, fontSize: 10, textAlign: 'left',
                    background: `${color}08`, border: `1px solid ${color}20`,
                    color: color, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <Icon size={10} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ── Rest Buttons ── */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => handleRest('short')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '6px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
            background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
            color: '#fbbf24', cursor: 'pointer', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em',
          }}
        >
          <Coffee size={10} /> Short Rest
        </button>
        <button
          onClick={() => handleRest('long')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '6px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
            background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
            color: '#a78bfa', cursor: 'pointer', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em',
          }}
        >
          <Moon size={10} /> Long Rest
        </button>
      </div>

      {/* ── Scene Mood ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(201,168,76,0.4)', fontFamily: 'var(--font-heading)' }}>
          Scene Mood
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {[
            { key: 'combat',      label: 'Combat',      Icon: Swords,        color: '#ef4444' },
            { key: 'exploration', label: 'Exploration', Icon: Compass,       color: '#4ade80' },
            { key: 'social',     label: 'Social',      Icon: Users,         color: '#60a5fa' },
            { key: 'mystery',    label: 'Mystery',     Icon: Search,        color: '#c084fc' },
            { key: 'danger',     label: 'Danger',      Icon: AlertTriangle, color: '#f97316' },
            { key: 'celebration',label: 'Celebration', Icon: Sparkles,      color: '#eab308' },
            { key: 'calm',       label: 'Calm',        Icon: Moon,          color: '#2dd4bf' },
          ].map(({ key, label, Icon, color }) => {
            const active = currentMood === key;
            return (
              <button
                key={key}
                onClick={() => sendMoodChange(active ? null : key, null)}
                title={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 8px', borderRadius: 5, fontSize: 9, fontWeight: 600,
                  background: active ? `${color}20` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? `${color}50` : 'rgba(255,255,255,0.06)'}`,
                  color: active ? color : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: active ? `0 0 8px ${color}30` : 'none',
                  fontFamily: 'var(--font-heading)', letterSpacing: '0.03em',
                }}
              >
                <Icon size={10} /> {label}
              </button>
            );
          })}
        </div>

        {/* Clear mood button */}
        {currentMood && (
          <button
            onClick={clearMood}
            style={{
              padding: '4px 8px', borderRadius: 5, fontSize: 9, fontWeight: 600,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
              fontFamily: 'var(--font-heading)', letterSpacing: '0.03em',
            }}
          >
            Clear Mood
          </button>
        )}
      </div>

      {/* ── Travel Calculator ── */}
      <button
        onClick={() => setShowTravel(!showTravel)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '5px 8px', borderRadius: 5, fontSize: 10,
          background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.15)',
          color: 'rgba(96,165,250,0.7)', cursor: 'pointer', fontWeight: 600,
          fontFamily: 'var(--font-heading)', letterSpacing: '0.03em',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Navigation size={10} /> Travel Calculator
        </span>
        <ChevronRight size={10} style={{ transform: showTravel ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {showTravel && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 6,
          padding: '8px 10px', borderRadius: 8,
          background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)',
        }}>
          {/* Distance input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', minWidth: 50 }}>Distance</label>
            <input
              type="number"
              min="1"
              value={travelDistance}
              onChange={e => setTravelDistance(e.target.value)}
              placeholder="miles"
              style={{
                flex: 1, padding: '4px 8px', borderRadius: 5, fontSize: 11,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#e8d9b5', outline: 'none', fontFamily: 'var(--font-mono, monospace)',
              }}
            />
          </div>

          {/* Speed + Terrain row */}
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <label style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>Speed</label>
              <select
                value={travelSpeed}
                onChange={e => setTravelSpeed(e.target.value)}
                style={{
                  padding: '4px 6px', borderRadius: 5, fontSize: 10,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e8d9b5', outline: 'none',
                }}
              >
                <option value="slow">Slow (18 mi/day)</option>
                <option value="normal">Normal (24 mi/day)</option>
                <option value="fast">Fast (30 mi/day)</option>
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <label style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>Terrain</label>
              <select
                value={travelTerrain}
                onChange={e => setTravelTerrain(e.target.value)}
                style={{
                  padding: '4px 6px', borderRadius: 5, fontSize: 10,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e8d9b5', outline: 'none',
                }}
              >
                <option value="normal">Normal (1x)</option>
                <option value="difficult">Difficult (0.5x)</option>
                <option value="very_difficult">Very Difficult (0.33x)</option>
              </select>
            </div>
          </div>

          {/* Encounter type */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', minWidth: 50 }}>Region</label>
            <select
              value={travelEncounterType}
              onChange={e => setTravelEncounterType(e.target.value)}
              style={{
                flex: 1, padding: '4px 6px', borderRadius: 5, fontSize: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#e8d9b5', outline: 'none',
              }}
            >
              <option value="road">Road (10%/day)</option>
              <option value="forest">Forest (15%/day)</option>
              <option value="wilderness">Wilderness (20%/day)</option>
            </select>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculateTravel}
            disabled={!travelDistance || parseFloat(travelDistance) <= 0}
            style={{
              padding: '5px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
              background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)',
              color: '#60a5fa', cursor: travelDistance ? 'pointer' : 'default',
              opacity: travelDistance ? 1 : 0.4,
              fontFamily: 'var(--font-heading)', letterSpacing: '0.03em',
            }}
          >
            Calculate Travel
          </button>

          {/* Results */}
          {travelResult && (
            <div style={{
              padding: '8px 10px', borderRadius: 6,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#e8d9b5' }}>
                  {travelResult.days} day{travelResult.days !== 1 ? 's' : ''} of travel
                </span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
                  {travelResult.milesPerDay} mi/day
                </span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                {travelDistance} miles | {travelSpeed} pace | {travelTerrain.replace('_', ' ')} terrain
              </div>

              {/* Roll encounters button */}
              <button
                onClick={handleRollEncounters}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  width: '100%', padding: '5px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#ef4444', cursor: 'pointer',
                  fontFamily: 'var(--font-heading)', letterSpacing: '0.03em',
                }}
              >
                <Swords size={10} /> Roll Encounters ({ENCOUNTER_CHANCES[travelEncounterType]}% per day)
              </button>

              {/* Encounter results */}
              {travelResult.encounterResults && (
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {travelResult.encounterResults.map(r => (
                    <div key={r.day} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '3px 6px', borderRadius: 4, fontSize: 10,
                      background: r.encounter ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${r.encounter ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)'}`,
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)', minWidth: 40 }}>Day {r.day}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono, monospace)', minWidth: 28 }}>d20: {r.roll}</span>
                      {r.encounter ? (
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>ENCOUNTER!</span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>Safe</span>
                      )}
                    </div>
                  ))}
                  {travelResult.encounterResults.filter(r => r.encounter).length === 0 && (
                    <div style={{ fontSize: 10, color: 'rgba(74,222,128,0.6)', textAlign: 'center', padding: 4 }}>
                      No encounters - safe travels!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Session actions row ── */}
      <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
        <button
          onClick={refreshData}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '6px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
          }}
        >
          <RefreshCw size={10} /> Refresh
        </button>
        <button
          onClick={handleEnd}
          disabled={loading}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '6px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444', cursor: 'pointer', opacity: loading ? 0.5 : 1,
          }}
        >
          <Square size={10} /> End Session
        </button>
      </div>
    </div>
  );
}
