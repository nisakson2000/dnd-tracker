import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppMode } from '../contexts/ModeContext';
import { APP_VERSION } from '../version';

const RUNE_CHARS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ'];
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: 30 + Math.random() * 70,
  sym: RUNE_CHARS[i % RUNE_CHARS.length],
  delay: Math.random() * 10, dur: 14 + Math.random() * 8,
}));

export default function ModeSelect() {
  const { setMode } = useAppMode();
  const [showBetaWarning, setShowBetaWarning] = useState(false);

  const modes = [
    {
      id: 'player',
      icon: '⚔',
      title: 'Player Mode',
      subtitle: 'The Adventurer',
      desc: 'Manage your character sheet, track spells, inventory, combat, and more. Join your DM\'s party to sync in real-time.',
      features: ['Full character sheet', 'Spellbook & inventory', 'Dice roller', 'Join party sessions'],
      color: '#c9a84c',
      bg: 'rgba(201,168,76,0.08)',
    },
    {
      id: 'dm',
      icon: '📖',
      title: 'DM Mode',
      subtitle: 'The Dungeon Master',
      desc: 'Run your campaign, manage NPCs, track combat for the whole party, and host sessions your players can join.',
      features: ['Campaign management', 'NPC & quest tracking', 'Host party sessions', 'Combat for all players'],
      color: '#9b59b6',
      bg: 'rgba(155,89,182,0.08)',
    },
    // Dev settings moved to wrench icon in dev banner (no longer a separate mode)
  ];

  return (
    <div style={{
      position: 'fixed', top: 'var(--dev-banner-h, 0px)', left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0d0d12', overflow: 'hidden',
    }}>
      {/* Atmosphere */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(46,31,94,0.22) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '-5%', width: 500, height: 350, background: 'radial-gradient(ellipse, rgba(139,34,50,0.1) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-5%', width: 400, height: 350, background: 'radial-gradient(ellipse, rgba(26,58,92,0.12) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        {PARTICLES.map(p => (
          <motion.span
            key={p.id}
            style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontFamily: 'serif', fontSize: 12, color: '#c9a84c', opacity: 0, pointerEvents: 'none', userSelect: 'none' }}
            animate={{ y: [0, -100], opacity: [0, 0.08, 0.05, 0] }}
            transition={{ delay: p.delay, duration: p.dur, repeat: Infinity, repeatDelay: Math.random() * 6 + 4, ease: 'linear' }}
          >
            {p.sym}
          </motion.span>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 780, width: '100%', padding: '0 24px' }}
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ fontSize: 10, fontFamily: 'var(--font-heading, "Cinzel", serif)', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.35)', marginBottom: 10 }}>
            D&D Campaign Companion
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display, "Cinzel Decorative", serif)', fontWeight: 900,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, marginBottom: 4,
            background: 'linear-gradient(135deg, #ffe9a0 0%, #c9a84c 35%, #ffe9a0 65%, #c9a84c 100%)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'shimmer 5s ease-in-out infinite',
          }}>
            The Codex
          </h1>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '18px auto 12px', maxWidth: 360, opacity: 0.35 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.9))' }} />
            <svg width="12" height="12" viewBox="0 0 16 16"><path d="M8 1L9.8 6.2L15 8L9.8 9.8L8 15L6.2 9.8L1 8L6.2 6.2Z" fill="#c9a84c"/></svg>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.9), transparent)' }} />
          </div>

          <p style={{ fontSize: 15, color: 'rgba(200,175,130,0.35)', marginBottom: 40, fontFamily: 'var(--font-text, var(--font-ui, sans-serif))' }}>
            Choose your role to begin
          </p>
        </motion.div>

        {/* Mode Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
          {modes.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, type: 'spring', damping: 20 }}
              whileHover={{ y: -8, boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${m.color}15` }}
              onClick={() => m.id === 'dm' ? setShowBetaWarning(true) : setMode(m.id)}
              style={{
                borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                background: 'rgba(11,9,20,0.9)',
                border: `1px solid ${m.color}25`,
                boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
                textAlign: 'left', display: 'flex', flexDirection: 'column',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${m.color}55`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${m.color}25`}
            >
              {/* Top glow bar */}
              <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }} />

              <div style={{ padding: '28px 24px 24px' }}>
                {/* Icon + title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: m.bg, border: `1px solid ${m.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, lineHeight: 1, flexShrink: 0,
                  }}>
                    {m.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 18, color: '#efe0c0', letterSpacing: '0.02em' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: 11, color: `${m.color}88`, fontStyle: 'italic', marginTop: 2 }}>
                      {m.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.45)', lineHeight: 1.6, marginBottom: 18, fontFamily: 'var(--font-text, var(--font-ui, sans-serif))' }}>
                  {m.desc}
                </p>

                {/* Feature list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {m.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                      <span style={{ color: m.color, fontSize: 8 }}>◆</span>
                      <span style={{ color: 'rgba(200,175,130,0.5)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Select button */}
                <div style={{
                  padding: '10px 0', borderRadius: 9, textAlign: 'center',
                  background: `${m.color}12`, border: `1px solid ${m.color}25`,
                  fontFamily: 'var(--font-heading, "Cinzel", serif)',
                  fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: `${m.color}cc`,
                }}>
                  Enter as {m.title.split(' ')[0]}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ fontSize: 11, color: 'rgba(200,175,130,0.2)', fontStyle: 'italic' }}
        >
          You can switch between modes anytime from the Dashboard
        </motion.p>
      </motion.div>

      {/* Version */}
      <div style={{ position: 'fixed', bottom: 12, right: 16, fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(200,175,130,0.15)' }}>
        {APP_VERSION}
      </div>

      {/* DM Beta Warning */}
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
                  V0.0.1 BETA
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 18,
                  color: '#efe0c0', marginBottom: 10, fontWeight: 700,
                }}>
                  DM Mode is in Early Beta
                </h3>

                <p style={{
                  fontSize: 13, color: 'rgba(200,175,130,0.45)', lineHeight: 1.7,
                  marginBottom: 24, fontFamily: 'var(--font-text, var(--font-ui, sans-serif))',
                }}>
                  Some features may not exist yet or may not work as expected. We're actively building out DM tools — expect rough edges, missing functionality, and occasional bugs.
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
                      color: '#fff', fontFamily: 'var(--font-heading, "Cinzel", serif)',
                      fontSize: 11, letterSpacing: '0.08em', fontWeight: 700,
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
    </div>
  );
}
