import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
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
import Overview from '../sections/Overview';
import Backstory from '../sections/Backstory';
import Spellbook from '../sections/Spellbook';
import Inventory from '../sections/Inventory';
import Features from '../sections/Features';
import Combat from '../sections/Combat';
import NPCs from '../sections/NPCs';
import Quests from '../sections/Quests';
import DiceRoller from '../sections/DiceRoller';
import Settings from '../sections/Settings';
import Updates from '../sections/Updates';

const Journal = lazy(() => import('../sections/Journal'));
const Lore = lazy(() => import('../sections/Lore'));
const RulesReference = lazy(() => import('../sections/RulesReference'));
const ExportImport = lazy(() => import('../sections/ExportImport'));

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
  updates: Updates,
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
  const { showOverlay, levelUpInfo, triggerLevelUp, dismiss } = useLevelUp();
  useCrashRecovery();
  useAutoBackup(characterId, character?.name);
  const { updateAvailable, checkResult, latestVersion, currentVersion } = useUpdateCheck();

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
      try {
        const conds = await getConditions(characterId);
        const activeConds = (conds || []).filter(c => c.active);
        setActiveConditionCount(activeConds.length);
        setActiveConditions(activeConds.map(c => c.name));
      } catch (e) { console.warn('Failed to load conditions:', e); }
      try {
        const bs = await getBackstory(characterId);
        if (bs.portrait_data) setPortrait(bs.portrait_data);
      } catch (e) { console.warn('Failed to load backstory:', e); }
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
          </div>

          {/* Main content */}
          <main style={{ flex: 1, padding: 'calc(24px * var(--density, 1)) calc(28px * var(--density, 1))', overflowY: 'auto', maxHeight: 'calc(100vh - var(--top-h, 52px))', minWidth: 0 }}>
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
              />
            </Suspense>
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
