import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { getNPCs, addNPC, updateNPC, deleteNPC } from '../api/npcs';
import ConfirmDialog from '../components/ConfirmDialog';

const ROLES = ['ally', 'enemy', 'neutral', 'party'];
const STATUSES = ['alive', 'dead', 'unknown'];

export default function NPCs({ characterId }) {
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    try { setNpcs(await getNPCs(characterId)); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [characterId]);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateNPC(characterId, editing.id, data);
        toast.success('NPC updated');
      } else {
        await addNPC(characterId, data);
        toast.success('NPC added');
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNPC(characterId, id);
      toast.success('NPC removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = filter === 'all' ? npcs : npcs.filter(n => n.role === filter);
  const roleColors = { ally: 'text-emerald-400', enemy: 'text-red-400', neutral: 'text-amber-200/60', party: 'text-blue-400', default: 'text-amber-200/40' };
  const statusColors = { alive: 'text-emerald-400', dead: 'text-red-400', unknown: 'text-amber-200/40', default: 'text-amber-200/40' };

  if (loading) return <div className="text-amber-200/40">Loading NPCs...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Users size={20} />
          <div>
            <span>NPCs & Characters</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Keep track of the people your character meets. Record allies, enemies, and everyone in between so you never forget a name.</p>
          </div>
        </h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-xs flex items-center gap-1">
          <Plus size={12} /> Add NPC
        </button>
      </div>

      <div className="flex gap-2">
        {['all', ...ROLES].map(r => (
          <button key={r} onClick={() => setFilter(r)}
            className={`text-xs px-3 py-1 rounded capitalize ${filter === r ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10'}`}>
            {r}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center text-amber-200/30 py-8">No NPCs recorded. Add the characters you meet during your adventures — allies, enemies, shopkeepers, quest givers, and more.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(npc => (
            <div key={npc.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-amber-100 font-medium">{npc.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${roleColors[npc.role] || roleColors.default} ${
                      npc.role === 'ally' ? 'bg-emerald-900/40' :
                      npc.role === 'enemy' ? 'bg-red-900/40' :
                      npc.role === 'party' ? 'bg-blue-900/40' :
                      'bg-gray-800/40'
                    }`}>{npc.role}</span>
                    <span className={`text-xs ${statusColors[npc.status] || ''}`}>{npc.status}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(npc); setShowForm(true); }} className="text-amber-200/40 hover:text-amber-200"><Edit2 size={14} /></button>
                  <button onClick={() => setConfirmDelete(npc)} className="text-red-400/50 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              {npc.race && <p className="text-xs text-amber-200/40">{[npc.race, npc.npc_class].filter(Boolean).join(' ')}</p>}
              {npc.location && <p className="text-xs text-amber-200/40 mt-1">Location: {npc.location}</p>}
              {npc.description && <p className="text-sm text-amber-200/50 mt-2">{npc.description}</p>}
              {npc.notes && <p className="text-xs text-amber-200/40 mt-1 italic">{npc.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <NPCForm npc={editing} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete NPC?"
        message={`Remove "${confirmDelete?.name}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function NPCForm({ npc, onSubmit, onCancel }) {
  const [form, setForm] = useState(npc || {
    name: '', role: 'neutral', race: '', npc_class: '', location: '', description: '', notes: '', status: 'alive',
  });
  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-display text-lg text-amber-100 mb-4">{npc ? 'Edit NPC' : 'Add NPC'}</h3>
        <div className="space-y-3">
          <input className="input w-full" placeholder="Name" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <select className="input w-full" value={form.role} onChange={e => update('role', e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="input w-full" value={form.status} onChange={e => update('status', e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Race" value={form.race} onChange={e => update('race', e.target.value)} />
            <input className="input w-full" placeholder="Class" value={form.npc_class} onChange={e => update('npc_class', e.target.value)} />
          </div>
          <input className="input w-full" placeholder="Location" value={form.location} onChange={e => update('location', e.target.value)} />
          <textarea className="input w-full h-20 resize-none" placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} />
          <textarea className="input w-full h-16 resize-none" placeholder="Notes" value={form.notes} onChange={e => update('notes', e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => form.name && onSubmit(form)} className="btn-primary text-sm">{npc ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
