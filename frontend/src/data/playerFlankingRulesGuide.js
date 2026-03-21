/**
 * playerFlankingRulesGuide.js
 * Player Mode: Flanking — optional rule for advantage
 * Pure JS — no React dependencies.
 */

export const FLANKING_RULES = {
  type: 'OPTIONAL RULE (DMG p. 251). Not used by default.',
  rule: 'When two allies are on opposite sides of an enemy, both get advantage on melee attacks against it.',
  requirements: [
    'Both flankers must be within 5ft of the enemy.',
    'Both must be on opposite sides (draw a line through the center of the enemy).',
    'Both must be able to see the enemy.',
    'Only applies to melee attacks (not ranged or spell attacks).',
  ],
  note: 'Very common houserule. Some tables love it, others feel it makes advantage too easy to get.',
};

export const FLANKING_PROS = [
  'Rewards tactical positioning and teamwork.',
  'Gives melee characters a way to gain advantage without class features.',
  'Makes combat more dynamic (moving matters more).',
  'Easier for new players to understand "get behind the enemy".',
  'Helps melee compete with ranged characters who can attack from safety.',
];

export const FLANKING_CONS = [
  'Makes advantage too easy to get. Devalues features that grant advantage (Reckless Attack, Faerie Fire, etc.).',
  'Reduces value of Barbarian\'s Reckless Attack (why take a downside when flanking is free?).',
  'Rogues get Sneak Attack almost for free every round.',
  'Encourages "conga line" positioning where everyone clusters around enemies.',
  'Makes GWM/SS -5/+10 almost always optimal (advantage offsets the penalty).',
  'Can make combat too swingy (lots of advantage = lots of crits).',
];

export const FLANKING_CLASS_IMPACT = [
  { class: 'Rogue', impact: 'S+', note: 'Flanking = automatic Sneak Attack every round. Huge buff. Rogues benefit most.' },
  { class: 'Fighter (GWM)', impact: 'S', note: 'Advantage + GWM -5/+10 = always worth it. Damage skyrockets.' },
  { class: 'Barbarian', impact: 'Negative', note: 'Reckless Attack grants advantage already. Flanking makes Reckless redundant. Devalues class feature.' },
  { class: 'Paladin', impact: 'A', note: 'Advantage on smite attacks = more crits = more damage. Very good.' },
  { class: 'Monk', impact: 'A', note: 'Flanking + Stunning Strike attempts with advantage. More likely to land.' },
  { class: 'Ranger (melee)', impact: 'A', note: 'Advantage on Hunter\'s Mark attacks. Good sustained damage boost.' },
  { class: 'Caster', impact: 'C', note: 'Flanking is melee only. Casters rarely benefit directly.' },
];

export const FLANKING_ALTERNATIVES = [
  { rule: '+2 to hit (instead of advantage)', note: 'Some DMs give +2 instead of full advantage. Keeps flanking useful without making advantage trivial.' },
  { rule: 'Flanking only cancels cover', note: 'Flanking removes the target\'s cover bonus instead of granting advantage. Tactical but less impactful.' },
  { rule: 'No flanking', note: 'Many DMs don\'t use flanking at all. This is the RAW default. Advantage comes from class features and spells.' },
  { rule: 'Flanking + disadvantage on target', note: 'House rule: flanked creature has disadvantage on attacks against the flankers. Very powerful.' },
];

export const FLANKING_TIPS = [
  'If flanking is available: always try to flank. Free advantage is too good to pass up.',
  'Rogues: position to flank every round. Guaranteed Sneak Attack.',
  'Watch out for flanking against you. Enemies can flank your party too.',
  'Small hallways prevent flanking (can\'t get to opposite sides).',
  'Flying enemies can\'t be flanked easily (hard to get to opposite sides vertically).',
  'Ask your DM before the campaign if flanking is in play. Plan builds accordingly.',
];
