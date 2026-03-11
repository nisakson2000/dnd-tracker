import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Edit2, Map, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import { getQuests, addQuest, updateQuest, deleteQuest } from '../api/quests';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Quests({ characterId }) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sortBy, setSortBy] = useState('status');

  const load = async () => {
    try { setQuests(await getQuests(characterId)); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [characterId]);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateQuest(characterId, editing.id, data);
        if (data.status === 'completed' && editing.status !== 'completed') {
          toast.success('Quest completed!');
        } else {
          toast.success('Quest updated');
        }
      } else {
        await addQuest(characterId, data);
        toast.success('Quest added');
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuest(characterId, id);
      toast.success('Quest removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const toggleObjective = async (quest, objIndex) => {
    const updated = {
      ...quest,
      objectives: (quest.objectives || []).map((o, i) =>
        i === objIndex ? { ...o, completed: !o.completed } : o
      ),
    };
    try {
      await updateQuest(characterId, quest.id, updated);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const getProgress = (q) => {
    if (!q.objectives || q.objectives.length === 0) return 0;
    return (q.objectives.filter(o => o.completed).length / q.objectives.length) * 100;
  };

  const sortedQuests = useMemo(() => [...quests].sort((a, b) => {
    if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'status') {
      const order = { active: 0, completed: 1, failed: 2 };
      return (order[a.status] ?? 9) - (order[b.status] ?? 9);
    }
    if (sortBy === 'progress') return getProgress(b) - getProgress(a);
    return 0;
  }), [quests, sortBy]);

  const active = useMemo(() => sortedQuests.filter(q => q.status === 'active'), [sortedQuests]);
  const completed = useMemo(() => sortedQuests.filter(q => q.status !== 'active'), [sortedQuests]);

  if (loading) return <div className="text-amber-200/40">Loading quests...</div>;

  const QuestCard = ({ quest }) => (
    <div className="card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-amber-100 font-display">{quest.title || 'Untitled Quest'}</h4>
          {quest.giver && <p className="text-xs text-amber-200/40">Given by: {quest.giver}</p>}
        </div>
        <div className="flex gap-1">
          <button onClick={() => { setEditing(quest); setShowForm(true); }} className="text-amber-200/40 hover:text-amber-200" aria-label={`Edit ${quest.title || 'quest'}`}><Edit2 size={14} /></button>
          <button onClick={() => setConfirmDelete(quest)} className="text-red-400/50 hover:text-red-400" aria-label={`Delete ${quest.title || 'quest'}`}><Trash2 size={14} /></button>
        </div>
      </div>
      {quest.description && <p className="text-sm text-amber-200/50 mb-2">{quest.description}</p>}
      {(quest.objectives || []).length > 0 && (() => {
        const completed = (quest.objectives || []).filter(o => o.completed).length;
        const total = (quest.objectives || []).length;
        const progressPct = total > 0 ? (completed / total) * 100 : 0;
        return (
          <div className="mt-2">
            <div className="space-y-1">
              {(quest.objectives || []).map((obj, i) => (
                <button key={obj.id || i} onClick={() => toggleObjective(quest, i)} className="flex items-center gap-2 w-full text-left text-sm">
                  {obj.completed ? <CheckSquare size={14} className="text-emerald-400 flex-shrink-0" /> : <Square size={14} className="text-amber-200/30 flex-shrink-0" />}
                  <span className={obj.completed ? 'line-through text-amber-200/30' : 'text-amber-200/60'}>{obj.text}</span>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-amber-200/40 mb-1">
                <span>{completed}/{total} objectives</span>
                <span>{Math.round(progressPct)}%</span>
              </div>
              <div className="hp-bar-container" style={{height: '6px'}} role="progressbar" aria-label={`Quest progress: ${completed} of ${total} objectives complete`} aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total}>
                <div className="hp-bar-fill hp-high" style={{width: `${progressPct}%`}} />
              </div>
            </div>
          </div>
        );
      })()}
      {quest.notes && <p className="text-xs text-amber-200/30 mt-2 italic">{quest.notes}</p>}
      <div className="mt-2">
        <span className={`text-xs px-2 py-0.5 rounded ${
          quest.status === 'active' ? 'bg-emerald-800/30 text-emerald-300' :
          quest.status === 'completed' ? 'bg-blue-800/30 text-blue-300' :
          'bg-red-800/30 text-red-300'
        }`}>{quest.status}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Map size={20} />
          <div>
            <span>Quests & Objectives</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Track your active quests and their objectives. Check off goals as you complete them and keep notes on what to do next.</p>
          </div>
        </h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-xs flex items-center gap-1">
          <Plus size={12} /> New Quest
        </button>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-amber-200/40">Sort:</span>
        {[['status', 'Active First'], ['name', 'Name A-Z'], ['progress', 'Progress %']].map(([key, label]) => (
          <button key={key} onClick={() => setSortBy(key)}
            className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
            {label}
          </button>
        ))}
      </div>

      {active.length > 0 && (
        <div>
          <h3 className="font-display text-amber-100/70 mb-3">Active Quests</h3>
          <div className="space-y-3">
            {active.map(q => <QuestCard key={q.id} quest={q} />)}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="font-display text-amber-100/40 mb-3">Completed / Failed</h3>
          <div className="space-y-3 opacity-60">
            {completed.map(q => <QuestCard key={q.id} quest={q} />)}
          </div>
        </div>
      )}

      {quests.length === 0 && (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <Map size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">No quests yet — add your first quest objective</p>
          <p className="text-xs text-amber-200/20">When your DM gives you a mission or you discover a goal, track it here</p>
        </div>
      )}

      {showForm && (
        <QuestForm quest={editing} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Quest?"
        message={`Remove "${confirmDelete?.title}" and all its objectives? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function QuestForm({ quest, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    const base = quest || { title: '', giver: '', description: '', status: 'active', notes: '', objectives: [] };
    return { ...base, objectives: base.objectives || [] };
  });
  const [newObj, setNewObj] = useState('');
  const [titleError, setTitleError] = useState(false);
  const update = (f, v) => {
    if (f === 'title') setTitleError(false);
    setForm(prev => ({ ...prev, [f]: v }));
  };
  const handleSubmit = () => {
    if (!form.title.trim()) { setTitleError(true); return; }
    onSubmit(form);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  const addObjective = () => {
    if (!newObj.trim()) return;
    update('objectives', [...form.objectives, { text: newObj.trim(), completed: false }]);
    setNewObj('');
  };

  const removeObjective = (i) => {
    update('objectives', form.objectives.filter((_, idx) => idx !== i));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">{quest ? 'Edit Quest' : 'New Quest'}</h3>
        <div className="space-y-3">
          <div>
            <input className={`input w-full ${titleError ? 'border-red-500' : ''}`} placeholder="Quest title" value={form.title} onChange={e => update('title', e.target.value)} autoFocus />
            {titleError && <p className="text-red-400 text-xs mt-1">Name required</p>}
          </div>
          <input className="input w-full" placeholder="Quest giver" value={form.giver} onChange={e => update('giver', e.target.value)} />
          <textarea className="input w-full h-20 resize-none" placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} />
          <select className="input w-full" value={form.status} onChange={e => update('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <div>
            <label className="label">Objectives</label>
            {form.objectives.map((obj, i) => (
              <div key={`${obj.text}-${i}`} className="flex items-center gap-2 mb-1">
                <span className="text-sm text-amber-200/60 flex-1">{obj.text}</span>
                <button onClick={() => removeObjective(i)} className="text-red-400/50 hover:text-red-400" aria-label={`Remove objective: ${obj.text}`}><Trash2 size={12} /></button>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <input className="input flex-1 text-sm" placeholder="Add an objective and press Enter" value={newObj}
                onChange={e => setNewObj(e.target.value)} onKeyDown={e => e.key === 'Enter' && addObjective()} />
              <button onClick={addObjective} className="btn-secondary text-xs">Add</button>
            </div>
          </div>

          <textarea className="input w-full h-16 resize-none" placeholder="Notes" value={form.notes} onChange={e => update('notes', e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm">{quest ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
