/**
 * playerCombatDashboard.js
 * Player Mode: Combat dashboard layout and data aggregation
 * Pure JS — no React dependencies.
 */

export const DASHBOARD_SECTIONS = [
  { section: 'HP Bar', fields: ['currentHP', 'maxHP', 'tempHP', 'hpPercentage'], position: 'top-center', priority: 1, description: 'Current HP with visual bar. Color-coded by percentage.' },
  { section: 'Active Effects', fields: ['buffs', 'debuffs', 'concentration', 'durations'], position: 'top-right', priority: 2, description: 'All active spell effects and conditions with remaining rounds.' },
  { section: 'Action Panel', fields: ['action', 'bonusAction', 'reaction', 'movement', 'freeInteraction'], position: 'center', priority: 1, description: 'What you can still do this turn. Check off as used.' },
  { section: 'Resources', fields: ['spellSlots', 'classAbilities', 'hitDice', 'consumables'], position: 'left', priority: 2, description: 'Remaining class resources and items.' },
  { section: 'Initiative Order', fields: ['turnOrder', 'currentTurn', 'nextUp'], position: 'right', priority: 3, description: 'Who\'s acting now and who\'s next.' },
  { section: 'Target Info', fields: ['targetName', 'targetConditions', 'targetAC'], position: 'bottom-center', priority: 2, description: 'Information about your current target.' },
  { section: 'Quick Reference', fields: ['attackBonus', 'spellSaveDC', 'AC', 'speed', 'proficiencyBonus'], position: 'bottom-left', priority: 1, description: 'Key numbers you reference constantly.' },
  { section: 'Combat Log', fields: ['recentActions', 'damageDealt', 'damageTaken'], position: 'bottom-right', priority: 3, description: 'Scrolling log of recent combat events.' },
];

export const HP_THRESHOLDS = [
  { percentage: 100, color: '#4caf50', label: 'Full', urgency: 'none' },
  { percentage: 75, color: '#8bc34a', label: 'Healthy', urgency: 'low' },
  { percentage: 50, color: '#ff9800', label: 'Bloodied', urgency: 'medium' },
  { percentage: 25, color: '#f44336', label: 'Critical', urgency: 'high' },
  { percentage: 10, color: '#9c27b0', label: 'Near Death', urgency: 'critical' },
  { percentage: 0, color: '#212121', label: 'Down', urgency: 'maximum' },
];

export const TURN_ACTIONS = {
  action: { label: 'Action', used: false, options: ['Attack', 'Cast a Spell', 'Dash', 'Disengage', 'Dodge', 'Help', 'Hide', 'Ready', 'Search', 'Use an Object'] },
  bonusAction: { label: 'Bonus Action', used: false, options: ['Class feature', 'Offhand Attack', 'Healing Word', 'Misty Step', 'Spiritual Weapon'] },
  reaction: { label: 'Reaction', used: false, options: ['Opportunity Attack', 'Shield', 'Counterspell', 'Absorb Elements', 'Hellish Rebuke'] },
  movement: { label: 'Movement', used: 0, max: 30, unit: 'ft' },
  freeInteraction: { label: 'Free Object Interaction', used: false, options: ['Draw/sheathe weapon', 'Open door', 'Pick up item', 'Hand off item'] },
};

export const QUICK_REF_FIELDS = [
  { field: 'AC', label: 'Armor Class', icon: '🛡️' },
  { field: 'attackBonus', label: 'Attack Bonus', icon: '⚔️' },
  { field: 'spellSaveDC', label: 'Spell Save DC', icon: '✨' },
  { field: 'speed', label: 'Speed', icon: '👟' },
  { field: 'proficiency', label: 'Proficiency', icon: '📊' },
  { field: 'passivePerception', label: 'Passive Perception', icon: '👁️' },
];

export function getHPThreshold(currentHP, maxHP) {
  const percentage = maxHP > 0 ? (currentHP / maxHP) * 100 : 0;
  return HP_THRESHOLDS.find(t => percentage >= t.percentage) || HP_THRESHOLDS[HP_THRESHOLDS.length - 1];
}

export function createTurnState() {
  return JSON.parse(JSON.stringify(TURN_ACTIONS));
}

export function resetTurn(turnState) {
  const fresh = createTurnState();
  Object.assign(turnState, fresh);
  return turnState;
}

export function useAction(turnState, actionType) {
  if (turnState[actionType]) {
    if (typeof turnState[actionType].used === 'boolean') {
      turnState[actionType].used = true;
    }
  }
  return turnState;
}
