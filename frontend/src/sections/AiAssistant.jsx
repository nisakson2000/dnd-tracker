import { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, HelpCircle, X, Check, Loader2, AlertCircle, Zap, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { streamChat, checkOllamaStatus, listModels } from '../api/assistant';
import { buildSystemPrompt, buildMessages } from '../data/assistantContext';

const SETTINGS_KEY = 'codex-assistant-settings';
const HISTORY_KEY = 'codex-assistant-history';

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { enabled: false, model: 'phi3.5' };
  } catch { return { enabled: false, model: 'phi3.5' }; }
}

function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
}

function loadHistory(characterId) {
  try {
    const raw = sessionStorage.getItem(`${HISTORY_KEY}-${characterId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(characterId, history) {
  try {
    // Keep last 20 messages
    const trimmed = history.slice(-20);
    sessionStorage.setItem(`${HISTORY_KEY}-${characterId}`, JSON.stringify(trimmed));
  } catch {}
}

const EXAMPLE_PROMPTS = [
  "How do I add a spell to my spellbook?",
  "What does my Spell Save DC mean?",
  "Add Mage Armor to my spell list as a level 1 spell",
  "How many spell slots do I have at my level?",
  "What happens when I reach 0 HP?",
  "Explain what concentration means",
  "Fill in my saving throw proficiencies for a Wizard",
  "What's the average damage of Fireball?",
  "How does point buy work?",
  "What racial traits does a High Elf get?",
];

// Parse action blocks from assistant response
function parseAction(text) {
  const match = text.match(/```action\s*\n?([\s\S]*?)\n?```/);
  if (!match) return { displayText: text, action: null };
  const displayText = text.replace(/```action\s*\n?[\s\S]*?\n?```/, '').trim();
  try {
    const action = JSON.parse(match[1].trim());
    return { displayText, action };
  } catch {
    return { displayText: text, action: null };
  }
}

// Simple markdown-ish rendering for assistant messages
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('### ')) return <h4 key={i} style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: 13, marginTop: 8, marginBottom: 4 }}>{line.slice(4)}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: 14, marginTop: 10, marginBottom: 4 }}>{line.slice(3)}</h3>;
    if (line.startsWith('# ')) return <h2 key={i} style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: 15, marginTop: 12, marginBottom: 4 }}>{line.slice(2)}</h2>;
    if (line.match(/^\s*[-*]\s/)) {
      const content = line.replace(/^\s*[-*]\s/, '');
      return <li key={i} style={{ marginLeft: 16, listStyle: 'disc', color: 'var(--text-sub)', fontSize: 13, lineHeight: 1.6 }}>{renderInline(content)}</li>;
    }
    if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
    return <p key={i} style={{ color: 'var(--text-sub)', fontSize: 13, lineHeight: 1.6, margin: '2px 0' }}>{renderInline(line)}</p>;
  });
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function SetupPanel({ settings, onUpdate, onEnable }) {
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(false);
  const [models, setModels] = useState([]);

  const checkStatus = async () => {
    setChecking(true);
    const result = await checkOllamaStatus(settings.model);
    setStatus(result);
    if (result.available) {
      const modelList = await listModels();
      setModels(modelList);
    }
    setChecking(false);
  };

  useEffect(() => { checkStatus(); }, []);

  const canEnable = status?.available && status?.modelInstalled;

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(201,168,76,0.15))',
          border: '1px solid rgba(139,92,246,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={18} style={{ color: 'rgba(139,92,246,0.7)' }} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(20px * var(--font-scale, 1))', fontWeight: 700, color: 'var(--text)', margin: 0 }}>Arcane Advisor</h2>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>AI-powered D&D companion — runs entirely on your machine</p>
        </div>
      </div>

      {/* Status */}
      <div style={{
        padding: 16, borderRadius: 10,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Connection Status</span>
          <button
            onClick={checkStatus}
            disabled={checking}
            style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 11,
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
              color: 'rgba(201,168,76,0.7)', cursor: 'pointer', fontFamily: 'var(--font-display)',
            }}
          >
            {checking ? 'Checking...' : 'Test Connection'}
          </button>
        </div>

        {status === null ? (
          <div style={{ color: 'var(--text-mute)', fontSize: 13 }}>Checking Ollama status...</div>
        ) : status.available ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.4)' }} />
              <span style={{ fontSize: 13, color: '#22c55e' }}>Ollama is running</span>
            </div>
            {status.modelInstalled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.4)' }} />
                <span style={{ fontSize: 13, color: '#22c55e' }}>Model "{settings.model}" ready</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ fontSize: 13, color: '#f59e0b' }}>Model "{settings.model}" not installed</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: 13, color: '#ef4444' }}>Ollama is not running</span>
          </div>
        )}
      </div>

      {/* Model selector */}
      {status?.available && (
        <div style={{
          padding: 16, borderRadius: 10,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          marginBottom: 16,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Model</div>
          {models.length > 0 ? (
            <select
              value={settings.model}
              onChange={e => {
                const next = { ...settings, model: e.target.value };
                onUpdate(next);
                checkStatus();
              }}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 8, fontSize: 13,
                background: 'var(--bg-input, rgba(0,0,0,0.3))', border: '1px solid var(--border)',
                color: 'var(--text)', fontFamily: 'var(--font-ui)', outline: 'none', cursor: 'pointer',
              }}
            >
              {models.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text-mute)' }}>
              No models detected. Install one with: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>ollama pull phi3.5</code>
            </div>
          )}
        </div>
      )}

      {/* Setup guide */}
      {(!status?.available || !status?.modelInstalled) && (
        <div style={{
          padding: 16, borderRadius: 10,
          background: 'rgba(139,92,246,0.04)',
          border: '1px solid rgba(139,92,246,0.15)',
          marginBottom: 16,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text)', marginBottom: 10 }}>Setup Guide</div>
          <ol style={{ paddingLeft: 20, fontSize: 13, color: 'var(--text-sub)', lineHeight: 2 }}>
            {!status?.available && (
              <>
                <li>Download Ollama from <span style={{ color: 'var(--accent-l)' }}>https://ollama.ai</span></li>
                <li>Install and start it</li>
              </>
            )}
            <li>Open a terminal and run: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>ollama pull phi3.5</code></li>
            <li>Come back here and click "Test Connection"</li>
          </ol>
          <p style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 10, fontStyle: 'italic' }}>
            The AI runs entirely on your machine — no internet required after setup.
            On lower-end hardware, responses may take 5–15 seconds.
          </p>
        </div>
      )}

      {/* Enable button */}
      <button
        onClick={() => {
          const next = { ...settings, enabled: true };
          onUpdate(next);
          onEnable();
        }}
        disabled={!canEnable}
        style={{
          width: '100%', padding: '12px 0', borderRadius: 10, fontSize: 13,
          fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.05em',
          cursor: canEnable ? 'pointer' : 'not-allowed',
          background: canEnable ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(201,168,76,0.3))' : 'rgba(255,255,255,0.03)',
          border: canEnable ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border)',
          color: canEnable ? 'var(--text)' : 'var(--text-mute)',
          transition: 'all 0.2s',
        }}
      >
        <Sparkles size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
        {canEnable ? 'Enable Arcane Advisor' : 'Complete setup to enable'}
      </button>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '8px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(139,92,246,0.5)' }}
        />
      ))}
    </div>
  );
}

export default function AiAssistant({ characterId, character }) {
  const [settings, setSettings] = useState(() => loadSettings());
  const [enabled, setEnabled] = useState(settings.enabled);
  const [messages, setMessages] = useState(() => loadHistory(characterId));
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [charData, setCharData] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [applyingAction, setApplyingAction] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Load full character data for context
  useEffect(() => {
    if (!characterId || !enabled) return;
    invoke('export_character', { characterId })
      .then(setCharData)
      .catch(err => console.error('Failed to load character context:', err));
  }, [characterId, enabled]);

  // Save history when it changes
  useEffect(() => {
    if (characterId && messages.length > 0) {
      saveHistory(characterId, messages);
    }
  }, [characterId, messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const updateSettings = (next) => {
    setSettings(next);
    saveSettings(next);
  };

  const handleSend = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || streaming) return;

    setInput('');
    setShowHints(false);
    setPendingAction(null);

    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setStreaming(true);

    try {
      const systemPrompt = buildSystemPrompt(charData);
      const apiMessages = buildMessages(systemPrompt, messages, msg);

      let fullResponse = '';
      const assistantMsg = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMsg]);

      for await (const chunk of streamChat(settings.model, apiMessages)) {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: fullResponse };
          return updated;
        });
      }

      // Parse for actions
      const { displayText, action } = parseAction(fullResponse);
      if (action) {
        setPendingAction(action);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: displayText };
          return updated;
        });
      }
    } catch (err) {
      const errorMsg = err.message?.includes('Failed to fetch')
        ? 'The Arcane Advisor is offline. Make sure Ollama is running.'
        : err.message?.includes('timeout')
          ? 'Response timed out. The model may be overloaded — try again.'
          : `Error: ${err.message}`;
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg, isError: true }]);
      toast.error('Assistant error');
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming, charData, settings.model]);

  const handleApplyAction = async () => {
    if (!pendingAction || applyingAction) return;
    setApplyingAction(true);

    try {
      const { action, data } = pendingAction;
      switch (action) {
        case 'add_spell':
          await invoke('add_spell', { characterId, payload: {
            name: data.name || '',
            level: data.level ?? 0,
            school: data.school || '',
            casting_time: data.casting_time || '1 action',
            spell_range: data.range || data.spell_range || '',
            components: data.components || '',
            material: data.material || '',
            duration: data.duration || '',
            concentration: data.concentration || false,
            ritual: data.ritual || false,
            description: data.description || '',
            upcast_notes: data.upcast_notes || '',
            prepared: data.prepared ?? true,
            source: data.source || 'AI Assistant',
          }});
          toast.success(`Added spell: ${data.name}`);
          break;
        case 'update_overview':
          await invoke('update_overview', { characterId, payload: data });
          toast.success('Character updated');
          break;
        case 'add_feature':
          await invoke('add_feature', { characterId, payload: {
            name: data.name || '',
            source: data.source || '',
            source_level: data.source_level ?? 1,
            feature_type: data.feature_type || 'class',
            description: data.description || '',
            uses_total: data.uses_total ?? 0,
            uses_remaining: data.uses_remaining ?? data.uses_total ?? 0,
            recharge: data.recharge || 'none',
          }});
          toast.success(`Added feature: ${data.name}`);
          break;
        case 'add_item':
          await invoke('add_item', { characterId, payload: {
            name: data.name || '',
            item_type: data.item_type || 'gear',
            weight: data.weight ?? 0,
            value_gp: data.value_gp ?? 0,
            quantity: data.quantity ?? 1,
            description: data.description || '',
            attunement: data.attunement || false,
            attuned: false,
            equipped: false,
            equipment_slot: data.equipment_slot || '',
          }});
          toast.success(`Added item: ${data.name}`);
          break;
        case 'add_npc':
          await invoke('add_npc', { characterId, payload: {
            name: data.name || '',
            role: data.role || 'neutral',
            race: data.race || '',
            npc_class: data.npc_class || '',
            location: data.location || '',
            description: data.description || '',
            notes: data.notes || '',
            status: data.status || 'alive',
          }});
          toast.success(`Added NPC: ${data.name}`);
          break;
        default:
          toast.error(`Unknown action: ${action}`);
      }

      setPendingAction(null);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Changes applied successfully.' }]);
      // Refresh character data
      invoke('export_character', { characterId }).then(setCharData).catch(() => {});
    } catch (err) {
      toast.error(`Failed to apply: ${err.message}`);
    } finally {
      setApplyingAction(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setPendingAction(null);
    sessionStorage.removeItem(`${HISTORY_KEY}-${characterId}`);
    toast.success('Conversation cleared');
  };

  if (!enabled) {
    return <SetupPanel settings={settings} onUpdate={updateSettings} onEnable={() => setEnabled(true)} />;
  }

  return (
    <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(201,168,76,0.2))',
            border: '1px solid rgba(139,92,246,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} style={{ color: 'rgba(139,92,246,0.8)' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(18px * var(--font-scale, 1))', fontWeight: 700, color: 'var(--text)', margin: 0 }}>Arcane Advisor</h2>
            {character && (
              <p style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 1 }}>
                Advising on: {character.name} ({character.primary_class}{character.level ? ` ${character.level}` : ''})
              </p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setShowHints(!showHints)}
            title="Example prompts"
            style={{
              padding: '6px 10px', borderRadius: 6, fontSize: 11,
              background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
              color: 'rgba(139,92,246,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <HelpCircle size={12} /> Tips
          </button>
          <button
            onClick={clearConversation}
            title="Clear conversation"
            style={{
              padding: '6px 10px', borderRadius: 6, fontSize: 11,
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              color: 'var(--text-mute)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Trash2 size={12} /> Clear
          </button>
          <button
            onClick={() => { updateSettings({ ...settings, enabled: false }); setEnabled(false); }}
            title="Disable assistant"
            style={{
              padding: '6px 10px', borderRadius: 6, fontSize: 11,
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              color: 'var(--text-mute)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Hints panel */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 12, flexShrink: 0 }}
          >
            <div style={{
              padding: 12, borderRadius: 10,
              background: 'rgba(139,92,246,0.04)',
              border: '1px solid rgba(139,92,246,0.12)',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'rgba(139,92,246,0.6)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>What can I ask?</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {EXAMPLE_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => { setShowHints(false); handleSend(prompt); }}
                    style={{
                      padding: '5px 10px', borderRadius: 6, fontSize: 11,
                      background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)',
                      color: 'var(--text-sub)', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.color = 'var(--text)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; e.currentTarget.style.color = 'var(--text-sub)'; }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', marginBottom: 12,
        padding: '12px 4px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {messages.length === 0 && !streaming && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-mute)' }}>
            <Sparkles size={32} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
            <p style={{ fontSize: 13, marginBottom: 6 }}>The Arcane Advisor awaits your query.</p>
            <p style={{ fontSize: 11, opacity: 0.5 }}>Ask about D&D rules, your character, or how to use the app.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08))'
                : msg.isError
                  ? 'rgba(239,68,68,0.08)'
                  : 'rgba(139,92,246,0.06)',
              border: msg.role === 'user'
                ? '1px solid rgba(201,168,76,0.2)'
                : msg.isError
                  ? '1px solid rgba(239,68,68,0.15)'
                  : '1px solid rgba(139,92,246,0.1)',
            }}>
              {msg.role === 'user' ? (
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>{msg.content}</p>
              ) : (
                <div>{renderMarkdown(msg.content)}</div>
              )}
              {msg.isError && <AlertCircle size={12} style={{ color: '#ef4444', marginTop: 4 }} />}
            </div>
          </motion.div>
        ))}

        {streaming && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px', borderRadius: '12px 12px 12px 4px',
              background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)',
            }}>
              <TypingIndicator />
            </div>
          </div>
        )}

        {/* Action confirmation */}
        {pendingAction && !streaming && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 12, borderRadius: 10,
              background: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>
              <Zap size={12} style={{ display: 'inline', marginRight: 6, color: '#22c55e', verticalAlign: 'middle' }} />
              Ready to apply: <strong style={{ color: 'var(--text)' }}>{pendingAction.action.replace(/_/g, ' ')}</strong>
              {pendingAction.data?.name && ` — ${pendingAction.data.name}`}
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                onClick={handleApplyAction}
                disabled={applyingAction}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                  color: '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                {applyingAction ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                Apply
              </button>
              <button
                onClick={() => setPendingAction(null)}
                style={{
                  padding: '6px 10px', borderRadius: 6, fontSize: 11,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                  color: 'var(--text-mute)', cursor: 'pointer',
                }}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        display: 'flex', gap: 8, flexShrink: 0,
        padding: '12px 0 0',
        borderTop: '1px solid var(--border)',
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask the Arcane Advisor..."
          disabled={streaming}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 10, fontSize: 13,
            background: 'var(--bg-input, rgba(0,0,0,0.3))', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-ui)', outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.4)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || streaming}
          style={{
            padding: '10px 16px', borderRadius: 10,
            background: input.trim() && !streaming ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(201,168,76,0.2))' : 'rgba(255,255,255,0.03)',
            border: input.trim() && !streaming ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--border)',
            color: input.trim() && !streaming ? 'var(--text)' : 'var(--text-mute)',
            cursor: input.trim() && !streaming ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.2s',
          }}
        >
          {streaming ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </div>
    </div>
  );
}
