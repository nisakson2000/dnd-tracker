import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { getBackstory, updateBackstory } from '../api/backstory';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import { HELP } from '../data/helpText';

export default function Backstory({ characterId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBackstory(characterId)
      .then(setData)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [characterId]);

  const saveFn = useCallback(async (d) => {
    await updateBackstory(characterId, d);
  }, [characterId]);

  const { trigger, saving, lastSaved } = useAutosave(saveFn);

  const update = (field, value) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    trigger(updated);
  };

  if (loading || !data) return <div className="text-amber-200/40">Loading backstory...</div>;

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-amber-100">Backstory & Details<HelpTooltip text={HELP.background} /></h2>
          <p className="text-xs text-amber-200/40 mt-1">Your character's history, personality, and physical description. This is the roleplaying side — who they are beyond the numbers.</p>
        </div>
        <SaveIndicator saving={saving} lastSaved={lastSaved} />
      </div>

      {/* Backstory */}
      <div className="card">
        <label className="label">Character Backstory</label>
        <div data-color-mode="dark">
          <MDEditor
            value={data.backstory_text}
            onChange={v => update('backstory_text', v || '')}
            height={250}
            preview="edit"
          />
        </div>
      </div>

      {/* Personality */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-1">Personality</h3>
        <p className="text-xs text-amber-200/30 mb-3">These four traits are found on your background — they guide how you roleplay your character.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Personality Traits</label>
            <textarea className="input w-full h-24 resize-none" placeholder="Two traits that describe your character's demeanor..." value={data.personality_traits} onChange={e => update('personality_traits', e.target.value)} />
          </div>
          <div>
            <label className="label">Ideals</label>
            <textarea className="input w-full h-24 resize-none" placeholder="What principle does your character believe in above all?" value={data.ideals} onChange={e => update('ideals', e.target.value)} />
          </div>
          <div>
            <label className="label">Bonds</label>
            <textarea className="input w-full h-24 resize-none" placeholder="A person, place, or thing your character cares deeply about..." value={data.bonds} onChange={e => update('bonds', e.target.value)} />
          </div>
          <div>
            <label className="label">Flaws</label>
            <textarea className="input w-full h-24 resize-none" placeholder="A weakness or vice that can be used against your character..." value={data.flaws} onChange={e => update('flaws', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Physical */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-1">Physical Description</h3>
        <p className="text-xs text-amber-200/30 mb-3">What does your character look like? These details help you and your party visualize them.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['age', 'height', 'weight', 'eyes', 'hair', 'skin'].map(f => (
            <div key={f}>
              <label className="label capitalize">{f}</label>
              <input className="input w-full" value={data[f]} onChange={e => update(f, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Other details */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-3">Additional Details</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Allies & Organizations</label>
            <textarea className="input w-full h-20 resize-none" value={data.allies_organizations} onChange={e => update('allies_organizations', e.target.value)} />
          </div>
          <div>
            <label className="label">Appearance Notes</label>
            <textarea className="input w-full h-20 resize-none" value={data.appearance_notes} onChange={e => update('appearance_notes', e.target.value)} />
          </div>
          <div>
            <label className="label">Goals & Motivations</label>
            <div data-color-mode="dark">
              <MDEditor
                value={data.goals_motivations}
                onChange={v => update('goals_motivations', v || '')}
                height={150}
                preview="edit"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
