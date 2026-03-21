/**
 * playerGrappleShoveComboGuide.js
 * Player Mode: Grapple + shove combo — the ultimate martial control technique
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_RULES = {
  action: 'Uses one attack (part of Attack action). Not a full action at L5+.',
  check: 'Your Athletics vs target\'s Athletics OR Acrobatics (their choice).',
  effect: 'Grappled: speed becomes 0. You can move at half speed dragging them.',
  escape: 'Target uses action to escape: Athletics or Acrobatics vs your Athletics.',
  sizeLimit: 'Target can be at most one size larger than you.',
  note: 'Grapple replaces ONE attack. At L5+, you can grapple + attack in the same turn.',
};

export const SHOVE_RULES = {
  action: 'Uses one attack (part of Attack action).',
  check: 'Your Athletics vs target\'s Athletics OR Acrobatics.',
  effects: [
    'Shove Prone: target falls prone. Advantage on melee within 5ft, disadvantage on ranged.',
    'Shove Away: push target 5ft away from you.',
  ],
  sizeLimit: 'Target can be at most one size larger.',
};

export const GRAPPLE_SHOVE_COMBO = {
  sequence: [
    '1. Attack 1: Grapple (Athletics check). Target\'s speed becomes 0.',
    '2. Attack 2: Shove Prone (Athletics check). Target falls prone.',
    '3. Result: Target is grappled (can\'t move) AND prone (can\'t stand because speed is 0).',
    '4. All melee attacks against them have advantage. They attack with disadvantage.',
    '5. They must use their action to break the grapple first, THEN stand up.',
  ],
  note: 'This is the best martial control technique. Two Athletics checks = permanent advantage + disadvantage.',
  rating: 'S+',
};

export const GRAPPLE_BUILD = {
  stats: 'STR primary. CON secondary. Athletics expertise is critical.',
  keyFeatures: [
    { feature: 'Skill Expert (Athletics)', priority: 'S+', note: 'Expertise in Athletics = double PB. Core for grappling.' },
    { feature: 'Barbarian Rage', priority: 'S+', note: 'Advantage on STR checks while raging. Grapple/shove use STR checks.' },
    { feature: 'Rune Knight (Giant\'s Might)', priority: 'S', note: 'Become Large = grapple Huge creatures. Extra 1d6 damage.' },
    { feature: 'Enlarge/Reduce (ally casts)', priority: 'A+', note: 'Become Large = grapple Huge. Advantage on STR checks.' },
    { feature: 'Tavern Brawler feat', priority: 'A', note: 'Grapple as BA after hitting with unarmed/improvised weapon. +1 STR.' },
    { feature: 'Shield Master feat', priority: 'A+', note: 'BA shove with shield after Attack action. Free shove = free prone.' },
  ],
  bestClasses: [
    { class: 'Barbarian (any)', rating: 'S+', note: 'Rage = advantage on grapple. d12 HD = tanky. Reckless on attacks after grappling.' },
    { class: 'Rune Knight Fighter', rating: 'S+', note: 'Large size + extra damage. Best dedicated grappler.' },
    { class: 'Paladin', rating: 'A+', note: 'Grapple + smite on the prone, advantaged attacks. STR-based already.' },
    { class: 'Monk (with Athletics)', rating: 'A', note: 'Stunning Strike + grapple. Stunned = auto-fail Athletics to escape.' },
    { class: 'Bard (with Expertise)', rating: 'A', note: 'Expertise in Athletics + spellcasting. Jack of All Trades helps too.' },
  ],
};

export const GRAPPLE_TACTICS = [
  { tactic: 'Grapple + prone + allies attack', effect: 'Allies get advantage on all melee attacks. Target has disadvantage. Devastating with multiple martials.', rating: 'S+' },
  { tactic: 'Drag into hazards', effect: 'Grapple → move at half speed → drag into Spike Growth, Cloud of Daggers, fire, off cliff.', rating: 'S+' },
  { tactic: 'Grapple casters', effect: 'Grappled caster can\'t move. Prone = disadvantage on ranged spell attacks. Can\'t easily escape.', rating: 'S' },
  { tactic: 'Grapple + Shove off ledge', effect: 'Grapple (to prevent saving), then release grapple and shove off cliff. Falling damage.', rating: 'S' },
  { tactic: 'Drown enemies', effect: 'Grapple → drag into water → hold under. They start suffocating.', rating: 'A+ (situational)' },
  { tactic: 'Tavern Brawler: hit + grapple same turn', effect: 'Attack → hit → BA grapple → attack 2 shove prone. Full combo in one turn at L5.', rating: 'A+' },
  { tactic: 'Isolate targets', effect: 'Grapple and drag enemy away from allies. Separate and focus fire.', rating: 'A' },
];

export const GRAPPLE_COUNTERS = [
  'Misty Step/teleportation: escapes automatically (no Athletics check needed).',
  'Freedom of Movement: can\'t be grappled. Automatic escape.',
  'Size categories: Huge+ creatures can\'t be grappled by Medium grapplers.',
  'Legendary Resistance: some creatures auto-succeed grapple escapes (DM ruling).',
  'High Athletics/Acrobatics: some monsters have +10 or higher.',
  'Amorphous creatures: some can\'t be grappled (oozes, elementals).',
];
