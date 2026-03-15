import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, ArrowLeft, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useSession } from '../contexts/SessionContext';

export default function PlayerJoin() {
  const navigate = useNavigate();
  const [dmIp, setDmIp] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [characters, setCharacters] = useState([]);
  const [selectedCharId, setSelectedCharId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected | connecting | pending | connected | error
  const connectedRef = useRef(false);
  const { dispatch } = useSession();

  useEffect(() => {
    invoke('list_characters')
      .then(list => {
        setCharacters(list);
        if (list.length === 1) setSelectedCharId(list[0].id);
      })
      .catch(e => {
        console.error('Failed to load characters:', e);
        toast.error('Failed to load characters');
      });
  }, []);

  const handleConnect = async () => {
    if (!dmIp.trim() || !selectedCharId) return;
    setConnecting(true);
    setConnectionStatus('connecting');
    try {
      // Get character data for the summary
      const charData = characters.find(c => c.id === selectedCharId);
      const summary = JSON.stringify({
        name: charData?.name || 'Unknown',
        race: charData?.race || '',
        class: charData?.primary_class || '',
        level: charData?.level || 1,
        hp: charData?.current_hp || 0,
        maxHp: charData?.max_hp || 0,
        ruleset: charData?.ruleset || '5e-2014',
      });

      // Generate a UUID for this player
      const playerUuid = selectedCharId; // use character ID as player UUID

      await invoke('ws_connect_to_dm', {
        ip: dmIp.trim(),
        port: 7878,
        playerUuid,
        displayName: charData?.name || 'Player',
        characterSummary: summary,
      });

      connectedRef.current = true;
      dispatch({ type: 'SET_PLAYER_UUID', payload: selectedCharId });
      setConnectionStatus('pending');
      toast.success('Connected! Waiting for DM approval...');
    } catch (e) {
      toast.error(`Connection failed: ${e}`);
      setConnectionStatus('error');
    } finally {
      setConnecting(false);
    }
  };

  // Listen for approval/rejection and connection status from Tauri backend
  useEffect(() => {
    const unlisten = [];

    listen('session-game-event', (event) => {
      const payload = event.payload;
      if (payload?.event_type === 'JoinApproved' || payload?.type === 'JoinApproved') {
        setConnectionStatus('connected');
        toast.success('Approved! Joining session...');
        setTimeout(() => navigate('/player/session'), 600);
      } else if (payload?.event_type === 'JoinDenied' || payload?.type === 'JoinDenied') {
        const reason = payload?.reason || 'DM denied your join request';
        toast.error(reason);
        setConnectionStatus('disconnected');
        connectedRef.current = false;
      }
    }).then(fn => unlisten.push(fn));

    listen('session-connection-status', (event) => {
      const status = event.payload?.status || event.payload;
      if (typeof status === 'string') {
        setConnectionStatus(status);
        if (status === 'disconnected') connectedRef.current = false;
      }
    }).then(fn => unlisten.push(fn));

    return () => {
      unlisten.forEach(fn => fn());
    };
  }, [navigate]);

  // Disconnect on unmount if connected
  useEffect(() => {
    return () => {
      if (connectedRef.current) {
        invoke('ws_disconnect_from_dm').catch(() => {});
      }
    };
  }, []);

  const statusColors = {
    disconnected: { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-mute)', icon: WifiOff },
    connecting: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', icon: Loader2 },
    pending: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', icon: Loader2 },
    connected: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', icon: Wifi },
    error: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', icon: WifiOff },
  };

  const status = statusColors[connectionStatus];
  const StatusIcon = status.icon;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg, #04040b)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
      paddingTop: 'var(--dev-banner-h, 0px)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '440px', padding: '0 24px' }}
      >
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-dim)', fontSize: '13px', fontFamily: 'var(--font-ui)',
            padding: '4px 0', marginBottom: '24px', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <h1 style={{
          fontFamily: 'var(--font-display, "Cinzel", serif)',
          fontSize: '28px', fontWeight: 700,
          color: 'var(--text, #e8d9b5)',
          margin: '0 0 6px',
        }}>
          Join Session
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: '0 0 32px' }}>
          Connect to a DM's live session
        </p>

        {/* Connection status indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 14px', borderRadius: '8px',
          background: status.bg,
          border: `1px solid ${status.color}22`,
          marginBottom: '24px',
        }}>
          <StatusIcon
            size={14}
            style={{
              color: status.color,
              ...(['connecting', 'pending'].includes(connectionStatus) ? { animation: 'spin 1s linear infinite' } : {}),
            }}
          />
          <span style={{ fontSize: '12px', color: status.color, fontWeight: 500 }}>
            {connectionStatus === 'disconnected' && 'Not connected'}
            {connectionStatus === 'connecting' && 'Connecting...'}
            {connectionStatus === 'pending' && 'Connected \u2014 waiting for DM approval'}
            {connectionStatus === 'connected' && 'Approved! Joining session...'}
            {connectionStatus === 'error' && 'Connection failed'}
          </span>
        </div>

        {/* DM IP */}
        <label style={{ display: 'block', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
            DM's IP Address
          </span>
          <input
            type="text"
            value={dmIp}
            onChange={e => setDmIp(e.target.value)}
            placeholder="e.g. 192.168.1.100"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text)', fontSize: '14px',
              fontFamily: 'var(--font-ui)', outline: 'none',
              transition: 'border-color 0.15s', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </label>

        {/* Room Code */}
        <label style={{ display: 'block', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
            Room Code <span style={{ fontWeight: 400, opacity: 0.5 }}>(optional)</span>
          </span>
          <input
            type="text"
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text)', fontSize: '14px',
              fontFamily: 'var(--font-ui)', outline: 'none',
              transition: 'border-color 0.15s', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </label>

        {/* Character selector */}
        <div style={{ marginBottom: '28px' }}>
          <span style={{
            fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)',
            display: 'block', marginBottom: '10px',
          }}>
            Select Character
          </span>
          {characters.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '24px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', color: 'var(--text-mute)', fontSize: '13px',
            }}>
              <User size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ margin: 0 }}>No characters found</p>
              <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
                Create a character first from the Dashboard
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {characters.map(c => {
                const isSelected = selectedCharId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCharId(c.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 14px', borderRadius: '10px',
                      background: isSelected ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      textAlign: 'left', transition: 'all 0.15s',
                      width: '100%',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      }
                    }}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      background: isSelected
                        ? 'linear-gradient(135deg, var(--accent, #c9a84c), var(--accent-l, #b8942f))'
                        : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 700,
                      color: isSelected ? 'white' : 'var(--text-dim)',
                      fontFamily: 'var(--font-display)', flexShrink: 0,
                    }}>
                      {c.name?.[0] || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px', fontWeight: 500,
                        color: isSelected ? 'var(--text)' : 'var(--text-dim)',
                      }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-mute)', marginTop: '1px' }}>
                        {[c.race, c.primary_class].filter(Boolean).join(' ')}
                        {c.level ? ` Lv ${c.level}` : ''}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: 'var(--accent, #c9a84c)',
                        boxShadow: '0 0 8px rgba(201,168,76,0.5)',
                        flexShrink: 0,
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Connect button */}
        <button
          onClick={handleConnect}
          disabled={connecting || !dmIp.trim() || !selectedCharId}
          style={{
            width: '100%', padding: '12px',
            borderRadius: '10px',
            background: connecting || !dmIp.trim() || !selectedCharId
              ? 'rgba(201,168,76,0.08)'
              : 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(184,148,47,0.15))',
            border: '1px solid rgba(201,168,76,0.3)',
            color: connecting || !dmIp.trim() || !selectedCharId
              ? 'rgba(201,168,76,0.3)'
              : '#c9a84c',
            fontSize: '15px', fontWeight: 700,
            cursor: connecting || !dmIp.trim() || !selectedCharId ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-ui)',
            transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <Wifi size={16} /> {connecting ? 'Connecting...' : 'Connect to Session'}
        </button>
      </motion.div>

      {/* Spin animation for connecting state */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
