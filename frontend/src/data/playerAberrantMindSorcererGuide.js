/**
 * playerAberrantMindSorcererGuide.js
 * Player Mode: Aberrant Mind Sorcerer — the psychic spellcaster
 * Pure JS — no React dependencies.
 */

export const ABERRANT_MIND_BASICS = {
  class: 'Sorcerer (Aberrant Mind)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Psychic powers. Telepathy. Cast enchantment/divination spells with Subtle Spell for free via SP.',
  note: 'Tied with Clockwork Soul for best Sorcerer. 10 bonus spells. Psionic Sorcery lets you cast bonus spells with SP instead of slots — and they\'re automatically Subtle.',
};

export const ABERRANT_MIND_FEATURES = [
  { feature: 'Psionic Spells', level: 1, effect: '10 bonus spells (swappable for divination/enchantment from Sorcerer/Warlock/Wizard list): Arms of Hadar, Dissonant Whispers, Calm Emotions, Detect Thoughts, Hunger of Hadar, Sending, Evard\'s Black Tentacles, Summon Aberration, Telekinesis, Modify Memory.', note: '10 extra spells. Swappable for ANY divination/enchantment from 3 class lists. Incredible flexibility.' },
  { feature: 'Telepathic Speech', level: 1, effect: 'Bonus action: telepathic link with one creature for CHA mod minutes. You speak telepathically. They can respond if willing.', note: 'Free silent communication. No language barrier. Great for stealth coordination.' },
  { feature: 'Psionic Sorcery', level: 6, effect: 'When casting a Psionic Spell: can use SP equal to spell level instead of spell slot. When cast this way: no verbal or somatic components.', note: 'This is the reason Aberrant Mind is S-tier. Cast spells with SP = automatic Subtle Spell for FREE. No components = uncounterable.' },
  { feature: 'Psychic Defenses', level: 6, effect: 'Resistance to psychic damage. Advantage on saves vs charmed or frightened.', note: 'Good defensive package. Psychic resistance + charm/fear advantage.' },
  { feature: 'Revelation in Flesh', level: 14, effect: 'Bonus action, spend 1+ SP: gain one benefit per SP: see invisible (10ft), fly equal to walking speed, swim + breathe underwater, squeeze through 1-inch spaces.', note: 'At-will flight for 1 SP. See invisible for 1 SP. Squeeze through anything for 1 SP. Incredible utility.' },
  { feature: 'Warping Implosion', level: 18, effect: 'Action: teleport 120ft. Each creature within 30ft of your departure point: STR save or 3d10 force + pulled to your former space. 1/LR or 5 SP.', note: 'Teleport + AoE damage + mass pull. Escape and punish simultaneously.' },
];

export const PSIONIC_SORCERY_ECONOMY = [
  { spell: 'Dissonant Whispers (L1)', spCost: 1, slotCost: 'L1', savings: 'Save a L1 slot + free Subtle', note: '1 SP for a L1 slot + Subtle Spell. Normally Subtle costs 1 SP extra. You save the slot AND the Subtle cost.' },
  { spell: 'Detect Thoughts (L2)', spCost: 2, slotCost: 'L2', savings: 'Save a L2 slot + free Subtle', note: 'Read minds with no components. Nobody knows you\'re doing it. Perfect for social encounters.' },
  { spell: 'Hunger of Hadar (L3)', spCost: 3, slotCost: 'L3', savings: 'Save a L3 slot + free Subtle', note: 'Subtle Hunger of Hadar. No one can identify the source. You can be across the room looking innocent.' },
  { spell: 'Summon Aberration (L4)', spCost: 4, slotCost: 'L4', savings: 'Save a L4 slot + no material component', note: 'Summon without material components (200gp pickled tentacle normally). Free summon.' },
  { spell: 'Modify Memory (L5)', spCost: 5, slotCost: 'L5', savings: 'Save a L5 slot + free Subtle', note: 'Subtle Modify Memory. Target doesn\'t know you cast it. Rewrite someone\'s memories without them ever knowing.' },
];

export const ABERRANT_MIND_TACTICS = [
  { tactic: 'Subtle Suggestion in social', detail: 'Psionic Sorcery: cast Suggestion with no components. Nobody knows you cast a spell. The target just... agrees.', rating: 'S' },
  { tactic: 'Subtle Counterspell (swap in)', detail: 'Swap a psionic spell for Counterspell. Cast via Psionic Sorcery. No components = can\'t be counter-Counterspelled.', rating: 'S' },
  { tactic: 'SP economy over spell slots', detail: 'Use Psionic Sorcery for low-level spells (1-3 SP). Save spell slots for high-level blasts. More casts per day.', rating: 'S' },
  { tactic: 'Subtle Detect Thoughts spy', detail: 'Read minds without anyone knowing. No verbal/somatic. Perfect information gathering.', rating: 'S' },
  { tactic: 'Revelation in Flesh utility', detail: 'L14: 1 SP = flight. 1 SP = see invisible. Cheap, versatile, always available.', rating: 'A' },
];

export function psionicSorceryCost(spellLevel) {
  return spellLevel; // SP cost = spell level
}

export function spSavingsVsSlotPlusSubtle(spellLevel) {
  const slotValue = spellLevel; // Equivalent SP value
  const subtleCost = 1; // Normal Subtle Spell cost
  return { totalSaved: slotValue + subtleCost, note: `Save ${slotValue} SP (slot value) + ${subtleCost} SP (Subtle) = ${slotValue + subtleCost} SP total value for only ${spellLevel} SP spent` };
}
