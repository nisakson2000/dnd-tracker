/**
 * playerForgeDomainClericGuide.js
 * Player Mode: Forge Domain Cleric — the armored craftsman
 * Pure JS — no React dependencies.
 */

export const FORGE_CLERIC_BASICS = {
  class: 'Cleric (Forge Domain)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Tankiest Cleric. +1 items from L1. AC 22+ at L6. Fire immunity at L17.',
};

export const FORGE_FEATURES = [
  { feature: 'Blessing of the Forge', level: 1, effect: '+1 to one armor or weapon per long rest.', note: 'Free +1 item from L1. Give to yourself or allies.' },
  { feature: 'Artisan\'s Blessing', level: 2, effect: 'Channel Divinity: create metal item ≤100gp in 1 hour.', note: 'Keys, weapons, tools. Creative utility.' },
  { feature: 'Soul of the Forge', level: 6, effect: '+1 AC in heavy armor. Fire resistance.', note: 'Plate(18) + Shield(+2) + Blessing(+1) + Soul(+1) = AC 22.' },
  { feature: 'Divine Strike', level: 8, effect: '+1d8 fire on weapon hit (2d8 at L14).', note: 'Melee damage boost.' },
  { feature: 'Saint of Forge and Fire', level: 17, effect: 'Fire immunity. Resistance to nonmagical B/P/S.', note: 'Near-invulnerable tank.' },
];

export const FORGE_TACTICS = [
  { tactic: 'Spirit Guardians + AC 22', detail: 'Stand in melee. Enemies can\'t hit you, take 3d8/round.', rating: 'S' },
  { tactic: 'Blessing of the Forge party buff', detail: 'Give Fighter +1 weapon or Rogue +1 armor.', rating: 'A' },
  { tactic: 'Tank frontline', detail: 'Highest AC Cleric. Just stand there and be unkillable.', rating: 'S' },
];

export function forgeAC(hasBlessing = true, hasSoul = false, hasShieldOfFaith = false) {
  let ac = 20;
  if (hasBlessing) ac += 1;
  if (hasSoul) ac += 1;
  if (hasShieldOfFaith) ac += 2;
  return ac;
}
