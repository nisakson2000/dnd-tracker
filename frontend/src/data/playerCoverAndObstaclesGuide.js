/**
 * playerCoverAndObstaclesGuide.js
 * Player Mode: Cover rules — half, three-quarters, total — and how to use them
 * Pure JS — no React dependencies.
 */

export const COVER_TYPES = [
  {
    type: 'Half Cover',
    bonus: '+2 AC and DEX saves',
    examples: ['Low wall', 'Furniture', 'Ally standing in front of you', 'Narrow tree trunk'],
    note: 'Obstacle blocks at least half your body. Most common cover.',
  },
  {
    type: 'Three-Quarters Cover',
    bonus: '+5 AC and DEX saves',
    examples: ['Arrow slit', 'Thick tree trunk', 'Portcullis', 'Overturned table (from behind)'],
    note: 'Obstacle blocks about three-quarters of your body.',
  },
  {
    type: 'Total Cover',
    bonus: 'Can\'t be directly targeted by attacks or spells',
    examples: ['Behind a wall', 'Around a corner', 'Behind a pillar (completely)'],
    note: 'Completely concealed. Spells need a clear path to target.',
  },
];

export const COVER_RULES = {
  determination: 'Draw a line from attacker to target. If it passes through an obstacle, cover applies.',
  spells: 'Spell attacks follow the same rules. Some spells ignore cover (Sacred Flame).',
  aoe: 'Cover applies to saving throws from AoE if the cover is between you and the AoE origin.',
  allies: 'RAW: allies provide half cover. Variant rule: allies don\'t provide cover.',
  note: 'DMs often rule cover loosely. Clarify at Session 0.',
};

export const EXPLOIT_COVER = [
  { tactic: 'Duck Behind Cover', how: 'End your turn behind total cover. Enemies can\'t target you.', note: 'Pop out, attack, move back behind wall. Repeat.' },
  { tactic: 'Arrow Slit Offense', how: 'Shoot through arrow slits. You have 3/4 cover, enemies don\'t.', note: 'Effective AC boost of +5 while attacking normally.' },
  { tactic: 'Prone Behind Cover', how: 'Drop prone behind half cover. Ranged attacks at disadvantage + cover bonus.', note: 'Near-immune to ranged attacks. Stand up to attack, drop again.' },
  { tactic: 'Shield Spell + Cover', how: '+5 (3/4 cover) + 5 (Shield) = +10 AC.', note: 'Incredibly hard to hit. Stacks fully.' },
  { tactic: 'Sharpshooter Ignores Cover', how: 'Sharpshooter feat: ignore half and 3/4 cover.', note: 'Your arrows bypass cover. Enemies\' don\'t.' },
  { tactic: 'Spell Sniper', how: 'Ignore half and 3/4 cover for spell attacks.', note: 'Like Sharpshooter for spell attack rolls.' },
];

export const NEGATE_ENEMY_COVER = [
  { method: 'Sharpshooter feat', effect: 'Ignore half and 3/4 cover.', note: 'Best solution. Permanent.' },
  { method: 'Spell Sniper feat', effect: 'Ignore half and 3/4 cover for spell attacks.', note: 'Caster version of Sharpshooter.' },
  { method: 'Sacred Flame', effect: 'Ignores cover for the saving throw.', note: 'Target gains no benefit from cover.' },
  { method: 'Move to a clear angle', effect: 'Reposition so no obstacle is in the way.', note: 'Sometimes moving 10ft removes cover entirely.' },
  { method: 'AoE spells', effect: 'Place AoE origin behind enemy cover.', note: 'Fireball behind the wall. Cover doesn\'t help.' },
  { method: 'Destroy the cover', effect: 'Break the obstacle. Objects have HP.', note: 'Wooden table: ~15 HP. Fireball it.' },
];

export const COVER_TIPS = [
  'Half cover (+2 AC/DEX): low walls, allies, furniture. Very common.',
  'Three-quarters cover (+5 AC/DEX): arrow slits, thick trees. Strong.',
  'Total cover: can\'t be targeted at all. End turns behind walls.',
  'Cover stacks with Shield spell. +5 cover + +5 Shield = +10 AC.',
  'Sharpshooter: ignores cover bonuses. Huge for archers.',
  'Sacred Flame ignores cover. Best anti-cover cantrip.',
  'Prone + cover = very hard to hit at range.',
  'Allies provide half cover RAW. Ask your DM about this.',
  'AoE spells bypass cover if placed correctly.',
  'Use cover every turn. Free AC is free AC.',
];
