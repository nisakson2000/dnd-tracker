import { useState } from 'react';
import { X, BookOpen, Layout, Compass, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

const STORAGE_KEY = 'codex-player-welcome-seen';

const STEPS = [
  {
    title: 'Welcome to The Codex',
    icon: BookOpen,
    color: '#c9a84c',
    content: [
      'Your character is ready! Here\'s a quick tour of what you can do.',
      'The Codex is your all-in-one D&D companion — manage your character sheet, track inventory, spells, and more.',
    ],
  },
  {
    title: 'Your Character Sheet',
    icon: Layout,
    color: '#4ade80',
    content: [
      'Stats, HP, and abilities are all on the Overview page. Click any modifier to roll dice instantly.',
      'Changes auto-save as you type — no save button needed.',
      'Sections can be collapsed or expanded to focus on what matters most right now.',
    ],
  },
  {
    title: 'Navigation',
    icon: Compass,
    color: '#60a5fa',
    content: [
      'Use the sidebar to switch between sections: Overview, Backstory, Spellbook, Inventory, and more.',
      'Pin your favorites using the star icon in the quick-access bar at the top.',
      'Press ? to see all keyboard shortcuts.',
    ],
  },
  {
    title: 'You\'re Ready!',
    icon: Sparkles,
    color: '#c084fc',
    content: [
      'Jump to your Character Sheet and start playing.',
      'Look for the help icons (?) next to section titles if you need guidance on any feature.',
      'Your DM can send you prompts, loot, and conditions during live sessions.',
    ],
  },
];

export function shouldShowPlayerWelcome() {
  return localStorage.getItem(STORAGE_KEY) !== 'true';
}

export default function PlayerWelcome({ onClose }) {
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
        position: 'relative',
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
                if (isLast) handleDismissForever();
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
              onClick={onClose}
              style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 10,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.2)', cursor: 'pointer',
              }}
            >
              Skip and don't show again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
