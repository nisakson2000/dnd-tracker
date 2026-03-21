/**
 * playerOtherworldlyPatronGuide.js
 * Player Mode: All Warlock Otherworldly Patrons ranked
 * Pure JS — no React dependencies.
 */

export const OTHERWORLDLY_PATRONS_RANKED = [
  { patron: 'Hexblade', rating: 'S+', role: 'Melee/Versatile', key: 'CHA for attacks. Medium armor+shields. Curse: bonus damage + crit 19-20.', note: 'Best patron. Best 1-level dip in 5e.' },
  { patron: 'Genie', rating: 'S', role: 'Versatile', key: '+PB damage. Vessel rest. Flight L6. Limited Wish L14.', note: 'Complete package. Every feature is good.' },
  { patron: 'Fiend', rating: 'A+', role: 'Blaster/Tank', key: 'Temp HP on kills. +1d10 to save. Choose resistance. Fireball.', note: 'Great durability + blasting.' },
  { patron: 'Fathomless', rating: 'A+', role: 'Control', key: 'BA tentacle: 1d8 cold + slow. Swim + breathe underwater.', note: 'BA damage + slow every turn.' },
  { patron: 'Celestial', rating: 'A+', role: 'Healer', key: 'BA heal pool. CHA to fire/radiant damage. Party temp HP.', note: 'Healing Warlock. Unique niche.' },
  { patron: 'Archfey', rating: 'A', role: 'Control/Social', key: 'AoE charm/frighten. Invisible Misty Step L6.', note: 'Good control, outclassed by others.' },
  { patron: 'Great Old One', rating: 'A', role: 'Psychic', key: 'Telepathy 30ft. Entropic Ward (disadvantage → advantage).', note: 'Great flavor, okay mechanics.' },
  { patron: 'Undead', rating: 'A', role: 'Fear/Damage', key: 'Form of Dread: +1d8 necrotic + frighten on hit.', note: 'EB beam frightening is unique.' },
  { patron: 'Undying', rating: 'C+', role: 'Survival', key: 'Don\'t need food/water. Spare the dying. Slow aging.', note: 'Worst patron. Very underpowered.' },
];

export const PATRON_TIPS = [
  'Hexblade 1-level dip: CHA attacks + armor + Shield spell. Best multiclass dip.',
  'Genie Dao: bludgeoning bonus + Spike Growth on expanded list. Great combo.',
  'Fiend: Fireball on expanded list. Temp HP on kills sustains you.',
  'Celestial: the only Warlock that heals well. Great for parties without a Cleric.',
  'EB + Agonizing Blast: mandatory on every Warlock build.',
  'Short rest recovery: push for 2-3 short rests per day.',
  'Hexblade\'s Curse + Elven Accuracy: crit on 19-20 with triple advantage.',
  'Avoid Undying. Every other patron is significantly better.',
];
