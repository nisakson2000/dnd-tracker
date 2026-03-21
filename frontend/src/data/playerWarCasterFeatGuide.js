/**
 * playerWarCasterFeatGuide.js
 * Player Mode: War Caster feat — the gish essential
 * Pure JS — no React dependencies.
 */

export const WAR_CASTER_BASICS = {
  feat: 'War Caster',
  prereq: 'Can cast at least one spell',
  benefit1: 'Advantage on CON saves to maintain concentration.',
  benefit2: 'Somatic components with hands full (weapon + shield).',
  benefit3: 'Cast a spell as opportunity attack (1 action, targets only that creature).',
};

export const WAR_CASTER_OA_SPELLS = [
  { spell: 'Booming Blade', effect: 'OA + thunder damage + if they keep moving: extra thunder damage. They can\'t leave safely.', rating: 'S' },
  { spell: 'Hold Person', effect: 'Paralyze on OA. If they fail, paralyzed before they even get away.', rating: 'S' },
  { spell: 'Shocking Grasp', effect: 'No reaction for target. They can\'t take further reactions that turn.', rating: 'A' },
  { spell: 'Lightning Lure', effect: 'Pull them 10ft back toward you. Reverse their movement.', rating: 'A' },
];

export const WAR_CASTER_VS_RESILIENT = {
  warCasterBetter: 'Low levels (PB 2-3). Advantage on CON saves > small proficiency bonus. Plus OA spells + somatic components.',
  resilientBetter: 'High levels (PB 5-6). +5-6 to saves > advantage for high DCs. Plus +1 CON and +1 HP/level.',
  takeBoth: 'If you can afford 2 feats, take both. Advantage + proficiency = nearly impossible to fail DC 10.',
};

export const CLASS_PRIORITY = [
  { class: 'Paladin', priority: 'S', reason: 'Sword+shield+Bless concentration. Essential.' },
  { class: 'Cleric (melee)', priority: 'S', reason: 'Spirit Guardians concentration. Hands-full casting.' },
  { class: 'Eldritch Knight', priority: 'S', reason: 'Booming Blade OA. Shield+weapon casting.' },
  { class: 'Bladesinger', priority: 'A', reason: 'Stacks with Bladesong concentration bonus.' },
  { class: 'Pure ranged caster', priority: 'C', reason: 'OA rarely comes up. Take Resilient (CON) instead.' },
];

export function concentrationSaveChance(conMod, dc, hasAdvantage, profBonus = 0, hasProficiency = false) {
  const bonus = conMod + (hasProficiency ? profBonus : 0);
  let chance = Math.min(0.95, Math.max(0.05, (bonus + 20 - dc) / 20));
  if (hasAdvantage) chance = 1 - (1 - chance) * (1 - chance);
  return Math.round(chance * 1000) / 10;
}
