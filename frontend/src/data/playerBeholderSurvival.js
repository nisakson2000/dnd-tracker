/**
 * playerBeholderSurvival.js
 * Player Mode: Surviving Beholder encounters — eye ray tactics and counters
 * Pure JS — no React dependencies.
 */

export const BEHOLDER_STATS = {
  cr: 13,
  ac: 18,
  hp: 180,
  speed: '0ft (fly 20ft, hover)',
  antimagicCone: 'Central eye projects 150ft cone of Antimagic Field. Suppresses ALL magic in area.',
  eyeRays: '3 random eye rays per turn (10 rays available). Legendary actions: 1 eye ray.',
  flyingOnly: 'Beholders float. No walking speed. Can hover.',
};

export const EYE_RAYS = [
  { ray: 'Charm Ray', save: 'WIS DC 16', effect: 'Charmed for 1 hour. Regards Beholder as trusted ally.', danger: 'High — turns party member against you.' },
  { ray: 'Paralyzing Ray', save: 'CON DC 16', effect: 'Paralyzed for 1 minute. Repeat save each turn.', danger: 'Critical — auto-crit melee, can\'t act.' },
  { ray: 'Fear Ray', save: 'WIS DC 16', effect: 'Frightened for 1 minute. Must Dash away.', danger: 'High — loses your turn running.' },
  { ray: 'Slowing Ray', save: 'DEX DC 16', effect: 'Speed halved, -2 AC, no reactions, 1 attack/turn for 1 minute.', danger: 'Medium — reduces effectiveness.' },
  { ray: 'Enervation Ray', save: 'CON DC 16', effect: '8d8 necrotic (36 avg). Half on save.', danger: 'High — massive damage.' },
  { ray: 'Telekinetic Ray', save: 'STR DC 16', effect: 'Move target 30ft in any direction. 300 lbs or less object.', danger: 'Medium — repositioning, possible fall damage.' },
  { ray: 'Sleep Ray', save: 'WIS DC 16', effect: 'Asleep for 1 minute. Unconscious.', danger: 'High — unconscious = helpless.' },
  { ray: 'Petrification Ray', save: 'DEX DC 16', effect: 'Fail: restrained. Fail again next turn: petrified.', danger: 'Critical — permanent removal if not cured.' },
  { ray: 'Disintegration Ray', save: 'DEX DC 16', effect: '10d8 force (45 avg). If reduced to 0 HP: disintegrated.', danger: 'Critical — kills AND destroys body. No Revivify.' },
  { ray: 'Death Ray', save: 'DEX DC 16', effect: '10d10 necrotic (55 avg). Half on save.', danger: 'Critical — highest damage ray.' },
];

export const BEHOLDER_TACTICS = {
  theirStrategy: [
    'Antimagic Cone facing casters. Shut down all their spells/magic items.',
    'Eye rays on martials (who can\'t be antimagicked).',
    'Hover 20ft up. Melee can\'t reach without flight.',
    'Use lair actions: slippery ground, grasping appendages, eye ray from wall.',
    'Focus Disintegration/Death Ray on highest threat.',
  ],
  yourCounter: [
    'SPLIT THE PARTY. Beholder aims Antimagic one direction. Caster on opposite side can cast.',
    'Ranged martial (archer/crossbow) is MVP. Not affected by Antimagic, can hit flying target.',
    'Fly spell before the fight. Beholder only hovers 20ft. Get above it.',
    'Spread out to limit eye ray efficiency (3 random targets per turn).',
    'High save characters tank the rays. Paladin aura helps everyone.',
  ],
};

export const ANTI_BEHOLDER = [
  { counter: 'Ranged martials', detail: 'Fighters/Rangers with bows. Unaffected by Antimagic. Can always attack.', priority: 'Critical' },
  { counter: 'Party split positioning', detail: 'Casters and martials on OPPOSITE sides. Antimagic can only face one direction.', priority: 'Critical' },
  { counter: 'Paladin Aura', detail: '+CHA to all saves within 10ft. DC 16 saves become much easier.', priority: 'High' },
  { counter: 'Counterspell alternatives', detail: 'Eye rays are NOT spells. Can\'t be Counterspelled. Must save or dodge.', priority: 'Know this' },
  { counter: 'Silvery Barbs', detail: 'Force reroll on Beholder\'s eye ray when an ally fails. If outside Antimagic cone.', priority: 'High' },
  { counter: 'Flight', detail: 'Fly spell, Winged Boots, racial flight. Reach the hovering Beholder in melee.', priority: 'High' },
];

export function eyeRayDamage(rayType) {
  const damage = { Enervation: 36, Disintegration: 45, Death: 55 };
  return damage[rayType] || 0;
}

export function saveChanceVsBeholder(saveMod, paladinAura) {
  const dc = 16;
  const total = saveMod + (paladinAura || 0);
  return Math.min(95, Math.max(5, (21 - (dc - total)) * 5));
}
