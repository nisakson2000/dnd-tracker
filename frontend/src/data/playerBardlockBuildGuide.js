/**
 * playerBardlockBuildGuide.js
 * Player Mode: Bardlock (Bard + Warlock) multiclass build guide
 * Pure JS — no React dependencies.
 */

export const BARDLOCK_OVERVIEW = {
  name: 'Bardlock',
  classes: 'Bard X / Hexblade Warlock 1-2',
  role: 'CHA-based face character with armor, Shield spell, and EB ranged option',
  playstyle: 'Full Bard chassis + Hexblade durability + Eldritch Blast backup',
  rating: 'A+',
  note: 'Shores up Bard\'s weaknesses (AC, ranged damage) with minimal investment.',
};

export const BARDLOCK_BENEFITS = [
  { benefit: 'Medium armor + shield', detail: 'Hexblade grants medium armor and shields. Bard AC jumps from 11-14 to 17-19.', rating: 'S' },
  { benefit: 'Shield spell', detail: 'Hexblade expanded spells include Shield. Reaction +5 AC.', rating: 'S' },
  { benefit: 'Eldritch Blast', detail: 'Bards lack good ranged damage cantrips. EB + Agonizing Blast solves this.', rating: 'A+' },
  { benefit: 'Hexblade\'s Curse', detail: 'BA: target takes extra PB damage, expanded crit range, heal on kill.', rating: 'A' },
  { benefit: 'Short rest slots', detail: 'Warlock slots recover on SR. Extra spells for the Bard.', rating: 'A' },
];

export const BARDLOCK_BUILDS = [
  {
    build: 'Bard X / Warlock 1',
    gets: 'Medium armor, Shield, Hexblade\'s Curse, 1 L1 slot/SR',
    misses: 'No invocations, no EB power',
    rating: 'A',
    note: 'Minimum dip. Best for Bards who just want armor and Shield.',
  },
  {
    build: 'Bard X / Warlock 2',
    gets: 'Above + 2 invocations (Agonizing Blast + one more)',
    misses: 'No Pact Boon',
    rating: 'A+',
    note: 'Sweet spot. EB becomes a real damage option. Minimal Bard delay.',
  },
];

export const BARDLOCK_PROGRESSION = [
  { level: '1 (Bard)', note: 'Bardic Inspiration, spellcasting, CHA-based skills.' },
  { level: '2 (Warlock 1)', note: 'Hexblade: medium armor, shield, Shield spell, Hexblade\'s Curse.' },
  { level: '3 (Warlock 2)', note: 'Agonizing Blast + Mask of Many Faces (or Devil\'s Sight). EB online.' },
  { level: '4+ (Bard X)', note: 'All remaining levels in Bard. Expertise, Magical Secrets, subclass.' },
];

export const BARDLOCK_COLLEGES = [
  { college: 'Lore', rating: 'S', note: 'Additional Magical Secrets at L6. Cutting Words. Best caster Bard.' },
  { college: 'Eloquence', rating: 'S', note: 'Unsettling Words debuffs saves. Silver Tongue (min 10 on Persuasion/Deception).' },
  { college: 'Swords', rating: 'A+', note: 'Melee Bard + Hexblade CHA attacks = effective gish. Blade Flourishes.' },
  { college: 'Whispers', rating: 'A', note: 'Psychic Blades + Hexblade\'s Curse for burst damage. Social infiltration.' },
];

export const BARDLOCK_TIPS = [
  'Start Bard 1 for the full Bard skill proficiencies and CHA save.',
  'Warlock levels at 2-3 to get online fast, then never look back to Warlock.',
  'Mask of Many Faces (at-will Disguise Self) is incredible for a face character.',
  'Use EB + Agonizing for damage. Save Bard slots for utility and control.',
  'Warlock SR slots can fuel emergency Shield casts without burning Bard slots.',
  'CHA to 20 is priority #1. It powers Bard spells, EB, Inspiration, AND face skills.',
];
