/**
 * playerElfGuide.js
 * Player Mode: Elf race variants and optimization
 * Pure JS — no React dependencies.
 */

export const ELF_TRAITS = {
  asi: '+2 DEX',
  size: 'Medium',
  speed: '30ft',
  darkvision: '60ft',
  keenSenses: 'Proficiency in Perception.',
  feyAncestry: 'Advantage on saves vs charmed. Immune to magical sleep.',
  trance: '4 hours of trance = 8 hours long rest. Remain conscious.',
};

export const ELF_SUBTYPES = [
  {
    subtype: 'High Elf',
    asi: '+1 INT',
    traits: 'One Wizard cantrip (INT). Longsword, shortsword, shortbow, longbow proficiency. One extra language.',
    bestFor: 'Wizard, Bladesinger (required), Fighter (EK), any INT build.',
    rating: 'A',
    note: 'Free Booming Blade cantrip is excellent for EK/Bladesinger.',
  },
  {
    subtype: 'Wood Elf',
    asi: '+1 WIS',
    traits: '35ft speed. Mask of the Wild (hide in natural phenomena). Elf weapon training.',
    bestFor: 'Ranger, Druid, Monk, Rogue (stealth build).',
    rating: 'A',
    note: '35ft speed is huge. Fastest non-magical base speed (tied with Centaur).',
  },
  {
    subtype: 'Drow (Dark Elf)',
    asi: '+1 CHA',
    traits: 'Superior Darkvision 120ft. Sunlight Sensitivity. Dancing Lights, Faerie Fire (3), Darkness (5).',
    bestFor: 'Warlock, Sorcerer, Bard, Paladin. Underdark campaigns.',
    rating: 'A (underground) / B (surface)',
    note: 'Sunlight Sensitivity is a real cost. Faerie Fire is strong though.',
  },
  {
    subtype: 'Eladrin',
    asi: '+1 CHA (MotM) or +1 INT (DMG)',
    traits: 'Fey Step: bonus action 30ft teleport PB/long rest. Extra effect based on season.',
    bestFor: 'Any CHA class. Free Misty Step multiple times per day.',
    rating: 'S',
    note: 'Seasonal effects: Spring (teleport ally), Summer (fire damage), Autumn (charm 2 creatures), Winter (frighten).',
  },
  {
    subtype: 'Shadar-kai',
    asi: '+1 CON',
    traits: 'Blessing of the Raven Queen: bonus action 30ft teleport + resistance to all damage until next turn. PB/long rest.',
    bestFor: 'Frontliners. Teleport + resistance is incredibly strong.',
    rating: 'S',
    note: 'Essentially Misty Step + resistance to all damage. Best Elf subrace for durability.',
  },
  {
    subtype: 'Pallid Elf (EGtW)',
    asi: '+1 WIS',
    traits: 'Incisive Sense (advantage on Investigation/Insight). Sleep (3), Invisibility (5).',
    bestFor: 'Support builds, Cleric, social characters.',
    rating: 'B',
  },
  {
    subtype: 'Sea Elf',
    asi: '+1 CON',
    traits: 'Swim 30ft. Breathe water. Speak to sea creatures.',
    bestFor: 'Aquatic campaigns. Otherwise niche.',
    rating: 'C (land) / A (aquatic)',
  },
];

export const ELF_EXCLUSIVE_FEATS = [
  { feat: 'Elven Accuracy', asi: '+1 DEX/INT/WIS/CHA', effect: 'When you have advantage, reroll one die (triple advantage). Only for elves/half-elves.', rating: 'S', note: 'Best crit-fishing feat. Advantage → 3 dice → much higher crit chance.' },
  { feat: 'Fey Teleportation (High Elf)', asi: '+1 INT/CHA', effect: 'Misty Step 1/short rest. Learn Sylvan.', rating: 'A' },
  { feat: 'Drow High Magic', asi: 'None', effect: 'Detect Magic at will. Levitate + Dispel Magic 1/day each.', rating: 'B' },
  { feat: 'Wood Elf Magic', asi: 'None', effect: 'Longstrider 1/day. Pass Without Trace 1/day. One Druid cantrip.', rating: 'A', note: 'Free Pass Without Trace on anyone is incredibly valuable.' },
];

export function elvenAccuracyCritChance(d20sRolled) {
  // With Elven Accuracy (3 dice): 1 - (19/20)^3 = 14.26% crit chance
  if (d20sRolled === 3) return 14.26;
  if (d20sRolled === 2) return 9.75; // advantage: 1 - (19/20)^2
  return 5; // normal
}

export function tranceAdvantage() {
  return { restTime: 4, note: '4 hours for long rest benefits. 4 extra hours to keep watch, craft, study.' };
}
