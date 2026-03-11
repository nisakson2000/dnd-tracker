import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, LogIn, BookOpen, Heart, Shield, Library, Bell, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { listCharacters, createCharacter, deleteCharacter } from '../api/characters';
import { RULESET_OPTIONS, getRuleset } from '../data/rulesets';
import { APP_VERSION } from '../version';
import ConfirmDialog from '../components/ConfirmDialog';
import UpdateScreen from './UpdateScreen';
import { useUpdateCheck } from '../hooks/useUpdateCheck';

/* ── helpers ── */
function daysAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function lastPlayedLabel(dateStr) {
  const d = daysAgo(dateStr);
  if (d === null) return null;
  if (d === 0) return 'Last played: today';
  if (d === 1) return 'Last played: 1 day ago';
  return `Last played: ${d} days ago`;
}

function hpRingColor(current, max) {
  if (!max || max <= 0) return 'border-gold/30';            // no HP data
  const pct = (current ?? 0) / max;
  if (pct <= 0)    return 'border-gray-500/60';              // 0 HP
  if (pct <= 0.25) return 'border-red-500/70';               // <25%
  if (pct <= 0.5)  return 'border-amber-400/70';             // 25-50%
  return 'border-emerald-400/60';                            // >50%
}

const SORT_OPTIONS = [
  { id: 'name',  label: 'Name' },
  { id: 'level', label: 'Level' },
  { id: 'recent', label: 'Recent' },
];

