/**
 * playerBarbarianVsFighterGuide.js
 * Player Mode: Barbarian vs Fighter — melee martial comparison
 * Pure JS — no React dependencies.
 */

export const OVERVIEW = {
  barbarian: { strengths: 'Damage resistance (Rage), Reckless Attack advantage, d12 hit die, Danger Sense', weaknesses: 'No heavy armor, limited ranged, no magic, burns out without rests' },
  fighter: { strengths: 'Most ASIs/feats, Action Surge, heavy armor, versatile subclasses, consistent', weaknesses: 'No damage resistance, less burst than Rage, fewer HP per level' },
  verdict: 'Barbarian = tankier damage dealer. Fighter = more versatile and consistent. Both are excellent.',
};

export const DAMAGE_COMPARISON = [
  { level: 5, barbarian: 'Reckless + GWM: 2×(2d6+3+2+10) = 44 avg with advantage', fighter: 'GWM: 2×(2d6+5+10) = 44 avg without advantage', note: 'Similar DPR. Barbarian has advantage built in.' },
  { level: 5, barbarian: 'With PAM: 3 attacks, adv on all from Reckless', fighter: 'With Action Surge: 4 attacks in 1 round, then 2/round', note: 'Fighter has burst. Barbarian has sustained advantage.' },
  { level: 11, barbarian: '2 attacks + PAM BA. Rage +3 damage.', fighter: '3 attacks (Extra Attack 2) + PAM BA. 4 attacks total.', note: 'Fighter pulls ahead on attack count. L11 is Fighter\'s power spike.' },
  { level: 20, barbarian: '2 attacks + 4 Rage damage + Brutal Critical.', fighter: '4 attacks + Action Surge for 8 in a round.', note: 'Fighter wins sustained DPR. Barbarian has Primal Champion (+4 STR/CON).' },
];

export const SURVIVABILITY_COMPARISON = [
  { category: 'HP', barbarian: 'd12 HD + Rage damage resistance = effectively 2× HP pool', fighter: 'd10 HD. No built-in damage reduction.', winner: 'Barbarian (significantly)' },
  { category: 'AC', barbarian: 'No heavy armor. Unarmored: 10+DEX+CON = ~17. Medium armor: 17.', fighter: 'Plate + Shield = AC 20. Best base AC.', winner: 'Fighter' },
  { category: 'Saves', barbarian: 'Danger Sense (advantage on visible DEX saves). STR/CON proficiency.', fighter: 'Indomitable (reroll failed save). CON/STR proficiency.', winner: 'Tie' },
  { category: 'Effective HP at L10', barbarian: '~120 HP × 2 (Rage resistance) = 240 effective HP vs physical', fighter: '~84 HP, AC 20 = fewer hits taken', winner: 'Barbarian (vs physical)' },
];

export const VERSATILITY = {
  barbarian: 'Limited to melee. Can\'t cast spells while raging. Few skill options. Straightforward.',
  fighter: 'Ranged or melee. Eldritch Knight for magic. Battlemaster for tactics. Most ASIs = most feats. Very flexible.',
  verdict: 'Fighter wins versatility. Barbarian wins at one thing: being an unkillable melee combatant.',
};

export const SUBCLASS_HIGHLIGHTS = {
  barbarian: [
    { sub: 'Totem (Bear)', note: 'Resistance to ALL damage while raging. Best tank in the game.' },
    { sub: 'Zealot', note: 'Free resurrection. Extra radiant damage. Best DPR Barbarian.' },
    { sub: 'Ancestral Guardian', note: 'Force disadvantage on enemy attacks vs allies. Party protector.' },
  ],
  fighter: [
    { sub: 'Battlemaster', note: 'Maneuvers add control + damage. Most versatile martial subclass.' },
    { sub: 'Echo Knight', note: 'Echo for extra attacks, reach, flanking. Incredible action economy.' },
    { sub: 'Eldritch Knight', note: 'Shield + Absorb Elements + War Magic. Tankiest Fighter.' },
  ],
};

export function effectiveHP(hp, hasRageResistance, percentPhysicalDamage = 0.7) {
  if (!hasRageResistance) return hp;
  const physicalHP = hp / percentPhysicalDamage * 2 * percentPhysicalDamage; // physical damage halved
  const nonPhysicalHP = hp * (1 - percentPhysicalDamage);
  return Math.round(physicalHP + nonPhysicalHP);
}
