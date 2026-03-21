/**
 * playerFeatSynergyGuide.js
 * Player Mode: Feat combinations and synergies — feats that work together
 * Pure JS — no React dependencies.
 */

export const FEAT_COMBOS = [
  {
    combo: 'Polearm Master + Sentinel',
    feats: ['Polearm Master', 'Sentinel'],
    effect: 'Enemy enters 10ft reach → OA → hit = speed 0. They can\'t reach you.',
    bestFor: 'Fighter, Paladin. Lockdown tank build.',
    rating: 'S+',
    note: 'The king of feat combos. Total melee control.',
  },
  {
    combo: 'Great Weapon Master + Reckless Attack',
    feats: ['Great Weapon Master', 'Reckless Attack (class)'],
    effect: 'Advantage offsets GWM -5 penalty. +10 damage per hit.',
    bestFor: 'Barbarian.',
    rating: 'S+',
    note: 'Barbarian core. Reckless makes GWM nearly free.',
  },
  {
    combo: 'Sharpshooter + Crossbow Expert',
    feats: ['Sharpshooter', 'Crossbow Expert'],
    effect: '-5/+10 + BA hand crossbow attack + no disadvantage in melee + ignore cover.',
    bestFor: 'Fighter, Ranger.',
    rating: 'S+',
    note: 'Best ranged build. Three attacks at L5 with Action + BA.',
  },
  {
    combo: 'Elven Accuracy + Steady Aim',
    feats: ['Elven Accuracy', 'Steady Aim (class)'],
    effect: 'Triple advantage on attacks. Nearly guaranteed hits.',
    bestFor: 'Rogue (Elf/Half-Elf).',
    rating: 'S+',
    note: 'Roll 3 dice, pick highest. Miss chance is ~3%.',
  },
  {
    combo: 'War Caster + Polearm Master',
    feats: ['War Caster', 'Polearm Master'],
    effect: 'OA when enemy enters 10ft → cast Booming Blade as OA.',
    bestFor: 'Hexblade, Eldritch Knight.',
    rating: 'S',
    note: 'Booming Blade OA at 10ft. If they keep moving, extra thunder damage.',
  },
  {
    combo: 'Shield Master + Expertise (Athletics)',
    feats: ['Shield Master', 'Skill Expert (Athletics Expertise)'],
    effect: 'BA shove prone after Attack action. High Athletics = reliable.',
    bestFor: 'Fighter, Paladin. Grapple/shove builds.',
    rating: 'A+',
    note: 'Prone = advantage on remaining attacks. Free BA shove.',
  },
  {
    combo: 'Alert + Gloom Stalker',
    feats: ['Alert', 'Dread Ambusher (class)'],
    effect: '+5 initiative + WIS to initiative. Extra attack R1. Can\'t be surprised.',
    bestFor: 'Ranger (Gloom Stalker).',
    rating: 'S',
    note: 'Always go first. Extra attack + damage R1. Ambush master.',
  },
  {
    combo: 'Lucky + Halfling Luck',
    feats: ['Lucky', 'Halfling racial'],
    effect: '3 Lucky rerolls/LR + reroll all nat 1s. Almost impossible to critically fail.',
    bestFor: 'Halfling any class.',
    rating: 'A+',
    note: 'Safety net on everything. Very consistent.',
  },
  {
    combo: 'Crusher + Spirit Guardians',
    feats: ['Crusher', 'Spirit Guardians (spell)'],
    effect: 'Push enemy 5ft on hit. Push into Spirit Guardians = extra damage proc.',
    bestFor: 'Cleric.',
    rating: 'A',
    note: 'Hammer + Crusher: push enemies into your damage aura.',
  },
  {
    combo: 'Fey Touched + Misty Step + Gift of Alacrity',
    feats: ['Fey Touched'],
    effect: '+1 CHA/WIS/INT + free Misty Step + free Gift of Alacrity (1d8 to initiative).',
    bestFor: 'Any caster.',
    rating: 'S',
    note: 'Best half-feat. Misty Step escape + initiative boost.',
  },
  {
    combo: 'Resilient (CON) + War Caster',
    feats: ['Resilient (CON)', 'War Caster'],
    effect: 'Proficiency + advantage on concentration saves. Nearly unbreakable.',
    bestFor: 'Any concentration caster.',
    rating: 'S (but overkill)',
    note: 'Usually pick one. Both together = overkill unless critical.',
  },
];

export const FEAT_COMBO_BY_ROLE = {
  meleeDPS: ['Great Weapon Master + Polearm Master', 'GWM + Sentinel', 'PAM + Sentinel'],
  rangedDPS: ['Sharpshooter + Crossbow Expert', 'Sharpshooter + Elven Accuracy'],
  tank: ['PAM + Sentinel', 'Shield Master + Skill Expert', 'Tough + Heavy Armor Master'],
  caster: ['War Caster + Resilient (CON)', 'Fey Touched + Telekinetic', 'Alert + Lucky'],
  skillMonkey: ['Skill Expert + Prodigy', 'Observant + Alert'],
};

export const FEAT_SYNERGY_TIPS = [
  'PAM + Sentinel: best martial feat combo. Total battlefield control.',
  'GWM + Reckless Attack: Barbarian core. Advantage offsets -5.',
  'Sharpshooter + CBE: best ranged build. Three attacks at L5.',
  'Elven Accuracy + Steady Aim: triple advantage = nearly guaranteed hits.',
  'War Caster + PAM: Booming Blade OA at 10ft range.',
  'Fey Touched: best half-feat. Misty Step + Gift of Alacrity.',
  'Shield Master + Athletics Expertise: reliable BA shove prone.',
  'Alert + Gloom Stalker: always go first. Devastating R1.',
  'Don\'t take both War Caster AND Resilient (CON). One is usually enough.',
  'Plan feat combos at character creation. They define your build.',
];
