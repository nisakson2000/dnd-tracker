import { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Sparkles, Send, Trash2, X, Check, Loader2, AlertCircle, Zap, MessageSquare, Plus, Clock, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { streamChat, checkOllamaStatus, searchWikiContext, getAvailableModels, getSelectedModel, setSelectedModel } from '../api/assistant';
import { buildSystemPrompt, buildMessages } from '../data/assistantContext';

const SETTINGS_KEY = 'codex-assistant-settings';
const CONVERSATIONS_KEY = 'codex-ai-conversations';
const MAX_CONVERSATIONS = 50;

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { enabled: false, model: 'phi3.5' };
  } catch { return { enabled: false, model: 'phi3.5' }; }
}

function saveSettings(s) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent('codex-ai-settings-changed', { detail: s }));
  } catch { /* ignore storage errors */ }
}

// ─── Conversation persistence (localStorage) ────────────────────────────────

function generateConvoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadAllConversations() {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAllConversations(convos) {
  try {
    // Keep only the most recent MAX_CONVERSATIONS
    const trimmed = convos.slice(0, MAX_CONVERSATIONS);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(trimmed));
  } catch { /* ignore storage errors */ }
}

function titleFromMessage(msg) {
  if (!msg) return 'New conversation';
  return msg.length > 50 ? msg.slice(0, 50) + '...' : msg;
}

function formatTimestamp(iso) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  } catch { return ''; }
}

const EXAMPLE_PROMPTS = [
  "What does my Spell Save DC mean?",
  "How do saving throws work?",
  "Explain concentration",
  "What happens at 0 HP?",
  "How does point buy work?",
  "Add Mage Armor to my spells",
];

function cleanResponse(text) {
  return text
    .replace(/```action\s*\n?[\s\S]*?\n?```/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\{[\s\S]*?"action"[\s\S]*?\}/g, '')
    .trim();
}

function renderMarkdown(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <h4 key={i} className="aa-h4">{line.slice(4)}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} className="aa-h3">{line.slice(3)}</h3>;
    if (line.startsWith('# ')) return <h2 key={i} className="aa-h2">{line.slice(2)}</h2>;
    if (line.match(/^\s*[-*]\s/)) return <li key={i} className="aa-li">{renderInline(line.replace(/^\s*[-*]\s/, ''))}</li>;
    if (line.trim() === '') return <div key={i} style={{ height: 4 }} />;
    return <p key={i} className="aa-p">{renderInline(line)}</p>;
  });
}

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="aa-code">{part.slice(1, -1)}</code>;
    return part;
  });
}

function SetupPanel({ settings, onUpdate, onEnable }) {
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const result = await checkOllamaStatus();
      setStatus(result);
    } catch {
      setStatus({ available: false });
    }
    setChecking(false);
  };

  useEffect(() => { checkStatus(); }, []); // eslint-disable-line react-hooks/set-state-in-effect
  const canEnable = status?.available && status?.modelInstalled;

  return (
    <div className="aa-setup">
      <div className="aa-setup-icon">
        <Sparkles size={24} style={{ color: 'rgba(139,92,246,0.7)' }} />
      </div>
      <h2 className="aa-setup-title">Arcane Advisor</h2>
      <p className="aa-setup-desc">AI-powered D&D companion running locally via Ollama</p>

      <div className="aa-setup-status">
        {status === null ? (
          <span className="aa-status-text">Checking connection...</span>
        ) : status.available ? (
          <div className="aa-status-items">
            <div className="aa-status-ok"><div className="aa-dot aa-dot-ok" /> Ollama running</div>
            {status.modelInstalled ? (
              <div className="aa-status-ok"><div className="aa-dot aa-dot-ok" /> Model ready</div>
            ) : (
              <div className="aa-status-warn"><div className="aa-dot aa-dot-warn" /> Model not installed</div>
            )}
          </div>
        ) : (
          <div className="aa-status-err"><div className="aa-dot aa-dot-err" /> Ollama not running</div>
        )}
        <button onClick={checkStatus} disabled={checking} className="aa-btn-check">
          {checking ? 'Checking...' : 'Test'}
        </button>
      </div>

      {(!status?.available || !status?.modelInstalled) && (
        <div className="aa-setup-guide">
          {!status?.available && <p>1. Install Ollama from <span style={{ color: 'var(--accent-l)' }}>ollama.ai</span></p>}
          <p>{status?.available ? '1' : '2'}. Run: <code className="aa-code">ollama pull phi3.5</code></p>
          <p style={{ fontSize: 11, color: 'var(--text-mute)', fontStyle: 'italic', marginTop: 8 }}>
            CPU-only: expect 5–15s responses
          </p>
        </div>
      )}

      <button
        onClick={() => { onUpdate({ ...settings, enabled: true }); onEnable(); }}
        disabled={!canEnable}
        className={`aa-btn-enable ${canEnable ? 'ready' : ''}`}
      >
        <Sparkles size={14} /> {canEnable ? 'Enable Arcane Advisor' : 'Complete setup first'}
      </button>
    </div>
  );
}

