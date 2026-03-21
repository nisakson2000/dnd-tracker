/**
 * playerCustomLineageGuide.js
 * Player Mode: Custom Lineage and Custom Origin — build optimization
 * Pure JS — no React dependencies.
 */

export const CUSTOM_LINEAGE_BASICS = {
  source: 'Tasha\'s Cauldron of Everything',
  asi: '+2 to one ability score of your choice',
  size: 'Small or Medium (your choice)',
  speed: '30ft',
  special: 'One feat at level 1. Either darkvision (60ft) OR one skill proficiency.',
  note: 'The most mechanically optimized race option. +2 to any stat + a free L1 feat. Custom Lineage is the go-to for optimization builds.',
};

export const CUSTOM_ORIGIN_RULES = {
  source: 'Tasha\'s optional rule for existing races.',
  rule: 'Any race\'s ASI bonuses can be reassigned to different abilities (+2/+1 or +1/+1/+1).',
  note: 'This makes every race viable for every class. Orc Wizard? Mountain Dwarf Bard? All optimizable now.',
  dmsChoice: 'This is an optional rule. Check with your DM before assuming custom origin is available.',
};

export const BEST_CUSTOM_LINEAGE_BUILDS = [
  { build: 'CL + Sharpshooter Fighter', stat: 'DEX +2', feat: 'Sharpshooter at L1', progression: 'L1: 17 DEX (15+2), SS. L4: +2 DEX = 19. L6 ASI: +1 DEX = 20 (or CBE).', rating: 'S', note: 'SS online from level 1. Earliest possible power spike for ranged builds.' },
  { build: 'CL + PAM Fighter', stat: 'STR +2', feat: 'Polearm Master at L1', progression: 'L1: 17 STR, PAM. L4: +2 STR = 19. L6: Sentinel or +1 STR.', rating: 'S', note: 'PAM bonus action attack from level 1. Dominant early game melee.' },
  { build: 'CL + War Caster Cleric', stat: 'WIS +2', feat: 'War Caster at L1', progression: 'L1: 17 WIS, War Caster. L4: +2 WIS = 19. L8: +1 WIS + Resilient (CON).', rating: 'A', note: 'Concentration protection from L1. Melee Cleric online immediately.' },
  { build: 'CL + Fey Touched Wizard', stat: 'INT +2', feat: 'Fey Touched at L1', progression: 'L1: 18 INT (15+2+1), Misty Step + Bless/Gift of Alacrity. L4: +2 INT = 20.', rating: 'S', note: 'INT 18 at level 1 AND free Misty Step. Absurdly efficient.' },
  { build: 'CL + Lucky any class', stat: 'Primary +2', feat: 'Lucky at L1', progression: 'L1: 17 primary, Lucky. Build as normal from L4.', rating: 'A', note: 'Lucky from L1 = 3 rerolls per day from the start. Universal safety net.' },
];

export const HALF_FEATS_FOR_CUSTOM_LINEAGE = [
  { feat: 'Fey Touched', bonus: '+1 INT/WIS/CHA', spells: 'Misty Step + 1 divination/enchantment L1 spell', note: 'Best half-feat. +1 rounds your 15 to 18 with CL +2. Free Misty Step.', rating: 'S' },
  { feat: 'Shadow Touched', bonus: '+1 INT/WIS/CHA', spells: 'Invisibility + 1 illusion/necromancy L1 spell', note: 'Free Invisibility. Good for stealth builds.', rating: 'A' },
  { feat: 'Telekinetic', bonus: '+1 INT/WIS/CHA', spells: 'Mage Hand (invisible) + bonus action 5ft push', note: 'Bonus action push every turn. No save. Move allies or enemies.', rating: 'A' },
  { feat: 'Telepathic', bonus: '+1 INT/WIS/CHA', spells: 'Telepathy + Detect Thoughts 1/LR', note: 'Free Detect Thoughts. Good for social campaigns.', rating: 'B' },
  { feat: 'Crusher/Slasher/Piercer', bonus: '+1 STR or DEX', effects: 'Weapon damage type bonuses + crit effects', note: 'Good for martial builds. Crusher is best (forced movement + crit AoE advantage).', rating: 'A' },
];

export function customLineageStatProgression(baseScore, featsWithHalfASI) {
  let score = baseScore + 2; // CL +2
  const progression = [{ level: 1, score, note: 'Custom Lineage +2' }];
  if (featsWithHalfASI) {
    score += 1;
    progression.push({ level: 1, score, note: '+ half-feat +1' });
  }
  return progression;
}