export default function Dashboard() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRuleset, setNewRuleset] = useState('5e-2014');
  const [newRace, setNewRace] = useState('');
  const [newClass, setNewClass] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showUpdates, setShowUpdates] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();
  const { updateAvailable } = useUpdateCheck();

  const sortedCharacters = useMemo(() => {
    const list = [...characters];
    if (sortBy === 'name')   list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    if (sortBy === 'level')  list.sort((a, b) => (b.level || 0) - (a.level || 0));
    if (sortBy === 'recent') list.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
    return list;
  }, [characters, sortBy]);

  const load = async () => {
    try {
      const data = await listCharacters();
      setCharacters(data);
    } catch (err) {
      toast.error(`Failed to load characters: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Get races/classes for the selected ruleset
  const rulesetData = getRuleset(newRuleset);
  const availableRaces = rulesetData?.RACES || [];
  const availableClasses = rulesetData?.CLASSES || [];
  const handleCreate = async () => {
    if (!newName.trim()) return;
    if (!newRace) { toast.error('Please select a race'); return; }
    if (!newClass) { toast.error('Please select a class'); return; }
    try {
      const char = await createCharacter({
        name: newName.trim(),
        ruleset: newRuleset,
        race: newRace,
        primaryClass: newClass,
      });
      toast.success(`${char.name} created!`);
      setNewName('');
      setNewRuleset('5e-2014');
      setNewRace('');
      setNewClass('');
      setShowCreate(false);
      load();
    } catch (err) {
      toast.error(`Failed to create character: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCharacter(deleteTarget.id);
      toast.success(`${deleteTarget.name} deleted.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(`Failed to delete: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      {/* Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-wider"
          style={{
            background: 'linear-gradient(135deg, #f0d878, #c9a84c, #f0d878)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        >
          The Codex
        </h1>
        <p className="text-amber-200/40 mt-2 flex items-center justify-center gap-2">
          <BookOpen size={16} />
          D&D Companion
        </p>
        <button
          onClick={() => setShowUpdates(true)}
          className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] text-amber-200/20 font-mono tracking-wider hover:text-amber-200/40 transition-colors cursor-pointer bg-transparent border-none relative"
        >
          {APP_VERSION}
          {updateAvailable && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
        <p className="text-xs text-amber-200/25 mt-2 max-w-md mx-auto">
          Select a character to manage their stats, spells, and story — or create a new one to begin your adventure.
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => navigate('/wiki')}
            className="btn flex items-center gap-2 text-sm"
          >
            <Library size={16} />
            Arcane Encyclopedia
          </button>
          <button
            onClick={() => setShowUpdates(true)}
            className="btn flex items-center gap-2 text-sm relative"
          >
            <Bell size={16} />
            Updates
            {updateAvailable && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-[#14121c]" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Character Count + Sort */}
      {!loading && (
        <div className="flex items-center gap-4 mb-6">
          <p className="text-sm text-amber-200/30">
            {characters.length === 0 ? 'No characters yet' : `${characters.length} Character${characters.length !== 1 ? 's' : ''}`}
          </p>
          {characters.length > 1 && (
            <div className="flex items-center gap-1.5">
              <ArrowUpDown size={12} className="text-amber-200/25" />
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors ${
                    sortBy === opt.id
                      ? 'bg-gold/20 text-amber-200/80 border border-gold/40'
                      : 'bg-transparent text-amber-200/30 border border-amber-200/10 hover:border-amber-200/25 hover:text-amber-200/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Character Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {[0, 1, 2].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-200/5" />
                <div className="h-5 w-32 bg-amber-200/5 rounded" />
              </div>
              <div className="h-3 w-40 bg-amber-200/5 rounded mb-2" />
              <div className="h-3 w-24 bg-amber-200/5 rounded mb-4" />
              <div className="flex gap-2 mt-auto">
                <div className="h-8 flex-1 bg-amber-200/5 rounded" />
                <div className="h-8 w-10 bg-amber-200/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {sortedCharacters.filter(Boolean).map((char, i) => {
            const days = daysAgo(char.updated_at);
            const isDusty = days !== null && days >= 30;
            const ringColor = hpRingColor(char.current_hp, char.max_hp);
            return (
            <motion.div
              key={char.id}
              className="card group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {isDusty && (
                <span className="absolute top-2 right-2 text-[10px] text-amber-200/20" title="Not played in 30+ days">
                  cobweb
                </span>
              )}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full bg-[#1a1825] border-2 ${ringColor} flex items-center justify-center text-lg text-amber-200/50 flex-shrink-0`}>
                    {char.name?.[0] || '?'}
                  </div>
                  <h3 className="font-display text-xl text-amber-100 truncate">
                    {char.name || 'Unknown'}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-amber-200/50 mb-1">
                {[char.race, char.primary_class].filter(Boolean).join(' ') || 'No race or class set yet'}
                {char.level > 0 && ` — Level ${char.level}`}
              </p>
              {char.primary_class && (
                <div className="flex items-center gap-3 text-xs text-amber-200/40 mb-1">
                  {char.max_hp > 0 && (
                    <span className="flex items-center gap-1">
                      <Heart size={10} className="text-red-400" /> {char.current_hp ?? 0}/{char.max_hp ?? 0} HP
                    </span>
                  )}
                  {char.armor_class > 0 && (
                    <span className="flex items-center gap-1">
                      <Shield size={10} className="text-amber-200/60" /> AC {char.armor_class ?? 10}
                    </span>
                  )}
                </div>
              )}
              {char.campaign_name && (
                <p className="text-xs text-purple-300/50 mb-1">
                  {char.campaign_name}
                </p>
              )}
              {char.ruleset && (
                <span className="text-[10px] bg-amber-900/20 text-amber-200/40 px-1.5 py-0.5 rounded">
                  {RULESET_OPTIONS.find(o => o.id === char.ruleset)?.name || char.ruleset}
                </span>
              )}
              {char.updated_at && (
                <p className="text-[11px] text-amber-200/25 mb-4">
                  {lastPlayedLabel(char.updated_at)}
                </p>
              )}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => navigate(`/character/${char.id}`)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  <LogIn size={14} /> Enter
                </button>
                <button
                  onClick={() => setDeleteTarget(char)}
                  className="btn-danger p-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
            );
          })}

          {/* New Character Card */}
          <motion.div
            className="card border-dashed flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-gold/50 transition-colors"
            onClick={() => setShowCreate(true)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowCreate(true); } }}
            tabIndex={0}
            role="button"
            aria-label="Create new character"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: characters.length * 0.1 }}
          >
            <Plus size={32} className="text-amber-200/30 mb-2" />
            <span className="text-amber-200/40 font-display">New Character</span>
          </motion.div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}
        >
          <motion.div
            className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3 className="font-display text-lg text-amber-100 mb-4">Create New Character</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-amber-200/50 mb-1 block">Character Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="Enter a name..."
                  className="input w-full"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-amber-200/50 mb-1 block">Ruleset</label>
                <select
                  className="input w-full"
                  value={newRuleset}
                  onChange={(e) => { setNewRuleset(e.target.value); setNewRace(''); setNewClass(''); }}
                >
                  {RULESET_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-amber-200/50 mb-1 block">Race *</label>
                <select
                  className="input w-full"
                  value={newRace}
                  onChange={(e) => setNewRace(e.target.value)}
                >
                  <option value="">Select a race...</option>
                  {availableRaces.map(r => {
                    const val = r.subrace ? `${r.name} (${r.subrace})` : r.name;
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </select>
              </div>
              <div>
                <label className="text-xs text-amber-200/50 mb-1 block">Class *</label>
                <select
                  className="input w-full"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                >
                  <option value="">Select a class...</option>
                  {availableClasses.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button onClick={() => { setShowCreate(false); setNewName(''); setNewRace(''); setNewClass(''); }} className="btn-secondary text-sm">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={!newName.trim() || !newRace || !newClass} className="btn-primary text-sm disabled:opacity-40">
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Updates Modal */}
      <AnimatePresence>
        {showUpdates && (
          <UpdateScreen
            key="update-modal"
            onDone={() => setShowUpdates(false)}
            asModal={true}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Character"
        message={`You are about to permanently delete ${deleteTarget?.name}. Everything tied to this character — their stats, spells, inventory, journal entries, NPCs, quests, and lore — will be erased. There is no undo, no recovery, and no going back.`}
        warning="Once deleted, this character is gone for good. Export a backup first if you want to keep their data."
        confirmText={deleteTarget?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
