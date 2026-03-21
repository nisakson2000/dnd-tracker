/**
 * playerForcedMovementComboGuide.js
 * Player Mode: Forced movement combos — push, pull, and slide for maximum damage
 * Pure JS — no React dependencies.
 */

export const FORCED_MOVEMENT_TYPES = [
  { type: 'Push', sources: ['Repelling Blast', 'Thunderwave', 'Shield Master shove', 'Telekinetic', 'Graviturgy spells'], note: 'Move creature away from you.' },
  { type: 'Pull', sources: ['Grasp of Hadar', 'Thorn Whip', 'Lightning Lure'], note: 'Move creature toward you.' },
  { type: 'Shove (prone)', sources: ['Athletics check', 'Shield Master BA', 'Trip Attack'], note: 'Knock prone. Melee advantage, ranged disadvantage.' },
  { type: 'Shove (push 5ft)', sources: ['Athletics check', 'Shield Master BA'], note: 'Push creature 5ft. Into hazards.' },
  { type: 'Slide/Move', sources: ['Command "approach/flee"', 'Dissonant Whispers', 'Fear spell', 'Turn Undead'], note: 'Force movement using the creature\'s reaction/movement.' },
];

export const HAZARD_COMBOS = [
  {
    combo: 'Repelling Blast + Spike Growth',
    damage: '2d4 per 5ft moved through Spike Growth',
    calculation: '4 beams × 10ft push = 40ft through thorns = 16d4 (40 avg) + 4×(1d10+5) EB = 82 avg at L17',
    rating: 'S++',
    note: 'Best forced movement combo in the game. Warlock + Druid/Ranger.',
  },
  {
    combo: 'Repelling Blast + Wall of Fire',
    damage: '5d8 fire when pushed through wall',
    calculation: 'Push creature through wall. 5d8 = 22.5 avg per pass.',
    rating: 'S+',
    note: 'Wall of Fire + Repelling Blast each round. Devastating with multiple beams.',
  },
  {
    combo: 'Repelling Blast + Moonbeam',
    damage: '2d10 radiant when entering/starting in beam',
    calculation: 'Push enemy into Moonbeam. They take damage on entry.',
    rating: 'A+',
    note: 'Moonbeam triggers on entry AND start of turn. Double damage potential.',
  },
  {
    combo: 'Thorn Whip + Spike Growth',
    damage: '2d4 per 5ft pulled through',
    calculation: 'Pull 10ft through = 4d4 + 1d6 Thorn Whip = 14 avg per round',
    rating: 'A+',
    note: 'Druid solo combo. No invocations needed. Thorn Whip is a cantrip.',
  },
  {
    combo: 'Dissonant Whispers + Booming Blade/Sentinel',
    damage: 'Movement triggers Booming Blade OR Sentinel OA',
    calculation: 'DW forces movement → provokes OAs. Booming Blade extra 2d8+ on movement.',
    rating: 'S',
    note: 'Forced movement provokes OAs! DW + Sentinel = free attack + speed 0.',
  },
  {
    combo: 'Shove prone + Grapple',
    damage: 'No extra damage, but permanent advantage + enemy can\'t stand',
    calculation: 'Grappled + Prone = speed 0 = can\'t stand up. Advantage on all melee attacks.',
    rating: 'S',
    note: 'Requires free hand + Athletics. See Grapple/Shove guide for details.',
  },
  {
    combo: 'Telekinetic + Spike Growth/hazard',
    damage: 'BA push 5ft through hazard',
    calculation: 'Telekinetic BA push = 5ft = 2d4 through Spike Growth. Free extra damage.',
    rating: 'A+',
    note: 'Half-feat. BA push. No save if willing (ally), STR save if unwilling.',
  },
  {
    combo: 'Push off cliff/ledge',
    damage: '1d6 per 10ft fallen',
    calculation: 'Push 10ft over edge → falling damage. 50ft fall = 5d6 (17.5 avg).',
    rating: 'S (situational)',
    note: 'Environment-dependent but potentially instant kill. Repelling Blast = 40ft push.',
  },
  {
    combo: 'Thunderwave + hazard',
    damage: 'Push 10ft + 2d8 thunder',
    calculation: 'Push enemies into walls (extra damage at DM discretion) or into hazards.',
    rating: 'A',
    note: 'STR save. AoE push. Good in tight spaces.',
  },
];

export const FORCED_MOVEMENT_RULES = [
  'Forced movement does NOT provoke opportunity attacks (usually). Moving on your OWN turn provokes.',
  'Exception: Dissonant Whispers forces the creature to use its REACTION to move. This DOES provoke OAs.',
  'Command "flee" and Fear spell: creature uses its MOVEMENT to flee. This DOES provoke OAs.',
  'Shoved prone: creature must spend half movement to stand. If grappled (speed 0), can\'t stand.',
  'Push through Spike Growth: 2d4 per 5ft moved through. No save on the movement damage.',
  'Forced movement into Wall of Fire: creature takes damage immediately upon entering.',
  'You can push creatures off cliffs, into lava, into pits, into traps.',
  'Forced movement is measured from where the creature is, not where you are.',
];

export const FORCED_MOVEMENT_TIPS = [
  'Spike Growth + any push/pull = the most efficient damage combo in 5e.',
  'Repelling Blast pushes per beam. 4 beams = 40ft total push at L17.',
  'Dissonant Whispers is unique: it uses the creature\'s REACTION to move, provoking OAs.',
  'Coordinate with your party. Druid casts Spike Growth, Warlock pushes enemies through.',
  'Thorn Whip (Druid cantrip) pulls 10ft on hit. Combine with Spike Growth for free combo.',
  'Telekinetic feat: BA push 5ft. No save if ally (repositioning). STR save if enemy.',
  'Graviturgy Wizard: move creatures with Gravity Well feature. Built for this.',
  'Push creatures into each other or into walls for creative DM-ruled effects.',
  'Prone creatures in Spike Growth can\'t stand without moving through it = more damage.',
];
