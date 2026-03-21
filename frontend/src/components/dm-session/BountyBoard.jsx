import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Send, X, Shuffle, Coins } from 'lucide-react';

const STORAGE_KEY = 'codex_bounty_board';
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Deadly'];
const DIFF_COLORS = { Easy: '#4ade80', Medium: '#fbbf24', Hard: '#f97316', Deadly: '#ef4444' };
const STATUSES = ['active', 'claimed', 'completed', 'expired'];

const RANDOM_TEMPLATES = [
  { target: 'Goblin Chief Skrag', reward: 50, difficulty: 'Easy', description: 'Bring back the head of the goblin chief terrorizing trade routes.', postedBy: 'Merchant Guild' },
  { target: 'Unknown Suspect', reward: 100, difficulty: 'Medium', description: 'Wanted: information on the disappearance of merchant guild members.', postedBy: 'City Watch' },
  { target: 'Displacer Beast Pack', reward: 200, difficulty: 'Hard', description: 'Eliminate the pack of displacer beasts in the Whispering Woods.', postedBy: 'Local Baron' },
  { target: 'Rogue Mage Vaelith', reward: 300, difficulty: 'Deadly', description: 'Capture alive: rogue mage conducting illegal experiments.', postedBy: 'Arcane Council' },
  { target: 'Cemetery Undead', reward: 75, difficulty: 'Easy', description: 'Clear the undead from the old cemetery on the hill.', postedBy: 'Temple of Kelemvor' },
  { target: 'Caravan Escort', reward: 150, difficulty: 'Medium', description: 'Escort a caravan through dangerous territory to the northern pass.', postedBy: 'Trade Consortium' },
  { target: 'Abandoned Tower', reward: 100, difficulty: 'Medium', description: 'Investigate strange occurrences at the abandoned tower east of town.', postedBy: "Mayor's Office" },
  { target: 'Bandit Lord Kael', reward: 250, difficulty: 'Hard', description: 'Defeat the bandit lord and recover stolen goods from his hideout.', postedBy: 'Regional Guard' },
];

function loadBounties() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveBounties(bounties) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bounties));
}

const emptyForm = { target: '', reward: '', difficulty: 'Medium', description: '', postedBy: '', status: 'active' };

