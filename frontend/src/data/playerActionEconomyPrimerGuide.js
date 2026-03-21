/**
 * playerActionEconomyPrimerGuide.js
 * Player Mode: Action economy — the most important combat concept
 * Pure JS — no React dependencies.
 */

export const ACTION_ECONOMY_BASICS = {
  concept: 'Each turn: 1 action + 1 BA + 1 reaction + movement + 1 free object interaction.',
  goldRule: 'More actions per round = victory. Never waste an action.',
};

export const MAXIMIZE_YOUR_ACTIONS = [
  { method: 'Spiritual Weapon + cantrip', detail: 'Two damage sources/turn. No concentration.', rating: 'S' },
  { method: 'Healing Word + attack', detail: 'Pick up ally (BA) + deal damage (action).', rating: 'S' },
  { method: 'Action Surge', detail: 'Two full actions. Fighter L2.', rating: 'S' },
  { method: 'Quickened Spell', detail: 'BA spell + action spell. Sorcerer.', rating: 'S' },
  { method: 'Cunning Action', detail: 'BA Dash/Disengage/Hide, keep action for attack. Rogue.', rating: 'S' },
];

export const DENY_ENEMY_ACTIONS = [
  { method: 'Kill enemies', effect: 'Dead = 0 actions.', rating: 'S' },
  { method: 'Stun/Incapacitate', effect: 'Skip their turn entirely.', rating: 'S' },
  { method: 'Banishment', effect: 'Remove from combat.', rating: 'S' },
  { method: 'Summons', effect: 'Add YOUR actions to the fight.', rating: 'A+' },
];

export const ACTION_ECONOMY_TIPS = [
  'Use your bonus action every turn if possible.',
  'Use your reaction — Shield, Counterspell, OA.',
  'BA spell limits your action to cantrips only.',
  'Split movement: move → attack → move back.',
  'Solo bosses die fast because 4 PCs have 16 "things" vs boss\'s 5.',
];
