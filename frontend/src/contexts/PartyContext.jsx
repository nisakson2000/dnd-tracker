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
  // autoSync is always on — no toggle needed
  const [wasConnected, setWasConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [memberPresence, setMemberPresence] = useState({}); // { clientId: { lastSeen, status } }
  const [chatMessages, setChatMessages] = useState([]); // max 100 IC/OOC chat messages
  const [hostInfo, setHostInfo] = useState(null); // { dmName, campaignName } from host's snapshot

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
  const eventListenersRef = useRef(new Map());
  const presenceIntervalRef = useRef(null);
  const membersRef = useRef([]);

  // Keep connRef in sync
  useEffect(() => {
    connRef.current = { hostIp, roomCode, joinIp, mode };
  }, [hostIp, roomCode, joinIp, mode]);

  // Keep membersRef in sync for presence interval
  useEffect(() => { membersRef.current = members; }, [members]);

  const clearTimers = useCallback(() => {
    if (pingIntervalRef.current) { clearInterval(pingIntervalRef.current); pingIntervalRef.current = null; }
    if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }
  }, []);

  // Update presence timestamp for a member
  const touchPresence = useCallback((clientId) => {
    if (!clientId) return;
    setMemberPresence(prev => ({
      ...prev,
      [clientId]: { lastSeen: Date.now(), status: 'online' },
    }));
  }, []);

  // Process incoming messages from the Rust backend via Tauri events
  const handleMessage = useCallback((data) => {
    try {
      const msg = typeof data === 'string' ? JSON.parse(data) : data;
      // Track presence for any message that has a sender/client_id
      if (msg.client_id) touchPresence(msg.client_id);
      if (msg.sender) touchPresence(msg.sender);
      if (msg.type === 'welcome') {
        setWsStatus('connected');
        connectedRef.current = true;
        reconnectCountRef.current = 0;
        setWasConnected(true);
        setReconnecting(false);
        setMembers(msg.members || []);
        setMyClientId(msg.you);
        // Extract host/DM info from members (host is the first member or the one with dm_name)
        const hostMember = (msg.members || []).find(m => m.character?.dm_name) || (msg.members || [])[0];
        if (hostMember?.character) {
          const info = {
            dmName: hostMember.character.dm_name || '',
            campaignName: hostMember.character.name || '',
          };
          setHostInfo(info);
          // Show welcome toast for joining players (not the host themselves)
          if (msg.you !== hostMember.client_id && (info.dmName || info.campaignName)) {
            const parts = [];
            if (info.campaignName) parts.push(`"${info.campaignName}"`);
            if (info.dmName) parts.push(`DM: ${info.dmName}`);
            toast(parts.join(' — '), { icon: '\uD83C\uDFF0', duration: 5000, style: { background: '#1a1625', border: '1px solid rgba(201,168,76,0.3)', color: '#f0e4c8', fontFamily: 'Cinzel, Georgia, serif' } });
          }
        }
        // Initialize presence for all members
        const now = Date.now();
        const initialPresence = {};
        (msg.members || []).forEach(m => { initialPresence[m.client_id] = { lastSeen: now, status: 'online' }; });
        setMemberPresence(initialPresence);
        // Load persisted chat messages for this room
        try {
          const code = connRef.current.roomCode;
          const raw = localStorage.getItem(`codex-chat-history-${code}`);
          if (raw) setChatMessages(JSON.parse(raw));
          else setChatMessages([]);
        } catch { setChatMessages([]); }
        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          const rc = connRef.current.roomCode;
          invoke('party_ipc_send', { message: JSON.stringify({ type: 'ping', room: rc }) }).catch(() => {});
        }, 25000);
      } else if (msg.type === 'player_joined') {
        setMembers(prev => prev.find(m2 => m2.client_id === msg.member.client_id) ? prev : [...prev, msg.member]);
        touchPresence(msg.member.client_id);
        toast.success(`${msg.member.character?.name || 'Someone'} joined the party!`, { icon: '\u2694\uFE0F' });
      } else if (msg.type === 'updated' && msg.member) {
        setMembers(prev => prev.map(m2 => m2.client_id === msg.member.client_id ? msg.member : m2));
        touchPresence(msg.member.client_id);
      } else if (msg.type === 'player_disconnected' || msg.type === 'left') {
        setMembers(prev => {
          const leaving = prev.find(m2 => m2.client_id === msg.client_id);
          if (leaving) toast(`${leaving.character?.name || 'Someone'} left the party`, { icon: '\uD83D\uDC4B' });
          return prev.filter(m2 => m2.client_id !== msg.client_id);
        });
      } else if (msg.type === 'host_ended') {
        toast('The DM disconnected — session ended', { icon: '\uD83C\uDFF0', duration: 5000 });
        intentionalCloseRef.current = true;
        // Fully disconnect and reset — don't try to reconnect
        clearTimers();
        connectedRef.current = false;
        connectingRef.current = false;
        try { invoke('party_ipc_disconnect').catch(() => {}); } catch {}
        if (unlistenRef.current) { unlistenRef.current(); unlistenRef.current = null; }
        setWsStatus('disconnected');
        setMode(null);
        setRoomCode('');
        setMembers([]);
        setMyClientId(null);
        setWasConnected(false);
        setReconnecting(false);
        setMemberPresence({});
        setChatMessages([]);
        setHostInfo(null);
      } else if (msg.type === 'host_promoted') {
        toast('You are now the host', { icon: '\uD83D\uDC51', duration: 4000 });
      } else if (msg.type === 'sync_event' && msg.event) {
        // Dispatch to registered event listeners
        const listeners = eventListenersRef.current.get(msg.event);
        if (listeners) {
          for (const handler of listeners.values()) {
            try { handler(msg); } catch { /* ignore listener errors */ }
          }
        }
        // Also dispatch to wildcard '*' listeners
        const wildcardListeners = eventListenersRef.current.get('*');
        if (wildcardListeners) {
          for (const handler of wildcardListeners.values()) {
            try { handler(msg); } catch { /* ignore */ }
          }
        }
      } else if (msg.type === 'bug_report' && onBugReportRef.current) {
        onBugReportRef.current(msg);
      } else if (msg.type === 'ic_chat' && msg.data) {
        // Incoming chat message from another party member
        setChatMessages(prev => {
          // Deduplicate by id
          if (msg.data.id && prev.some(m => m.id === msg.data.id)) return prev;
          const next = [...prev, msg.data];
          return next.length > 100 ? next.slice(-100) : next;
        });
      } else if (msg.type === 'error') {
        toast.error(msg.message);
      } else if (msg.type === 'connection_closed') {
        // Remote connection dropped
        handleConnectionLost();
      }
    } catch { /* ignore parse errors */ }
  }, [touchPresence]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnectionLost = useCallback(() => {
    clearTimers();
    connectedRef.current = false;
    setWsStatus('disconnected');

    if (!intentionalCloseRef.current && connRef.current.roomCode && (connRef.current.mode === 'host' || connRef.current.joinIp)) {
      const isPlayer = connRef.current.mode === 'join';
      const maxAttempts = isPlayer ? 3 : 10; // Players give up faster — DM probably closed
      const attempt = reconnectCountRef.current;
      const delay = RECONNECT_DELAYS[Math.min(attempt, RECONNECT_DELAYS.length - 1)];
      reconnectCountRef.current = attempt + 1;
      setReconnecting(true);

      if (attempt < maxAttempts) {
        toast(`Connection lost \u2014 retrying in ${Math.round(delay / 1000)}s\u2026`, { icon: '\uD83D\uDD04', duration: delay });
        reconnectTimerRef.current = setTimeout(() => {
          if (!intentionalCloseRef.current) connect(charSnapshotRef.current);
        }, delay);
      } else {
        setReconnecting(false);
        if (isPlayer) {
          toast.error('The DM appears to have disconnected. The session has ended.', { icon: '\uD83C\uDFF0', duration: 6000 });
          // Reset player state — no point staying in a dead session
          intentionalCloseRef.current = true;
          try { invoke('party_ipc_disconnect').catch(() => {}); } catch {}
          if (unlistenRef.current) { unlistenRef.current(); unlistenRef.current = null; }
          setMode(null);
          setRoomCode('');
          setMembers([]);
          setMyClientId(null);
          setWasConnected(false);
          setMemberPresence({});
          setChatMessages([]);
          setHostInfo(null);
        } else {
          toast.error('Could not reconnect after multiple attempts. Use the Reconnect button to try again.', { duration: 6000 });
        }
      }
    }
  }, [clearTimers]); // eslint-disable-line react-hooks/exhaustive-deps

  const connect = useCallback(async (charSnapshot, overrideParams) => {
    if (connectingRef.current || connectedRef.current) return;
    const { mode: m, roomCode: code, joinIp: jip } = overrideParams || connRef.current;
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
        if (import.meta.env.DEV) console.log('[Party] Joining own server via IPC, room:', code);
        const result = await invoke('party_ipc_join', { room: code, character: snap || {} });
        if (import.meta.env.DEV) console.log('[Party] Host joined:', result);
        // Process the welcome message directly from the invoke result
        if (result?.welcome) {
          handleMessage(result.welcome);
        }
      } else {
        // Player: connect to remote DM server via Rust WebSocket client
        if (import.meta.env.DEV) console.log('[Party] Connecting to remote server via IPC:', jip, code);
        await invoke('party_ipc_connect', { ip: jip, room: code, character: snap || {} });
        if (import.meta.env.DEV) console.log('[Party] Player connected');
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Party] Connection failed:', err);
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

  const sendEvent = useCallback(async (eventName, data) => {
    const code = connRef.current.roomCode;
    if (!connectedRef.current || !code) return;
    try {
      await invoke('party_ipc_send', {
        message: JSON.stringify({ type: 'event', event: eventName, data, room: code }),
      });
    } catch { /* ignore */ }
  }, []);

  const sendTargetedEvent = useCallback(async (eventName, data, targetClientIds) => {
    const code = connRef.current.roomCode;
    if (!connectedRef.current || !code) return;
    try {
      await invoke('party_ipc_send', {
        message: JSON.stringify({ type: 'targeted_event', event: eventName, data, targets: targetClientIds, room: code }),
      });
    } catch { /* ignore */ }
  }, []);

  const onPartyEvent = useCallback((eventType, handler) => {
    const listenersMap = eventListenersRef.current;
    if (!listenersMap.has(eventType)) {
      listenersMap.set(eventType, new Map());
    }
    const id = Symbol();
    listenersMap.get(eventType).set(id, handler);
    return () => {
      const typeMap = listenersMap.get(eventType);
      if (typeMap) {
        typeMap.delete(id);
        if (typeMap.size === 0) listenersMap.delete(eventType);
      }
    };
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

  const sendChatMessage = useCallback(async (chatData) => {
    const code = connRef.current.roomCode;
    if (!connectedRef.current || !code) return;
    // Add a unique id and append locally immediately
    const msgWithId = { ...chatData, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
    setChatMessages(prev => {
      const next = [...prev, msgWithId];
      return next.length > 100 ? next.slice(-100) : next;
    });
    try {
      await invoke('party_ipc_send', {
        message: JSON.stringify({ type: 'ic_chat', room: code, data: msgWithId }),
      });
    } catch { /* ignore */ }
  }, []);

  const manualReconnect = useCallback(async () => {
    if (connectedRef.current || connectingRef.current) return;
    reconnectCountRef.current = 0;
    intentionalCloseRef.current = false;
    setReconnecting(true);
    toast('Attempting to reconnect...', { icon: '\uD83D\uDD04' });
    try {
      await connect(charSnapshotRef.current);
    } catch {
      setReconnecting(false);
    }
  }, [connect]);

  const handleHost = useCallback(async () => {
    try {
      if (import.meta.env.DEV) console.log('[Party] Starting party server...');
      await invoke('start_party_server');
      if (import.meta.env.DEV) console.log('[Party] Server started');

      let ip = 'localhost';
      try { ip = await invoke('get_local_ip'); } catch { /* fallback */ }
      setHostIp(ip);

      if (import.meta.env.DEV) console.log('[Party] Creating room via IPC...');
      const code = await invoke('create_party_room');
      if (import.meta.env.DEV) console.log('[Party] Room created:', code);
      setRoomCode(code);
      setMode('host');
      // Sync ref immediately so connect() doesn't read stale values
      // (child useEffects fire before parent useEffects)
      connRef.current = { hostIp: ip, roomCode: code, joinIp: '', mode: 'host' };
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Party] Host failed:', err);
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
    setWasConnected(false);
    setReconnecting(false);
    setMemberPresence({});
    setChatMessages([]);
    setHostInfo(null);
  }, [disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unlistenRef.current) unlistenRef.current();
      if (presenceIntervalRef.current) clearInterval(presenceIntervalRef.current);
    };
  }, []);

  // Presence recalculation interval (every 5s)
  useEffect(() => {
    presenceIntervalRef.current = setInterval(() => {
      setMemberPresence(prev => {
        const now = Date.now();
        const next = { ...prev };
        let changed = false;
        for (const clientId of Object.keys(next)) {
          const entry = next[clientId];
          const age = now - entry.lastSeen;
          let status;
          if (age < 15000) status = 'online';
          else if (age < 30000) status = 'idle';
          else status = 'offline';
          if (status !== entry.status) {
            // Transition to offline — toast (deferred to avoid setState-in-setState)
            // Skip for the DM/host — if we're connected to the server, the DM is connected
            if (status === 'offline' && entry.status !== 'offline') {
              const membersSnap = membersRef.current || [];
              const m = membersSnap.find(m => m.client_id === clientId);
              const isDmMember = m?.character?.dm_name;
              if (!isDmMember) {
                const name = m?.character?.name || m?.display_name || 'A player';
                setTimeout(() => toast(`${name} appears disconnected`, { icon: '\uD83D\uDD34', duration: 4000 }), 0);
              }
            }
            next[clientId] = { ...entry, status };
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 5000);
    return () => { if (presenceIntervalRef.current) clearInterval(presenceIntervalRef.current); };
  }, []);

  const value = useMemo(() => ({
    wsStatus, mode, roomCode, hostIp, joinIp, joinInput, members, myClientId,
    wasConnected, reconnecting, memberPresence, chatMessages, hostInfo,
    setMode, setRoomCode, setHostIp, setJoinIp, setJoinInput,
    connect, disconnect, sendUpdate, sendEvent, sendTargetedEvent, onPartyEvent, sendBugReport, sendChatMessage, handleHost, handleLeave,
    manualReconnect, onBugReportRef,
  }), [wsStatus, mode, roomCode, hostIp, joinIp, joinInput, members, myClientId,
       wasConnected, reconnecting, memberPresence, chatMessages, hostInfo,
       connect, disconnect, sendUpdate, sendEvent, sendTargetedEvent, onPartyEvent, sendBugReport, sendChatMessage, handleHost, handleLeave,
       manualReconnect]);

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
}
