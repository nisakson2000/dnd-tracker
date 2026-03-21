/**
 * playerOpportunityAttackMasterGuide.js
 * Player Mode: Opportunity attacks — triggers, avoidance, optimization
 * Pure JS — no React dependencies.
 */

export const OA_BASICS = {
  trigger: 'Hostile creature moves OUT of your reach (voluntary movement only).',
  action: 'Reaction: one melee attack.',
  doesNotTrigger: ['Teleportation', 'Forced movement (push/pull)', 'Disengage action', 'Movement within reach'],
};

export const OA_ENHANCERS = [
  { feat: 'Sentinel', effect: 'Hit → speed 0. Works vs Disengage. React to ally attacks.', rating: 'S' },
  { feat: 'Polearm Master', effect: 'OA when enemy ENTERS reach (10ft weapons).', rating: 'S' },
  { feat: 'PAM + Sentinel', effect: 'Enter reach → OA → speed 0. Never reached.', rating: 'S' },
  { feat: 'War Caster', effect: 'Cast spell (Booming Blade, Hold Person) as OA.', rating: 'A' },
];

export const OA_AVOIDANCE = [
  { method: 'Disengage', cost: 'Action' },
  { method: 'Cunning Action (Rogue)', cost: 'Bonus Action' },
  { method: 'Misty Step', cost: 'BA + L2 slot' },
  { method: 'Mobile feat', cost: 'Feat (free after attacking)' },
  { method: 'Shocking Grasp', cost: 'Cantrip (removes reactions)' },
];

export const OA_TACTICS = [
  { tactic: 'PAM + Sentinel lockdown', detail: 'Enter 10ft → speed 0. Nothing reaches you.', rating: 'S' },
  { tactic: 'War Caster Booming Blade', detail: 'OA = Booming Blade. Extra damage if they keep moving.', rating: 'S' },
  { tactic: 'Chokepoint sentinel', detail: 'Stand in doorway. Nothing gets past.', rating: 'S' },
];

export function pamSentinelRange(weaponReach) {
  return weaponReach;
}
