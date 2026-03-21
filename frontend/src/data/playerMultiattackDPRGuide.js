/**
 * playerMultiattackDPRGuide.js
 * Player Mode: DPR (damage per round) calculations and multi-attack optimization
 * Pure JS — no React dependencies.
 */

export const DPR_FORMULA = {
  basic: '(Hit chance × avg damage per hit) × number of attacks',
  hitChance: '(21 - (target AC - attack bonus)) / 20',
  example: 'AC 15, +7 to hit: (21-15+7)/20 = 13/20 = 65% hit chance',
  withAdvantage: '1 - (miss chance)² = 1 - (7/20)² = ~87.75% with advantage',
  note: 'DPR is the best way to compare damage builds objectively.',
};

export const ATTACK_SOURCES = [
  { source: 'Extra Attack (L5)', attacks: 2, note: 'All martial classes except Rogue.' },
  { source: 'Extra Attack (L11 Fighter)', attacks: 3, note: 'Fighter only.' },
  { source: 'Extra Attack (L20 Fighter)', attacks: 4, note: 'Fighter only.' },
  { source: 'Polearm Master BA', attacks: 1, note: 'd4+STR. Every turn.' },
  { source: 'TWF BA attack', attacks: 1, note: 'No mod to damage without feat.' },
  { source: 'Crossbow Expert BA', attacks: 1, note: 'Full mod. Hand crossbow.' },
  { source: 'Flurry of Blows (Monk)', attacks: 2, note: '1 Ki. BA 2 unarmed strikes.' },
  { source: 'Eldritch Blast (L5+)', attacks: 2, note: '2 beams. 3 at L11, 4 at L17.' },
  { source: 'Action Surge', attacks: 'Double', note: '1/SR. Full extra Action.' },
  { source: 'Haste', attacks: 1, note: 'Extra attack (one weapon attack only).' },
];

export const DPR_COMPARISONS = [
  { build: 'GWM Fighter L5', dpr: '~25.5', setup: '2 attacks × 2d6+15 × 40% hit', note: '-5/+10. Lower hit but huge damage.' },
  { build: 'SS CBE Fighter L5', dpr: '~27', setup: '3 attacks × 1d6+15 × 40%', note: 'Hand crossbow BA. 3 attacks at L5.' },
  { build: 'PAM Sentinel Fighter L5', dpr: '~22', setup: '2 attacks × 1d10+5 + 1 × 1d4+5', note: 'Lower DPR but lockdown value.' },
  { build: 'Rogue L5', dpr: '~15', setup: '1 attack × (1d8+4+3d6) × 65%', note: 'Lower DPR but no resource cost.' },
  { build: 'Warlock EB+AB L5', dpr: '~17', setup: '2 beams × (1d10+4) × 65%', note: 'Ranged. No resources. Consistent.' },
  { build: 'Paladin Smite L5', dpr: '~30 (nova)', setup: '2 attacks × (2d6+4+2d8) × 65%', note: 'Burns slots. Not sustainable.' },
  { build: 'Monk L5', dpr: '~22', setup: '3 attacks × (1d6+4) × 65%', note: 'With Flurry. Costs 1 Ki.' },
];

export const DPR_BOOSTERS = [
  { boost: 'Great Weapon Master / Sharpshooter', effect: '+10 damage, -5 hit.', note: 'Best with advantage to offset -5.' },
  { boost: 'Advantage', effect: '+3.5 avg to d20 roll.', note: 'Reckless, Faerie Fire, Pack Tactics.' },
  { boost: 'Hex / Hunter\'s Mark', effect: '+1d6 per hit.', note: 'Extra 3.5 per hit. Concentration.' },
  { boost: 'Fighting Style (Archery)', effect: '+2 to hit.', note: 'Best fighting style for DPR. +10% hit chance.' },
  { boost: 'Magic Weapon +X', effect: '+1/2/3 to hit and damage.', note: '+1 hit = 5% more hits.' },
  { boost: 'Haste', effect: '+1 attack + 2 AC + double speed.', note: 'Concentration. Risk: lose turn if broken.' },
];

export const DPR_TIPS = [
  'GWM/SS: best damage feat. Use with advantage to offset -5.',
  'More attacks = more DPR. CBE gives 3 attacks at L5.',
  'Archery fighting style: +2 hit = +10% more attacks land.',
  'Advantage ≈ +5 to hit. Faerie Fire, Reckless, Familiar Help.',
  'Rogue: lower DPR but no resource cost. Consistent all day.',
  'Paladin nova: highest single-round damage. Not sustainable.',
  'EB + Agonizing Blast: best sustained ranged DPR. No resources.',
  'Magic weapon +1: 5% more hits = noticeable DPR increase.',
  'Action Surge: doubles DPR for one round. Save for boss.',
  'Don\'t compare nova to sustained. Different roles.',
];
