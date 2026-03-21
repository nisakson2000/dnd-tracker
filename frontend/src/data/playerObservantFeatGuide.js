/**
 * playerObservantFeatGuide.js
 * Player Mode: Observant feat — passive perception god
 * Pure JS — no React dependencies.
 */

export const OBSERVANT_BASICS = {
  feat: 'Observant',
  source: "Player's Handbook",
  type: 'Half-feat (+1 INT or WIS)',
  benefits: [
    '+5 to passive Perception and passive Investigation.',
    'Read lips if you can see a creature\'s mouth and know the language.',
    '+1 to INT or WIS (half-feat).',
  ],
  note: 'Passive Perception 20+ makes you nearly impossible to sneak past. DMs use passive scores more than you think.',
};

export const PASSIVE_SCORE_MATH = {
  formula: '10 + WIS mod + proficiency + bonuses',
  example: {
    wis16: { mod: 3, prof: 3, observant: 5, total: 21, note: 'L5, WIS 16, proficient: passive 21' },
    wis20: { mod: 5, prof: 6, observant: 5, expertise: 6, total: 32, note: 'L17, WIS 20, Expertise: passive 32' },
  },
  advantage: 'Advantage on Perception = +5 passive. Stacks with Observant.',
  disadvantage: 'Disadvantage = -5 passive. Dim light causes this for non-darkvision.',
};

export const OBSERVANT_CLASS_VALUE = [
  { class: 'Rogue', priority: 'A', reason: 'Expertise in Perception + Observant = passive 25+ easily. Nothing gets past you.' },
  { class: 'Ranger', priority: 'A', reason: 'WIS class + Perception proficiency. Natural fit. +1 WIS is useful.' },
  { class: 'Cleric/Druid', priority: 'B+', reason: 'WIS classes. +1 WIS rounds odd score. Good passive boost.' },
  { class: 'Wizard', priority: 'B', reason: '+1 INT rounds odd score. Passive Investigation helps find traps.' },
  { class: 'Fighter/Barbarian', priority: 'C', reason: 'Low WIS typically. Other feats provide more combat value.' },
];

export const OBSERVANT_COMBOS = [
  { combo: 'Expertise (Perception)', source: 'Rogue/Bard/Skill Expert', effect: 'Double proficiency + Observant = absurd passive scores.' },
  { combo: 'Eyes of the Eagle', source: 'Uncommon item', effect: 'Advantage on Perception = +5 passive. Stacks with Observant for +10 total.' },
  { combo: 'Sentinel Shield', source: 'Uncommon item', effect: 'Advantage on Perception and Initiative. +5 passive + Observant +5 = +10.' },
  { combo: 'Alert feat', source: 'PHB feat', effect: 'Can\'t be surprised + highest passive Perception. Ultimate anti-ambush.' },
];

export function passivePerception(wisMod, profBonus, isProficient, hasExpertise, hasObservant, hasAdvantage) {
  let total = 10 + wisMod;
  if (isProficient) total += profBonus;
  if (hasExpertise) total += profBonus;
  if (hasObservant) total += 5;
  if (hasAdvantage) total += 5;
  return { total, note: `Passive Perception: ${total}` };
}
