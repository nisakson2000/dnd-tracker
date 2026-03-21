/**
 * playerCircleOfStarsGuide.js
 * Player Mode: Circle of Stars Druid optimization
 * Pure JS — no React dependencies.
 */

export const STARS_BASICS = {
  class: 'Druid (Circle of Stars)',
  theme: 'Cosmic druid who channels starlight. Uses Wild Shape for starry forms instead of beasts.',
  source: 'Tasha\'s Cauldron of Everything',
};

export const STARS_FEATURES = [
  {
    feature: 'Star Map',
    level: 2,
    effect: 'Free Guiding Bolt casts = PB/day. Free Guidance cantrip. Your star map is your focus.',
    note: 'Free Guiding Bolt is huge. 4d6 radiant + advantage on next attack. PB times per day.',
  },
  {
    feature: 'Starry Form',
    level: 2,
    effect: 'Use Wild Shape to assume a starry form. Choose: Archer, Chalice, or Dragon.',
    forms: {
      archer: 'Bonus action: ranged spell attack, 1d8+WIS radiant. Scales to 2d8 at L10.',
      chalice: 'When you cast a healing spell, you or another creature within 30ft regains 1d8+WIS. Scales to 2d8 at L10.',
      dragon: 'Treat d20 roll of 9 or lower as 10 on concentration saves. Also gain 10ft fly (hover) at L10.',
    },
    note: 'Starry Form replaces beast shape. Much better for casters. Lasts 10 minutes.',
  },
  {
    feature: 'Cosmic Omen',
    level: 6,
    effect: 'Roll d6 after long rest. Even (Weal): reaction +1d6 to ally\'s attack/check/save. Odd (Woe): reaction -1d6 to enemy\'s attack/check/save.',
    note: 'PB uses per long rest. Free Bless/Bane as a reaction. Excellent support.',
  },
  {
    feature: 'Twinkling Constellations',
    level: 10,
    effect: 'Starry Form dice become 2d8. Change constellation at start of each turn. Dragon form: 10ft fly (hover).',
    note: 'Now you can swap between Archer, Chalice, or Dragon each turn based on need.',
  },
  {
    feature: 'Full of Stars',
    level: 14,
    effect: 'While in Starry Form: resistance to bludgeoning, piercing, and slashing damage.',
    note: 'Physical damage resistance while in your casting form. Very strong.',
  },
];

export const STARS_TACTICS = [
  { tactic: 'Archer + Spirit Guardians', detail: 'Archer form: bonus action 2d8+WIS radiant. Action: Spirit Guardians (3d8 AoE). Dragon for concentration insurance.', rating: 'S' },
  { tactic: 'Chalice + Mass Healing', detail: 'Cast Healing Word (bonus action). Chalice triggers: heal another creature 2d8+WIS. Two heals for one spell.', rating: 'S' },
  { tactic: 'Dragon + concentration spell', detail: 'Dragon form: can\'t fail concentration saves with d20 result 9 or lower = 10. Nearly unbreakable concentration.', rating: 'S' },
  { tactic: 'Guiding Bolt opener', detail: 'Free Guiding Bolt (PB/day): 4d6 radiant + advantage on next attack for ally. Start every fight with this.', rating: 'A' },
  { tactic: 'Cosmic Omen support', detail: 'Reaction to boost ally (+1d6) or debuff enemy (-1d6). Like having Bardic Inspiration as a Druid.', rating: 'A' },
];

export const STARS_VS_OTHER_DRUIDS = {
  stars: { pros: ['Best caster druid', 'Dragon concentration protection', 'Free Guiding Bolt', 'Cosmic Omen support', 'Physical resistance at L14'], cons: ['No beast form utility', 'No extra HP from Wild Shape'] },
  moon: { pros: ['Beast form HP pool', 'Elemental forms', 'Infinite Wild Shape at L20'], cons: ['Can\'t cast in Wild Shape (until L18)', 'Boring at mid levels'] },
  shepherd: { pros: ['Best summoner', 'Spirit Totem heals/buffs'], cons: ['Summoning is slow and complex'] },
  verdict: 'Stars is the best Druid for players who want to cast spells every turn with excellent support abilities.',
};

export function archerDamage(wisMod, level) {
  const dice = level >= 10 ? 2 : 1;
  return dice * 4.5 + wisMod; // d8 avg = 4.5
}

export function chaliceHealing(wisMod, level) {
  const dice = level >= 10 ? 2 : 1;
  return dice * 4.5 + wisMod; // free bonus heal
}

export function dragonConcentrationMinRoll() {
  return 10; // Treat 9 or lower as 10
}
