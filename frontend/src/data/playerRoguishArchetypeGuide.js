/**
 * playerRoguishArchetypeGuide.js
 * Player Mode: All Rogue subclasses ranked
 * Pure JS — no React dependencies.
 */

export const ROGUISH_ARCHETYPES_RANKED = [
  { archetype: 'Soulknife', rating: 'S', role: 'Versatile', key: 'Psychic blades (no weapon). Psi skill boost. 120ft teleport L9.', note: 'Best all-rounder Rogue.' },
  { archetype: 'Arcane Trickster', rating: 'S', role: 'Hybrid Caster', key: 'Spellcasting. Find Familiar = guaranteed SA. Shield spell.', note: 'Best spellcasting Rogue.' },
  { archetype: 'Swashbuckler', rating: 'S', role: 'Melee/Social', key: 'Free SA in 1v1. Free Disengage. +CHA initiative.', note: 'Best melee Rogue.' },
  { archetype: 'Phantom', rating: 'A+', role: 'Damage', key: 'SA damage to second target. Ghost Walk L13.', note: 'Extra AoE SA damage.' },
  { archetype: 'Scout', rating: 'A+', role: 'Ranged', key: 'Reaction reposition. Nature+Survival expertise.', note: 'Best ranged Rogue.' },
  { archetype: 'Thief', rating: 'A', role: 'Item User', key: 'Fast Hands (BA Use Object). Use Magic Device L13.', note: 'BA Healer\'s Kit + Healer feat.' },
  { archetype: 'Inquisitive', rating: 'A', role: 'Detective', key: 'Insight check → SA without advantage. BA Perception.', note: 'Investigation campaigns.' },
  { archetype: 'Assassin', rating: 'B+', role: 'Nova', key: 'Auto-crit on surprised. False identities.', note: 'Surprise is hard to achieve.' },
  { archetype: 'Mastermind', rating: 'B+', role: 'Support', key: '30ft BA Help. Learn creature stats.', note: 'Doesn\'t scale.' },
];

export const ROGUE_ARCHETYPE_TIPS = [
  'Swashbuckler: free SA, free Disengage. Best melee Rogue hands down.',
  'Arcane Trickster: Find Familiar Help = guaranteed Sneak Attack.',
  'Soulknife: never unarmed. Telepathy. Skill boosts. Complete package.',
  'Assassin is overrated. Surprise requires the ENTIRE party to beat Perception.',
  'Steady Aim (Tasha\'s): BA advantage (can\'t move). Perfect for ranged Rogues.',
  'Expertise in 4+ skills. Best skill monkey in the game.',
  'Cunning Action Hide (BA) is your default for ranged advantage.',
];
