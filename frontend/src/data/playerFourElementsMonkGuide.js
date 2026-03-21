/**
 * playerFourElementsMonkGuide.js
 * Player Mode: Way of the Four Elements Monk — the elemental bender
 * Pure JS — no React dependencies.
 */

export const FOUR_ELEMENTS_BASICS = {
  class: 'Monk (Way of the Four Elements)',
  source: 'Player\'s Handbook',
  theme: 'Elemental spellcasting via ki. Bend fire, water, earth, air.',
  note: 'Widely considered the weakest Monk subclass. Ki costs are too high for the spells you get. Cool theme, poor execution. House rules can fix it.',
};

export const FOUR_ELEMENTS_FEATURES = [
  { feature: 'Disciple of the Elements', level: 3, effect: 'Learn elemental disciplines (ki-powered spells). Choose from list. Learn more at L6, L11, L17.', note: 'Ki cost = 2 + spell level. A L3 spell costs 5 ki. At L5 with 5 ki points, you cast ONE spell and you\'re drained.' },
  { feature: 'Elemental Attunement', level: 3, effect: 'Free cantrip-level elemental effects: move small amounts of element, create sensory effects.', note: 'Flavor/RP. Minor Prestidigitation-like effects with elements. No combat value.' },
  { feature: 'Discipline Progression', level: '6/11/17', effect: 'Learn additional disciplines at each tier. Higher-level spells become available.', note: 'L6: L2 spells (3 ki). L11: L3 spells (4-5 ki). L17: L4-5 spells (5-6 ki). Ki costs hurt.' },
];

export const BEST_DISCIPLINES = [
  { discipline: 'Fangs of the Fire Snake', level: 3, kiCost: 1, effect: 'Unarmed reach +10ft this turn. Hits deal +1d10 fire.', rating: 'A', note: 'Only 1 ki. Reach extension + fire damage. Best discipline by far because it\'s cheap.' },
  { discipline: 'Fist of Unbroken Air', level: 3, kiCost: 2, effect: 'Ranged attack: 3d10 bludgeoning + push 20ft + prone (STR save).', rating: 'B', note: '3d10 ranged attack. Decent but 2 ki is expensive at L3.' },
  { discipline: 'Water Whip', level: 3, kiCost: 2, effect: '3d10 bludgeoning + pull 25ft closer or knock prone (DEX save).', rating: 'B', note: 'Pull enemy toward you or knock prone. Tactical positioning.' },
  { discipline: 'Flames of the Phoenix', level: 11, kiCost: 4, effect: 'Cast Fireball.', rating: 'A', note: 'Fireball is great but 4 ki at L11 (11 ki total) is very expensive. Two Fireballs = nearly all ki.' },
  { discipline: 'Breath of Winter', level: 17, kiCost: 6, effect: 'Cast Cone of Cold.', rating: 'B', note: '6 ki for Cone of Cold at L17 when full casters have L9 slots. Underwhelming.' },
];

export const HOUSE_RULE_FIXES = [
  { fix: 'Reduce ki costs by 1', detail: 'All disciplines cost 1 less ki (minimum 1). Makes the subclass actually playable.', impact: 'High' },
  { fix: 'Free discipline uses = PB/LR', detail: 'Gain PB free uses of disciplines per long rest. Then ki for additional uses.', impact: 'High' },
  { fix: 'Scale discipline damage', detail: 'Disciplines scale with Monk level like cantrips scale with character level.', impact: 'Medium' },
  { fix: 'Additional disciplines known', detail: 'Learn extra disciplines at each tier. More options = more flexibility.', impact: 'Medium' },
];

export const FOUR_ELEMENTS_TACTICS = [
  { tactic: 'Fangs of the Fire Snake priority', detail: 'Only 1 ki. Use this over other disciplines. +10ft reach + 1d10 fire per hit. Best ki-to-damage ratio.', rating: 'A' },
  { tactic: 'Save ki for Stunning Strike', detail: 'Stunning Strike is usually better than disciplines. Save ki for stuns, use disciplines only when stuns aren\'t viable.', rating: 'S' },
  { tactic: 'AoE when needed', detail: 'Fireball/Cone of Cold are your only AoE options as a Monk. Save these for 4+ enemies to justify the ki cost.', rating: 'A' },
  { tactic: 'Water Whip for positioning', detail: 'Pull flying enemies to the ground. Pull enemies into hazards. Knock prone for advantage.', rating: 'B' },
];

export function disciplineKiCost(spellLevel) {
  return 2 + spellLevel; // Base formula
}

export function kiEfficiency(kiSpent, damageDealt) {
  return { damagePerKi: damageDealt / kiSpent, note: 'Compare to Stunning Strike (1 ki) which can remove enemy actions entirely.' };
}
