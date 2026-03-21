/**
 * playerFallDamageJumpingGuide.js
 * Player Mode: Falling, jumping, and vertical movement rules
 * Pure JS — no React dependencies.
 */

export const FALL_DAMAGE_RULES = {
  basic: '1d6 bludgeoning per 10 feet fallen.',
  maximum: '20d6 (200 feet). Terminal velocity cap.',
  average: '70 damage at max (20d6). Enough to kill most characters below L10.',
  landing: 'Fall prone unless you avoid taking damage from the fall.',
  instant: 'RAW: falling happens instantly. No reactions during a fall (debated).',
  note: 'Xanathar\'s optional: fall 500ft/round. Could allow reactions on very long falls.',
};

export const FALL_DAMAGE_TABLE = [
  { feet: 10, dice: '1d6', avg: 3.5 },
  { feet: 20, dice: '2d6', avg: 7 },
  { feet: 30, dice: '3d6', avg: 10.5 },
  { feet: 40, dice: '4d6', avg: 14 },
  { feet: 50, dice: '5d6', avg: 17.5 },
  { feet: 60, dice: '6d6', avg: 21 },
  { feet: 80, dice: '8d6', avg: 28 },
  { feet: 100, dice: '10d6', avg: 35 },
  { feet: 150, dice: '15d6', avg: 52.5 },
  { feet: 200, dice: '20d6', avg: 70, note: 'Maximum' },
];

export const FALL_DAMAGE_MITIGATION = [
  { method: 'Feather Fall', type: 'Spell (L1)', effect: 'Reduce fall speed. Take 0 fall damage. Reaction.', rating: 'S+' },
  { method: 'Monk Slow Fall', type: 'Class (L4)', effect: 'Reduce fall damage by 5 × Monk level. Reaction.', rating: 'S' },
  { method: 'Fly / Levitate', type: 'Spell', effect: 'Don\'t fall in the first place. Concentration.', rating: 'S' },
  { method: 'Wild Shape', type: 'Class', effect: 'Transform into bird mid-fall. Uses reaction (DM dependent).', rating: 'A+' },
  { method: 'Rage', type: 'Class', effect: 'Resistance to bludgeoning = half fall damage while raging.', rating: 'A' },
  { method: 'Misty Step', type: 'Spell (L2)', effect: 'Teleport to safe ledge. BA. Requires seeing a safe spot.', rating: 'A' },
  { method: 'Ring of Feather Falling', type: 'Magic Item', effect: 'Permanent Feather Fall. No action needed. Always on.', rating: 'S+' },
];

export const JUMPING_RULES = {
  longJump: {
    running: 'Jump distance = STR score in feet (with 10ft running start).',
    standing: 'Half distance (STR score ÷ 2).',
    example: 'STR 16 = 16 feet long jump (running), 8 feet (standing).',
  },
  highJump: {
    running: 'Jump height = 3 + STR modifier feet (with 10ft running start).',
    standing: 'Half height.',
    reaching: 'Reach up = jump height + 1.5 × character height.',
    example: 'STR 16 (+3) = 6 feet high (running). 6ft tall character reaches 15ft total.',
  },
  movement: 'Jumping costs movement. Can\'t jump farther than your remaining movement allows.',
  athletics: 'DC 10 Athletics to clear low obstacles during a jump. Higher DC for difficult jumps.',
};

export const JUMP_ENHANCERS = [
  { method: 'Jump spell', effect: 'Triple jump distance. 1 minute.', rating: 'A+' },
  { method: 'Boots of Striding and Springing', effect: 'Triple jump distance.', rating: 'A+' },
  { method: 'Step of the Wind (Monk)', effect: 'Double jump distance (Dash as BA).', rating: 'A' },
  { method: 'Thief\'s Fast Hands + Dash', effect: 'BA Dash = more movement for longer jumps.', rating: 'A' },
  { method: 'Ring of Jumping', effect: 'Cast Jump on self at will.', rating: 'A+' },
  { method: 'Enhance Ability (Cat\'s Grace)', effect: 'No damage from falls ≤ 20ft. Not more distance.', rating: 'B+' },
  { method: 'Athletics proficiency/expertise', effect: 'Better checks for exceeding jump limits.', rating: 'A' },
];

export const VERTICAL_MOVEMENT_TIPS = [
  'Feather Fall: ALWAYS have someone in the party with this prepared. It saves lives.',
  'Fall damage is bludgeoning. Rage, Shield of Faith, Absorb Elements don\'t reduce it (only resistance).',
  'Monks at L4: Slow Fall reduces damage by 5×level. L10 Monk ignores 50 damage.',
  'Grapple + Fly: grapple enemy, fly up, drop them. They take fall damage, you don\'t.',
  'Reverse Gravity + Dispel: launch enemies up 100ft, then dispel. 10d6 fall damage.',
  'Long jump requires 10ft running start for full distance. Plan your approach.',
  'Jump spell + athletics = clear massive gaps. Great for dungeon exploration.',
  'Ring of Feather Falling: best uncommon item for characters without Feather Fall access.',
  'RAW: fall is instant. No Misty Step mid-fall (unless DM allows reaction). Debated rule.',
  'Enlarge doubles STR-based jump distance (size increase doesn\'t change the math RAW, but DMs often rule it does).',
];
