import { useState, useMemo } from 'react';
import {
  User, Scroll, Moon, Scale, Shield, Puzzle, TreePine, Lightbulb,
  RefreshCw, Send, X, Dices,
} from 'lucide-react';
import { generateCulturalName, getCultureOptions } from '../../data/culturalNames';
import { generateSideQuest, getEnvironmentalDetail, getAllLocationTypes } from '../../data/storyPrompts';
import { generateDream, getDreamTypes } from '../../data/dreamVisions';
import { generateDilemma, getDilemmaThemes } from '../../data/moralDilemmas';
import { generateTrap } from '../../data/trapTemplates';
import { generatePuzzle, getPuzzleDifficulties } from '../../data/puzzleGenerator';
import { generateLightingDescription, getLightingSources } from '../../data/lightingDescriptions';

/* ─── constants ───────────────────────────────────────────────── */

const PURPLE = '#c084fc';
const GOLD   = '#c9a84c';

const TABS = [
  { id: 'names',    label: 'Names',    icon: User },
  { id: 'quests',   label: 'Quests',   icon: Scroll },
  { id: 'dreams',   label: 'Dreams',   icon: Moon },
  { id: 'dilemmas', label: 'Dilemmas', icon: Scale },
  { id: 'traps',    label: 'Traps',    icon: Shield },
  { id: 'puzzles',  label: 'Puzzles',  icon: Puzzle },
  { id: 'details',  label: 'Details',  icon: TreePine },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb },
];

/* ─── shared styles ───────────────────────────────────────────── */

const selectStyle = {
  padding: '5px 8px',
  borderRadius: '6px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text)',
  fontSize: '11px',
  fontFamily: 'var(--font-ui)',
  outline: 'none',
  cursor: 'pointer',
  flex: 1,
  minWidth: 0,
};

const labelStyle = {
  fontSize: '10px',
  color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: 600,
  marginBottom: 2,
};

const btnBase = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '5px 10px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  fontSize: '11px',
  fontFamily: 'var(--font-ui)',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s, border-color 0.15s',
};

const generateBtn = {
  ...btnBase,
  background: `${PURPLE}22`,
  borderColor: `${PURPLE}44`,
  color: PURPLE,
};

const broadcastBtn = {
  ...btnBase,
  background: `${GOLD}22`,
  borderColor: `${GOLD}44`,
  color: GOLD,
};

const resultCard = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '10px',
  marginTop: '8px',
  fontFamily: 'var(--font-ui)',
  fontSize: '12px',
  lineHeight: 1.5,
  color: 'var(--text)',
};

const resultTitle = {
  fontSize: '13px',
  fontWeight: 700,
  color: PURPLE,
  marginBottom: '6px',
  fontFamily: 'var(--font-ui)',
};

const resultMono = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--text-mute)',
  marginTop: '4px',
};

const fieldRow = {
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
  marginBottom: '6px',
};

/* ─── tab content renderers ───────────────────────────────────── */

function NamesTab({ result, setResult, onBroadcast }) {
  const [culture, setCulture] = useState('northern');
  const [gender, setGender]   = useState('any');
  const cultures = useMemo(() => getCultureOptions(), []);

  const generate = () => setResult(generateCulturalName(culture, gender));

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
        <div>
          <div style={labelStyle}>Culture</div>
          <select style={selectStyle} value={culture} onChange={e => setCulture(e.target.value)}>
            {cultures.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>Gender</div>
          <select style={selectStyle} value={gender} onChange={e => setGender(e.target.value)}>
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      <div style={fieldRow}>
        <button style={generateBtn} onClick={generate}><Dices size={13} /> Generate</button>
        {result && <button style={broadcastBtn} onClick={() => onBroadcast?.({ type: 'name', data: result })}><Send size={12} /> Broadcast</button>}
      </div>
      {result && (
        <div style={resultCard}>
          <div style={resultTitle}>{result.full}</div>
          <div style={resultMono}>Culture: {result.culture}</div>
        </div>
      )}
    </div>
  );
}

function QuestsTab({ result, setResult, onBroadcast }) {
  const [level, setLevel] = useState(3);

  const generate = () => setResult(generateSideQuest(level));

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <div style={labelStyle}>Party Level</div>
        <input
          type="number" min={1} max={20} value={level}
          onChange={e => setLevel(Number(e.target.value))}
          style={{ ...selectStyle, width: '60px', flex: 'none' }}
        />
      </div>
      <div style={fieldRow}>
        <button style={generateBtn} onClick={generate}><Dices size={13} /> Generate</button>
        {result && <button style={broadcastBtn} onClick={() => onBroadcast?.({ type: 'quest', data: result })}><Send size={12} /> Broadcast</button>}
      </div>
      {result && (
        <div style={resultCard}>
          <div style={resultTitle}>{result.title}</div>
          <div style={{ marginBottom: '4px' }}><strong>Hook:</strong> {result.hook}</div>
          <div style={{ marginBottom: '4px' }}><strong>Complication:</strong> {result.complication}</div>
          <div style={resultMono}>Level {result.level} &middot; Reward: {result.reward}</div>
        </div>
      )}
    </div>
  );
}

