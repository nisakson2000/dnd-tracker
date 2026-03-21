/**
 * playerGreatOldOneWarlockGuide.js
 * Player Mode: Great Old One Warlock — the cosmic horror warlock
 * Pure JS — no React dependencies.
 */

export const GREAT_OLD_ONE_BASICS = {
  class: 'Warlock (The Great Old One)',
  source: 'Player\'s Handbook',
  theme: 'Cosmic horror patron. Telepathy, psychic damage, and mind control.',
  note: 'Thematic and flavorful but mechanically weaker than newer patrons. Awakened Mind (telepathy) and Thought Shield (psychic immunity) are good. Create Thrall is niche.',
};

export const GREAT_OLD_ONE_FEATURES = [
  { feature: 'Awakened Mind', level: 1, effect: 'Telepathic communication with any creature within 30ft. They understand you even without shared language. One-way: you speak, they can respond verbally.', note: 'Telepathy from L1. Communicate with any creature. Silent orders. Language barriers gone.' },
  { feature: 'Entropic Ward', level: 6, effect: 'Reaction when attacked: impose disadvantage on attack roll. If it misses, your next attack against them has advantage. Once per short rest.', note: 'Disadvantage on attack + advantage on your next attack if they miss. Decent defensive reaction.' },
  { feature: 'Thought Shield', level: 10, effect: 'Thoughts can\'t be read by telepathy unless you allow it. Resistance to psychic damage. When you take psychic damage, attacker takes the same amount.', note: 'Psychic resistance + psychic reflection. Mind Flayers take their own psychic damage back.' },
  { feature: 'Create Thrall', level: 14, effect: 'Touch an incapacitated humanoid: it\'s charmed by you permanently until Remove Curse. Telepathic communication anywhere on same plane.', note: 'Permanent charm on a humanoid. No concentration. Create a spy network. Very RP-dependent.' },
];

export const GREAT_OLD_ONE_SPELLS = [
  { level: 1, spells: ['Dissonant Whispers', 'Tasha\'s Hideous Laughter'], note: 'Dissonant Whispers: damage + forced movement (triggers OAs). Excellent.' },
  { level: 2, spells: ['Detect Thoughts', 'Phantasmal Force'], note: 'Both are great social/combat spells.' },
  { level: 3, spells: ['Clairvoyance', 'Sending'], note: 'Clairvoyance for remote viewing. Sending for communication.' },
  { level: 4, spells: ['Dominate Beast', 'Evard\'s Black Tentacles'], note: 'Black Tentacles: AoE restrain. Excellent control.' },
  { level: 5, spells: ['Dominate Person', 'Telekinesis'], note: 'Dominate Person: mind control. Telekinesis: versatile manipulation.' },
];

export const GREAT_OLD_ONE_TACTICS = [
  { tactic: 'Dissonant Whispers + melee ally', detail: 'Dissonant Whispers: target moves away (forced movement). Triggers OAs from melee allies. Extra free attacks.', rating: 'S', note: 'One of the best L1 spells. Rogue gets OA Sneak Attack on your turn.' },
  { tactic: 'Awakened Mind social', detail: 'Telepathy to any creature. Communicate silently in combat. Speak to creatures that don\'t share your language.', rating: 'A' },
  { tactic: 'Entropic Ward combo', detail: 'Force disadvantage on an attack → if miss → your next EB has advantage. Advantage EB = better hit chance for Agonizing Blast.', rating: 'A' },
  { tactic: 'Create Thrall spy network', detail: 'L14: permanently charm a humanoid. Send them to gather intelligence. Telepathy across the plane.', rating: 'A', note: 'Build a network of thralls. Guard captain, merchant, noble — all your spies.' },
];

export const GOO_VS_FATHOMLESS = {
  greatOldOne: { pros: ['Free telepathy (L1)', 'Psychic reflection', 'Dissonant Whispers spell', 'Permanent thrall'], cons: ['Weaker features overall', 'No bonus action damage', 'Create Thrall is niche'] },
  fathomless: { pros: ['Bonus action tentacle damage', 'Damage reduction (Guardian Coil)', 'Free Black Tentacles', 'Better sustained damage'], cons: ['No telepathy', 'No psychic reflection', 'Aquatic-themed'] },
  verdict: 'Fathomless is mechanically stronger. GOO is better for RP and social campaigns.',
};

export function entropicWardAdvantageChance(baseHitChance) {
  // Chance enemy misses with disadvantage
  const missChance = Math.pow(1 - baseHitChance, 2); // Disadvantage
  return missChance; // This is also your chance of getting advantage on next attack
}
