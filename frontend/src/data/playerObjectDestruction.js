/**
 * playerObjectDestruction.js
 * Player Mode: Object interaction, improvised weapons, and destructible objects
 * Pure JS — no React dependencies.
 */

export const OBJECT_INTERACTION = {
  free: 'One free object interaction per turn (draw weapon, open door, pick up item).',
  action: 'Second interaction needs your action.',
  shield: 'Don/doff shield = 1 action each.',
};

export const OBJECT_STATS = [
  { material: 'Paper/Cloth', ac: 11, hp: '1-2' },
  { material: 'Rope', ac: 11, hp: '2' },
  { material: 'Glass', ac: 13, hp: '1-5' },
  { material: 'Wood', ac: 15, hp: '10-30' },
  { material: 'Stone', ac: 17, hp: '27-50' },
  { material: 'Iron/Steel', ac: 19, hp: '18-50' },
  { material: 'Adamantine', ac: 23, hp: '40-80' },
];

export const IMPROVISED_WEAPONS = {
  damage: '1d4. No proficiency unless similar to a known weapon.',
  examples: ['Chair leg (club)', 'Broken bottle (dagger)', 'Rock (thrown 20/60)', 'Torch (1 fire)'],
  feat: 'Tavern Brawler: proficiency + 1d4 + BA grapple.',
};

export const BREAKING_THINGS = {
  door: 'AC 15, HP 18. STR DC 15 or just attack.',
  lock: 'AC 19, HP 5. Thieves\' tools DC 15.',
  chain: 'AC 19, HP 10.',
  wall: 'AC 17, HP 27/5ft section.',
  spells: ['Knock (opens locks)', 'Shatter (3d8 thunder)', 'Disintegrate (10d6+40)'],
};

export function hitsToBreak(hp, dmg) { return Math.ceil(hp / dmg); }
export function strBreakChance(dc, strMod) {
  return Math.min(95, Math.max(5, (21 - (dc - strMod)) * 5));
}