export default function AiAssistant({ characterId, character }) {
  const [settings, setSettings] = useState(() => loadSettings());
  const [enabled, setEnabled] = useState(settings.enabled);
  const [conversations, setConversations] = useState(() => loadAllConversations());
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [charData, setCharData] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [applyingAction, setApplyingAction] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModelState] = useState(() => getSelectedModel());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch available models on mount
  useEffect(() => {
    if (!enabled) return;
    getAvailableModels().then(models => {
      if (models.length) setAvailableModels(models);
    });
  }, [enabled]);

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    setSelectedModelState(model);
  };

  useEffect(() => {
    if (!characterId || !enabled) return;
    invoke('export_character', { characterId })
      .then(setCharData)
      .catch(err => console.error('Failed to load character context:', err));
  }, [characterId, enabled]);

  // Persist active conversation to localStorage whenever messages change
  useEffect(() => {
    if (!activeConvoId || messages.length === 0) return;
    setConversations(prev => {
      const updated = prev.map(c =>
        c.id === activeConvoId ? { ...c, messages: messages.slice(-20) } : c
      );
      saveAllConversations(updated);
      return updated;
    });
  }, [activeConvoId, messages]);

  const messagesContainerRef = useRef(null);
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    if (nearBottom) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const updateSettings = (next) => { setSettings(next); saveSettings(next); };

  // Start a new conversation (or switch to existing)
  const startNewConversation = useCallback(() => {
    setActiveConvoId(null);
    setMessages([]);
    setPendingAction(null);
    setShowHistory(false);
  }, []);

  const loadConversation = useCallback((convo) => {
    setActiveConvoId(convo.id);
    setMessages(convo.messages || []);
    setPendingAction(null);
    setShowHistory(false);
  }, []);

  const deleteConversation = useCallback((convoId, e) => {
    e.stopPropagation();
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== convoId);
      saveAllConversations(updated);
      return updated;
    });
    if (activeConvoId === convoId) {
      setActiveConvoId(null);
      setMessages([]);
    }
  }, [activeConvoId]);

  const handleSend = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || streaming) return;
    setInput('');
    setPendingAction(null);

    // If no active conversation, create one
    let convoId = activeConvoId;
    if (!convoId) {
      convoId = generateConvoId();
      const newConvo = {
        id: convoId,
        title: titleFromMessage(msg),
        messages: [],
        createdAt: new Date().toISOString(),
        characterId,
      };
      setActiveConvoId(convoId);
      setConversations(prev => {
        const updated = [newConvo, ...prev].slice(0, MAX_CONVERSATIONS);
        saveAllConversations(updated);
        return updated;
      });
    }

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setStreaming(true);

    try {
      const wikiContext = await searchWikiContext(msg);
      const systemPrompt = buildSystemPrompt(charData, wikiContext);
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

      const finalText = cleanResponse(fullResponse);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: finalText };
        return updated;
      });
    } catch (err) {
      const errorMsg = err.message?.includes('Failed to fetch')
        ? 'Ollama appears to be offline. Make sure it\'s running.'
        : `Error: ${err.message}`;
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg, isError: true }]);
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming, charData, activeConvoId, characterId]);

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
          toast.success('Character updated');
          break;
        case 'add_feature':
          await invoke('add_feature', { characterId, payload: {
            name: data.name || '', source: data.source || '', source_level: data.source_level ?? 1,
            feature_type: data.feature_type || 'class', description: data.description || '',
            uses_total: data.uses_total ?? 0, uses_remaining: data.uses_remaining ?? data.uses_total ?? 0,
            recharge: data.recharge || 'none',
          }});
          toast.success(`Added feature: ${data.name}`);
          break;
        case 'add_item':
          await invoke('add_item', { characterId, payload: {
            name: data.name || '', item_type: data.item_type || 'gear', weight: data.weight ?? 0,
            value_gp: data.value_gp ?? 0, quantity: data.quantity ?? 1, description: data.description || '',
            attunement: data.attunement || false, attuned: false, equipped: false, equipment_slot: data.equipment_slot || '',
          }});
          toast.success(`Added item: ${data.name}`);
          break;
        case 'add_npc':
          await invoke('add_npc', { characterId, payload: {
            name: data.name || '', role: data.role || 'neutral', race: data.race || '',
            npc_class: data.npc_class || '', location: data.location || '', description: data.description || '',
            notes: data.notes || '', status: data.status || 'alive',
          }});
          toast.success(`Added NPC: ${data.name}`);
          break;
        default:
          toast.error(`Unknown action: ${action}`);
      }
      setPendingAction(null);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Changes applied.' }]);
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
    setActiveConvoId(null);
  };

  if (!enabled) {
    return <SetupPanel settings={settings} onUpdate={updateSettings} onEnable={() => setEnabled(true)} />;
  }

  const isEmpty = messages.length === 0 && !streaming;

  return (
    <div className="aa-container">
      {/* Header */}
      <div className="aa-header">
        <div className="aa-header-left">
          <div className="aa-header-icon"><Sparkles size={15} /></div>
          <div>
            <span className="aa-header-title">Arcane Advisor</span>
            {character && (
              <span className="aa-header-sub">
                {character.name} · {character.primary_class} {character.level}
              </span>
            )}
          </div>
        </div>
        <div className="aa-header-actions">
          {availableModels.length > 1 && (
            <select
              value={selectedModel}
              onChange={handleModelChange}
              className="aa-model-select"
              title="AI Model"
            >
              {availableModels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          )}
          <button onClick={startNewConversation} className="aa-header-btn" title="New conversation">
            <Plus size={13} />
          </button>
          <button onClick={() => setShowHistory(h => !h)} className={`aa-header-btn ${showHistory ? 'aa-btn-active' : ''}`} title="Past conversations">
            <MessageSquare size={13} />
          </button>
          <button onClick={clearConversation} className="aa-header-btn" title="Clear chat">
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => { updateSettings({ ...settings, enabled: false }); setEnabled(false); }}
            className="aa-header-btn" title="Disable"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Past Conversations Panel */}
      {showHistory && (
        <div className="aa-history-panel">
          <div className="aa-history-header">
            <span className="aa-history-title">Past Conversations</span>
            <button onClick={() => setShowHistory(false)} className="aa-header-btn"><ChevronLeft size={13} /></button>
          </div>
          <div className="aa-history-list">
            {conversations.length === 0 ? (
              <p className="aa-history-empty">No past conversations yet.</p>
            ) : (
              conversations
                .filter(c => !characterId || c.characterId === characterId)
                .map(convo => (
                  <button
                    key={convo.id}
                    onClick={() => loadConversation(convo)}
                    className={`aa-history-item ${convo.id === activeConvoId ? 'aa-history-active' : ''}`}
                  >
                    <div className="aa-history-item-title">{convo.title}</div>
                    <div className="aa-history-item-meta">
                      <Clock size={10} />
                      <span>{formatTimestamp(convo.createdAt)}</span>
                      <span className="aa-history-msg-count">{(convo.messages || []).length} msgs</span>
                    </div>
                    <button
                      onClick={(e) => deleteConversation(convo.id, e)}
                      className="aa-history-delete"
                      title="Delete conversation"
                    >
                      <Trash2 size={10} />
                    </button>
                  </button>
                ))
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="aa-messages" ref={messagesContainerRef}>
        {isEmpty && (
          <div className="aa-empty">
            <Sparkles size={28} className="aa-empty-icon" />
            <p className="aa-empty-title">Ask me anything about D&D 5e</p>
            <p className="aa-empty-sub">Rules, character builds, spells, combat — I'm here to help.</p>
            <div className="aa-prompts">
              {EXAMPLE_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => handleSend(p)} className="aa-prompt-btn">{p}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`aa-msg ${msg.role === 'user' ? 'aa-msg-user' : 'aa-msg-ai'} ${msg.isError ? 'aa-msg-error' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="aa-msg-avatar"><Sparkles size={11} /></div>
            )}
            <div className={`aa-msg-bubble ${msg.role === 'user' ? 'aa-bubble-user' : 'aa-bubble-ai'} ${msg.isError ? 'aa-bubble-error' : ''}`}>
              {msg.role === 'user' ? (
                <p className="aa-msg-text">{msg.content}</p>
              ) : (
                <div className="aa-msg-md">{renderMarkdown(msg.content)}</div>
              )}
              {msg.isError && <AlertCircle size={11} style={{ color: '#ef4444', marginTop: 4 }} />}
            </div>
          </div>
        ))}

        {streaming && messages[messages.length - 1]?.content === '' && (
          <div className="aa-msg aa-msg-ai">
            <div className="aa-msg-avatar"><Sparkles size={11} /></div>
            <div className="aa-bubble-ai aa-typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        {pendingAction && !streaming && (
          <div className="aa-action-bar">
            <div className="aa-action-info">
              <Zap size={12} style={{ color: '#22c55e' }} />
              <span>Apply: <strong>{pendingAction.action.replace(/_/g, ' ')}</strong></span>
              {pendingAction.data?.name && <span> — {pendingAction.data.name}</span>}
            </div>
            <div className="aa-action-btns">
              <button onClick={handleApplyAction} disabled={applyingAction} className="aa-btn-apply">
                {applyingAction ? <Loader2 size={12} className="aa-spin" /> : <Check size={12} />} Apply
              </button>
              <button onClick={() => setPendingAction(null)} className="aa-btn-dismiss">Dismiss</button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="aa-input-bar">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask the Arcane Advisor..."
          disabled={streaming}
          className="aa-input"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || streaming}
          className={`aa-btn-send ${input.trim() && !streaming ? 'active' : ''}`}
        >
          {streaming ? <Loader2 size={15} className="aa-spin" /> : <Send size={15} />}
        </button>
      </div>

      <style>{`
        .aa-container { display: flex; flex-direction: column; height: calc(100vh - 120px); max-width: 720px; }

        .aa-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--border); margin-bottom: 0; flex-shrink: 0; }
        .aa-header-left { display: flex; align-items: center; gap: 10px; }
        .aa-header-icon { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(201,168,76,0.15)); border: 1px solid rgba(139,92,246,0.2); display: flex; align-items: center; justify-content: center; color: rgba(139,92,246,0.8); }
        .aa-header-title { font-family: var(--font-display); font-size: calc(15px * var(--font-scale, 1)); font-weight: 700; color: var(--text); display: block; }
        .aa-header-sub { font-size: 11px; color: var(--text-mute); display: block; margin-top: 1px; }
        .aa-header-actions { display: flex; gap: 4px; }
        .aa-header-btn { width: 28px; height: 28px; border-radius: 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: var(--text-mute); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .aa-header-btn:hover { background: rgba(255,255,255,0.06); color: var(--text-sub); }

        .aa-model-select {
          padding: 4px 8px; border-radius: 6px; font-size: 11px;
          background: rgba(0,0,0,0.3); border: 1px solid rgba(139,92,246,0.15);
          color: var(--text-sub); font-family: var(--font-ui);
          outline: none; cursor: pointer; max-width: 140px;
          transition: border-color 0.15s;
        }
        .aa-model-select:hover { border-color: rgba(139,92,246,0.3); color: var(--text); }
        .aa-model-select:focus { border-color: rgba(139,92,246,0.4); }
        .aa-model-select option { background: #1a1a2e; color: var(--text); }

        .aa-messages { flex: 1; overflow-y: auto; padding: 16px 0; display: flex; flex-direction: column; gap: 6px; }

        .aa-empty { text-align: center; padding: 48px 20px 24px; }
        .aa-empty-icon { margin: 0 auto 14px; opacity: 0.15; color: var(--accent); }
        .aa-empty-title { font-family: var(--font-display); font-size: 15px; color: var(--text-sub); margin-bottom: 4px; }
        .aa-empty-sub { font-size: 12px; color: var(--text-mute); margin-bottom: 20px; }
        .aa-prompts { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; max-width: 480px; margin: 0 auto; }
        .aa-prompt-btn { padding: 6px 12px; border-radius: 8px; font-size: 12px; background: rgba(139,92,246,0.05); border: 1px solid rgba(139,92,246,0.12); color: var(--text-sub); cursor: pointer; transition: all 0.15s; font-family: var(--font-ui); }
        .aa-prompt-btn:hover { background: rgba(139,92,246,0.12); color: var(--text); border-color: rgba(139,92,246,0.25); }

        .aa-msg { display: flex; gap: 8px; align-items: flex-start; }
        .aa-msg-user { justify-content: flex-end; }
        .aa-msg-avatar { width: 22px; height: 22px; border-radius: 6px; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.15); display: flex; align-items: center; justify-content: center; color: rgba(139,92,246,0.6); flex-shrink: 0; margin-top: 2px; }

        .aa-msg-bubble { max-width: 80%; padding: 8px 12px; border-radius: 12px; }
        .aa-bubble-user { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.15); border-bottom-right-radius: 4px; }
        .aa-bubble-ai { background: rgba(139,92,246,0.04); border: 1px solid rgba(139,92,246,0.08); border-bottom-left-radius: 4px; }
        .aa-bubble-error { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.12); }

        .aa-msg-text { font-size: 13px; color: var(--text); line-height: 1.5; margin: 0; }
        .aa-msg-md { font-size: 13px; line-height: 1.6; }
        .aa-h2 { font-family: var(--font-display); color: var(--text); font-size: 15px; margin: 8px 0 4px; }
        .aa-h3 { font-family: var(--font-display); color: var(--text); font-size: 14px; margin: 6px 0 3px; }
        .aa-h4 { font-family: var(--font-display); color: var(--text); font-size: 13px; margin: 6px 0 2px; }
        .aa-p { color: var(--text-sub); margin: 2px 0; }
        .aa-li { margin-left: 16px; list-style: disc; color: var(--text-sub); }
        .aa-code { background: rgba(255,255,255,0.06); padding: 1px 5px; border-radius: 4px; font-size: 12px; font-family: var(--font-mono); }

        .aa-typing { display: flex; gap: 4px; padding: 10px 14px !important; align-items: center; }
        .aa-typing span { width: 5px; height: 5px; border-radius: 50%; background: rgba(139,92,246,0.5); animation: aa-bounce 1.2s infinite; }
        .aa-typing span:nth-child(2) { animation-delay: 0.2s; }
        .aa-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aa-bounce { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }

        .aa-action-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; border-radius: 10px; background: rgba(34,197,94,0.04); border: 1px solid rgba(34,197,94,0.15); margin-top: 4px; }
        .aa-action-info { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-sub); }
        .aa-action-btns { display: flex; gap: 6px; flex-shrink: 0; }
        .aa-btn-apply { padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25); color: #22c55e; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .aa-btn-dismiss { padding: 5px 10px; border-radius: 6px; font-size: 11px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: var(--text-mute); cursor: pointer; }

        .aa-input-bar { display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border); flex-shrink: 0; }
        .aa-input { flex: 1; padding: 10px 14px; border-radius: 10px; font-size: 13px; background: var(--bg-input, rgba(0,0,0,0.3)); border: 1px solid var(--border); color: var(--text); font-family: var(--font-ui); outline: none; transition: border-color 0.2s; }
        .aa-input:focus { border-color: rgba(139,92,246,0.4); }
        .aa-input::placeholder { color: var(--text-mute); }
        .aa-btn-send { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: var(--text-mute); cursor: not-allowed; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
        .aa-btn-send.active { background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(201,168,76,0.15)); border-color: rgba(139,92,246,0.3); color: var(--text); cursor: pointer; }

        .aa-spin { animation: spin 0.8s linear infinite; }

        /* Setup panel */
        .aa-setup { max-width: 420px; margin: 60px auto 0; text-align: center; }
        .aa-setup-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, rgba(139,92,246,0.12), rgba(201,168,76,0.1)); border: 1px solid rgba(139,92,246,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .aa-setup-title { font-family: var(--font-display); font-size: calc(22px * var(--font-scale, 1)); font-weight: 700; color: var(--text); margin: 0 0 4px; }
        .aa-setup-desc { font-size: 13px; color: var(--text-mute); margin-bottom: 24px; }
        .aa-setup-status { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: 10px; background: var(--bg-panel); border: 1px solid var(--border); margin-bottom: 16px; text-align: left; }
        .aa-status-items { display: flex; flex-direction: column; gap: 4px; }
        .aa-status-text { font-size: 12px; color: var(--text-mute); }
        .aa-status-ok, .aa-status-warn, .aa-status-err { display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .aa-status-ok { color: #22c55e; }
        .aa-status-warn { color: #f59e0b; }
        .aa-status-err { color: #ef4444; }
        .aa-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .aa-dot-ok { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.4); }
        .aa-dot-warn { background: #f59e0b; }
        .aa-dot-err { background: #ef4444; }
        .aa-btn-check { padding: 5px 12px; border-radius: 6px; font-size: 11px; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2); color: rgba(201,168,76,0.7); cursor: pointer; font-family: var(--font-display); flex-shrink: 0; }
        .aa-setup-guide { padding: 14px; border-radius: 10px; background: rgba(139,92,246,0.03); border: 1px solid rgba(139,92,246,0.1); margin-bottom: 16px; text-align: left; font-size: 13px; color: var(--text-sub); line-height: 1.8; }
        .aa-btn-enable { width: 100%; padding: 12px 0; border-radius: 10px; font-size: 13px; font-family: var(--font-display); font-weight: 600; cursor: not-allowed; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: var(--text-mute); display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
        .aa-btn-enable.ready { cursor: pointer; background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(201,168,76,0.2)); border-color: rgba(139,92,246,0.35); color: var(--text); }
        .aa-btn-enable.ready:hover { border-color: rgba(139,92,246,0.5); }

        .aa-btn-active { background: rgba(139,92,246,0.15) !important; border-color: rgba(139,92,246,0.3) !important; color: rgba(139,92,246,0.8) !important; }

        /* History panel */
        .aa-history-panel { border-bottom: 1px solid var(--border); padding: 8px 0; max-height: 260px; display: flex; flex-direction: column; flex-shrink: 0; }
        .aa-history-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 4px 8px; }
        .aa-history-title { font-family: var(--font-display); font-size: 12px; font-weight: 600; color: var(--text-sub); text-transform: uppercase; letter-spacing: 0.5px; }
        .aa-history-list { overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
        .aa-history-empty { font-size: 12px; color: var(--text-mute); text-align: center; padding: 16px 0; }
        .aa-history-item { position: relative; display: block; width: 100%; text-align: left; padding: 8px 30px 8px 10px; border-radius: 8px; background: transparent; border: 1px solid transparent; color: var(--text-sub); cursor: pointer; font-family: var(--font-ui); transition: all 0.15s; }
        .aa-history-item:hover { background: rgba(139,92,246,0.06); border-color: rgba(139,92,246,0.1); }
        .aa-history-active { background: rgba(139,92,246,0.08); border-color: rgba(139,92,246,0.15); }
        .aa-history-item-title { font-size: 12px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .aa-history-item-meta { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--text-mute); }
        .aa-history-msg-count { margin-left: 6px; opacity: 0.7; }
        .aa-history-delete { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; border-radius: 4px; background: transparent; border: none; color: var(--text-mute); cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.15s; }
        .aa-history-item:hover .aa-history-delete { opacity: 1; }
        .aa-history-delete:hover { background: rgba(239,68,68,0.12); color: #ef4444; }
      `}</style>
    </div>
  );
}
