import { useState } from 'react';
import { ChevronRight, ChevronLeft, X, BookOpen, Sword, Sparkles, Shield, Heart, Dice5 } from 'lucide-react';

const STEPS = [
  {
    icon: BookOpen,
    title: "Welcome to D&D!",
    content: [
      "Dungeons & Dragons is a tabletop roleplaying game where you create a character and go on adventures narrated by a Dungeon Master (DM).",
      "This tracker helps you manage your character's stats, spells, inventory, and story — so you can focus on the fun parts.",
      "Let's walk through the basics so you know what everything means!",
    ],
  },
  {
    icon: Dice5,
    title: "Dice Notation",
    content: [
      "D&D uses polyhedral dice. The number after 'd' tells you how many sides:",
      "d4 (pyramid) • d6 (cube) • d8 • d10 • d12 • d20 (the big one) • d100",
      "'2d6+3' means: roll two six-sided dice, add them together, then add 3.",
      "The d20 is the most important — you roll it for almost every check in the game.",
    ],
  },
  {
    icon: Shield,
    title: "Ability Scores",
    content: [
      "Your character has six core stats: Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma.",
      "Each score has a modifier — this is the number you actually add to dice rolls. A score of 10 gives +0, 14 gives +2, 18 gives +4.",
      "When the game says 'make a Dexterity check,' you roll a d20 and add your DEX modifier.",
    ],
  },
  {
    icon: Heart,
    title: "Hit Points & Combat",
    content: [
      "Hit Points (HP) represent your health. When you take damage, your HP goes down. At 0 HP, you start making death saving throws.",
      "Armor Class (AC) is how hard you are to hit. Enemies roll d20 + their bonus — if it meets or exceeds your AC, they hit.",
      "On your turn in combat, you get: 1 action, 1 bonus action (if available), and movement up to your speed.",
    ],
  },
  {
    icon: Sparkles,
    title: "Spellcasting",
    content: [
      "If your class can cast spells, you have spell slots — think of them as fuel. Each spell costs one slot of its level or higher.",
      "Cantrips are free spells you can cast anytime without using slots.",
      "Spell Save DC is the number enemies must beat to resist your spells. Spell Attack Bonus is added to your d20 when a spell requires an attack roll.",
      "You recover all spell slots after a long rest (8 hours). Warlocks recover theirs on a short rest (1 hour).",
    ],
  },
  {
    icon: Sword,
    title: "Skills & Saves",
    content: [
      "Skills represent specific talents. If you're proficient, you add your proficiency bonus (+2 at level 1, scaling up to +6).",
      "Saving throws are rolls to resist harmful effects. Your class determines which two saves you're proficient in.",
      "Passive Perception (10 + Perception modifier) represents your baseline alertness — the DM uses it to check if you notice hidden dangers.",
    ],
  },
  {
    icon: Shield,
    title: "Resting & Recovery",
    content: [
      "Short Rest (1 hour): Spend hit dice to recover HP. Some class features also recharge.",
      "Long Rest (8 hours): Recover all HP, all spell slots, and half your hit dice. Exhaustion decreases by 1 level.",
      "Use the Short Rest and Long Rest buttons on the Character Sheet to automatically handle all the math!",
    ],
  },
  {
    icon: BookOpen,
    title: "You're Ready!",
    content: [
      "That covers the essentials! Here are some tips:",
      "Look for the (?) icons throughout the app — hover over them for plain-English explanations of every game concept.",
      "Check out the Rules Reference section in the sidebar for a searchable glossary of all D&D terms.",
      "Don't worry about memorizing everything — the DM will guide you, and this tracker handles the math. Have fun!",
    ],
  },
];

export default function BeginnerWizard({ onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#14121c] border border-gold/30 rounded-lg p-6 max-w-lg w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-amber-200/30 hover:text-amber-200/70">
          <X size={18} />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-gold w-6' : i < step ? 'bg-gold/40' : 'bg-amber-200/15'}`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Icon size={24} className="text-gold" />
          </div>
        </div>

        {/* Content */}
        <h3 className="font-display text-xl text-amber-100 text-center mb-4">{current.title}</h3>
        <div className="space-y-3 mb-6">
          {current.content.map((paragraph, i) => (
            <p key={i} className="text-sm text-amber-200/60 leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className={`btn-secondary text-sm flex items-center gap-1 ${step === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft size={14} /> Back
          </button>
          <span className="text-xs text-amber-200/30">{step + 1} / {STEPS.length}</span>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn-primary text-sm flex items-center gap-1">
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={onClose} className="btn-primary text-sm">
              Get Started!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
