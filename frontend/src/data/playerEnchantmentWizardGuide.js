/**
 * playerEnchantmentWizardGuide.js
 * Player Mode: School of Enchantment Wizard — the mind controller
 * Pure JS — no React dependencies.
 */

export const ENCHANTMENT_BASICS = {
  class: 'Wizard (School of Enchantment)',
  source: 'Player\'s Handbook',
  theme: 'Mind controller. Charm, dominate, and redirect spells to multiple targets.',
  note: 'Strong thematic subclass. Hypnotic Gaze is decent control. Split Enchantment at L10 is the real payoff.',
};

export const ENCHANTMENT_FEATURES = [
  { feature: 'Hypnotic Gaze', level: 2, effect: 'Action: choose creature within 5ft. WIS save or charmed (incapacitated, speed 0) until end of your next turn. Each turn: use action to maintain. Ends if you move or target takes damage.', note: 'Lock down one enemy adjacent to you. Uses your action every turn. Good when you don\'t want to spend slots.' },
  { feature: 'Instinctive Charm', level: 6, effect: 'Reaction when attacked by creature within 30ft that you can see: redirect the attack to another creature (not you or attacker). WIS save negates. Once/rest.', note: 'Redirect an attack to another enemy. Force the orc to hit his buddy. Once per short rest.' },
  { feature: 'Split Enchantment', level: 10, effect: 'When you cast an enchantment spell that targets one creature, target two creatures instead.', note: 'THE FEATURE. Hold Person → hold TWO people. Suggestion → suggest to TWO people. One slot, double targets.' },
  { feature: 'Alter Memories', level: 14, effect: 'When you cast an enchantment spell on a creature, spend 1 action: target makes INT save with disadvantage. Failure: target doesn\'t know it was charmed. You can also erase up to 1+CHA mod hours of memory.', note: 'They don\'t remember being charmed. Erase evidence of your spell. Perfect for social espionage.' },
];

export const SPLIT_ENCHANTMENT_SPELLS = [
  { spell: 'Hold Person (2nd)', effect: 'Paralyze TWO humanoids. Auto-crit on both.', rating: 'S' },
  { spell: 'Suggestion (2nd)', effect: 'Control TWO targets with a reasonable suggestion.', rating: 'S' },
  { spell: 'Hold Monster (5th)', effect: 'Paralyze TWO creatures of any type.', rating: 'S' },
  { spell: 'Dominate Person (5th)', effect: 'Dominate TWO humanoids at once.', rating: 'S' },
  { spell: 'Tasha\'s Hideous Laughter (1st)', effect: 'TWO targets incapacitated laughing.', rating: 'A' },
  { spell: 'Crown of Madness (2nd)', effect: 'TWO targets under madness. Less reliable but fun.', rating: 'B' },
];

export const ENCHANTMENT_TACTICS = [
  { tactic: 'Split Hold Person', detail: 'L10: Hold Person on two targets = two paralyzed enemies. Melee allies crit both.', rating: 'S' },
  { tactic: 'Hypnotic Gaze stall', detail: 'Lock down one enemy with no spell slot. Good for saving resources or controlling a weaker enemy.', rating: 'B', note: 'Uses your action every turn. Only worth it against single threats.' },
  { tactic: 'Instinctive Charm redirect', detail: 'Enemy attacks you → redirect to another enemy. They hit each other.', rating: 'A' },
  { tactic: 'Alter Memories infiltration', detail: 'L14: charm someone, extract info, erase their memory of the conversation. Perfect crime.', rating: 'S' },
];

export function splitEnchantmentTargets() {
  return 2; // Double targets on single-target enchantment spells
}
