import { useState } from 'react';
import { X, Crown, MapPin, Swords, Megaphone, ScrollText, HelpCircle, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

const STORAGE_KEY = 'codex-dm-tutorial-dismissed';

const STEPS = [
  {
    title: 'Welcome, Dungeon Master',
    icon: Crown,
    color: '#c9a84c',
    content: [
      'The DM Toolbar gives you full control over your live session — campaigns, combat, communications, and event logging — all from a floating panel.',
      'This guide will walk you through each tool. You can always reopen this by clicking the ? button on the toolbar.',
    ],
  },
  {
    title: 'Campaign Panel',
    icon: MapPin,
    color: '#4ade80',
    content: [
      'Start a live session by selecting a campaign. Once active, you\'ll see a compact session header with timer, player count, and combat status.',
      'Navigate scenes from the collapsible scene list. Each scene shows DM notes and description.',
      'Quick Actions appear based on the current scene — reveal NPCs, activate quests, start encounters, or hand out documents with one click.',
    ],
  },
  {
    title: 'Combat Manager',
    icon: Swords,
    color: '#ef4444',
    content: [
      'Start encounters from the Campaign panel or Combat panel. Initiative is auto-rolled for all players and monsters.',
      'Track monster HP with damage/heal buttons. Monsters are auto-killed at 0 HP and XP is logged.',
      'The Player HP strip shows your party\'s health at a glance below the monsters.',
      'Use the combat mini-bar (always visible during combat) to advance turns or end the encounter quickly.',
      'Add conditions like Poisoned, Stunned, or Frightened to monsters for tracking.',
    ],
  },
  {
    title: 'Communications',
    icon: Megaphone,
    color: '#f59e0b',
    content: [
      'The Comms panel has two tabs: Broadcast and Prompt.',
      'Broadcast sends narrative text, loot announcements, quest updates, or general announcements to all players.',
      'Prompt requests actions from players — skill checks, choices, confirmations, or free-text questions.',
      'Use Quick Checks for common D&D skill checks (Perception, Stealth, Investigation, etc.) with proper DCs by difficulty tier.',
      'Target specific players or send to everyone.',
    ],
  },
  {
    title: 'Action Log',
    icon: ScrollText,
    color: '#60a5fa',
    content: [
      'Every session event is automatically logged — scene changes, combat starts/ends, monster kills, NPC reveals, quest activations, and more.',
      'The log is timestamped and color-coded by event type.',
      'Use it to recap what happened or review the session timeline.',
    ],
  },
  {
    title: 'Tips & Tricks',
    icon: Sparkles,
    color: '#c084fc',
    content: [
      'Click the status bars (green session bar or red combat bar) to quickly open the relevant panel.',
      'The toolbar stays visible across all app sections while you\'re hosting.',
      'Use the Arcane Advisor (AI Assistant) for rules questions, encounter ideas, or lore generation.',
      'You can ask the AI "How do I use the DM tools?" for live help anytime.',
    ],
  },
];

export function shouldShowTutorial() {
  return localStorage.getItem(STORAGE_KEY) !== 'true';
}

export default function DmTutorial({ onClose }) {
  const [step, setStep] = useState(0);

  const handleDismissForever = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onClose();
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        maxWidth: 480, width: '92vw',
        background: 'linear-gradient(135deg, #1a1520, #12101a)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 16, padding: '28px 24px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.08)',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.25)', padding: 4, display: 'flex',
          }}
        >
          <X size={16} />
        </button>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, justifyContent: 'center' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 24 : 8, height: 4, borderRadius: 2,
                background: i === step ? current.color : 'rgba(255,255,255,0.1)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        {/* Icon + Title */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', padding: 12, borderRadius: 12,
            background: `${current.color}12`, border: `1px solid ${current.color}30`,
            marginBottom: 12,
          }}>
            <Icon size={28} style={{ color: current.color }} />
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: '#e8d9b5',
            fontFamily: 'Cinzel, Georgia, serif',
          }}>
            {current.title}
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {current.content.map((text, i) => (
            <div
              key={i}
              style={{
                fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6,
                fontFamily: 'var(--font-ui)',
                padding: '0 4px',
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: step === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
              cursor: step === 0 ? 'default' : 'pointer',
            }}
          >
            <ChevronLeft size={12} /> Back
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {!isLast && (
              <button
                onClick={handleDismissForever}
                style={{
                  padding: '8px 14px', borderRadius: 8, fontSize: 11,
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                }}
              >
                Don't show again
              </button>
            )}

            <button
              onClick={() => {
                if (isLast) onClose();
                else setStep(s => s + 1);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: `${current.color}18`, border: `1px solid ${current.color}40`,
                color: current.color, cursor: 'pointer',
                fontFamily: 'var(--font-heading)', letterSpacing: '0.04em',
              }}
            >
              {isLast ? 'Get Started' : 'Next'} {!isLast && <ChevronRight size={12} />}
            </button>
          </div>
        </div>

        {/* Don't show again — on last step */}
        {isLast && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button
              onClick={handleDismissForever}
              style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 10,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.2)', cursor: 'pointer',
              }}
            >
              Don't show this tutorial again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
