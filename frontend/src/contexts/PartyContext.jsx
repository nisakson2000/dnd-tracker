import { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000];

const PartyContext = createContext(null);

export function useParty() {
  const ctx = useContext(PartyContext);
  if (!ctx) throw new Error('useParty must be used within a PartyProvider');
  return ctx;
}

export function PartyProvider({ children }) {
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
  const connectingRef = useRef(false);
  const connectedRef = useRef(false);
  const connRef = useRef({ hostIp, roomCode, joinIp, mode });
  const charSnapshotRef = useRef(null);
  const onBugReportRef = useRef(null);
  const unlistenRef = useRef(null);

  // Keep connRef in sync
  useEffect(() => {
    connRef.current = { hostIp, roomCode, joinIp, mode };
  }, [hostIp, roomCode, joinIp, mode]);

  const clearTimers = useCallback(() => {
    if (pingIntervalRef.current) { clearInterval(pingIntervalRef.current); pingIntervalRef.current = null; }
    if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }
  }, []);

  // Process incoming messages from the Rust backend via Tauri events
  const handleMessage = useCallback((data) => {
    try {
      const msg = typeof data === 'string' ? JSON.parse(data) : data;
      if (msg.type === 'welcome') {
        setWsStatus('connected');
        connectedRef.current = true;
        reconnectCountRef.current = 0;
        setMembers(msg.members || []);
        setMyClientId(msg.you);
        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          const rc = connRef.current.roomCode;
          invoke('party_ipc_send', { message: JSON.stringify({ type: 'ping', room: rc }) }).catch(() => {});
        }, 25000);
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
      } else if (msg.type === 'connection_closed') {
        // Remote connection dropped
        handleConnectionLost();
      }
    } catch { /* ignore parse errors */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnectionLost = useCallback(() => {
    clearTimers();
    connectedRef.current = false;
    setWsStatus('disconnected');

    if (!intentionalCloseRef.current && connRef.current.roomCode && (connRef.current.mode === 'host' || connRef.current.joinIp)) {
      const attempt = reconnectCountRef.current;
      const delay = RECONNECT_DELAYS[Math.min(attempt, RECONNECT_DELAYS.length - 1)];
      reconnectCountRef.current = attempt + 1;

      if (attempt < 10) {
        toast(`Connection lost \u2014 retrying in ${Math.round(delay / 1000)}s\u2026`, { icon: '\uD83D\uDD04', duration: delay });
        reconnectTimerRef.current = setTimeout(() => {
          if (!intentionalCloseRef.current) connect(charSnapshotRef.current);
        }, delay);
      } else {
        toast.error('Could not reconnect after multiple attempts. Try rejoining manually.', { duration: 6000 });
      }
    }
  }, [clearTimers]); // eslint-disable-line react-hooks/exhaustive-deps

  const connect = useCallback(async (charSnapshot) => {
    if (connectingRef.current || connectedRef.current) return;
    const { mode: m, roomCode: code, joinIp: jip } = connRef.current;
    if (!code || !m) return;

    if (charSnapshot) charSnapshotRef.current = charSnapshot;
    const snap = charSnapshotRef.current || charSnapshot;

    clearTimers();
    setWsStatus('connecting');
    intentionalCloseRef.current = false;
    connectingRef.current = true;

    try {
      // Set up the event listener for messages from Rust
      if (unlistenRef.current) {
        unlistenRef.current();
        unlistenRef.current = null;
      }
      unlistenRef.current = await listen('party-message', (event) => {
        handleMessage(event.payload);
      });

      if (m === 'host') {
        // Host: join our own server directly via IPC
        console.log('[Party] Joining own server via IPC, room:', code);
        const result = await invoke('party_ipc_join', { room: code, character: snap || {} });
        console.log('[Party] Host joined:', result);
        // Process the welcome message directly from the invoke result
        if (result?.welcome) {
          handleMessage(result.welcome);
        }
      } else {
        // Player: connect to remote DM server via Rust WebSocket client
        console.log('[Party] Connecting to remote server via IPC:', jip, code);
        await invoke('party_ipc_connect', { ip: jip, room: code, character: snap || {} });
        console.log('[Party] Player connected');
      }
    } catch (err) {
      console.error('[Party] Connection failed:', err);
      setWsStatus('disconnected');
      connectingRef.current = false;
      if (reconnectCountRef.current === 0) {
        toast.error(`Could not connect: ${err?.message || err}`, { duration: 5000 });
      }
      // Trigger reconnect logic
      handleConnectionLost();
      return;
    }

    connectingRef.current = false;

    // Wait up to 5s for welcome message
    setTimeout(() => {
      if (!connectedRef.current && !intentionalCloseRef.current) {
        setWsStatus('disconnected');
        toast.error('Joined server but room handshake failed \u2014 check your room code', { duration: 5000 });
      }
    }, 5000);
  }, [clearTimers, handleMessage, handleConnectionLost]);

  const disconnect = useCallback(async () => {
    intentionalCloseRef.current = true;
    connectingRef.current = false;
    connectedRef.current = false;
    clearTimers();
    reconnectCountRef.current = 0;

    try {
      await invoke('party_ipc_disconnect');
    } catch { /* ignore */ }

    if (unlistenRef.current) {
      unlistenRef.current();
      unlistenRef.current = null;
    }

    setWsStatus('disconnected');
  }, [clearTimers]);

  const sendUpdate = useCallback(async (charSnapshot) => {
    if (charSnapshot) charSnapshotRef.current = charSnapshot;
    const code = connRef.current.roomCode;
    if (!connectedRef.current || !code) return;
    try {
      await invoke('party_ipc_send', {
        message: JSON.stringify({ type: 'update', room: code, character: charSnapshot }),
      });
    } catch { /* ignore */ }
  }, []);

  const sendBugReport = useCallback(async (report) => {
    const code = connRef.current.roomCode;
    if (!connectedRef.current || !code) return;
    try {
      await invoke('party_ipc_send', {
        message: JSON.stringify({ type: 'bug_report', room: code, report }),
      });
    } catch { /* ignore */ }
  }, []);

  const handleHost = useCallback(async () => {
    try {
      console.log('[Party] Starting party server...');
      await invoke('start_party_server');
      console.log('[Party] Server started');

      let ip = 'localhost';
      try { ip = await invoke('get_local_ip'); } catch { /* fallback */ }
      setHostIp(ip);

      console.log('[Party] Creating room via IPC...');
      const code = await invoke('create_party_room');
      console.log('[Party] Room created:', code);
      setRoomCode(code);
      setMode('host');
    } catch (err) {
      console.error('[Party] Host failed:', err);
      toast.error(`Could not start party server: ${err?.message || err}`, { duration: 6000 });
    }
  }, []);

  const handleLeave = useCallback(async () => {
    await disconnect();
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unlistenRef.current) unlistenRef.current();
    };
  }, []);

  const value = useMemo(() => ({
    wsStatus, mode, roomCode, hostIp, joinIp, joinInput, members, myClientId, autoSync,
    setMode, setRoomCode, setHostIp, setJoinIp, setJoinInput, setAutoSync,
    connect, disconnect, sendUpdate, sendBugReport, handleHost, handleLeave,
    onBugReportRef,
  }), [wsStatus, mode, roomCode, hostIp, joinIp, joinInput, members, myClientId, autoSync,
       connect, disconnect, sendUpdate, sendBugReport, handleHost, handleLeave]);

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
}
