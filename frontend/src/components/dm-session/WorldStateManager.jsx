import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Globe, Plus, Eye, EyeOff, Trash2, Save, X, Loader2 } from 'lucide-react';

const CATEGORIES = ['general', 'politics', 'geography', 'events', 'factions'];

const CATEGORY_COLORS = {
  general: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  politics: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  geography: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  events: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
  factions: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
};

function CategoryBadge({ category }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.general;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors}`}>
      {category}
    </span>
  );
}

function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function WorldStateManager({ campaignId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [formKey, setFormKey] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formCategory, setFormCategory] = useState('general');
  const [formVisibility, setFormVisibility] = useState('dm_only');
  const [saving, setSaving] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const data = await invoke('get_world_state', { campaignId });
      setEntries(data || []);
    } catch (err) {
      console.error('[WorldStateManager] get_world_state:', err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const resetForm = () => {
    setFormKey('');
    setFormValue('');
    setFormCategory('general');
    setFormVisibility('dm_only');
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formKey.trim()) return;
    setSaving(true);
    try {
      await invoke('set_world_state', {
        campaignId,
        key: formKey.trim(),
        value: formValue,
        category: formCategory,
        visibility: formVisibility,
      });
      resetForm();
      await fetchEntries();
    } catch (err) {
      console.error('[WorldStateManager] set_world_state:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id || entry.key);
    setFormKey(entry.key);
    setFormValue(typeof entry.value === 'object' ? JSON.stringify(entry.value, null, 2) : entry.value || '');
    setFormCategory(entry.category || 'general');
    setFormVisibility(entry.visibility || 'dm_only');
    setShowForm(true);
  };

  const handleReveal = async (key) => {
    try {
      await invoke('reveal_world_state', { campaignId, key });
      await fetchEntries();
    } catch (err) {
      console.error('[WorldStateManager] reveal_world_state:', err);
    }
  };

  const handleDelete = async (key) => {
    try {
      await invoke('delete_world_state', { campaignId, key });
      await fetchEntries();
    } catch (err) {
      console.error('[WorldStateManager] delete_world_state:', err);
    }
  };

  if (!campaignId) {
    return (
      <div className="card p-4 text-center text-amber-200/40 text-sm">
        <Globe size={24} className="mx-auto mb-2 text-amber-200/20" />
        Select a campaign to manage world state
      </div>
    );
  }

  return (
    <div className="card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-100/80">
          <Globe size={16} className="text-amber-400" />
          <span className="text-sm font-medium">World State</span>
          <span className="text-[10px] text-amber-200/30">({entries.length})</span>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="text-xs px-2.5 py-1 rounded border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-all cursor-pointer flex items-center gap-1"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-amber-200/[0.04] border border-amber-500/20 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-amber-200/60">{editingId ? 'Edit Entry' : 'New Entry'}</span>
            <button onClick={resetForm} className="text-amber-200/30 hover:text-amber-200/60 cursor-pointer">
              <X size={14} />
            </button>
          </div>

          <input
            type="text"
            value={formKey}
            onChange={(e) => setFormKey(e.target.value)}
            placeholder="Key (e.g. current_ruler)"
            disabled={!!editingId}
            className="w-full text-xs bg-black/20 border border-white/10 rounded px-2.5 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-amber-500/40 focus:outline-none disabled:opacity-50"
          />

          <textarea
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Value (text or JSON)"
            rows={3}
            className="w-full text-xs bg-black/20 border border-white/10 rounded px-2.5 py-1.5 text-amber-100/80 placeholder:text-amber-200/20 focus:border-amber-500/40 focus:outline-none resize-y"
          />

          <div className="flex gap-2">
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 focus:border-amber-500/40 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>

            <select
              value={formVisibility}
              onChange={(e) => setFormVisibility(e.target.value)}
              className="text-xs bg-black/20 border border-white/10 rounded px-2 py-1.5 text-amber-100/80 focus:border-amber-500/40 focus:outline-none cursor-pointer"
            >
              <option value="dm_only">DM Only</option>
              <option value="players">Visible to Players</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !formKey.trim()}
            className="text-xs px-3 py-1.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {editingId ? 'Update' : 'Save'}
          </button>
        </div>
      )}

      {/* Entries list */}
      {loading ? (
        <Loader2 size={16} className="animate-spin text-amber-300/40 mx-auto" />
      ) : entries.length === 0 ? (
        <div className="text-center py-6 text-amber-200/30 text-sm">No world state entries</div>
      ) : (
        <div className="space-y-1.5">
          {entries.map((entry) => {
            const isHidden = entry.visibility === 'dm_only';
            let displayValue = entry.value;
            if (typeof displayValue === 'object') {
              displayValue = JSON.stringify(displayValue, null, 2);
            }

            return (
              <div
                key={entry.id || entry.key}
                className="bg-amber-200/[0.03] border border-amber-200/10 rounded-lg p-2.5 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-100/80 font-medium">{formatKey(entry.key)}</span>
                      <CategoryBadge category={entry.category || 'general'} />
                      {isHidden && (
                        <span className="text-[10px] text-amber-200/25 flex items-center gap-0.5">
                          <EyeOff size={10} /> DM only
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-200/45 whitespace-pre-wrap break-words">
                      {displayValue}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {isHidden && (
                      <button
                        onClick={() => handleReveal(entry.key)}
                        title="Reveal to players"
                        className="p-1 rounded hover:bg-amber-500/10 text-amber-200/40 hover:text-amber-300 cursor-pointer transition-all"
                      >
                        <Eye size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(entry)}
                      title="Edit"
                      className="p-1 rounded hover:bg-amber-500/10 text-amber-200/40 hover:text-amber-300 cursor-pointer transition-all text-[10px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.key)}
                      title="Delete"
                      className="p-1 rounded hover:bg-red-500/10 text-amber-200/40 hover:text-red-400 cursor-pointer transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
