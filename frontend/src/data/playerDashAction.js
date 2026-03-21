/**
 * playerDashAction.js
 * Player Mode: Dash action rules and movement calculation
 * Pure JS — no React dependencies.
 */

export const DASH_RULES = {
  action: 'Action (or Bonus Action with Cunning Action, Step of the Wind, etc.).',
  effect: 'Gain extra movement equal to your speed (after modifiers) for the current turn.',
  stacking: 'Dash can be used multiple times per turn if you have multiple action sources.',
  examples: [
    'Rogue: Action Dash + Cunning Action Dash = 3x speed.',
    'Haste: Action + Haste action + Bonus Dash = 4x speed.',
    'Monk: Action + Step of the Wind = 3x speed (4x with Mobile feat at some levels).',
    'Tabaxi + Dash: Feline Agility + Dash can cover massive distance in one turn.',
  ],
};

export const DASH_SOURCES = [
  { source: 'Action', type: 'action', classes: ['All'] },
  { source: 'Cunning Action', type: 'bonus_action', classes: ['Rogue'] },
  { source: 'Step of the Wind', type: 'bonus_action', classes: ['Monk'], cost: '1 ki point' },
  { source: 'Haste (action)', type: 'haste_action', classes: ['Any (if hasted)'] },
  { source: 'Boots of Speed', type: 'bonus_action', classes: ['Any (magic item)'] },
  { source: 'Expeditious Retreat', type: 'bonus_action', classes: ['Sorcerer', 'Warlock', 'Wizard'], cost: '1st level slot, concentration' },
  { source: 'Charger feat', type: 'special', classes: ['Any'], note: 'Dash action, then bonus action attack (+5 damage or shove)' },
];

export function calculateDashDistance(baseSpeed, dashCount = 1, hasHaste = false) {
  // Speed = base. Each Dash adds base. Haste doubles base speed.
  const effectiveBase = hasHaste ? baseSpeed * 2 : baseSpeed;
  return effectiveBase + (effectiveBase * dashCount);
}

export function getMaxOneRoundDistance(baseSpeed, className, hasHaste = false) {
  let dashSources = 1; // Action Dash
  if (['rogue', 'monk'].includes((className || '').toLowerCase())) dashSources = 2; // + bonus action dash
  if (hasHaste) dashSources += 1;
  return calculateDashDistance(baseSpeed, dashSources, hasHaste);
}
