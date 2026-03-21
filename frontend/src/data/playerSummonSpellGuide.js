/**
 * playerSummonSpellGuide.js
 * Player Mode: Summon and conjuration spells — best options, management, tactics
 * Pure JS — no React dependencies.
 */

export const SUMMON_SPELL_RANKINGS = [
  {
    spell: 'Conjure Animals (L3)',
    class: 'Druid, Ranger',
    summons: '8 CR 1/4, 4 CR 1/2, 2 CR 1, or 1 CR 2',
    duration: '1 hour (concentration)',
    rating: 'S+',
    best: '8x wolves or 8x velociraptors. Pack Tactics + 8 attacks = absurd damage.',
    note: 'DM chooses the creatures RAW (controversial). Discuss at Session 0.',
  },
  {
    spell: 'Animate Objects (L5)',
    class: 'Wizard, Sorcerer, Bard, Artificer',
    summons: '10 Tiny objects (best). 25 HP, +8 to hit, 1d4+4 damage each.',
    duration: '1 minute (concentration)',
    rating: 'S+',
    best: '10 tiny objects = 10 attacks at +8. Average 10d4+40 = 65 DPR.',
    note: 'Best sustained DPR spell in the game. Throw coins at people.',
  },
  {
    spell: 'Summon Undead (L3, Tasha\'s)',
    class: 'Warlock, Wizard',
    summons: 'Skeletal, Ghostly, or Putrid spirit.',
    duration: '1 hour (concentration)',
    rating: 'A+',
    best: 'Ghostly: fly + frightening touch. Putrid: poison aura.',
    note: 'Tasha\'s summon spells: you choose the form. No DM choice controversy.',
  },
  {
    spell: 'Summon Fey (L3, Tasha\'s)',
    class: 'Druid, Ranger, Warlock, Wizard',
    summons: 'Fuming, Mirthful, or Tricksy spirit.',
    duration: '1 hour (concentration)',
    rating: 'A+',
    best: 'Tricksy: advantage on attacks. Fuming: bonus to hit.',
    note: 'Reliable summon. Scales with upcasting.',
  },
  {
    spell: 'Summon Shadowspawn (L3, Tasha\'s)',
    class: 'Warlock, Wizard',
    summons: 'Fury, Despair, or Fear shadow spirit.',
    duration: '1 hour (concentration)',
    rating: 'A',
    best: 'Despair: reduces enemy speed. Fear: frighten on hit.',
    note: 'Good control summon. Decent damage.',
  },
  {
    spell: 'Conjure Elemental (L5)',
    class: 'Druid, Wizard',
    summons: 'CR 5 elemental.',
    duration: '1 hour (concentration)',
    rating: 'B+',
    best: 'Fire/Air elemental. Good HP and damage.',
    note: 'WARNING: if concentration breaks, elemental goes hostile. Risky.',
  },
  {
    spell: 'Conjure Minor Elementals (L4)',
    class: 'Druid, Wizard',
    summons: '8 CR 1/4, 4 CR 1/2, 2 CR 1, or 1 CR 2 elementals.',
    duration: '1 hour (concentration)',
    rating: 'A',
    best: '8 magma mephits or 8 steam mephits. AoE on death.',
    note: 'DM chooses creatures RAW. Similar controversy to Conjure Animals.',
  },
  {
    spell: 'Summon Celestial (L5, Tasha\'s)',
    class: 'Cleric, Paladin',
    summons: 'Avenger or Defender celestial spirit.',
    duration: '1 hour (concentration)',
    rating: 'A+',
    best: 'Defender: temp HP aura. Avenger: radiant damage + fly.',
    note: 'Cleric/Paladin get a solid combat ally.',
  },
  {
    spell: 'Find Familiar (L1)',
    class: 'Wizard',
    summons: 'Tiny beast (owl, cat, etc.)',
    duration: 'Until dismissed or killed.',
    rating: 'S (utility)',
    best: 'Owl: flyby + Help action = advantage for ally every turn.',
    note: 'Not a combat summon. Scouting, Help action, touch spell delivery.',
  },
];

export const SUMMON_MANAGEMENT = {
  turnSpeed: 'Summons slow combat. Roll all attacks together. Know their stats.',
  avgDamage: 'Pre-calculate average damage. "8 wolves hit on 11+, 2d4+2 each."',
  positioning: 'Keep summons spread to avoid AoE wipes.',
  concentration: 'Protect your concentration. Summons disappear if it breaks.',
  tips: [
    'Pre-roll attacks: roll all 8 dice at once. Speed up turns.',
    'Use average damage for summons to speed combat.',
    'Group identical summons: "5 hit, 3 miss. 5 x 7 = 35 damage."',
    'Track summon HP on a notecard. Don\'t slow the game.',
  ],
};

export const SUMMON_TACTICS = [
  { tactic: 'Body Blocking', how: 'Surround squishy allies with summons. Enemies must go through them.', note: 'Summons as disposable shields. They take the hits.' },
  { tactic: 'Flanking Support', how: 'Position summon opposite an ally for flanking (if using flanking rules).', note: 'Free advantage on attacks for the party.' },
  { tactic: 'AoO Wall', how: 'Space summons 5ft apart in a line. Enemies provoke AoO passing through.', note: 'Each summon threatens AoO. Creates a wall of opportunity attacks.' },
  { tactic: 'Help Action Spam', how: 'Familiar uses Help action every turn. Grants advantage to one ally.', note: 'Owl flyby: Help, fly away. No AoO.' },
  { tactic: 'Grapple Lock', how: 'Multiple summons grapple one enemy. Athletics contests.', note: 'Wolves: Bite auto-knocks prone on hit. Then pack grapple.' },
];

export const SUMMON_TIPS = [
  'Animate Objects (10 tiny): best sustained DPR spell. 10d4+40 per round.',
  'Conjure Animals: 8 wolves = 8 attacks with advantage (Pack Tactics).',
  'Tasha\'s summon spells: YOU choose the form. No DM controversy.',
  'Protect concentration at all costs. Summons vanish if it breaks.',
  'Pre-roll attacks for summons. Don\'t slow down combat.',
  'Owl familiar: flyby Help action = free advantage every turn.',
  'Conjure Elemental: elemental goes hostile if concentration breaks. Risky.',
  'Summons block movement. Use them as walls and bodyguards.',
  'Track summon HP separately. Don\'t lose track in combat.',
  'Upcast Tasha\'s summons for higher CR and better stats.',
];
