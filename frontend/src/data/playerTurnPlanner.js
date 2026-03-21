/**
 * playerTurnPlanner.js
 * Player Mode: Pre-plan combat turns to speed up play
 * Pure JS — no React dependencies.
 */

export const TURN_TEMPLATE = {
  movement: { label: 'Movement', placeholder: 'Where are you moving?', icon: '👟' },
  action: { label: 'Action', placeholder: 'Attack, Cast, Dash, Dodge...', icon: '⚔️' },
  bonusAction: { label: 'Bonus Action', placeholder: 'If available...', icon: '⚡' },
  freeInteraction: { label: 'Free Object Interaction', placeholder: 'Draw weapon, open door...', icon: '🤚' },
  reaction: { label: 'Reaction Plan', placeholder: 'What triggers your reaction?', icon: '🛡️' },
};

export const QUICK_TURN_PRESETS = [
  { name: 'Full Attack', movement: 'Move to melee range', action: 'Attack (all attacks)', bonusAction: 'Bonus attack if TWF/PAM', freeInteraction: 'Draw weapon if needed', reaction: 'Opportunity Attack' },
  { name: 'Ranged Attack', movement: 'Stay at range / find cover', action: 'Attack with ranged weapon', bonusAction: 'Hunter\'s Mark / Hex if new target', freeInteraction: 'None', reaction: 'None / Shield if available' },
  { name: 'Cast & Move', movement: 'Move after casting', action: 'Cast a spell', bonusAction: 'Healing Word if ally down', freeInteraction: 'Draw focus', reaction: 'Counterspell / Shield' },
  { name: 'Defensive', movement: 'Move behind cover / ally', action: 'Dodge', bonusAction: 'Patient Defense (Monk) / Healing', freeInteraction: 'Sheathe weapon for shield', reaction: 'Shield / Absorb Elements' },
  { name: 'Support', movement: 'Move to ally', action: 'Help / Cast buff spell', bonusAction: 'Bardic Inspiration / Healing Word', freeInteraction: 'None', reaction: 'Shield if available' },
  { name: 'Retreat', movement: 'Full movement away from enemies', action: 'Disengage (or Dash if you can Cunning Action)', bonusAction: 'Cunning Action Disengage (Rogue) / Dash', freeInteraction: 'None', reaction: 'Shield / Absorb Elements' },
  { name: 'Grapple Control', movement: 'Move to target', action: 'Grapple + Shove prone', bonusAction: 'Attack if Extra Attack', freeInteraction: 'Free a hand', reaction: 'Opportunity Attack' },
];

export const TURN_SPEED_TIPS = [
  'Roll attack AND damage dice together.',
  'Decide your action BEFORE your turn starts.',
  'Know your spell save DC and attack bonus by heart.',
  'Pre-roll if the DM allows it.',
  'Have your spell description ready to read.',
  'Announce total, not the math ("I got 22 to hit" not "I rolled a 14 plus 5 plus 3").',
  'If unsure between two options, pick the simpler one.',
  'Track your own HP, spell slots, and resources.',
];

export function createTurnPlan() {
  return {
    movement: '',
    action: '',
    bonusAction: '',
    freeInteraction: '',
    reaction: '',
    notes: '',
    timestamp: Date.now(),
  };
}

export function getPreset(name) {
  return QUICK_TURN_PRESETS.find(p => p.name.toLowerCase() === (name || '').toLowerCase()) || null;
}
