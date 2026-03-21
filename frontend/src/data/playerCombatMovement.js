/**
 * playerCombatMovement.js
 * Player Mode: Movement rules, speeds, and special movement in combat
 * Pure JS — no React dependencies.
 */

export const MOVEMENT_RULES = {
  splitting: 'You can split movement before and after your action. Example: move 15ft → attack → move 15ft.',
  standUp: 'Standing from prone costs HALF your movement speed.',
  dropping: 'Dropping prone is free (no movement cost).',
  crawling: 'While prone, every 1ft of movement costs 2ft (1 extra ft).',
  difficultTerrain: 'Every 1ft of movement in difficult terrain costs 2ft.',
  jumping: 'Long jump = STR score ft (running) or half (standing). High jump = 3 + STR mod ft.',
  squeezing: 'Moving through a space one size smaller costs double movement. Disadvantage on attacks/DEX saves.',
  grappled: 'Speed = 0. Must break free or be dragged.',
  dragging: 'You can drag a grappled creature. Your speed is halved.',
};

export const SPEED_SOURCES = [
  { source: 'Base Speed', typical: '30 ft', notes: 'Most Medium races. Wood Elf: 35ft. Dwarf: 25ft.' },
  { source: 'Dash Action', bonus: '+full speed', notes: 'Double your movement for the turn.' },
  { source: 'Dash Bonus Action', bonus: '+full speed', notes: 'Rogue Cunning Action, Monk Step of Wind, Expeditious Retreat.' },
  { source: 'Haste', bonus: '+full speed', notes: 'Doubles speed. Plus extra action (including Dash = triple speed).' },
  { source: 'Longstrider', bonus: '+10 ft', notes: '1 hour, no concentration. Ritual castable? No — but worth a slot.' },
  { source: 'Mobile Feat', bonus: '+10 ft', notes: 'Also: no OA from attacked creatures, ignore difficult terrain on Dash.' },
  { source: 'Barbarian Fast Movement', bonus: '+10 ft', notes: 'At 5th level. Not wearing heavy armor.' },
  { source: 'Monk Unarmored Movement', bonus: '+10 to +30 ft', notes: 'Scales with level. No armor or shield.' },
  { source: 'Boots of Speed', bonus: 'Double speed', notes: 'Bonus action. 10 minutes per day.' },
];

export const OPPORTUNITY_ATTACKS = {
  trigger: 'When a creature you can see leaves your reach (moves away).',
  cost: '1 reaction per round.',
  avoidance: [
    'Disengage action (or Cunning Action/Step of Wind)',
    'Teleportation (Misty Step, Thunder Step, etc.)',
    'Being moved against your will (shoved, Repelling Blast)',
    'Mobile feat (if you attacked the creature this turn)',
    'Flyby trait (owls, certain creatures)',
  ],
  note: 'Moving WITHIN a creature\'s reach does NOT provoke. Only leaving reach does.',
};

export const SPECIAL_MOVEMENT = [
  { type: 'Climbing', cost: '2ft per 1ft', notes: 'DC 10-25 Athletics to climb without a climb speed. Climb speed = normal cost.' },
  { type: 'Swimming', cost: '2ft per 1ft', notes: 'DC varies Athletics. Swim speed = normal cost. Combat underwater: disadvantage on most weapons.' },
  { type: 'Flying', cost: '1ft per 1ft', notes: 'If knocked prone while flying, you fall. Hover prevents falling from 0 speed.' },
  { type: 'Burrowing', cost: '1ft per 1ft', notes: 'Move through earth. Usually only creatures/spells grant this.' },
];

export function calculateMovement(baseSpeed, modifiers) {
  let speed = baseSpeed;
  let multiplier = 1;
  for (const mod of (modifiers || [])) {
    if (mod.type === 'add') speed += mod.value;
    if (mod.type === 'multiply') multiplier *= mod.value;
  }
  return Math.floor(speed * multiplier);
}

export function canReach(speed, distance, difficultTerrain) {
  const effectiveDistance = difficultTerrain ? distance * 2 : distance;
  return speed >= effectiveDistance;
}
