/**
 * playerJumpingRulesGuide.js
 * Player Mode: Jumping rules and optimization
 * Pure JS — no React dependencies.
 */

export const JUMPING_RULES = {
  longJump: {
    running: 'Distance = STR score in feet (with 10ft running start).',
    standing: 'Distance = half STR score in feet (no running start).',
    note: 'STR 20 = 20ft long jump. Each foot jumped costs 1 foot of movement.',
  },
  highJump: {
    running: 'Height = 3 + STR mod feet (with 10ft running start).',
    standing: 'Height = half of (3 + STR mod) feet (no running start).',
    reach: 'At top of jump: arms extend 1.5× your height above. Total reach = jump height + 1.5× height.',
    note: 'STR 20 = 8ft high jump. Plus reach = ~17ft total reach for a 6ft character.',
  },
  movement: 'Each foot of jumping costs 1 foot of movement speed. You can\'t jump further than your remaining movement.',
};

export const JUMP_DISTANCE_TABLE = [
  { str: 8, longJump: 8, standingLong: 4, highJump: 2, standingHigh: 1 },
  { str: 10, longJump: 10, standingLong: 5, highJump: 3, standingHigh: 1.5 },
  { str: 12, longJump: 12, standingLong: 6, highJump: 4, standingHigh: 2 },
  { str: 14, longJump: 14, standingLong: 7, highJump: 5, standingHigh: 2.5 },
  { str: 16, longJump: 16, standingLong: 8, highJump: 6, standingHigh: 3 },
  { str: 18, longJump: 18, standingLong: 9, highJump: 7, standingHigh: 3.5 },
  { str: 20, longJump: 20, standingLong: 10, highJump: 8, standingHigh: 4 },
];

export const JUMP_ENHANCERS = [
  { source: 'Jump spell (L1)', effect: 'Triple jump distance for 1 minute.', note: 'STR 20: 60ft long jump, 24ft high jump. Concentration.' },
  { source: 'Boots of Striding and Springing', effect: 'Triple jump distance.', note: 'No concentration. Always active while attuned. Requires attunement.' },
  { source: 'Ring of Jumping', effect: 'Cast Jump on self at will (no slot needed).', note: 'Unlimited Jump spell. No concentration per item description.' },
  { source: 'Step of the Wind (Monk)', effect: 'BA: Dash + jump distance doubled for the turn.', note: 'Doubled jump + Dash = massive distance. Stack with Jump spell for 6× jump.' },
  { source: 'Tabaxi Feline Agility', effect: 'Double movement speed = more movement for jumping.', note: 'Jump distance limited by remaining movement. More movement = more jump potential.' },
  { source: 'Athlete feat', effect: 'Running long/high jump with only 5ft start (not 10ft).', note: 'Jump from tighter spaces. Also: climb at full speed, stand from prone costs 5ft.' },
  { source: 'Thief Second-Story Work', effect: 'Running jump distance +DEX mod feet.', note: 'DEX 20: +5ft to long jumps. Minor but free.' },
];

export const JUMP_TACTICS = [
  { tactic: 'Gap crossing', detail: 'Long jump across pits/chasms. STR 14 = 14ft gap. With Jump spell: 42ft.', rating: 'A' },
  { tactic: 'Wall scaling', detail: 'High jump + reach = grab ledges. STR 16, 6ft tall: 6ft jump + 9ft reach = 15ft ledge.', rating: 'A' },
  { tactic: 'Monk flying kicks', detail: 'Step of the Wind + Jump spell: 60ft+ jumps. Land on flying creatures. Aerial Stunning Strike.', rating: 'S' },
  { tactic: 'Jump over enemies', detail: 'High jump to clear enemy heads. Avoid opportunity attacks (you\'re not moving away, you\'re going over).', rating: 'B' },
];

export function longJumpDistance(strScore, hasJumpSpell = false, hasStepOfWind = false) {
  let distance = strScore;
  if (hasJumpSpell) distance *= 3;
  if (hasStepOfWind) distance *= 2;
  return { distance, note: `${strScore} STR${hasJumpSpell ? ' + Jump spell' : ''}${hasStepOfWind ? ' + Step of Wind' : ''}` };
}

export function highJumpReach(strMod, heightFeet, hasJumpSpell = false) {
  let jumpHeight = 3 + strMod;
  if (hasJumpSpell) jumpHeight *= 3;
  const armReach = heightFeet * 1.5;
  return { jumpHeight, totalReach: jumpHeight + armReach };
}
