/**
 * playerOAMastery.js
 * Player Mode: Opportunity attack rules, when to take them, and how to avoid them
 * Pure JS — no React dependencies.
 */

export const OA_RULES = {
  trigger: 'A creature you can see leaves your reach using its movement.',
  cost: 'Uses your reaction. One reaction per round.',
  attack: 'One melee attack (not a full Attack action).',
  doesNotTrigger: ['Teleportation (Misty Step, etc.)', 'Forced movement (shove, push)', 'Disengage action', 'Flyby trait', 'Grapple drag'],
};

export const WHEN_TO_TAKE_OA = [
  { situation: 'Enemy low HP and fleeing', take: true, reason: 'Free kill chance.' },
  { situation: 'Enemy running to your caster', take: true, reason: 'Protect back line.' },
  { situation: 'You have Sentinel', take: true, reason: 'Speed → 0. Stops them.' },
  { situation: 'War Caster + Hold Person', take: true, reason: 'Paralyze on OA. Devastating.' },
  { situation: 'Need reaction for Shield', take: false, reason: '+5 AC usually worth more.' },
  { situation: 'Multiple enemies might trigger', take: false, reason: 'Wait for highest-value target.' },
];

export const SENTINEL_FEAT = {
  benefits: ['OA → speed 0', 'Disengage doesn\'t prevent your OA', 'Reaction attack when ally targeted within 5ft'],
  synergy: ['Polearm Master (enter 10ft reach)', 'Great Weapon Master', 'Paladin Smite on OA'],
  rating: 'S',
};

export const POLEARM_MASTER_OA = {
  trigger: 'Entering your 10ft reach provokes OA.',
  combo: 'PAM + Sentinel = enter 10ft, OA hits, speed 0. Never reach you.',
  weapons: ['Glaive', 'Halberd', 'Pike', 'Quarterstaff', 'Spear'],
  rating: 'S',
};

export const WAR_CASTER_OA_SPELLS = [
  { spell: 'Hold Person', reason: 'Paralyzed as they leave.' },
  { spell: 'Booming Blade', reason: 'Extra thunder if they keep moving.' },
  { spell: 'Inflict Wounds', reason: '3d10 necrotic as OA.' },
  { spell: 'Dissonant Whispers', reason: '3d6 + forced move (can trigger another OA).' },
];

export const AVOIDING_OAS = [
  { method: 'Disengage', cost: 'Action', note: 'Rogue: bonus action via Cunning Action.' },
  { method: 'Misty Step', cost: '2nd slot + BA', note: 'Teleport 30ft. Still have action.' },
  { method: 'Mobile feat', cost: 'Feat', note: 'No OA from creatures you attacked.' },
  { method: 'Flyby/Fancy Footwork', cost: 'Feature', note: 'Swashbuckler, Owl familiar.' },
];

export function oaDamage(weaponDie, mod, extra) {
  return weaponDie / 2 + 0.5 + mod + (extra || 0);
}

export function shouldUseReactionForOA(oaDmg, alternativeValue) {
  return oaDmg >= alternativeValue ? 'Take OA' : 'Save reaction';
}
