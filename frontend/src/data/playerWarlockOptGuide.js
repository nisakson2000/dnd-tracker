/**
 * playerWarlockOptGuide.js
 * Player Mode: Warlock optimization — Eldritch Blast, invocations, patrons, builds
 * Pure JS — no React dependencies.
 */

export const WARLOCK_CORE = {
  strengths: ['Eldritch Blast: best cantrip in the game.', 'Pact Magic: few slots but recover on short rest.', 'Invocations: customizable abilities.', 'Great multiclass class.'],
  weaknesses: ['Very few spell slots (1-4 total).', 'Limited spell variety.', 'Short rest dependent.', 'Can feel repetitive (EB spam).'],
  stats: 'CHA > CON > DEX. CHA is everything.',
  key: 'Eldritch Blast + Agonizing Blast = your damage. Slots are for emergencies.',
};

export const ELDRITCH_BLAST_OPTIMIZATION = {
  baseDamage: '1d10 force per beam. 2 beams at L5, 3 at L11, 4 at L17.',
  forceType: 'Force damage is resisted by almost nothing.',
  invocations: [
    { name: 'Agonizing Blast', effect: '+CHA to damage per beam. +5 per hit at CHA 20.', rating: 'S+ (MANDATORY)', note: 'Without this, EB is mediocre. With it, best cantrip.' },
    { name: 'Repelling Blast', effect: 'Push target 10ft per beam. No save.', rating: 'S', note: '40ft push at L17. Combo with Spike Growth (2d4/5ft) or cliffs.' },
    { name: 'Grasp of Hadar', effect: 'Pull one target 10ft closer. Once per turn.', rating: 'A', note: 'Pull into AoE effects or melee range.' },
    { name: 'Lance of Lethargy', effect: 'Reduce speed by 10ft. Once per turn.', rating: 'A', note: 'Kiting. Reduce their ability to reach you.' },
  ],
  dpr: {
    level5: '2 beams × (1d10 + 5) = average 21 DPR (if both hit)',
    level11: '3 beams × (1d10 + 5) = average 31.5 DPR',
    level17: '4 beams × (1d10 + 5) = average 42 DPR',
    note: 'This is cantrip damage. No resources spent. All day.',
  },
};

export const PATRON_RANKINGS = [
  { patron: 'Hexblade', rating: 'S+', why: 'CHA for weapon attacks. Medium armor + shields. Hexblade\'s Curse.', note: 'Best patron. Fixes Warlock melee. Best multiclass dip.' },
  { patron: 'Genie', rating: 'S', why: 'Extra damage (PB/turn). Bottled Respite (safe space). Wish at L9 spell.', note: 'Great utility + damage. Dao: bludgeoning. Djinni: thunder.' },
  { patron: 'Fiend', rating: 'A+', why: 'Temp HP on kills. Fireball at L5. Dark One\'s Own Luck (add d10 to check).', note: 'Blaster Warlock. Temp HP sustains you through fights.' },
  { patron: 'Celestial', rating: 'A+', why: 'Healing Light (BA healing). Cure Wounds, Revivify on spell list.', note: 'Healer Warlock. Unique niche. Healing + EB damage.' },
  { patron: 'Archfey', rating: 'A', why: 'Fey Presence (charm/frighten AoE). Misty Escape (free Misty Step when hit).', note: 'Defensive and control-focused. Good spell list.' },
  { patron: 'Great Old One', rating: 'A', why: 'Telepathy. Entropic Ward (impose disadvantage, gain advantage). Psychic spells.', note: 'Infiltration and control. Campaign-dependent.' },
  { patron: 'Fathomless', rating: 'B+', why: 'Tentacle BA attack. Swim speed. Cold damage focus.', note: 'Aquatic campaigns. Tentacle is decent consistent damage.' },
  { patron: 'Undead', rating: 'A+', why: 'Form of Dread: frighten on hit. Necrotic Husk (death save cheat).', note: 'Van Richten\'s. Frighten synergy. Good survivability.' },
  { patron: 'Undying', rating: 'C', why: 'Weak features. Among the Dead (spare dying cantrip, undead ignore you).', note: 'Worst patron. SCAG. Avoid.' },
];

export const INVOCATION_RANKINGS = [
  { name: 'Agonizing Blast', level: 2, rating: 'S+', why: '+CHA per beam. Mandatory. No discussion.' },
  { name: 'Repelling Blast', level: 2, rating: 'S', why: '10ft push per beam. No save. Incredible control.' },
  { name: 'Devil\'s Sight', level: 2, rating: 'S', why: 'See in magical darkness. Darkness spell = advantage + enemy disadvantage.' },
  { name: 'Mask of Many Faces', level: 2, rating: 'A+', why: 'At-will Disguise Self. Infinite social utility.' },
  { name: 'Misty Visions', level: 2, rating: 'A+', why: 'At-will Silent Image. Creative uses are endless.' },
  { name: 'Eldritch Smite', level: 5, rating: 'S (Blade)', why: '1d8+1d8/slot force + prone (no save for Large or smaller). Pact Weapon only.' },
  { name: 'Thirsting Blade', level: 5, rating: 'S (Blade)', why: 'Extra Attack. Required for Blade Pact.' },
  { name: 'Lifedrinker', level: 12, rating: 'A+ (Blade)', why: '+CHA necrotic on melee. Stacks with other bonuses.' },
  { name: 'Book of Ancient Secrets', level: 2, rating: 'S (Tome)', why: 'Learn any ritual spell. Identify, Detect Magic, Comprehend Languages.' },
  { name: 'Investment of the Chain Master', level: 2, rating: 'S (Chain)', why: 'Imp/Sprite: BA attack, use your DC, fly. Incredible familiar.' },
  { name: 'Sculptor of Flesh', level: 7, rating: 'A', why: 'Polymorph once/LR. Free L4 spell = Giant Ape.' },
  { name: 'Tomb of Levistus', level: 5, rating: 'A', why: 'Reaction: 10× Warlock level temp HP. Encased in ice. Survival clutch.' },
];

export const WARLOCK_BUILD_TIPS = [
  'Agonizing Blast: mandatory. EB without it is pointless.',
  'Hexblade: best patron. CHA for attacks. Medium armor + shields.',
  'EB + Repelling Blast + Spike Growth = 2d4 per 5ft pushed. Insane combo.',
  'Devil\'s Sight + Darkness: you see, enemies don\'t. Advantage + disadvantage.',
  'Pact slots recover on short rest. Use them freely.',
  'Genie patron: Wish at L17. Best capstone if you reach it.',
  'Multiclass: Sorcerer (Sorlock), Paladin (Padlock), Bard. All amazing.',
  'Hexblade 1 dip: CHA attacks + medium armor + Shield spell. Best dip.',
  'Book of Ancient Secrets: ritual casting from any class list.',
  'Investment of Chain Master: imp familiar with your save DC. Amazing.',
];