export default function BountyBoard({ onBroadcast, onClose }) {
  const [bounties, setBounties] = useState(loadBounties);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => { saveBounties(bounties); }, [bounties]);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const addBounty = () => {
    if (!form.target.trim()) return;
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      target: form.target.trim(),
      reward: Number(form.reward) || 0,
      difficulty: form.difficulty,
      description: form.description.trim(),
      postedBy: form.postedBy.trim() || 'Unknown',
      status: 'active',
      created: Date.now(),
    };
    setBounties(b => [entry, ...b]);
    setForm({ ...emptyForm });
    setShowForm(false);
  };

  const quickGenerate = () => {
    const tpl = RANDOM_TEMPLATES[Math.floor(Math.random() * RANDOM_TEMPLATES.length)];
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ...tpl,
      status: 'active',
      created: Date.now(),
    };
    setBounties(b => [entry, ...b]);
  };

  const cycleStatus = (id) => {
    setBounties(b => b.map(x => {
      if (x.id !== id) return x;
      const idx = STATUSES.indexOf(x.status);
      return { ...x, status: STATUSES[(idx + 1) % STATUSES.length] };
    }));
  };

  const deleteBounty = (id) => setBounties(b => b.filter(x => x.id !== id));

  const broadcast = (bounty) => {
    if (onBroadcast) onBroadcast(bounty);
  };

  /* ---------- styles ---------- */
  const panel = {
    background: '#1e1e2e', border: '1px solid #2a2a3d', borderRadius: 8,
    padding: 16, fontFamily: 'var(--font-ui)', color: '#e2e2e8', maxHeight: '80vh',
    display: 'flex', flexDirection: 'column', width: '100%',
  };
  const header = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12, gap: 8,
  };
  const title = { display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: '#c9a84c' };
  const btnRow = { display: 'flex', gap: 6 };
  const iconBtn = (bg = '#2a2a3d') => ({
    background: bg, border: 'none', borderRadius: 6, padding: '5px 8px',
    cursor: 'pointer', color: '#e2e2e8', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
  });
  const inputStyle = {
    background: '#16161e', border: '1px solid #333', borderRadius: 6, padding: '6px 8px',
    color: '#e2e2e8', fontFamily: 'var(--font-ui)', fontSize: 13, width: '100%', boxSizing: 'border-box',
  };
  const selectStyle = { ...inputStyle, cursor: 'pointer' };
  const cardStyle = {
    background: '#16161e', border: '1px solid #2a2a3d', borderRadius: 8,
    padding: 10, marginBottom: 6,
  };
  const statusBadge = (status) => {
    const map = { active: '#c084fc', claimed: '#fbbf24', completed: '#4ade80', expired: '#6b7280' };
    return {
      fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 10,
      background: (map[status] || '#6b7280') + '22', color: map[status] || '#6b7280',
      border: `1px solid ${map[status] || '#6b7280'}44`, cursor: 'pointer', userSelect: 'none',
    };
  };

  return (
    <div style={panel}>
      {/* Header */}
      <div style={header}>
        <div style={title}><Target size={18} /> Bounty Board</div>
        <div style={btnRow}>
          <button style={iconBtn('#c084fc22')} onClick={quickGenerate} title="Quick generate">
            <Shuffle size={14} /> Random
          </button>
          <button style={iconBtn('#c084fc22')} onClick={() => setShowForm(f => !f)} title="Add bounty">
            <Plus size={14} /> Add
          </button>
          {onClose && (
            <button style={iconBtn()} onClick={onClose} title="Close">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ ...cardStyle, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input style={inputStyle} placeholder="Target name" value={form.target} onChange={e => update('target', e.target.value)} />
          <div style={{ display: 'flex', gap: 6 }}>
            <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Reward (gp)" value={form.reward} onChange={e => update('reward', e.target.value)} />
            <select style={{ ...selectStyle, flex: 1 }} value={form.difficulty} onChange={e => update('difficulty', e.target.value)}>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 48 }} placeholder="Description (crime, last seen location...)" value={form.description} onChange={e => update('description', e.target.value)} />
          <input style={inputStyle} placeholder="Posted by (faction / authority)" value={form.postedBy} onChange={e => update('postedBy', e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <button style={iconBtn()} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={iconBtn('#c084fc33')} onClick={addBounty}><Plus size={14} /> Add Bounty</button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
        {bounties.length === 0 && (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: 24, fontSize: 13 }}>
            No bounties posted. Click <strong>Add</strong> or <strong>Random</strong> to get started.
          </div>
        )}
        {bounties.map(b => (
          <div key={b.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#e2e2e8' }}>{b.target}</span>
                <span style={{ fontSize: 12, color: DIFF_COLORS[b.difficulty], fontFamily: 'var(--font-mono)' }}>
                  [{b.difficulty}]
                </span>
              </div>
              <span style={statusBadge(b.status)} onClick={() => cycleStatus(b.id)} title="Click to cycle status">
                {b.status}
              </span>
            </div>
            {b.description && <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 4, lineHeight: 1.4 }}>{b.description}</div>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#9ca3af' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#c9a84c', fontWeight: 600 }}>
                  <Coins size={13} /> {b.reward} gp
                </span>
                <span>Posted by: {b.postedBy}</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={iconBtn()} onClick={() => broadcast(b)} title="Broadcast to players">
                  <Send size={13} />
                </button>
                <button style={iconBtn('#ef444422')} onClick={() => deleteBounty(b.id)} title="Delete bounty">
                  <Trash2 size={13} color="#ef4444" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
