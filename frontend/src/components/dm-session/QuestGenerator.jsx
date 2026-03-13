import { useState } from 'react';
import { Wand2, Loader, BookOpen, Plus } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

export default function QuestGenerator() {
  const [prompt, setPrompt] = useState('');
  const [partyLevel, setPartyLevel] = useState(3);
  const [setting, setSetting] = useState('');
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error('Enter a quest theme'); return; }
    setGenerating(true);
    try {
      const md = await invoke('generate_quest', {
        prompt: prompt.trim(),
        partyLevel,
        setting: setting.trim(),
      });
      setResult(md);
    } catch (e) {
      const msg = typeof e === 'string' ? e : e?.message || 'Quest generation failed';
      if (msg.includes('Failed to reach Ollama') || msg.includes('connection refused')) {
        toast.error('Ollama is not running. Start Ollama to use AI quest generation.');
      } else {
        toast.error(msg);
      }
      console.error(e);
    } finally { setGenerating(false); }
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '6px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text)', fontSize: '13px',
    fontFamily: 'var(--font-ui)', outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--text-mute)',
        fontFamily: 'var(--font-mono, monospace)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Wand2 size={12} /> AI Quest Generator
      </div>

      <div style={{ padding: '12px' }}>
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text" value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Quest theme (e.g., cursed dungeon, dragon's hoard, lost artifact)"
            style={inputStyle}
            onKeyDown={e => { if (e.key === 'Enter' && !generating) handleGenerate(); }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <div style={{ flex: '0 0 120px' }}>
            <label style={{
              fontSize: '10px', color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)', display: 'block', marginBottom: '3px',
            }}>Party Level</label>
            <input
              type="number" value={partyLevel} min={1} max={20}
              onChange={e => setPartyLevel(parseInt(e.target.value) || 1)}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{
              fontSize: '10px', color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)', display: 'block', marginBottom: '3px',
            }}>Setting (optional)</label>
            <input
              type="text" value={setting}
              onChange={e => setSetting(e.target.value)}
              placeholder="e.g., Forgotten Realms, dark fantasy"
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', borderRadius: '8px',
            background: prompt.trim() && !generating
              ? 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(124,58,237,0.15))'
              : 'rgba(155,89,182,0.05)',
            border: '1px solid rgba(155,89,182,0.3)',
            color: prompt.trim() && !generating ? '#c084fc' : 'rgba(192,132,252,0.3)',
            fontSize: '13px', fontWeight: 600,
            cursor: prompt.trim() && !generating ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
          }}
        >
          {generating ? (
            <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
          ) : (
            <><Wand2 size={14} /> Generate Quest</>
          )}
        </button>

        {result && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(155,89,182,0.15)',
            borderRadius: '8px',
            maxHeight: '400px', overflowY: 'auto',
          }}>
            <div style={{
              whiteSpace: 'pre-wrap',
              fontSize: '12px', lineHeight: 1.6,
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-ui)',
            }}>
              {result}
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => toast('Add to Campaign coming soon!')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 12px', borderRadius: '6px',
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  color: '#4ade80', fontSize: '11px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <Plus size={11} /> Add to Campaign
              </button>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(result);
                    toast.success('Copied to clipboard');
                  } catch { toast.error('Failed to copy'); }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 12px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-dim)', fontSize: '11px',
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <BookOpen size={11} /> Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
