/**
 * playerWhispersBardGuide.js
 * Player Mode: College of Whispers Bard — the sinister infiltrator
 * Pure JS — no React dependencies.
 */

export const WHISPERS_BASICS = {
  class: 'Bard (College of Whispers)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Spy, assassin, manipulator. Psychic damage and identity theft.',
  note: 'Most feared Bard subclass. Psychic Blades for burst damage. Shadow Lore for permanent domination. Identity theft is terrifying.',
};

export const WHISPERS_FEATURES = [
  { feature: 'Psychic Blades', level: 3, effect: 'When you hit with a weapon attack, spend Bardic Inspiration die: deal extra psychic damage. Scales with Inspiration die size.', note: '2d6/3d8/3d10/3d12 extra psychic damage. Uses Inspiration die. One-time burst.' },
  { feature: 'Words of Terror', level: 3, effect: '1 minute conversation: target makes WIS save or is frightened of a creature you choose for 1 hour. Doesn\'t know you caused it.', note: 'Make someone afraid of their ally. Start fights between NPCs. Social weapon.' },
  { feature: 'Mantle of Whispers', level: 6, effect: 'When a humanoid dies within 30ft, capture their shadow (reaction). Spend shadow: disguise as them for 1 hour. Gain surface memories, mannerisms, voice.', note: 'IDENTITY THEFT. Become the dead person. Know enough to fool their allies. Gain their surface thoughts.' },
  { feature: 'Shadow Lore', level: 14, effect: 'Action: target creature, WIS save. Failure: charmed for 8 hours. Obeys you. Believes you know its deepest secret. Once/long rest.', note: '8-hour charm with obedience. Target thinks you have blackmail material. No concentration.' },
];

export const WHISPERS_TACTICS = [
  { tactic: 'Psychic Blades burst', detail: 'Attack + Psychic Blades. At L5 with rapier: 1d8+DEX + 3d6 psychic. At L15: 1d8+DEX + 3d10 psychic.', rating: 'A', note: 'Good burst but uses Inspiration die. Weigh burst vs giving Inspiration to allies.' },
  { tactic: 'Kill and replace', detail: 'Enemy dies within 30ft → capture shadow → become them. Walk into enemy camp. Gather intel. Sabotage.', rating: 'S', note: 'Kill a guard, become the guard. Surface memories = know passwords, schedules, names.' },
  { tactic: 'Words of Terror + combat', detail: 'Before combat: make enemy leader frightened of their own bodyguard. Combat starts: chaos.', rating: 'A' },
  { tactic: 'Shadow Lore domination', detail: 'L14: 8-hour charm. Target obeys you. Use on political figures, enemy commanders, merchants.', rating: 'S', note: 'No concentration. 8 hours. They willingly follow orders.' },
  { tactic: 'Social infiltration chain', detail: 'Words of Terror → chaos. Kill a target in the confusion → Mantle of Whispers → become them. Full social takeover.', rating: 'S' },
];

export const PSYCHIC_BLADES_SCALING = [
  { bardLevel: 3, dieDamage: '2d6', average: 7 },
  { bardLevel: 5, dieDamage: '3d6', average: 10.5 },
  { bardLevel: 10, dieDamage: '3d8', average: 13.5 },
  { bardLevel: 15, dieDamage: '3d10', average: 16.5 },
];

export const WHISPERS_VS_LORE = {
  whispers: { pros: ['Psychic burst damage', 'Identity theft (Mantle)', 'Social domination (Shadow Lore)', 'Best spy Bard'], cons: ['Uses Inspiration for damage (not support)', 'Features require kills/social setup', 'Less combat support'] },
  lore: { pros: ['Cutting Words (better support)', 'Magical Secrets at L6 (early)', 'More versatile', 'Better in a party'], cons: ['No burst damage', 'No infiltration features', 'Less individually powerful'] },
  verdict: 'Whispers for intrigue campaigns. Lore for combat support. Whispers is DM-dependent.',
};

export function psychicBladesDamage(bardLevel) {
  if (bardLevel >= 15) return 3 * 5.5; // 3d10
  if (bardLevel >= 10) return 3 * 4.5; // 3d8
  if (bardLevel >= 5) return 3 * 3.5; // 3d6
  return 2 * 3.5; // 2d6
}

export function mantleDuration() {
  return 60; // 1 hour in minutes
}
