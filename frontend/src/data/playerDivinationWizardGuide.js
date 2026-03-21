/**
 * playerDivinationWizardGuide.js
 * Player Mode: School of Divination Wizard — the fortune teller
 * Pure JS — no React dependencies.
 */

export const DIVINATION_BASICS = {
  class: 'Wizard (School of Divination)',
  source: 'Player\'s Handbook',
  theme: 'Seer and fortune-teller. Replace d20 rolls with predetermined results.',
  note: 'Widely considered the best Wizard subclass. Portent is one of the strongest features in the game. Simple, consistent, powerful.',
};

export const DIVINATION_FEATURES = [
  { feature: 'Portent', level: 2, effect: 'After long rest: roll 2d20. You can replace any attack roll, save, or ability check made by a creature you can see with one of these rolls. Before the roll is made.', note: 'THE FEATURE. Rolled a 1? Force an enemy to use it on their save. Rolled a 20? Give it to your Rogue for a crit. Game-changing.' },
  { feature: 'Expert Divination', level: 6, effect: 'When you cast a divination spell of 2nd level+, regain a spell slot of lower level (up to 5th).', note: 'Cast a divination spell, get a lower slot back. Effectively free divination spells AND slot generation.' },
  { feature: 'The Third Eye', level: 10, effect: 'Action: choose one — darkvision 60ft, see Ethereal (60ft), read any language, or see invisible (10ft). Lasts until rest.', note: 'See invisible is huge. Ethereal sight for ghost detection. Any language reading for dungeons.' },
  { feature: 'Greater Portent', level: 14, effect: 'Roll 3d20 for Portent instead of 2.', note: '3 predetermined d20 rolls per day. More chances for extreme high/low results.' },
];

export const PORTENT_USAGE = [
  { use: 'Force enemy to fail a save', detail: 'Rolled a 3? Enemy boss makes their save vs Hold Monster with a 3. Auto-paralyzed.', rating: 'S' },
  { use: 'Guarantee ally critical', detail: 'Rolled a 20? Give it to the Paladin for a crit-smite.', rating: 'S' },
  { use: 'Guarantee your spell hits', detail: 'Rolled a 17? Use it on your Disintegrate attack roll. Guaranteed hit.', rating: 'A' },
  { use: 'Force enemy to miss', detail: 'Rolled a 2? Dragon attacks your Wizard? Their attack roll is 2. Miss.', rating: 'A' },
  { use: 'Pass crucial ability check', detail: 'Rolled an 18? Use it on an important Persuasion/Stealth check.', rating: 'A' },
  { use: 'Save Portent for crucial moment', detail: 'Don\'t waste Portent early. Save low rolls for enemy saves, high rolls for critical moments.', rating: 'S', note: 'Portent management is the core skill of playing Divination Wizard.' },
];

export const PORTENT_MATH = {
  chanceOfLowRoll: 'At least one roll ≤5: ~40% (2d20), ~50% (3d20)',
  chanceOfHighRoll: 'At least one roll ≥16: ~44% (2d20), ~59% (3d20)',
  chanceOfExtremes: 'At least one ≤3 OR ≥18: ~52% (2d20), ~66% (3d20)',
  note: 'Most days you\'ll get at least one useful extreme roll. Over a campaign, Portent decides many key moments.',
};

export const DIVINATION_TACTICS = [
  { tactic: 'Portent + save-or-suck', detail: 'Cast Hold Monster. Low Portent on enemy save. They automatically fail. Paralyzed. No randomness.', rating: 'S' },
  { tactic: 'Expert Divination slot engine', detail: 'Cast Mind Spike (2nd, divination) → get back a 1st level slot. Net cost: 1 level. Repeat.', rating: 'A', note: 'Mind Spike deals damage AND generates slots. Cast repeatedly for sustained damage + slot recovery.' },
  { tactic: 'Portent + Silvery Barbs', detail: 'Enemy succeeds on a save? Silvery Barbs forces reroll. If they succeed again? Portent forces a low result.', rating: 'S', note: 'Double insurance. Almost impossible for enemies to save against your spells.' },
  { tactic: 'Third Eye: see invisible', detail: 'L10: see invisible creatures within 10ft. Counter invisible stalkers, invisible enemies, etc.', rating: 'A' },
];

export function portentDiceCount(wizardLevel) {
  return wizardLevel >= 14 ? 3 : 2;
}

export function portentChanceOfUsefulRoll(diceCount, threshold) {
  // Chance of rolling at least one die ≤ threshold (for enemy saves)
  const chancePerDie = threshold / 20;
  return 1 - Math.pow(1 - chancePerDie, diceCount);
}
