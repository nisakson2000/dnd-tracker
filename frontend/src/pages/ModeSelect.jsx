import { useState, lazy, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sword, Crown, Dice5, Shield, Heart, Sparkles, Users, X, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppMode } from '../contexts/ModeContext';
import { useUpdateCheck } from '../hooks/useUpdateCheck';
import { APP_VERSION, DM_MODE_VERSION } from '../version';

const Updates = lazy(() => import('../sections/Updates'));

const RUNE_CHARS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ'];
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: 30 + Math.random() * 70,
  sym: RUNE_CHARS[i % RUNE_CHARS.length],
  delay: Math.random() * 10, dur: 14 + Math.random() * 8,
  repeatDelay: Math.random() * 6 + 4,
}));

export default function ModeSelect() {
  const { setMode } = useAppMode();
  const [showBetaWarning, setShowBetaWarning] = useState(false);
  const [showTutorials, setShowTutorials] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const { updateAvailable, dmUpdateAvailable } = useUpdateCheck();

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
            transition={{ delay: p.delay, duration: p.dur, repeat: Infinity, repeatDelay: p.repeatDelay, ease: 'linear' }}
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
              onClick={() => {
                if (m.id === 'dm') {
                  const devUnlocked = (() => { try { return localStorage.getItem('codex-dev-unlocked') === 'true'; } catch { return false; } })();
                  if (import.meta.env.DEV || devUnlocked) {
                    setShowBetaWarning(true);
                  } else {
                    toast('DM Mode is currently in development. Available to devs only!', {
                      icon: '🔒',
                      duration: 4000,
                      style: { background: '#1a1520', color: '#c9a84c', border: '1px solid rgba(155,89,182,0.3)', fontFamily: 'Cinzel, Georgia, serif' },
                    });
                  }
                } else {
                  setMode(m.id);
                }
              }}
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
                    <div style={{ fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 18, color: '#efe0c0', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
                      {m.title}
                      {m.id === 'dm' && !import.meta.env.DEV && (() => { try { return localStorage.getItem('codex-dev-unlocked') !== 'true'; } catch { return true; } })() && (
                        <span style={{
                          fontSize: 9, padding: '2px 8px', borderRadius: 6,
                          background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)',
                          color: '#c084fc', letterSpacing: '0.08em', textTransform: 'uppercase',
                          fontFamily: 'var(--font-ui, sans-serif)', fontWeight: 700,
                        }}>
                          Coming Soon
                        </span>
                      )}
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

        {/* Tutorials button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => setShowTutorials(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 22px', borderRadius: 10,
            background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
            color: 'rgba(201,168,76,0.5)', cursor: 'pointer',
            fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 12,
            letterSpacing: '0.08em', transition: 'all 0.2s', marginBottom: 16,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.color = 'rgba(201,168,76,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'; e.currentTarget.style.color = 'rgba(201,168,76,0.5)'; }}
        >
          <BookOpen size={14} />
          Tutorials & Guides
        </motion.button>

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

      {/* Bottom-left: Updates */}
      <div style={{ position: 'fixed', bottom: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8, zIndex: 20 }}>
        <button
          onClick={() => setShowUpdates(true)}
          title="Updates"
          style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 9,
            background: (updateAvailable || dmUpdateAvailable) ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${(updateAvailable || dmUpdateAvailable) ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'}`,
            color: (updateAvailable || dmUpdateAvailable) ? 'rgba(74,222,128,0.6)' : 'rgba(200,175,130,0.4)',
            cursor: 'pointer',
            fontFamily: 'var(--font-heading, "Cinzel", serif)', fontSize: 11,
            letterSpacing: '0.06em', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = (updateAvailable || dmUpdateAvailable) ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = (updateAvailable || dmUpdateAvailable) ? 'rgba(74,222,128,0.35)' : 'rgba(201,168,76,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = (updateAvailable || dmUpdateAvailable) ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = (updateAvailable || dmUpdateAvailable) ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'; }}
        >
          <Bell size={13} />
          Updates
          {(updateAvailable || dmUpdateAvailable) && (
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
                  {DM_MODE_VERSION}
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
