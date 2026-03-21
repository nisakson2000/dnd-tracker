/**
 * playerFamiliarCompanion.js
 * Player Mode: Familiar / Animal Companion / Summoned creature tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// FAMILIAR STAT BLOCKS
// ---------------------------------------------------------------------------

export const FIND_FAMILIAR_OPTIONS = [
  { name: 'Bat', ac: 12, hp: 1, speed: '5ft, fly 30ft', senses: 'Blindsight 60ft', special: 'Echolocation, Keen Hearing' },
  { name: 'Cat', ac: 12, hp: 2, speed: '40ft, climb 30ft', senses: 'Darkvision 60ft', special: 'Keen Smell' },
  { name: 'Crab', ac: 11, hp: 2, speed: '20ft, swim 20ft', senses: 'Blindsight 30ft', special: 'Amphibious' },
  { name: 'Frog', ac: 11, hp: 1, speed: '20ft, swim 20ft', senses: 'Darkvision 30ft', special: 'Amphibious, Standing Leap' },
  { name: 'Hawk', ac: 13, hp: 1, speed: '10ft, fly 60ft', senses: 'Normal', special: 'Keen Sight' },
  { name: 'Lizard', ac: 10, hp: 2, speed: '20ft, climb 20ft', senses: 'Darkvision 30ft', special: '' },
  { name: 'Octopus', ac: 12, hp: 3, speed: '5ft, swim 30ft', senses: 'Darkvision 30ft', special: 'Ink Cloud, Water Breathing' },
  { name: 'Owl', ac: 11, hp: 1, speed: '5ft, fly 60ft', senses: 'Darkvision 120ft', special: 'Flyby, Keen Hearing & Sight' },
  { name: 'Poisonous Snake', ac: 13, hp: 2, speed: '30ft, swim 30ft', senses: 'Blindsight 10ft', special: 'Poison bite (DC 10, 2d4)' },
  { name: 'Fish (Quipper)', ac: 13, hp: 1, speed: 'swim 40ft', senses: 'Darkvision 60ft', special: 'Blood Frenzy, Water Breathing' },
  { name: 'Rat', ac: 10, hp: 1, speed: '20ft', senses: 'Darkvision 30ft', special: 'Keen Smell' },
  { name: 'Raven', ac: 12, hp: 1, speed: '10ft, fly 50ft', senses: 'Normal', special: 'Mimicry' },
  { name: 'Sea Horse', ac: 11, hp: 1, speed: 'swim 20ft', senses: 'Normal', special: 'Water Breathing' },
  { name: 'Spider', ac: 12, hp: 1, speed: '20ft, climb 20ft', senses: 'Darkvision 30ft', special: 'Spider Climb, Web Sense' },
  { name: 'Weasel', ac: 13, hp: 1, speed: '30ft', senses: 'Darkvision 60ft', special: 'Keen Hearing & Smell' },
];

// ---------------------------------------------------------------------------
// FAMILIAR RULES
// ---------------------------------------------------------------------------

export const FAMILIAR_RULES = {
  actions: [
    'Cannot attack (uses Help action instead).',
    'Can deliver touch-range spells for the caster.',
    'Can be temporarily dismissed to a pocket dimension.',
    'Can communicate telepathically with caster within 100ft.',
    'Caster can see/hear through familiar\'s senses (action cost).',
  ],
  onDeath: 'If the familiar drops to 0 HP, it disappears. Re-summoning costs 10gp of charcoal, incense, and herbs.',
  dismissal: 'Can be dismissed as an action. Reappears within 30ft when summoned again.',
  warlock: {
    pactOfTheChain: 'Warlocks with Pact of the Chain gain additional familiar options: Imp, Pseudodragon, Quasit, or Sprite.',
    investmentOfTheChain: 'Investment of the Chain Master: Familiar can attack with your reaction, and you can command it with a bonus action.',
  },
};

// ---------------------------------------------------------------------------
// COMPANION TRACKER TEMPLATE
// ---------------------------------------------------------------------------

export const COMPANION_TEMPLATE = {
  name: '',
  type: 'familiar',    // 'familiar', 'companion', 'summoned', 'wild_shape'
  currentHp: 0,
  maxHp: 0,
  ac: 0,
  speed: '',
  senses: '',
  special: '',
  conditions: [],
  isActive: true,      // false if dismissed or dead
  dismissedAt: null,
};
