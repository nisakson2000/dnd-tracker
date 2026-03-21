/**
 * playerMastermindRogueGuide.js
 * Player Mode: Mastermind Rogue — the tactical commander
 * Pure JS — no React dependencies.
 */

export const MASTERMIND_BASICS = {
  class: 'Rogue (Mastermind)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Tactician rogue. Bonus action Help at 30ft range. Master of disguise and intrigue.',
  note: 'The support Rogue. Master of Tactics lets you Help allies from 30ft as a bonus action every turn. Best in social/intrigue campaigns. Weaker in pure dungeon crawls.',
};

export const MASTERMIND_FEATURES = [
  { feature: 'Master of Intrigue', level: 3, effect: 'Proficiency with disguise kit, forgery kit, one gaming set. Two languages. Can mimic accents and speech patterns perfectly.', note: 'Social infiltration tools. Accent mimicry is great for undercover work. Languages for espionage.' },
  { feature: 'Master of Tactics', level: 3, effect: 'Help action as bonus action. Range 30ft (not 5ft).', note: 'Give an ally advantage on their attack EVERY TURN as a bonus action from 30ft away. Huge for enabling Sneak Attack on another Rogue or boosting a GWM/SS fighter.' },
  { feature: 'Insightful Manipulator', level: 9, effect: 'After 1 minute observing a creature: learn if it\'s superior, equal, or inferior to you in two of: INT, WIS, CHA, class levels.', note: 'Information gathering tool. Know if the NPC is smarter/more experienced than you. Useful for social encounters.' },
  { feature: 'Misdirection', level: 13, effect: 'When targeted by attack while creature within 5ft provides cover: redirect the attack to that creature instead.', note: 'Use an enemy as a shield. Stand behind a big enemy → attacks aimed at you hit them. Requires cover positioning.' },
  { feature: 'Soul of Deceit', level: 17, effect: 'Thoughts can\'t be read. You can present false thoughts. Immune to Zone of Truth (know it\'s cast but can lie). Deception check beats any attempt to detect your lies.', note: 'Undetectable lying. Immune to truth detection magic. The ultimate spy at L17.' },
];

export const MASTERMIND_TACTICS = [
  { tactic: 'Bonus action Help every turn', detail: 'Every turn: bonus action Help → ally gets advantage on their attack. Give advantage to the party\'s biggest damage dealer.', rating: 'S' },
  { tactic: 'Help + Sharpshooter/GWM ally', detail: 'GWM/SS fighters take -5 to hit. Your Help gives advantage, largely canceling the penalty. Massive damage boost for the party.', rating: 'S' },
  { tactic: 'Misdirection + positioning', detail: 'L13: Stand behind enemies. They provide you cover. Attacks targeting you hit them instead. Evil genius positioning.', rating: 'A' },
  { tactic: 'Social campaign dominance', detail: 'Perfect accent mimicry + Soul of Deceit + Expertise in social skills = unbeatable spy/diplomat.', rating: 'A' },
  { tactic: 'Ranged Help + Sneak Attack', detail: 'Attack from range (Sneak Attack if ally adjacent to target). Bonus action Help gives that ally advantage for next turn.', rating: 'A' },
];

export function masterOfTacticsValue(allyDamagePerHit, allyHitChance) {
  // Advantage raises hit chance by roughly +25% (simplified)
  const advantageBoost = 0.25;
  const extraExpectedDamage = allyDamagePerHit * advantageBoost;
  return { extraDamagePerRound: extraExpectedDamage, note: 'Approximate — advantage boost varies with base hit chance' };
}
