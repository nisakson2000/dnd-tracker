/**
 * playerSilverBarbs.js
 * Player Mode: Silvery Barbs spell analysis — the most controversial 1st level spell
 * Pure JS — no React dependencies.
 */

export const SILVERY_BARBS_STATS = {
  level: 1,
  school: 'Enchantment',
  casting: 'Reaction (when a creature you can see within 60ft succeeds on an attack/check/save)',
  classes: 'Bard, Sorcerer, Wizard',
  effect: 'Force reroll. Must use lower result. Give advantage to one creature of your choice on next attack/check/save.',
  duration: 'Instantaneous',
  source: 'Strixhaven: A Curriculum of Chaos',
};

export const SILVERY_BARBS_POWER = {
  whyBroken: [
    'It\'s Shield\'s power level but for saves/checks too, not just AC.',
    'It\'s only a 1st level slot. Can use it 4+ times per day at level 1.',
    'The advantage-granting is a BONUS on top. Two effects for one reaction.',
    'Works on enemy saves vs your spells. Failed Hold Person? Silvery Barbs → reroll.',
    'Works on enemy attacks. Hit your ally? Silvery Barbs → reroll.',
    'Works on enemy ability checks. Passed the grapple check? Reroll.',
  ],
  math: 'Forcing a reroll and taking the lower = roughly -3.3 to the roll on average. For a 1st level slot.',
};

export const SILVERY_BARBS_USES = [
  { use: 'Enemy succeeds on save vs Hold Person', detail: 'Force reroll → likely paralyze → auto-crit from party.', value: 'S' },
  { use: 'Enemy crits an ally', detail: 'Force reroll → likely no longer a crit. Huge damage prevention.', value: 'S' },
  { use: 'Enemy saves vs Hypnotic Pattern', detail: 'One target rerolls → now incapacitated. One fewer enemy acting.', value: 'A' },
  { use: 'Enemy succeeds on Counterspell check', detail: 'Reroll the Counterspell check → your spell likely goes through.', value: 'S' },
  { use: 'Give advantage to Rogue', detail: 'Advantage on next attack = guaranteed Sneak Attack trigger.', value: 'A' },
  { use: 'Give advantage to saving throw', detail: 'Ally about to make a save? Give them advantage. Like a mini-Inspiration.', value: 'A' },
];

export const SILVERY_BARBS_VS_SHIELD = {
  shield: { cost: '1st level, reaction', effect: '+5 AC until start of next turn', scope: 'Only protects YOU. Only against attacks.' },
  silveryBarbs: { cost: '1st level, reaction', effect: 'Force reroll (any d20) + give advantage to ally', scope: 'Protects anyone. Works on attacks, saves, AND checks.' },
  verdict: 'Silvery Barbs is more flexible and arguably stronger. Shield is more reliable for self-protection (guaranteed +5 vs probabilistic reroll).',
  bothTaken: 'Many casters prepare BOTH. Shield when you\'re attacked, Silvery Barbs when allies are threatened or enemies save.',
};

export const SILVERY_BARBS_COUNTERS = [
  'Legendary Resistance: creature can choose to succeed. Silvery Barbs only forces a reroll — LR still auto-passes.',
  'Limited reaction: can only use one reaction per round. Shield or Counterspell or Silvery Barbs — choose.',
  'Spell slots: at lower levels, using a slot for SB means one fewer Shield/slot for other spells.',
  'Some DMs ban or restrict it: it\'s from a setting book, not core PHB. Ask your DM.',
];

export function rerollPenalty() {
  return -3.325; // Average penalty of "take lower of two d20s"
}

export function silveryBarbsSaveChance(originalSaveChance) {
  // Chance of failing BOTH rolls = (1 - saveChance)^2... but they take lower
  // Actually: must succeed on reroll with disadvantage
  const failChance = 1 - originalSaveChance;
  const newPassChance = originalSaveChance * originalSaveChance; // must pass both to keep success
  return 1 - newPassChance; // chance the creature NOW fails
}
