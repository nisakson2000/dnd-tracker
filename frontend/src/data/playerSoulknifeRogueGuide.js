/**
 * playerSoulknifeRogueGuide.js
 * Player Mode: Soulknife Rogue — the psychic blade assassin
 * Pure JS — no React dependencies.
 */

export const SOULKNIFE_BASICS = {
  class: 'Rogue (Soulknife)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Psychic blades from will. Psi dice for skills/stealth. Telepathy. Best Rogue subclass in Tasha\'s.',
  note: 'Never needs a weapon. Psychic Blades are always available. Psi-Bolstered Knack makes you succeed at skills constantly.',
};

export const SOULKNIFE_FEATURES = [
  { feature: 'Psionic Power', level: 3, effect: 'Psi die starts at d6. Number of dice = 2× proficiency bonus. Die size increases at L5 (d8), L11 (d10), L17 (d12).', note: 'Resource pool for all Soulknife features. Recharges on long rest (one die on short rest if 0).' },
  { feature: 'Psi-Bolstered Knack', level: 3, effect: 'When you fail an ability check using a proficient skill/tool: add Psi die to roll (might turn fail into success). Only expended if check succeeds.', note: 'ONLY costs the die if it actually helps. Risk-free boost. Makes Expertise even more reliable.' },
  { feature: 'Psychic Whispers', level: 3, effect: 'Telepathic link with up to PB creatures for PB hours. Two-way telepathy, 1 mile range.', note: 'Party-wide telepathy for hours. Silent coordination. No spell slot. Incredible utility.' },
  { feature: 'Psychic Blades', level: 3, effect: 'Melee/thrown (60ft) attack: 1d6+DEX psychic damage (main hand). Bonus action: 1d4+DEX psychic offhand.', note: 'Always available. No weapon needed. Psychic damage (almost nothing resists). Finesse + thrown.' },
  { feature: 'Soul Blades', level: 9, effect: 'Homing Strikes: on miss, add Psi die to attack (expended only if hit). Psychic Teleportation: bonus action throw blade → teleport to spot (PB × 10ft).', note: 'Homing Strikes ensures Sneak Attack lands. Psychic Teleportation is free Misty Step.' },
  { feature: 'Psychic Veil', level: 13, effect: 'Action: invisible for 1 hour (or until you attack/force save). PB times/LR or 1 Psi die.', note: 'Free Greater Invisibility (without the attack clause). 1 hour. PB times. Incredible infiltration.' },
  { feature: 'Rend Mind', level: 17, effect: 'On Sneak Attack with Psychic Blades: target WIS save or stunned for 1 minute (save at end of turns). Once per LR or 3 Psi dice.', note: 'Stun on Sneak Attack. WIS save. Incredibly powerful at L17.' },
];

export const SOULKNIFE_TACTICS = [
  { tactic: 'Psychic Blades + Sneak Attack', detail: 'Psychic Blades deal psychic damage. SA adds dice. Total: 1d6+DEX+SA dice in psychic. Almost nothing resists psychic.', rating: 'S' },
  { tactic: 'Homing Strikes reliability', detail: 'Miss an attack? Add Psi die. Only expended if it turns into a hit. Ensures SA lands consistently.', rating: 'S' },
  { tactic: 'Psi-Bolstered Knack skill god', detail: 'Expertise + Psi die on fails. Rogues are already the best at skills. This makes it near-guaranteed.', rating: 'S' },
  { tactic: 'Psychic Whispers stealth coordination', detail: 'Telepathy with entire party. Plan ambushes. Coordinate in silence. No enemy can eavesdrop.', rating: 'A' },
  { tactic: 'Psychic Veil infiltration', detail: 'L13: go invisible for 1 hour. Walk past guards. Scout entire dungeon. No concentration.', rating: 'S' },
  { tactic: 'Bonus action blade', detail: 'Main hand: 1d6+DEX+SA. Bonus action offhand: 1d4+DEX (normally no mod for offhand, but Psychic Blades adds it). Two-weapon fighting without feat.', rating: 'A' },
];

export function psychicBladeDamage(dexMod, sneakAttackDice) {
  const mainHand = 3.5 + dexMod + sneakAttackDice * 3.5; // 1d6 + DEX + Xd6 SA
  const offHand = 2.5 + dexMod; // 1d4 + DEX
  return { mainHand, offHand, total: mainHand + offHand };
}

export function psiDieSize(rogueLevel) {
  if (rogueLevel >= 17) return 12;
  if (rogueLevel >= 11) return 10;
  if (rogueLevel >= 5) return 8;
  return 6;
}

export function psiDiceCount(proficiencyBonus) {
  return proficiencyBonus * 2;
}

export function psychicTeleportationRange(proficiencyBonus) {
  return proficiencyBonus * 10; // PB × 10ft
}
