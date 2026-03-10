import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOverview } from '../api/overview';
import { getConditions } from '../api/combat';
import { RulesetProvider } from '../contexts/RulesetContext';
import Sidebar from '../components/Sidebar';
import LevelUpOverlay from '../components/LevelUpOverlay';
import BeginnerWizard from '../components/BeginnerWizard';
import { useLevelUp } from '../hooks/useLevelUp';
import Overview from '../sections/Overview';
import Backstory from '../sections/Backstory';
import Spellbook from '../sections/Spellbook';
import Inventory from '../sections/Inventory';
import Features from '../sections/Features';
import Combat from '../sections/Combat';
import NPCs from '../sections/NPCs';
import Quests from '../sections/Quests';
import DiceRoller from '../sections/DiceRoller';
import Party from '../sections/Party';
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
  party: Party,
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
  const { showOverlay, levelUpInfo, triggerLevelUp, dismiss } = useLevelUp();

  useEffect(() => {
    loadCharacter();
  }, [characterId]);

  const loadCharacter = async () => {
    try {
      const data = await getOverview(characterId);
      setCharacter(data.overview);
      // Load condition count
      try {
        const conds = await getConditions(characterId);
        setActiveConditionCount(conds.filter(c => c.active).length);
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
      <div className="flex min-h-screen">
        <Sidebar
          character={character}
          activeSection={activeSection}
          onSelect={setActiveSection}
          onBack={() => navigate('/')}
          activeConditionCount={activeConditionCount}
        />
        <main className="flex-1 overflow-y-auto max-h-screen">
          {/* Sticky character header */}
          {character && (
            <div className="sticky top-0 z-20 bg-[#0a0a10]/95 backdrop-blur-sm border-b border-gold/10 px-6 py-2 flex items-center gap-6 text-sm">
              <span className="font-display text-amber-100">{character.name}</span>
              <span className="text-amber-200/40">{[character.race, character.primary_class].filter(Boolean).join(' ')} Lv {character.level}</span>
              {character.max_hp > 0 && (
                <span className="flex items-center gap-1 text-red-400"><Heart size={12} /> {character.current_hp}/{character.max_hp}</span>
              )}
              <span className="flex items-center gap-1 text-amber-200/60"><Shield size={12} /> AC {character.armor_class}</span>
              {character.inspiration && <span className="text-gold text-xs">* Inspired</span>}
            </div>
          )}
          <div className="p-6 md:p-8">
            <Suspense fallback={<div className="text-amber-200/40">Loading...</div>}>
              <ActiveComponent
                characterId={characterId}
                character={character}
                onCharacterUpdate={(updated) => setCharacter(updated)}
                onLevelUp={triggerLevelUp}
                onConditionsChange={(count) => setActiveConditionCount(count)}
              />
            </Suspense>
          </div>
        </main>

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
