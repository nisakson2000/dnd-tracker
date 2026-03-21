/**
 * playerBeastFormMastery.js
 * Player Mode: Druid Wild Shape forms, combat tactics, and optimization
 * Pure JS — no React dependencies.
 */

export const WILD_SHAPE_RULES = {
  uses: '2 uses per short/long rest. Bonus action to transform.',
  duration: 'Hours = half Druid level (min 1).',
  hp: 'Gain beast\'s HP. When it hits 0, revert with your original HP.',
  limits: 'No casting (Moon 18 exception). Can concentrate on existing spells.',
  crLimits: [
    { level: 2, maxCR: '1/4', fly: false, swim: false },
    { level: 4, maxCR: '1/2', fly: false, swim: true },
    { level: 8, maxCR: 1, fly: true, swim: true },
  ],
};

export const MOON_DRUID = {
  combatShift: 'BA to Wild Shape. Spend slots to heal 1d8/level while shifted.',
  crLimits: [
    { level: 2, maxCR: 1 }, { level: 6, maxCR: 2 }, { level: 9, maxCR: 3 },
    { level: 12, maxCR: 4 }, { level: 15, maxCR: 5 }, { level: 18, maxCR: 6 },
  ],
  elementals: 'Level 10: 2 uses → elemental (Air/Earth/Fire/Water).',
  level18: 'Cast spells in form. Unlimited uses.',
};

export const BEST_COMBAT_FORMS = [
  { level: 2, form: 'Brown Bear', hp: 34, attacks: 'Bite + Claws multiattack', note: 'Best early. Multiattack at L2.' },
  { level: 2, form: 'Dire Wolf', hp: 37, attacks: 'Bite (prone on hit)', note: 'Pack Tactics. Knocks prone.' },
  { level: 4, form: 'Giant Toad', hp: 39, attacks: 'Bite + grapple + swallow', note: 'Swallow = restrain + acid.' },
  { level: 6, form: 'Giant Constrictor', hp: 60, attacks: 'Bite + Constrict (grapple)', note: '60 HP tank + grapple.' },
  { level: 9, form: 'Ankylosaurus', hp: 68, attacks: 'Tail (4d6+4, prone)', note: '68 HP. Knocks prone.' },
  { level: 10, form: 'Earth Elemental', hp: 126, attacks: 'Slam x2', note: '126 HP. Phase through walls.' },
];

export const UTILITY_FORMS = [
  { form: 'Cat', use: 'Stealth scouting. Tiny, +4 Stealth.' },
  { form: 'Spider', use: 'Wall climbing. Tiny.' },
  { form: 'Hawk', use: 'Flying scout. Keen Sight.' },
  { form: 'Horse', use: 'Carry party member at 60ft.' },
  { form: 'Giant Owl', use: 'Fly + carry Medium creature.' },
];

export const WILD_SHAPE_TACTICS = [
  { tactic: 'HP sponge', detail: 'Beast HP = free temp HP (30-126). Revert unharmed.', rating: 'S' },
  { tactic: 'Pre-cast + shift', detail: 'Conjure Animals THEN Wild Shape. Spell persists.', rating: 'S' },
  { tactic: 'Heal in form', detail: 'Moon: BA spend slot → 1d8/level healing.', rating: 'S' },
  { tactic: 'Scout forms', detail: 'Cat/spider/hawk. Explore risk-free.', rating: 'A' },
  { tactic: 'Beast grapples', detail: 'Toad swallow, constrictor crush. Better than humanoid grapple.', rating: 'A' },
];

export function wildShapeDuration(druidLevel) {
  return Math.max(1, Math.floor(druidLevel / 2));
}

export function moonMaxCR(druidLevel) {
  if (druidLevel >= 18) return 6;
  if (druidLevel >= 15) return 5;
  if (druidLevel >= 12) return 4;
  if (druidLevel >= 9) return 3;
  if (druidLevel >= 6) return 2;
  return druidLevel >= 2 ? 1 : 0;
}