function DreamsTab({ result, setResult, onBroadcast }) {
  const [dreamType, setDreamType] = useState('');
  const types = useMemo(() => getDreamTypes(), []);

  const generate = () => setResult(generateDream(dreamType || null));

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <div style={labelStyle}>Dream Type</div>
        <select style={selectStyle} value={dreamType} onChange={e => setDreamType(e.target.value)}>
          <option value="">Random</option>
          {types.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>
      <div style={fieldRow}>
        <button style={generateBtn} onClick={generate}><Dices size={13} /> Generate</button>
        {result && <button style={broadcastBtn} onClick={() => onBroadcast?.({ type: 'dream', data: result })}><Send size={12} /> Broadcast</button>}
      </div>
      {result && (
        <div style={resultCard}>
          <div style={resultTitle}>{result.type}</div>
          <div style={{ marginBottom: '6px', fontStyle: 'italic' }}>{result.text}</div>
          <div style={resultMono}>Effect: {result.mechanicalEffect}</div>
        </div>
      )}
    </div>
  );
}

function DilemmasTab({ result, setResult, onBroadcast }) {
  const [theme, setTheme] = useState('');
  const themes = useMemo(() => getDilemmaThemes(), []);

  const generate = () => setResult(generateDilemma(theme ? [theme] : []));

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <div style={labelStyle}>Theme</div>
        <select style={selectStyle} value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="">Any</option>
          {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>
      <div style={fieldRow}>
        <button style={generateBtn} onClick={generate}><Dices size={13} /> Generate</button>
        {result && <button style={broadcastBtn} onClick={() => onBroadcast?.({ type: 'dilemma', data: result })}><Send size={12} /> Broadcast</button>}
      </div>
      {result && (
        <div style={resultCard}>
          <div style={resultTitle}>{result.title}</div>
          <div style={{ marginBottom: '6px' }}>{result.setup}</div>
          <div style={{ marginBottom: '3px', color: '#60a5fa', fontSize: '11px' }}>A: {result.choice_a}</div>
          <div style={{ marginBottom: '3px', color: '#f59e0b', fontSize: '11px' }}>B: {result.choice_b}</div>
          <div style={resultMono}>{result.stakes}</div>
        </div>
      )}
    </div>
  );
}

function TrapsTab({ result, setResult, onBroadcast }) {
  const [cr, setCr] = useState('');
  const crOptions = ['0', '0-1', '1-2', '1-3', '2-4', '3-5'];

  const generate = () => setResult(generateTrap(cr || null));

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <div style={labelStyle}>CR Range</div>
        <select style={selectStyle} value={cr} onChange={e => setCr(e.target.value)}>
          <option value="">Any</option>
          {crOptions.map(c => <option key={c} value={c}>CR {c}</option>)}
        </select>
      </div>
      <div style={fieldRow}>
        <button style={generateBtn} onClick={generate}><Dices size={13} /> Generate</button>
        {result && <button style={broadcastBtn} onClick={() => onBroadcast?.({ type: 'trap', data: result })}><Send size={12} /> Broadcast</button>}
      </div>
      {result && (
        <div style={resultCard}>
          <div style={resultTitle}>{result.name} <span style={{ color: 'var(--text-mute)', fontWeight: 400, fontSize: '11px' }}>(CR {result.cr})</span></div>
          <div style={{ marginBottom: '3px', fontSize: '11px' }}><strong>Trigger:</strong> {result.trigger}</div>
          <div style={{ marginBottom: '3px', fontSize: '11px' }}><strong>Effect:</strong> {result.effect}</div>
          <div style={{ marginBottom: '3px', fontSize: '11px' }}><strong>Save:</strong> {result.save}</div>
          <div style={{ marginBottom: '3px', fontSize: '11px' }}><strong>Detect:</strong> {result.detection}</div>
          <div style={{ marginBottom: '3px', fontSize: '11px' }}><strong>Disarm:</strong> {result.disarm}</div>
          <div style={resultMono}>Variant: {result.variant}</div>
        </div>
      )}
    </div>
  );
}

