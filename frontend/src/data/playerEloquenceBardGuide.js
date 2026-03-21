/**
 * playerEloquenceBardGuide.js
 * Player Mode: College of Eloquence Bard — the ultimate face
 * Pure JS — no React dependencies.
 */

export const ELOQUENCE_BASICS = {
  class: 'Bard (College of Eloquence)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Minimum roll on Persuasion/Deception. Bardic Inspiration can\'t be wasted. Best support bard.',
  note: 'Arguably the strongest Bard subclass. Silver Tongue guarantees social success. Unsettling Words debuffs saves. Infectious Inspiration chains support.',
};

export const ELOQUENCE_FEATURES = [
  { feature: 'Silver Tongue', level: 3, effect: 'Treat any Persuasion or Deception roll below 10 as a 10.', note: 'Minimum 10 on the die + proficiency + CHA. At L5 with +5 CHA: minimum result = 10+3+5 = 18. You literally cannot fail most social checks.' },
  { feature: 'Unsettling Words', level: 3, effect: 'Bonus action: spend Bardic Inspiration die. Target subtracts the roll from its next saving throw.', note: 'Debuff a boss\'s save before your caster drops Hold Person/Banishment. -1d8 (avg -4.5) to a save is huge.' },
  { feature: 'Unfailing Inspiration', level: 6, effect: 'When a creature uses your Bardic Inspiration and fails, they keep the die.', note: 'Bardic Inspiration can never be wasted. If the ally fails, they keep it for next time. Infinite value per die.' },
  { feature: 'Universal Speech', level: 6, effect: 'Action: up to PB creatures understand you for 1 hour, regardless of language. CHA uses/LR.', note: 'Bypass language barriers entirely. Great for diplomacy with exotic creatures.' },
  { feature: 'Infectious Inspiration', level: 14, effect: 'When ally uses your Bardic Inspiration and succeeds, reaction: give the die to a different creature within 60ft. CHA uses/LR.', note: 'Chain Bardic Inspiration from ally to ally. At +5 CHA: 5 chains per rest. Incredible action economy.' },
];

export const ELOQUENCE_TACTICS = [
  { tactic: 'Unsettling Words + Hold Person', detail: 'Bonus action: Unsettling Words on boss (-1d8 to save). Then ally casts Hold Person. Save debuffed by ~4.5. Paralyzed = auto-crit melee.', rating: 'S' },
  { tactic: 'Silver Tongue social domination', detail: 'Minimum Persuasion/Deception of 18+ at L5. You pass virtually every social check. Take Expertise in both for overkill.', rating: 'S' },
  { tactic: 'Unfailing Inspiration economy', detail: 'Give Bardic Inspiration freely. If ally fails, they keep the die. No waste. Use Unsettling Words for offense, regular BI for allies.', rating: 'S' },
  { tactic: 'Save debuff for Banishment', detail: 'Unsettling Words on creature with mediocre CHA → ally casts Banishment. Even -3 to the save can change a fight.', rating: 'S' },
  { tactic: 'Infectious Inspiration chains', detail: 'L14: ally uses BI and succeeds → reaction: pass die to another ally. Can chain CHA times per rest.', rating: 'A' },
];

export const ELOQUENCE_SPELL_PRIORITIES = [
  { spell: 'Silvery Barbs', note: 'Force reroll on enemy. Give advantage to ally. Stacks with Unsettling Words for double debuff.', rating: 'S' },
  { spell: 'Hypnotic Pattern', note: 'AoE incapacitate. Use Unsettling Words on the toughest enemy in the area first.', rating: 'S' },
  { spell: 'Hold Person/Monster', note: 'Paralyzed = auto-crit in melee. Unsettling Words makes the save harder. Devastating combo.', rating: 'S' },
  { spell: 'Enemies Abound', note: 'INT save → target treats all creatures as enemies. Great on brutes with low INT.', rating: 'A' },
  { spell: 'Suggestion', note: 'Single target, no save debuff needed if wording is clever. Silver Tongue for backup social route.', rating: 'A' },
];

export function silverTongueMinimumRoll(proficiencyBonus, chaMod) {
  return 10 + proficiencyBonus + chaMod;
}

export function unsettlingWordsAvgDebuff(bardLevel) {
  if (bardLevel >= 15) return 6.5; // 1d12
  if (bardLevel >= 10) return 5.5; // 1d10
  if (bardLevel >= 5) return 4.5;  // 1d8
  return 3.5; // 1d6
}
