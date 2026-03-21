/**
 * playerConditionImmunities.js
 * Player Mode: Sources of condition immunity and prevention
 * Pure JS — no React dependencies.
 */

export const CONDITION_PREVENTION = [
  { condition: 'Charmed', sources: ['Fey Ancestry (Elf/Half-Elf): Advantage', 'Devotion Paladin Aura (7th): Immune within 10ft', 'Mind Blank (8th): Immune', 'Calm Emotions (2nd): Suppress'] },
  { condition: 'Frightened', sources: ['Brave (Halfling): Advantage', 'Berserker Rage: Immune while raging (6th)', 'Devotion Paladin Aura (7th): Immune', 'Heroes\' Feast: Immune 24h'] },
  { condition: 'Paralyzed', sources: ['Freedom of Movement (4th): Immune', 'Diamond Soul (Monk 14): Reroll saves'] },
  { condition: 'Petrified', sources: ['Freedom of Movement (4th): Immune to magical restraint'] },
  { condition: 'Poisoned', sources: ['Dwarven Resilience: Advantage + Resistance', 'Heroes\' Feast: Immune 24h', 'Purity of Body (Monk 10): Immune', 'Protection from Poison (2nd): Advantage + Neutralize one'] },
  { condition: 'Stunned', sources: ['Limited options — mostly good saves', 'Diamond Soul (Monk 14): Reroll saves'] },
  { condition: 'Prone', sources: ['Freedom of Movement (4th)', 'Spider Climb / Flying: Can\'t be knocked prone mid-air (but fall if flying is disrupted)'] },
  { condition: 'Blinded', sources: ['Blindsight/Tremorsense: Still detect creatures', 'Echolocation: See without sight'] },
  { condition: 'Exhaustion', sources: ['Heroes\' Feast: Immune 24h', 'Greater Restoration (5th): Remove 1 level', 'Diamond Soul (Monk 14): Reroll saves'] },
];

export const LESSER_RESTORATION_CURES = [
  'Blinded', 'Deafened', 'Paralyzed', 'Poisoned',
];

export const GREATER_RESTORATION_CURES = [
  'One level of exhaustion',
  'Charmed or Petrified',
  'One curse (including attunement curses)',
  'Any reduction to ability scores',
  'Any reduction to max HP',
];

export function getConditionPrevention(condition) {
  return CONDITION_PREVENTION.find(c => c.condition.toLowerCase() === (condition || '').toLowerCase()) || null;
}

export function canLesserRestorationCure(condition) {
  return LESSER_RESTORATION_CURES.some(c => c.toLowerCase() === (condition || '').toLowerCase());
}

export function canGreaterRestorationCure(condition) {
  return GREATER_RESTORATION_CURES.some(c => c.toLowerCase().includes((condition || '').toLowerCase()));
}
