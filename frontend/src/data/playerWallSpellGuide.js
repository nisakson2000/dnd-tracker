/**
 * playerWallSpellGuide.js
 * Player Mode: Wall spells comparison, placement, and tactical usage
 * Pure JS — no React dependencies.
 */

export const WALL_SPELLS = [
  {
    spell: 'Wall of Fire',
    level: 4,
    class: 'Druid/Sorcerer/Wizard',
    shape: '60ft long, 20ft high, 1ft thick (or ring 20ft diameter)',
    damage: '5d8 fire when entering or starting turn within 10ft of one side.',
    duration: '1 minute (concentration)',
    rating: 'S',
    tactics: 'Split the battlefield. Enemies must cross = 5d8 fire. Push enemies through with forced movement for double damage.',
  },
  {
    spell: 'Wall of Force',
    level: 5,
    class: 'Wizard',
    shape: '10 panels (10x10ft each) or dome/sphere up to 10ft radius',
    damage: 'None. Indestructible barrier.',
    duration: '10 minutes (concentration)',
    rating: 'S',
    tactics: 'Split encounters. Trap the boss inside a dome with Sickening Radiance. Nothing passes through.',
  },
  {
    spell: 'Wall of Stone',
    level: 5,
    class: 'Druid/Sorcerer/Wizard',
    shape: '10 panels (10x10ft, 6 inches thick). Can be permanent if maintained.',
    damage: 'None. Physical barrier. Can be attacked (AC 15, HP 30/panel).',
    duration: '10 minutes (concentration), permanent if held full duration.',
    rating: 'A',
    tactics: 'Create permanent fortifications. Block corridors. Build bridges.',
  },
  {
    spell: 'Wall of Thorns',
    level: 6,
    class: 'Druid',
    shape: '60ft long, 10ft high, 5ft thick.',
    damage: '7d8 piercing on entry. Difficult terrain. DEX save for half.',
    duration: '10 minutes (concentration)',
    rating: 'A',
    tactics: 'Like Wall of Fire but thicker and blocks movement more. Higher damage at higher level.',
  },
  {
    spell: 'Wind Wall',
    level: 3,
    class: 'Druid/Ranger',
    shape: '50ft long, 15ft high, 1ft thick.',
    damage: '3d8 bludgeoning when created.',
    duration: '1 minute (concentration)',
    rating: 'B',
    tactics: 'Blocks all projectiles and gases. Archers can\'t shoot through it. Niche but powerful vs ranged.',
  },
  {
    spell: 'Wall of Ice',
    level: 6,
    class: 'Wizard',
    shape: '10 panels (10x10ft, 1ft thick). Or hemisphere/dome.',
    damage: '10d6 cold when created (DEX save). When panel destroyed: 10ft cold area.',
    duration: '10 minutes (concentration)',
    rating: 'A',
    tactics: 'Initial damage + physical barrier. Destroyed panels leave difficult terrain.',
  },
  {
    spell: 'Prismatic Wall',
    level: 9,
    class: 'Wizard',
    shape: '90ft long, 30ft high, or sphere 30ft radius.',
    damage: 'Seven layers, each different damage/effect. Must dispel in order.',
    duration: '10 minutes',
    rating: 'S',
    tactics: 'Ultimate wall spell. Nearly impossible to penetrate. Each layer is a save or devastating effect.',
  },
  {
    spell: 'Blade Barrier',
    level: 6,
    class: 'Cleric',
    shape: '100ft long, 20ft high, 5ft thick (or ring 60ft diameter).',
    damage: '6d10 slashing on entry/turn start.',
    duration: '10 minutes (concentration)',
    rating: 'A',
    tactics: 'Highest sustained wall damage. 6d10 per crossing. Great ring formation around allies.',
  },
];

export const WALL_TACTICS = [
  { tactic: 'Split the fight', detail: 'Wall off half the enemies. Fight 3 instead of 6. Clean up one side, then deal with the rest.', rating: 'S' },
  { tactic: 'Force movement through', detail: 'Push enemies through Wall of Fire/Thorns with Repelling Blast, Thorn Whip, Shove. Double the damage.', rating: 'S' },
  { tactic: 'Trap + wall combo', detail: 'Wall of Force dome + Sickening Radiance/Cloudkill inside. Enemies can\'t escape. Auto-death.', rating: 'S' },
  { tactic: 'Funnel enemies', detail: 'Place wall to create a narrow gap. Enemies must go through = chokepoint for AoE.', rating: 'A' },
  { tactic: 'Protect the back line', detail: 'Wall between melee enemies and your casters. They must go around.', rating: 'A' },
  { tactic: 'Block retreat', detail: 'Wall behind enemies so they can\'t flee. Finish them.', rating: 'B' },
];

export function wallDamagePerRound(spellName) {
  const damages = { 'Wall of Fire': 22.5, 'Wall of Thorns': 31.5, 'Blade Barrier': 33, 'Wall of Ice': 0 };
  return damages[spellName] || 0;
}
