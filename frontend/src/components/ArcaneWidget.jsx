import { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, X, Loader2, AlertCircle, Zap, Check, Minimize2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { streamChat, searchWikiContext } from '../api/assistant';
import { buildSectionPrompt, buildMessages } from '../data/assistantContext';

const SETTINGS_KEY = 'codex-assistant-settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { enabled: false, model: 'phi3.5' };
  } catch { return { enabled: false, model: 'phi3.5' }; }
}

// Section-specific quick prompts
const SECTION_PROMPTS = {
  overview: [
    "How is my AC calculated?",
    "Explain proficiency bonus",
    "How do ability modifiers work?",
  ],
  spellbook: [
    "How does concentration work?",
    "When do I regain spell slots?",
    "What's the difference between prepared and known spells?",
  ],
  combat: [
    "What can I do on my turn?",
    "How does grappling work?",
    "Explain opportunity attacks",
  ],
  inventory: [
    "How does attunement work?",
    "What's my carrying capacity?",
    "How do I equip a shield?",
  ],
  features: [
    "How do limited-use features recharge?",
    "Explain this feature for my class",
    "When do I get new features?",
  ],
  rules: [
    "How do saving throws work?",
    "Explain advantage and disadvantage",
    "How does multiclassing work?",
  ],
};

const DEFAULT_PROMPTS = [
  "How does this work?",
  "Explain this D&D rule",
  "Help me with my character",
];

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="aw-code">{part.slice(1, -1)}</code>;
    return part;
  });
}

function renderMarkdown(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <h4 key={i} className="aw-h">{line.slice(4)}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} className="aw-h">{line.slice(3)}</h3>;
    if (line.startsWith('# ')) return <h2 key={i} className="aw-h">{line.slice(2)}</h2>;
    if (line.match(/^\s*[-*]\s/)) return <li key={i} className="aw-li">{renderInline(line.replace(/^\s*[-*]\s/, ''))}</li>;
    if (line.trim() === '') return <div key={i} style={{ height: 3 }} />;
    return <p key={i} className="aw-p">{renderInline(line)}</p>;
  });
}

function cleanResponse(text) {
  // Strip any JSON blocks, code blocks, or action blocks from display
  return text
    .replace(/```action\s*\n?[\s\S]*?\n?```/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\{[\s\S]*?"action"[\s\S]*?\}/g, '')
    .trim();
}