function PuzzlesTab({ result, setResult, onBroadcast }) {
  const [difficulty, setDifficulty] = useState('');
  const difficulties = useMemo(() => getPuzzleDifficulties(), []);

  const generate = () => setResult(generatePuzzle(difficulty || null));

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <div style={labelStyle}>Difficulty</div>
        <select style={selectStyle} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="">Any</option>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={fieldRow}>
        <button style={generateBtn} onClick={generate}><Dices size={13} /> Generate</button>
        {result && <button style={broadcastBtn} onClick={() => onBroadcast?.({ type: 'puzzle', data: result })}><Send size={12} /> Broadcast</button>}
      </div>
      {result && (
        <div style={resultCard}>
          <div style={resultTitle}>{result.title} <span style={{ color: 'var(--text-mute)', fontWeight: 400, fontSize: '11px' }}>({result.difficulty})</span></div>
          <div style={{ marginBottom: '6px' }}>{result.setup}</div>
          <div style={{ marginBottom: '4px', fontSize: '11px' }}>
            <strong>Clues:</strong>
            <ul style={{ margin: '2px 0 0 14px', padding: 0 }}>
              {result.clues.map((c, i) => <li key={i} style={{ marginBottom: '2px' }}>{c}</li>)}
            </ul>
          </div>
          <div style={{ marginBottom: '3px', fontSize: '11px' }}><strong>Solution:</strong> {result.solution}</div>
          <div style={resultMono}>
            Checks: {result.skillChecks.join(' | ')}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailsTab({ result, setResult, onBroadcast }) {
  const [location, setLocation] = useState('dungeon');
  const locations = useMemo(() => getAllLocationTypes(), []);

  const generate = () => setResult(getEnvironmentalDetail(location));

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <div style={labelStyle}>Location Type</div>
        <select style={selectStyle} value={location} onChange={e => setLocation(e.target.value)}>
          {locations.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
        </select>
      </div>
      <div style={fieldRow}>
        <button style={generateBtn} onClick={generate}><Dices size={13} /> Generate</button>
        {result && <button style={broadcastBtn} onClick={() => onBroadcast?.({ type: 'detail', data: result })}><Send size={12} /> Broadcast</button>}
      </div>
      {result && (
        <div style={resultCard}>
          <div style={resultTitle}>Environmental Detail</div>
          <div style={{ fontStyle: 'italic' }}>{result}</div>
        </div>
      )}
    </div>
  );
}

function LightingTab({ result, setResult, onBroadcast }) {
  const [source, setSource] = useState('torchlight');
  const sources = useMemo(() => getLightingSources(), []);

  const generate = () => setResult({ source: sources.find(s => s.id === source)?.label || source, text: generateLightingDescription(source) });

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <div style={labelStyle}>Light Source</div>
        <select style={selectStyle} value={source} onChange={e => setSource(e.target.value)}>
          {sources.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
      <div style={fieldRow}>
        <button style={generateBtn} onClick={generate}><Dices size={13} /> Generate</button>
        {result && <button style={broadcastBtn} onClick={() => onBroadcast?.({ type: 'lighting', data: result })}><Send size={12} /> Broadcast</button>}
      </div>
      {result && (
        <div style={resultCard}>
          <div style={resultTitle}>{result.source}</div>
          <div style={{ fontStyle: 'italic' }}>{result.text}</div>
        </div>
      )}
    </div>
  );
}

/* ─── tab content map ─────────────────────────────────────────── */

const TAB_COMPONENTS = {
  names:    NamesTab,
  quests:   QuestsTab,
  dreams:   DreamsTab,
  dilemmas: DilemmasTab,
  traps:    TrapsTab,
  puzzles:  PuzzlesTab,
  details:  DetailsTab,
  lighting: LightingTab,
};

/* ─── main component ──────────────────────────────────────────── */

export default function DMToolkit({ onBroadcast, onClose }) {
  const [activeTab, setActiveTab] = useState('names');
  const [results, setResults]     = useState({});

  const setTabResult = (tabId) => (value) => {
    setResults(prev => ({ ...prev, [tabId]: value }));
  };

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div style={{
      background: 'var(--bg-surface, #1a1a2e)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      fontFamily: 'var(--font-ui)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      maxHeight: '100%',
    }}>
      {/* header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: PURPLE }}>
          DM Toolkit
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-mute)',
              cursor: 'pointer', padding: '2px', display: 'flex',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* tab bar — scrollable row of mini-tabs */}
      <div style={{
        display: 'flex',
        gap: '2px',
        padding: '6px 6px 0',
        overflowX: 'auto',
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '6px',
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '4px 7px',
                borderRadius: '5px',
                border: active ? `1px solid ${PURPLE}66` : '1px solid transparent',
                background: active ? `${PURPLE}18` : 'transparent',
                color: active ? PURPLE : 'var(--text-mute)',
                fontSize: '10px',
                fontFamily: 'var(--font-ui)',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={11} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* tab content */}
      <div style={{
        padding: '10px',
        overflowY: 'auto',
        flex: 1,
      }}>
        <ActiveComponent
          result={results[activeTab] ?? null}
          setResult={setTabResult(activeTab)}
          onBroadcast={onBroadcast}
        />
      </div>
    </div>
  );
}
