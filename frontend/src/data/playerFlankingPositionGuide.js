/**
 * playerFlankingPositionGuide.js
 * Player Mode: Flanking rules, alternatives, and tactical positioning
 * Pure JS — no React dependencies.
 */

export const FLANKING_RULES = {
  optional: 'Flanking is an OPTIONAL rule (DMG p.251). Ask your DM if it\'s used.',
  requirement: 'Two allies on opposite sides of an enemy.',
  benefit: 'Advantage on melee attack rolls against the flanked creature.',
  gridOnly: 'Works on grid maps. Requires opposite sides of the target.',
  note: 'Many DMs don\'t use flanking because advantage is too easy to get.',
};

export const FLANKING_POSITIONS = {
  square: 'Draw a line between centers of two allies. If it passes through opposite sides/corners of enemy, flanking.',
  hex: 'Must be on opposite sides of the hex the enemy occupies.',
  size: 'Large+ creatures: line must pass through opposite sides of their space.',
  note: 'You must be able to melee attack the creature. Not unconscious/incapacitated.',
};

export const FLANKING_ALTERNATIVES = [
  { variant: 'No Flanking', rule: 'Don\'t use flanking at all.', why: 'Advantage is too easy. Devalues class features and spells that grant advantage.' },
  { variant: '+2 Bonus Instead', rule: 'Flanking gives +2 to hit instead of advantage.', why: 'Still rewards positioning without overshadowing everything else.' },
  { variant: '+1 Bonus', rule: 'Flanking gives +1 to hit.', why: 'Minimal but meaningful. Doesn\'t step on other features.' },
  { variant: 'Cancel Disadvantage', rule: 'Flanking removes disadvantage instead of granting advantage.', why: 'Useful but not overpowered. Positional play still matters.' },
];

export const WHY_FLANKING_IS_CONTROVERSIAL = [
  'Pack Tactics (Kobolds, wolves): already grants advantage. Flanking stacks nothing.',
  'Reckless Attack (Barbarian): free advantage. Flanking makes this pointless.',
  'Faerie Fire, Guiding Bolt: spells that grant advantage become less valuable.',
  'True Strike cantrip: already bad. Flanking makes it completely useless.',
  'Prone enemies: advantage on melee already. Flanking adds nothing new.',
  'Samurai (Fighter): Fighting Spirit = advantage. Wasted if flanking is free.',
  'Combat becomes "get behind enemy" rather than interesting tactical choices.',
];

export const FLANKING_TACTICS = [
  { tactic: 'Pincer Movement', how: 'Two melee fighters approach from opposite sides.', note: 'Classic. Simple. Effective.' },
  { tactic: 'Anchor and Flank', how: 'Tank engages front. Rogue circles behind.', note: 'Rogue gets Sneak Attack (needs advantage or adjacent ally anyway).' },
  { tactic: 'Forced Flanking', how: 'Shove enemy between two allies.', note: 'Athletics check. Works with Shield Master feat.' },
  { tactic: 'Summon Flank', how: 'Summoned creature positions opposite you.', note: 'Spiritual Weapon doesn\'t count (no creature). Find Familiar can\'t attack.' },
  { tactic: 'Mount Flanking', how: 'Mounted combatant + ally on foot.', note: 'Mount counts as a separate creature for flanking.' },
];

export const FLANKING_TIPS = [
  'Ask your DM if flanking is used at Session 0.',
  'If flanking is used: always try to position for it.',
  'Rogue doesn\'t need flanking for Sneak Attack — adjacent ally works.',
  '+2 bonus variant is the most balanced alternative.',
  'Flanking doesn\'t work with ranged attacks. Melee only.',
  'You can\'t flank with an unconscious ally.',
  'Moving to flank may provoke AoO. Plan your route.',
  'Large creatures are harder to flank — need wider positioning.',
  'Spiritual Weapon is not a creature. Can\'t flank with it.',
  'If your DM uses flanking, Mobile feat becomes even better.',
];
