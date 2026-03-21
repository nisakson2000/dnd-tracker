/**
 * playerHalfFeatGuide.js
 * Player Mode: Half-feats (+1 to a stat + feat benefit) ranked and analyzed
 * Pure JS — no React dependencies.
 */

export const HALF_FEAT_RANKINGS = [
  { feat: 'Resilient (any)', stat: '+1 to chosen ability', rating: 'S+', effect: 'Gain saving throw proficiency in chosen ability.', note: 'Resilient (CON): +1 CON + CON save prof. Best for casters. Odd CON → even.' },
  { feat: 'Fey Touched', stat: '+1 INT/WIS/CHA', rating: 'S+', effect: 'Learn Misty Step + 1 divination/enchantment spell (L1). Free cast 1/day each.', note: 'Free Misty Step + free spell. Best half-feat for most builds.' },
  { feat: 'Shadow Touched', stat: '+1 INT/WIS/CHA', rating: 'A+', effect: 'Learn Invisibility + 1 illusion/necromancy spell (L1). Free cast 1/day each.', note: 'Free Invisibility. Good for stealth/utility builds.' },
  { feat: 'Skill Expert', stat: '+1 to any ability', rating: 'A+', effect: '+1 skill proficiency + 1 expertise.', note: 'Athletics expertise for grapplers. Any skill for specialists.' },
  { feat: 'Elven Accuracy', stat: '+1 DEX/INT/WIS/CHA', rating: 'S (Elf/Half-Elf)', effect: 'Roll 3d20 with advantage on DEX/INT/WIS/CHA attacks.', note: 'Triple advantage. 14.3% crit. Elf/Half-Elf only.' },
  { feat: 'Telekinetic', stat: '+1 INT/WIS/CHA', rating: 'A', effect: 'Invisible Mage Hand. Bonus action: shove 5ft (STR save).', note: 'Bonus action shove. Move allies out of danger. No attack needed.' },
  { feat: 'Telepathic', stat: '+1 INT/WIS/CHA', rating: 'B+', effect: 'Telepathy 60ft. Cast Detect Thoughts free 1/day.', note: 'Silent communication + free Detect Thoughts.' },
  { feat: 'Observant', stat: '+1 INT/WIS', rating: 'A', effect: '+5 to passive Perception and passive Investigation.', note: 'Passive Perception 20+. Catch traps and ambushes.' },
  { feat: 'Actor', stat: '+1 CHA', rating: 'B+', effect: 'Advantage on Deception/Performance to pass as someone else. Mimic voices.', note: 'Social infiltration build. Changeling doesn\'t need this.' },
  { feat: 'Crusher/Piercer/Slasher', stat: '+1 STR or DEX', rating: 'A', effect: 'Weapon type bonus + enhanced crit effect.', note: 'Crusher: push 5ft. Piercer: reroll 1 die. Slasher: reduce speed.' },
  { feat: 'Chef', stat: '+1 CON or WIS', rating: 'A', effect: 'Short rest: +1d8 HP one ally. Cook treats: prof bonus allies get 1d8 temp HP.', note: 'Party healing + temp HP. Great support feat.' },
  { feat: 'Fighting Initiate', stat: 'None (not a half-feat)', rating: 'A', effect: 'Learn a Fighting Style.', note: 'Not technically a half-feat. Included for comparison.' },
];

export const ODD_STAT_STRATEGY = {
  concept: 'Half-feats give +1 to a stat. Best when your key stat is ODD (15, 17, 19).',
  why: '+1 turns odd to even = +1 modifier. 17 → 18 = +3 to +4.',
  planning: 'At character creation, leave one key stat at an odd number. Take half-feat at L4.',
  example: 'Point Buy: 15 CHA Warlock. L4: Fey Touched (+1 CHA → 16) + Misty Step.',
};

export const HALF_FEAT_BY_STAT = {
  str: ['Crusher (+1 STR)', 'Skill Expert (+1 any)', 'Resilient (+1 STR)'],
  dex: ['Piercer (+1 DEX)', 'Slasher (+1 DEX)', 'Elven Accuracy (+1 DEX)', 'Skill Expert'],
  con: ['Resilient CON (+1 CON, CON save prof)', 'Chef (+1 CON)', 'Skill Expert'],
  int: ['Fey Touched (+1 INT)', 'Shadow Touched (+1 INT)', 'Observant (+1 INT)', 'Telekinetic (+1 INT)'],
  wis: ['Fey Touched (+1 WIS)', 'Shadow Touched (+1 WIS)', 'Observant (+1 WIS)', 'Chef (+1 WIS)'],
  cha: ['Fey Touched (+1 CHA)', 'Shadow Touched (+1 CHA)', 'Elven Accuracy (+1 CHA)', 'Actor (+1 CHA)'],
};

export const HALF_FEAT_TIPS = [
  'Half-feats: +1 stat + feat benefit. Best when key stat is odd.',
  'Fey Touched: best half-feat for most builds. Free Misty Step.',
  'Resilient (CON): +1 CON + save proficiency. Essential for casters.',
  'Elven Accuracy: triple advantage. Elf/Half-Elf only. 14.3% crit.',
  'Skill Expert: expertise in any skill. Athletics for grapplers.',
  'Plan odd stats at creation. Half-feat rounds them up.',
  'Shadow Touched: free Invisibility. Great for stealth builds.',
  'Telekinetic: bonus action shove. Move allies out of danger.',
  'Observant: +5 passive Perception. Catch everything.',
  'Chef: party healing on short rest + temp HP treats.',
];
