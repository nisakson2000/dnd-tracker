/**
 * playerWarlockPactMagicGuide.js
 * Player Mode: Warlock Pact Magic — slot management, short rest optimization, and Mystic Arcanum
 * Pure JS — no React dependencies.
 */

export const PACT_MAGIC_RULES = {
  slots: '1 slot at L1, 2 at L2, 3 at L11, 4 at L17.',
  slotLevel: 'All slots are the same level. L1: 1st, L3: 2nd, L5: 3rd, L7: 4th, L9: 5th.',
  recovery: 'ALL slots recover on SHORT REST. This is the key advantage.',
  mysticArcanum: 'L11+: one each of 6th, 7th, 8th, 9th level spell. 1/LR each.',
  multiclass: 'Pact Magic slots are SEPARATE from Spellcasting slots but can be used for either class\'s spells.',
  note: '2 slots that recover on short rest = 6-8 slots per day with proper resting.',
};

export const PACT_SLOT_EFFICIENCY = [
  { level: '1-2', slots: '1-2 × 1st', perDay: '3-6 (with 2 SRs)', note: 'Very few slots. Rely on Eldritch Blast.' },
  { level: '3-4', slots: '2 × 2nd', perDay: '6 (with 2 SRs)', note: 'Both slots are 2nd level. Good for Hold Person, Misty Step.' },
  { level: '5-6', slots: '2 × 3rd', perDay: '6 (with 2 SRs)', note: 'Counterspell, Hypnotic Pattern, Hunger of Hadar.' },
  { level: '7-8', slots: '2 × 4th', perDay: '6 (with 2 SRs)', note: 'Banishment, Shadow of Moil, Dimension Door.' },
  { level: '9-10', slots: '2 × 5th', perDay: '6 (with 2 SRs)', note: 'All slots are 5th level. Synaptic Static, Hold Monster.' },
  { level: '11-16', slots: '3 × 5th + MA', perDay: '9 (with 2 SRs) + 1 L6', note: 'Mystic Arcanum adds high-level spells.' },
  { level: '17-20', slots: '4 × 5th + MA', perDay: '12 (with 2 SRs) + L6-9', note: 'Maximum slots. Plus Arcanum for each level 6-9.' },
];

export const MYSTIC_ARCANUM_PICKS = [
  { level: 6, best: 'Mass Suggestion', rating: 'S+', note: 'No concentration. 24-hour charm on 12 creatures. Encounter-ender.' },
  { level: 6, alt: 'Soul Cage', rating: 'A+', note: 'Warlock-exclusive. Trap a soul. Heal, ask questions, gain advantage.' },
  { level: 7, best: 'Forcecage', rating: 'S+', note: 'No save, no concentration. Cage anything. Combines with AoE.' },
  { level: 7, alt: 'Plane Shift', rating: 'A+', note: 'Banish enemies or travel between planes.' },
  { level: 8, best: 'Glibness', rating: 'S+', note: 'Min 15 on CHA checks for 1 hour. Counterspell always succeeds at 15+.' },
  { level: 8, alt: 'Dominate Monster', rating: 'A+', note: 'Control any creature. Concentration. WIS save.' },
  { level: 9, best: 'Foresight', rating: 'S+', note: 'Advantage on everything, enemies have disadvantage against you. 8 hours, no concentration.' },
  { level: 9, alt: 'True Polymorph', rating: 'S+', note: 'Transform permanently. Create magic items. Game-breaking.' },
];

export const SHORT_REST_OPTIMIZATION = [
  'Push for short rests between every 1-2 fights. Your class depends on it.',
  'Pact slots recover fully on short rest. 2 SRs = 6 total 5th-level slots per day.',
  'If your party doesn\'t short rest, you are significantly weaker than other casters.',
  'Eldritch Blast is your bread and butter between rests. Save slots for impact spells.',
  'Catnap (3rd level spell): 10-minute short rest for 3 creatures. If someone has it.',
  'Communicate with your party. "I need a short rest" should be a regular request.',
];

export const PACT_MAGIC_TIPS = [
  'ALL slots are max level. Every spell is upcast automatically. Advantage for scaling spells.',
  'Short rest = full slot recovery. This is your core advantage over other casters.',
  'Eldritch Blast is free and scales. Don\'t waste slots on damage cantrip replacements.',
  'Hex is overrated at higher levels. Concentration is better used on Hypnotic Pattern, etc.',
  'Mystic Arcanum: choose wisely. You can\'t change them. One per level, 1/LR.',
  'Glibness at L8: minimum 15 on CHA checks = auto-succeed Counterspell at any level.',
  'Foresight at L9: advantage on EVERYTHING for 8 hours. No concentration. Best buff.',
  'Multiclass: Pact slots are separate. Sorcerer can convert them to Sorcery Points.',
  'Coffeelock (Sorlock): convert Pact slots to SP on short rest, create spell slots. Controversial.',
  'Don\'t try to compete with Wizards on versatility. Excel at what you do: EB + impactful spells.',
];
