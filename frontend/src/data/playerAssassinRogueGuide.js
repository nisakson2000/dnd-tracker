/**
 * playerAssassinRogueGuide.js
 * Player Mode: Assassin Rogue — the ambush specialist
 * Pure JS — no React dependencies.
 */

export const ASSASSIN_BASICS = {
  class: 'Rogue (Assassin)',
  source: 'Player\'s Handbook',
  theme: 'Surprise specialist. Auto-crits on surprised enemies. Infiltration identity. Poison proficiency.',
  note: 'Incredible when surprise works. Problem: surprise is DM-dependent and hard to achieve reliably. Best in RP-heavy campaigns with assassination missions.',
};

export const ASSASSIN_FEATURES = [
  { feature: 'Bonus Proficiencies', level: 3, effect: 'Proficiency with disguise kit and poisoner\'s kit.', note: 'Poisoner\'s kit lets you apply poison to weapons. Disguise kit for infiltration. Both fit the theme.' },
  { feature: 'Assassinate', level: 3, effect: 'Advantage on attacks against creatures that haven\'t taken a turn yet. Any hit against a surprised creature is an automatic critical hit.', note: 'The defining feature. Auto-crit Sneak Attack = massive damage. Example at L5: 2×(1d8+3d6+DEX) = devastating opener.' },
  { feature: 'Infiltration Expertise', level: 9, effect: 'Spend 7 days + 25gp to create a false identity with documentation, established history, and disguise.', note: 'RP feature for long-term infiltration. Less useful in dungeon-crawl campaigns. Amazing in intrigue campaigns.' },
  { feature: 'Impostor', level: 13, effect: 'Perfectly mimic another person\'s speech, writing, and behavior after 3 hours of study. Contested Insight vs Deception to see through.', note: 'Replace an NPC entirely. Social infiltration tool. Very powerful in the right campaign.' },
  { feature: 'Death Strike', level: 17, effect: 'When you hit a surprised creature: CON save (DC 8+DEX+PB) or double all damage.', note: 'Auto-crit (Assassinate) × 2 (Death Strike) = quadruple Sneak Attack dice. At L17: 4×9d6 = 126 avg damage in one hit.' },
];

export const ASSASSIN_SURPRISE_RULES = {
  howSurpriseWorks: 'Each creature in combat: DM compares Stealth vs Passive Perception. Surprised creatures can\'t move/act/react on first turn.',
  assassinateRequirement: 'Target must be surprised AND not have taken a turn yet. Both conditions needed for auto-crit.',
  tips: [
    'Coordinate with party — ONE loud ally ruins surprise for all enemies.',
    'Alert feat on enemies negates surprise. Can\'t be surprised.',
    'Surprise is determined at start of combat, not during.',
    'After first round, surprise is over. Assassinate\'s advantage still works vs creatures that haven\'t acted.',
  ],
  reliabilityIssue: 'Surprise requires ALL enemies to fail Perception vs your party\'s Stealth. Party members in heavy armor often ruin it.',
};

export const ASSASSIN_TACTICS = [
  { tactic: 'Surprise round crit', detail: 'Stealth → surprise → auto-crit Sneak Attack. At L5: 2×(1d8+3d6+4) = 38 avg. Devastating opener when it works.', rating: 'S (when it works)' },
  { tactic: 'Alert feat', detail: 'Take Alert feat: +5 initiative, can\'t be surprised. Ironic for an Assassin but guarantees you act first for Assassinate advantage.', rating: 'A' },
  { tactic: 'Poison application', detail: 'Apply poison to weapon before combat. Surprise auto-crit + poison damage. Purple Worm Poison: 12d6 extra on failed CON save.', rating: 'A' },
  { tactic: 'Bugbear race combo', detail: 'Bugbear Surprise Attack: +2d6 damage on creatures that haven\'t acted. Stacks with Assassinate auto-crit. All dice doubled.', rating: 'S' },
  { tactic: 'Infiltration missions', detail: 'Impostor + Infiltration Expertise = become anyone. Perfect for spy campaigns, heist missions, political intrigue.', rating: 'A (campaign-dependent)' },
];

export function assassinateDamage(sneakAttackDice, weaponDamage, dexMod, isSurprised = true) {
  const sneakAvg = sneakAttackDice * 3.5;
  const totalBase = weaponDamage + sneakAvg + dexMod;
  return isSurprised ? totalBase * 2 : totalBase; // auto-crit doubles dice
}

export function deathStrikeDamage(sneakAttackDice, weaponDamage, dexMod) {
  const critDamage = (weaponDamage + sneakAttackDice * 3.5 + dexMod) * 2; // auto-crit
  return critDamage * 2; // Death Strike doubles again
}
