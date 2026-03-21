/**
 * playerWildShapeAdvanced.js
 * Player Mode: Wild Shape form options by Druid level with combat stats
 * Pure JS — no React dependencies.
 */

export const WILD_SHAPE_LIMITS = [
  { level: 2, maxCR: '1/4', limitations: 'No flying or swimming speed', examples: ['Wolf', 'Cat', 'Mastiff', 'Giant Badger'] },
  { level: 4, maxCR: '1/2', limitations: 'No flying speed', examples: ['Crocodile', 'Giant Wasp', 'Warhorse', 'Ape'] },
  { level: 8, maxCR: 1, limitations: 'None', examples: ['Giant Eagle', 'Giant Spider', 'Dire Wolf', 'Brown Bear'] },
];

export const MOON_DRUID_LIMITS = [
  { level: 2, maxCR: 1, examples: ['Brown Bear (34 HP)', 'Dire Wolf (37 HP)', 'Giant Hyena (45 HP)'] },
  { level: 6, maxCR: 2, examples: ['Giant Constrictor Snake (60 HP)', 'Polar Bear (42 HP)', 'Hunter Shark (45 HP)'] },
  { level: 9, maxCR: 3, examples: ['Giant Scorpion (52 HP)', 'Killer Whale (90 HP)'] },
  { level: 12, maxCR: 4, examples: ['Elephant (76 HP)', 'Giant Crocodile (85 HP)'] },
  { level: 15, maxCR: 5, examples: ['Giant Shark (126 HP)', 'Triceratops (95 HP)'] },
  { level: 18, maxCR: 6, examples: ['Mammoth (126 HP)'] },
];

export const BEST_COMBAT_FORMS = [
  { form: 'Brown Bear', cr: 1, hp: 34, ac: 11, attacks: 'Bite (1d8+4) + Claws (2d6+4)', why: 'Multiattack at CR 1. Best early combat form.' },
  { form: 'Giant Constrictor Snake', cr: 2, hp: 60, ac: 12, attacks: 'Bite (2d6+4) + Constrict (2d8+4, grapple)', why: 'Grapple + restrain on hit. Incredible control.' },
  { form: 'Giant Scorpion', cr: 3, hp: 52, ac: 15, attacks: 'Claws ×2 (1d8+2, grapple) + Sting (1d10+2 + 4d10 poison)', why: 'Poison damage is massive if they fail the save.' },
  { form: 'Giant Elk', cr: 2, hp: 42, ac: 14, attacks: 'Ram (2d6+4) + Hooves (4d8+4 vs prone)', why: 'Charge knocks prone, then huge hooves damage.' },
  { form: 'Mammoth', cr: 6, hp: 126, ac: 13, attacks: 'Gore (4d8+7) + Stomp (4d10+7 vs prone)', why: 'Highest HP pool. Trampling Charge for knockdown.' },
];

export const BEST_UTILITY_FORMS = [
  { form: 'Spider', cr: 0, use: 'Climb walls, squeeze through tiny gaps. Web sense.' },
  { form: 'Cat', cr: 0, use: 'Scout indoors. Tiny, inconspicuous, Stealth +4.' },
  { form: 'Hawk', cr: 0, use: 'Aerial scouting. Keen Sight. 60ft fly speed.' },
  { form: 'Rat', cr: 0, use: 'Squeeze under doors. Urban infiltration.' },
  { form: 'Giant Octopus', cr: 1, use: 'Underwater. 60ft swim, Ink Cloud, grapple.' },
  { form: 'Giant Eagle', cr: 1, use: 'Fly at 80ft. Carry a party member.' },
];

export const WILD_SHAPE_RULES = {
  uses: '2 per short rest.',
  action: 'Action (bonus action for Moon Druids).',
  duration: 'Half your druid level hours.',
  hp: 'You gain the beast\'s HP. When it drops to 0, you revert to your normal HP (excess damage carries over).',
  equipment: 'Equipment merges into form or falls off (your choice). Can\'t use most equipment.',
  spellcasting: 'Can\'t cast spells in Wild Shape (Beast Spells at 18th level).',
  concentration: 'Maintained during Wild Shape. Can make concentration saves using beast\'s CON.',
  mental: 'Keep INT, WIS, CHA. Gain beast\'s STR, DEX, CON.',
};

export function getAvailableForms(druidLevel, isMoon) {
  const limits = isMoon ? MOON_DRUID_LIMITS : WILD_SHAPE_LIMITS;
  const applicable = limits.filter(l => l.level <= druidLevel);
  return applicable.length ? applicable[applicable.length - 1] : null;
}

export function getWildShapeDuration(druidLevel) {
  return Math.floor(druidLevel / 2);
}
