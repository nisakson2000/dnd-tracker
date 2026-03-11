import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOverview } from '../api/overview';
import { getConditions } from '../api/combat';
import { getBackstory } from '../api/backstory';
import { RulesetProvider } from '../contexts/RulesetContext';
import Sidebar from '../components/Sidebar';
import LevelUpOverlay from '../components/LevelUpOverlay';
import BeginnerWizard from '../components/BeginnerWizard';
import { useLevelUp } from '../hooks/useLevelUp';
import { useCrashRecovery } from '../hooks/useCrashRecovery';
import { useAutoBackup } from '../hooks/useAutoBackup';
import { useUpdateCheck } from '../hooks/useUpdateCheck';
import { useErrorLog, setErrorContext } from '../hooks/useErrorLog';
import { invoke } from '@tauri-apps/api/core';
import { APP_VERSION } from '../version';

const Overview = lazy(() => import('../sections/Overview'));
const Backstory = lazy(() => import('../sections/Backstory'));
const Spellbook = lazy(() => import('../sections/Spellbook'));
const Inventory = lazy(() => import('../sections/Inventory'));
const Features = lazy(() => import('../sections/Features'));
const Combat = lazy(() => import('../sections/Combat'));
const NPCs = lazy(() => import('../sections/NPCs'));
const Quests = lazy(() => import('../sections/Quests'));
const DiceRoller = lazy(() => import('../sections/DiceRoller'));
const Settings = lazy(() => import('../sections/Settings'));
const Updates = lazy(() => import('../sections/Updates'));
const BugReport = lazy(() => import('../sections/BugReport'));
const Journal = lazy(() => import('../sections/Journal'));
const Lore = lazy(() => import('../sections/Lore'));
const RulesReference = lazy(() => import('../sections/RulesReference'));
const ExportImport = lazy(() => import('../sections/ExportImport'));

class SectionErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="card text-center py-8">
          <p className="text-red-400 font-medium mb-2">Something went wrong in this section</p>
          <p className="text-xs text-amber-200/30 mb-3">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="btn-primary text-xs">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SECTIONS = {
  overview: Overview,
  backstory: Backstory,
  spellbook: Spellbook,
  inventory: Inventory,
  features: Features,
  combat: Combat,
  journal: Journal,
  npcs: NPCs,
  quests: Quests,
  lore: Lore,
  dice: DiceRoller,
  rules: RulesReference,
  settings: Settings,
  export: ExportImport,
  bugreport: BugReport,
  updates: Updates,
};

const SECTION_LABELS = {
  overview: 'Character Sheet',
  backstory: 'Backstory',
  spellbook: 'Spellbook',
  inventory: 'Inventory',
  features: 'Features & Traits',
  combat: 'Combat',
  journal: 'Campaign Journal',
  npcs: 'NPCs',
  quests: 'Quests',
  lore: 'Lore & World',
  dice: 'Dice Roller',
  rules: 'Rules Reference',
  settings: 'Settings',
  export: 'Export & Import',
  bugreport: 'Bug Report',
  updates: 'Updates',
};

const SHORTCUT_SECTIONS = ['overview','backstory','spellbook','inventory','features','combat','journal','npcs','quests'];

