/**
 * playerMovementTactics.js
 * Player Mode: Tactical movement, positioning, and speed optimization in combat
 * Pure JS — no React dependencies.
 */

export const MOVEMENT_BASICS = {
  pool: 'Movement is a pool of feet you can spend during your turn. Not one continuous move.',
  split: 'You can split movement: move 10ft → attack → move 20ft. Freely interleave with actions.',
  speed: 'Most races: 30ft. Dwarves/Halflings/Gnomes: 25ft. Wood Elves: 35ft.',
  diagonal: 'Optional rule: Every other diagonal costs 10ft instead of 5ft. Ask your DM.',
  standing: 'Standing from prone costs HALF your speed (not half remaining movement).',
  dropping: 'Dropping prone is free. No cost. Useful to avoid ranged attacks.',
};

export const SPEED_BOOSTERS = [
  { source: 'Dash action', bonus: 'Double speed for the turn', note: 'Uses your action. Rogues can Dash as bonus action (Cunning Action).' },
  { source: 'Longstrider spell', bonus: '+10ft', note: '1 hour, no concentration. Cast before combat. Ritual if you have the time.' },
  { source: 'Expeditious Retreat', bonus: 'Dash as bonus action each turn', note: 'Concentration. Good for chase scenes or kiting.' },
  { source: 'Mobile feat', bonus: '+10ft', note: 'Also: no OA from creatures you attack (hit or miss). Excellent for skirmishers.' },
  { source: 'Haste spell', bonus: '+Double speed', note: 'Plus extra action, +2 AC, advantage on DEX saves. But lose a turn when it ends.' },
  { source: 'Monk Unarmored Movement', bonus: '+10 to +30ft', note: 'Scales with level. Level 2: +10ft, Level 18: +30ft.' },
  { source: 'Barbarian Fast Movement', bonus: '+10ft', note: 'Level 5+. Only while not wearing heavy armor.' },
  { source: 'Boots of Speed', bonus: 'Double speed', note: 'Bonus action to activate. 10 minutes. Disadvantage on OAs against you.' },
  { source: 'Elk Totem (Barbarian)', bonus: '+15ft while raging', note: 'Stacks with Fast Movement for +25ft total.' },
  { source: 'Wood Elf base', bonus: '35ft base', note: '5ft more than standard. Small but compounding with multipliers.' },
];

export const POSITIONING_TACTICS = [
  { tactic: 'Kiting', detail: 'Attack → move away. Melee enemies waste their turn Dashing to reach you.', bestFor: 'Ranged attackers, Monks, Mobile feat users' },
  { tactic: 'Backline diving', detail: 'Dash past frontline to attack enemy casters/archers. Disrupt their concentration.', bestFor: 'Rogues, Monks, high-speed characters' },
  { tactic: 'Chokepoint holding', detail: 'Stand in a doorway or narrow passage. Only 1-2 enemies can reach you.', bestFor: 'Tanks, Sentinel users, Spirit Guardians' },
  { tactic: 'Hit-and-run', detail: 'Mobile feat: attack → move away without OA. Repeat each turn.', bestFor: 'Monks, Rogues, light fighters' },
  { tactic: 'Zone control', detail: 'Sentinel + Polearm Master = OA when enemies enter your 10ft reach. Stops them dead.', bestFor: 'Fighters, Paladins with PAM+Sentinel' },
  { tactic: 'Spell range optimization', detail: 'Stay at maximum spell range. 120ft for most damage spells. Out of melee entirely.', bestFor: 'Casters without heavy armor' },
  { tactic: 'Cover hopping', detail: 'Move between cover points. Attack → move behind full cover. Enemies can\'t target you.', bestFor: 'Ranged characters, Light crossbow users' },
  { tactic: 'Ally clustering for buffs', detail: 'Stay within Bless/Aura range. Paladin aura is 10ft — stay close.', bestFor: 'Anyone near a Paladin or buffer' },
];

export const DIFFICULT_TERRAIN_TIPS = [
  'Difficult terrain costs DOUBLE movement. 5ft of difficult terrain = 10ft of speed.',
  'Dash in difficult terrain: if you have 30ft speed, Dash gives 60ft, but in difficult terrain that\'s only 30ft of actual distance.',
  'Some features ignore difficult terrain: Land\'s Stride (Ranger/Druid), Freedom of Movement spell.',
  'You can CREATE difficult terrain: Grease, Web, Spike Growth, Plant Growth.',
  'Flying creatures ignore ground-based difficult terrain.',
  'Jumping over difficult terrain works if you can clear it entirely.',
];

export const OPPORTUNITY_ATTACK_AVOIDANCE = [
  { method: 'Disengage action', cost: 'Action', note: 'No OAs for rest of turn. Rogues do this as bonus action.' },
  { method: 'Mobile feat', cost: 'Feat', note: 'No OA from any creature you attack (hit or miss) this turn.' },
  { method: 'Flyby (creatures)', cost: 'Feature', note: 'Some creatures (owls, etc.) don\'t provoke OAs.' },
  { method: 'Teleportation', cost: 'Spell/feature', note: 'Misty Step, Thunder Step, Fey Step. Teleporting doesn\'t provoke OAs.' },
  { method: 'Forced movement', cost: 'Varies', note: 'Pushing/pulling enemies away from you (Repelling Blast, Thunderwave) doesn\'t provoke OAs.' },
  { method: 'Swashbuckler Fancy Footwork', cost: 'Feature', note: 'No OA from any creature you attacked this turn (melee).' },
];

export const CHASE_MOVEMENT = {
  rules: 'Dash freely for 3 + CON modifier rounds. After that, DC 10 CON save each round or gain exhaustion.',
  tips: [
    'High CON characters can chase/flee longer.',
    'Monks and Rogues with bonus action Dash are chase kings.',
    'Longstrider and Expeditious Retreat help in extended chases.',
    'Mounted characters have a huge advantage in chases.',
    'Dimension Door or Teleport ends most chases instantly.',
  ],
};

export function effectiveSpeed(baseSpeed, modifiers) {
  let speed = baseSpeed;
  let multiplier = 1;

  for (const mod of modifiers) {
    if (mod.type === 'flat') speed += mod.value;
    if (mod.type === 'multiply') multiplier *= mod.value;
  }

  return Math.floor(speed * multiplier);
}

export function movementInDifficultTerrain(speed, difficultTerrainFeet, ignoresDifficult) {
  if (ignoresDifficult) return speed;
  const normalFeet = speed - difficultTerrainFeet * 2;
  return Math.max(0, normalFeet + difficultTerrainFeet);
}

export function canReachTarget(speed, distance, isDifficultTerrain, canDash) {
  const effectiveMove = isDifficultTerrain ? speed / 2 : speed;
  const totalMove = canDash ? effectiveMove * 2 : effectiveMove;
  return { canReach: totalMove >= distance, remaining: totalMove - distance };
}
