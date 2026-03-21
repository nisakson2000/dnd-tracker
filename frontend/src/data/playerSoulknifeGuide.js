/**
 * playerSoulknifeGuide.js
 * Player Mode: Soulknife Rogue subclass optimization
 * Pure JS — no React dependencies.
 */

export const SOULKNIFE_BASICS = {
  class: 'Rogue (Soulknife)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Psychic warrior who creates blades of mental energy. Telepathic spy.',
  note: 'One of the most versatile Rogue subclasses. Psychic blades + telepathy + psi dice.',
};

export const SOULKNIFE_FEATURES = [
  { feature: 'Psionic Power', level: 3, effect: 'Psi dice pool = 2× PB. Die size: d6 (d8 at 5, d10 at 11, d12 at 17). Regain 1 die on short rest.', note: 'Psi dice fuel all your subclass abilities. Versatile resource.' },
  { feature: 'Psychic Blades', level: 3, effect: 'Summon psychic blade as part of attack. 1d6 psychic. Finesse, thrown 60ft. Bonus action: second blade (1d4).', note: 'No physical weapon needed. Always armed. Can\'t be disarmed. Psychic damage bypasses most resistances.' },
  { feature: 'Psi-Bolstered Knack', level: 3, effect: 'When you fail a skill check you\'re proficient in, spend Psi die to add it to the roll. If still fails, die isn\'t expended.', note: 'Free retry on failed skill checks. Only costs a die if it works. Incredible for skill monkey.' },
  { feature: 'Psychic Whispers', level: 3, effect: 'Telepathy with PB creatures for hours = PB. Range: 1 mile.', note: 'Silent party communication. 1 mile range. Lasts hours.' },
  { feature: 'Soul Blades', level: 9, effect: 'Homing Strikes: spend Psi die to add to miss attack roll. Psychic Teleportation: throw blade, teleport to it (range = 10× Psi die roll × ft).', note: 'Turn misses to hits + free teleportation. Two incredible abilities.' },
  { feature: 'Psychic Veil', level: 13, effect: 'Invisible for 1 hour (or until you deal damage/force a save). 1/long rest or 1 Psi die.', note: 'Free hour-long invisibility. Perfect scouting/infiltration.' },
  { feature: 'Rend Mind', level: 17, effect: 'On Sneak Attack hit: target makes WIS save (DC 8 + DEX + PB) or stunned for 1 minute.', note: 'Stunning Strike but for Rogues. On Sneak Attack. WIS save. Devastating.' },
];

export const PSYCHIC_BLADE_ANALYSIS = {
  advantages: [
    'Psychic damage type: almost nothing resists it.',
    'Always armed: can\'t be disarmed. No weapon to take away.',
    'No ammunition: unlimited thrown attacks at 60ft.',
    'Bonus action attack: 1d4 psychic. Better than TWF (no fighting style needed).',
    'Works with Sneak Attack (finesse property).',
  ],
  disadvantages: [
    'Can\'t be enchanted (+1/+2/+3 doesn\'t apply).',
    'Doesn\'t benefit from magic weapon buffs.',
    'No interaction with Booming Blade/Green-Flame Blade (not a weapon attack with a melee weapon you hold).',
  ],
  verdict: 'The weapon summoning is incredible utility. Magic weapon limitation hurts at high levels.',
};

export const SOULKNIFE_TACTICS = [
  { tactic: 'Stealth + Psychic Whispers', detail: 'Invisible scout with telepathic communication. Report back in real-time.', rating: 'S' },
  { tactic: 'Homing Strikes (L9)', detail: 'Miss Sneak Attack? Add Psi die. Turn miss into hit. Psi die only spent if it works.', rating: 'S' },
  { tactic: 'Psychic Teleportation', detail: 'Throw blade, teleport to it. 10-120ft teleportation. Escape or reposition instantly.', rating: 'A' },
  { tactic: 'Psi-Bolstered skill checks', detail: 'Expertise + Reliable Talent + Psi-Bolstered Knack = can\'t fail skill checks ever.', rating: 'S' },
  { tactic: 'Two attacks per turn', detail: 'Main attack (1d6 psychic) + bonus action (1d4 psychic). 2 chances for Sneak Attack.', rating: 'A' },
];

export function psiDicePool(profBonus) {
  return profBonus * 2;
}

export function psiDieSize(rogueLevel) {
  if (rogueLevel >= 17) return 12;
  if (rogueLevel >= 11) return 10;
  if (rogueLevel >= 5) return 8;
  return 6;
}

export function psychicTeleportRange(psiDieMax) {
  return psiDieMax * 10; // ft, max range
}
