/**
 * playerFallingRulesGuide.js
 * Player Mode: Falling damage, prevention, and creative uses
 * Pure JS — no React dependencies.
 */

export const FALLING_RULES = {
  damage: '1d6 bludgeoning per 10 feet fallen.',
  maximum: '20d6 (200ft = max fall distance for damage). Average: 70. Max: 120.',
  instantaneous: 'RAW: you fall 500ft instantly at end of turn. Xanathar\'s: 500ft per round (6 seconds).',
  prone: 'After falling and taking damage, you land prone (unless you avoid all damage).',
  note: 'Falls are surprisingly deadly at low levels. 30ft fall = 3d6 = avg 10.5 damage. Can kill a L1 character.',
};

export const FALL_PREVENTION = [
  { method: 'Feather Fall', cost: 'L1 spell, reaction', effect: 'Fall at 60ft/round, take no damage. Up to 5 creatures.', rating: 'S', note: 'THE fall prevention spell. Reaction speed. Party-wide. Every caster should prepare this.' },
  { method: 'Slow Fall (Monk)', cost: 'Reaction, no ki', effect: 'Reduce fall damage by 5 × Monk level.', rating: 'A', note: 'At L10: reduce by 50 damage. At L20: reduce by 100. Most falls become harmless.' },
  { method: 'Wild Shape (Druid)', cost: 'Wild Shape use', effect: 'Shift into flying form mid-fall (if action available). Or absorb with beast form HP.', rating: 'A' },
  { method: 'Misty Step', cost: 'L2 spell, bonus action', effect: 'Teleport to safe ground within 30ft. Must be before you hit the ground.', rating: 'A', note: 'Xanathar\'s timing: if falling 500ft/round, you might act before hitting ground.' },
  { method: 'Fly/Levitate', cost: 'Spell', effect: 'Already flying = no fall damage if you have hover.', rating: 'A' },
  { method: 'Gliding (Hadozee/Manta Glide)', cost: 'Racial trait', effect: 'Glide horizontally, negate fall damage.', rating: 'A' },
];

export const CREATIVE_FALL_USES = [
  { use: 'Grapple and drop', detail: 'Grapple enemy → fly up → release. They take 1d6 per 10ft. You avoid damage with Fly/Feather Fall/Slow Fall.', rating: 'A' },
  { use: 'Reverse Gravity + Ceiling', detail: 'Reverse Gravity (L7): everyone "falls" upward 100ft. If ceiling is closer: crash into ceiling for fall damage. Then spell ends: fall back down.', rating: 'S', note: '40ft ceiling: 4d6 up + 4d6 down = 8d6 total. Double fall damage.' },
  { use: 'Gust/Shove off cliff', detail: 'Push enemy off a ledge. Shove (Athletics), Gust cantrip, Thunderwave. Forced movement off edges.', rating: 'A' },
  { use: 'Drop something heavy', detail: 'Drop a boulder on enemies from above. DM ruling on damage but thematically devastating.', rating: 'B (DM dependent)' },
  { use: 'Monk Slow Fall + no fall damage', detail: 'Jump off buildings freely. Slow Fall negates most fall damage. Monk mobility includes vertical.' , rating: 'A' },
];

export const FALLING_DAMAGE_TABLE = [
  { height: 10, dice: '1d6', avg: 3.5, max: 6 },
  { height: 20, dice: '2d6', avg: 7, max: 12 },
  { height: 30, dice: '3d6', avg: 10.5, max: 18 },
  { height: 50, dice: '5d6', avg: 17.5, max: 30 },
  { height: 100, dice: '10d6', avg: 35, max: 60 },
  { height: 150, dice: '15d6', avg: 52.5, max: 90 },
  { height: 200, dice: '20d6', avg: 70, max: 120 },
];

export function fallingDamage(heightFeet) {
  const dice = Math.min(20, Math.floor(heightFeet / 10));
  return { dice, avg: dice * 3.5, max: dice * 6, min: dice };
}

export function slowFallReduction(monkLevel) {
  return monkLevel * 5;
}

export function netFallingDamage(heightFeet, reduction = 0) {
  const { avg } = fallingDamage(heightFeet);
  return Math.max(0, avg - reduction);
}
