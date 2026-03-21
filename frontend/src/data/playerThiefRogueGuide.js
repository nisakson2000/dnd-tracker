/**
 * playerThiefRogueGuide.js
 * Player Mode: Thief Rogue — the fast-hands specialist
 * Pure JS — no React dependencies.
 */

export const THIEF_BASICS = {
  class: 'Rogue (Thief)',
  source: 'Player\'s Handbook',
  theme: 'Bonus action Use Object. Fast Hands for items, Healer feat, caltrops, oil, acid. Supreme mobility.',
  note: 'Often underrated. Fast Hands turns items into bonus actions — Healer feat for BA healing, Holy Water, Acid, Alchemist\'s Fire, Ball Bearings, Caltrops, Potions. Second-Story Work for climbing.',
};

export const THIEF_FEATURES = [
  { feature: 'Fast Hands', level: 3, effect: 'Cunning Action can also: Use an Object, make Sleight of Hand check, or use thieves\' tools.', note: 'THE feature. BA: throw acid (2d6), use Healer kit (heal), throw Holy Water, use potion on self, deploy caltrops.' },
  { feature: 'Second-Story Work', level: 3, effect: 'Climbing costs no extra movement. Running jump distance +DEX mod feet.', note: 'Spider-climb lite. Scale walls at full speed. Jump farther. Great for vertical combat.' },
  { feature: 'Supreme Sneak', level: 9, effect: 'Advantage on Stealth if you move ≤ half speed.', note: 'Expertise + advantage = near-guaranteed stealth. +17 or higher at this level.' },
  { feature: 'Use Magic Device', level: 13, effect: 'Ignore all class, race, and level requirements on magic items.', note: 'Use a Staff of Power, Holy Avenger, or Wand of Fireballs. Incredible if your DM gives you items.' },
  { feature: 'Thief\'s Reflexes', level: 17, effect: 'Two turns in the first round of combat (second turn at initiative -10).', note: 'Two full turns round 1. Two Sneak Attacks possible (one per turn). Devastating alpha strike.' },
];

export const THIEF_ITEM_COMBOS = [
  { item: 'Healer Feat + Fast Hands', effect: 'BA: heal 1d6+4+level HP. No spell slots. Repeatable.', note: 'Best non-magical healing in the game. Action economy is incredible.', rating: 'S' },
  { item: 'Acid Vial (Fast Hands)', effect: 'BA: throw acid, 2d6 acid damage (DEX save).', note: 'Extra damage on top of your Attack action Sneak Attack.', rating: 'B' },
  { item: 'Alchemist\'s Fire (Fast Hands)', effect: 'BA: throw, 1d4 fire/round until extinguished.', note: 'Sustained damage. Forces enemy to spend action to put it out.', rating: 'B' },
  { item: 'Caltrops/Ball Bearings', effect: 'BA: deploy area denial (DEX save or fall prone/take damage).', note: 'Control the battlefield while still attacking.', rating: 'A' },
  { item: 'Holy Water (Fast Hands)', effect: 'BA: throw, 2d6 radiant to fiends/undead.', note: 'Extra damage vs undead/fiends on top of your attack.', rating: 'B' },
  { item: 'Potion of Healing (Fast Hands)', effect: 'BA: drink potion. Normal rogues must use action.', note: 'Heal without losing your attack. Huge survivability.', rating: 'A' },
];

export const THIEF_TACTICS = [
  { tactic: 'Attack + Fast Hands Healer', detail: 'Action: Sneak Attack. BA: heal ally with Healer feat. Full damage + party support every turn.', rating: 'S' },
  { tactic: 'Thief\'s Reflexes alpha', detail: 'L17: two turns in round 1. Two Sneak Attacks (one per turn). 2× full Sneak Attack dice in round 1.', rating: 'S' },
  { tactic: 'Use Magic Device combos', detail: 'L13: use ANY magic item. Staff of Power, Holy Avenger, spell scrolls of any level. DM-dependent but insane ceiling.', rating: 'S' },
  { tactic: 'Vertical combat', detail: 'Second-Story Work: climb at full speed. Attack from above, drop back down. Hard to reach.', rating: 'A' },
];

export function healerFeatFastHands(characterLevel) {
  return { healing: `1d6+${4 + characterLevel}`, avg: 3.5 + 4 + characterLevel, action: 'Bonus Action (Fast Hands)', note: 'Repeatable, no spell slots' };
}

export function thiefsReflexesDamage(rogueLevel) {
  const sneakDice = Math.ceil(rogueLevel / 2);
  return { round1SneakAttacks: 2, totalDice: sneakDice * 2, avgSneakTotal: sneakDice * 2 * 3.5, note: 'Two Sneak Attacks in round 1 (one per turn)' };
}
