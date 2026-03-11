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
  const [portrait, setPortrait] = useState('');
  const { showOverlay, levelUpInfo, triggerLevelUp, dismiss } = useLevelUp();
  useCrashRecovery();
  useAutoBackup(characterId, character?.name);

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
        setActiveConditionCount(conds.filter(c => c.active).length);
      } catch {}
      try {
        const bs = await getBackstory(characterId);
        if (bs.portrait_data) setPortrait(bs.portrait_data);
      } catch {}
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
        />

        {/* Right side: topbar + content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Topbar */}
          <div style={{ height: '50px', background: '#0e0e16', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0', padding: '0 20px', flexShrink: 0 }}>
            {/* Portrait mini */}
            {portrait && <img src={portrait} alt="" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(201,168,76,0.3)', marginRight: '12px' }} />}
            {/* Name + class */}
            <div style={{ marginRight: '16px' }}>
              <div style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '13px', color: '#e8d9b5', whiteSpace: 'nowrap' }}>
                {character?.name || 'Unknown'}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}>
                {[character?.race, character?.primary_class].filter(Boolean).join(' ')}
                {character?.level ? ` · Lv ${character.level}` : ''}
              </div>
            </div>

            {/* Stat chips */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
          <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', maxHeight: 'calc(100vh - 50px)' }}>
            <Suspense fallback={<div className="text-amber-200/40">Loading…</div>}>
              <ActiveComponent
                characterId={characterId}
                character={character}
                onCharacterUpdate={(updated) => setCharacter(updated)}
                onLevelUp={triggerLevelUp}
                onConditionsChange={(count) => setActiveConditionCount(count)}
                onPortraitChange={setPortrait}
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
