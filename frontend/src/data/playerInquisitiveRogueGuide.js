/**
 * playerInquisitiveRogueGuide.js
 * Player Mode: Inquisitive Rogue — the detective
 * Pure JS — no React dependencies.
 */

export const INQUISITIVE_BASICS = {
  class: 'Rogue (Inquisitive)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Perception and Insight master. Reliable Sneak Attack without allies or advantage. Detective archetype.',
  note: 'Insightful Fighting lets you use Sneak Attack on any target you beat in Insight vs Deception. No ally adjacent needed. Great for ranged Rogues who can\'t always set up Sneak Attack.',
};

export const INQUISITIVE_FEATURES = [
  { feature: 'Ear for Deceit', level: 3, effect: 'Insight checks to determine lies: minimum roll = 8 or WIS check total, whichever is higher (treat roll below 8 as 8).', note: 'Near-impossible to be lied to. Minimum 8 + WIS + proficiency = very high floor.' },
  { feature: 'Eye for Detail', level: 3, effect: 'Bonus action: Perception check to spot hidden creature, or Investigation check to find clues.', note: 'Frees your action for attacks while still finding hidden enemies. Great action economy.' },
  { feature: 'Insightful Fighting', level: 3, effect: 'Bonus action: Insight vs target\'s Deception. On success: Sneak Attack that target for 1 minute (no advantage/ally needed).', note: 'THE core feature. Guarantees Sneak Attack for a full minute. Works at range. Works solo.' },
  { feature: 'Steady Eye', level: 9, effect: 'Advantage on Perception and Investigation if you move ≤ half speed.', note: 'Passive Perception effectively +5 when walking slowly. Spot every trap and ambush.' },
  { feature: 'Unerring Eye', level: 13, effect: 'Action: sense illusions, shapechangers, and other deceptions within 30ft. WIS uses/LR.', note: 'Detect invisible creatures, illusions, disguised creatures. Anti-deception radar.' },
  { feature: 'Eye of the Weakling', level: 17, effect: 'If Insightful Fighting is active: deal 3d6 extra Sneak Attack damage if target is missing any HP.', note: '+3d6 on wounded targets. Basically +10.5 avg damage on every hit after first.' },
];

export const INQUISITIVE_TACTICS = [
  { tactic: 'Insightful Fighting opener', detail: 'Turn 1 BA: Insightful Fighting. Turns 2+: guaranteed Sneak Attack for 1 minute. No positioning required.', rating: 'S' },
  { tactic: 'Ranged Sneak Attack machine', detail: 'With Insightful Fighting, attack from 120ft+ with longbow. Sneak Attack every turn, no ally needed.', rating: 'S' },
  { tactic: 'Eye for Detail + Attack', detail: 'BA: spot hidden creature → Action: attack with Sneak Attack. Full damage while detecting enemies.', rating: 'A' },
  { tactic: 'Investigation/social pillar', detail: 'Expertise in Insight + Perception + Investigation. Ear for Deceit minimum. Best detective in the game.', rating: 'A' },
  { tactic: 'Solo combat viability', detail: 'Most Rogues need allies for Sneak Attack. Inquisitive doesn\'t. Best Rogue for solo encounters.', rating: 'A' },
];

export function insightfulFightingCheck(wisMod, profBonus, hasExpertise = true) {
  const bonus = wisMod + (hasExpertise ? profBonus * 2 : profBonus);
  return { bonus, avgRoll: 10.5 + bonus, note: 'Insight vs target Deception. Most monsters have low Deception.' };
}

export function eyeOfTheWeaklingDamage(rogueLevel) {
  const baseSneakDice = Math.ceil(rogueLevel / 2);
  const extraDice = 3;
  return { totalDice: baseSneakDice + extraDice, avgExtra: 10.5, note: '+3d6 on wounded targets' };
}
