import { useState, useEffect } from 'react';
import { Swords, ChevronDown, X, Plus, Trash2, Zap } from 'lucide-react';
import {
  calculateEncounterDifficulty,
  generateBalancedEncounter,
  getQuickMonsters,
  CR_TO_XP,
} from '../../data/encounterBuilder';

const CRS = ['0','1/8','1/4','1/2',...Array.from({length:30},(_,i)=>String(i+1))];

const DIFF_COLORS = { Trivial:'#6b7280', Easy:'#22c55e', Medium:'#eab308', Hard:'#f97316', Deadly:'#ef4444' };

/* ─── Shared Styles ─── */
const panelStyle = {
  background: 'rgba(30, 30, 40, 0.95)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px',
  overflow: 'hidden',
  fontFamily: 'var(--font-ui)',
};
const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '8px 12px', background: 'rgba(192,132,252,0.08)',
  borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', userSelect: 'none',
};
const headerTitle = {
  display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc',
  fontWeight: 700, fontSize: '12px', fontFamily: 'var(--font-display)', letterSpacing: '0.3px',
};
const bodyStyle = { padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '10px' };
const label = {
  fontSize: '10px', fontWeight: 600, color: '#c9a84c',
  textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px',
};
const inputStyle = {
  width: '100%', padding: '6px 8px', borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)',
  color: 'var(--text)', fontSize: '12px', fontFamily: 'var(--font-ui)', outline: 'none',
  boxSizing: 'border-box',
};
const btnBase = {
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-ui)',
  fontWeight: 600, fontSize: '11px', transition: 'all 0.15s ease',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
};
const cardStyle = {
  background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px',
};

