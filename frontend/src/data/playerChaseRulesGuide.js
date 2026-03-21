/**
 * playerChaseRulesGuide.js
 * Player Mode: Chase sequence rules and tactics (DMG)
 * Pure JS — no React dependencies.
 */

export const CHASE_RULES = {
  source: 'DMG p.252-255',
  initiative: 'Roll initiative as normal at chase start.',
  movement: 'Use Dash action to move. Each creature can freely Dash a number of times = 3 + CON mod.',
  exhaustion: 'Each Dash beyond the free limit requires DC 10 CON save or gain 1 exhaustion.',
  distanceTracking: 'Track distance between pursuer and quarry. 30ft gap per round of speed difference.',
  complicationsTable: 'DMG has a d20 complications table for each round. Obstacles, crowds, dead ends.',
  ending: 'Chase ends when quarry escapes (enough distance), is caught, or gives up.',
};

export const CHASE_TACTICS = [
  { tactic: 'High speed wins', detail: 'Speed is everything in chases. Monks (bonus action Dash), Barbarians (Fast Movement), Rogues (Cunning Action Dash).', rating: 'S' },
  { tactic: 'Double Dash', detail: 'Action Dash + bonus action Dash (Rogue, Monk). Cover 90ft/round (30 base + 30 + 30). Most creatures only do 60ft.', rating: 'S' },
  { tactic: 'Longstrider spell', detail: '+10ft speed for 1 hour. No concentration. Cast before chase. 40ft speed + Dash = 80ft/round.', rating: 'A' },
  { tactic: 'Misty Step', detail: 'Bonus action teleport 30ft. Adds distance without Dashing. Doesn\'t cost CON saves.', rating: 'A' },
  { tactic: 'Dimension Door', detail: 'Teleport 500ft. Instantly win most chases. But costs a L4 slot.', rating: 'S' },
  { tactic: 'Hold Person/Web on quarry', detail: 'Paralyze or restrain the runner. Chase over. But requires line of sight and range.', rating: 'A' },
  { tactic: 'Fog Cloud/Darkness to escape', detail: 'Block line of sight. Pursuers can\'t see you. Might lose the trail.', rating: 'A' },
  { tactic: 'High CON', detail: 'Free Dashes = 3 + CON mod. With +5 CON: 8 free Dashes before exhaustion checks.', rating: 'A' },
  { tactic: 'Expeditious Retreat', detail: 'Bonus action Dash each turn for 10 minutes. No exhaustion. One L1 slot.', rating: 'A' },
];

export const SPEED_BY_CLASS = [
  { class: 'Monk', baseSpeed: '30 → 60ft at L18', dashSpeed: 'Bonus action Dash (Step of the Wind). 90ft/round.', rating: 'S' },
  { class: 'Barbarian', baseSpeed: '40ft at L5', dashSpeed: '80ft/round with Dash action.', rating: 'A' },
  { class: 'Rogue', baseSpeed: '30ft', dashSpeed: 'Cunning Action Dash (bonus action). 90ft/round.', rating: 'S' },
  { class: 'Ranger (Mobile/Longstrider)', baseSpeed: '40ft with Mobile', dashSpeed: '80ft/round.', rating: 'A' },
  { class: 'Wizard (Expeditious Retreat)', baseSpeed: '30ft', dashSpeed: '90ft/round with spell.', rating: 'A' },
  { class: 'Fighter (Action Surge)', baseSpeed: '30ft', dashSpeed: 'One turn: 90ft (Action Dash + Surge Dash).', rating: 'B (one burst)' },
];

export function chaseDashesBeforeExhaustion(conMod) {
  return 3 + Math.max(0, conMod);
}

export function roundsToClose(gapFeet, speedDifference) {
  if (speedDifference <= 0) return Infinity; // Can't close
  return Math.ceil(gapFeet / speedDifference);
}