export default function CharacterView() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [activeConditionCount, setActiveConditionCount] = useState(0);
  const [activeConditions, setActiveConditions] = useState([]);
  const [portrait, setPortrait] = useState('');
  const [diceHistory, setDiceHistory] = useState([]);
  const [sessionElapsed, setSessionElapsed] = useState('0m');
  const { showOverlay, levelUpInfo, triggerLevelUp, dismiss } = useLevelUp();
  useCrashRecovery();
  useAutoBackup(characterId, character?.name);
  const { updateAvailable, checkResult, latestVersion, currentVersion } = useUpdateCheck();
  const { errors, pushError, clearErrors } = useErrorLog();

  /* ── #218  Session timer ── */
  useEffect(() => {
    const key = `session_start_${characterId}`;
    let fallbackStart = Date.now();
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, Date.now().toString());
      }
      fallbackStart = parseInt(sessionStorage.getItem(key) || Date.now(), 10);
    } catch { /* storage unavailable — use fallback */ }
    const tick = () => {
      let start = fallbackStart;
      try { start = parseInt(sessionStorage.getItem(key) || fallbackStart, 10); } catch {}
      const mins = Math.floor((Date.now() - start) / 60000);
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      setSessionElapsed(h > 0 ? `${h}h ${m}m` : `${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [characterId]);

  /* ── #219  Unsaved changes warning ── */
  useEffect(() => {
    const handler = (e) => {
      if (window.__codex_unsaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Keep error context in sync with active section
  useEffect(() => {
    setErrorContext({ section: activeSection });
  }, [activeSection]);

  // Keep error context in sync with loaded character data
  useEffect(() => {
    if (character) {
      setErrorContext({
        characterId,
        characterName: character.name || null,
        characterClass: character.primary_class || null,
        characterLevel: character.level || null,
        characterRace: character.race || null,
      });
    }
  }, [characterId, character]);

  // When a bug report comes in via Party Connect, write it to desktop (dev builds auto-write)
  const handlePartyBugReport = useCallback((msg) => {
    if (import.meta.env.DEV) {
      const divider = '═'.repeat(60);
      const lines = [
        divider,
        `REMOTE BUG REPORT — ${msg.timestamp || new Date().toISOString()}`,
        divider,
        `Reporter : ${msg.reporter || 'Unknown'}`,
        `Client ID: ${msg.client_id || 'N/A'}`,
        '',
        JSON.stringify(msg.report || {}, null, 2),
        '',
        divider,
        '',
      ];
      invoke('write_bug_report', { report: lines.join('\n') }).catch(() => {});
    }
    toast(`Bug report from ${msg.reporter || 'a player'}`, { icon: '\uD83D\uDC1B', duration: 4000 });
  }, []);

  // Show toast notification when update check completes
  useEffect(() => {
    if (!checkResult) return;
    if (checkResult === 'update_available') {
      toast(`Update available: v${latestVersion}`, {
        icon: '\u2728',
        duration: 5000,
        style: { background: '#1a1520', color: '#fde68a', border: '1px solid rgba(201,168,76,0.4)' },
      });
    } else if (checkResult === 'up_to_date') {
      toast.success(`You're up to date (v${currentVersion})`, { duration: 3000 });
    } else if (checkResult === 'offline') {
      toast('Update check failed — no internet', {
        icon: '\uD83D\uDCE1',
        duration: 3000,
        style: { background: '#1a1520', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' },
      });
    }
  }, [checkResult]);

  useEffect(() => {
    loadCharacter();
  }, [characterId]);

  const loadCharacter = async () => {
    try {
      const data = await getOverview(characterId);
      setCharacter(data.overview);
      // Load condition count and portrait
      let condFailed = false;
      let backstoryFailed = false;
      try {
        const conds = await getConditions(characterId);
        const activeConds = (conds || []).filter(c => c.active);
        setActiveConditionCount(activeConds.length);
        setActiveConditions(activeConds.map(c => c.name));
      } catch (e) { console.warn('Failed to load conditions:', e); condFailed = true; }
      try {
        const bs = await getBackstory(characterId);
        if (bs.portrait_data) setPortrait(bs.portrait_data);
      } catch (e) { console.warn('Failed to load backstory:', e); backstoryFailed = true; }
      if (condFailed && backstoryFailed) {
        toast('Some data failed to load', { icon: '\u26A0\uFE0F', duration: 2000 });
      }
    } catch (err) {
      toast.error(`Failed to load character: ${err.message}`);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcuts: Ctrl+S prevent, Ctrl+1-9 section switching
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
      }
      if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        if (SHORTCUT_SECTIONS[idx]) setActiveSection(SHORTCUT_SECTIONS[idx]);
      }
      if (e.ctrlKey && e.shiftKey && e.key === '?') {
        e.preventDefault();
        toast(
          'Keyboard Shortcuts:\n' +
          'Ctrl+1–9 — Switch sections\n' +
          'Ctrl+S — Prevented (auto-saves)\n' +
          'Escape — Close open forms/modals\n' +
          'Ctrl+Enter — Save form (Journal)\n' +
          'Ctrl+Shift+/ — Show this help',
          { duration: 6000, style: { whiteSpace: 'pre-line', textAlign: 'left', background: '#1a1520', color: '#fde68a', border: '1px solid rgba(201,168,76,0.4)' } }
        );
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-200/40">
        Loading character...
      </div>
    );
  }

  const ActiveComponent = SECTIONS[activeSection];
  const rulesetId = character?.ruleset || '5e-2014';

  return (
    <RulesetProvider rulesetId={rulesetId}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          character={character}
          activeSection={activeSection}
          onSelect={setActiveSection}
          onBack={() => navigate('/')}
          activeConditionCount={activeConditionCount}
          portrait={portrait}
          updateAvailable={updateAvailable}
        />

        {/* Right side: topbar + content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Breadcrumb */}
          <div className="text-xs text-amber-200/30 px-[18px] pt-1.5 pb-0" style={{ background: 'rgba(4,4,11,0.85)', flexShrink: 0 }}>
            <span className="hover:text-amber-200/50 cursor-pointer transition-colors" onClick={() => navigate('/')}>The Codex</span>
            <span className="mx-1.5">/</span>
            <span className="hover:text-amber-200/50 cursor-pointer transition-colors" onClick={() => setActiveSection('overview')}>{character?.name || 'Character'}</span>
            <span className="mx-1.5">/</span>
            <span className="text-amber-200/40">{SECTION_LABELS[activeSection] || activeSection}</span>
          </div>

          {/* Topbar */}
          <div style={{ height: 'var(--top-h, 52px)', background: 'rgba(4,4,11,0.85)', backdropFilter: 'blur(24px) saturate(1.5)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0', padding: '0 18px', flexShrink: 0 }}>
            {/* Portrait mini */}
            {portrait ? (
              <img src={portrait} alt={`${character?.name || 'Character'} portrait`} style={{ width: '30px', height: '30px', borderRadius: '9px', objectFit: 'cover', border: '1px solid var(--border-h)', marginRight: '10px' }} />
            ) : (
              <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(135deg, var(--accent), var(--accent-l))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'white', boxShadow: '0 0 16px var(--accent-glow)', marginRight: '10px', flexShrink: 0 }}>
                {character?.name?.[0] || '?'}
              </div>
            )}
            {/* Name + class */}
            <div style={{ marginRight: '18px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(14px * var(--font-scale, 1))', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                {character?.name || 'Unknown'}
              </div>
              <div style={{ fontSize: 'calc(11px * var(--font-scale, 1))', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap', marginTop: '1px' }}>
                {[character?.race, character?.primary_class].filter(Boolean).join(' · ')}
                {character?.level ? ` · Lv ${character.level}` : ''}
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 14px', flexShrink: 0 }} />
            {/* Stat chips */}
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              {character?.max_hp > 0 && (
                <span className="stat-chip stat-chip-hp">
                  <Heart size={10} /> {character.current_hp} / {character.max_hp}
                </span>
              )}
              {character?.armor_class > 0 && (
                <span className="stat-chip stat-chip-ac">
                  AC {character.armor_class}
                </span>
              )}
              {character?.inspiration && (
                <span className="stat-chip stat-chip-xp">Inspired</span>
              )}
            </div>

            <div style={{ flex: 1 }} />

            {/* Session timer */}
            <div className="flex items-center gap-1.5 text-[11px] text-amber-200/25 font-mono select-none">
              <Clock size={11} className="text-amber-200/20" />
              Session: {sessionElapsed}
            </div>
          </div>

          {/* Main content */}
          <main style={{ flex: 1, padding: 'calc(24px * var(--density, 1)) calc(28px * var(--density, 1))', overflowY: 'auto', maxHeight: 'calc(100vh - var(--top-h, 52px))', minWidth: 0 }}>
            <SectionErrorBoundary key={activeSection}>
              <Suspense fallback={<div className="text-amber-200/40">Loading…</div>}>
                <ActiveComponent
                  characterId={characterId}
                  character={character}
                  onCharacterUpdate={(updated) => setCharacter(updated)}
                  onLevelUp={triggerLevelUp}
                  onConditionsChange={(count, condNames) => {
                    setActiveConditionCount(count);
                    setActiveConditions(condNames || []);
                  }}
                  onPortraitChange={setPortrait}
                  activeConditions={activeConditions}
                  diceHistory={diceHistory}
                  onDiceHistoryChange={setDiceHistory}
                  errors={errors}
                  onClearErrors={clearErrors}
                  onBugReport={handlePartyBugReport}
                />
              </Suspense>
            </SectionErrorBoundary>
          </main>
        </div>

        {/* Beginner Guide floating button */}
        <button
          onClick={() => setShowWizard(true)}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 transition-all shadow-lg flex items-center justify-center"
          title="New to D&D? Click for a beginner's guide!"
        >
          ?
        </button>

        {showWizard && <BeginnerWizard onClose={() => setShowWizard(false)} />}

        <LevelUpOverlay
          show={showOverlay}
          name={levelUpInfo.name}
          level={levelUpInfo.level}
          className={levelUpInfo.className}
          rulesetId={rulesetId}
          onDismiss={dismiss}
        />
      </div>
    </RulesetProvider>
  );
}
