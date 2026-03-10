// D&D 5th Edition (2014 PHB) Ruleset Module
// All rules data from the 2014 Player's Handbook

import { PROFICIENCY_BONUS, ABILITIES, SKILLS, RACES, CLASSES, SPELL_SLOTS, CONDITIONS, EXHAUSTION_LEVELS, FEATS, POINT_BUY_COSTS } from '../rules5e';
import { CLASS_FEATURES, ASI_LEVELS } from '../classFeatures';

const ruleset5e2014 = {
  id: '5e-2014',
  name: "D&D 5th Edition (2014 PHB)",
  shortName: '5e 2014',
  ancestryLabel: 'Race',
  ancestryPluralLabel: 'Races',

  PROFICIENCY_BONUS,
  ABILITIES,
  SKILLS,
  RACES,
  CLASSES,
  SPELL_SLOTS,
  CONDITIONS,
  EXHAUSTION_LEVELS,
  FEATS,
  POINT_BUY_COSTS,
  CLASS_FEATURES,
  ASI_LEVELS,
};

export default ruleset5e2014;
