import { useState, useEffect } from 'react';
import { Plus, Trash2, ScrollText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFeatures, addFeature, deleteFeature } from '../api/features';
import HelpTooltip from '../components/HelpTooltip';
import { HELP } from '../data/helpText';

export default function Features({ characterId }) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');

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
      await addFeature(characterId, data);
      toast.success('Feature added');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeature(characterId, id);
      toast.success('Feature removed');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = filter === 'all' ? features : features.filter(f => f.feature_type === filter);

  if (loading) return <div className="text-amber-200/40">Loading features...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <ScrollText size={20} />
          <div>
            <span>Features & Traits<HelpTooltip text={HELP.feat} /></span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">Your class features, racial traits, and feats. These are special abilities that make your character unique — add them as you level up.</p>
          </div>
        </h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1">
          <Plus size={12} /> Add Feature
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'class', 'racial', 'feat'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded capitalize ${filter === f ? 'bg-gold/20 text-gold border border-gold/30' : 'text-amber-200/40 border border-amber-200/10'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Feature List */}
      {filtered.length === 0 ? (
        <div className="card text-center text-amber-200/30 py-8">No features yet. Add your class features, racial traits, and feats as you gain them. Check your class description for what you start with at level 1.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(f => (
            <div key={f.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-amber-100 font-medium">{f.name}</h4>
                  <div className="text-xs text-amber-200/40 mt-1">
                    {f.source && <span>{f.source}</span>}
                    {f.source_level > 0 && <span className="ml-2">Level {f.source_level}</span>}
                    <span className="ml-2 capitalize text-purple-300/50">{f.feature_type}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(f.id)} className="text-red-400/50 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
              {f.description && <p className="text-sm text-amber-200/60 mt-2 whitespace-pre-wrap">{f.description}</p>}
            </div>
          ))}
        </div>
      )}

      {showAdd && <FeatureForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />}
    </div>
  );
}

function FeatureForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', source: '', source_level: 0, feature_type: 'class', description: '' });
  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-display text-lg text-amber-100 mb-4">Add Feature</h3>
        <div className="space-y-3">
          <input className="input w-full" placeholder="Feature name" value={form.name} onChange={e => update('name', e.target.value)} autoFocus />
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
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => form.name && onSubmit(form)} className="btn-primary text-sm">Add</button>
        </div>
      </div>
    </div>
  );
}
