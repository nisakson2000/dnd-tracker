/**
 * playerDragonbornGuide.js
 * Player Mode: Dragonborn race variants and optimization
 * Pure JS — no React dependencies.
 */

export const DRAGONBORN_BASE = {
  source: 'PHB + Fizban\'s Treasury of Dragons',
  asi: '+2 STR, +1 CHA (PHB) — Fizban\'s variants have flexible ASIs.',
  size: 'Medium',
  speed: '30ft',
  breathWeapon: 'Action: 15ft cone or 30ft line (depends on ancestry). 2d6 damage, scaling at 6/11/16.',
  damageResistance: 'Resistance to your breath weapon\'s damage type.',
  note: 'PHB Dragonborn is underpowered. Fizban\'s variants are MUCH stronger.',
};

export const DRACONIC_ANCESTRIES = [
  { color: 'Black', type: 'Acid', shape: '5×30 ft line', save: 'DEX' },
  { color: 'Blue', type: 'Lightning', shape: '5×30 ft line', save: 'DEX' },
  { color: 'Brass', type: 'Fire', shape: '5×30 ft line', save: 'DEX' },
  { color: 'Bronze', type: 'Lightning', shape: '5×30 ft line', save: 'DEX' },
  { color: 'Copper', type: 'Acid', shape: '5×30 ft line', save: 'DEX' },
  { color: 'Gold', type: 'Fire', shape: '15 ft cone', save: 'DEX' },
  { color: 'Green', type: 'Poison', shape: '15 ft cone', save: 'CON' },
  { color: 'Red', type: 'Fire', shape: '15 ft cone', save: 'DEX' },
  { color: 'Silver', type: 'Cold', shape: '15 ft cone', save: 'CON' },
  { color: 'White', type: 'Cold', shape: '15 ft cone', save: 'DEX' },
];

export const FIZBANS_VARIANTS = {
  chromatic: {
    breathWeapon: 'Bonus action (not action). 15ft cone or 30ft line. PB uses per long rest.',
    level5: 'Chromatic Warding: immunity to your damage type for 1 minute. Once per long rest.',
    note: 'Bonus action breath + damage immunity. Massive upgrade over PHB.',
    rating: 'A',
  },
  metallic: {
    breathWeapon: 'Same as Chromatic (bonus action, PB uses).',
    level5: 'Second breath option: 15ft cone. Push 20ft (STR save) OR incapacitate until start of next turn (CON save).',
    note: 'Utility breath weapon. Incapacitate is incredibly powerful.',
    rating: 'S',
  },
  gem: {
    breathWeapon: 'Same as Chromatic. Damage types: force, psychic, radiant, necrotic, thunder.',
    level5: 'Limited flight: fly speed = walking speed for PB rounds. Once per long rest.',
    note: 'Flight + rare damage types (force, psychic). No one resists force.',
    rating: 'A',
  },
};

export const DRAGONBORN_BUILDS = [
  { build: 'Metallic Dragonborn Paladin', detail: 'STR + CHA. Incapacitate breath + Smite on incapacitated target (advantage). Thematic.', rating: 'S' },
  { build: 'Gem Dragonborn Sorcerer', detail: 'CHA caster with flight. Force/psychic breath. Draconic Bloodline synergy.', rating: 'A' },
  { build: 'Chromatic Dragonborn Fighter', detail: 'Bonus action breath + Action Surge attacks. Fire immunity for 1 minute.', rating: 'A' },
  { build: 'Metallic Dragonborn Barbarian', detail: 'STR synergy. Bonus action breath while Raging (no spell, just racial).', rating: 'A' },
];

export function breathWeaponDamage(level) {
  if (level >= 16) return { dice: '5d10', avg: 27.5 }; // Fizban's uses d10
  if (level >= 11) return { dice: '4d10', avg: 22 };
  if (level >= 6) return { dice: '3d10', avg: 16.5 };
  return { dice: '2d10', avg: 11 };
}

export function breathWeaponUses(profBonus) {
  return profBonus; // Fizban's: PB uses per long rest
}
