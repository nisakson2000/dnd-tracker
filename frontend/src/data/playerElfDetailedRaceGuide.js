/**
 * playerElfDetailedRaceGuide.js
 * Player Mode: Elf (all subraces) — the versatile fey
 * Pure JS — no React dependencies.
 */

export const ELF_BASICS = {
  race: 'Elf',
  source: 'Player\'s Handbook / Mordenkainen\'s Tome of Foes',
  asis: '+2 DEX (all)',
  speed: '30ft',
  size: 'Medium',
  darkvision: '60ft',
  note: 'DEX race with multiple strong subraces. Trance (4hr rest), Fey Ancestry (charm advantage), Perception proficiency. High Elf gets cantrip. Wood Elf gets speed + stealth. Drow gets spells.',
};

export const ELF_COMMON_TRAITS = [
  { trait: 'Fey Ancestry', effect: 'Advantage on saves vs charmed. Can\'t be put to sleep by magic.', note: 'Charm protection + sleep immunity. Strong defensive trait.' },
  { trait: 'Trance', effect: 'Don\'t sleep. 4 hours of trance = 8 hours long rest. Remain semiconscious.', note: '4-hour rests. Extra watch time. Semiconscious = aware of surroundings.' },
  { trait: 'Keen Senses', effect: 'Proficiency in Perception.', note: 'Free Perception. Best skill in the game.' },
];

export const ELF_SUBRACES = {
  high: {
    name: 'High Elf',
    asis: '+1 INT',
    traits: [
      { trait: 'Cantrip', effect: 'One Wizard cantrip of choice. INT is casting stat.', note: 'Booming Blade for melee, Minor Illusion for utility, or Prestidigitation for flavor. Free cantrip is great.' },
      { trait: 'Elf Weapon Training', effect: 'Proficiency with longsword, shortsword, shortbow, longbow.', note: 'Weapon proficiency for casters. Longbow on a Wizard.' },
      { trait: 'Extra Language', effect: 'One extra language.', note: 'Minor utility.' },
    ],
    rating: 'A',
    note: 'Free Wizard cantrip makes any class better. Booming Blade on a Cleric, Minor Illusion on a Rogue.',
  },
  wood: {
    name: 'Wood Elf',
    asis: '+1 WIS',
    traits: [
      { trait: 'Fleet of Foot', effect: '35ft walking speed.', note: '+5ft speed. Adds up over a campaign. Better positioning.' },
      { trait: 'Mask of the Wild', effect: 'Hide when lightly obscured by natural phenomena (rain, fog, foliage).', note: 'Hide in natural cover. Rangers and Druids love this. Situational but powerful outdoors.' },
      { trait: 'Elf Weapon Training', effect: 'Longsword, shortsword, shortbow, longbow.', note: 'Same weapon proficiency as High Elf.' },
    ],
    rating: 'A',
    note: 'Best for Rangers, Monks, Druids. WIS bonus + speed + natural stealth. The outdoor specialist.',
  },
  drow: {
    name: 'Drow (Dark Elf)',
    asis: '+1 CHA',
    traits: [
      { trait: 'Superior Darkvision', effect: '120ft darkvision.', note: 'Double range. See further in the dark than anyone.' },
      { trait: 'Sunlight Sensitivity', effect: 'Disadvantage on attacks and Perception in direct sunlight.', note: 'Major drawback. Outdoors in daytime = weakened. Underdark campaigns avoid this.' },
      { trait: 'Drow Magic', effect: 'Dancing Lights cantrip. At L3: Faerie Fire 1/LR. At L5: Darkness 1/LR. CHA casting.', note: 'Free Faerie Fire = party advantage. Darkness + Devil\'s Sight combo. Great spells.' },
      { trait: 'Drow Weapon Training', effect: 'Rapiers, shortswords, hand crossbows.', note: 'Hand crossbow proficiency for CBE builds on any class.' },
    ],
    rating: 'A',
    note: 'Powerful spells offset Sunlight Sensitivity. Faerie Fire is incredible. Best for underground campaigns.',
  },
  shadarKai: {
    name: 'Shadar-kai (Elf)',
    asis: '+1 CON',
    source: 'Mordenkainen\'s Tome of Foes',
    traits: [
      { trait: 'Blessing of the Raven Queen', effect: 'BA: teleport 30ft. After teleport: resistance to ALL damage until start of next turn. Once per long rest (PB/LR in MotM).', note: 'Misty Step as BA + full resistance for a round. Incredible defensive and repositioning tool.' },
      { trait: 'Necrotic Resistance', effect: 'Resistance to necrotic damage.', note: 'Necrotic is common from undead. Solid resistance.' },
    ],
    rating: 'S',
    note: 'Best combat Elf. Free teleport + damage resistance. CON bonus for concentration. Excellent for any class.',
  },
  eladrin: {
    name: 'Eladrin (Elf)',
    asis: '+1 CHA',
    source: 'Mordenkainen\'s Tome of Foes',
    traits: [
      { trait: 'Fey Step', effect: 'BA: teleport 30ft. Once per short rest (PB/LR in MotM). Each season adds an effect.', note: 'Free Misty Step per SR. Season effects: Spring (teleport ally), Summer (fire damage), Autumn (charm), Winter (frighten).' },
    ],
    rating: 'A+',
    note: 'Free Misty Step per SR. Season effects add versatility. Autumn charm and Winter frighten are strongest.',
  },
};

export const ELF_CLASS_SYNERGY = [
  { subrace: 'Wood', class: 'Ranger/Monk', priority: 'S', reason: 'DEX+WIS. Speed. Mask of Wild. Natural stealth. Perfect fit.' },
  { subrace: 'High', class: 'Wizard/Bladesinger', priority: 'S', reason: 'DEX+INT. Free cantrip. Weapon proficiency. Bladesinger thematic fit.' },
  { subrace: 'Shadar-kai', class: 'Any', priority: 'S', reason: 'DEX+CON. Free teleport + resistance. Best combat Elf for any class.' },
  { subrace: 'Drow', class: 'Warlock/Sorcerer', priority: 'A', reason: 'CHA. Free Faerie Fire. Darkness + Devil\'s Sight. Superior Darkvision.' },
  { subrace: 'Eladrin', class: 'Paladin/Bard', priority: 'A', reason: 'CHA. Free Misty Step per SR. Season effects for control.' },
];

export function feyStepSeasonEffect(season) {
  const effects = {
    spring: 'Teleport a willing ally within 5ft instead of yourself.',
    summer: 'Each creature within 5ft of departure: WIS save or 1d6+CHA fire damage.',
    autumn: 'Up to 2 creatures within 10ft: WIS save or charmed until end of next turn.',
    winter: 'One creature within 5ft: WIS save or frightened until end of your next turn.',
  };
  return effects[season] || 'Unknown season';
}
