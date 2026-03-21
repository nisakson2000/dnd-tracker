/**
 * playerASIPriority.js
 * Player Mode: Ability Score Improvement vs Feat decision guide
 * Pure JS — no React dependencies.
 */

export const ASI_BASICS = {
  levels: 'Fighters: 4, 6, 8, 12, 14, 16, 19. Rogues: 4, 8, 10, 12, 16, 19. Everyone else: 4, 8, 12, 16, 19.',
  choice: '+2 to one ability score OR +1 to two ability scores OR 1 feat.',
  maxScore: '20 (without magic). Can\'t exceed 20 with ASI.',
  note: 'Maxing your primary ability score is ALMOST ALWAYS the right first choice.',
};

export const ASI_VS_FEAT = {
  asiFirst: [
    'Your primary stat is below 18.',
    'You need to hit more often or have a higher save DC.',
    'You\'re a caster with an odd primary stat (going from 17 → 18 = +1 to DC, +1 to hit).',
    'Simple math: +1 to your primary stat = +5% to hit + +1 damage per hit.',
  ],
  featFirst: [
    'Your primary stat is already 20.',
    'The feat is build-defining (GWM, SS, PAM, Sentinel, War Caster).',
    'The feat gives +1 to your primary stat AND a strong ability (Fey Touched, Telekinetic, Crusher).',
    'You\'re a Variant Human or Custom Lineage with an extra feat at level 1.',
  ],
};

export const HALF_FEATS = {
  note: '+1 to an ability score + another benefit. Best way to round out odd scores.',
  feats: [
    { feat: 'Fey Touched', asi: '+1 CHA/INT/WIS', benefit: 'Misty Step + 1st level Divination/Enchantment spell. Free casts 1/day.', rating: 'S' },
    { feat: 'Shadow Touched', asi: '+1 CHA/INT/WIS', benefit: 'Invisibility + 1st level Illusion/Necromancy spell. Free casts 1/day.', rating: 'A' },
    { feat: 'Telekinetic', asi: '+1 CHA/INT/WIS', benefit: 'Mage Hand (invisible, 60ft) + bonus action shove 5ft (no save). Spike Growth combo.', rating: 'A' },
    { feat: 'Resilient (CON)', asi: '+1 CON', benefit: 'CON save proficiency. Massive for concentration casters.', rating: 'S (casters)' },
    { feat: 'Skill Expert', asi: '+1 any', benefit: '1 skill proficiency + expertise in 1 skill. Best for specific check builds.', rating: 'A' },
    { feat: 'Crusher', asi: '+1 CON/STR', benefit: 'Push 5ft on bludgeoning hit. Crit = advantage for all attacks until your turn.', rating: 'A' },
    { feat: 'Elven Accuracy', asi: '+1 DEX/INT/WIS/CHA', benefit: 'Triple advantage on DEX/INT/WIS/CHA attacks. Crit fishing.', rating: 'S (elf only)' },
    { feat: 'War Caster', asi: 'None (full feat)', benefit: 'Advantage on concentration saves. Somatic with hands full. OA = cast spell.', rating: 'S (casters)' },
  ],
};

export const CLASS_ASI_PRIORITY = [
  { class: 'Fighter', priority: 'L4: Max STR/DEX. L6: GWM/SS or PAM/CBE. L8: Max or secondary feat.', note: 'Fighters get the most ASIs. Can afford both stat max + feats.' },
  { class: 'Paladin', priority: 'L4: Max CHA (if Hexblade) or STR. L8: GWM/PAM or Resilient CON.', note: 'CHA is saves + spells + smite DC. STR if not Hexblade.' },
  { class: 'Wizard', priority: 'L4: Max INT. L8: Resilient CON or War Caster. L12: Feat of choice.', note: 'INT 20 is non-negotiable. Then protect concentration.' },
  { class: 'Rogue', priority: 'L4: Max DEX. L8: Sentinel or Alert. L10: Resilient WIS.', note: 'DEX does everything for Rogues. Then shore up weaknesses.' },
  { class: 'Cleric', priority: 'L4: Max WIS. L8: Resilient CON or War Caster.', note: 'WIS 20 for Spirit Guardians DC. Then concentration protection.' },
  { class: 'Barbarian', priority: 'L4: Max STR. L8: GWM or PAM. L12: Resilient WIS or Tough.', note: 'STR for Reckless Attack accuracy. Then damage feats.' },
  { class: 'Sorcerer', priority: 'L4: Max CHA. L8: Resilient CON. L12: Metamagic Adept or feat.', note: 'CHA 20 ASAP. Concentration saves matter for Twinned Haste.' },
];

export function asiImpact(currentScore) {
  const currentMod = Math.floor((currentScore - 10) / 2);
  const newMod = Math.floor((currentScore + 2 - 10) / 2);
  return { modIncrease: newMod - currentMod, newScore: currentScore + 2, newMod };
}

export function isOddScore(score) {
  return score % 2 === 1; // Odd scores benefit from +1 (half-feat) to get next modifier
}
