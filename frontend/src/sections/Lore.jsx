import { useState, useEffect, useMemo } from 'react';
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
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
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

  const categories = useMemo(() => [...new Set(notes.map(n => n.category).filter(Boolean))], [notes]);

  const filtered = useMemo(() => notes.filter(n => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(n.title || '').toLowerCase().includes(q) && !(n.body || '').toLowerCase().includes(q) && !(n.category || '').toLowerCase().includes(q)) return false;
    }
    if (categoryFilter !== 'all' && (n.category || '') !== categoryFilter) return false;
    return true;
  }), [notes, searchQuery, categoryFilter]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '');
    return 0;
  }), [filtered, sortBy]);

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

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/30 pointer-events-none" />
            <input className="input w-full pl-10" placeholder="Search lore..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-amber-200/40">Sort:</span>
            {[['name', 'Name A-Z'], ['category', 'Category']].map(([key, label]) => (
              <button key={key} onClick={() => setSortBy(key)}
                className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-amber-200/40">Category:</span>
            <button onClick={() => setCategoryFilter('all')}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${categoryFilter === 'all' ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
              All
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${categoryFilter === cat ? 'bg-gold/15 border-gold/30 text-gold' : 'border-amber-200/10 text-amber-200/30 hover:text-amber-200/50'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <Globe size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">No lore notes yet — record world details and discoveries</p>
          <p className="text-xs text-amber-200/20">Store factions, locations, deities, history, and anything about the game world worth remembering</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map(note => (
            <div key={note.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-amber-100 font-display">{note.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    {note.category && <span className="text-xs bg-purple-800/30 text-purple-300 px-2 py-0.5 rounded">{note.category}</span>}
                    {note.body && (() => {
                      const words = note.body.trim().split(/\s+/).filter(Boolean).length;
                      const mins = Math.ceil(words / 200);
                      return <span className="text-[10px] text-amber-200/25">{words} words ~ {mins} min read</span>;
                    })()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(note); setShowForm(true); }} className="text-amber-200/40 hover:text-amber-200" aria-label={`Edit ${note.title || 'note'}`}><Edit2 size={14} /></button>
                  <button onClick={() => setConfirmDelete(note)} className="text-red-400/50 hover:text-red-400" aria-label={`Delete ${note.title || 'note'}`}><Trash2 size={14} /></button>
                </div>
              </div>
              {note.body && (
                <div className="text-sm text-amber-200/50 line-clamp-4 [&_.wmde-markdown]:!bg-transparent [&_.wmde-markdown]:!text-amber-200/50 [&_.wmde-markdown]:!font-sans [&_.wmde-markdown]:!text-sm" data-color-mode="dark">
                  <MDEditor.Markdown source={note.body} />
                </div>
              )}
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">{note ? 'Edit Note' : 'New Lore Note'}</h3>
        <div className="space-y-3">
          <div>
            <input className={`input w-full ${titleError ? 'border-red-500' : ''}`} placeholder="Title" value={form.title} onChange={e => update('title', e.target.value)} autoFocus />
            {titleError && <p className="text-red-400 text-xs mt-1">Title required</p>}
          </div>
          <input className="input w-full" placeholder="Category (e.g. Factions, Locations, Deities)" value={form.category} onChange={e => update('category', e.target.value)} />
          <div data-color-mode="dark">
            <MDEditor value={form.body} onChange={v => update('body', v || '')} height={250} preview="edit" />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm">{note ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