export default function ArcaneWidget({ characterId, section, sectionData }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => loadSettings());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [charData, setCharData] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [applyingAction, setApplyingAction] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Listen for setting changes from Settings tab
  useEffect(() => {
    const handler = (e) => setSettings(e.detail || loadSettings());
    window.addEventListener('codex-ai-settings-changed', handler);
    return () => window.removeEventListener('codex-ai-settings-changed', handler);
  }, []);

  // Load character context
  useEffect(() => {
    if (!characterId || !settings.enabled) return;
    invoke('export_character', { characterId })
      .then(setCharData)
      .catch(() => {});
  }, [characterId, settings.enabled]);

  // Clear messages when section changes
  useEffect(() => {
    setMessages([]);
    setPendingAction(null);
  }, [section]);

  // Auto scroll only if near bottom
  const messagesContainerRef = useRef(null);
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    if (nearBottom) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleSend = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || streaming) return;
    setInput('');
    setPendingAction(null);

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setStreaming(true);

    try {
      const wikiContext = await searchWikiContext(msg);
      const systemPrompt = buildSectionPrompt(charData, section, sectionData, wikiContext);
      const apiMessages = buildMessages(systemPrompt, messages, msg);
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      for await (const chunk of streamChat(apiMessages)) {
        fullResponse += chunk;
        const cleaned = cleanResponse(fullResponse);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: cleaned };
          return updated;
        });
      }

      // Final clean
      const finalText = cleanResponse(fullResponse);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: finalText };
        return updated;
      });
    } catch (err) {
      const errorMsg = err.message?.includes('Failed to fetch')
        ? 'Ollama appears offline.'
        : `Error: ${err.message}`;
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg, isError: true }]);
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming, charData, section, sectionData]);

  const handleApplyAction = async () => {
    if (!pendingAction || applyingAction) return;
    setApplyingAction(true);
    try {
      const { action, data } = pendingAction;
      switch (action) {
        case 'add_spell':
          await invoke('add_spell', { characterId, payload: {
            name: data.name || '', level: data.level ?? 0, school: data.school || '',
            casting_time: data.casting_time || '1 action', spell_range: data.range || data.spell_range || '',
            components: data.components || '', material: data.material || '', duration: data.duration || '',
            concentration: data.concentration || false, ritual: data.ritual || false,
            description: data.description || '', upcast_notes: data.upcast_notes || '',
            prepared: data.prepared ?? true, source: data.source || 'AI Assistant',
          }});
          toast.success(`Added spell: ${data.name}`);
          break;
        case 'update_overview':
          await invoke('update_overview', { characterId, payload: data });
          toast.success('Updated');
          break;
        case 'add_feature':
          await invoke('add_feature', { characterId, payload: {
            name: data.name || '', source: data.source || '', source_level: data.source_level ?? 1,
            feature_type: data.feature_type || 'class', description: data.description || '',
            uses_total: data.uses_total ?? 0, uses_remaining: data.uses_remaining ?? data.uses_total ?? 0,
            recharge: data.recharge || 'none',
          }});
          toast.success(`Added: ${data.name}`);
          break;
        case 'add_item':
          await invoke('add_item', { characterId, payload: {
            name: data.name || '', item_type: data.item_type || 'gear', weight: data.weight ?? 0,
            value_gp: data.value_gp ?? 0, quantity: data.quantity ?? 1, description: data.description || '',
            attunement: data.attunement || false, attuned: false, equipped: false, equipment_slot: '',
          }});
          toast.success(`Added: ${data.name}`);
          break;
        case 'add_npc':
          await invoke('add_npc', { characterId, payload: {
            name: data.name || '', role: data.role || 'neutral', race: data.race || '',
            npc_class: data.npc_class || '', location: data.location || '',
            description: data.description || '', notes: data.notes || '', status: data.status || 'alive',
          }});
          toast.success(`Added NPC: ${data.name}`);
          break;
        default:
          toast.error(`Unknown action: ${action}`);
      }
      setPendingAction(null);
      invoke('export_character', { characterId }).then(setCharData).catch(() => {});
    } catch (err) {
      toast.error(`Failed: ${err.message}`);
    } finally {
      setApplyingAction(false);
    }
  };

  // Don't render if AI not enabled
  if (!settings.enabled) return null;

  const prompts = SECTION_PROMPTS[section] || DEFAULT_PROMPTS;
  const isEmpty = messages.length === 0 && !streaming;

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="aw-trigger"
            title="Ask the Arcane Advisor"
          >
            <Sparkles size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="aw-panel"
          >
            {/* Header */}
            <div className="aw-header">
              <div className="aw-header-left">
                <Sparkles size={13} style={{ color: 'rgba(139,92,246,0.7)' }} />
                <span className="aw-header-title">Arcane Advisor</span>
              </div>
              <div className="aw-header-actions">
                <button
                  onClick={() => { setMessages([]); setPendingAction(null); }}
                  className="aw-header-btn" title="Clear"
                >
                  <Trash2 size={11} />
                </button>
                <button onClick={() => setOpen(false)} className="aw-header-btn" title="Minimize">
                  <Minimize2 size={11} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="aw-messages" ref={messagesContainerRef}>
              {isEmpty && (
                <div className="aw-empty">
                  <p className="aw-empty-text">Ask me anything about this section</p>
                  <div className="aw-quick-prompts">
                    {prompts.map((p, i) => (
                      <button key={i} onClick={() => handleSend(p)} className="aw-quick-btn">{p}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`aw-msg ${msg.role === 'user' ? 'aw-msg-user' : 'aw-msg-ai'}`}>
                  <div className={`aw-bubble ${msg.role === 'user' ? 'aw-bubble-user' : 'aw-bubble-ai'} ${msg.isError ? 'aw-bubble-error' : ''}`}>
                    {msg.role === 'user' ? (
                      <span className="aw-text">{msg.content}</span>
                    ) : (
                      <div className="aw-md">{renderMarkdown(msg.content)}</div>
                    )}
                  </div>
                </div>
              ))}

              {streaming && messages[messages.length - 1]?.content === '' && (
                <div className="aw-msg aw-msg-ai">
                  <div className="aw-bubble aw-bubble-ai aw-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              {pendingAction && !streaming && (
                <div className="aw-action-bar">
                  <span className="aw-action-label">
                    <Zap size={10} style={{ color: '#22c55e' }} />
                    {pendingAction.action.replace(/_/g, ' ')}
                    {pendingAction.data?.name ? `: ${pendingAction.data.name}` : ''}
                  </span>
                  <div className="aw-action-btns">
                    <button onClick={handleApplyAction} disabled={applyingAction} className="aw-btn-apply">
                      {applyingAction ? <Loader2 size={10} className="aw-spin" /> : <Check size={10} />}
                    </button>
                    <button onClick={() => setPendingAction(null)} className="aw-btn-x"><X size={10} /></button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="aw-input-bar">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask something..."
                disabled={streaming}
                className="aw-input"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || streaming}
                className={`aw-btn-send ${input.trim() && !streaming ? 'active' : ''}`}
              >
                {streaming ? <Loader2 size={13} className="aw-spin" /> : <Send size={13} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .aw-trigger {
          position: fixed; bottom: 24px; right: 24px; z-index: 50;
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(201,168,76,0.2));
          border: 1px solid rgba(139,92,246,0.3);
          color: rgba(139,92,246,0.8); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(139,92,246,0.15), 0 0 40px rgba(139,92,246,0.05);
          transition: all 0.2s;
        }
        .aw-trigger:hover {
          border-color: rgba(139,92,246,0.5);
          box-shadow: 0 4px 24px rgba(139,92,246,0.25), 0 0 50px rgba(139,92,246,0.1);
          transform: translateY(-1px);
        }

        .aw-panel {
          position: fixed; bottom: 24px; right: 24px; z-index: 50;
          width: 380px; height: 520px;
          border-radius: 16px;
          background: rgba(10, 8, 18, 0.95);
          border: 1px solid rgba(139,92,246,0.15);
          backdrop-filter: blur(24px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.08);
          display: flex; flex-direction: column;
          overflow: hidden;
        }

        .aw-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(139,92,246,0.08);
          flex-shrink: 0;
        }
        .aw-header-left { display: flex; align-items: center; gap: 8px; }
        .aw-header-title { font-family: var(--font-display); font-size: 12px; font-weight: 600; color: var(--text); }
        .aw-header-actions { display: flex; gap: 2px; }
        .aw-header-btn {
          width: 24px; height: 24px; border-radius: 6px;
          background: transparent; border: none;
          color: var(--text-mute); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .aw-header-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-sub); }

        .aw-messages {
          flex: 1; overflow-y: auto; padding: 10px 12px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .aw-messages::-webkit-scrollbar { width: 4px; }
        .aw-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        .aw-empty { padding: 20px 8px; text-align: center; }
        .aw-empty-text { font-size: 12px; color: var(--text-mute); margin-bottom: 12px; }
        .aw-quick-prompts { display: flex; flex-direction: column; gap: 4px; }
        .aw-quick-btn {
          padding: 7px 12px; border-radius: 8px; font-size: 11px; text-align: left;
          background: rgba(139,92,246,0.04); border: 1px solid rgba(139,92,246,0.1);
          color: var(--text-sub); cursor: pointer; transition: all 0.15s;
          font-family: var(--font-ui);
        }
        .aw-quick-btn:hover { background: rgba(139,92,246,0.1); color: var(--text); border-color: rgba(139,92,246,0.2); }

        .aw-msg { display: flex; }
        .aw-msg-user { justify-content: flex-end; }
        .aw-msg-ai { justify-content: flex-start; }

        .aw-bubble { max-width: 88%; padding: 7px 11px; border-radius: 10px; }
        .aw-bubble-user {
          background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.12);
          border-bottom-right-radius: 3px;
        }
        .aw-bubble-ai {
          background: rgba(139,92,246,0.04); border: 1px solid rgba(139,92,246,0.07);
          border-bottom-left-radius: 3px;
        }
        .aw-bubble-error { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.1); }

        .aw-text { font-size: 12px; color: var(--text); line-height: 1.5; }
        .aw-md { font-size: 12px; line-height: 1.5; }
        .aw-h { font-family: var(--font-display); color: var(--text); font-size: 12px; font-weight: 600; margin: 4px 0 2px; }
        .aw-p { color: var(--text-sub); margin: 1px 0; font-size: 12px; }
        .aw-li { margin-left: 14px; list-style: disc; color: var(--text-sub); font-size: 12px; }
        .aw-code { background: rgba(255,255,255,0.06); padding: 1px 4px; border-radius: 3px; font-size: 11px; font-family: var(--font-mono); }

        .aw-typing { display: flex; gap: 3px; padding: 8px 11px !important; align-items: center; }
        .aw-typing span { width: 4px; height: 4px; border-radius: 50%; background: rgba(139,92,246,0.5); animation: aw-bounce 1.2s infinite; }
        .aw-typing span:nth-child(2) { animation-delay: 0.2s; }
        .aw-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aw-bounce { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }

        .aw-action-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 6px 10px; border-radius: 8px; margin-top: 2px;
          background: rgba(34,197,94,0.04); border: 1px solid rgba(34,197,94,0.12);
        }
        .aw-action-label { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-sub); }
        .aw-action-btns { display: flex; gap: 3px; }
        .aw-btn-apply {
          width: 22px; height: 22px; border-radius: 5px;
          background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25);
          color: #22c55e; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .aw-btn-x {
          width: 22px; height: 22px; border-radius: 5px;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          color: var(--text-mute); cursor: pointer; display: flex; align-items: center; justify-content: center;
        }

        .aw-input-bar {
          display: flex; gap: 6px; padding: 10px 12px;
          border-top: 1px solid rgba(139,92,246,0.08);
          flex-shrink: 0;
        }
        .aw-input {
          flex: 1; padding: 8px 11px; border-radius: 8px; font-size: 12px;
          background: rgba(0,0,0,0.3); border: 1px solid var(--border);
          color: var(--text); font-family: var(--font-ui); outline: none;
          transition: border-color 0.2s;
        }
        .aw-input:focus { border-color: rgba(139,92,246,0.35); }
        .aw-input::placeholder { color: var(--text-mute); }
        .aw-btn-send {
          width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          color: var(--text-mute); cursor: not-allowed;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .aw-btn-send.active {
          background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(201,168,76,0.12));
          border-color: rgba(139,92,246,0.25); color: var(--text); cursor: pointer;
        }
        .aw-spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </>
  );
}
