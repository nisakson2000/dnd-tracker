/**
 * playerGrapplingBuildGuide.js
 * Player Mode: Grappling — the most underrated martial tactic
 * Pure JS — no React dependencies.
 */

export const GRAPPLING_RULES = {
  action: 'Special attack (replaces one Attack action attack)',
  check: 'Your Athletics vs target\'s Athletics or Acrobatics (their choice)',
  sizeLimit: 'Target can be at most one size larger than you',
  effect: 'Grappled condition: speed becomes 0.',
  escape: 'Target uses action: Athletics or Acrobatics vs your Athletics',
};

export const GRAPPLE_SHOVE_COMBO = {
  step1: 'Attack 1: Grapple → target speed = 0.',
  step2: 'Attack 2: Shove Prone → target is prone.',
  result: 'Grappled + prone. Speed 0 = can\'t stand. All melee attacks have advantage. Their attacks have disadvantage.',
  rating: 'S',
  note: 'Requires Extra Attack (2 attacks minimum).',
};

export const GRAPPLER_BUILD = {
  stats: 'STR primary, CON secondary. Expertise in Athletics is mandatory.',
  bestRaces: [
    { race: 'Custom Lineage/V. Human', why: 'Skill Expert at L1 for Athletics Expertise.', rating: 'S' },
    { race: 'Loxodon', why: 'Trunk = free grapple while hands full. CON-based AC.', rating: 'A+' },
    { race: 'Bugbear', why: '10ft reach grapple.', rating: 'A' },
  ],
  keyFeats: [
    { feat: 'Skill Expert', effect: 'Athletics Expertise + STR half-feat.', rating: 'S' },
    { feat: 'Tavern Brawler', effect: 'BA grapple after unarmed strike.', rating: 'A+' },
    { feat: 'Sentinel', effect: 'OA stops movement. Zone control pairs.', rating: 'A' },
  ],
};

export const GRAPPLING_CLASSES = [
  { class: 'Barbarian', rating: 'S', note: 'Advantage on Athletics (Rage). High STR. Tanky. Best grappler base.' },
  { class: 'Fighter (Rune Knight)', rating: 'S', note: 'Giant\'s Might: become Large (grapple Huge). Best grappler subclass.' },
  { class: 'Paladin', rating: 'A', note: 'Extra Attack + high STR + Smite while grappling.' },
  { class: 'Artificer (Armorer)', rating: 'A', note: 'Thunder Gauntlets lock target to you.' },
];

export const GRAPPLING_TACTICS = [
  { tactic: 'Drag into hazards', detail: 'Grapple → drag through Spike Growth, Spirit Guardians, Wall of Fire.', rating: 'S' },
  { tactic: 'Deny caster escape', detail: 'Grapple caster. Speed 0 = can\'t run. Burns their action to escape.', rating: 'S' },
  { tactic: 'Isolate targets', detail: 'Drag one enemy away from allies. Party focuses them.', rating: 'A+' },
  { tactic: 'Grapple + fly + drop', detail: 'Flight + grapple → fly up → release → falling damage.', rating: 'A+' },
  { tactic: 'Hold for allies', detail: 'Grapple + shove prone = advantage for ALL melee allies.', rating: 'S' },
];

export const ANTI_GRAPPLE = [
  'Misty Step: teleport out without a check.',
  'Freedom of Movement: immune to grappled condition.',
  'Enlarge: bigger Athletics score + may exceed size limit.',
  'Acrobatics expertise: contest with DEX instead of STR.',
  'Thunder Step: teleport + damage the grappler.',
];