export default function EncounterBuilderPanel({ onClose, onBroadcast }) {
  const [collapsed, setCollapsed] = useState(false);
  const [partySize, setPartySize] = useState(() => parseInt(localStorage.getItem('eb_partySize')) || 4);
  const [partyLevel, setPartyLevel] = useState(() => parseInt(localStorage.getItem('eb_partyLevel')) || 3);
  const [monsters, setMonsters] = useState([]);
  const [addCR, setAddCR] = useState('1');
  const [suggestions, setSuggestions] = useState(null);
  const [selectedCR, setSelectedCR] = useState(null);

  useEffect(() => { localStorage.setItem('eb_partySize', partySize); }, [partySize]);
  useEffect(() => { localStorage.setItem('eb_partyLevel', partyLevel); }, [partyLevel]);

  const partyLevels = Array(partySize).fill(partyLevel);
  const monsterCRs = monsters.map(m => m.cr);
  const calc = monsters.length > 0 ? calculateEncounterDifficulty(partyLevels, monsterCRs) : null;

  const addMonster = () => {
    setMonsters(prev => [...prev, { cr: addCR, id: Date.now() }]);
    setSelectedCR(addCR);
  };
  const removeMonster = (id) => setMonsters(prev => prev.filter(m => m.id !== id));

  const quickGenerate = (diff) => {
    const result = generateBalancedEncounter(partyLevels, diff);
    setSuggestions(result);
  };

  const quickMonsters = selectedCR ? getQuickMonsters(selectedCR) : [];

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={headerStyle} onClick={() => setCollapsed(c => !c)}>
        <div style={headerTitle}><Swords size={14} />Encounter Builder</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ChevronDown size={14} style={{
            color: 'rgba(255,255,255,0.4)',
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }} />
          {onClose && <X size={14}
            style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); onClose(); }}
          />}
        </div>
      </div>

      {!collapsed && (
        <div style={bodyStyle}>
          {/* Party Setup */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <div style={label}>Party Size</div>
              <input type="number" min={1} max={8} value={partySize}
                onChange={e => setPartySize(Math.max(1, Math.min(8, +e.target.value || 1)))}
                style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={label}>Avg Level</div>
              <input type="number" min={1} max={20} value={partyLevel}
                onChange={e => setPartyLevel(Math.max(1, Math.min(20, +e.target.value || 1)))}
                style={inputStyle} />
            </div>
          </div>

          {/* Add Monster */}
          <div>
            <div style={label}>Add Monster by CR</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <select value={addCR} onChange={e => setAddCR(e.target.value)}
                style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}>
                {CRS.map(cr => (
                  <option key={cr} value={cr}>CR {cr} ({(CR_TO_XP[cr] || 0).toLocaleString()} XP)</option>
                ))}
              </select>
              <button onClick={addMonster} style={{
                ...btnBase, padding: '6px 10px',
                background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.3)', color: '#c084fc',
              }}><Plus size={14} /></button>
            </div>
          </div>

          {/* Monster List */}
          {monsters.length > 0 && (
            <div style={cardStyle}>
              {monsters.map(m => (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '4px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)',
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text)', fontWeight: 600 }}>
                    CR {m.cr}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
                      {(CR_TO_XP[m.cr] || 0).toLocaleString()} XP
                    </span>
                    <Trash2 size={12} style={{ color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}
                      onClick={() => removeMonster(m.id)} />
                  </div>
                </div>
              ))}

              {/* Difficulty Result */}
              {calc && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                      background: `${DIFF_COLORS[calc.difficulty]}20`,
                      border: `1px solid ${DIFF_COLORS[calc.difficulty]}50`,
                      color: DIFF_COLORS[calc.difficulty],
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>{calc.difficulty}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                      x{calc.multiplier} multiplier
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
                    <span>Total: <b style={{ color: 'var(--text)' }}>{calc.totalXP.toLocaleString()}</b> XP</span>
                    <span>Adj: <b style={{ color: 'var(--text)' }}>{calc.adjustedXP.toLocaleString()}</b> XP</span>
                    <span>Per player: <b style={{ color: '#c084fc' }}>{calc.xpPerPlayer.toLocaleString()}</b> XP</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Generate */}
          <div>
            <div style={label}><Zap size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />Quick Generate</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['easy','medium','hard','deadly'].map(d => (
                <button key={d} onClick={() => quickGenerate(d)} style={{
                  ...btnBase, flex: 1, padding: '6px 0',
                  background: `${DIFF_COLORS[d.charAt(0).toUpperCase()+d.slice(1)]}15`,
                  border: `1px solid ${DIFF_COLORS[d.charAt(0).toUpperCase()+d.slice(1)]}40`,
                  color: DIFF_COLORS[d.charAt(0).toUpperCase()+d.slice(1)],
                  textTransform: 'capitalize',
                }}>{d}</button>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {suggestions && suggestions.suggestions.length > 0 && (
            <div style={cardStyle}>
              <div style={{ fontSize: '10px', color: '#c9a84c', fontWeight: 600, textTransform: 'uppercase' }}>
                {suggestions.targetDifficulty} suggestions ({suggestions.targetXP.toLocaleString()} XP budget)
              </div>
              {suggestions.suggestions.map((s, i) => (
                <div key={i} style={{
                  padding: '6px 8px', borderRadius: '5px', background: 'rgba(255,255,255,0.03)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text)', fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
                    {s.totalXP.toLocaleString()} XP
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Monster Templates */}
          {quickMonsters.length > 0 && (
            <div style={cardStyle}>
              <div style={{ fontSize: '10px', color: '#c9a84c', fontWeight: 600, textTransform: 'uppercase' }}>
                CR {selectedCR} Monster Templates
              </div>
              {quickMonsters.map((m, i) => (
                <div key={i} style={{
                  padding: '6px 8px', borderRadius: '5px', background: 'rgba(255,255,255,0.03)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text)', fontWeight: 700 }}>{m.name}</span>
                    <span style={{
                      fontSize: '9px', padding: '1px 6px', borderRadius: '3px',
                      background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.2)',
                      color: '#c084fc', fontWeight: 600,
                    }}>{m.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>
                    <span>AC <b style={{ color: 'var(--text)' }}>{m.ac}</b></span>
                    <span>HP <b style={{ color: 'var(--text)' }}>{m.hp}</b></span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                    {m.attacks}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
