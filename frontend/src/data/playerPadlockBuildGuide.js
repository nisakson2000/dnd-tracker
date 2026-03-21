/**
 * playerPadlockBuildGuide.js
 * Player Mode: Padlock (Paladin + Warlock) multiclass build guide
 * Pure JS — no React dependencies.
 */

export const PADLOCK_OVERVIEW = {
  name: 'Padlock / Hexadin',
  classes: 'Paladin X / Hexblade Warlock 1-3',
  role: 'SAD melee powerhouse — CHA for attacks, smites, spells, and aura',
  playstyle: 'CHA-based attacks + short rest smite fuel + Eldritch Blast ranged option',
  rating: 'S',
  note: 'The most efficient Paladin multiclass. Hexblade makes Paladin fully CHA-dependent.',
};

export const PADLOCK_KEY_BENEFITS = [
  { benefit: 'CHA-based attacks (Hex Warrior)', detail: 'Use CHA for weapon attacks. Now CHA powers attacks, smites, spells, AND Aura of Protection.', rating: 'S' },
  { benefit: 'SR slot recovery', detail: 'Warlock slots recover on short rest. 1-2 extra smites per short rest.', rating: 'S' },
  { benefit: 'Shield spell', detail: 'Hexblade grants Shield. Plate + Shield + Shield spell = AC 25.', rating: 'A+' },
  { benefit: 'Eldritch Blast ranged option', detail: 'Paladins lack ranged damage. EB solves this completely.', rating: 'A+' },
  { benefit: 'Hexblade\'s Curse', detail: 'Bonus crit range (19-20) + PB to damage + heal on kill. Incredible on boss fights.', rating: 'A+' },
];

export const PADLOCK_BUILDS = [
  {
    build: 'Paladin 6+ / Warlock 1',
    split: 'Minimum Warlock investment',
    gets: 'CHA attacks, Hexblade\'s Curse, Shield spell, 1 L1 slot/SR',
    misses: 'No invocations, no Pact Boon, no EB scaling',
    rating: 'A+',
    note: 'Best for Paladin-focused builds that just want CHA attacks.',
  },
  {
    build: 'Paladin 6+ / Warlock 2',
    split: 'Optimal dip',
    gets: 'Above + 2 invocations (Agonizing Blast + Devil\'s Sight or Repelling Blast)',
    misses: 'No Pact Boon',
    rating: 'S',
    note: 'Sweet spot. CHA attacks + EB + invocations. Minimal Paladin delay.',
  },
  {
    build: 'Paladin 6+ / Warlock 3',
    split: 'Deep dip',
    gets: 'Above + Pact Boon (Blade for Pact Weapon, Chain for familiar)',
    misses: '1 more level off Paladin progression',
    rating: 'A+',
    note: 'Pact of the Blade: use greatsword with CHA. Chain: Gift of Ever-Living Ones.',
  },
];

export const PADLOCK_PROGRESSION = [
  { level: '1 (Paladin)', note: 'Heavy armor, shield, martial weapons. CHA + STR 13 minimum.' },
  { level: '2 (Paladin)', note: 'Divine Smite + Fighting Style (Defense or Dueling).' },
  { level: '3 (Warlock 1)', note: 'Hexblade patron. CHA attacks. Shield spell. Hexblade\'s Curse.' },
  { level: '4 (Warlock 2)', note: 'Invocations: Agonizing Blast + one more. EB is now viable ranged.' },
  { level: '5 (Paladin 3)', note: 'Oath selection. Vengeance or Conquest recommended.' },
  { level: '6 (Paladin 4)', note: 'ASI/Feat: +2 CHA or PAM.' },
  { level: '7 (Paladin 5)', note: 'Extra Attack. Major power spike.' },
  { level: '8 (Paladin 6)', note: 'Aura of Protection. THE reason to hit Paladin 6.' },
  { level: '9+ (Paladin X)', note: 'Continue Paladin for higher smites, aura improvements, oath features.' },
];

export const PADLOCK_STAT_PRIORITY = {
  primary: 'CHA (attacks, spells, smites, aura)',
  secondary: 'CON (HP, concentration)',
  tertiary: 'STR 13 (multiclass requirement only)',
  dump: 'INT, WIS (dangerous but necessary)',
  note: 'STR 13 + CHA 13 required for multiclass. After that, pump CHA to 20.',
};

export const PADLOCK_VS_SORCADIN = {
  padlock: {
    pros: ['SR slot recovery', 'CHA attacks (no STR needed)', 'Shield spell', 'Ranged option (EB)'],
    cons: ['Fewer total spell slots', 'No metamagic', 'Less spell variety'],
  },
  sorcadin: {
    pros: ['Metamagic (Quickened BB, Twinned buffs)', 'More spell slots', 'Cleric spells (Divine Soul)'],
    cons: ['MAD (needs STR or DEX)', 'No SR recovery', 'No ranged cantrip without feat'],
  },
  verdict: 'Padlock for simplicity and efficiency. Sorcadin for flexibility and burst damage.',
};
