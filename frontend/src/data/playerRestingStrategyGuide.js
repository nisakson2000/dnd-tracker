/**
 * playerRestingStrategyGuide.js
 * Player Mode: Short rest vs long rest — when to rest, resource pacing, and optimization
 * Pure JS — no React dependencies.
 */

export const REST_RULES = {
  shortRest: {
    duration: '1 hour (30 min with Catnap spell).',
    hitDice: 'Spend Hit Dice to heal. Roll HD + CON mod per die.',
    resources: 'Recovers: Warlock slots, Fighter features (Action Surge, Second Wind), Monk ki, Bard inspiration (L5+), many subclass features.',
    frequency: 'Intended: 2 per adventuring day.',
  },
  longRest: {
    duration: '8 hours (minimum 6 hours sleep + 2 hours light activity).',
    healing: 'Regain ALL hit points.',
    hitDice: 'Regain half your total Hit Dice (minimum 1).',
    resources: 'Recovers: ALL spell slots, ALL class features, removes 1 exhaustion level.',
    frequency: 'Intended: 1 per adventuring day.',
    restriction: 'Can only benefit from 1 long rest per 24 hours.',
  },
};

export const SHORT_REST_DEPENDENT_CLASSES = [
  { class: 'Warlock', dependency: 'S+', reason: 'ALL Pact Magic slots recover. Core class mechanic.' },
  { class: 'Fighter', dependency: 'S+', reason: 'Action Surge + Second Wind + Superiority Dice (BM) + Indomitable.' },
  { class: 'Monk', dependency: 'S+', reason: 'ALL ki points recover. Without ki, Monk is severely weakened.' },
  { class: 'Bard (L5+)', dependency: 'S', reason: 'Bardic Inspiration dice recover on SR at Font of Inspiration.' },
  { class: 'Cleric', dependency: 'A+', reason: 'Channel Divinity recovers. Arcane Recovery equivalent (some domains).' },
  { class: 'Druid', dependency: 'A+', reason: 'Wild Shape recovers. Natural Recovery (Land) restores slots.' },
  { class: 'Paladin', dependency: 'A', reason: 'Channel Divinity recovers. Otherwise long rest dependent.' },
  { class: 'Wizard', dependency: 'A', reason: 'Arcane Recovery (L1): recover spell slots = half wizard level 1/day.' },
  { class: 'Sorcerer', dependency: 'B+', reason: 'Mostly long rest dependent. Some subclass SR features.' },
];

export const ADVENTURING_DAY_PACING = {
  intended: '6-8 medium/hard encounters with 2 short rests and 1 long rest.',
  nova: '1-2 encounters per long rest. Favors long rest classes (Wizard, Sorcerer, Paladin).',
  grind: '6+ encounters per long rest. Favors short rest classes (Warlock, Fighter, Monk).',
  note: 'Most tables run 2-4 encounters. This heavily favors long rest casters.',
};

export const REST_OPTIMIZATION = [
  'Push for short rests if you have a Warlock, Fighter, or Monk in the party.',
  'Catnap (3rd level): 10-minute short rest for 3 creatures. Game-changer for pacing.',
  'Leomund\'s Tiny Hut: safe long rest anywhere. Impenetrable dome.',
  'Hit Dice: don\'t spend them all in one rest. Save some for later.',
  'Song of Rest (Bard): extra 1d6-1d12 healing per HD spent on short rest.',
  'Chef feat: short rest snacks give 1d8 temp HP to PB creatures. Great support.',
  'Durable feat: minimum HD healing = 2 × CON mod. Good for low-CON characters.',
  'Perkins rest variant: short rest = 5 minutes. Makes short rests more practical.',
];

export const REST_TIPS = [
  'The "adventuring day" is 6-8 encounters. Most tables do 2-3. This is normal.',
  'Short rest = 1 hour. Long rest = 8 hours. Plan accordingly.',
  'Warlock/Fighter/Monk: advocate for short rests. Your class depends on them.',
  'Wizard/Sorcerer: try to conserve slots for big fights if few rests.',
  'Tiny Hut: safe rest in any dungeon. 8-hour dome. Ritual cast it.',
  'Long rest: regain ALL HP. Half your hit dice. Remove 1 exhaustion.',
  'You can only benefit from 1 long rest per 24 hours. No rest stacking.',
  'Alarm spell: set up perimeter for safe resting in the wild.',
  'Don\'t forget: light activity during long rest includes standing watch.',
  'Exhaustion removes only 1 level per long rest. Multiple levels take multiple days.',
];
