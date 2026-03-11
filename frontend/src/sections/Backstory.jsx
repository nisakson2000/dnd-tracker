import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { ImagePlus, Trash2 } from 'lucide-react';
import { getBackstory, updateBackstory } from '../api/backstory';
import { useAutosave } from '../hooks/useAutosave';
import SaveIndicator from '../components/SaveIndicator';
import HelpTooltip from '../components/HelpTooltip';
import { HELP } from '../data/helpText';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Backstory({ characterId, onPortraitChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getBackstory(characterId)
      .then((d) => {
        setData(d);
        if (d.portrait_data) onPortraitChange?.(d.portrait_data);
      })
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [characterId, onPortraitChange]);

  const saveFn = useCallback(async (d) => {
    await updateBackstory(characterId, d);
  }, [characterId]);

  const { trigger, saving, lastSaved } = useAutosave(saveFn);

  const update = (field, value) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    trigger(updated);
    if (field === 'portrait_data') onPortraitChange?.(value);
  };

  const handleImageFile = async (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please upload a PNG, JPEG, WebP, or GIF image');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image must be under 2 MB');
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      update('portrait_data', dataUrl);
      toast.success('Portrait updated');
    } catch {
      toast.error('Failed to read image');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };

  const removePortrait = () => {
    update('portrait_data', '');
    toast.success('Portrait removed');
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

      {/* Character Portrait */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-3">Character Portrait</h3>
        <div className="flex items-start gap-6">
          {/* Portrait preview */}
          {data.portrait_data ? (
            <div className="relative group shrink-0">
              <img
                src={data.portrait_data}
                alt="Character portrait"
                className="w-40 h-40 rounded-lg object-cover border-2 border-gold/30"
              />
              <button
                onClick={removePortrait}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-900/80 border border-red-500/50 text-red-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800"
                title="Remove portrait"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : null}

          {/* Upload zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex-1 min-h-[160px] rounded-lg border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              dragOver
                ? 'border-gold bg-gold/10'
                : 'border-amber-200/15 hover:border-gold/40 hover:bg-white/[0.02]'
            }`}
          >
            <ImagePlus size={32} className="text-amber-200/30" />
            <p className="text-sm text-amber-200/40">
              {data.portrait_data ? 'Click or drag to replace' : 'Click or drag an image here'}
            </p>
            <p className="text-xs text-amber-200/20">PNG, JPEG, WebP, or GIF — max 2 MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleImageFile(e.target.files[0])}
          />
        </div>
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
