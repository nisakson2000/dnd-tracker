/**
 * playerGrappleShoveGuide.js
 * Player Mode: Grapple and shove mechanics — rules, builds, and tactics
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_RULES = {
  action: 'Replaces one attack (with Extra Attack, you can grapple + attack).',
  check: 'Your Athletics vs target\'s Athletics or Acrobatics (their choice).',
  sizeLimit: 'Target can be up to one size larger than you.',
  effect: 'Grappled creature: speed = 0. Can still attack and cast spells.',
  escape: 'Target uses action: Athletics or Acrobatics vs your Athletics.',
  freeHand: 'Requires a free hand to grapple.',
  move: 'You can drag/carry the grappled creature. Your speed halved.',
  note: 'Grapple alone is weak. Grapple + prone = devastating.',
};

export const SHOVE_RULES = {
  action: 'Replaces one attack.',
  check: 'Your Athletics vs target\'s Athletics or Acrobatics (their choice).',
  sizeLimit: 'Target can be up to one size larger.',
  options: [
    { option: 'Knock Prone', effect: 'Target falls prone. Advantage on melee, disadvantage on ranged vs them.' },
    { option: 'Push 5ft', effect: 'Push target 5ft away from you.', note: 'Push off cliff, into hazard, away from ally.' },
  ],
  note: 'No free hand needed for shove.',
};

export const GRAPPLE_PRONE_COMBO = {
  how: 'First attack: grapple (Athletics contest). Second attack: shove prone.',
  result: 'Target is grappled (speed 0) AND prone. Can\'t stand up (speed 0).',
  effect: 'All melee attacks against them have advantage. They attack at disadvantage.',
  escape: 'Must break grapple first (action), THEN stand up (half movement).',
  note: 'This is the core grapple strategy. Grapple alone is mediocre.',
};

export const GRAPPLE_BUILD = {
  stats: 'High STR (primary). CON secondary. Athletics expertise.',
  race: [
    { race: 'Goliath', why: 'Powerful Build (count as Large for carry/push). Stone\'s Endurance.' },
    { race: 'Loxodon', why: 'Trunk: free grapple without hands. Still attack with weapons.' },
    { race: 'Bugbear', why: 'Long-Limbed: 5ft extra reach on your turn.' },
    { race: 'Custom Lineage / V.Human', why: 'Free feat at L1 (Skill Expert for Athletics expertise).' },
  ],
  feats: [
    { feat: 'Skill Expert', why: 'Expertise in Athletics. +proficiency × 2 to grapple checks.' },
    { feat: 'Tavern Brawler', why: 'Bonus action grapple after hitting with unarmed/improvised weapon.' },
    { feat: 'Grappler', why: 'Advantage on attacks vs creature you\'re grappling. Mediocre feat overall.' },
    { feat: 'Shield Master', why: 'Bonus action shove after Attack action. Free prone.' },
  ],
  classes: [
    { class: 'Barbarian', why: 'Advantage on STR checks (rage). Athletics with advantage. Natural grappler.' },
    { class: 'Rune Knight Fighter', why: 'Grow Large (L3). Grapple Huge creatures. Giant\'s Might.' },
    { class: 'Bard (Lore/Swords)', why: 'Expertise in Athletics. Jack of All Trades. Spells for support.' },
  ],
};

export const GRAPPLE_SPELLS = [
  { spell: 'Enlarge (L2)', effect: 'Become Large. Grapple Huge creatures. +1d4 damage.', note: 'Essential for grappling big enemies.' },
  { spell: 'Enhance Ability: Bull\'s Strength', effect: 'Advantage on STR checks. Double carry capacity.', note: 'Advantage on all grapple checks for 1 hour.' },
  { spell: 'Spike Growth (L2)', effect: 'Drag grappled enemy through spikes. 2d4 per 5ft.', note: '30ft drag = 12d4 damage. Devastating combo.' },
  { spell: 'Spirit Guardians (L3)', effect: 'Grapple enemy in your Spirit Guardians. 3d8/round.', note: 'They can\'t leave. Take damage every turn.' },
  { spell: 'Wall of Fire (L4)', effect: 'Drag enemy through the wall. 5d8 fire.', note: 'Drag back and forth. Multiple hits.' },
];

export const GRAPPLE_SHOVE_TIPS = [
  'Grapple + Prone: the core combo. Speed 0 = can\'t stand up.',
  'Grapple replaces one attack. With Extra Attack: grapple + attack.',
  'Barbarian: advantage on STR checks while raging. Best grappler class.',
  'Skill Expert feat: Athletics expertise. Huge grapple bonus.',
  'Enlarge: become Large. Grapple Huge creatures.',
  'Spike Growth + drag: 2d4 per 5ft moved through.',
  'Shield Master: bonus action shove prone after Attack. Free combo.',
  'Rune Knight: grow Large at L3. Natural grappler Fighter.',
  'Loxodon trunk: grapple without using hands. Attack normally.',
  'Shove off cliffs: 5ft push into a 100ft fall = 10d6 damage.',
];
