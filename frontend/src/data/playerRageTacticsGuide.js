/**
 * playerRageTacticsGuide.js
 * Player Mode: Barbarian Rage — optimization, mechanics, and tactical use
 * Pure JS — no React dependencies.
 */

export const RAGE_RULES = {
  activation: 'Bonus Action. Lasts 1 minute.',
  rages: '2/LR at L1, up to 6/LR at L17. Unlimited at L20.',
  damage: '+2 (L1-8), +3 (L9-15), +4 (L16+). Melee STR attacks only.',
  resistance: 'Resistance to bludgeoning, piercing, slashing.',
  endConditions: 'Ends if: you don\'t attack or take damage for a turn, you cast a spell, or you choose to end it.',
  restrictions: 'Can\'t cast spells or concentrate on spells while raging.',
  note: 'Rage effectively doubles your HP against physical damage.',
};

export const RAGE_DAMAGE_BY_LEVEL = [
  { levels: '1-8', bonus: '+2', note: 'Solid early bonus.' },
  { levels: '9-15', bonus: '+3', note: 'Extra +1 per hit adds up with Extra Attack.' },
  { levels: '16-20', bonus: '+4', note: 'Maximum rage damage.' },
];

export const SUBCLASS_RAGE_FEATURES = [
  { subclass: 'Totem (Bear)', feature: 'Resistance to ALL damage except psychic while raging.', rating: 'S+' },
  { subclass: 'Totem (Wolf)', feature: 'Allies have advantage on melee attacks vs enemies within 5ft of you.', rating: 'A+' },
  { subclass: 'Zealot', feature: '1d6+half level radiant/necrotic on first hit each round.', rating: 'S' },
  { subclass: 'Ancestral Guardian', feature: 'First creature you hit has disadvantage attacking anyone but you.', rating: 'S' },
  { subclass: 'Beast', feature: 'Natural weapons while raging. Claws = 3 attacks at L5.', rating: 'A+' },
  { subclass: 'Wild Magic', feature: 'Random magical effects when raging.', rating: 'A' },
  { subclass: 'Berserker', feature: 'BA attack each round. Exhaustion when rage ends.', rating: 'B' },
];

export const RAGE_TACTICS = [
  { tactic: 'Reckless + Rage', effect: 'Advantage on attacks. Resistance offsets enemies having advantage on you.', rating: 'S+' },
  { tactic: 'GWM + Reckless + Rage', effect: '-5/+10 with advantage + rage damage. Highest sustained melee DPR.', rating: 'S+' },
  { tactic: 'Grapple while Raging', effect: 'Advantage on Athletics. Control enemies. Drag into hazards.', rating: 'A+' },
  { tactic: 'Bear Totem Tank', effect: 'Resist all damage. Reckless draws aggro. Party deals free damage.', rating: 'S+' },
  { tactic: 'Maintain Rage', effect: 'Must attack or take damage each turn. Throw handaxes if enemies flee.', rating: 'Important' },
];

export const RAGE_TIPS = [
  'Rage = BA. Can\'t also use BA abilities on the turn you start raging.',
  'Bear Totem: resistance to ALL damage except psychic. Best tank in the game.',
  'Reckless + GWM: advantage offsets -5 penalty. Best melee DPR combo.',
  'Must attack or take damage each turn to maintain rage.',
  'Can\'t cast spells while raging. Pre-buff before raging if multiclassed.',
  'Rage damage only applies to melee STR attacks. Not ranged, not DEX.',
  'Berserker Frenzy: only use for boss fights. Exhaustion is brutal.',
  'Danger Sense: advantage on DEX saves you can see. Pairs with rage resistance.',
  'L20: unlimited rages. Never stop raging. Always raging.',
  'Zealot L14: can\'t die while raging. Keep fighting past 0 HP.',
];
