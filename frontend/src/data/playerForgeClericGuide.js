/**
 * playerForgeClericGuide.js
 * Player Mode: Forge Domain Cleric — the armored smith
 * Pure JS — no React dependencies.
 */

export const FORGE_BASICS = {
  class: 'Cleric (Forge Domain)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Divine smith. Highest AC Cleric. Create and enhance equipment.',
  note: 'Best tank Cleric. Can reach 21+ AC at level 1. Blessing of the Forge is incredibly strong early.',
};

export const FORGE_FEATURES = [
  { feature: 'Blessing of the Forge', level: 1, effect: 'Long rest: touch one nonmagical armor or weapon. It becomes +1 until your next long rest.', note: '+1 armor or weapon at level 1. For free. Every day. 21 AC at L1 (plate equivalent).' },
  { feature: 'Channel Divinity: Artisan\'s Blessing', level: 2, effect: '1 hour ritual: create one metal item worth ≤100gp. Consume metal equal to value.', note: 'Create ammunition, tools, keys, manacles, etc. Creative utility.' },
  { feature: 'Soul of the Forge', level: 6, effect: '+1 AC when wearing heavy armor. Resistance to fire damage.', note: '+1 AC (stacks with Blessing). Fire resistance. You\'re now at 22+ AC.' },
  { feature: 'Divine Strike', level: 8, effect: '+1d8 fire damage on weapon hit (2d8 at L14).', note: 'Fire damage on melee hits. Solid but not amazing.' },
  { feature: 'Saint of Forge and Fire', level: 17, effect: 'Immunity to fire damage. Resistance to nonmagical bludgeoning/piercing/slashing in heavy armor.', note: 'Fire immunity + physical resistance. Nearly unkillable.' },
];

export const FORGE_AC_PROGRESSION = [
  { level: 1, setup: 'Chain mail (16) + Shield (2) + Blessing (+1)', ac: 19, note: 'Starting AC. Already tanky.' },
  { level: 1, setup: 'Splint (17) + Shield (2) + Blessing (+1)', ac: 20, note: 'If you can afford splint.' },
  { level: 1, setup: 'Plate (18) + Shield (2) + Blessing (+1)', ac: 21, note: 'If party pools gold for plate.' },
  { level: 6, setup: 'Plate (18) + Shield (2) + Blessing (+1) + Soul of Forge (+1)', ac: 22, note: 'Soul of the Forge stacks. 22 AC with no magic items.' },
  { level: 6, setup: 'Above + Shield of Faith', ac: 24, note: '24 AC with concentration spell.' },
  { level: 10, setup: 'Above + actual magic items', ac: '25-27', note: '+1/+2 shield, Cloak/Ring of Protection. Unhittable.' },
];

export const FORGE_TACTICS = [
  { tactic: 'Wall of AC', detail: 'Stand in doorway/chokepoint. 22+ AC. Spirit Guardians around you. Enemies can\'t get past, take 3d8 per turn trying.', rating: 'S' },
  { tactic: 'Blessing flexibility', detail: 'Day 1: +1 armor for yourself. Next day: +1 weapon for the Fighter. Adapt to party needs.', rating: 'A' },
  { tactic: 'Fire tank', detail: 'L6: fire resistance. L17: fire immunity. Walk through lava. Tank red dragons.', rating: 'A' },
  { tactic: 'Artisan solutions', detail: 'Create: keys, caltrops, ball bearings, chains, grappling hooks, metal tools. 100gp limit covers most adventuring gear.', rating: 'B' },
];

export const FORGE_VS_LIFE = {
  forge: { pros: ['Highest AC in game', 'Fire resistance/immunity', '+1 equipment daily', 'Best tank'], cons: ['Less healing output', 'Fire Divine Strike (resisted)', 'Artisan\'s Blessing is niche'] },
  life: { pros: ['Best healing in game', 'Disciple of Life bonus healing', 'Preserve Life (Channel Divinity)', 'Goodberry exploit'], cons: ['Lower AC', 'No unique defensive features', 'Healing isn\'t always optimal strategy'] },
  verdict: 'Forge for tanking. Life for healing. Both excellent.',
};

export function forgeAC(armorBase, hasShield, blessingOnArmor, soulOfForge) {
  let ac = armorBase;
  if (hasShield) ac += 2;
  if (blessingOnArmor) ac += 1;
  if (soulOfForge) ac += 1;
  return ac;
}

export function artisansBlessingValue(metalGPConsumed) {
  return Math.min(100, metalGPConsumed); // Can create item worth up to 100gp
}
