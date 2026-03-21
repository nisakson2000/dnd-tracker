/**
 * playerHalfElfRaceGuide.js
 * Player Mode: Half-Elf — the most versatile race
 * Pure JS — no React dependencies.
 */

export const HALF_ELF_BASICS = {
  race: 'Half-Elf',
  source: 'Player\'s Handbook',
  asis: '+2 CHA, +1 to two other stats of your choice',
  speed: '30ft',
  size: 'Medium',
  darkvision: '60ft',
  note: 'The most versatile PHB race. +2 CHA + two floating +1s. Fey Ancestry. Two extra skill proficiencies. Works with every CHA class and most others. Arguably the strongest PHB race.',
};

export const HALF_ELF_TRAITS = [
  { trait: 'Ability Score Increase', effect: '+2 CHA, +1 to two other ability scores of your choice.', note: 'Three stats boosted. CHA + any two. Perfect for MAD classes like Paladin (STR+CHA+CON) or Bard (DEX+CHA+CON).' },
  { trait: 'Fey Ancestry', effect: 'Advantage on saves vs charmed. Can\'t be put to sleep by magic.', note: 'Charm protection is always useful. Sleep immunity matters early game.' },
  { trait: 'Skill Versatility', effect: 'Proficiency in two skills of your choice.', note: 'Two free skills. On top of class skills. Incredibly flexible.' },
  { trait: 'Darkvision', effect: '60ft darkvision.', note: 'Standard. Nice to have.' },
];

export const HALF_ELF_VARIANTS = [
  { variant: 'SCAG: Elf Weapon Training', replaces: 'Skill Versatility', effect: 'Proficiency with longsword, shortsword, shortbow, longbow.', note: 'Useful for Bard/Warlock who want martial weapons without multiclass.' },
  { variant: 'SCAG: Cantrip (High Elf)', replaces: 'Skill Versatility', effect: 'One Wizard cantrip (INT casting stat).', note: 'Booming Blade or Minor Illusion. Good for Hexblade or melee builds.' },
  { variant: 'SCAG: Fleet of Foot (Wood Elf)', replaces: 'Skill Versatility', effect: '35ft walking speed.', note: '+5ft speed. Minor but sometimes better than two skills.' },
  { variant: 'SCAG: Mask of the Wild (Wood Elf)', replaces: 'Skill Versatility', effect: 'Hide when lightly obscured by natural phenomena.', note: 'Niche. Hide in rain, fog, foliage. Rangers love it.' },
  { variant: 'SCAG: Drow Magic', replaces: 'Skill Versatility', effect: 'Dancing Lights cantrip. At L3: Faerie Fire 1/LR. At L5: Darkness 1/LR.', note: 'Free Faerie Fire = party advantage. Best SCAG variant for many builds.' },
  { variant: 'SCAG: Swim Speed (Aquatic)', replaces: 'Skill Versatility', effect: '30ft swim speed.', note: 'Aquatic campaigns only.' },
];

export const HALF_ELF_CLASS_SYNERGY = [
  { class: 'Paladin', priority: 'S', reason: '+2 CHA, +1 STR, +1 CON. Three key Paladin stats boosted. Fey Ancestry. Two skills. Best Paladin race.' },
  { class: 'Bard', priority: 'S', reason: '+2 CHA, +1 DEX, +1 CON. Two extra skills on a skill monkey. Best Bard race.' },
  { class: 'Warlock', priority: 'S', reason: '+2 CHA. Flexible +1s. Fey Ancestry for charm protection. Two skills. Versatile.' },
  { class: 'Sorcerer', priority: 'S', reason: '+2 CHA, +1 CON (concentration). Fey Ancestry. Two skills for a skill-poor class.' },
  { class: 'Any CHA class', priority: 'A+', reason: '+2 CHA + flexibility makes Half-Elf great for any CHA-based character.' },
  { class: 'Ranger/Druid', priority: 'B', reason: 'No WIS bonus. CHA less useful. Still gets Fey Ancestry and skills.' },
];

export const HALF_ELF_TACTICS = [
  { tactic: 'MAD class enabler', detail: 'Paladin: CHA 16, STR 16, CON 14 with point buy + Half-Elf. No other race matches this spread.', rating: 'S' },
  { tactic: 'Skill monkey enhancement', detail: 'Bard with Half-Elf: class skills + Expertise + 2 bonus Half-Elf skills = proficiency in almost everything.', rating: 'S' },
  { tactic: 'Drow Magic Faerie Fire', detail: 'SCAG variant: free Faerie Fire 1/LR. Party-wide advantage on attacks. Better than 2 skill proficiencies.', rating: 'S' },
  { tactic: 'Fey Ancestry protection', detail: 'Advantage vs charm is always relevant. Protect against Charm Person, Hypnotic Pattern, vampire charm.', rating: 'A' },
];

export function halfElfPointBuy(primaryStat, secondaryStat) {
  return {
    CHA: 17,
    [primaryStat]: 16,
    [secondaryStat]: 14,
    note: 'Standard Half-Elf point buy. CHA 15+2=17, primary 15+1=16, secondary 13+1=14.',
  };
}
