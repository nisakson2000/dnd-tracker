import { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Trash2, Edit2, BookMarked, Search, X, Download, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { getJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } from '../api/journal';
import ConfirmDialog from '../components/ConfirmDialog';

const MOOD_OPTIONS = [
  { value: 'adventure', label: 'Adventure', emoji: '\u2694\uFE0F' },
  { value: 'mystery',   label: 'Mystery',   emoji: '\uD83D\uDD0D' },
  { value: 'tragedy',   label: 'Tragedy',   emoji: '\uD83D\uDC80' },
  { value: 'comedy',    label: 'Comedy',    emoji: '\uD83D\uDE04' },
  { value: 'horror',    label: 'Horror',    emoji: '\uD83D\uDC7B' },
];

function getMoodFromTags(tags) {
  if (!tags) return null;
  const parts = tags.split(',').map(t => t.trim());
  const moodTag = parts.find(t => t.startsWith('mood:'));
  if (!moodTag) return null;
  const value = moodTag.replace('mood:', '');
  return MOOD_OPTIONS.find(m => m.value === value) || null;
}

function getDisplayTags(tags) {
  if (!tags) return [];
  return tags.split(',').map(t => t.trim()).filter(t => t && !t.startsWith('mood:'));
}

function setMoodInTags(tags, moodValue) {
  const existing = tags ? tags.split(',').map(t => t.trim()).filter(t => t && !t.startsWith('mood:')) : [];
  if (moodValue) existing.push(`mood:${moodValue}`);
  return existing.join(', ');
}

function exportJournal(entries) {
  const chronological = [...entries].sort((a, b) => {
    const sessionDiff = (a.session_number || 0) - (b.session_number || 0);
    if (sessionDiff !== 0) return sessionDiff;
    return (a.real_date || '').localeCompare(b.real_date || '');
  });

  const lines = chronological.map((entry, i) => {
    const parts = [];
    if (entry.session_number > 0) parts.push(`Session ${entry.session_number}`);
    if (entry.real_date) parts.push(entry.real_date);
    parts.push(entry.title || 'Untitled');
    const header = parts.join(' | ');
    const separator = '\u2500'.repeat(Math.max(header.length, 30));
    const body = entry.body || '';
    return `${header}\n${separator}\n${body}${i < chronological.length - 1 ? '\n\n---\n' : ''}`;
  }).join('\n');

  const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'campaign-journal.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success('Journal exported');
}

function ReadingOverlay({ entry, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const mood = getMoodFromTags(entry.tags);

  return (
    <div className="fixed inset-0 z-50 bg-[#14121c]/95 flex items-start justify-center overflow-y-auto" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[700px] mx-4 my-12 px-8 py-10">
        <button onClick={onClose} className="fixed top-6 right-6 text-amber-200/40 hover:text-amber-200 z-50" aria-label="Close reading mode">
          <X size={24} />
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-display text-amber-100 mb-3">{entry.title}</h1>
          <div className="text-sm text-amber-200/40 space-x-3">
            {entry.session_number > 0 && <span>Session {entry.session_number}</span>}
            {entry.real_date && <span>{entry.real_date}</span>}
            {entry.ingame_date && <span>In-game: {entry.ingame_date}</span>}
            {mood && <span>{mood.emoji} {mood.label}</span>}
          </div>
        </div>
        <div className="text-amber-200/70 text-base leading-relaxed whitespace-pre-wrap">
          {entry.body}
        </div>
      </div>
    </div>
  );
}

export default function Journal({ characterId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [readingEntry, setReadingEntry] = useState(null);

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
      toast.success('Entry saved');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateJournalEntry(characterId, id, data);
      toast.success('Entry saved');
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJournalEntry(characterId, id);
      toast('Entry removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = useMemo(() => entries.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (e.title || '').toLowerCase().includes(q) || (e.body || '').toLowerCase().includes(q) || (e.tags || '').toLowerCase().includes(q);
  }), [entries, searchQuery]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sortBy === 'date') return (b.real_date || '').localeCompare(a.real_date || '');
    if (sortBy === 'session') return (b.session_number || 0) - (a.session_number || 0);
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    return 0;
  }), [filtered, sortBy]);

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
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <button onClick={() => exportJournal(entries)} className="btn-secondary text-xs flex items-center gap-1" title="Export journal to text file">
              <Download size={12} /> Export
            </button>
          )}
          <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
            <Plus size={12} /> New Entry
          </button>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200/30" />
          <input className="input w-full pl-9" placeholder="Search entries..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-amber-200/40">Sort:</span>
          {[['date', 'Date'], ['session', 'Session #'], ['title', 'Title A-Z']].map(([key, label]) => (
            <button key={key} onClick={() => setSortBy(key)}
              className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <BookMarked size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">No journal entries yet — record your first adventure</p>
          <p className="text-xs text-amber-200/20">After each session, jot down key events, plot hooks, and things you want to remember</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map(entry => {
            const mood = getMoodFromTags(entry.tags);
            const displayTags = getDisplayTags(entry.tags);
            return (
              <div key={entry.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-amber-100 font-display text-lg">{entry.title}</h4>
                      {mood && (
                        <span className="text-xs bg-amber-200/5 text-amber-200/50 px-1.5 py-0.5 rounded border border-amber-200/10" title={mood.label}>
                          {mood.emoji} {mood.label}
                        </span>
                      )}
                    </div>
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
                    <button onClick={() => setReadingEntry(entry)} className="text-amber-200/40 hover:text-amber-200" aria-label={`Read ${entry.title || 'entry'}`} title="Reading mode">
                      <BookOpen size={14} />
                    </button>
                    <button onClick={() => setEditing(entry)} className="text-amber-200/40 hover:text-amber-200" aria-label={`Edit ${entry.title || 'entry'}`}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setConfirmDelete(entry)} className="text-red-400/50 hover:text-red-400" aria-label={`Delete ${entry.title || 'entry'}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {displayTags.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {displayTags.map((tag, i) => (
                      <span key={`${tag}-${i}`} className="text-xs bg-purple-800/30 text-purple-300 px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="text-sm text-amber-200/60 whitespace-pre-wrap">{entry.body}</div>
              </div>
            );
          })}
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

      {readingEntry && (
        <ReadingOverlay entry={readingEntry} onClose={() => setReadingEntry(null)} />
      )}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Journal Entry?"
        message={`Remove "${confirmDelete?.title}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function JournalForm({ entry, nextSessionNumber = 1, onSubmit, onCancel }) {
  const existingMood = entry ? getMoodFromTags(entry.tags) : null;
  const [form, setForm] = useState(() => {
    const base = entry || {
      title: '', session_number: nextSessionNumber, real_date: new Date().toISOString().split('T')[0],
      ingame_date: '', body: '', tags: '',
    };
    return { ...base, _mood: existingMood ? existingMood.value : '' };
  });
  const [titleError, setTitleError] = useState(false);
  const update = (f, v) => {
    if (f === 'title') setTitleError(false);
    setForm(prev => ({ ...prev, [f]: v }));
  };
  const handleSubmit = () => {
    if (!form.title.trim()) { setTitleError(true); return; }
    const { _mood, ...rest } = form;
    const displayTags = getDisplayTags(rest.tags).join(', ');
    const finalTags = setMoodInTags(displayTags, _mood);
    onSubmit({ ...rest, tags: finalTags });
  };

  const formRef = useRef(form);
  useEffect(() => { formRef.current = form; }, [form]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => { handleSubmitRef.current = handleSubmit; });

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.ctrlKey && e.key === 'Enter' && formRef.current.title.trim()) { e.preventDefault(); handleSubmitRef.current(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  // Display tags without mood: prefix in the input
  const displayTagsStr = getDisplayTags(form.tags).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
        <h3 className="font-display text-lg text-amber-100 mb-4">{entry ? 'Edit Entry' : 'New Journal Entry'}</h3>
        <div className="space-y-3">
          <div>
            <input className={`input w-full ${titleError ? 'border-red-500' : ''}`} placeholder="Title" value={form.title} onChange={e => update('title', e.target.value)} autoFocus />
            {titleError && <p className="text-red-400 text-xs mt-1">Title required</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Session #</label><input type="number" className="input w-full" value={form.session_number} onChange={e => update('session_number', parseInt(e.target.value) || 0)} /></div>
            <div><label className="label">Date</label><input type="date" className="input w-full" value={form.real_date} onChange={e => update('real_date', e.target.value)} /></div>
            <div><label className="label">In-game Date</label><input className="input w-full" value={form.ingame_date} onChange={e => update('ingame_date', e.target.value)} /></div>
          </div>
          {/* Mood selector */}
          <div>
            <label className="label">Mood / Tone</label>
            <div className="flex gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => update('_mood', '')}
                className={`text-xs px-2.5 py-1 rounded ${!form._mood ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}
              >
                None
              </button>
              {MOOD_OPTIONS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => update('_mood', m.value)}
                  className={`text-xs px-2.5 py-1 rounded ${form._mood === m.value ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>
          <div data-color-mode="dark">
            <MDEditor value={form.body} onChange={v => update('body', v || '')} height={200} preview="edit" />
          </div>
          <input className="input w-full" placeholder="Tags (comma separated)" value={displayTagsStr} onChange={e => update('tags', e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <span className="text-xs text-amber-200/30 self-center mr-auto">Ctrl+Enter to save</span>
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm">{entry ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
