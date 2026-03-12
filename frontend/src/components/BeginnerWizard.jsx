import { useState } from 'react';
import { ChevronRight, ChevronLeft, X, BookOpen, Sword, Sparkles, Shield, Heart, Dice5, Scroll, Users } from 'lucide-react';

const STEPS = [
  {
    icon: BookOpen,
    title: "Welcome to D&D!",
    content: [
      "Dungeons & Dragons is a tabletop roleplaying game where you and your friends go on adventures together. One person (the Dungeon Master, or DM) tells the story, and you decide what your character does.",
      "You don't need to memorize rules — the DM will guide you. This app handles all the math and tracking so you can focus on the story.",
      "Let's walk through the basics so you feel confident at the table!",
    ],
    tip: "Don't worry about getting things wrong. D&D is about having fun, not perfection!",
  },
  {
    icon: Dice5,
    title: "Rolling Dice",
    content: [
      "D&D uses different shaped dice. The number after 'd' is how many sides it has:",
      "d4 (4 sides) · d6 (6 sides, like board games) · d8 · d10 · d12 · d20 (the big important one)",
      "'Roll a d20' = roll the 20-sided die. '2d6+3' = roll two 6-sided dice, add them, then add 3.",
      "The d20 is king — you roll it for almost everything: attacking, dodging, persuading, sneaking, and more. High = good!",
    ],
    tip: "You can use the Dice Roller in this app instead of physical dice — it handles all the math for you.",
  },
  {
    icon: Shield,
    title: "Your Six Stats",
    content: [
      "Every character has six ability scores that define what they're good at:",
      "STR (Strength) — hitting things, lifting, athletics\nDEX (Dexterity) — dodging, sneaking, aiming\nCON (Constitution) — health, endurance, staying alive",
      "INT (Intelligence) — knowledge, magic (Wizard)\nWIS (Wisdom) — perception, insight, magic (Cleric/Druid)\nCHA (Charisma) — persuasion, deception, magic (Bard/Warlock)",
      "Each score has a modifier — that's the +/- number you add to dice rolls. Score of 10 = +0, 14 = +2, 18 = +4.",
    ],
    tip: "You don't need high scores in everything. Most characters are great at 1-2 stats and average at the rest.",
  },
  {
    icon: Heart,
    title: "Health & Combat",
    content: [
      "Hit Points (HP) = your health. Take damage and HP drops. Hit 0 and you're in trouble (death saving throws).",
      "Armor Class (AC) = how hard you are to hit. Enemies roll d20 + bonus. If they meet or beat your AC, they hit you.",
      "On your turn you get: one Action (attack, cast a spell, etc.), one Bonus Action (if you have one), and Movement (walk up to your speed).",
      "Initiative = the order everyone takes turns. You roll d20 + your DEX modifier at the start of combat.",
    ],
    tip: "If you're not sure what to do on your turn, just say 'I attack the nearest enemy' — the DM will walk you through the rest!",
  },
  {
    icon: Sparkles,
    title: "Magic & Spells",
    content: [
      "Not every class uses magic. If yours does (Wizard, Cleric, Bard, Sorcerer, Warlock, Druid, Paladin, Ranger), here's how it works:",
      "Cantrips = free spells you can cast anytime, as much as you want. No cost.",
      "Spell Slots = fuel for bigger spells. A Level 1 spell costs one Level 1 slot. You get slots back after a long rest (8 hours of sleep).",
      "Concentration = some spells need you to focus. You can only concentrate on one spell at a time — if you take damage, you might lose it.",
    ],
    tip: "If you're a martial class (Fighter, Barbarian, Rogue, Monk), you don't need to worry about this section at all!",
  },
  {
    icon: Sword,
    title: "Skills & Saving Throws",
    content: [
      "Skills are specific things your character is trained in, like Stealth, Persuasion, or Athletics.",
      "If you're proficient in a skill, you add your proficiency bonus to that roll. At level 1, that's +2.",
      "Saving Throws protect you from bad effects. 'Make a DEX save' = roll d20 + DEX modifier (+ proficiency if trained).",
      "Passive Perception = 10 + your Perception modifier. The DM uses this to check if you notice hidden things without you rolling.",
    ],
    tip: "Your class and background determine your skill proficiencies — they're already set up in the app!",
  },
  {
    icon: Users,
    title: "Resting & Leveling Up",
    content: [
      "Short Rest (about 1 hour): Spend hit dice to heal. Some abilities recharge too.",
      "Long Rest (8 hours): Recover ALL HP, ALL spell slots, and half your hit dice. Reset almost everything.",
      "The app has Short Rest and Long Rest buttons that handle all of this automatically!",
      "As you play and earn XP, you'll level up — gaining new abilities, more HP, and stronger spells. The app tracks all of this for you.",
    ],
    tip: "Ask your DM when it makes sense to rest. Taking a long rest in a dungeon might not be safe!",
  },
  {
    icon: BookOpen,
    title: "You're Ready!",
    content: [
      "That's everything you need to start playing. Here's what to remember:",
      "Look for the (?) help icons throughout the app — hover over them for explanations of every game term.",
      "The Rules Reference in the sidebar has a searchable guide to all D&D rules and concepts.",
      "Your DM is your best resource — don't be afraid to ask questions during the game. Everyone was new once!",
    ],
    tip: "The most important rule: have fun! If you're not sure about something, just describe what your character wants to do.",
  },
];

export default function BeginnerWizard({ onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'linear-gradient(160deg,#14121c 0%,#1a1528 100%)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 16, padding: '28px 28px 24px', maxWidth: 520, width: '100%', margin: '0 16px', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(201,168,76,0.3)', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(201,168,76,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,168,76,0.3)'}
        >
          <X size={18} />
        </button>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 22 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: 6, borderRadius: 99, transition: 'all 0.3s',
                width: i === step ? 24 : 6,
                background: i === step ? '#c9a84c' : i < step ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.12)',
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={24} style={{ color: '#c9a84c' }} />
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontFamily: 'var(--font-heading, "Cinzel Decorative", serif)', fontSize: 22, color: '#efe0c0', textAlign: 'center', marginBottom: 16 }}>
          {current.title}
        </h3>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}>
          {current.content.map((paragraph, i) => (
            <p key={i} style={{ fontSize: 13, color: 'rgba(200,175,130,0.55)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line', fontFamily: 'var(--font-text, var(--font-ui))' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tip box */}
        {current.tip && (
          <div style={{
            background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 18,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{ fontSize: 11, color: 'rgba(201,168,76,0.6)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
              {current.tip}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 8, border: 'none', cursor: step === 0 ? 'not-allowed' : 'pointer',
              background: 'rgba(255,255,255,0.04)', color: step === 0 ? 'rgba(200,175,130,0.2)' : 'rgba(200,175,130,0.5)',
              fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.04em', transition: 'all 0.15s',
            }}
          >
            <ChevronLeft size={14} /> Back
          </button>

          <span style={{ fontSize: 11, color: 'rgba(200,175,130,0.25)', fontFamily: 'var(--font-heading)' }}>
            {step + 1} / {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#c9a84c,#f0d878)', color: '#12101c',
                fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.06em', fontWeight: 700,
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#c9a84c,#f0d878)', color: '#12101c',
                fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.06em', fontWeight: 700,
              }}
            >
              <Scroll size={13} /> Start Playing!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
