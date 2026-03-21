/**
 * playerBossStrategies.js
 * Player Mode: Strategies for fighting bosses with Legendary Actions/Resistances
 * Pure JS — no React dependencies.
 */

export const LEGENDARY_MECHANICS = {
  legendaryActions: {
    what: 'Boss gets extra actions at the end of OTHER creatures\' turns.',
    howMany: 'Usually 3 per round. Recharge at the start of the boss\'s turn.',
    counters: 'You can\'t prevent them. Plan for the boss acting between your turns.',
  },
  legendaryResistance: {
    what: 'Boss can choose to succeed on a failed saving throw.',
    howMany: 'Usually 3 per day (not per round!).',
    counters: 'Burn them with cheap spells first (1st-2nd level), THEN use your best save-or-suck.',
    tip: 'Faerie Fire, Hold Person at low slot, Blindness — force them to spend LR on cheap effects.',
  },
  lairActions: {
    what: 'On initiative 20, the lair itself takes an action (environmental effects).',
    counters: 'Fight the boss outside its lair if possible. Otherwise, position to avoid lair effects.',
  },
};

export const BOSS_FIGHT_STRATEGIES = [
  { strategy: 'Burn Legendary Resistances First', priority: 1, detail: 'Use cheap save-or-suck spells to force LR expenditure. Then use Banishment/Hold Monster.', assigned: 'Casters' },
  { strategy: 'Focus Fire', priority: 2, detail: 'Everyone attacks the boss. Don\'t split damage between boss and minions (unless minions are healer/buffer).', assigned: 'Everyone' },
  { strategy: 'Protect the Healer', priority: 3, detail: 'Keep the cleric/healer alive. A boss fight without healing is a TPK.', assigned: 'Tank/Melee' },
  { strategy: 'Flank and Position', priority: 4, detail: 'Spread out to avoid AoE. Flanking gives advantage (if using that rule).', assigned: 'Melee' },
  { strategy: 'Save Your Best Stuff', priority: 5, detail: 'Don\'t blow Action Surge/high slots on turn 1 if LR is still up.', assigned: 'Everyone' },
  { strategy: 'Use the Environment', priority: 6, detail: 'Chokepoints, cover, elevation. The boss has lair actions — use YOUR terrain advantages.', assigned: 'Everyone' },
  { strategy: 'Control Minions with AoE', priority: 7, detail: 'If the boss has minions, one Fireball/Hypnotic Pattern can clear them while party focuses boss.', assigned: 'Casters' },
  { strategy: 'Don\'t Cluster', priority: 8, detail: 'Bosses often have breath weapons, AoEs, or multi-attacks. Stay spread.', assigned: 'Everyone' },
];

export const BOSS_TYPE_TIPS = [
  { type: 'Dragon', tips: ['Spread out (breath weapon)', 'Absorb Elements for breath', 'Frightful Presence = WIS save', 'Attack wings to ground it'] },
  { type: 'Lich', tips: ['Counterspell priority', 'Find & destroy the phylactery', 'It WILL Counterspell your heals', 'Radiant damage is strong'] },
  { type: 'Beholder', tips: ['Antimagic Cone shuts off your spells', 'Stay OUT of the cone', 'Melee fighters are key (no magic needed)', 'Spread to avoid eye rays'] },
  { type: 'Mind Flayer', tips: ['INT save or stunned (Mind Blast)', 'Kill them FAST before they extract brains', 'Ranged attacks are safer', 'Resistance to psychic helps'] },
  { type: 'Vampire', tips: ['Radiant damage prevents regen', 'Running water, garlic, holy symbol', 'Sunlight = disadvantage + no regen', 'Must destroy coffin or it comes back'] },
];

export function getBossStrategy(bossType) {
  return BOSS_TYPE_TIPS.find(b => b.type.toLowerCase() === (bossType || '').toLowerCase()) || null;
}

export function getLRBurnOrder() {
  return [
    '1st: Faerie Fire (cheap, forces saves each turn)',
    '2nd: Hold Person/Monster (if LR used = waste their resource)',
    '3rd: Blindness/Deafness (no concentration, no component cost)',
    '4th: Banishment/Polymorph (after LR gone, these end the fight)',
  ];
}
