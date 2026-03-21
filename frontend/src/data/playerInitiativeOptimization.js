/**
 * playerInitiativeOptimization.js
 * Player Mode: Maximizing initiative rolls, first-turn strategies, and turn order tactics
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_BASICS = {
  formula: 'd20 + DEX modifier + any bonuses',
  tieBreaker: 'RAW: Higher DEX wins. Some DMs use a roll-off.',
  surprise: 'Surprised creatures can\'t act on their first turn, but still roll initiative for order.',
  note: 'Going first is one of the most impactful advantages in combat.',
};

export const INITIATIVE_BOOSTERS = [
  { source: 'Alert feat', bonus: '+5', note: 'Also can\'t be surprised and hidden creatures don\'t gain advantage. Best initiative feat.', tier: 'S' },
  { source: 'High DEX', bonus: '+1 to +5', note: 'DEX 20 = +5. Most reliable source.', tier: 'A' },
  { source: 'Jack of All Trades (Bard)', bonus: '+1 to +3', note: 'Half proficiency to initiative (it\'s an ability check). Often forgotten!', tier: 'A' },
  { source: 'Remarkable Athlete (Champion)', bonus: '+1 to +3', note: 'Half proficiency to initiative. Similar to Jack of All Trades.', tier: 'A' },
  { source: 'War Wizard (War Magic)', bonus: '+2 to +5', note: 'Add INT modifier to initiative. INT 20 = +5 more.', tier: 'S' },
  { source: 'Swashbuckler (Rogue)', bonus: '+1 to +5', note: 'Add CHA modifier to initiative.', tier: 'A' },
  { source: 'Dread Ambusher (Gloom Stalker)', bonus: '+1 to +5', note: 'Add WIS modifier to initiative. Also extra attack/damage on first turn.', tier: 'S' },
  { source: 'Gift of Alacrity (Chronurgy)', bonus: '+1d8', note: 'Spell from Wildemount. Average +4.5. Lasts 8 hours.', tier: 'A' },
  { source: 'Weapon of Warning', bonus: 'Advantage', note: 'Advantage on initiative AND can\'t be surprised. Extremely good.', tier: 'S' },
  { source: 'Sentinel Shield', bonus: 'Advantage', note: 'Advantage on initiative AND Perception. Uncommon magic item.', tier: 'A' },
  { source: 'Harengon (race)', bonus: 'Add proficiency', note: 'Proficiency bonus to initiative. Stacks with everything.', tier: 'S' },
];

export const FIRST_TURN_PRIORITIES = {
  controller: {
    role: 'Battlefield Controller',
    priority: 'Cast your biggest control spell before enemies act.',
    examples: ['Hypnotic Pattern', 'Web', 'Entangle', 'Slow'],
    why: 'Removing enemies from the fight before they act is the highest-impact play.',
  },
  blaster: {
    role: 'Damage Dealer',
    priority: 'AoE while enemies are grouped. They spread out after round 1.',
    examples: ['Fireball', 'Lightning Bolt', 'Spirit Guardians'],
    why: 'Round 1 clustering maximizes AoE value.',
  },
  support: {
    role: 'Support/Buffer',
    priority: 'Bless or buff the party before they attack.',
    examples: ['Bless', 'Haste', 'Faerie Fire'],
    why: 'Buffs applied before allies act give maximum benefit.',
  },
  melee: {
    role: 'Melee DPS',
    priority: 'Close distance and engage the biggest threat.',
    examples: ['Dash to reach backline', 'Rage + Attack', 'Stunning Strike'],
    why: 'Pin down dangerous enemies before they can act.',
  },
  tank: {
    role: 'Tank/Defender',
    priority: 'Position between enemies and squishies. Establish threat.',
    examples: ['Compelled Duel', 'Sentinel positioning', 'Spirit Guardians'],
    why: 'Protect the party before enemies can target backline.',
  },
};

export const TURN_ORDER_TACTICS = [
  { tactic: 'Delay healing', detail: 'Healing before the injured player\'s turn wastes HP if they get hit again. Heal AFTER they take damage.', importance: 'High' },
  { tactic: 'Coordinate control + damage', detail: 'Controller goes first to disable, then DPS follows up on remaining threats.', importance: 'High' },
  { tactic: 'Ready action for combos', detail: 'Ready an attack for when an ally casts Hold Person. Paralyzed = auto-crit in melee.', importance: 'Medium' },
  { tactic: 'Count enemy turns', detail: 'If 3 enemies act before your healer, that\'s 3 rounds of potential damage with no healing.', importance: 'High' },
  { tactic: 'Protect low-initiative allies', detail: 'If the Wizard rolled low, enemies act before them. Tank should position to protect.', importance: 'Medium' },
];

export const GLOOM_STALKER_OPENER = {
  description: 'Gloom Stalker Ranger\'s Dread Ambusher gives an extra attack with +1d8 on the first turn.',
  combo: 'With Extra Attack: 3 attacks on turn 1 (1 extra from Dread Ambusher), one with +1d8.',
  withActionSurge: 'Gloom Stalker 5 / Fighter 2: 6 attacks on turn 1. Devastating nova.',
  withAssassinate: 'Gloom Stalker 3 / Assassin 3: Auto-crit on surprised targets + extra attack + extra damage. Nuclear.',
};

export function estimateInitiative(dexMod, bonuses) {
  const totalBonus = dexMod + bonuses.reduce((sum, b) => sum + b, 0);
  return {
    average: 10.5 + totalBonus,
    minimum: 1 + totalBonus,
    maximum: 20 + totalBonus,
    goFirstChance: Math.min(95, Math.max(5, 50 + totalBonus * 5)),
  };
}

export function getInitBoostersForClass(className) {
  const classSpecific = {
    Bard: ['Jack of All Trades (half proficiency to initiative)'],
    Fighter: ['Remarkable Athlete (Champion)', 'Action Surge for first-turn nova'],
    Wizard: ['War Magic (+INT to initiative)', 'Gift of Alacrity spell'],
    Rogue: ['Swashbuckler (+CHA to initiative)', 'Assassinate rewards going first'],
    Ranger: ['Dread Ambusher (+WIS to initiative, extra attack turn 1)'],
    Barbarian: ['Feral Instinct (advantage on initiative at level 7)'],
  };
  const universal = ['Alert feat (+5)', 'Weapon of Warning (advantage)', 'High DEX'];
  return [...(classSpecific[className] || []), ...universal];
}
