import { useState, useEffect, useCallback, useRef } from 'react';
import { invoke, Channel } from '@tauri-apps/api/core';
import {
  Sparkles, Eye, MessageCircle, ScrollText, BookOpen, User, Skull,
  Compass, FileText, Library, Loader2, Copy, Check, ChevronDown,
  Download, ExternalLink, AlertTriangle, RefreshCw, Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AI_MODULES } from '../../utils/aiPrompts';

const ICON_MAP = {
  eye: Eye, 'message-circle': MessageCircle, scroll: ScrollText,
  'book-open': BookOpen, user: User, skull: Skull,
  compass: Compass, 'file-text': FileText, library: Library,
};

const AI_MODEL = 'llama3.2';
const CHAT_MODEL = 'phi3.5';

const SAVE_LABELS = {
  'scene': 'Save to Scene',
  'npc-dialogue': 'Save to NPC Notes',
  'villain': 'Save to NPC Notes',
  'session-summary': 'Save to Timeline',
  'campaign-recap': 'Save to Timeline',
  'backstory': 'Save to Timeline',
  'hooks': 'Save as Quest',
  'expand': 'Save to Timeline',
  'lore': 'Save to World Lore',
};

// Ollama status states
const STATUS = { CHECKING: 'checking', NOT_INSTALLED: 'not_installed', NOT_RUNNING: 'not_running', NO_MODEL: 'no_model', READY: 'ready' };

