/**
 * playerWarforgedGuide.js
 * Player Mode: Warforged race optimization and unique mechanics
 * Pure JS — no React dependencies.
 */

export const WARFORGED_TRAITS = {
  source: 'Eberron: Rising from the Last War',
  asi: '+2 CON, +1 to one other ability',
  size: 'Medium',
  speed: '30ft',
  integratedProtection: '+1 AC (stacks with armor). You don armor by incorporating it into your body (1 hour).',
  constructedResilience: 'Advantage on saves vs poison. Resistance to poison damage. Immune to disease. Don\'t need to eat, drink, or breathe.',
  sentinelRest: 'Don\'t need to sleep. 6 hours of inactivity (still conscious) = long rest.',
  specializedDesign: 'One tool proficiency and one language.',
};

export const WARFORGED_OPTIMIZATION = [
  { build: 'Warforged Armorer Artificer', benefit: '+1 AC racial + Arcane Armor + Shield + Enhanced Defense infusion = 23+ AC at level 3.', rating: 'S' },
  { build: 'Warforged Fighter (any)', benefit: '+1 AC + heavy armor + shield + Defense style = 22 AC at level 1. Stacks with Shield spell if EK.', rating: 'S' },
  { build: 'Warforged Barbarian', benefit: 'Unarmored Defense + CON bonus + +1 AC. Rage + poison resistance is redundant (already have it) but more HP.', rating: 'A' },
  { build: 'Warforged Monk', benefit: 'Unarmored Defense + +1 AC. Don\'t need to eat/drink/breathe. CON bonus helps Ki DC.', rating: 'A' },
  { build: 'Warforged Cleric', benefit: 'Heavy armor + shield + +1 AC + CON for concentration. Incredibly durable.', rating: 'A' },
];

export const WARFORGED_RP = {
  uniqueTraits: [
    'Were you built for war? Peacetime? Labor?',
    'Do you have emotions or simulate them?',
    'How do you view your creators? Gratitude? Resentment?',
    'You don\'t sleep — what do you do during long rests?',
    'Your body IS your armor. What does it look like?',
  ],
  eberronLore: 'Created by House Cannith for the Last War. Treaty of Thronehold granted them personhood.',
  mechanicalPerks: [
    'Can\'t be affected by Catnap (don\'t sleep).',
    'Dream spell doesn\'t work on you (no sleep).',
    'Immune to Sleep spell (no sleeping state).',
    'Can keep watch all night during long rests.',
    'Underwater combat — no breathing needed.',
  ],
};

export function warforgedAC(armorAC, shieldBonus, fightingStyleDefense) {
  return armorAC + 1 + (shieldBonus || 0) + (fightingStyleDefense ? 1 : 0);
}
