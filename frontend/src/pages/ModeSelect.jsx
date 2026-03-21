import { useState, useEffect, lazy, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sword, Crown, Dice5, Shield, Heart, Sparkles, Users, X, Bell, Lock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { useAppMode } from '../contexts/ModeContext';
import { useUpdateCheck } from '../hooks/useUpdateCheck';
import { APP_VERSION } from '../version';

const Updates = lazy(() => import('../sections/Updates'));

const RUNE_CHARS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛟ','ᛞ','ᛜ','ᛚ'];
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: 20 + Math.random() * 80,
  sym: RUNE_CHARS[i % RUNE_CHARS.length],
  delay: Math.random() * 10, dur: 16 + Math.random() * 10,
  repeatDelay: Math.random() * 6 + 3,
  size: 10 + Math.random() * 6,
}));

export default function ModeSelect() {
  const { setMode } = useAppMode();
  const [showBetaWarning, setShowBetaWarning] = useState(false);
  const [showTutorials, setShowTutorials] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showDevGate, setShowDevGate] = useState(false);
  const [devPassphrase, setDevPassphrase] = useState('');
  const { updateAvailable } = useUpdateCheck();

  const [hoveredMode, setHoveredMode] = useState(null);

  const modes = [
    {
      id: 'player',
      icon: Sword,
      title: 'Player Mode',
      subtitle: 'The Adventurer',
      desc: 'Manage your character sheet, track spells, inventory, combat, and more. Join your DM\'s party to sync in real-time.',
      features: [
        { icon: Shield, text: 'Full character sheet' },
        { icon: Sparkles, text: 'Spellbook & inventory' },
        { icon: Dice5, text: 'Dice roller' },
        { icon: Users, text: 'Join party sessions' },
      ],
      color: '#c9a84c',
      glow: 'rgba(201,168,76,0.15)',
      gradient: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.03) 100%)',
      borderGlow: 'rgba(201,168,76,0.4)',
    },
    {
      id: 'dm',
      icon: Crown,
      title: 'DM Mode',
      subtitle: 'The Dungeon Master',
      desc: 'Run your campaign, manage NPCs, track combat for the whole party, and host sessions your players can join.',
      features: [
        { icon: BookOpen, text: 'Campaign management' },
        { icon: Users, text: 'NPC & quest tracking' },
        { icon: Sparkles, text: 'Host party sessions' },
        { icon: Sword, text: 'Combat for all players' },
      ],
      color: '#9b59b6',
      glow: 'rgba(155,89,182,0.15)',
      gradient: 'linear-gradient(135deg, rgba(155,89,182,0.12) 0%, rgba(155,89,182,0.03) 100%)',
      borderGlow: 'rgba(155,89,182,0.4)',
    },
  ];

  return (
    <div style={{
      position: 'fixed', top: 'var(--dev-banner-h, 0px)', left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0d0d12', overflow: 'hidden',
    }}>
      {/* Atmosphere — layered ambient lights */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Central top glow */}
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 1000, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, rgba(46,31,94,0.18) 40%, transparent 70%)', filter: 'blur(60px)' }} />
        {/* Left warm accent */}
        <div style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        {/* Right cool accent */}
        <div style={{ position: 'absolute', top: '30%', right: '-8%', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(155,89,182,0.08) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        {/* Bottom subtle gradient */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, rgba(201,168,76,0.02), transparent)' }} />
        {/* Floating rune particles */}
        {PARTICLES.map(p => (
          <motion.span
            key={p.id}
            style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontFamily: 'serif', fontSize: p.size, color: '#c9a84c', opacity: 0, pointerEvents: 'none', userSelect: 'none' }}
            animate={{ y: [0, -140], opacity: [0, 0.07, 0.04, 0] }}
            transition={{ delay: p.delay, duration: p.dur, repeat: Infinity, repeatDelay: p.repeatDelay, ease: 'linear' }}
          >
            {p.sym}
          </motion.span>
        ))}
        {/* Subtle animated vignette ring */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 820, width: '100%', padding: '0 28px' }}
      >
        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div style={{ fontSize: 11, fontFamily: 'var(--font-heading, "Cinzel", serif)', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)', marginBottom: 12 }}>
            D&D Campaign Companion
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display, "Cinzel Decorative", serif)', fontWeight: 900,
            fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.95, marginBottom: 0,
            background: 'linear-gradient(135deg, #ffe9a0 0%, #c9a84c 30%, #ffe9a0 50%, #c9a84c 70%, #ffe9a0 100%)',
            backgroundSize: '400% 400%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'shimmer 6s ease-in-out infinite',
            filter: 'drop-shadow(0 2px 12px rgba(201,168,76,0.15))',
          }}>
            The Codex
          </h1>

          {/* Ornamental divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px auto 14px', maxWidth: 320 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35))' }} />
            <svg width="14" height="14" viewBox="0 0 16 16" style={{ opacity: 0.5 }}><path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" fill="#c9a84c"/></svg>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.35), transparent)' }} />
          </div>

          <p style={{ fontSize: 14, color: 'rgba(200,175,130,0.3)', marginBottom: 44, fontFamily: 'var(--font-text, var(--font-ui, sans-serif))', letterSpacing: '0.04em' }}>
            Choose your path
          </p>
        </motion.div>

        {/* Mode Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 36 }}>
          {modes.map((m, i) => {
            const isHovered = hoveredMode === m.id;
            const ModeIcon = m.icon;
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.15, type: 'spring', damping: 22, stiffness: 200 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  if (m.id === 'dm') {
                    setShowBetaWarning(true);
                  } else {
                    setMode(m.id);
                  }
                }}
                onMouseEnter={() => setHoveredMode(m.id)}
                onMouseLeave={() => setHoveredMode(null)}
                style={{
                  position: 'relative', borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
                  background: 'rgba(11,9,20,0.92)',
                  border: `1px solid ${isHovered ? m.borderGlow : `${m.color}18`}`,
                  boxShadow: isHovered
                    ? `0 24px 80px rgba(0,0,0,0.6), 0 0 50px ${m.glow}, inset 0 1px 0 ${m.color}15`
                    : `0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 ${m.color}08`,
                  textAlign: 'left', display: 'flex', flexDirection: 'column',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {/* Top glow bar */}
                <div style={{
                  height: isHovered ? 3 : 2,
                  background: `linear-gradient(90deg, transparent 5%, ${m.color}${isHovered ? 'cc' : '66'} 50%, transparent 95%)`,
                  transition: 'all 0.35s',
                }} />

                {/* Card inner glow on hover */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '80%', height: 120, borderRadius: '0 0 50% 50%',
                  background: `radial-gradient(ellipse, ${m.glow} 0%, transparent 70%)`,
                  opacity: isHovered ? 1 : 0, transition: 'opacity 0.35s',
                  pointerEvents: 'none',
                }} />

                <div style={{ padding: '30px 26px 26px', position: 'relative' }}>
                  {/* Icon circle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                    <div style={{
                      width: 54, height: 54, borderRadius: 14,
                      background: m.gradient,
                      border: `1px solid ${m.color}${isHovered ? '40' : '20'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.3s',
                      boxShadow: isHovered ? `0 0 20px ${m.glow}` : 'none',
                    }}>
                      <ModeIcon size={24} style={{ color: m.color, opacity: isHovered ? 1 : 0.7, transition: 'opacity 0.3s' }} />
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 19, color: '#efe0c0',
                        letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600,
                      }}>
                        {m.title}
                        {m.id === 'dm' && (
                          <span style={{
                            fontSize: 8, padding: '3px 8px', borderRadius: 6,
                            background: 'rgba(155,89,182,0.12)', border: '1px solid rgba(155,89,182,0.25)',
                            color: '#c084fc', letterSpacing: '0.1em', textTransform: 'uppercase',
                            fontFamily: 'var(--font-ui, sans-serif)', fontWeight: 700,
                          }}>
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: `${m.color}77`, fontStyle: 'italic', marginTop: 3, letterSpacing: '0.03em' }}>
                        {m.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)', lineHeight: 1.65, marginBottom: 20, fontFamily: 'var(--font-text, var(--font-ui, sans-serif))' }}>
                    {m.desc}
                  </p>

                  {/* Feature list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                    {m.features.map((f, fi) => {
                      const FIcon = f.icon;
                      return (
                        <motion.div
                          key={f.text}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.15 + fi * 0.05 }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}
                        >
                          <div style={{
                            width: 22, height: 22, borderRadius: 6,
                            background: `${m.color}0a`, border: `1px solid ${m.color}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <FIcon size={11} style={{ color: `${m.color}88` }} />
                          </div>
                          <span style={{ color: 'rgba(200,175,130,0.5)' }}>{f.text}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Select button */}
                  <div style={{
                    padding: '11px 0', borderRadius: 10, textAlign: 'center',
                    background: isHovered
                      ? `linear-gradient(135deg, ${m.color}25, ${m.color}15)`
                      : `${m.color}0a`,
                    border: `1px solid ${m.color}${isHovered ? '40' : '18'}`,
                    fontFamily: 'var(--font-heading, "Cinzel", serif)',
                    fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: `${m.color}${isHovered ? 'ee' : 'aa'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.3s',
                  }}>
                    Enter as {m.title.split(' ')[0]}
                    <ChevronRight size={13} style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s', transform: 'translateX(0)' }} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Tutorials button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => setShowTutorials(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 24px', borderRadius: 10,
            background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)',
            color: 'rgba(201,168,76,0.45)', cursor: 'pointer',
            fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 12,
            letterSpacing: '0.08em', transition: 'all 0.25s', marginBottom: 14,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.color = 'rgba(201,168,76,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.04)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'; e.currentTarget.style.color = 'rgba(201,168,76,0.45)'; }}
        >
          <BookOpen size={14} />
          Tutorials & Guides
        </motion.button>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          style={{ fontSize: 11, color: 'rgba(200,175,130,0.18)', fontStyle: 'italic', letterSpacing: '0.02em' }}
        >
          You can switch between modes anytime from the Dashboard
        </motion.p>
      </motion.div>

      {/* Bottom-left: Updates */}
      <div style={{ position: 'fixed', bottom: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8, zIndex: 20 }}>
        <button
          onClick={() => setShowUpdates(true)}
          title="Updates"
          style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 9,
            background: updateAvailable ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${updateAvailable ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'}`,
            color: updateAvailable ? 'rgba(74,222,128,0.6)' : 'rgba(200,175,130,0.4)',
            cursor: 'pointer',
            fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 11,
            letterSpacing: '0.06em', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = updateAvailable ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = updateAvailable ? 'rgba(74,222,128,0.35)' : 'rgba(201,168,76,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = updateAvailable ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = updateAvailable ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'; }}
        >
          <Bell size={13} />
          Updates
          {updateAvailable && (
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.6)', animation: 'pulse 2s ease-in-out infinite' }} />
          )}
        </button>
      </div>

      {/* Version */}
      <div style={{ position: 'fixed', bottom: 12, right: 16, fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(200,175,130,0.15)' }}>
        {APP_VERSION}
      </div>

      {/* DM Early Access Notice */}
      <AnimatePresence>
        {showBetaWarning && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)',
              padding: 16,
            }}
            onClick={e => e.target === e.currentTarget && setShowBetaWarning(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              style={{
                width: 400, maxWidth: '100%', borderRadius: 16, overflow: 'hidden',
                background: 'linear-gradient(160deg, #0d0b18 0%, #110e1e 100%)',
                border: '1px solid rgba(155,89,182,0.25)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(155,89,182,0.08)',
              }}
            >
              {/* Glow bar */}
              <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #9b59b6, transparent)' }} />

              <div style={{ padding: '28px 24px 24px', textAlign: 'center' }}>
                {/* Warning icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', margin: '0 auto 16px',
                  background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                }}>
                  &#9888;
                </div>

                <div style={{
                  display: 'inline-block', padding: '3px 12px', borderRadius: 99, marginBottom: 14,
                  background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
                  fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 10,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#fbbf24',
                }}>
                  BETA
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 18,
                  color: '#efe0c0', marginBottom: 10, fontWeight: 700,
                }}>
                  DM Mode — Early Access
                </h3>

                <p style={{
                  fontSize: 13, color: 'rgba(200,175,130,0.45)', lineHeight: 1.7,
                  marginBottom: 24, fontFamily: 'var(--font-text, var(--font-ui, sans-serif))',
                }}>
                  DM Mode is still in active development. Some features may be incomplete or behave unexpectedly. Your feedback helps us improve!
                </p>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowBetaWarning(false)}
                    style={{
                      padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(200,175,130,0.4)',
                      fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 11,
                      letterSpacing: '0.06em',
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => setMode('dm')}
                    style={{
                      padding: '10px 24px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #9b59b6, #c084fc)',
                      color: '#fff',
                      fontFamily: 'var(--font-heading, "Cinzel", serif)',
                      fontSize: 11, letterSpacing: '0.08em', fontWeight: 700,
                      transition: 'all 0.3s',
                    }}
                  >
                    Enter DM Mode
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dev Passphrase Gate */}
      <AnimatePresence>
        {showDevGate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)',
              padding: 16,
            }}
            onClick={e => e.target === e.currentTarget && setShowDevGate(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              style={{
                width: 380, maxWidth: '100%', borderRadius: 16, overflow: 'hidden',
                background: 'linear-gradient(160deg, #0d0b18 0%, #110e1e 100%)',
                border: '1px solid rgba(155,89,182,0.25)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(155,89,182,0.08)',
              }}
            >
              <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #9b59b6, transparent)' }} />
              <div style={{ padding: '28px 24px 24px', textAlign: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', margin: '0 auto 16px',
                  background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Lock size={24} color="#c084fc" />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 18,
                  color: '#efe0c0', margin: '0 0 8px', letterSpacing: '0.02em',
                }}>
                  Developer Access
                </h3>
                <p style={{
                  fontSize: 12, color: 'rgba(224,213,192,0.5)', lineHeight: 1.6,
                  margin: '0 0 20px', fontFamily: 'var(--font-text, var(--font-ui, sans-serif))',
                }}>
                  DM Mode is in early development. Enter the dev passphrase to unlock.
                </p>
                <input
                  autoFocus
                  type="password"
                  value={devPassphrase}
                  onChange={e => setDevPassphrase(e.target.value)}
                  onKeyDown={async e => {
                    if (e.key === 'Enter' && devPassphrase) {
                      try {
                        const valid = await invoke('verify_dev_passphrase', { passphrase: devPassphrase });
                        if (valid) {
                          setShowDevGate(false);
                          setShowBetaWarning(true);
                          toast.success('DM Mode unlocked!');
                        } else {
                          toast.error('Invalid passphrase');
                          setDevPassphrase('');
                        }
                      } catch {
                        toast.error('Verification failed');
                      }
                    }
                    if (e.key === 'Escape') setShowDevGate(false);
                  }}
                  placeholder="Enter passphrase..."
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(155,89,182,0.2)',
                    color: '#efe0c0', fontSize: 13, fontFamily: 'var(--font-mono, monospace)',
                    outline: 'none', textAlign: 'center', letterSpacing: '0.1em',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowDevGate(false)}
                    style={{
                      padding: '8px 20px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(224,213,192,0.5)', fontSize: 12, cursor: 'pointer',
                      fontFamily: 'var(--font-ui, sans-serif)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!devPassphrase) return;
                      try {
                        const valid = await invoke('verify_dev_passphrase', { passphrase: devPassphrase });
                        if (valid) {
                          setShowDevGate(false);
                          setShowBetaWarning(true);
                          toast.success('DM Mode unlocked!');
                        } else {
                          toast.error('Invalid passphrase');
                          setDevPassphrase('');
                        }
                      } catch {
                        toast.error('Verification failed');
                      }
                    }}
                    style={{
                      padding: '8px 20px', borderRadius: 8,
                      background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)',
                      color: '#c084fc', fontSize: 12, cursor: 'pointer',
                      fontFamily: 'var(--font-ui, sans-serif)', fontWeight: 600,
                    }}
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorials Modal */}
      <AnimatePresence>
        {showTutorials && (
          <TutorialsModal onClose={() => setShowTutorials(false)} />
        )}
      </AnimatePresence>

      {/* Updates Modal */}
      <AnimatePresence>
        {showUpdates && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
              padding: 16,
            }}
            onClick={e => e.target === e.currentTarget && setShowUpdates(false)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              style={{
                width: 620, maxWidth: '100%', maxHeight: '85vh',
                borderRadius: 16, overflow: 'hidden',
                background: 'linear-gradient(160deg, #0d0b18 0%, #110e1e 100%)',
                border: '1px solid rgba(201,168,76,0.2)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.85)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #4ade80, transparent)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bell size={16} style={{ color: '#4ade80' }} />
                  <span style={{ fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 16, color: '#efe0c0', fontWeight: 700 }}>Updates</span>
                </div>
                <button onClick={() => setShowUpdates(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(201,168,76,0.3)', padding: 4, display: 'flex' }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
                <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'rgba(200,175,130,0.3)', fontSize: 12 }}>Loading...</div>}>
                  <Updates />
                </Suspense>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tutorial content ──────────────────────────────────────────────────────────

const TUTORIAL_TABS = [
  {
    id: 'dnd',
    label: 'What is D&D?',
    icon: BookOpen,
    color: '#c9a84c',
    sections: [
      {
        title: 'Welcome to D&D!',
        icon: BookOpen,
        paragraphs: [
          "Dungeons & Dragons is a tabletop roleplaying game where you and your friends go on adventures together. One person (the Dungeon Master, or DM) tells the story, and everyone else plays a character in that story.",
          "You don't need to memorize any rules — the DM will guide you, and The Codex handles all the math and tracking so you can focus on the fun.",
        ],
      },
      {
        title: 'Rolling Dice',
        icon: Dice5,
        paragraphs: [
          "D&D uses different shaped dice. The number after 'd' is how many sides it has: d4, d6, d8, d10, d12, and the d20.",
          "The d20 is the most important — you roll it for almost everything: attacking, dodging, persuading, sneaking, and more. High = good!",
          "'2d6+3' means: roll two 6-sided dice, add them together, then add 3.",
        ],
      },
      {
        title: 'Your Six Stats',
        icon: Shield,
        paragraphs: [
          "STR (Strength) — hitting things, lifting, athletics",
          "DEX (Dexterity) — dodging, sneaking, aiming bows",
          "CON (Constitution) — health, endurance, staying alive",
          "INT (Intelligence) — knowledge, arcane magic (Wizard)",
          "WIS (Wisdom) — perception, insight, divine magic (Cleric/Druid)",
          "CHA (Charisma) — persuasion, deception, innate magic (Bard/Warlock)",
        ],
      },
      {
        title: 'Health & Combat',
        icon: Heart,
        paragraphs: [
          "Hit Points (HP) = your health. Take damage and HP drops. Hit 0 and you start making death saving throws.",
          "Armor Class (AC) = how hard you are to hit. Enemies roll d20 + their bonus — if they meet or beat your AC, they hit.",
          "On your turn: one Action (attack, cast a spell), one Bonus Action (if available), and Movement (up to your speed).",
        ],
      },
      {
        title: 'Magic & Spells',
        icon: Sparkles,
        paragraphs: [
          "Not every class uses magic. If yours does, here's the basics:",
          "Cantrips = free spells you can cast as often as you want.",
          "Spell Slots = fuel for bigger spells. A Level 1 spell costs a Level 1 slot. Slots refill after a long rest (8 hours).",
          "Concentration = some spells require focus. You can only concentrate on one at a time.",
        ],
      },
      {
        title: 'Resting & Leveling',
        icon: Users,
        paragraphs: [
          "Short Rest (1 hour): Spend hit dice to heal. Some abilities recharge.",
          "Long Rest (8 hours): Recover all HP, all spell slots, and half your hit dice.",
          "As you earn XP from quests and combat, you level up — gaining new abilities, more HP, and stronger spells.",
        ],
      },
    ],
  },
  {
    id: 'player',
    label: 'Player Mode',
    icon: Sword,
    color: '#c9a84c',
    sections: [
      {
        title: 'Getting Started',
        icon: Sword,
        paragraphs: [
          "Player Mode is your full character sheet. Create a character from the Dashboard, then manage everything about them here.",
          "The sidebar has sections for Overview, Backstory, Spellbook, Inventory, Combat, Journal, and more.",
        ],
      },
      {
        title: 'Character Overview',
        icon: Shield,
        paragraphs: [
          "Your Overview shows your stats, HP, AC, level, and core info at a glance.",
          "Click any stat to see its modifier. Edit fields directly — everything auto-saves.",
        ],
      },
      {
        title: 'Combat & Dice',
        icon: Dice5,
        paragraphs: [
          "The Combat section tracks your attacks, conditions, and AC. Use the built-in Dice Roller for any roll.",
          "Attacks can be set up with damage dice, modifiers, and damage types — just click to roll.",
        ],
      },
      {
        title: 'Spells & Inventory',
        icon: Sparkles,
        paragraphs: [
          "Spellbook tracks all your spells and spell slots. Mark spells as prepared, and track slot usage.",
          "Inventory manages items with weight tracking and quick-use buttons for consumables.",
        ],
      },
      {
        title: 'Joining a Party',
        icon: Users,
        paragraphs: [
          "Go to Settings > Party Connect to join your DM's session.",
          "Enter the DM's Room Code and click Join. Once connected, you'll receive DM broadcasts, prompts, and combat updates in real-time.",
          "Your character data syncs automatically — the DM can see your HP, conditions, and more.",
        ],
      },
      {
        title: 'Rest & Level Up',
        icon: Heart,
        paragraphs: [
          "Use the Rest buttons (Short Rest / Long Rest) to recover HP and resources automatically.",
          "When you have enough XP, you'll get a Level Up notification with guided choices for your class.",
        ],
      },
    ],
  },
  {
    id: 'dm',
    label: 'DM Mode',
    icon: Crown,
    color: '#9b59b6',
    sections: [
      {
        title: 'Getting Started as DM',
        icon: Crown,
        paragraphs: [
          "DM Mode lets you run your campaign. Create or import a campaign from the Dashboard, then enter it to manage everything.",
          "You can create homebrew campaigns from scratch or pick a premade adventure with NPCs, quests, and lore pre-loaded.",
        ],
      },
      {
        title: 'Campaign Hub',
        icon: BookOpen,
        paragraphs: [
          "The Campaign Hub is your central command. Manage NPCs, quests, lore, encounters, and session notes all in one place.",
          "Each section has full CRUD — create, read, update, and delete entries as your story evolves.",
        ],
      },
      {
        title: 'Hosting a Session',
        icon: Users,
        paragraphs: [
          "Go to Party Overview, then start a lobby as Host. Your Room Code appears for players to join.",
          "Once connected, the DM Toolbar appears in the top-right with 4 panels: Campaign, Combat, Comms, and Log.",
        ],
      },
      {
        title: 'Campaign Panel',
        icon: Shield,
        paragraphs: [
          "Start a Live Session to begin the timer and activate scenes. Your campaign auto-loads based on what you selected.",
          "Navigate scenes, trigger quick actions (reveal NPCs, start encounters, prompt skill checks), and track session XP.",
        ],
      },
      {
        title: 'Combat Manager',
        icon: Sword,
        paragraphs: [
          "Add monsters from the SRD database or create custom enemies. Roll initiative and manage turn order.",
          "Track monster HP with +/- buttons, apply conditions (stunned, poisoned, etc.), and see player HP bars.",
          "Combat syncs to all connected players in real-time — they see whose turn it is and the round count.",
        ],
      },
      {
        title: 'Communications',
        icon: Sparkles,
        paragraphs: [
          "Broadcasts send announcements to all players (scene descriptions, narrative text, warnings).",
          "Prompts request responses — skill checks, saving throws, choices, or free-text questions. Results flow back to your panel.",
          "Quick Checks let you send premade D&D skill checks and saving throws with one click.",
        ],
      },
    ],
  },
];

function TutorialsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('dnd');
  const tab = TUTORIAL_TABS.find(t => t.id === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        style={{
          width: 620, maxWidth: '100%', maxHeight: '85vh',
          borderRadius: 16, overflow: 'hidden',
          background: 'linear-gradient(160deg, #0d0b18 0%, #110e1e 100%)',
          border: '1px solid rgba(201,168,76,0.2)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.85)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Glow bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${tab?.color || '#c9a84c'}, transparent)`, transition: 'background 0.3s' }} />

        {/* Header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={18} style={{ color: '#c9a84c' }} />
            <span style={{ fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 18, color: '#efe0c0', fontWeight: 700 }}>
              Tutorials & Guides
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(201,168,76,0.3)', padding: 4, display: 'flex', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(201,168,76,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,168,76,0.3)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, padding: '16px 24px 0' }}>
          {TUTORIAL_TABS.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: '8px 8px 0 0',
                  background: isActive ? `${t.color}12` : 'transparent',
                  border: 'none', borderBottom: isActive ? `2px solid ${t.color}` : '2px solid transparent',
                  color: isActive ? t.color : 'rgba(200,175,130,0.35)',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  fontFamily: 'var(--font-heading, "Cinzel", serif)',
                  letterSpacing: '0.04em', transition: 'all 0.2s',
                }}
              >
                <Icon size={13} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(201,168,76,0.1)', margin: '0 24px' }} />

        {/* Content — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
          {tab?.sections.map((section, i) => {
            const SIcon = section.icon;
            return (
              <div key={i} style={{ marginBottom: i < tab.sections.length - 1 ? 20 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <SIcon size={14} style={{ color: tab.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#e8d9b5', fontFamily: 'var(--font-heading, "Cinzel", serif)' }}>
                    {section.title}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 22 }}>
                  {section.paragraphs.map((p, j) => (
                    <p key={j} style={{ fontSize: 12, color: 'rgba(200,175,130,0.55)', lineHeight: 1.7, margin: 0, fontFamily: 'var(--font-text, var(--font-ui, sans-serif))' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
