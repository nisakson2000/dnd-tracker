/**
 * playerGoblinRaceGuide.js
 * Player Mode: Goblin — the nimble escape artist
 * Pure JS — no React dependencies.
 */

export const GOBLIN_BASICS = {
  race: 'Goblin',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 DEX, +1 CON (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Small',
  darkvision: '60ft',
  note: 'Fury of the Small for bonus damage. Nimble Escape for free Disengage/Hide as BA. Incredible action economy for any class that doesn\'t already use bonus action heavily.',
};

export const GOBLIN_TRAITS = [
  { trait: 'Fury of the Small', effect: 'When you damage a creature larger than you: add PB to damage. Once per short rest (MotM) or once per long rest (legacy).', note: 'Free +2 to +6 damage per SR. Most enemies are Medium or larger. Nearly always applies.' },
  { trait: 'Nimble Escape', effect: 'Disengage or Hide as a bonus action.', note: 'THE feature. Free Disengage = Rogue Cunning Action for any class. Hit-and-run with no feat required.' },
  { trait: 'Fey Ancestry (MotM)', effect: 'Advantage on saves vs charmed.', note: 'Good defensive trait. Protects against common spells.' },
];

export const GOBLIN_CLASS_SYNERGY = [
  { class: 'Fighter', priority: 'S', reason: 'Fighters have no BA. Nimble Escape = free Disengage every turn. Hit → retreat. Repeat. Incredible value.' },
  { class: 'Wizard/Sorcerer', priority: 'S', reason: 'Squishy casters with no BA escape. Nimble Escape = free Disengage. Cast spell → retreat. Survive.' },
  { class: 'Ranger', priority: 'A', reason: 'DEX bonus. Nimble Escape when not using Hunter\'s Mark BA. Great ranged combatant.' },
  { class: 'Cleric', priority: 'A', reason: 'Clerics sometimes need to retreat from melee. Nimble Escape after casting Spirit Guardians. No BA competition.' },
  { class: 'Rogue', priority: 'C', reason: 'Redundant. Rogues already have Cunning Action. Nimble Escape is wasted. Pick a different race.' },
  { class: 'Monk', priority: 'C', reason: 'Redundant. Monks have Step of the Wind. Nimble Escape overlaps.' },
];

export const GOBLIN_TACTICS = [
  { tactic: 'Melee hit-and-run', detail: 'Action: attack. BA: Disengage. Walk away. No opportunity attack. Repeat every turn.', rating: 'S' },
  { tactic: 'BA Hide for advantage', detail: 'BA: Hide. If behind cover: attack with advantage next turn. Pseudo-Rogue for any class.', rating: 'A' },
  { tactic: 'Fury of the Small on crits', detail: 'Save Fury for critical hits or Smites. Extra PB damage on a big hit = more value.', rating: 'A' },
  { tactic: 'Small size advantages', detail: 'Fit through 2.5ft spaces. Hide behind Medium allies. Small = easier to find cover.', rating: 'B' },
  { tactic: 'Goblin Wizard kiting', detail: 'Cast spell → Nimble Escape Disengage → move away. Never get caught in melee. No Misty Step needed.', rating: 'S' },
];

export function furyOfTheSmallDamage(profBonus) {
  return { damage: profBonus, frequency: 'Once per short rest (MotM)', note: 'Extra damage vs creatures larger than you (most enemies)' };
}
