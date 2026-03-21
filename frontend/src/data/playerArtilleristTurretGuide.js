/**
 * playerArtilleristTurretGuide.js
 * Player Mode: Artillerist Artificer — turret blaster builds
 * Pure JS — no React dependencies.
 */

export const ARTILLERIST_BASICS = {
  class: 'Artificer (Artillerist)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Magical turrets. Ranged blaster. Shield turret. Explosive capstone.',
  note: 'Best blaster Artificer. Eldritch Cannon is a bonus action pet. Arcane Firearm adds 1d8 to spells.',
};

export const CANNON_TYPES = [
  { type: 'Flamethrower', damage: '2d8 fire (3d8 at L9)', area: '15ft cone', save: 'DEX', note: 'AoE. Best vs clustered enemies.', rating: 'A' },
  { type: 'Force Ballista', damage: '2d8 force (3d8 at L9)', range: '120ft', note: 'Single target ranged. Force damage. Push 5ft.', rating: 'A' },
  { type: 'Protector', tempHP: '1d8+INT (2d8+INT at L9)', area: '10ft', note: 'Party temp HP every round. Best option most of the time.', rating: 'S' },
];

export const ARTILLERIST_FEATURES = [
  { feature: 'Eldritch Cannon', level: 3, effect: 'Create Tiny or Small cannon. Bonus action to fire. PB uses/LR.', note: 'Tiny = shoulder mount. Small = walks around independently.' },
  { feature: 'Arcane Firearm', level: 5, effect: '+1d8 to one Artificer spell damage roll.', note: 'Firebolt: 2d10+1d8. Consistent damage boost.' },
  { feature: 'Explosive Cannon', level: 9, effect: '+1d8 cannon damage. Can detonate: 3d8 force in 20ft.', note: 'Big damage boost to all cannon types.' },
  { feature: 'Fortified Position', level: 15, effect: '2 cannons at once. Allies near cannon get +2 AC (half cover).', note: 'Protector + Ballista simultaneously. +2 AC to party.' },
];

export const ARTILLERIST_TACTICS = [
  { tactic: 'Protector + Firebolt every turn', detail: 'BA: 1d8+INT temp HP to party. Action: Firebolt +1d8. Support + damage.', rating: 'S' },
  { tactic: 'Shoulder cannon', detail: 'Tiny cannon on your shoulder. Fire from wherever you stand.', rating: 'A' },
  { tactic: 'Detonate on clustered enemies', detail: 'Send cannon into enemy group → detonate → 3d8 force AoE.', rating: 'A' },
  { tactic: 'Dual cannons (L15)', detail: 'Protector + Force Ballista. Full support + offense simultaneously.', rating: 'S' },
];

export function protectorTHP(intMod, level) {
  const dice = level >= 9 ? 2 : 1;
  return dice * 4.5 + intMod;
}

export function arcaneFirearmBoost() {
  return 4.5; // 1d8 avg
}
