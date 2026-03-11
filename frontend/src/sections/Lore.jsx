import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Globe, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { getLoreNotes, addLoreNote, updateLoreNote, deleteLoreNote } from '../api/lore';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Lore({ characterId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    try { setNotes(await getLoreNotes(characterId)); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [characterId]);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateLoreNote(characterId, editing.id, data);
        toast.success('Note updated');
      } else {
        await addLoreNote(characterId, data);
        toast.success('Note added');
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLoreNote(characterId, id);
      toast.success('Note removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = notes.filter(n => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (n.title || '').toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q) || (n.category || '').toLowerCase().includes(q);
  });

  if (loading) return <div className="text-amber-200/40">Loading lore...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Globe size={20} />
          <div>
            <span>Lore & World Notes</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Store world-building details — factions, locations, deities, history. Anything about the game world worth remembering goes here.</p>
          </div>
        </h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-xs flex items-center gap-1">
          <Plus size={12} /> New Note
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
        <input className="input w-full pl-10" placeholder="Search lore..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center text-amber-200/30 py-8">No lore notes yet. Record world-building details your DM shares — factions, locations, history, or anything about the game world worth remembering.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(note => (
            <div key={note.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-amber-100 font-display">{note.title}</h4>
                  {note.category && <span className="text-xs bg-purple-800/30 text-purple-300 px-2 py-0.5 rounded">{note.category}</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(note); setShowForm(true); }} className="text-amber-200/40 hover:text-amber-200"><Edit2 size={14} /></button>
                  <button onClick={() => setConfirmDelete(note)} className="text-red-400/50 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-sm text-amber-200/50 whitespace-pre-wrap line-clamp-4">{note.body}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <LoreForm note={editing} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Lore Note?"
        message={`Remove "${confirmDelete?.title}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function LoreForm({ note, onSubmit, onCancel }) {
  const [form, setForm] = useState(note || { title: '', category: '', body: '' });
  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">{note ? 'Edit Note' : 'New Lore Note'}</h3>
        <div className="space-y-3">
          <input className="input w-full" placeholder="Title" value={form.title} onChange={e => update('title', e.target.value)} autoFocus />
          <input className="input w-full" placeholder="Category (e.g. Factions, Locations, Deities)" value={form.category} onChange={e => update('category', e.target.value)} />
          <div data-color-mode="dark">
            <MDEditor value={form.body} onChange={v => update('body', v || '')} height={250} preview="edit" />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => form.title && onSubmit(form)} className="btn-primary text-sm">{note ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
