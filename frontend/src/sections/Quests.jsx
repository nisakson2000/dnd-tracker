import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Map, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import { getQuests, addQuest, updateQuest, deleteQuest } from '../api/quests';

export default function Quests({ characterId }) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

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
        toast.success('Quest updated');
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
      load();
    } catch (err) { toast.error(err.message); }
  };

  const toggleObjective = async (quest, objIndex) => {
    const updated = {
      ...quest,
      objectives: quest.objectives.map((o, i) =>
        i === objIndex ? { ...o, completed: !o.completed } : o
      ),
    };
    try {
      await updateQuest(characterId, quest.id, updated);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const active = quests.filter(q => q.status === 'active');
  const completed = quests.filter(q => q.status !== 'active');

  if (loading) return <div className="text-amber-200/40">Loading quests...</div>;

  const QuestCard = ({ quest }) => (
    <div className="card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-amber-100 font-display">{quest.title}</h4>
          {quest.giver && <p className="text-xs text-amber-200/40">Given by: {quest.giver}</p>}
        </div>
        <div className="flex gap-1">
          <button onClick={() => { setEditing(quest); setShowForm(true); }} className="text-amber-200/40 hover:text-amber-200"><Edit2 size={14} /></button>
          <button onClick={() => handleDelete(quest.id)} className="text-red-400/50 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      </div>
      {quest.description && <p className="text-sm text-amber-200/50 mb-2">{quest.description}</p>}
      {quest.objectives.length > 0 && (() => {
        const completed = quest.objectives.filter(o => o.completed).length;
        const total = quest.objectives.length;
        const progressPct = total > 0 ? (completed / total) * 100 : 0;
        return (
          <div className="mt-2">
            <div className="space-y-1">
              {quest.objectives.map((obj, i) => (
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
              <div className="hp-bar-container" style={{height: '6px'}}>
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
        <div className="card text-center text-amber-200/30 py-8">No quests yet. When your DM gives you a mission or you discover a goal, add it here to track your progress.</div>
      )}

      {showForm && (
        <QuestForm quest={editing} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

function QuestForm({ quest, onSubmit, onCancel }) {
  const [form, setForm] = useState(quest || {
    title: '', giver: '', description: '', status: 'active', notes: '', objectives: [],
  });
  const [newObj, setNewObj] = useState('');
  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

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
          <input className="input w-full" placeholder="Quest title" value={form.title} onChange={e => update('title', e.target.value)} autoFocus />
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
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="text-sm text-amber-200/60 flex-1">{obj.text}</span>
                <button onClick={() => removeObjective(i)} className="text-red-400/50 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <input className="input flex-1 text-sm" placeholder="New objective..." value={newObj}
                onChange={e => setNewObj(e.target.value)} onKeyDown={e => e.key === 'Enter' && addObjective()} />
              <button onClick={addObjective} className="btn-secondary text-xs">Add</button>
            </div>
          </div>

          <textarea className="input w-full h-16 resize-none" placeholder="Notes" value={form.notes} onChange={e => update('notes', e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => form.title && onSubmit(form)} className="btn-primary text-sm">{quest ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
