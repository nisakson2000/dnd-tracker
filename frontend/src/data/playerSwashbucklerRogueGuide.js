/**
 * playerSwashbucklerRogueGuide.js
 * Player Mode: Swashbuckler Rogue — the dueling charmer
 * Pure JS — no React dependencies.
 */

export const SWASHBUCKLER_BASICS = {
  class: 'Rogue (Swashbuckler)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Dashing duelist. Easy Sneak Attack in melee 1v1. Free disengage after attacks. CHA to initiative.',
  note: 'Best melee Rogue subclass. Doesn\'t need allies adjacent for Sneak Attack. Free in-and-out combat flow.',
};

export const SWASHBUCKLER_FEATURES = [
  { feature: 'Fancy Footwork', level: 3, effect: 'When you melee attack a creature, it can\'t make opportunity attacks against you for the rest of your turn.', note: 'Free Disengage vs anyone you attack. Hit and run without using Cunning Action. Incredible.' },
  { feature: 'Rakish Audacity', level: 3, effect: 'Add CHA mod to initiative. Sneak Attack without advantage if no other creature is within 5ft of target (and no disadvantage).', note: 'Sneak Attack in 1v1 duels. +CHA to initiative. Makes melee Rogue completely independent.' },
  { feature: 'Panache', level: 9, effect: 'Persuasion check vs Insight: in combat = taunt (target has disadvantage attacking anyone but you, can\'t make opportunity attacks vs others). Out of combat = charmed for 1 minute.', note: 'Non-magical charm + taunt. No spell slot. CHA-based. Great for social AND combat.' },
  { feature: 'Elegant Maneuver', level: 13, effect: 'Bonus action: advantage on next Acrobatics or Athletics check.', note: 'Bonus action advantage on physical checks. Useful for escaping grapples, chases.' },
  { feature: 'Master Duelist', level: 17, effect: 'When you miss with an attack: reroll with advantage. Once per short rest.', note: 'Turn a miss into advantage. Almost guarantees one Sneak Attack per short rest.' },
];

export const SWASHBUCKLER_TACTICS = [
  { tactic: 'Hit-and-run', detail: 'Move in → attack (Sneak Attack in 1v1) → Fancy Footwork prevents OA → move away. Free disengage every turn.', rating: 'S' },
  { tactic: 'Initiative king', detail: '+CHA+DEX to initiative. Alert feat: +5 more. Go first consistently. Position before enemies act.', rating: 'S' },
  { tactic: 'Panache tanking', detail: 'L9: Persuasion vs Insight taunt. Target has disadvantage on attacks vs allies. You become the pseudo-tank.', rating: 'A' },
  { tactic: 'Dual wielding SA', detail: 'Miss first attack? Bonus action offhand attack for second chance at Sneak Attack. Two bites at the SA apple.', rating: 'A' },
  { tactic: 'Multiclass: Hexblade 1', detail: '1 level Hexblade: CHA to weapon attacks. CHA to initiative (Rakish Audacity). CHA to Panache. Single-stat build.', rating: 'A' },
];

export function swashbucklerInitiative(dexMod, chaMod, hasAlert = false) {
  return dexMod + chaMod + (hasAlert ? 5 : 0);
}

export function canSneakAttack1v1(otherCreaturesWithin5ft, hasDisadvantage) {
  return otherCreaturesWithin5ft === 0 && !hasDisadvantage;
}
