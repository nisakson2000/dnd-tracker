/**
 * playerHumanVariantGuide.js
 * Player Mode: Variant Human and Custom Lineage optimization
 * Pure JS — no React dependencies.
 */

export const VARIANT_HUMAN = {
  source: 'PHB',
  asi: '+1 to two different ability scores (your choice).',
  feat: 'One feat at level 1.',
  skill: 'One extra skill proficiency.',
  languages: 'Common + one language.',
  note: 'The most popular race in D&D 5e. A level 1 feat is incredibly powerful.',
};

export const CUSTOM_LINEAGE = {
  source: 'Tasha\'s Cauldron of Everything',
  asi: '+2 to one ability score.',
  feat: 'One feat at level 1.',
  darkvisionOrSkill: '60ft darkvision OR one skill proficiency.',
  size: 'Small or Medium.',
  note: 'Like V. Human but +2 instead of +1/+1. Best for single-stat builds.',
};

export const BEST_LEVEL1_FEATS = [
  { feat: 'Polearm Master', build: 'STR Fighter/Paladin/Barbarian', impact: 'Bonus action 1d4 attack + OA when enemies enter reach. Defines your playstyle.', rating: 'S' },
  { feat: 'Great Weapon Master', build: 'STR Fighter/Barbarian', impact: '-5/+10 from level 1. Reckless Attack offsets the penalty. Massive damage.', rating: 'S' },
  { feat: 'Sharpshooter', build: 'DEX Fighter/Ranger', impact: '-5/+10 at range. Ignore cover. No disadvantage at long range. Defines ranged builds.', rating: 'S' },
  { feat: 'War Caster', build: 'Cleric/Paladin/Druid', impact: 'Advantage on concentration saves from level 1. Somatic with hands full. OA spells.', rating: 'S' },
  { feat: 'Sentinel', build: 'Any melee', impact: 'OA stops movement (speed = 0). Reaction attack when ally is attacked. Battlefield control.', rating: 'S' },
  { feat: 'Lucky', build: 'Any class', impact: '3 luck points/day. Reroll any d20. Universally powerful.', rating: 'S' },
  { feat: 'Crossbow Expert', build: 'DEX Fighter/Ranger', impact: 'Bonus action hand crossbow attack. No disadvantage at close range. +SS = deadly.', rating: 'A' },
  { feat: 'Fey Touched', build: 'CHA/INT/WIS casters', impact: '+1 to casting stat + Misty Step + 1st level spell. Best half-feat.', rating: 'A' },
  { feat: 'Resilient (CON)', build: 'Concentration casters', impact: '+1 CON + CON save proficiency. Critical for maintaining concentration.', rating: 'A' },
  { feat: 'Alert', build: 'Any', impact: '+5 initiative, can\'t be surprised. Going first = controlling the fight.', rating: 'A' },
];

export const VHUMAN_BUILDS = [
  { build: 'V. Human PAM Fighter', feat: 'Polearm Master', detail: '3 attacks at level 5 (2 Extra Attack + 1 PAM). Sentinel at L4 for lockdown.', rating: 'S' },
  { build: 'V. Human SS/CBE Ranger', feat: 'Crossbow Expert', detail: '3 attacks at level 5 (2 + BA). Sharpshooter at L4. -5/+10 × 3 = devastating.', rating: 'S' },
  { build: 'V. Human GWM Barbarian', feat: 'Great Weapon Master', detail: 'Reckless Attack offsets -5 penalty. +10 damage from level 1.', rating: 'S' },
  { build: 'V. Human War Caster Cleric', feat: 'War Caster', detail: 'Spirit Guardians with advantage on concentration saves from level 1.', rating: 'S' },
  { build: 'V. Human Lucky anything', feat: 'Lucky', detail: 'Universally powerful. Never fail a critical save or attack again.', rating: 'A' },
  { build: 'Custom Lineage +2 INT Wizard', feat: 'Alert or Fey Touched', detail: '18 INT at level 1 (point buy). +5 initiative or free Misty Step.', rating: 'S' },
];

export function vhumanStartingStats(pointBuy, asi1, asi2) {
  // Default point buy with +1/+1 from V. Human
  const stats = { ...pointBuy };
  stats[asi1] = (stats[asi1] || 10) + 1;
  stats[asi2] = (stats[asi2] || 10) + 1;
  return stats;
}

export function customLineageStartingStat(pointBuy, asi, amount) {
  const stats = { ...pointBuy };
  stats[asi] = (stats[asi] || 10) + (amount || 2);
  return stats;
}
