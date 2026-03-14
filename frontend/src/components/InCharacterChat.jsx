import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, X, Minus, Maximize2, Users, Scroll } from 'lucide-react';
import { parseAndRollExpression } from '../utils/dice';

const GOLD = 'rgba(201,168,76,1)';
const GOLD_DIM = 'rgba(201,168,76,0.5)';
const MAX_MESSAGES = 100;
const PERSIST_COUNT = 50;

const CLASS_COLORS = {
  barbarian: '#e74c3c',
  bard: '#ab47bc',
  cleric: '#f9a825',
  druid: '#66bb6a',
  fighter: '#e65100',
  monk: '#42a5f5',
  paladin: '#ffd54f',
  ranger: '#4caf50',
  rogue: '#78909c',
  sorcerer: '#ef5350',
  warlock: '#7e57c2',
  wizard: '#2196f3',
};

function getClassColor(cls) {
  if (!cls) return GOLD_DIM;
  return CLASS_COLORS[cls.toLowerCase()] || GOLD_DIM;
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getChatStorageKey(roomCode) {
  return `codex-chat-history-${roomCode}`;
}

function loadPersistedMessages(roomCode) {
  if (!roomCode) return [];
  try {
    const raw = localStorage.getItem(getChatStorageKey(roomCode));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function persistMessages(roomCode, messages) {
  if (!roomCode) return;
  try {
    const toSave = messages.slice(-PERSIST_COUNT);
    localStorage.setItem(getChatStorageKey(roomCode), JSON.stringify(toSave));
  } catch { /* ignore */ }
}

export default function InCharacterChat({ characterName, characterClass, isConnected, sendMessage, messages, roomCode }) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isOOC, setIsOOC] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevMessageCountRef = useRef(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && open && !minimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, minimized]);

  // Track unread messages when panel is closed or minimized
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      if (!open || minimized) {
        setUnreadCount(prev => prev + (messages.length - prevMessageCountRef.current));
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length, open, minimized]);

  // Clear unread when opening
  useEffect(() => {
    if (open && !minimized) {
      setUnreadCount(0);
    }
  }, [open, minimized]);

  // Persist messages when they change
  useEffect(() => {
    if (roomCode && messages.length > 0) {
      persistMessages(roomCode, messages);
    }
  }, [messages, roomCode]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || !isConnected) return;

    // Check for /roll command
    if (trimmed.toLowerCase().startsWith('/roll ')) {
      const expr = trimmed.slice(6).trim();
      const result = parseAndRollExpression(expr);
      if (result) {
        sendMessage({
          type: 'roll',
          characterName: characterName || 'Unknown',
          characterClass: characterClass || '',
          expression: expr,
          total: result.total,
          breakdown: result.breakdownParts.join(' '),
          timestamp: Date.now(),
        });
      } else {
        // Invalid expression, just post as text
        sendMessage({
          type: isOOC ? 'ooc' : 'ic',
          characterName: characterName || 'Unknown',
          characterClass: characterClass || '',
          text: trimmed,
          timestamp: Date.now(),
        });
      }
    } else {
      sendMessage({
        type: isOOC ? 'ooc' : 'ic',
        characterName: characterName || 'Unknown',
        characterClass: characterClass || '',
        text: trimmed,
        timestamp: Date.now(),
      });
    }

    setInput('');
  }, [input, isConnected, isOOC, characterName, characterClass, sendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Closed state — toggle button
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Open Party Chat"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9990,
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.3)',
          background: 'rgba(12,10,20,0.92)',
          backdropFilter: 'blur(12px)',
          color: 'rgba(201,168,76,0.7)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 12px rgba(201,168,76,0.1)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)';
          e.currentTarget.style.color = 'rgba(201,168,76,1)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
          e.currentTarget.style.color = 'rgba(201,168,76,0.7)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5), 0 0 12px rgba(201,168,76,0.1)';
        }}
      >
        <MessageCircle size={22} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            background: '#e74c3c',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5px',
            border: '2px solid rgba(12,10,20,0.92)',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    );
  }

  // Open panel
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9990,
        width: minimized ? 280 : 380,
        maxHeight: minimized ? 48 : 520,
        height: minimized ? 48 : 520,
        borderRadius: 14,
        border: '1px solid rgba(201,168,76,0.2)',
        background: 'rgba(12,10,20,0.96)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 16px rgba(201,168,76,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s, max-height 0.3s, height 0.3s',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderBottom: minimized ? 'none' : '1px solid rgba(201,168,76,0.12)',
          cursor: 'default',
          flexShrink: 0,
        }}
      >
        <MessageCircle size={16} style={{ color: 'rgba(201,168,76,0.6)' }} />
        <span style={{
          flex: 1,
          fontFamily: 'var(--font-display, "Cinzel", serif)',
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(201,168,76,0.8)',
          letterSpacing: '0.03em',
        }}>
          Party Chat
        </span>
        {/* Connection indicator */}
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: isConnected ? '#4caf50' : '#e74c3c',
          boxShadow: isConnected ? '0 0 6px rgba(76,175,80,0.5)' : '0 0 6px rgba(231,76,60,0.5)',
          flexShrink: 0,
        }} title={isConnected ? 'Connected' : 'Disconnected'} />
        <button
          onClick={() => setMinimized(!minimized)}
          title={minimized ? 'Expand' : 'Minimize'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', padding: 4, display: 'flex',
            alignItems: 'center', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          {minimized ? <Maximize2 size={14} /> : <Minus size={14} />}
        </button>
        <button
          onClick={() => setOpen(false)}
          title="Close"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', padding: 4, display: 'flex',
            alignItems: 'center', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(239,68,68,0.8)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          <X size={14} />
        </button>
      </div>

      {/* Chat content */}
      {!minimized && (
        <>
          {/* Messages area */}
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: 'rgba(200,175,130,0.3)',
                fontSize: 12,
                padding: '40px 20px',
                fontStyle: 'italic',
              }}>
                {isConnected
                  ? 'No messages yet. Say something in character!'
                  : 'Connect to a party to start chatting.'}
              </div>
            )}
            {messages.map((msg, i) => (
              <ChatBubble key={msg.id || `${msg.timestamp}-${i}`} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* IC/OOC toggle + Input */}
          <div style={{
            borderTop: '1px solid rgba(201,168,76,0.12)',
            padding: '8px 10px',
            flexShrink: 0,
          }}>
            {/* Mode toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 6,
            }}>
              <button
                onClick={() => setIsOOC(false)}
                style={{
                  padding: '3px 10px',
                  borderRadius: 8,
                  border: `1px solid ${!isOOC ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  background: !isOOC ? 'rgba(201,168,76,0.15)' : 'transparent',
                  color: !isOOC ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.4)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-display, "Cinzel", serif)',
                }}
              >
                <Scroll size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                In-Character
              </button>
              <button
                onClick={() => setIsOOC(true)}
                style={{
                  padding: '3px 10px',
                  borderRadius: 8,
                  border: `1px solid ${isOOC ? 'rgba(150,150,150,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  background: isOOC ? 'rgba(150,150,150,0.15)' : 'transparent',
                  color: isOOC ? 'rgba(200,200,200,0.9)' : 'rgba(255,255,255,0.4)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <Users size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                OOC
              </button>
              <span style={{
                marginLeft: 'auto',
                fontSize: 10,
                color: 'rgba(255,255,255,0.2)',
              }}>
                /roll 2d6+3
              </span>
            </div>

            {/* Input row */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isConnected}
                placeholder={
                  !isConnected
                    ? 'Not connected...'
                    : isOOC
                    ? 'Say something out of character...'
                    : `Speak as ${characterName || 'your character'}...`
                }
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: `1px solid ${isOOC ? 'rgba(150,150,150,0.2)' : 'rgba(201,168,76,0.2)'}`,
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(230,220,200,0.9)',
                  fontSize: 13,
                  outline: 'none',
                  fontStyle: isOOC ? 'normal' : 'italic',
                  fontFamily: isOOC ? 'inherit' : 'var(--font-body, "Cormorant Garamond", serif)',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = isOOC ? 'rgba(150,150,150,0.4)' : 'rgba(201,168,76,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = isOOC ? 'rgba(150,150,150,0.2)' : 'rgba(201,168,76,0.2)'}
              />
              <button
                onClick={handleSend}
                disabled={!isConnected || !input.trim()}
                title="Send message"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid rgba(201,168,76,0.3)',
                  background: input.trim() && isConnected ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.03)',
                  color: input.trim() && isConnected ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.15)',
                  cursor: input.trim() && isConnected ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Individual chat message bubble */
