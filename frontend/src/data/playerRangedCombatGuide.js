/**
 * playerRangedCombatGuide.js
 * Player Mode: Ranged combat — weapons, feats, cover, and tactics
 * Pure JS — no React dependencies.
 */

export const RANGED_WEAPON_COMPARISON = [
  { weapon: 'Longbow', damage: '1d8', range: '150/600', properties: 'Ammunition, heavy, two-handed', rating: 'S', note: 'Best ranged weapon for DEX builds. 150ft normal range.' },
  { weapon: 'Hand Crossbow', damage: '1d6', range: '30/120', properties: 'Ammunition, light, loading', rating: 'S (with Crossbow Expert)', note: 'CBE ignores loading. Bonus action attack with hand crossbow.' },
  { weapon: 'Heavy Crossbow', damage: '1d10', range: '100/400', properties: 'Ammunition, heavy, loading, two-handed', rating: 'A (without Extra Attack)', note: 'Highest damage die. Loading limits to 1 attack without CBE.' },
  { weapon: 'Shortbow', damage: '1d6', range: '80/320', properties: 'Ammunition, two-handed', rating: 'B+', note: 'For Small races (no heavy penalty). Decent range.' },
  { weapon: 'Light Crossbow', damage: '1d8', range: '80/320', properties: 'Ammunition, loading, two-handed', rating: 'B', note: 'Same die as longbow but loading limits attacks.' },
  { weapon: 'Darts', damage: '1d4', range: '20/60', properties: 'Finesse, thrown, light', rating: 'C+', note: 'Finesse thrown. Monk can use with Martial Arts.' },
  { weapon: 'Javelin', damage: '1d6', range: '30/120', properties: 'Thrown', rating: 'B (STR build)', note: 'STR-based thrown. Good for Barbarians/Fighters who need ranged option.' },
];

export const RANGED_FEATS = [
  { feat: 'Sharpshooter', rating: 'S+', effects: ['-5 to hit, +10 damage', 'Ignore half and 3/4 cover', 'No disadvantage at long range'], note: 'Best ranged feat. +10 damage per hit is massive.' },
  { feat: 'Crossbow Expert', rating: 'S+', effects: ['Ignore loading property', 'No disadvantage on ranged in melee', 'Bonus action hand crossbow attack'], note: 'Hand crossbow + CBE = bonus action attack every turn.' },
  { feat: 'Elven Accuracy', rating: 'S (Elf/Half-Elf)', effects: ['Triple advantage on DEX attacks', '+1 DEX'], note: 'Roll 3d20 with advantage. 14.3% crit chance.' },
  { feat: 'Piercer', rating: 'A', effects: ['Reroll 1 piercing die per turn', '+1 crit die'], note: 'Half-feat. Good for bow users. Extra crit die.' },
  { feat: 'Fighting Initiate (Archery)', rating: 'A', effects: ['+2 to ranged attack rolls'], note: 'Archery fighting style. +2 to hit compensates Sharpshooter -5.' },
];

export const RANGED_RULES = {
  longRange: 'Attacking beyond normal range (up to max range): disadvantage.',
  adjacentEnemy: 'Ranged attack while hostile creature is within 5ft: disadvantage.',
  coverBypass: 'Sharpshooter: ignore half and 3/4 cover.',
  prone: 'Ranged attacks vs prone targets have disadvantage.',
  underwater: 'Ranged weapons have disadvantage underwater (most). Crossbow normal at short range.',
  note: 'Crossbow Expert removes disadvantage for adjacent enemies.',
};

export const RANGED_BUILDS = [
  { build: 'Hand Crossbow Fighter', feats: ['Crossbow Expert', 'Sharpshooter'], how: 'CBE bonus action attack + Sharpshooter +10. Action Surge for burst.', note: 'Best sustained ranged DPR. 4+ attacks at +10 each.' },
  { build: 'Longbow Samurai', feats: ['Sharpshooter', 'Elven Accuracy'], how: 'Fighting Spirit (advantage) + Elven Accuracy (3d20) + Sharpshooter.', note: 'Advantage 3 times per long rest. Each is devastating.' },
  { build: 'Ranger (Gloom Stalker)', feats: ['Sharpshooter'], how: 'Dread Ambusher extra attack + Sharpshooter. Invisible to darkvision.', note: 'Best round 1 ranged burst. +1 attack + 1d8.' },
  { build: 'Warlock (Eldritch Blast)', feats: ['None needed'], how: 'EB + Agonizing Blast. 4 beams at L17. 1d10+5 each.', note: 'Cantrip ranged damage. No resources spent.' },
];

export const RANGED_TIPS = [
  'Sharpshooter: +10 damage per hit. Take it ASAP for ranged builds.',
  'Crossbow Expert: bonus action hand crossbow attack. Extra DPR.',
  'Archery fighting style: +2 to hit. Compensates Sharpshooter -5.',
  'Long range = disadvantage. Stay within normal range.',
  'Adjacent enemy = disadvantage on ranged. CBE removes this.',
  'Prone targets: disadvantage on ranged. Use melee or force standing.',
  'Sharpshooter ignores cover. Huge advantage over enemies.',
  'Elven Accuracy + advantage: 14.3% crit. Triple roll.',
  'Javelin: STR-based ranged option for Barbarians.',
  'Hand crossbow + CBE + Sharpshooter = best ranged DPR build.',
];
