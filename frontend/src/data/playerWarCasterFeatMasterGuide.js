/**
 * playerWarCasterFeatMasterGuide.js
 * Player Mode: War Caster feat — the caster's essential feat
 * Pure JS — no React dependencies.
 */

export const WAR_CASTER_BASICS = {
  feat: 'War Caster',
  source: "Player's Handbook",
  prerequisite: 'Ability to cast at least one spell',
  benefits: [
    'Advantage on CON saves to maintain concentration.',
    'Somatic components with hands full (weapon/shield).',
    'OA can be a spell (single target, 1 action) instead of weapon attack.',
  ],
  note: '#1 feat for concentration casters. Advantage on concentration saves is game-changing.',
};

export const WAR_CASTER_CONCENTRATION_MATH = {
  dc10WithCon3: { normal: '70%', advantage: '91%', improvement: '+21%' },
  dc15WithCon3: { normal: '45%', advantage: '70%', improvement: '+25%' },
  dc20WithCon3: { normal: '20%', advantage: '36%', improvement: '+16%' },
  note: 'At DC 10 (most common): 70% → 91%. Nearly guaranteed to hold concentration.',
};

export const WAR_CASTER_OA_SPELLS = [
  { spell: 'Booming Blade', reason: 'Hit + thunder damage if they continue moving. Perfect for OA.', rating: 'S' },
  { spell: 'Hold Person', reason: 'OA Hold Person = paralyzed. They stop moving.', rating: 'S' },
  { spell: 'Inflict Wounds', reason: '3d10 as OA. Massive single-target.', rating: 'A' },
  { spell: 'Eldritch Blast', reason: 'Multiple beams + push (Repelling Blast) as OA.', rating: 'A' },
];

export const WAR_CASTER_CLASS_VALUE = [
  { class: 'Cleric', rating: 'S', reason: 'Shield+weapon+SG concentration. Solves all three problems.' },
  { class: 'Paladin', rating: 'S', reason: 'Sword+shield+concentration spells.' },
  { class: 'Druid', rating: 'A', reason: 'Concentration on Conjure Animals, Call Lightning.' },
  { class: 'Wizard', rating: 'A', reason: 'Concentration protection. Less hand issues.' },
  { class: 'Sorcerer', rating: 'A', reason: 'Key concentration spells.' },
  { class: 'Warlock', rating: 'A', reason: 'Hex concentration. EB as OA.' },
];

export function concentrationSaveChance(conMod, dc, hasWarCaster, profBonus, hasResCon) {
  let bonus = conMod;
  if (hasResCon) bonus += profBonus;
  const needed = dc - bonus;
  const normal = Math.max(0.05, Math.min(0.95, (21 - needed) / 20));
  const advantage = 1 - Math.pow(1 - normal, 2);
  const chance = hasWarCaster ? advantage : normal;
  return { chance: `${Math.round(chance * 100)}%`, note: `DC ${dc}: ${Math.round(chance * 100)}%` };
}
