import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Plus, Trash2, Edit3, X, Check,
  Users, MapPin, BookOpen, Clock, Settings, Wand2, FileText,
  ChevronDown, ChevronRight, DoorOpen, MessageCircle, User, Swords, Skull, Layers, Wine,
  Globe, Shield, CloudSun, Coins, Route, AlertTriangle, Calendar, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useSession } from '../contexts/SessionContext';
import ConfirmDialog from '../components/ConfirmDialog';
import SessionRecap from '../components/dm-session/SessionRecap';
import HandoutsManager from '../components/dm-session/HandoutsManager';
import QuestGenerator from '../components/dm-session/QuestGenerator';
import DungeonGenerator from '../components/dm-session/DungeonGenerator';
import RumorGenerator from '../components/dm-session/RumorGenerator';
import ImprovAssistant from '../components/dm-session/ImprovAssistant';
import EncounterGenerator from '../components/dm-session/EncounterGenerator';
import BossGenerator from '../components/dm-session/BossGenerator';
import PuzzleGenerator from '../components/dm-session/PuzzleGenerator';
import TavernGenerator from '../components/dm-session/TavernGenerator';
import FactionManager from '../components/dm-session/FactionManager';
import WeatherPanel from '../components/dm-session/WeatherPanel';
import EconomyPanel from '../components/dm-session/EconomyPanel';
import TravelCalculator from '../components/dm-session/TravelCalculator';
import WorldEventsManager from '../components/dm-session/WorldEventsManager';
import WorldTimeline from '../components/dm-session/WorldTimeline';
import DisasterSystem from '../components/dm-session/DisasterSystem';
import AiModules from '../components/dm-session/AiModules';

const GENERATOR_TABS = [
  { key: 'dungeon', label: 'Dungeon', icon: DoorOpen },
  { key: 'encounter', label: 'Encounters', icon: Swords },
  { key: 'boss', label: 'Boss', icon: Skull },
  { key: 'rumor', label: 'Rumors', icon: MessageCircle },
  { key: 'improv', label: 'Improv', icon: User },
  { key: 'puzzle', label: 'Puzzles', icon: Layers },
  { key: 'tavern', label: 'Tavern', icon: Wine },
];

const SIMULATION_TABS = [
  { key: 'factions', label: 'Factions', icon: Shield },
  { key: 'weather', label: 'Weather', icon: CloudSun },
  { key: 'economy', label: 'Economy', icon: Coins },
  { key: 'travel', label: 'Travel', icon: Route },
  { key: 'events', label: 'Events', icon: AlertTriangle },
  { key: 'timeline', label: 'Timeline', icon: Calendar },
  { key: 'disaster', label: 'Disasters', icon: Globe },
];

