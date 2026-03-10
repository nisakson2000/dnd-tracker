import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, LogIn, BookOpen, Heart, Shield, Library } from 'lucide-react';
import toast from 'react-hot-toast';
import { listCharacters, createCharacter, deleteCharacter } from '../api/characters';
import { RULESET_OPTIONS } from '../data/rulesets';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Dashboard() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRuleset, setNewRuleset] = useState('5e-2014');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

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

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const char = await createCharacter(newName.trim(), newRuleset);
      toast.success(`${char.name} created!`);
      setNewName('');
      setNewRuleset('5e-2014');
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
          D&D Campaign Character Tracker
        </p>
        <p className="text-xs text-amber-200/25 mt-2 max-w-md mx-auto">
          Select a character to manage their stats, spells, and story — or create a new one to begin your adventure.
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate('/wiki')}
            className="btn flex items-center gap-2 text-sm"
          >
            <Library size={16} />
            Arcane Encyclopedia
          </button>
        </div>
      </motion.div>

      {/* Character Grid */}
      {loading ? (
        <div className="text-amber-200/40">Loading characters...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {characters.map((char, i) => (
            <motion.div
              key={char.id}
              className="card group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#1a1825] border-2 border-gold/30 flex items-center justify-center text-lg text-amber-200/50 flex-shrink-0">
                    {char.name?.[0] || '?'}
                  </div>
                  <h3 className="font-display text-xl text-amber-100 truncate">
                    {char.name}
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
                      <Heart size={10} className="text-red-400" /> {char.current_hp}/{char.max_hp} HP
                    </span>
                  )}
                  {char.armor_class > 0 && (
                    <span className="flex items-center gap-1">
                      <Shield size={10} className="text-amber-200/60" /> AC {char.armor_class}
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
                <p className="text-xs text-amber-200/30 mb-4">
                  Last modified: {new Date(char.updated_at).toLocaleDateString()}
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
          ))}

          {/* New Character Card */}
          <motion.div
            className="card border-dashed flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-gold/50 transition-colors"
            onClick={() => setShowCreate(true)}
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
            className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-sm w-full mx-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3 className="font-display text-lg text-amber-100 mb-4">Create New Character</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Character name..."
              className="input w-full mb-3"
              autoFocus
            />
            <div className="mb-4">
              <label className="text-xs text-amber-200/50 mb-1 block">Ruleset</label>
              <select
                className="input w-full"
                value={newRuleset}
                onChange={(e) => setNewRuleset(e.target.value)}
              >
                {RULESET_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowCreate(false)} className="btn-secondary text-sm">
                Cancel
              </button>
              <button onClick={handleCreate} className="btn-primary text-sm">
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

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
