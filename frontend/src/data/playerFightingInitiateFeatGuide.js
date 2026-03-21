/**
 * playerFightingInitiateFeatGuide.js
 * Player Mode: Fighting Initiate feat — martial fighting styles for anyone
 * Pure JS — no React dependencies.
 */

export const FIGHTING_INITIATE_BASICS = {
  feat: 'Fighting Initiate',
  source: "Tasha's Cauldron of Everything",
  prerequisite: 'Proficiency with a martial weapon',
  benefit: 'Learn one Fighting Style from the Fighter list. Can swap on Fighter ASI levels.',
  note: 'Great for classes that don\'t get fighting styles or want a second one. Martial weapon proficiency means most classes qualify.',
};

export const FIGHTING_STYLES_RANKED = [
  {
    name: 'Dueling',
    effect: '+2 damage with one-handed melee weapon (other hand empty or shield).',
    rating: 'S',
    bestFor: 'Sword-and-board builds. +2 damage is significant and consistent.',
    note: 'Works with shield. Longsword + Shield + Dueling = 1d8+2+STR. Excellent sustained damage.',
  },
  {
    name: 'Great Weapon Fighting',
    effect: 'Reroll 1s and 2s on damage dice with two-handed/versatile weapons.',
    rating: 'B+',
    bestFor: 'Greatsword/Maul users. Average +1.33 damage per attack with 2d6.',
    note: 'Sounds great but only adds ~1 DPR. Mathematically underwhelming. Still fine for two-handers.',
  },
  {
    name: 'Defense',
    effect: '+1 AC while wearing armor.',
    rating: 'A',
    bestFor: 'Any armored character. +1 AC is always useful.',
    note: 'Simple but effective. Best second fighting style via Fighting Initiate.',
  },
  {
    name: 'Archery',
    effect: '+2 to ranged weapon attack rolls.',
    rating: 'S',
    bestFor: 'Any ranged weapon user. +2 to hit is massive (10% more hits).',
    note: 'Best fighting style mathematically. +2 to hit > +2 to damage in most scenarios.',
  },
  {
    name: 'Blind Fighting',
    effect: 'Blindsight 10ft. Can see invisible creatures within 10ft.',
    rating: 'A',
    bestFor: 'Darkness spell users. Pairs with Darkness for the blind fighting combo.',
    note: '10ft range is short. Best for melee characters in magical darkness.',
  },
  {
    name: 'Interception',
    effect: 'Reaction: reduce damage to adjacent ally by 1d10+PB.',
    rating: 'B+',
    bestFor: 'Tanks protecting squishy allies. Scales with PB.',
    note: 'Better than Protection style in most cases. No shield required.',
  },
  {
    name: 'Protection',
    effect: 'Reaction: impose disadvantage on attack against adjacent ally (requires shield).',
    rating: 'B',
    bestFor: 'Shield tanks. Disadvantage is powerful but situational.',
    note: 'Requires shield. Must be adjacent to ally. Only works on attacks, not saves.',
  },
  {
    name: 'Two-Weapon Fighting',
    effect: 'Add ability mod to off-hand attack damage.',
    rating: 'B',
    bestFor: 'Dual wielders. Essential for TWF builds but TWF itself is suboptimal.',
    note: 'Necessary if you\'re doing TWF. But TWF builds trail GWM/PAM builds.',
  },
  {
    name: 'Thrown Weapon Fighting',
    effect: '+2 damage with thrown weapons. Draw thrown weapon as part of attack.',
    rating: 'C',
    bestFor: 'Thrown weapon builds (javelins, daggers, handaxes). Very niche.',
    note: 'Solves the drawing problem. +2 damage is nice. But thrown builds are rare.',
  },
  {
    name: 'Unarmed Fighting',
    effect: '1d6+STR unarmed (1d8 if both hands free). Grapple deals 1d4 damage per turn.',
    rating: 'B',
    bestFor: 'Grappler builds. Monks don\'t need this. Fighters/Barbarians who grapple love it.',
    note: 'Makes unarmed strikes viable. Grapple damage is auto-hit. Good with Tavern Brawler.',
  },
  {
    name: 'Superior Technique',
    effect: 'Learn one Battle Master maneuver. 1 superiority die (d6).',
    rating: 'C',
    bestFor: 'Non-Battle Masters wanting a maneuver. 1d6 once per SR is very limited.',
    note: 'One use per SR. D6 (not d8+). Severely limited. Better to multiclass if you want maneuvers.',
  },
  {
    name: 'Blessed Warrior',
    effect: 'Learn 2 Cleric cantrips. Use CHA for them.',
    rating: 'C',
    bestFor: 'Paladins wanting Guidance + Toll the Dead.',
    note: 'Paladin-only. Guidance is always good. But Paladins already have strong options.',
  },
  {
    name: 'Druidic Warrior',
    effect: 'Learn 2 Druid cantrips. Use WIS for them.',
    rating: 'B',
    bestFor: 'Rangers wanting Shillelagh (WIS attacks) + Thorn Whip.',
    note: 'Ranger-only. Shillelagh makes Rangers SAD (WIS only). Strong for melee Rangers.',
  },
];

export const FEAT_VALUE_BY_CLASS = [
  { class: 'Barbarian', rating: 'A', pick: 'Defense (if lacking)', reason: '+1 AC. Barbarians don\'t get fighting styles. Simple and effective.' },
  { class: 'Rogue', rating: 'B', pick: 'Archery or Blind Fighting', reason: 'Archery for ranged Rogues. Blind Fighting for niche builds.' },
  { class: 'Monk', rating: 'C', pick: 'Blind Fighting', reason: 'Most styles conflict with Monk features. Blind Fighting is the exception.' },
  { class: 'Cleric', rating: 'B', pick: 'Defense or Blind Fighting', reason: 'Armored Clerics want +1 AC. BF for darkness combos.' },
  { class: 'Fighter (already has style)', rating: 'B', pick: 'Defense as second style', reason: 'Stacks with first style. +1 AC is always good.' },
];
