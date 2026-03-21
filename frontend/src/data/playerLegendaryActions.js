/**
 * playerLegendaryActions.js
 * Player Mode: Understanding and countering boss legendary/lair actions
 * Pure JS — no React dependencies.
 */

export const LEGENDARY_ACTION_RULES = {
  uses: 'Usually 3 per round. Recharges at the start of the creature\'s turn.',
  timing: 'Can use at the end of another creature\'s turn. Only one LA per turn.',
  cost: 'Some legendary actions cost 2 or 3 uses (more powerful effects).',
  note: 'Legendary actions mean the boss acts 4+ times per round. Action economy is still against you.',
};

export const COMMON_LEGENDARY_ACTIONS = [
  { action: 'Detect', cost: 1, effect: 'Make a Perception check.', counter: 'Doesn\'t matter much. Let them waste uses on this.' },
  { action: 'Attack', cost: 1, effect: 'One weapon attack.', counter: 'Extra damage. Spread out so AoE LAs don\'t hit everyone.' },
  { action: 'Move', cost: 1, effect: 'Move up to speed without provoking OA.', counter: 'Can\'t pin them down with OA. Use grapple or forced movement.' },
  { action: 'Wing Attack (dragons)', cost: 2, effect: 'AoE damage + prone in radius. Fly away.', counter: 'Spread out. Prone = can\'t stand + advantage on attacks vs you.' },
  { action: 'Tail Attack', cost: 1, effect: 'One tail strike.', counter: 'Just damage. Less threatening than Wing Attack.' },
  { action: 'Frightful Presence', cost: 1, effect: 'AoE fear. WIS save.', counter: 'Heroes\' Feast, Calm Emotions, high WIS saves.' },
  { action: 'Cast a Spell', cost: 'Varies', effect: 'Boss casts a spell off-turn.', counter: 'Counterspell if you can. Save your reaction.' },
  { action: 'Teleport', cost: 1, effect: 'Teleport up to 120ft.', counter: 'Can\'t prevent it. Reposition to follow.' },
];

export const LAIR_ACTION_RULES = {
  trigger: 'Initiative count 20 (losing ties). Only in the creature\'s lair.',
  frequency: 'One lair action per round. Can\'t use same one two rounds in a row.',
  types: ['Environmental hazards (quake, flood, fire)', 'Summon minions', 'Buff the boss', 'Debuff players', 'Terrain changes'],
  counter: 'Fight bosses OUTSIDE their lair when possible. Lair actions are free and powerful.',
};

export const BOSS_FIGHT_STRATEGY = [
  { tip: 'Burn legendary resistances first', detail: 'Force saves with low-cost spells (Faerie Fire, Hold Person). Boss burns LR. THEN hit with the big save-or-suck.', priority: 'S' },
  { tip: 'Spread out', detail: 'Legendary actions often have AoE. Wing Attack, breath weapons, etc. Don\'t cluster.', priority: 'S' },
  { tip: 'Focus fire', detail: 'Boss has LOTS of HP. Don\'t split damage. All attacks on the boss until it drops.', priority: 'S' },
  { tip: 'Save Counterspell for LAs', detail: 'If the boss can cast as a legendary action, save your reaction for off-turn Counterspell.', priority: 'A' },
  { tip: 'Grapple to prevent escape', detail: 'Legendary Move lets bosses reposition freely. Grapple locks them down (speed 0).', priority: 'A' },
  { tip: 'Fight outside the lair', detail: 'Lair actions are FREE extra power. Lure the boss out if possible.', priority: 'S' },
  { tip: 'Track LR uses', detail: 'Most bosses have 3 Legendary Resistances. Count them. Once they\'re gone, save-or-suck works.', priority: 'S' },
];

export const LEGENDARY_RESISTANCE = {
  uses: 'Usually 3 per day (some have more/less).',
  effect: 'When the boss fails a save, it can choose to succeed instead.',
  strategy: [
    'Force saves with cheap spells first: Faerie Fire (1st), Hold Person (2nd), Web (2nd).',
    'Once all LRs are burned, cast your fight-ending spell: Banishment, Polymorph, Hold Monster.',
    'Track every LR use. Call them out to the party: "That\'s LR #2, one left!"',
    'Sorcerer Heightened Spell makes it harder for the boss to save (but they can still LR).',
    'Multiple casters forcing saves burns LR faster.',
  ],
};

export function legendaryActionsPerRound(baseLA, partySize) {
  // Bosses designed for ~4 players. DM might add/remove based on party
  return baseLA;
}

export function turnsToDepleteLR(lrCount, saveForcersPerRound) {
  return Math.ceil(lrCount / saveForcersPerRound);
}
