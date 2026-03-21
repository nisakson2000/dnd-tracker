/**
 * playerAnimateDeadGuide.js
 * Player Mode: Animate Dead — necromancy army guide
 * Pure JS — no React dependencies.
 */

export const ANIMATE_DEAD_BASICS = {
  spell: 'Animate Dead',
  level: 3,
  school: 'Necromancy',
  castTime: '1 minute',
  range: '10 feet',
  duration: '24 hours (must reassert daily)',
  classes: ['Wizard', 'Cleric', 'Oathbreaker Paladin', 'Spores Druid (L6)'],
  effect: 'Raise a corpse as a Skeleton or Zombie under your command.',
  note: 'Creates permanent-ish undead servants. Must spend a slot every 24 hours to maintain control.',
};

export const SKELETON_VS_ZOMBIE = {
  skeleton: {
    hp: 13, ac: 13, speed: 30,
    attack: 'Shortbow (+4, 1d6+2) or Shortsword (+4, 1d6+2)',
    pros: ['Ranged option', 'Higher AC (13 vs 8)', 'Better for ranged formations'],
    cons: ['Lower HP (13 vs 22)', 'Vulnerable to bludgeoning'],
    rating: 'A+',
    note: 'Better overall. Shortbow range + decent AC. Line them up behind cover.',
  },
  zombie: {
    hp: 22, ac: 8, speed: 20,
    attack: 'Slam (+3, 1d6+1)',
    pros: ['Higher HP (22)', 'Undead Fortitude (CON save to not die at 0 HP)', 'Expendable meat shields'],
    cons: ['Low AC (8)', 'Slow (20ft)', 'Melee only'],
    rating: 'B+',
    note: 'Better as body blockers. Undead Fortitude can be clutch. Use as expendable tanks.',
  },
};

export const ARMY_SCALING = [
  { slots: '1 (L3)', created: 1, reasserted: 4, maxArmy: 'Day 1: 1 new. Day 2+: reassert 4 per slot.', note: 'Initial: 1 undead. Reassertion maintains up to 4 per slot.' },
  { slots: '2 (L3+L3)', created: 2, maxArmy: '8 maintained', note: 'Two L3 slots daily = 8 undead maintained.' },
  { slots: '1 (L4)', created: 2, reasserted: 6, maxArmy: 'Upcast: create 2, reassert 6.', note: 'Each slot level above 3 = +1 creation, +2 reassertion.' },
  { slots: '1 (L5)', created: 3, reasserted: 8, note: 'L5 slot: create 3 or reassert 8.' },
  { tipicalWizardL9: 'Two L3 slots for creation, two L3 for reassertion = 8-16 undead', note: 'Most wizards dedicate 2-4 slots daily. 8-16 is practical.' },
];

export const UNDEAD_ARMY_TACTICS = [
  { tactic: 'Ranged skeleton line', detail: 'Equip skeletons with shortbows. Line them up behind cover. Volley fire.', rating: 'S', note: '10 skeletons × 1d6+2 = 55 DPR average. That\'s a Fighter\'s output.' },
  { tactic: 'Zombie meat shields', detail: 'Zombies go in front. Absorb attacks. Party attacks from behind.', rating: 'A', note: 'Undead Fortitude makes them surprisingly durable. 22 HP + saves.' },
  { tactic: 'Block corridors', detail: 'Fill a 5ft corridor with zombies. Enemies can\'t pass. Living wall.', rating: 'A+', note: 'Chokepoint + zombie wall = enemies stuck.' },
  { tactic: 'Trigger traps', detail: 'Send undead ahead to trigger traps, pressure plates, hazards.', rating: 'A', note: 'Expendable trap-finders. No one mourns a skeleton.' },
  { tactic: 'Give them equipment', detail: 'Skeletons can wear armor and use weapons. Chain mail skeleton = AC 16.', rating: 'A+', note: 'Arm your skeletons properly. Dead adventurers leave gear.' },
  { tactic: 'Split party safely', detail: 'Send skeleton scouts ahead. If they die, you lose a minion, not a PC.', rating: 'A', note: 'Expendable scouts for dangerous rooms.' },
];

export const ANIMATE_DEAD_PROBLEMS = [
  'NPCs hate necromancy. Many towns will attack you on sight with an undead army.',
  'Daily slot cost: maintaining an army eats multiple spell slots every day.',
  'Turn Undead: enemy clerics can destroy your entire army with one Channel Divinity.',
  'AoE vulnerability: Fireball kills most undead in one hit.',
  'Slow gameplay: 10+ undead turns slow combat significantly. Discuss with your DM.',
  'Alignment concerns: many tables consider necromancy evil. Discuss at session zero.',
  'Command range: if you lose control (forget to reassert), they attack the nearest living creature.',
];

export const NECROMANCER_WIZARD_SYNERGY = {
  subclass: 'School of Necromancy (Wizard)',
  features: [
    { feature: 'Undead Thralls (L6)', effect: 'Animate Dead creates one extra undead. They get extra HP (Wizard level) and add PB to damage.', rating: 'S' },
    { feature: 'Inured to Undeath (L10)', effect: 'Resistance to necrotic damage. Max HP can\'t be reduced.', rating: 'A' },
    { feature: 'Command Undead (L14)', effect: 'Take control of ANY undead (WIS save). Permanently for INT ≤ 4.', rating: 'S', note: 'Steal enemy undead. Permanently control mindless undead.' },
  ],
  note: 'Necromancer Wizard creates beefier undead, more of them, and eventually steals enemy undead.',
};
