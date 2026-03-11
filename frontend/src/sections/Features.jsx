import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, ScrollText, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFeatures, addFeature, updateFeature, deleteFeature } from '../api/features';
import HelpTooltip from '../components/HelpTooltip';
import ConfirmDialog from '../components/ConfirmDialog';
import { HELP } from '../data/helpText';

const RECHARGE_OPTIONS = ['', 'short_rest', 'long_rest', 'dawn', 'manual'];
const RECHARGE_LABELS = { '': 'None', 'short_rest': 'Short Rest', 'long_rest': 'Long Rest', 'dawn': 'At Dawn', 'manual': 'Manual' };

export default function Features({ characterId }) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    try {
      const data = await getFeatures(characterId);
      setFeatures(data);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [characterId]);

  const handleAdd = async (data) => {
    try {
      await addFeature(characterId, { ...data, uses_remaining: data.uses_total ?? 0 });
      toast.success('Feature added');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeature(characterId, id);
      toast.success('Feature removed');
      setConfirmDelete(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const useCharge = async (feature) => {
    if ((feature.uses_remaining ?? 0) <= 0) {
      toast.error(`No uses left for ${feature.name || 'this feature'}`);
      return;
    }
    const updated = { ...feature, uses_remaining: (feature.uses_remaining ?? 0) - 1 };
    setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
    try {
      await updateFeature(characterId, feature.id, updated);
    } catch (err) { toast.error(err.message); load(); }
  };

  const restoreCharge = async (feature) => {
    if ((feature.uses_remaining ?? 0) >= (feature.uses_total ?? 0)) return;
    const updated = { ...feature, uses_remaining: (feature.uses_remaining ?? 0) + 1 };
    setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
    try {
      await updateFeature(characterId, feature.id, updated);
    } catch (err) { toast.error(err.message); load(); }
  };

  const restoreAll = async (feature) => {
    const updated = { ...feature, uses_remaining: feature.uses_total ?? 0 };
    setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
    try {
      await updateFeature(characterId, feature.id, updated);
      toast.success('Uses restored');
    } catch (err) { toast.error(err.message); load(); }
  };

  const filtered = useMemo(() => filter === 'all' ? features : features.filter(f => f.feature_type === filter), [features, filter]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'type') {
      const order = { class: 0, racial: 1, feat: 2 };
      return (order[a.feature_type] ?? 9) - (order[b.feature_type] ?? 9);
    }
    if (sortBy === 'uses') return (a.uses_remaining ?? 0) - (b.uses_remaining ?? 0);
    return 0;
  }), [filtered, sortBy]);

  if (loading) return <div className="text-amber-200/40">Loading features...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <ScrollText size={20} />
          <div>
            <span>Features & Traits<HelpTooltip text={HELP.feat} /></span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Your class features, racial traits, and feats. Track limited-use abilities with the charge system.</p>
          </div>
        </h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
          <Plus size={12} /> Add Feature
        </button>
      </div>

      {/* Filter + Sort */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          {['all', 'class', 'racial', 'feat'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded capitalize ${filter === f ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-amber-200/40">Sort:</span>
          {[['name', 'Name A-Z'], ['type', 'Type'], ['uses', 'Uses Left']].map(([key, label]) => (
            <button key={key} onClick={() => setSortBy(key)}
              className={`text-xs px-2.5 py-1 rounded ${sortBy === key ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-amber-200/5 text-amber-200/40 border border-amber-200/10'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature List */}
      {filtered.length === 0 ? (
        <div className="card border-dashed border-amber-200/10 text-center py-12">
          <ScrollText size={32} className="mx-auto text-amber-200/15 mb-3" />
          <p className="text-sm text-amber-200/30 mb-1">No features yet — add class features, racial traits, or feats</p>
          <p className="text-xs text-amber-200/20">Check your class description for what you start with at level 1</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(f => (
            <div key={f.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-amber-100 font-medium">{f.name || 'Unnamed Feature'}</h4>
                    {f.recharge && (
                      <span className="text-[10px] text-amber-200/40 bg-amber-200/5 px-1.5 py-0.5 rounded border border-amber-200/10">
                        {RECHARGE_LABELS[f.recharge] || f.recharge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-amber-200/40 mt-1">
                    {f.source && <span>{f.source}</span>}
                    {f.source_level > 0 && <span className="ml-2">Level {f.source_level}</span>}
                    <span className="ml-2 capitalize text-purple-300/50">{f.feature_type}</span>
                  </div>
                </div>
                <button onClick={() => setConfirmDelete(f)} className="text-red-400/50 hover:text-red-400 flex-shrink-0" aria-label={`Delete ${f.name || 'feature'}`}>
                  <Trash2 size={14} />
                </button>
              </div>

              {f.description && <p className="text-sm text-amber-200/60 mt-2 whitespace-pre-wrap">{f.description}</p>}

              {/* Uses/Charges Tracker */}
              {(f.uses_total ?? 0) > 0 && (
                <div className="mt-3 pt-3 border-t border-gold/10">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-amber-200/50">Uses:</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: f.uses_total ?? 0 }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => i < (f.uses_remaining ?? 0) ? useCharge(f) : restoreCharge(f)}
                          className={`w-5 h-5 rounded-full border-2 transition-all ${
                            i < (f.uses_remaining ?? 0)
                              ? 'bg-gold border-gold/70 shadow-[0_0_6px_rgba(201,168,76,0.3)]'
                              : 'border-amber-200/20 bg-transparent hover:border-amber-200/40'
                          }`}
                          title={i < (f.uses_remaining ?? 0) ? 'Click to spend a use' : 'Click to restore a use'}
                          aria-label={`${f.name || 'Feature'} use ${i + 1} of ${f.uses_total}, ${i < (f.uses_remaining ?? 0) ? 'available — click to spend' : 'spent — click to restore'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-amber-200/40">{f.uses_remaining ?? 0} / {f.uses_total ?? 0}</span>
                    {(f.uses_remaining ?? 0) < (f.uses_total ?? 0) && (
                      <button
                        onClick={() => restoreAll(f)}
                        className="text-xs text-gold/50 hover:text-gold transition-colors flex items-center gap-1"
                        title="Restore all uses"
                      >
                        <RotateCcw size={10} /> Reset
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd && <FeatureForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />}

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Feature?"
        message={`Remove "${confirmDelete?.name}"? This cannot be undone.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function FeatureForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '', source: '', source_level: 0, feature_type: 'class', description: '',
    uses_total: 0, uses_remaining: 0, recharge: '',
  });
  const [nameError, setNameError] = useState(false);
  const update = (f, v) => {
    if (f === 'name') setNameError(false);
    setForm(prev => ({ ...prev, [f]: v }));
  };
  const handleSubmit = () => {
    if (!form.name.trim()) { setNameError(true); return; }
    onSubmit(form);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-display text-lg text-amber-100 mb-4">Add Feature</h3>
        <div className="space-y-3">
          <div>
            <input className={`input w-full ${nameError ? 'border-red-500' : ''}`} placeholder="e.g. Action Surge, Sneak Attack, Lucky..." value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
            {nameError && <p className="text-red-400 text-xs mt-1">Name required</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input w-full" placeholder="Source (class/race)" value={form.source} onChange={e => update('source', e.target.value)} />
            <select className="input w-full" value={form.feature_type} onChange={e => update('feature_type', e.target.value)}>
              <option value="class">Class</option>
              <option value="racial">Racial</option>
              <option value="feat">Feat</option>
            </select>
          </div>
          <input type="number" className="input w-full" placeholder="Level obtained" min={0} value={form.source_level} onChange={e => update('source_level', parseInt(e.target.value) || 0)} />
          <textarea className="input w-full h-24 resize-none" placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} />

          {/* Uses / Charges */}
          <div className="border-t border-gold/10 pt-3">
            <label className="label mb-2">Limited Uses (optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-amber-200/40 mb-1 block">Uses Per Rest</label>
                <input type="number" className="input w-full" min={0} max={20} value={form.uses_total} onChange={e => update('uses_total', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="text-[10px] text-amber-200/40 mb-1 block">Recharges On</label>
                <select className="input w-full" value={form.recharge} onChange={e => update('recharge', e.target.value)}>
                  {RECHARGE_OPTIONS.map(r => <option key={r} value={r}>{RECHARGE_LABELS[r]}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm">Add</button>
        </div>
      </div>
    </div>
  );
}
