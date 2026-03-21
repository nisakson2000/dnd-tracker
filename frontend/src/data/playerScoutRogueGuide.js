/**
 * playerScoutRogueGuide.js
 * Player Mode: Scout Rogue — the wilderness skirmisher
 * Pure JS — no React dependencies.
 */

export const SCOUT_BASICS = {
  class: 'Rogue (Scout)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Nature expert rogue. Free Nature/Survival expertise. Reaction movement. Superior mobility.',
  note: 'The Ranger-Rogue. Gets free Expertise in Nature and Survival. Skirmisher reaction gives free disengage. Ambush Master is a better version of the Assassin\'s surprise feature.',
};

export const SCOUT_FEATURES = [
  { feature: 'Skirmisher', level: 3, effect: 'When an enemy ends its turn within 5ft of you: reaction to move half your speed without provoking opportunity attacks.', note: 'Free disengage as a reaction. Enemy runs up to you → you scoot away. Keeps you at range. Excellent survivability.' },
  { feature: 'Survivalist', level: 3, effect: 'Proficiency AND Expertise in Nature and Survival.', note: 'Free double proficiency in two skills. If you already have them, choose replacements. Excellent skill monkey boost.' },
  { feature: 'Superior Mobility', level: 9, effect: '+10ft to walking speed. Also applies to climb and swim speeds if you have them.', note: 'Permanent speed boost. With Skirmisher, you\'re incredibly mobile. Kite enemies all day.' },
  { feature: 'Ambush Master', level: 13, effect: 'Advantage on initiative rolls. First creature you hit in first round of combat grants advantage on attacks against it for all allies until start of your next turn.', note: 'Better than Assassin\'s Assassinate in many ways. Advantage on initiative is huge. Marking a target for the whole party is incredible.' },
  { feature: 'Sudden Strike', level: 17, effect: 'If you take the Attack action and attack with two different weapons, you can apply Sneak Attack to the second attack (if you haven\'t used Sneak Attack this turn).', note: 'TWO Sneak Attacks per turn. Full Sneak Attack on first hit + second Sneak Attack on bonus action TWF hit. Doubles your damage.' },
];

export const SCOUT_TACTICS = [
  { tactic: 'Skirmisher kiting', detail: 'Ranged attack → enemy approaches → reaction: move half speed away → next turn: ranged attack from safety. Never get pinned in melee.', rating: 'S' },
  { tactic: 'Ambush Master target marking', detail: 'L13: first creature you hit in round 1 → all allies have advantage against it. Mark the boss. Party unloads.', rating: 'S' },
  { tactic: 'Sudden Strike double Sneak Attack', detail: 'L17: Attack with main weapon (Sneak Attack) → bonus action offhand attack (second Sneak Attack). 2× Sneak Attack per turn.', rating: 'S' },
  { tactic: 'Ranged Scout build', detail: 'Longbow + Skirmisher + Superior Mobility. Stay at range, react away from melee threats. Never need to close distance.', rating: 'A' },
  { tactic: 'Nature/Survival expertise', detail: 'Free Expertise in exploration skills. Track enemies, identify plants/beasts, navigate wilderness. Be the party\'s Ranger.', rating: 'A' },
];

export function suddenStrikeDPR(sneakAttackDice, weaponDamage, dexMod) {
  const firstAttack = weaponDamage + sneakAttackDice * 3.5 + dexMod;
  const secondAttack = weaponDamage + sneakAttackDice * 3.5; // no DEX on offhand unless TWF style
  return { firstAttack, secondAttack, totalDPR: firstAttack + secondAttack };
}

export function skirmisherMovement(baseSpeed) {
  return Math.floor(baseSpeed / 2);
}
