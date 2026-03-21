/**
 * playerEldritchInvocationTierGuide.js
 * Player Mode: All Eldritch Invocations ranked by tier
 * Pure JS — no React dependencies.
 */

export const INVOCATIONS_S_TIER = [
  { invocation: 'Agonizing Blast', prereq: 'EB cantrip', effect: 'Add CHA mod to each EB beam.', note: 'Mandatory. EB without AB is mediocre. With it, best cantrip.' },
  { invocation: 'Repelling Blast', prereq: 'EB cantrip', effect: '10ft push per beam.', note: '40ft push at L17. Spike Growth + EB = devastating.' },
  { invocation: 'Devil\'s Sight', prereq: 'None', effect: 'See normally in darkness (magical and nonmagical) 120ft.', note: 'Darkness + Devil\'s Sight = advantage + disadvantage against you.' },
  { invocation: 'Mask of Many Faces', prereq: 'None', effect: 'Disguise Self at will.', note: 'Infinite disguises. Best social invocation.' },
  { invocation: 'Gift of the Ever-Living Ones', prereq: 'Pact of the Chain', effect: 'Max healing dice when familiar within 100ft.', note: 'All healing maximized. Healing Word = always max. Incredible.' },
  { invocation: 'Investment of the Chain Master', prereq: 'Pact of the Chain', effect: 'BA familiar attack, use your save DC, swim/fly 40ft.', note: 'Your familiar becomes a real combatant. Use spell save DC.' },
];

export const INVOCATIONS_A_TIER = [
  { invocation: 'Book of Ancient Secrets', prereq: 'Pact of the Tome', effect: 'Ritual casting from any class list. Learn ritual spells.', note: 'Detect Magic, Find Familiar, Comprehend Languages... all free.' },
  { invocation: 'Thirsting Blade', prereq: 'Pact of the Blade, L5', effect: 'Extra Attack with Pact Weapon.', note: 'Mandatory for Bladelock. No Extra Attack without this.' },
  { invocation: 'Lifedrinker', prereq: 'Pact of the Blade, L12', effect: 'Add CHA mod necrotic to Pact Weapon hits.', note: 'Extra CHA damage per hit. Significant DPR increase.' },
  { invocation: 'Eldritch Mind', prereq: 'None', effect: 'Advantage on concentration saves.', note: 'Free War Caster (concentration part). Excellent.' },
  { invocation: 'Grasp of Hadar', prereq: 'EB cantrip', effect: 'Pull target 10ft once per turn.', note: 'Pull into Spirit Guardians, Spike Growth. Positioning control.' },
  { invocation: 'Misty Visions', prereq: 'None', effect: 'Silent Image at will.', note: 'Unlimited illusions. Creative utility.' },
  { invocation: 'Sculptor of Flesh', prereq: 'L7', effect: 'Polymorph once per LR.', note: 'Free L4 spell. Emergency HP pool or disable enemy.' },
  { invocation: 'Tomb of Levistus', prereq: 'None', effect: 'Reaction: encase in ice when taking damage. 10×Warlock level temp HP. Incapacitated until end of next turn.', note: 'Emergency survival. Massive temp HP but you lose a turn.' },
];

export const INVOCATIONS_B_TIER = [
  { invocation: 'Lance of Lethargy', prereq: 'EB cantrip', effect: 'Reduce target speed by 10ft once per turn.', note: 'Kiting support. Stacks with difficult terrain.' },
  { invocation: 'Eldritch Spear', prereq: 'EB cantrip', effect: 'EB range = 300ft.', note: 'Overkill for most combats. Niche for outdoors.' },
  { invocation: 'Armor of Shadows', prereq: 'None', effect: 'Mage Armor at will.', note: 'AC 13+DEX without armor. Free. Good for non-Hexblades.' },
  { invocation: 'Fiendish Vigor', prereq: 'None', effect: 'False Life at will.', note: 'Free 1d4+4 temp HP. Recast until max (8). Pre-combat buffer.' },
  { invocation: 'Maddening Hex', prereq: 'L5, Hex spell or curse', effect: 'BA: CHA mod psychic damage to cursed target + creatures within 5ft.', note: 'Free BA damage. Decent with Hexblade\'s Curse.' },
  { invocation: 'Relentless Hex', prereq: 'L7, Hex spell or curse', effect: 'BA: teleport 30ft to within 5ft of cursed target.', note: 'Free teleport to your target. Chase down fleeing enemies.' },
  { invocation: 'Whispers of the Grave', prereq: 'L9', effect: 'Speak with Dead at will.', note: 'Unlimited interrogation of corpses. Great for investigation.' },
];

export const INVOCATIONS_C_TIER = [
  { invocation: 'Beast Speech', effect: 'Speak with Animals at will.', note: 'Very niche. Mostly RP utility.' },
  { invocation: 'Eyes of the Rune Keeper', effect: 'Read all writing.', note: 'Comprehend Languages exists. Redundant.' },
  { invocation: 'Beguiling Influence', effect: 'Proficiency in Deception and Persuasion.', note: 'Two skill proficiencies. OK but not exciting.' },
  { invocation: 'Eldritch Sight', effect: 'Detect Magic at will.', note: 'Book of Ancient Secrets gives this + more.' },
  { invocation: 'Undying Servitude', prereq: 'L5', effect: 'Animate Dead once per LR.', note: 'One zombie or skeleton. Not enough for an army.' },
];

export const INVOCATION_RECOMMENDATIONS = {
  blastlock: ['Agonizing Blast', 'Repelling Blast', 'Devil\'s Sight or Eldritch Mind'],
  bladelock: ['Thirsting Blade', 'Lifedrinker', 'Eldritch Mind', 'Devil\'s Sight'],
  chainlock: ['Investment of the Chain Master', 'Gift of the Ever-Living Ones', 'Agonizing Blast'],
  tomelock: ['Book of Ancient Secrets', 'Agonizing Blast', 'Mask of Many Faces'],
  social: ['Mask of Many Faces', 'Misty Visions', 'Beguiling Influence'],
};
