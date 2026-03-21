/**
 * playerUnarmedCombat.js
 * Player Mode: Unarmed strikes, Tavern Brawler, Monk martial arts, and fist-fighting rules
 * Pure JS — no React dependencies.
 */

export const UNARMED_BASICS = {
  damage: '1 + STR modifier (bludgeoning). NOT a weapon attack for most purposes.',
  proficiency: 'You are proficient with unarmed strikes.',
  note: 'Without features, unarmed strikes deal 1+STR mod. A Barbarian with 20 STR deals 6 damage per punch.',
  notAWeapon: 'Unarmed strikes are NOT weapons. They don\'t work with Divine Smite, Sneak Attack, or weapon-specific features.',
  exception: 'Monks and specific features change unarmed strike rules significantly.',
};

export const UNARMED_ENHANCERS = [
  {
    source: 'Monk Martial Arts',
    damage: '1d4 → 1d6 → 1d8 → 1d10 (scales with level)',
    detail: 'Use DEX instead of STR. Bonus action unarmed strike. The core of Monk combat.',
    rating: 'S',
  },
  {
    source: 'Tavern Brawler feat',
    damage: '1d4 + STR',
    detail: 'Unarmed strikes deal 1d4. Proficient with improvised weapons. Bonus action grapple after hitting.',
    rating: 'B',
  },
  {
    source: 'Fighting Initiate: Unarmed Fighting',
    damage: '1d6 (or 1d8 if no weapon/shield in other hand)',
    detail: 'Fighting style. 1d6 or 1d8 unarmed strikes. Also deal 1d4 bludgeoning to grappled creatures at start of turn.',
    rating: 'A',
  },
  {
    source: 'Lizardfolk Bite',
    damage: '1d6 + STR',
    detail: 'Natural weapon (different from unarmed strike). STR-based. Can be used with Extra Attack.',
    rating: 'B',
  },
  {
    source: 'Dhampir Bite',
    damage: '1d4 + CON',
    detail: 'Constitution-based natural weapon. Heals you for damage dealt. Proficiency bonus times per long rest.',
    rating: 'B',
  },
  {
    source: 'Beast Barbarian (Claws)',
    damage: '1d6 + STR per claw',
    detail: 'When you attack with claws, make an additional claw attack as part of the same action. Extra attack!',
    rating: 'A',
  },
  {
    source: 'Astral Arms (Astral Self Monk)',
    damage: 'Martial arts die + WIS',
    detail: 'Astral arms use WIS for attacks and damage. 10ft reach. Force damage.',
    rating: 'A',
  },
];

export const GRAPPLE_AND_PUNCH = {
  description: 'Grapple a target, then beat them up. Classic wrestling move.',
  steps: [
    'Use your action to Attack. Replace one attack with a Grapple (Athletics vs Athletics/Acrobatics).',
    'On success, target is grappled (speed 0). You can still attack with remaining attacks.',
    'Next turn: attack with your free hand. You\'re holding them with one hand, punching with the other.',
    'Optional: Shove them prone (another attack replaced). Prone + Grappled = they can\'t stand up.',
  ],
  advantage: 'Prone creatures: advantage on melee attacks against them. They have disadvantage on attacks.',
  proneGrappled: 'Grappled + Prone: They can\'t stand up (standing costs movement, grappled = 0 speed). Advantage on all melee attacks.',
};

export const MONK_UNARMED = {
  martialArts: {
    1: '1d4', 5: '1d6', 11: '1d8', 17: '1d10',
  },
  bonus: 'After attacking with a monk weapon or unarmed strike, bonus action unarmed strike.',
  flurry: 'Spend 1 ki: TWO bonus action unarmed strikes instead of one.',
  stunningStrike: 'Spend 1 ki on hit: target makes CON save or is stunned until end of your next turn.',
  turnExample: 'Level 5 Monk: Attack (1d6+DEX) + Extra Attack (1d6+DEX) + Flurry (1d6+DEX + 1d6+DEX) = 4 attacks.',
};

export const UNARMED_BUILDS = [
  {
    build: 'Grappler Fighter',
    features: ['Unarmed Fighting Style', 'Tavern Brawler or Skill Expert (Athletics)', 'Extra Attack'],
    strategy: 'Grapple → Shove Prone → Punch. Advantage on all attacks against prone target.',
    rating: 'A',
  },
  {
    build: 'Punch Monk',
    features: ['Martial Arts', 'Flurry of Blows', 'Stunning Strike'],
    strategy: 'Four attacks per turn at level 5. Stunning Strike on key targets.',
    rating: 'S',
  },
  {
    build: 'Beast Barbarian',
    features: ['Claws (extra attack)', 'Rage (bonus damage)', 'Reckless Attack'],
    strategy: 'Claw attacks with Reckless Attack. Extra claw = 3 attacks at level 5 with Extra Attack.',
    rating: 'A',
  },
  {
    build: 'Unarmed Paladin',
    features: ['None stock — needs Tavern Brawler or Fighting Initiate'],
    strategy: 'RAW: Can\'t Smite on unarmed strikes. Needs DM approval.',
    rating: 'C (RAW)',
  },
];

export function unarmedDamage(strMod, hasFeature, featureSource) {
  const baseDamage = { none: 1, tavernBrawler: 2.5, unarmedFighting: 3.5, unarmedFightingNoWeapon: 4.5 };
  const avg = (baseDamage[featureSource] || 1) + strMod;
  return { average: avg, note: featureSource === 'none' ? 'Consider Tavern Brawler or Unarmed Fighting style' : '' };
}

export function monkDamage(level, dexMod) {
  const die = level >= 17 ? 10 : level >= 11 ? 8 : level >= 5 ? 6 : 4;
  const avgPerHit = (die / 2 + 0.5) + dexMod;
  const attacks = level >= 5 ? 4 : 3; // with Flurry
  return { perHit: avgPerHit, perRound: avgPerHit * attacks, attacks, martialArtsDie: `d${die}` };
}
