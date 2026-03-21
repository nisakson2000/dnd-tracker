/**
 * playerCombatFormationsMasterGuide.js
 * Player Mode: Party positioning and combat formations
 * Pure JS — no React dependencies.
 */

export const FORMATIONS = [
  { name: 'Line', layout: 'Tank | Tank | Caster | Ranged', use: 'Corridors, dungeons', rating: 'A' },
  { name: 'Diamond', layout: 'Scout (front) | Tanks (sides) | Caster (center) | Healer (back)', use: 'Open terrain', rating: 'A+' },
  { name: 'Shield Wall', layout: 'All melee front, all ranged behind', use: 'Defending chokepoints', rating: 'S (defensive)' },
  { name: 'Split', layout: 'Two groups from different sides', use: 'Ambushes, flanking', rating: 'A (offensive)' },
];

export const MARCHING_ORDER = {
  dungeon: ['Scout (Rogue)', 'Tank (Fighter)', 'Caster', 'Healer', 'Rear guard'],
  wilderness: ['Scout (200ft ahead)', 'Main group (diamond)', 'Rear guard'],
  tip: 'Scout 30-60ft ahead in dungeons.',
};

export const POSITIONING_RULES = [
  { rule: 'Casters at 60ft+', note: 'Stay at max spell range.' },
  { rule: 'Tanks body-block', note: 'Force enemies through you.' },
  { rule: 'Don\'t cluster', note: 'One Fireball shouldn\'t hit everyone. 25ft+ apart.' },
  { rule: 'Use cover', note: 'Half cover = +2 AC. Three-quarters = +5 AC.' },
  { rule: 'Control chokepoints', note: 'Doorways funnel enemies to your tank.' },
];

export const ANTI_AOE_SPACING = {
  fireball: '20ft radius. Stay 25ft+ apart.',
  breathWeapon: 'Cone/line. Spread to sides.',
  tip: 'Against dragons: SPREAD OUT.',
};