export default function DMLobby() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useSession();

  const [campaign, setCampaign] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  // Scene form
  const [showSceneForm, setShowSceneForm] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [sceneName, setSceneName] = useState('');
  const [sceneDesc, setSceneDesc] = useState('');
  const [sceneLocation, setSceneLocation] = useState('');
  const [scenePhase, setScenePhase] = useState('exploration');
  const [sceneDmNotes, setSceneDmNotes] = useState('');
  const [scenePlayerDesc, setScenePlayerDesc] = useState('');
  const [sceneMood, setSceneMood] = useState('');
  const [scenePlayerVisible, setScenePlayerVisible] = useState(false);
  const [deleteSceneTarget, setDeleteSceneTarget] = useState(null);

  // Connected & pending players
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [serverAddress, setServerAddress] = useState(null);
  const pollRef = useRef(null);

  // Dev-only connection diagnostics
  const [connectionLog, setConnectionLog] = useState([]);
  const [wsErrors, setWsErrors] = useState([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const connectionLogRef = useRef([]);

  // Campaign settings (M-19)
  const [campaignSettings, setCampaignSettings] = useState({
    auto_approve_players: 'false',
    default_ruleset: 'dnd5e-2024',
    session_reminder_minutes: '15',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [lastSessionId, setLastSessionId] = useState(null);

  // DM Toolkit
  const [toolkitOpen, setToolkitOpen] = useState(false);
  const [activeGenerator, setActiveGenerator] = useState('dungeon');

  // World Simulation
  const [simOpen, setSimOpen] = useState(false);
  const [activeSimTab, setActiveSimTab] = useState('factions');

  // AI Modules (Phase 5)
  const [aiOpen, setAiOpen] = useState(false);

  const loadCampaignSettings = useCallback(async () => {
    try {
      const keys = ['auto_approve_players', 'default_ruleset', 'session_reminder_minutes'];
      const results = {};
      for (const key of keys) {
        const val = await invoke('get_campaign_setting', { key });
        if (val !== null) results[key] = val;
      }
      setCampaignSettings(prev => ({ ...prev, ...results }));
    } catch (e) {
      console.error('Failed to load campaign settings:', e);
    }
  }, []);

  const handleSettingChange = async (key, value) => {
    try {
      await invoke('set_campaign_setting', { key, value });
      setCampaignSettings(prev => ({ ...prev, [key]: value }));
    } catch (e) {
      toast.error('Failed to save setting');
      console.error(e);
    }
  };

  const loadLastSessionId = useCallback(async () => {
    try {
      const log = await invoke('get_session_log', { sessionId: '' });
      // Find the most recent session_start event
      if (log && log.length > 0) {
        const lastStart = [...log].reverse().find(e => e.event_type === 'session_start');
        if (lastStart) setLastSessionId(lastStart.session_id);
      }
    } catch {
      // No previous sessions — that's fine
    }
  }, []);

  const loadCampaign = useCallback(async () => {
    try {
      const data = await invoke('select_campaign', { campaignId });
      setCampaign(data);
      dispatch({ type: 'SET_CAMPAIGN', payload: { id: data.id, name: data.name, campaign_type: data.campaign_type } });
    } catch (e) {
      toast.error('Failed to load campaign');
      console.error(e);
      navigate('/');
    }
  }, [campaignId, dispatch, navigate]);

  const loadScenes = useCallback(async () => {
    try {
      const list = await invoke('list_scenes');
      setScenes(list);
    } catch (e) {
      console.error('Failed to load scenes:', e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadCampaign();
      await loadScenes();
      await loadCampaignSettings();
      loadLastSessionId();
      setLoading(false);
    })();
  }, [loadCampaign, loadScenes, loadCampaignSettings, loadLastSessionId]);

  // Poll connected players every 3 seconds
  useEffect(() => {
    const poll = async () => {
      try {
        const players = await invoke('ws_get_connected');
        const approved = players.filter(p => p.status === 'approved' || p.status === 'connected');
        const pending = players.filter(p => p.status === 'pending');
        setConnectedPlayers(approved);
        setPendingPlayers(pending);

        // Dev diagnostics: track connection changes
        if (import.meta.env.DEV) {
          const prevIds = new Set(connectionLogRef.current.filter(e => e.type === 'connected').map(e => e.uuid));
          const currentIds = new Set(players.map(p => p.uuid));
          for (const p of players) {
            if (!prevIds.has(p.uuid)) {
              const entry = { type: 'connected', uuid: p.uuid, name: p.name, status: p.status, time: new Date().toLocaleTimeString() };
              setConnectionLog(prev => [entry, ...prev].slice(0, 50));
            }
          }
          for (const id of prevIds) {
            if (!currentIds.has(id)) {
              const entry = { type: 'disconnected', uuid: id, time: new Date().toLocaleTimeString() };
              setConnectionLog(prev => [entry, ...prev].slice(0, 50));
            }
          }
          connectionLogRef.current = players.map(p => ({ type: 'connected', uuid: p.uuid }));
        }
      } catch (err) {
        if (import.meta.env.DEV && serverAddress) {
          setWsErrors(prev => [{
            message: String(err),
            time: new Date().toLocaleTimeString(),
          }, ...prev].slice(0, 20));
        }
      }
    };
    pollRef.current = setInterval(poll, 3000);
    return () => clearInterval(pollRef.current);
  }, [serverAddress]);

  // Listen for join requests & auto-approve if enabled
  useEffect(() => {
    let unlisten;
    (async () => {
      unlisten = await listen('session-join-request', (event) => {
        const player = event.payload;
        toast(`${player.name || 'A player'} wants to join!`, { icon: '🎲' });

        if (campaignSettings.auto_approve_players === 'true') {
          invoke('ws_approve_player', { player_uuid: player.uuid, snapshot_json: null })
            .then(() => toast.success(`Auto-approved ${player.name || 'player'}`))
            .catch(e => console.error('Auto-approve failed:', e));
        } else {
          setPendingPlayers(prev => {
            if (prev.find(p => p.uuid === player.uuid)) return prev;
            return [...prev, player];
          });
        }
      });
    })();
    return () => { if (unlisten) unlisten(); };
  }, [campaignSettings.auto_approve_players]);

  // Cleanup: stop WS server on unmount
  useEffect(() => {
    return () => {
      invoke('ws_stop_server').catch(() => {});
    };
  }, []);

  const handleApprovePlayer = async (uuid) => {
    try {
      await invoke('ws_approve_player', { player_uuid: uuid, snapshot_json: null });
      setPendingPlayers(prev => prev.filter(p => p.uuid !== uuid));
      toast.success('Player approved');
    } catch (e) {
      toast.error('Failed to approve player');
      console.error(e);
    }
  };

  const handleRejectPlayer = async (uuid) => {
    try {
      await invoke('ws_reject_player', { player_uuid: uuid, reason: 'Rejected by DM' });
      setPendingPlayers(prev => prev.filter(p => p.uuid !== uuid));
      toast.success('Player rejected');
    } catch (e) {
      toast.error('Failed to reject player');
      console.error(e);
    }
  };

  const handleStartSession = async () => {
    if (scenes.length === 0) {
      toast('Starting without scenes — you can add them during the session', { icon: '\u26A0\uFE0F', duration: 3000 });
    }
    setStarting(true);
    try {
      const result = await invoke('start_session');
      dispatch({
        type: 'START_SESSION',
        payload: { sessionId: result.session_id },
      });

      // Start WebSocket server
      try {
        const addr = await invoke('ws_start_server', {});
        setServerAddress(addr);
        toast.success(`Session started! WS server on ${addr}`);
      } catch (wsErr) {
        console.error('Failed to start WS server:', wsErr);
        toast.success('Session started! (WS server unavailable)');
      }

      navigate(`/dm/session/${campaignId}`);
    } catch (e) {
      toast.error('Failed to start session');
      console.error(e);
    } finally {
      setStarting(false);
    }
  };

  const handleSaveScene = async () => {
    if (!sceneName.trim()) {
      toast.error('Scene name is required');
      return;
    }
    try {
      if (editingScene) {
        await invoke('update_scene', {
          sceneId: editingScene.id,
          name: sceneName.trim(),
          description: sceneDesc.trim(),
          location: sceneLocation.trim(),
          phase: scenePhase,
          dmNotes: sceneDmNotes.trim(),
          playerDescription: scenePlayerDesc.trim(),
          mood: sceneMood.trim(),
          playerVisible: scenePlayerVisible,
        });
        toast.success('Scene updated');
      } else {
        await invoke('create_scene', {
          name: sceneName.trim(),
          description: sceneDesc.trim(),
          location: sceneLocation.trim(),
        });
        toast.success('Scene created');
      }
      resetSceneForm();
      loadScenes();
    } catch (e) {
      toast.error(editingScene ? 'Failed to update scene' : 'Failed to create scene');
      console.error(e);
    }
  };

  const handleDeleteScene = async (sceneId) => {
    try {
      await invoke('delete_scene', { sceneId });
      toast.success('Scene deleted');
      setDeleteSceneTarget(null);
      loadScenes();
    } catch (e) {
      toast.error('Failed to delete scene');
      console.error(e);
    }
  };

  const startEditScene = (scene) => {
    setEditingScene(scene);
    setSceneName(scene.name);
    setSceneDesc(scene.description || '');
    setSceneLocation(scene.location || '');
    setScenePhase(scene.phase || 'exploration');
    setSceneDmNotes(scene.dm_notes || '');
    setScenePlayerDesc(scene.player_description || '');
    setSceneMood(scene.mood || '');
    setScenePlayerVisible(!!scene.player_visible);
    setShowSceneForm(true);
  };

  const resetSceneForm = () => {
    setShowSceneForm(false);
    setEditingScene(null);
    setSceneName('');
    setSceneDesc('');
    setSceneLocation('');
    setScenePhase('exploration');
    setSceneDmNotes('');
    setScenePlayerDesc('');
    setSceneMood('');
    setScenePlayerVisible(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg, #04040b)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-dim)', fontFamily: 'var(--font-ui)',
        paddingTop: 'var(--dev-banner-h, 0px)',
      }}>
        Loading campaign...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg, #04040b)',
      padding: 'calc(var(--dev-banner-h, 0px) + 24px) 32px 32px',
      fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-dim)', fontSize: '13px', fontFamily: 'var(--font-ui)',
            padding: '4px 0', marginBottom: '20px', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
        >
          <ArrowLeft size={14} /> Back to Campaigns
        </button>

        {/* Campaign header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            marginBottom: '32px', gap: '16px',
          }}
        >
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display, "Cinzel", serif)',
              fontSize: '28px', fontWeight: 700,
              color: 'var(--text, #e8d9b5)', margin: 0,
            }}>
              {campaign?.name}
            </h1>
            {campaign?.description && (
              <p style={{ fontSize: '14px', color: 'var(--text-dim)', marginTop: '6px', maxWidth: '600px', lineHeight: 1.5 }}>
                {campaign.description}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <span style={{
                fontSize: '10px', fontWeight: 600,
                background: 'rgba(155,89,182,0.15)', color: '#c084fc',
                border: '1px solid rgba(155,89,182,0.3)',
                borderRadius: '4px', padding: '2px 10px',
                letterSpacing: '0.05em',
              }}>
                {campaign?.ruleset === 'dnd5e-2024' ? '2024 PHB' : campaign?.ruleset === 'dnd5e-2014' ? '2014 PHB' : campaign?.ruleset}
              </span>
            </div>
          </div>

          {/* Pre-session Checklist */}
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.1)', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Pre-session Checklist</div>
            <div style={{ display: 'grid', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: scenes.length > 0 ? '#4ade80' : '#fbbf24' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: scenes.length > 0 ? '#4ade80' : '#fbbf24' }} />
                {scenes.length > 0 ? `${scenes.length} scene(s) created` : 'No scenes created (recommended)'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: connectedPlayers.length > 0 ? '#4ade80' : '#fbbf24' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: connectedPlayers.length > 0 ? '#4ade80' : '#fbbf24' }} />
                {connectedPlayers.length > 0 ? `${connectedPlayers.length} player(s) connected` : 'No players connected (recommended)'}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartSession}
            disabled={starting}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '10px',
              background: starting
                ? 'rgba(74,222,128,0.1)'
                : 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,197,94,0.15))',
              border: '1px solid rgba(74,222,128,0.35)',
              color: starting ? 'rgba(74,222,128,0.4)' : '#4ade80',
              fontSize: '15px', fontWeight: 700,
              cursor: starting ? 'wait' : 'pointer',
              fontFamily: 'var(--font-ui)', flexShrink: 0,
              transition: 'all 0.15s',
              boxShadow: starting ? 'none' : '0 0 20px rgba(74,222,128,0.15)',
            }}
            onMouseEnter={e => {
              if (!starting) {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(74,222,128,0.3), rgba(34,197,94,0.25))';
                e.currentTarget.style.boxShadow = '0 0 28px rgba(74,222,128,0.25)';
              }
            }}
            onMouseLeave={e => {
              if (!starting) {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,197,94,0.15))';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(74,222,128,0.15)';
              }
            }}
          >
            <Play size={18} /> {starting ? 'Starting...' : 'Start Session'}
          </button>
        </motion.div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          {/* Left: Scenes */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600,
                color: 'var(--text)', margin: 0,
              }}>
                Scenes
              </h2>
              <button
                onClick={() => { resetSceneForm(); setShowSceneForm(true); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-dim)', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'var(--text)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'var(--text-dim)';
                }}
              >
                <Plus size={12} /> Add Scene
              </button>
            </div>

            {/* Scene form */}
            <AnimatePresence>
              {showSceneForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginBottom: '12px' }}
                >
                  <div style={{
                    padding: '16px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(155,89,182,0.2)',
                  }}>
                    <input
                      type="text"
                      value={sceneName}
                      onChange={e => setSceneName(e.target.value)}
                      placeholder="Scene name"
                      autoFocus
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text)', fontSize: '13px',
                        fontFamily: 'var(--font-ui)', outline: 'none',
                        marginBottom: '8px', boxSizing: 'border-box',
                      }}
                    />
                    <input
                      type="text"
                      value={sceneLocation}
                      onChange={e => setSceneLocation(e.target.value)}
                      placeholder="Location (optional)"
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text)', fontSize: '13px',
                        fontFamily: 'var(--font-ui)', outline: 'none',
                        marginBottom: '8px', boxSizing: 'border-box',
                      }}
                    />
                    <textarea
                      value={sceneDesc}
                      onChange={e => setSceneDesc(e.target.value)}
                      placeholder="Description (DM-only)"
                      rows={2}
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text)', fontSize: '13px',
                        fontFamily: 'var(--font-ui)', outline: 'none',
                        resize: 'vertical', marginBottom: '8px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <textarea
                      value={scenePlayerDesc}
                      onChange={e => setScenePlayerDesc(e.target.value)}
                      placeholder="Player-visible description (what players see about this location)"
                      rows={2}
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(74,222,128,0.15)',
                        color: 'var(--text)', fontSize: '13px',
                        fontFamily: 'var(--font-ui)', outline: 'none',
                        resize: 'vertical', marginBottom: '8px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={sceneMood}
                        onChange={e => setSceneMood(e.target.value)}
                        placeholder="Mood (e.g. eerie, bustling)"
                        style={{
                          flex: 1, minWidth: '120px', padding: '6px 10px', borderRadius: '6px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text)', fontSize: '12px',
                          fontFamily: 'var(--font-ui)', outline: 'none',
                        }}
                      />
                      <select
                        value={scenePhase}
                        onChange={e => setScenePhase(e.target.value)}
                        style={{
                          padding: '6px 10px', borderRadius: '6px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text)', fontSize: '12px',
                          fontFamily: 'var(--font-ui)', outline: 'none',
                        }}
                      >
                        <option value="exploration">Exploration</option>
                        <option value="roleplay">Roleplay</option>
                        <option value="combat">Combat</option>
                      </select>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', color: scenePlayerVisible ? '#4ade80' : 'var(--text-mute)',
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={scenePlayerVisible}
                          onChange={e => setScenePlayerVisible(e.target.checked)}
                          style={{ accentColor: '#4ade80' }}
                        />
                        Visible to players
                      </label>
                    </div>
                    <textarea
                      value={sceneDmNotes}
                      onChange={e => setSceneDmNotes(e.target.value)}
                      placeholder="DM notes (private)"
                      rows={2}
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(251,191,36,0.15)',
                        color: 'var(--text)', fontSize: '13px',
                        fontFamily: 'var(--font-ui)', outline: 'none',
                        resize: 'vertical', marginBottom: '10px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={resetSceneForm}
                        style={{
                          padding: '6px 14px', borderRadius: '6px',
                          background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text-dim)', fontSize: '12px',
                          cursor: 'pointer', fontFamily: 'var(--font-ui)',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <X size={12} /> Cancel
                      </button>
                      <button
                        onClick={handleSaveScene}
                        disabled={!sceneName.trim()}
                        style={{
                          padding: '6px 14px', borderRadius: '6px',
                          background: sceneName.trim() ? 'rgba(155,89,182,0.2)' : 'rgba(155,89,182,0.05)',
                          border: '1px solid rgba(155,89,182,0.3)',
                          color: sceneName.trim() ? '#c084fc' : 'rgba(192,132,252,0.3)',
                          fontSize: '12px', fontWeight: 600,
                          cursor: sceneName.trim() ? 'pointer' : 'not-allowed',
                          fontFamily: 'var(--font-ui)',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <Check size={12} /> {editingScene ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scene list */}
            {scenes.length === 0 && !showSceneForm ? (
              <div style={{
                textAlign: 'center', padding: '40px 0',
                color: 'var(--text-mute)', fontSize: '13px',
              }}>
                <MapPin size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p>No scenes yet. Add your first scene to plan the session.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '8px' }}>
                {scenes.map((scene, i) => (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      padding: '12px 16px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', gap: '12px',
                    }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      background: scene.completed ? 'rgba(74,222,128,0.15)' : 'rgba(155,89,182,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: scene.completed ? '#4ade80' : '#c084fc',
                      fontSize: '12px', fontWeight: 700, flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                        {scene.name}
                      </div>
                      {scene.location && (
                        <div style={{
                          fontSize: '11px', color: 'var(--text-mute)',
                          display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px',
                        }}>
                          <MapPin size={9} /> {scene.location}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => startEditScene(scene)}
                      title="Edit scene"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-mute)', padding: '4px',
                        display: 'flex', alignItems: 'center',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-mute)'}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteSceneTarget(scene)}
                      title="Delete scene"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-mute)', padding: '4px',
                        display: 'flex', alignItems: 'center',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-mute)'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Connected Players + Extras */}
          <div style={{ display: 'grid', gap: '16px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600,
              color: 'var(--text)', margin: '0 0 0',
            }}>
              Players
            </h2>
            <div style={{
              padding: '20px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {/* Server address */}
              {serverAddress && (
                <div style={{
                  marginBottom: '12px', padding: '8px 12px', borderRadius: '8px',
                  background: 'rgba(74,222,128,0.08)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  fontSize: '11px', color: '#4ade80',
                  fontFamily: 'var(--font-mono, monospace)',
                  wordBreak: 'break-all',
                }}>
                  Server: {serverAddress}
                </div>
              )}

              {/* Pending players */}
              {pendingPlayers.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    fontSize: '10px', fontWeight: 700, color: 'var(--text-mute)',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    Pending Approval
                  </div>
                  <div style={{ display: 'grid', gap: '6px' }}>
                    {pendingPlayers.map(p => (
                      <div key={p.uuid} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', borderRadius: '8px',
                        background: 'rgba(234,179,8,0.06)',
                        border: '1px solid rgba(234,179,8,0.15)',
                      }}>
                        <div style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: '#eab308',
                        }} />
                        <span style={{ fontSize: '13px', color: 'var(--text)', flex: 1 }}>
                          {p.name || p.uuid?.slice(0, 8)}
                        </span>
                        <button
                          onClick={() => handleApprovePlayer(p.uuid)}
                          title="Approve"
                          style={{
                            background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
                            borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                            color: '#4ade80', fontSize: '11px', fontWeight: 600,
                            fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: '4px',
                          }}
                        >
                          <Check size={11} /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectPlayer(p.uuid)}
                          title="Reject"
                          style={{
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                            color: '#ef4444', fontSize: '11px', fontWeight: 600,
                            fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: '4px',
                          }}
                        >
                          <X size={11} /> Reject
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected players */}
              {connectedPlayers.length === 0 && pendingPlayers.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '24px 0',
                  color: 'var(--text-mute)', fontSize: '13px',
                }}>
                  <Users size={28} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p style={{ margin: 0 }}>No players connected</p>
                  <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                    Players will appear here when they join via Party Connect
                  </p>
                </div>
              ) : connectedPlayers.length > 0 && (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {connectedPlayers.map(p => (
                    <div key={p.uuid || p.id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 12px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                    }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: '#4ade80',
                      }} />
                      <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                        {p.name || p.uuid?.slice(0, 8)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session Recap (M-12) */}
            {lastSessionId && (
              <SessionRecap sessionId={lastSessionId} />
            )}

            {/* Handouts Manager (M-13) */}
            <HandoutsManager />

            {/* Campaign Settings (M-19) */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-mute)',
                  fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                <Settings size={12} /> Campaign Settings
              </button>
              {showSettings && (
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  padding: '12px',
                }}>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: '12px', color: 'var(--text-dim)',
                    }}>
                      <span>Auto-approve players</span>
                      <button
                        onClick={() => handleSettingChange('auto_approve_players',
                          campaignSettings.auto_approve_players === 'true' ? 'false' : 'true')}
                        style={{
                          width: '36px', height: '20px', borderRadius: '10px',
                          border: 'none', cursor: 'pointer',
                          background: campaignSettings.auto_approve_players === 'true'
                            ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)',
                          position: 'relative', transition: 'background 0.2s',
                        }}
                      >
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '50%',
                          background: campaignSettings.auto_approve_players === 'true' ? '#4ade80' : '#666',
                          position: 'absolute', top: '2px',
                          left: campaignSettings.auto_approve_players === 'true' ? '18px' : '2px',
                          transition: 'left 0.2s, background 0.2s',
                        }} />
                      </button>
                    </label>
                    <label style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: '12px', color: 'var(--text-dim)',
                    }}>
                      <span>Default Ruleset</span>
                      <select
                        value={campaignSettings.default_ruleset}
                        onChange={e => handleSettingChange('default_ruleset', e.target.value)}
                        style={{
                          padding: '4px 8px', borderRadius: '4px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text)', fontSize: '11px',
                          fontFamily: 'var(--font-ui)', outline: 'none',
                        }}
                      >
                        <option value="dnd5e-2024">5e 2024</option>
                        <option value="dnd5e-2014">5e 2014</option>
                      </select>
                    </label>
                    <label style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: '12px', color: 'var(--text-dim)',
                    }}>
                      <span>Session reminder (min)</span>
                      <input
                        type="number"
                        value={campaignSettings.session_reminder_minutes}
                        onChange={e => handleSettingChange('session_reminder_minutes', e.target.value)}
                        min={0} max={120}
                        style={{
                          width: '60px', padding: '4px 8px', borderRadius: '4px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text)', fontSize: '11px',
                          fontFamily: 'var(--font-ui)', outline: 'none',
                          textAlign: 'center',
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* AI Quest Generator (M-20) */}
            <QuestGenerator />

            {/* DM Toolkit — Generators (Phase 3) */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <button
                onClick={() => setToolkitOpen(!toolkitOpen)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-mute)',
                  fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                {toolkitOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <Wand2 size={12} /> DM Toolkit
                <span style={{ fontSize: '9px', opacity: 0.5, fontWeight: 400, letterSpacing: '0.02em', textTransform: 'none' }}>
                  7 generators
                </span>
              </button>
              {toolkitOpen && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Generator tab bar */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '4px',
                    padding: '8px 10px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    {GENERATOR_TABS.map(t => {
                      const Icon = t.icon;
                      const active = activeGenerator === t.key;
                      return (
                        <button
                          key={t.key}
                          onClick={() => setActiveGenerator(t.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '4px 10px', borderRadius: '6px',
                            fontSize: '10px', fontWeight: 600,
                            background: active ? 'rgba(155,89,182,0.2)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${active ? 'rgba(155,89,182,0.4)' : 'rgba(255,255,255,0.06)'}`,
                            color: active ? '#c084fc' : 'var(--text-mute)',
                            cursor: 'pointer', fontFamily: 'var(--font-ui)',
                            transition: 'all 0.15s',
                          }}
                        >
                          <Icon size={10} /> {t.label}
                        </button>
                      );
                    })}
                  </div>
                  {/* Active generator */}
                  <div style={{ padding: '12px' }}>
                    {activeGenerator === 'dungeon' && <DungeonGenerator />}
                    {activeGenerator === 'encounter' && <EncounterGenerator />}
                    {activeGenerator === 'boss' && <BossGenerator />}
                    {activeGenerator === 'rumor' && <RumorGenerator />}
                    {activeGenerator === 'improv' && <ImprovAssistant />}
                    {activeGenerator === 'puzzle' && <PuzzleGenerator />}
                    {activeGenerator === 'tavern' && <TavernGenerator />}
                  </div>
                </div>
              )}
            </div>

            {/* World Simulation (Phase 4) */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <button
                onClick={() => setSimOpen(!simOpen)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-mute)',
                  fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                {simOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <Globe size={12} /> World Simulation
                <span style={{ fontSize: '9px', opacity: 0.5, fontWeight: 400, letterSpacing: '0.02em', textTransform: 'none' }}>
                  factions, weather, economy & more
                </span>
              </button>
              {simOpen && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '4px',
                    padding: '8px 10px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    {SIMULATION_TABS.map(t => {
                      const Icon = t.icon;
                      const active = activeSimTab === t.key;
                      return (
                        <button
                          key={t.key}
                          onClick={() => setActiveSimTab(t.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '4px 10px', borderRadius: '6px',
                            fontSize: '10px', fontWeight: 600,
                            background: active ? 'rgba(155,89,182,0.2)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${active ? 'rgba(155,89,182,0.4)' : 'rgba(255,255,255,0.06)'}`,
                            color: active ? '#c084fc' : 'var(--text-mute)',
                            cursor: 'pointer', fontFamily: 'var(--font-ui)',
                            transition: 'all 0.15s',
                          }}
                        >
                          <Icon size={10} /> {t.label}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ padding: '12px' }}>
                    {activeSimTab === 'factions' && <FactionManager />}
                    {activeSimTab === 'weather' && <WeatherPanel />}
                    {activeSimTab === 'economy' && <EconomyPanel />}
                    {activeSimTab === 'travel' && <TravelCalculator />}
                    {activeSimTab === 'events' && <WorldEventsManager />}
                    {activeSimTab === 'timeline' && <WorldTimeline />}
                    {activeSimTab === 'disaster' && <DisasterSystem />}
                  </div>
                </div>
              )}
            </div>

            {/* AI Modules (Phase 5) */}
            <div style={{
              background: 'rgba(139,92,246,0.02)',
              border: '1px solid rgba(139,92,246,0.1)',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <button
                onClick={() => setAiOpen(!aiOpen)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'rgba(139,92,246,0.7)',
                  fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                {aiOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <Sparkles size={12} /> AI Modules
                <span style={{ fontSize: '9px', opacity: 0.5, fontWeight: 400, letterSpacing: '0.02em', textTransform: 'none' }}>
                  9 generators powered by Ollama
                </span>
              </button>
              {aiOpen && (
                <div style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}>
                  <AiModules />
                </div>
              )}
            </div>

            {/* Dev-only Connection Diagnostics */}
            {import.meta.env.DEV && (
              <div style={{
                background: 'rgba(59,130,246,0.04)',
                border: '1px solid rgba(59,130,246,0.15)',
                borderRadius: '12px', overflow: 'hidden',
              }}>
                <button
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px', background: 'none', border: 'none',
                    cursor: 'pointer', color: '#60a5fa',
                    fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: serverAddress ? '#4ade80' : '#ef4444',
                    display: 'inline-block',
                  }} />
                  WS Diagnostics {showDiagnostics ? '▾' : '▸'}
                </button>
                {showDiagnostics && (
                  <div style={{
                    borderTop: '1px solid rgba(59,130,246,0.1)',
                    padding: '12px', fontSize: '11px',
                    fontFamily: 'var(--font-mono, monospace)',
                    color: 'var(--text-dim)',
                  }}>
                    {/* Server status */}
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '4px', fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Server
                      </div>
                      <div style={{ display: 'grid', gap: '2px' }}>
                        <div>Status: <span style={{ color: serverAddress ? '#4ade80' : '#fbbf24' }}>{serverAddress ? 'Running' : 'Not started'}</span></div>
                        {serverAddress && <div>Address: <span style={{ color: 'var(--text)' }}>{serverAddress}</span></div>}
                        <div>Connected: <span style={{ color: 'var(--text)' }}>{connectedPlayers.length}</span> | Pending: <span style={{ color: 'var(--text)' }}>{pendingPlayers.length}</span></div>
                      </div>
                    </div>

                    {/* Per-connection detail */}
                    {connectedPlayers.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '4px', fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          Active Connections
                        </div>
                        <div style={{ display: 'grid', gap: '4px' }}>
                          {connectedPlayers.map(p => (
                            <div key={p.uuid || p.id} style={{
                              padding: '4px 8px', borderRadius: '4px',
                              background: 'rgba(255,255,255,0.03)',
                              display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                              <span style={{
                                width: '5px', height: '5px', borderRadius: '50%',
                                background: '#4ade80', display: 'inline-block', flexShrink: 0,
                              }} />
                              <span style={{ flex: 1, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.name || 'Unknown'}
                              </span>
                              <span style={{ color: 'var(--text-mute)', fontSize: '10px' }}>
                                {p.uuid?.slice(0, 8)}
                              </span>
                              <span style={{
                                fontSize: '9px', padding: '1px 6px', borderRadius: '3px',
                                background: p.status === 'approved' ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                                color: p.status === 'approved' ? '#4ade80' : 'var(--text-mute)',
                              }}>
                                {p.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Errors */}
                    {wsErrors.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{
                          fontWeight: 700, color: '#ef4444', marginBottom: '4px', fontSize: '9px',
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <span>Errors ({wsErrors.length})</span>
                          <button
                            onClick={() => setWsErrors([])}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: '#ef4444', fontSize: '9px', fontFamily: 'var(--font-mono)',
                              padding: 0, opacity: 0.7,
                            }}
                          >
                            clear
                          </button>
                        </div>
                        <div style={{ display: 'grid', gap: '2px', maxHeight: '80px', overflowY: 'auto' }}>
                          {wsErrors.map((err, i) => (
                            <div key={i} style={{ color: '#fca5a5', fontSize: '10px' }}>
                              <span style={{ color: '#ef4444', opacity: 0.6 }}>[{err.time}]</span> {err.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Connection event log */}
                    <div>
                      <div style={{
                        fontWeight: 700, color: '#60a5fa', marginBottom: '4px', fontSize: '9px',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <span>Event Log</span>
                        <button
                          onClick={() => setConnectionLog([])}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#60a5fa', fontSize: '9px', fontFamily: 'var(--font-mono)',
                            padding: 0, opacity: 0.7,
                          }}
                        >
                          clear
                        </button>
                      </div>
                      {connectionLog.length === 0 ? (
                        <div style={{ color: 'var(--text-mute)', fontSize: '10px', opacity: 0.5 }}>
                          No events yet
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gap: '1px', maxHeight: '120px', overflowY: 'auto' }}>
                          {connectionLog.map((entry, i) => (
                            <div key={i} style={{ fontSize: '10px' }}>
                              <span style={{ color: 'var(--text-mute)', opacity: 0.5 }}>[{entry.time}]</span>{' '}
                              <span style={{ color: entry.type === 'connected' ? '#4ade80' : entry.type === 'disconnected' ? '#ef4444' : '#fbbf24' }}>
                                {entry.type}
                              </span>{' '}
                              <span style={{ color: 'var(--text-dim)' }}>
                                {entry.name || entry.uuid?.slice(0, 8) || ''}
                                {entry.status ? ` (${entry.status})` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete scene confirmation */}
      {deleteSceneTarget && (
        <ConfirmDialog
          title="Delete Scene"
          message={`Delete "${deleteSceneTarget.name}"? This will also remove all encounters in this scene.`}
          confirmLabel="Delete"
          onConfirm={() => handleDeleteScene(deleteSceneTarget.id)}
          onCancel={() => setDeleteSceneTarget(null)}
        />
      )}
    </div>
  );
}