function ChatBubble({ msg }) {
  const classColor = getClassColor(msg.characterClass);

  if (msg.type === 'roll') {
    return (
      <div style={{
        padding: '6px 10px',
        borderRadius: 10,
        background: 'rgba(201,168,76,0.08)',
        border: '1px solid rgba(201,168,76,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: classColor, flexShrink: 0,
          }} />
          <span style={{
            fontWeight: 700, fontSize: 12,
            color: classColor,
            fontFamily: 'var(--font-display, "Cinzel", serif)',
          }}>
            {msg.characterName}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>
            {formatTime(msg.timestamp)}
          </span>
        </div>
        <div style={{
          fontSize: 13,
          color: 'rgba(201,168,76,0.9)',
          fontWeight: 600,
        }}>
          rolled {msg.expression}: <span style={{ fontSize: 16, fontWeight: 800 }}>{msg.total}</span>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(200,175,130,0.4)', marginTop: 1 }}>
          {msg.breakdown}
        </div>
      </div>
    );
  }

  if (msg.type === 'system') {
    return (
      <div style={{
        textAlign: 'center',
        fontSize: 11,
        color: 'rgba(200,175,130,0.4)',
        fontStyle: 'italic',
        padding: '4px 0',
      }}>
        {msg.text}
      </div>
    );
  }

  const isIC = msg.type === 'ic';

  return (
    <div style={{
      padding: '6px 10px',
      borderRadius: 10,
      background: isIC
        ? 'linear-gradient(135deg, rgba(139,119,72,0.12) 0%, rgba(100,80,50,0.08) 100%)'
        : 'rgba(255,255,255,0.04)',
      border: isIC
        ? '1px solid rgba(139,119,72,0.2)'
        : '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Name + timestamp row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: classColor, flexShrink: 0,
        }} />
        <span style={{
          fontWeight: 700, fontSize: 12,
          color: isIC ? classColor : 'rgba(200,200,200,0.7)',
          fontFamily: isIC ? 'var(--font-display, "Cinzel", serif)' : 'inherit',
        }}>
          {!isIC && <span style={{ color: 'rgba(150,150,150,0.6)', marginRight: 4 }}>[OOC]</span>}
          {msg.characterName}
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>
          {formatTime(msg.timestamp)}
        </span>
      </div>
      {/* Message text */}
      <div style={{
        fontSize: 13,
        lineHeight: 1.45,
        color: isIC ? 'rgba(230,220,200,0.9)' : 'rgba(200,200,200,0.75)',
        fontStyle: isIC ? 'italic' : 'normal',
        fontFamily: isIC ? 'var(--font-body, "Cormorant Garamond", serif)' : 'inherit',
        paddingLeft: 14,
      }}>
        {isIC && <span style={{ color: 'rgba(201,168,76,0.4)', marginRight: 2 }}>&ldquo;</span>}
        {msg.text}
        {isIC && <span style={{ color: 'rgba(201,168,76,0.4)', marginLeft: 2 }}>&rdquo;</span>}
      </div>
    </div>
  );
}
