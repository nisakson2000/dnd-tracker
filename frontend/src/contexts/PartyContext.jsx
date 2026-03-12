import { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';

const PARTY_PORT = 8787;
const CONNECT_TIMEOUT_MS = 8000;
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000];

const PartyContext = createContext(null);

export function useParty() {
  const ctx = useContext(PartyContext);
  if (!ctx) throw new Error('useParty must be used within a PartyProvider');
  return ctx;
}

export function PartyProvider({ children }) {
  const wsRef = useRef(null);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [mode, setMode] = useState(null); // null | 'host' | 'join'
  const [roomCode, setRoomCode] = useState('');
  const [hostIp, setHostIp] = useState('');
  const [joinIp, setJoinIp] = useState('');
  const [joinInput, setJoinInput] = useState('');
  const [members, setMembers] = useState([]);
  const [myClientId, setMyClientId] = useState(null);
  const [autoSync, setAutoSync] = useState(true);

  const pingIntervalRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectCountRef = useRef(0);
  const intentionalCloseRef = useRef(false);
  const connectingRef = useRef(false); // guard against concurrent connect calls
  const connRef = useRef({ hostIp, roomCode, joinIp, mode });
  const charSnapshotRef = useRef(null); // always-fresh character data for reconnect
  const onBugReportRef = useRef(null);

  // Keep connRef in sync
  useEffect(() => {
    connRef.current = { hostIp, roomCode, joinIp, mode };
  }, [hostIp, roomCode, joinIp, mode]);

  const clearTimers = useCallback(() => {
    if (pingIntervalRef.current) { clearInterval(pingIntervalRef.current); pingIntervalRef.current = null; }
    if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }
  }, []);

  const connect = useCallback((charSnapshot) => {
    // Guard: prevent concurrent connection attempts
    if (connectingRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return;
    const { mode: m, roomCode: code, hostIp: hip, joinIp: jip } = connRef.current;
    const ip = m === 'host' ? 'localhost' : jip;
    if (!code || !ip) return;

    // Store latest snapshot for reconnect
    if (charSnapshot) charSnapshotRef.current = charSnapshot;

    clearTimers();
    setWsStatus('connecting');
    intentionalCloseRef.current = false;
    connectingRef.current = true;

    let ws;
    try {
      ws = new WebSocket(`ws://${ip}:${PARTY_PORT}/party/ws`);
    } catch {
      setWsStatus('disconnected');
      connectingRef.current = false;
      toast.error('Invalid WebSocket URL — check the host IP', { duration: 5000 });
      return;
    }
    wsRef.current = ws;

    const timeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        ws.close();
        setWsStatus('disconnected');
        connectingRef.current = false;
        toast.error('Connection timed out — check the host IP and make sure you\'re on the same WiFi', { duration: 5000 });
      }
    }, CONNECT_TIMEOUT_MS);

    ws.onopen = () => {
      clearTimeout(timeout);
      connectingRef.current = false;
      reconnectCountRef.current = 0;
      const snap = charSnapshotRef.current || charSnapshot;
      ws.send(JSON.stringify({ type: 'join', room: code, character: snap }));

      const welcomeTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          setWsStatus('disconnected');
          ws.close();
          toast.error('Joined server but room handshake failed — check your room code', { duration: 5000 });
        }
      }, 5000);

      const origOnMessage = ws.onmessage;
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === 'welcome') {
            clearTimeout(welcomeTimeout);
            setWsStatus('connected');
            pingIntervalRef.current = setInterval(() => {
              const rc = connRef.current.roomCode;
              if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping', room: rc }));
            }, 25000);
          }
        } catch { /* handled below */ }
        if (origOnMessage) origOnMessage.call(ws, e);
      };
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'welcome') {
          setMembers(msg.members);
          setMyClientId(msg.you);
        } else if (msg.type === 'player_joined') {
          setMembers(prev => prev.find(m2 => m2.client_id === msg.member.client_id) ? prev : [...prev, msg.member]);
          toast.success(`${msg.member.character?.name || 'Someone'} joined the party!`, { icon: '\u2694\uFE0F' });
        } else if (msg.type === 'updated' && msg.member) {
          setMembers(prev => prev.map(m2 => m2.client_id === msg.member.client_id ? msg.member : m2));
        } else if (msg.type === 'player_disconnected' || msg.type === 'left') {
          setMembers(prev => {
            const leaving = prev.find(m2 => m2.client_id === msg.client_id);
            if (leaving) toast(`${leaving.character?.name || 'Someone'} left the party`, { icon: '\uD83D\uDC4B' });
            return prev.filter(m2 => m2.client_id !== msg.client_id);
          });
        } else if (msg.type === 'host_ended') {
          toast('The host ended the session', { icon: '\uD83C\uDFF0', duration: 4000 });
          intentionalCloseRef.current = true;
        } else if (msg.type === 'host_promoted') {
          toast('You are now the host', { icon: '\uD83D\uDC51', duration: 4000 });
        } else if (msg.type === 'bug_report' && onBugReportRef.current) {
          onBugReportRef.current(msg);
        } else if (msg.type === 'error') {
          toast.error(msg.message);
        }
      } catch { /* ignore parse errors */ }
    };

    ws.onclose = () => {
      clearTimeout(timeout);
      clearTimers();
      wsRef.current = null;
      connectingRef.current = false;
      setWsStatus('disconnected');

      if (!intentionalCloseRef.current && connRef.current.roomCode && (connRef.current.mode === 'host' || connRef.current.joinIp)) {
        const attempt = reconnectCountRef.current;
        const delay = RECONNECT_DELAYS[Math.min(attempt, RECONNECT_DELAYS.length - 1)];
        reconnectCountRef.current = attempt + 1;

        if (attempt < 10) {
          toast(`Connection lost — retrying in ${Math.round(delay / 1000)}s\u2026`, { icon: '\uD83D\uDD04', duration: delay });
          reconnectTimerRef.current = setTimeout(() => {
            // Use charSnapshotRef for fresh data instead of stale closure
            if (!intentionalCloseRef.current) connect(charSnapshotRef.current);
          }, delay);
        } else {
          toast.error('Could not reconnect after multiple attempts. Try rejoining manually.', { duration: 6000 });
        }
      }
    };

    ws.onerror = () => {
      if (reconnectCountRef.current === 0) {
        toast.error('Could not connect — is the host running and on the same network?', { duration: 5000 });
      }
    };
  }, [clearTimers]);

  // Cleanup all WebSocket resources on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      intentionalCloseRef.current = true;
      connectingRef.current = false;
      clearTimers();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [clearTimers]);

  const disconnect = useCallback(() => {
    intentionalCloseRef.current = true;
    connectingRef.current = false;
    clearTimers();
    reconnectCountRef.current = 0;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsStatus('disconnected');
  }, [clearTimers]);

  const sendUpdate = useCallback((charSnapshot) => {
    // Always keep the ref fresh so reconnect uses latest data
    if (charSnapshot) charSnapshotRef.current = charSnapshot;
    const code = connRef.current.roomCode;
    if (wsRef.current?.readyState === WebSocket.OPEN && code)
      wsRef.current.send(JSON.stringify({ type: 'update', room: code, character: charSnapshot }));
  }, []);

  const sendBugReport = useCallback((report) => {
    const code = connRef.current.roomCode;
    if (wsRef.current?.readyState === WebSocket.OPEN && code)
      wsRef.current.send(JSON.stringify({ type: 'bug_report', room: code, report }));
  }, []);

  const handleHost = useCallback(async () => {
    try {
      await invoke('start_party_server');
      let ip = 'localhost';
      try { ip = await invoke('get_local_ip'); } catch { /* fallback */ }
      setHostIp(ip);
      const res = await fetch(`http://localhost:${PARTY_PORT}/party/rooms`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create room');
      const data = await res.json();
      setRoomCode(data.room_code);
      setMode('host');
    } catch {
      toast.error('Could not start party server — is port 8787 available?', { duration: 5000 });
    }
  }, []);

  const handleLeave = useCallback(async () => {
    disconnect();
    if (connRef.current.mode === 'host') {
      try { await invoke('stop_party_server'); } catch { /* ignore */ }
    }
    setMode(null);
    setRoomCode('');
    setJoinInput('');
    setJoinIp('');
    setHostIp('');
    setMembers([]);
    setMyClientId(null);
  }, [disconnect]);

  const value = useMemo(() => ({
    // State
    wsStatus, mode, roomCode, hostIp, joinIp, joinInput, members, myClientId, autoSync,
    // Setters
    setMode, setRoomCode, setHostIp, setJoinIp, setJoinInput, setAutoSync,
    // Actions
    connect, disconnect, sendUpdate, sendBugReport, handleHost, handleLeave,
    // Ref for bug report callback
    onBugReportRef,
  }), [wsStatus, mode, roomCode, hostIp, joinIp, joinInput, members, myClientId, autoSync,
       connect, disconnect, sendUpdate, sendBugReport, handleHost, handleLeave]);

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
}
