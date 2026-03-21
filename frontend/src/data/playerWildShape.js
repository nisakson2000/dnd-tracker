/**
 * playerWildShape.js
 * Player Mode: Wild Shape tracking for Druids
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// WILD SHAPE RULES
// ---------------------------------------------------------------------------

export const WILD_SHAPE_RULES = {
  usesPerRest: 2,
  recharge: 'short rest',
  duration: (druidLevel) => Math.floor(druidLevel / 2),
  restrictions: (druidLevel, circle) => {
    const rules = { maxCR: 0, canSwim: false, canFly: false };
    if (circle === 'Moon') {
      if (druidLevel >= 6) { rules.maxCR = Math.floor(druidLevel / 3); rules.canSwim = true; }
      else if (druidLevel >= 4) { rules.maxCR = 1; rules.canSwim = true; }
      else if (druidLevel >= 2) { rules.maxCR = 1; }
    } else {
      if (druidLevel >= 8) { rules.maxCR = 1; rules.canFly = true; rules.canSwim = true; }
      else if (druidLevel >= 4) { rules.maxCR = 0.5; rules.canSwim = true; }
      else { rules.maxCR = 0.25; }
    }
    return rules;
  },
  keepFromCharacter: [
    'Personality, alignment, and mental ability scores (INT, WIS, CHA).',
    'Proficiency bonus (use beast stats or yours, whichever is higher).',
    'Class features (if the beast form is physically capable).',
    'Skill and saving throw proficiencies (use yours or the beast\'s, whichever is higher).',
  ],
  loseInWildShape: [
    'Cannot cast spells (but can maintain concentration).',
    'Cannot speak (unless beast form can speak).',
    'Equipment melds into beast form (cannot use or benefit from it).',
  ],
};

// ---------------------------------------------------------------------------
// COMMON WILD SHAPE FORMS
// ---------------------------------------------------------------------------

export const WILD_SHAPE_FORMS = [
  { name: 'Cat', cr: 0, hp: 2, ac: 12, speed: '40ft, climb 30ft', swim: false, fly: false, senses: 'Darkvision 60ft' },
  { name: 'Spider', cr: 0, hp: 1, ac: 12, speed: '20ft, climb 20ft', swim: false, fly: false, senses: 'Darkvision 30ft' },
  { name: 'Rat', cr: 0, hp: 1, ac: 10, speed: '20ft', swim: false, fly: false, senses: 'Darkvision 30ft' },
  { name: 'Hawk', cr: 0, hp: 1, ac: 13, speed: '10ft, fly 60ft', swim: false, fly: true, senses: 'Perception adv' },
  { name: 'Wolf', cr: 0.25, hp: 11, ac: 13, speed: '40ft', swim: false, fly: false, senses: 'Perception adv, Darkvision 60ft' },
  { name: 'Panther', cr: 0.25, hp: 13, ac: 12, speed: '50ft, climb 40ft', swim: false, fly: false, senses: 'Darkvision 60ft' },
  { name: 'Giant Spider', cr: 1, hp: 26, ac: 14, speed: '30ft, climb 30ft', swim: false, fly: false, senses: 'Blindsight 10ft, Darkvision 60ft' },
  { name: 'Brown Bear', cr: 1, hp: 34, ac: 11, speed: '40ft, climb 30ft', swim: false, fly: false, senses: 'Normal' },
  { name: 'Dire Wolf', cr: 1, hp: 37, ac: 14, speed: '50ft', swim: false, fly: false, senses: 'Perception adv, Darkvision 60ft' },
  { name: 'Giant Toad', cr: 1, hp: 39, ac: 11, speed: '20ft, swim 40ft', swim: true, fly: false, senses: 'Darkvision 30ft' },
  { name: 'Giant Eagle', cr: 1, hp: 26, ac: 13, speed: '10ft, fly 80ft', swim: false, fly: true, senses: 'Perception adv' },
  { name: 'Cave Bear', cr: 2, hp: 42, ac: 12, speed: '40ft, swim 30ft', swim: true, fly: false, senses: 'Darkvision 60ft' },
  { name: 'Giant Constrictor Snake', cr: 2, hp: 60, ac: 12, speed: '30ft, swim 30ft', swim: true, fly: false, senses: 'Blindsight 10ft' },
  { name: 'Giant Elk', cr: 2, hp: 42, ac: 14, speed: '60ft', swim: false, fly: false, senses: 'Normal' },
  { name: 'Mammoth', cr: 6, hp: 126, ac: 13, speed: '40ft', swim: false, fly: false, senses: 'Normal' },
  { name: 'Giant Scorpion', cr: 3, hp: 52, ac: 15, speed: '40ft', swim: false, fly: false, senses: 'Blindsight 60ft' },
];

/**
 * Get eligible wild shape forms for a druid.
 */
export function getEligibleForms(druidLevel, circle = 'Land') {
  const rules = WILD_SHAPE_RULES.restrictions(druidLevel, circle);
  return WILD_SHAPE_FORMS.filter(form => {
    if (form.cr > rules.maxCR) return false;
    if (form.fly && !rules.canFly) return false;
    if (form.swim && !rules.canSwim) return false;
    return true;
  });
}
