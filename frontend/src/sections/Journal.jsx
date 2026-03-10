import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, BookMarked, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { getJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } from '../api/journal';

export default function Journal({ characterId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    try {
      const data = await getJournalEntries(characterId);
      setEntries(data);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [characterId]);

  const handleAdd = async (data) => {
    try {
      await addJournalEntry(characterId, data);
      toast.success('Entry added');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateJournalEntry(characterId, id, data);
      toast.success('Entry updated');
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJournalEntry(characterId, id);
      toast.success('Entry deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = entries.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q) || e.tags.toLowerCase().includes(q);
  });

  if (loading) return <div className="text-amber-200/40">Loading journal...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <BookMarked size={20} />
          <div>
            <span>Campaign Journal</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Record what happens each session. Keep notes on key events, plot twists, and important details your DM reveals.</p>
          </div>
        </h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
          <Plus size={12} /> New Entry
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200/30" />
        <input className="input w-full pl-9" placeholder="Search entries..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="card text-center text-amber-200/30 py-8">No journal entries yet. After each session, jot down what happened — key events, plot hooks, and things you want to remember.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(entry => (
            <div key={entry.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-amber-100 font-display text-lg">{entry.title}</h4>
                  <div className="text-xs text-amber-200/40 mt-1 space-x-3">
                    {entry.session_number > 0 && <span>Session {entry.session_number}</span>}
                    {entry.real_date && <span>{entry.real_date}</span>}
                    {entry.ingame_date && <span>In-game: {entry.ingame_date}</span>}
                    {(() => {
                      const words = entry.body ? entry.body.trim().split(/\s+/).filter(Boolean).length : 0;
                      const readTime = Math.max(1, Math.round(words / 200));
                      return words > 0 ? <span className="text-amber-200/25">~{words} words / {readTime} min read</span> : null;
                    })()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(entry)} className="text-amber-200/40 hover:text-amber-200">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(entry.id)} className="text-red-400/50 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {entry.tags && (
                <div className="flex gap-1 mb-2">
                  {entry.tags.split(',').map((tag, i) => (
                    <span key={i} className="text-xs bg-purple-800/30 text-purple-300 px-2 py-0.5 rounded">{tag.trim()}</span>
                  ))}
                </div>
              )}
              <div className="text-sm text-amber-200/60 whitespace-pre-wrap">{entry.body}</div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editing) && (
        <JournalForm
          entry={editing}
          nextSessionNumber={entries.length > 0 ? Math.max(...entries.map(e => e.session_number || 0)) + 1 : 1}
          onSubmit={editing ? (data) => handleUpdate(editing.id, data) : handleAdd}
          onCancel={() => { setShowAdd(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function JournalForm({ entry, nextSessionNumber = 1, onSubmit, onCancel }) {
  const [form, setForm] = useState(entry || {
    title: '', session_number: nextSessionNumber, real_date: new Date().toISOString().split('T')[0],
    ingame_date: '', body: '', tags: '',
  });
  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">{entry ? 'Edit Entry' : 'New Journal Entry'}</h3>
        <div className="space-y-3">
          <input className="input w-full" placeholder="Title" value={form.title} onChange={e => update('title', e.target.value)} autoFocus />
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Session #</label><input type="number" className="input w-full" value={form.session_number} onChange={e => update('session_number', parseInt(e.target.value) || 0)} /></div>
            <div><label className="label">Date</label><input type="date" className="input w-full" value={form.real_date} onChange={e => update('real_date', e.target.value)} /></div>
            <div><label className="label">In-game Date</label><input className="input w-full" value={form.ingame_date} onChange={e => update('ingame_date', e.target.value)} /></div>
          </div>
          <div data-color-mode="dark">
            <MDEditor value={form.body} onChange={v => update('body', v || '')} height={200} preview="edit" />
          </div>
          <input className="input w-full" placeholder="Tags (comma separated)" value={form.tags} onChange={e => update('tags', e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => form.title && onSubmit(form)} className="btn-primary text-sm">{entry ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
