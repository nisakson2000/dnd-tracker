/**
 * playerMultiattackOptimizer.js
 * Player Mode: Multi-attack optimization and attack action planning
 * Pure JS — no React dependencies.
 */

export const ATTACKS_BY_LEVEL = {
  Fighter: [
    { level: 1, attacks: 1 },
    { level: 5, attacks: 2 },
    { level: 11, attacks: 3 },
    { level: 20, attacks: 4 },
  ],
  Barbarian: [
    { level: 1, attacks: 1 },
    { level: 5, attacks: 2 },
  ],
  Paladin: [
    { level: 1, attacks: 1 },
    { level: 5, attacks: 2 },
  ],
  Ranger: [
    { level: 1, attacks: 1 },
    { level: 5, attacks: 2 },
  ],
  Monk: [
    { level: 1, attacks: '1 + 1 bonus (Martial Arts)' },
    { level: 5, attacks: '2 + 1 bonus (Martial Arts) or 2 + 2 bonus (Flurry)' },
  ],
};

export const BONUS_ATTACKS = [
  { source: 'Two-Weapon Fighting', requirement: 'Light weapon in each hand', attack: '1 bonus action attack (no ability modifier to damage unless Fighting Style)', note: 'Uses bonus action.' },
  { source: 'Polearm Master', requirement: 'Glaive, halberd, quarterstaff, or spear', attack: '1 bonus action attack (1d4 bludgeoning)', note: 'Also grants OA when enemy enters reach.' },
  { source: 'Crossbow Expert', requirement: 'Hand crossbow', attack: '1 bonus action attack with hand crossbow', note: 'Ignores loading. No close-range disadvantage.' },
  { source: 'Martial Arts (Monk)', requirement: 'Unarmed or monk weapon attack', attack: '1 bonus action unarmed strike', note: 'Free with any Attack action.' },
  { source: 'Flurry of Blows (Monk)', requirement: '1 ki point', attack: '2 bonus action unarmed strikes', note: 'Costs 1 ki. Replaces Martial Arts bonus attack.' },
  { source: 'Haste', requirement: 'Haste spell active', attack: '1 extra Attack action (single attack only)', note: 'One weapon attack, not full Extra Attack.' },
  { source: 'Action Surge (Fighter)', requirement: 'Fighter level 2+', attack: 'Full extra action (includes Extra Attack)', note: '1/short rest. Double your attacks for one turn.' },
];

export const ATTACK_OPTIMIZATION = [
  'Great Weapon Master: -5/+10 is worth it when your attack bonus is +8 or higher vs AC 15 or lower.',
  'Sharpshooter: Same math as GWM. Use Archery Fighting Style (+2) to offset the -5.',
  'Advantage makes -5/+10 feats much more worthwhile (effectively +5 to hit).',
  'Elven Accuracy: with advantage, roll 3d20 — massively increases crit chance (14.3% vs 9.75%).',
  'Hexblade\'s Curse: expanded crit range (19-20) + proficiency to damage on every hit.',
  'Great Weapon Fighting style: reroll 1s and 2s on damage dice. Average +1.33 damage per d6.',
  'Dueling Fighting Style: +2 damage with one-handed weapons. Consistent and reliable.',
];

export function getTotalAttacks(className, level, hasTWF, hasPAM, hasHaste, hasActionSurge) {
  let base = 1;
  const classAttacks = ATTACKS_BY_LEVEL[className];
  if (classAttacks) {
    for (let i = classAttacks.length - 1; i >= 0; i--) {
      if (typeof classAttacks[i].attacks === 'number' && level >= classAttacks[i].level) {
        base = classAttacks[i].attacks;
        break;
      }
    }
  }

  let bonus = 0;
  if (hasTWF) bonus += 1;
  if (hasPAM) bonus += 1;

  let total = base + bonus;
  if (hasHaste) total += 1;
  if (hasActionSurge) total += base; // full extra action

  return { base, bonus, haste: hasHaste ? 1 : 0, surge: hasActionSurge ? base : 0, total };
}
