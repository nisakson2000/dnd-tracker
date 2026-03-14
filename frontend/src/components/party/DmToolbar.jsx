import { useState, useEffect } from 'react';
import { Crown, Megaphone, Swords, X, MapPin, ScrollText, HelpCircle, Scroll } from 'lucide-react';
import ModalPortal from '../ModalPortal';
import { useParty } from '../../contexts/PartyContext';
import { useCampaignSync } from '../../contexts/CampaignSyncContext';
import { useLiveSession } from '../../contexts/LiveSessionContext';
import DmCampaignPanel from './DmCampaignPanel';
import DmCombatPanel from './DmCombatPanel';
import DmCommsPanel from './DmCommsPanel';
import DmLogPanel from './DmLogPanel';
import DmTutorial, { shouldShowTutorial } from './DmTutorial';
import QuestRunner from '../dm-session/QuestRunner';

/**
 * Floating DM toolbar — positioned at TOP-RIGHT to avoid AI Assistant overlap.
 * 4 buttons: Campaign, Combat, Comms, Log + help (?) button.
 */
export default function DmToolbar() {
  const { wsStatus, mode, members, myClientId } = useParty();
  const { combatActive, initiativeOrder, currentTurn, round, advanceTurn, endCombat } = useCampaignSync();
  const {
    sessionActive, elapsed, campaignName, currentScene, activeQuestId,
    quests, npcs, scenes,
    discoverNpc, setActiveScene, startRandomEncounter, advanceQuestBeat,
  } = useLiveSession();
  const { sendBroadcast } = useCampaignSync();
  const [activePanel, setActivePanel] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const isHostConnected = mode === 'host' && wsStatus === 'connected';

  // Show tutorial on first DM session
  useEffect(() => {
    if (isHostConnected && shouldShowTutorial()) {
      setShowTutorial(true);
    }
  }, [isHostConnected]);

  if (!isHostConnected) return null;

  const playerCount = members.filter(m => m.client_id !== myClientId).length;
  const togglePanel = (panel) => setActivePanel(activePanel === panel ? null : panel);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${m}:${String(s).padStart(2, '0')}`;
  };

  const PANELS = {
    campaign: { title: 'Campaign', component: DmCampaignPanel, props: {} },
    combat: { title: 'Combat Manager', component: DmCombatPanel },
    quest: {
      title: 'Quest Runner', component: QuestRunner,
      props: {
        quests: quests || [],
        npcs: npcs || [],
        scenes: scenes || [],
        onLoadEncounter: (monsters) => startRandomEncounter(monsters),
        onRevealNpcs: (npcIds) => {
          (npcIds || []).forEach(id => discoverNpc(id));
        },
        onSetScene: (sceneId) => {
          const scene = (scenes || []).find(s => s.id === sceneId);
          if (scene) setActiveScene(scene);
        },
        onAdvanceBeat: () => advanceQuestBeat(),
        onBroadcast: (text) => sendBroadcast('narrative', 'Quest', text),
      },
    },
    comms: { title: 'Communications', component: DmCommsPanel },
    log: { title: 'Action Log', component: DmLogPanel },
  };

  const ActiveComponent = activePanel ? PANELS[activePanel]?.component : null;
  const activePanelProps = activePanel ? PANELS[activePanel]?.props || {} : {};

  return (
    <ModalPortal>
      {/* Tutorial overlay */}
      {showTutorial && <DmTutorial onClose={() => setShowTutorial(false)} />}

      <div style={{
        position: 'fixed', top: 12, right: 12, zIndex: 50,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 24px)',
      }}>
        {/* ── Main toolbar — 4 buttons + help ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          background: 'rgba(10,10,16,0.96)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12,
          padding: '5px 6px',
          boxShadow: '0 4px 28px rgba(0,0,0,0.45), 0 0 1px rgba(201,168,76,0.12)',
          pointerEvents: 'auto',
        }}>
          {/* DM badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 8px 0 4px' }}>
            <Crown size={13} style={{ color: '#c9a84c' }} />
            <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.45)', fontWeight: 700, letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>
              DM
            </span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>
              {playerCount}p
            </span>
          </div>

          <Divider />

          {/* Campaign (merged session+scene) */}
          <TBtn icon={MapPin} label="Campaign" active={activePanel === 'campaign'} onClick={() => togglePanel('campaign')} dot={sessionActive ? '#4ade80' : null} />

          {/* Combat */}
          <TBtn icon={Swords} label="Combat" active={activePanel === 'combat'} onClick={() => togglePanel('combat')} dot={combatActive ? '#ef4444' : null} disabled={!sessionActive} />

          {/* Quests */}
          <TBtn icon={Scroll} label="Quests" active={activePanel === 'quest'} onClick={() => togglePanel('quest')} dot={activeQuestId ? '#a78bfa' : null} disabled={!sessionActive} />

          <Divider />

          {/* Comms (merged broadcast+prompt) */}
          <TBtn icon={Megaphone} label="Comms" active={activePanel === 'comms'} onClick={() => togglePanel('comms')} />

          <Divider />

          {/* Log — icon only */}
          <TBtn icon={ScrollText} active={activePanel === 'log'} onClick={() => togglePanel('log')} disabled={!sessionActive} />

          <Divider />

          {/* Help — opens tutorial */}
          <TBtn icon={HelpCircle} onClick={() => setShowTutorial(true)} />
        </div>

        {/* Session status bar — clickable to open Campaign panel */}
        {sessionActive && !combatActive && (
          <div
            onClick={() => togglePanel('campaign')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(10,10,16,0.96)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(74,222,128,0.15)', borderRadius: 10,
              padding: '6px 12px', pointerEvents: 'auto', cursor: 'pointer',
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.6)', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-ui)' }}>
              {campaignName}
              {currentScene ? ` — ${currentScene.name}` : ''}
            </span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
              {playerCount}p
            </span>
            <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>
              {formatTime(elapsed)}
            </span>
          </div>
        )}

        {/* Combat mini-bar — always visible during combat for quick access */}
        {combatActive && (
          <div
            onClick={() => togglePanel('combat')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(10,10,16,0.96)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
              padding: '7px 12px', pointerEvents: 'auto', cursor: 'pointer',
            }}
          >
            <Swords size={12} style={{ color: '#ef4444' }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-ui)' }}>
              R{round}
            </span>
            <span style={{ fontSize: 10, color: '#e8d9b5', fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {initiativeOrder[currentTurn]?.name || '?'}
            </span>
            {currentScene && (
              <span style={{ fontSize: 9, color: 'rgba(201,168,76,0.4)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentScene.name}
              </span>
            )}
            <button onClick={(e) => { e.stopPropagation(); advanceTurn(); }} style={miniBtn('#c9a84c')}>Next</button>
            <button onClick={(e) => { e.stopPropagation(); endCombat(); }} style={miniBtn('#ef4444')}>End</button>
          </div>
        )}

        {/* Expanded panel — drops down below toolbar */}
        {activePanel && ActiveComponent && (
          <div style={{
            width: 'min(420px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
            background: 'rgba(10,10,16,0.96)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(201,168,76,0.18)', borderRadius: 14,
            padding: '14px 16px', boxShadow: '0 16px 56px rgba(0,0,0,0.55), 0 0 1px rgba(201,168,76,0.15)',
            pointerEvents: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(201,168,76,0.5)', fontFamily: 'var(--font-heading)' }}>
                {PANELS[activePanel]?.title}
              </span>
              <button onClick={() => setActivePanel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', padding: 2, display: 'flex' }}>
                <X size={13} />
              </button>
            </div>
            <ActiveComponent {...activePanelProps} />
          </div>
        )}
      </div>
    </ModalPortal>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.06)', margin: '0 4px', flexShrink: 0 }} />;
}

function TBtn({ icon: Icon, label, active, onClick, dot, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={label || ''}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: label ? 4 : 0,
        padding: label ? '4px 8px' : '4px 7px', borderRadius: 7,
        background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
        border: `1px solid ${active ? 'rgba(201,168,76,0.28)' : 'transparent'}`,
        color: disabled ? 'rgba(255,255,255,0.12)' : active ? '#c9a84c' : 'rgba(255,255,255,0.35)',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-ui)',
        transition: 'all 0.15s', opacity: disabled ? 0.4 : 1,
      }}
    >
      <Icon size={11} />
      {label && <span>{label}</span>}
      {dot && (
        <div style={{
          position: 'absolute', top: -1, right: -1,
          width: 5, height: 5, borderRadius: '50%',
          background: dot, boxShadow: `0 0 6px ${dot}80`,
        }} />
      )}
    </button>
  );
}

function miniBtn(color) {
  return {
    padding: '2px 8px', borderRadius: 5, fontSize: 9, fontWeight: 700,
    background: `${color}15`, border: `1px solid ${color}30`,
    color, cursor: 'pointer', fontFamily: 'var(--font-heading)',
    letterSpacing: '0.04em',
  };
}