export default function AiModules({ mode = 'dm' }) {
  const isPlayer = mode === 'player';
  const visibleModules = isPlayer ? AI_MODULES.filter(m => m.playerVisible) : AI_MODULES;
  const [activeModule, setActiveModule] = useState(isPlayer ? (visibleModules[0]?.key || 'backstory') : 'scene');
  const [userInput, setUserInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedNpcId, setSelectedNpcId] = useState('');

  // Ollama status
  const [ollamaStatus, setOllamaStatus] = useState(STATUS.CHECKING);
  const [installUrl, setInstallUrl] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [pulling, setPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState('');
  const [starting, setStarting] = useState(false);

  // Campaign context cache
  const [ctx, setCtx] = useState({ npcs: [], quests: [], factions: [], players: [], weather: null, economy: null, timeline: [], scene: null });
  const [ctxLoaded, setCtxLoaded] = useState(false);

  const resultRef = useRef(null);

  // ── Check Ollama status on mount ──
  const checkStatus = useCallback(async () => {
    setOllamaStatus(STATUS.CHECKING);
    try {
      const status = await invoke('ollama_setup_status');
      if (status.running) {
        setAvailableModels(status.models || []);
        const hasModel = (status.models || []).some(m => m.startsWith(AI_MODEL));
        setOllamaStatus(hasModel ? STATUS.READY : STATUS.NO_MODEL);
      } else if (status.installed) {
        setInstallUrl(status.install_url);
        setOllamaStatus(STATUS.NOT_RUNNING);
      } else {
        setInstallUrl(status.install_url || 'https://ollama.com/download');
        setOllamaStatus(STATUS.NOT_INSTALLED);
      }
    } catch {
      setOllamaStatus(STATUS.NOT_INSTALLED);
      setInstallUrl('https://ollama.com/download');
    }
  }, []);

  useEffect(() => { checkStatus(); }, [checkStatus]);

  // ── Auto-start Ollama if installed but not running ──
  const handleStart = async () => {
    setStarting(true);
    try {
      await invoke('ollama_start');
      toast.success('Ollama started');
      await checkStatus();
    } catch (err) {
      toast.error(`Failed to start Ollama: ${err}`);
    } finally {
      setStarting(false);
    }
  };

  // ── Pull model ──
  const handlePullModel = async () => {
    setPulling(true);
    setPullProgress('Starting download...');
    try {
      const channel = new Channel();
      channel.onmessage = (progress) => {
        if (progress.status === 'pulling manifest') {
          setPullProgress('Pulling manifest...');
        } else if (progress.total && progress.completed) {
          const pct = Math.round((progress.completed / progress.total) * 100);
          setPullProgress(`Downloading: ${pct}%`);
        } else if (progress.done) {
          setPullProgress('Complete!');
        } else if (progress.status) {
          setPullProgress(progress.status);
        }
      };
      await invoke('ollama_pull', { model: AI_MODEL, onProgress: channel });
      setPullProgress('');
      setPulling(false);
      toast.success(`Model ${AI_MODEL} downloaded!`);
      await checkStatus();
    } catch (err) {
      setPullProgress('');
      setPulling(false);
      toast.error(`Failed to pull model: ${err}`);
    }
  };

  // ── Load campaign context ──
  useEffect(() => {
    if (ollamaStatus !== STATUS.READY) return;
    if (ctxLoaded) return;

    const load = async () => {
      try {
        const [npcs, quests, factions, weather, economy, timeline, scenes] = await Promise.all([
          invoke('list_campaign_npcs').catch(() => []),
          invoke('list_campaign_quests').catch(() => []),
          invoke('list_factions').catch(() => []),
          invoke('get_weather', { region: 'default' }).catch(() => null),
          invoke('get_economy', { region: 'default' }).catch(() => null),
          invoke('get_timeline').catch(() => []),
          invoke('list_scenes').catch(() => []),
        ]);
        const activeScene = scenes.find(s => !s.completed) || scenes[0] || null;
        setCtx({ npcs, quests, factions, players: [], weather, economy, timeline, scene: activeScene });
        setCtxLoaded(true);
      } catch {
        // Context loading is best-effort
      }
    };
    load();
  }, [ollamaStatus, ctxLoaded]);

  // ── Generate ──
  const handleGenerate = async () => {
    if (generating) return;
    const mod = AI_MODULES.find(m => m.key === activeModule);
    if (!mod) return;

    setGenerating(true);
    setResult('');

    try {
      // Build context for the selected module
      const moduleCtx = { ...ctx, userInput };

      // If module needs a specific NPC
      if (mod.selectNpc && selectedNpcId) {
        moduleCtx.npc = ctx.npcs.find(n => n.id === selectedNpcId) || null;
        moduleCtx.villain = moduleCtx.npc; // villain module uses same data
      }

      // Try to get campaign info
      try {
        const campaignId = await invoke('get_active_campaign');
        if (campaignId) {
          const campaign = await invoke('select_campaign', { campaignId });
          if (campaign) {
            moduleCtx.campaignName = campaign.name;
            moduleCtx.campaignDescription = campaign.description;
          }
        }
      } catch { /* no active campaign */ }

      const { system, prompt } = mod.builder(moduleCtx);

      // Stream the response
      const channel = new Channel();
      let fullText = '';
      channel.onmessage = (chunk) => {
        if (chunk.content) {
          fullText += chunk.content;
          setResult(fullText);
        }
      };

      await invoke('ollama_generate_stream', {
        model: AI_MODEL,
        prompt,
        system,
        maxTokens: 2048,
        temperature: 0.7,
        onChunk: channel,
      });

      setResult(fullText);
    } catch (err) {
      const msg = String(err);
      if (msg.includes('model') && msg.includes('not found')) {
        toast.error(`Model ${AI_MODEL} not found. Click "Download Model" to install it.`);
        setOllamaStatus(STATUS.NO_MODEL);
      } else {
        toast.error(`Generation failed: ${msg.slice(0, 100)}`);
      }
      setResult('_error_');
    } finally {
      setGenerating(false);
    }
  };

  // ── Copy result ──
  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error('Copy failed'));
  };

  // ── Save to campaign ──
  const [saving, setSaving] = useState(false);
  const handleSaveToCampaign = async () => {
    if (!result || saving) return;
    setSaving(true);
    try {
      const mod = AI_MODULES.find(m => m.key === activeModule);
      const title = userInput?.slice(0, 60) || mod?.label || 'AI Generated';
      const ts = Math.floor(Date.now() / 1000);

      switch (activeModule) {
        case 'scene': {
          // Save as scene DM notes or update current scene description
          if (ctx.scene?.id) {
            await invoke('update_scene', {
              sceneId: ctx.scene.id,
              name: ctx.scene.name,
              description: result,
              location: ctx.scene.location || '',
              phase: ctx.scene.phase || 'exploration',
              dmNotes: ctx.scene.dm_notes || '',
              playerDescription: ctx.scene.player_description || '',
              mood: ctx.scene.mood || '',
              playerVisible: ctx.scene.player_visible || false,
            });
            toast.success('Saved to current scene description');
          } else {
            await invoke('create_scene', { name: title, description: result, location: '' });
            toast.success('Created new scene with description');
          }
          break;
        }
        case 'npc-dialogue':
        case 'villain': {
          // Append to NPC's DM notes
          if (selectedNpcId) {
            const npc = ctx.npcs.find(n => n.id === selectedNpcId);
            if (npc) {
              const existing = npc.dm_notes || '';
              const updated = existing ? `${existing}\n\n--- AI Generated (${new Date().toLocaleDateString()}) ---\n${result}` : result;
              await invoke('update_campaign_npc', {
                npcId: npc.id,
                name: npc.name,
                role: npc.role || '',
                race: npc.race || '',
                location: npc.location || '',
                description: npc.description || '',
                dmNotes: updated,
                visibility: npc.visibility || 'dm_only',
                status: npc.status || 'alive',
              });
              toast.success(`Saved to ${npc.name}'s DM notes`);
            }
          } else {
            toast.error('Select an NPC first to save dialogue');
          }
          break;
        }
        case 'session-summary':
        case 'campaign-recap': {
          // Save as a timeline entry
          await invoke('add_timeline_entry', {
            title: activeModule === 'session-summary' ? 'Session Summary' : 'Campaign Recap',
            description: result,
            category: 'event',
            calendarDay: 1,
            calendarMonth: 1,
            calendarYear: 1,
            sessionNumber: null,
            visibility: 'dm_only',
          });
          toast.success('Saved to world timeline');
          break;
        }
        case 'hooks': {
          // Save each hook as a quest
          await invoke('create_campaign_quest', {
            title: `Story Hooks: ${title}`,
            giver: '',
            description: result,
            status: 'hidden',
            visibility: 'dm_only',
            objectivesJson: '[]',
            rewardXp: 0,
            rewardGold: 0,
            rewardItemsJson: '[]',
            parentQuestId: null,
            linkedArcId: null,
          });
          toast.success('Saved as quest draft');
          break;
        }
        case 'lore': {
          // Save as a world state entry
          const key = `ai_lore_${Date.now()}`;
          await invoke('set_world_state', {
            key,
            valueJson: JSON.stringify({ content: result, title }),
            category: 'lore',
            visibility: 'dm_only',
          });
          toast.success('Saved to world lore');
          break;
        }
        case 'expand':
        case 'backstory': {
          // Save as timeline entry
          await invoke('add_timeline_entry', {
            title: activeModule === 'backstory' ? `Backstory: ${title}` : `Narrative: ${title}`,
            description: result,
            category: activeModule === 'backstory' ? 'character' : 'event',
            calendarDay: 1,
            calendarMonth: 1,
            calendarYear: 1,
            sessionNumber: null,
            visibility: 'dm_only',
          });
          toast.success('Saved to timeline');
          break;
        }
        default:
          toast.error('No save action for this module');
      }
    } catch (err) {
      toast.error(`Save failed: ${String(err).slice(0, 80)}`);
    } finally {
      setSaving(false);
    }
  };

  // Reset result when module changes
  useEffect(() => {
    setResult('');
    setUserInput('');
    setSelectedNpcId('');
  }, [activeModule]);

  // Auto-scroll result
  useEffect(() => {
    if (resultRef.current && generating) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result, generating]);

  const currentMod = AI_MODULES.find(m => m.key === activeModule);

  // ── Ollama Setup UI ──
  if (ollamaStatus !== STATUS.READY) {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
        }}>
          <Sparkles size={16} style={{ color: 'rgba(139,92,246,0.7)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
            AI Modules
          </span>
        </div>

        {ollamaStatus === STATUS.CHECKING && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-mute)', fontSize: '12px' }}>
            <Loader2 size={14} className="aw-spin" /> Checking Ollama status...
          </div>
        )}

        {ollamaStatus === STATUS.NOT_INSTALLED && (
          <div style={{
            padding: '16px', borderRadius: '10px',
            background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <AlertTriangle size={14} style={{ color: '#fbbf24' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fbbf24' }}>Ollama Not Installed</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '12px', lineHeight: 1.6 }}>
              AI Modules require Ollama to run local AI models. Install Ollama (free, runs on your machine), then come back here.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  try { invoke('plugin:shell|open', { path: installUrl }); } catch { /* */ }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px',
                  background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                  color: '#a78bfa', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <Download size={12} /> Download Ollama
              </button>
              <button
                onClick={checkStatus}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-dim)', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <RefreshCw size={12} /> Re-check
              </button>
            </div>
            <p style={{ fontSize: '10px', color: 'var(--text-mute)', marginTop: '10px', fontStyle: 'italic' }}>
              After installing, Ollama runs in the background. Return here and click Re-check.
            </p>
          </div>
        )}

        {ollamaStatus === STATUS.NOT_RUNNING && (
          <div style={{
            padding: '16px', borderRadius: '10px',
            background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <AlertTriangle size={14} style={{ color: '#60a5fa' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#60a5fa' }}>Ollama Not Running</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '12px', lineHeight: 1.6 }}>
              Ollama is installed but not running. Start it to enable AI modules.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleStart}
                disabled={starting}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px',
                  background: starting ? 'rgba(74,222,128,0.08)' : 'rgba(74,222,128,0.15)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  color: '#4ade80', fontSize: '12px', fontWeight: 600,
                  cursor: starting ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                {starting ? <Loader2 size={12} className="aw-spin" /> : <RefreshCw size={12} />}
                {starting ? 'Starting...' : 'Start Ollama'}
              </button>
              <button
                onClick={checkStatus}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-dim)', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <RefreshCw size={12} /> Re-check
              </button>
            </div>
          </div>
        )}

        {ollamaStatus === STATUS.NO_MODEL && (
          <div style={{
            padding: '16px', borderRadius: '10px',
            background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Download size={14} style={{ color: '#a78bfa' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa' }}>Model Required</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '12px', lineHeight: 1.6 }}>
              Ollama is running! Now download the <strong style={{ color: 'var(--text)' }}>{AI_MODEL}</strong> model (~2GB) to power AI generation.
            </p>
            {availableModels.length > 0 && (
              <p style={{ fontSize: '11px', color: 'var(--text-mute)', marginBottom: '8px' }}>
                Installed models: {availableModels.join(', ')}
              </p>
            )}
            {pulling ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
              }}>
                <Loader2 size={14} className="aw-spin" style={{ color: '#a78bfa' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{pullProgress}</span>
              </div>
            ) : (
              <button
                onClick={handlePullModel}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px',
                  background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                  color: '#a78bfa', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <Download size={12} /> Download {AI_MODEL}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Main UI: Module Tabs + Generation ──
  return (
    <div>
      {/* Module tab bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '3px',
        padding: '8px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        {visibleModules.map(mod => {
          const Icon = ICON_MAP[mod.icon] || Sparkles;
          const active = activeModule === mod.key;
          return (
            <button
              key={mod.key}
              onClick={() => setActiveModule(mod.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 8px', borderRadius: '6px',
                fontSize: '10px', fontWeight: 600,
                background: active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: active ? '#a78bfa' : 'var(--text-mute)',
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={10} /> {mod.label}
            </button>
          );
        })}
      </div>

      {/* Module content */}
      <div style={{ padding: '12px' }}>
        {/* NPC selector if needed */}
        {currentMod?.selectNpc && ctx.npcs.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-mute)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Select NPC
            </label>
            <select
              value={selectedNpcId}
              onChange={e => setSelectedNpcId(e.target.value)}
              style={{
                width: '100%', padding: '6px 10px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text)', fontSize: '12px',
                fontFamily: 'var(--font-ui)', outline: 'none',
              }}
            >
              <option value="">-- Choose an NPC --</option>
              {ctx.npcs.map(npc => (
                <option key={npc.id} value={npc.id}>{npc.name} ({npc.role || 'unknown'})</option>
              ))}
            </select>
          </div>
        )}

        {/* Input area */}
        <textarea
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder={currentMod?.placeholder || 'Describe what you want...'}
          rows={3}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(139,92,246,0.15)',
            color: 'var(--text)', fontSize: '12px',
            fontFamily: 'var(--font-ui)', outline: 'none',
            resize: 'vertical', boxSizing: 'border-box',
          }}
        />

        {/* Generate button */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 16px', borderRadius: '8px',
              background: generating ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: generating ? 'rgba(167,139,250,0.5)' : '#a78bfa',
              fontSize: '12px', fontWeight: 600,
              cursor: generating ? 'wait' : 'pointer',
              fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
            }}
          >
            {generating ? <Loader2 size={12} className="aw-spin" /> : <Sparkles size={12} />}
            {generating ? 'Generating...' : 'Generate'}
          </button>
          <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>
            Using {AI_MODEL} via Ollama
          </span>
        </div>

        {/* Error state with retry */}
        {result === '_error_' && (
          <div style={{
            marginTop: '12px', padding: '12px', borderRadius: '8px',
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <AlertTriangle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#fca5a5', flex: 1 }}>Generation failed. Check that Ollama is running.</span>
            <button
              onClick={handleGenerate}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '5px 12px', borderRadius: '6px',
                background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                color: '#a78bfa', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              <RefreshCw size={11} /> Retry
            </button>
          </div>
        )}

        {/* Result display */}
        {result && result !== '_error_' && (
          <div style={{ marginTop: '12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
              marginBottom: '6px',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-mute)', letterSpacing: '0.05em', textTransform: 'uppercase', marginRight: 'auto' }}>
                Result
              </span>
              <button
                onClick={handleGenerate}
                disabled={generating}
                title="Regenerate with same input"
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '3px 10px', borderRadius: '5px',
                  background: 'rgba(139,92,246,0.08)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  color: '#a78bfa',
                  fontSize: '10px', fontWeight: 500,
                  cursor: generating ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                <RefreshCw size={10} /> Regenerate
              </button>
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '3px 10px', borderRadius: '5px',
                  background: copied ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${copied ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  color: copied ? '#4ade80' : 'var(--text-mute)',
                  fontSize: '10px', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleSaveToCampaign}
                disabled={saving || generating}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '3px 10px', borderRadius: '5px',
                  background: saving ? 'rgba(74,222,128,0.12)' : 'rgba(74,222,128,0.06)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  color: '#4ade80',
                  fontSize: '10px', fontWeight: 500,
                  cursor: saving ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                {saving ? <Loader2 size={10} className="aw-spin" /> : <Save size={10} />}
                {saving ? 'Saving...' : SAVE_LABELS[activeModule] || 'Save to Campaign'}
              </button>
            </div>
            <div
              ref={resultRef}
              style={{
                padding: '12px', borderRadius: '8px',
                background: 'rgba(139,92,246,0.04)',
                border: '1px solid rgba(139,92,246,0.1)',
                fontSize: '12px', color: 'var(--text-sub)',
                lineHeight: 1.7, maxHeight: '400px',
                overflowY: 'auto', whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-text, var(--font-ui))',
              }}
            >
              {renderMarkdown(result)}
            </div>
            <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--text-mute)', textAlign: 'right' }}>
              {result.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        )}
      </div>

      <style>{`
        .aw-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// Simple markdown renderer
function renderMarkdown(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <h4 key={i} style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '13px', fontWeight: 600, margin: '8px 0 4px' }}>{line.slice(4)}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '14px', fontWeight: 600, margin: '10px 0 4px' }}>{line.slice(3)}</h3>;
    if (line.startsWith('# ')) return <h2 key={i} style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '15px', fontWeight: 700, margin: '12px 0 6px' }}>{line.slice(2)}</h2>;
    if (line.match(/^\s*[-*]\s/)) return <li key={i} style={{ marginLeft: '16px', listStyle: 'disc', color: 'var(--text-sub)', fontSize: '12px', marginBottom: '2px' }}>{renderInline(line.replace(/^\s*[-*]\s/, ''))}</li>;
    if (line.match(/^\s*\d+\.\s/)) return <li key={i} style={{ marginLeft: '16px', listStyle: 'decimal', color: 'var(--text-sub)', fontSize: '12px', marginBottom: '2px' }}>{renderInline(line.replace(/^\s*\d+\.\s/, ''))}</li>;
    if (line.trim() === '') return <div key={i} style={{ height: '6px' }} />;
    return <p key={i} style={{ color: 'var(--text-sub)', margin: '2px 0', fontSize: '12px' }}>{renderInline(line)}</p>;
  });
}

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 4px', borderRadius: '3px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{part.slice(1, -1)}</code>;
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) return <em key={i} style={{ fontStyle: 'italic', color: 'var(--text-dim)' }}>{part.slice(1, -1)}</em>;
    return part;
  });
}
