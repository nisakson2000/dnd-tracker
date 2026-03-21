/**
 * playerReadiedActionGuide.js
 * Player Mode: Ready action rules, best triggers, and common uses
 * Pure JS — no React dependencies.
 */

export const READY_ACTION_RULES = {
  cost: 'Uses your action. You set a trigger and a response.',
  reaction: 'When the trigger occurs, you use your REACTION to take the readied action.',
  spells: 'You can ready a spell, but you MUST concentrate on it AND the slot is expended even if the trigger never happens.',
  movement: 'You can ready movement (up to your speed) as a response.',
  trigger: 'Must be a perceivable circumstance. "When the door opens" or "When the enemy steps out of cover."',
  limitations: 'Only ONE readied action. Uses your reaction. Can choose not to trigger when conditions are met.',
};

export const BEST_READY_TRIGGERS = [
  { trigger: 'Enemy enters my reach', response: 'Attack', use: 'Get attacks against approaching enemies. Like an Opportunity Attack but on YOUR terms.' },
  { trigger: 'Enemy comes out of cover', response: 'Ranged attack', use: 'Snipe enemies who keep ducking behind walls.' },
  { trigger: 'Ally attacks the target', response: 'Attack', use: 'Coordinate focus fire. Especially good for Rogues (Sneak Attack outside your turn!).' },
  { trigger: 'Enemy starts casting a spell', response: 'Attack/Shove', use: 'Disrupt concentration or break their spell with damage.' },
  { trigger: 'Door opens / enemy appears', response: 'Cast spell / Attack', use: 'Ambush preparation. Set up before the fight starts.' },
  { trigger: 'Ally moves out of the way', response: 'Cast AoE spell', use: 'Let your ally Disengage, then Fireball the remaining enemies.' },
  { trigger: 'Enemy tries to flee', response: 'Attack / Grapple', use: 'Prevent escapes. Better than OA because you choose the trigger.' },
];

export const ROGUE_READY_TRICK = {
  name: 'Off-Turn Sneak Attack',
  description: 'Ready your attack for an ally\'s turn. Sneak Attack is 1/TURN, not 1/round.',
  setup: 'Ready action: "I attack when [ally] attacks the same target."',
  result: 'Get Sneak Attack on YOUR turn AND on the readied action = 2× Sneak Attack per round.',
  note: 'Uses your reaction, so no Uncanny Dodge that round. Risk/reward.',
};

export function getReadyActionAdvice(situation) {
  return BEST_READY_TRIGGERS.find(t =>
    t.trigger.toLowerCase().includes((situation || '').toLowerCase()) ||
    t.use.toLowerCase().includes((situation || '').toLowerCase())
  ) || null;
}
