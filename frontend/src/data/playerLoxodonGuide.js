/**
 * playerLoxodonGuide.js
 * Player Mode: Loxodon race guide — the elephant people
 * Pure JS — no React dependencies.
 */

export const LOXODON_BASICS = {
  race: 'Loxodon',
  source: 'Guildmasters\' Guide to Ravnica',
  asi: '+2 CON, +1 WIS',
  speed: 30,
  size: 'Medium',
  languages: ['Common', 'Loxodon'],
  theme: 'Elephant humanoids. Patient, community-focused, incredibly resilient.',
};

export const LOXODON_TRAITS = [
  { trait: 'Natural Armor', effect: 'AC = 12 + CON mod (no armor required). Can use shield.', rating: 'A', note: 'At +3 CON: AC 15. With shield: AC 17. No armor needed. Great for Druids, Monks, casters.' },
  { trait: 'Trunk', effect: 'Prehensile trunk. Lift/hold items (5× STR lbs). Grapple, use items. NOT a third hand for weapons/shields/spellcasting.', rating: 'B', note: 'Open doors, hold torches, carry items while hands are full. Utility not combat.' },
  { trait: 'Keen Smell', effect: 'Advantage on Perception, Investigation, and Survival checks that rely on smell.', rating: 'B', note: 'Situational advantage. DM-dependent on how often smell matters.' },
  { trait: 'Loxodon Serenity', effect: 'Advantage on saves vs being charmed or frightened.', rating: 'A', note: 'Two very common conditions resisted. Solid defensive trait.' },
];

export const LOXODON_BUILDS = [
  { build: 'Moon Druid', why: '+2 CON +1 WIS. Natural Armor for caster form. Wild Shape replaces AC. Serenity helps concentration.', rating: 'S' },
  { build: 'Cleric (any)', why: '+1 WIS for casting. Natural Armor means no armor proficiency needed. CON for concentration.', rating: 'A' },
  { build: 'Monk', why: 'Natural Armor competes with Unarmored Defense. At low levels, Loxodon AC can be higher.', rating: 'B', note: 'Monk wants DEX+WIS. Loxodon gives CON+WIS. Conflict.' },
  { build: 'Barbarian', why: '+2 CON. Natural Armor vs Unarmored Defense: whichever is higher. Serenity helps vs fear.', rating: 'B' },
];

export function loxodonNaturalAC(conMod, hasShield = false) {
  return 12 + conMod + (hasShield ? 2 : 0);
}

export function trunkCarryWeight(strScore) {
  return strScore * 5; // 5× STR in pounds
}
