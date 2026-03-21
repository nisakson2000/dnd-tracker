/**
 * playerWildShapeGuide.js
 * Player Mode: Wild Shape rules, best forms, and tactical usage
 * Pure JS — no React dependencies.
 */

export const WILD_SHAPE_RULES = {
  uses: '2 per short/long rest',
  action: 'Action (bonus action for Moon Druid)',
  duration: 'Hours = half druid level (rounded down)',
  revert: 'Bonus action to revert. Revert at 0 HP or if incapacitated/dead.',
  hpRule: 'You gain the beast\'s HP. Excess damage carries over to your real HP when you revert.',
  equipment: 'Equipment merges into beast form or falls off (your choice). Can\'t use it while transformed.',
  spellcasting: 'Can\'t cast spells while transformed (unless Circle of the Moon 18th level).',
  concentration: 'Maintain concentration on pre-cast spells while Wild Shaped.',
  mentalStats: 'Keep your INT, WIS, and CHA. Use beast\'s STR, DEX, and CON.',
};

export const LEVEL_LIMITS = [
  { level: 2, maxCR: '1/4', fly: false, swim: false, examples: ['Wolf', 'Cat', 'Badger'] },
  { level: 4, maxCR: '1/2', fly: false, swim: true, examples: ['Crocodile', 'Reef Shark', 'Warhorse'] },
  { level: 8, maxCR: 1, fly: true, swim: true, examples: ['Giant Eagle', 'Dire Wolf', 'Giant Spider'] },
  { level: 'Moon 2', maxCR: 1, fly: false, swim: true, examples: ['Brown Bear', 'Dire Wolf'] },
  { level: 'Moon 6', maxCR: 2, fly: false, swim: true, examples: ['Giant Constrictor Snake', 'Polar Bear'] },
  { level: 'Moon 9', maxCR: 3, fly: true, swim: true, examples: ['Giant Scorpion', 'Killer Whale'] },
  { level: 'Moon 10', maxCR: 'Elemental', fly: true, swim: true, examples: ['Earth Elemental', 'Fire Elemental'] },
];

export const BEST_FORMS = {
  combat: [
    { form: 'Brown Bear', cr: 1, hp: 34, attacks: 'Multiattack (bite + claws)', why: 'Best CR 1 combat form. Multiattack is rare at this CR.', level: 'Moon 2' },
    { form: 'Giant Constrictor Snake', cr: 2, hp: 60, attacks: 'Bite + Constrict (grapple + restrain)', why: '60 HP tank. Grapple + restrain shuts down a target.', level: 'Moon 6' },
    { form: 'Earth Elemental', cr: 5, hp: 126, attacks: 'Multiattack (2 slams, 2d8+5)', why: '126 HP wall. Earth Glide for terrain mobility. Resistant to nonmagical B/P/S.', level: 'Moon 10' },
    { form: 'Giant Scorpion', cr: 3, hp: 52, attacks: 'Multiattack (2 claws + sting)', why: '3 attacks. Sting poisons (CON save). Blindsight 60ft.', level: 'Moon 9' },
    { form: 'Mammoth', cr: 6, hp: 126, attacks: 'Gore (4d8+7) + Stomp (4d10+7 if target prone)', why: 'Trampling Charge knocks prone. Massive damage if both hit.', level: 'Moon 18' },
  ],
  utility: [
    { form: 'Giant Eagle', cr: 1, hp: 26, speed: '80ft fly', why: 'Best flying form at CR 1. Can carry allies.', use: 'Scouting, transport, escape' },
    { form: 'Giant Owl', cr: '1/4', hp: 19, speed: '60ft fly', why: 'Flyby: no opportunity attacks. Silent. 120ft darkvision.', use: 'Stealth scouting' },
    { form: 'Spider', cr: 0, hp: 1, speed: '30ft, 30ft climb', why: 'Tiny size. Climb walls. Darkvision 30ft. Perfect infiltration.', use: 'Espionage, infiltration' },
    { form: 'Cat', cr: 0, hp: 2, speed: '40ft, 30ft climb', why: 'Tiny, inconspicuous. Keen Smell. Urban scouting.', use: 'Urban infiltration' },
    { form: 'Reef Shark', cr: '1/2', hp: 22, speed: '40ft swim', why: 'Aquatic exploration. Blindsight 30ft. Pack Tactics.', use: 'Underwater' },
  ],
};

export const WILD_SHAPE_TACTICS = [
  { tactic: 'HP sponge', description: 'Wild Shape is bonus HP. When beast form drops to 0, you revert with your original HP. Two free health bars per short rest.', rating: 'S' },
  { tactic: 'Pre-buff then shift', description: 'Cast Barkskin, Call Lightning, or other concentration spells BEFORE Wild Shaping. Maintain concentration in beast form.', rating: 'S' },
  { tactic: 'Emergency escape', description: 'Wild Shape into a bird or spider to flee. Bonus action (Moon Druid), fly away.', rating: 'A' },
  { tactic: 'Grapple in beast form', description: 'Large beasts can grapple Medium creatures. Constrictor Snake auto-grapples on bite.', rating: 'A' },
  { tactic: 'Elemental tanking', description: 'Moon Druid 10: Earth Elemental has 126 HP, resistance to nonmagical weapons, and can burrow through earth.', rating: 'S' },
  { tactic: 'Scout ahead', description: 'Cat, spider, or owl form. Tiny, stealthy, disposable. If killed, you just revert.', rating: 'A' },
];

export function getBestForms(level, isMoonDruid, purpose) {
  const forms = purpose === 'utility' ? BEST_FORMS.utility : BEST_FORMS.combat;
  return forms.filter(f => {
    if (!isMoonDruid && typeof f.cr === 'number' && f.cr > 1) return false;
    return true;
  });
}

export function getMaxCR(druidLevel, isMoonDruid) {
  if (!isMoonDruid) {
    if (druidLevel >= 8) return 1;
    if (druidLevel >= 4) return 0.5;
    return 0.25;
  }
  if (druidLevel >= 18) return 6;
  if (druidLevel >= 15) return 5;
  if (druidLevel >= 12) return 4;
  if (druidLevel >= 9) return 3;
  if (druidLevel >= 6) return 2;
  return 1;
}
