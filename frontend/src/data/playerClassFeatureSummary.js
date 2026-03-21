/**
 * playerClassFeatureSummary.js
 * Player Mode: One-line summaries of key class features by level
 * Pure JS — no React dependencies.
 */

export const CLASS_FEATURE_MILESTONES = {
  Barbarian: [
    { level: 1, feature: 'Rage', summary: 'Bonus action: +2 damage, resistance to B/P/S, advantage on STR.' },
    { level: 2, feature: 'Reckless Attack', summary: 'Advantage on STR attacks, but enemies get advantage on you.' },
    { level: 5, feature: 'Extra Attack', summary: 'Attack twice per Attack action.' },
    { level: 5, feature: 'Fast Movement', summary: '+10ft speed (no heavy armor).' },
    { level: 11, feature: 'Relentless Rage', summary: 'CON save (DC 10+) to stay at 1 HP instead of dropping to 0.' },
    { level: 20, feature: 'Primal Champion', summary: '+4 STR and CON. Unlimited Rages.' },
  ],
  Fighter: [
    { level: 1, feature: 'Fighting Style + Second Wind', summary: 'Combat specialization + bonus action self-heal.' },
    { level: 2, feature: 'Action Surge', summary: 'One extra FULL action. Once per short rest.' },
    { level: 5, feature: 'Extra Attack', summary: 'Attack twice per Attack action.' },
    { level: 9, feature: 'Indomitable', summary: 'Reroll a failed saving throw. 1/long rest.' },
    { level: 11, feature: 'Extra Attack (3)', summary: 'Attack THREE times per Attack action.' },
    { level: 20, feature: 'Extra Attack (4)', summary: 'Attack FOUR times per Attack action.' },
  ],
  Wizard: [
    { level: 1, feature: 'Arcane Recovery', summary: 'Once/day after short rest: recover spell slots = half level.' },
    { level: 2, feature: 'Arcane Tradition', summary: 'Subclass feature (Evocation, Divination, etc.).' },
    { level: 5, feature: '3rd-Level Spells', summary: 'Fireball, Counterspell, Haste, Hypnotic Pattern.' },
    { level: 9, feature: '5th-Level Spells', summary: 'Wall of Force, Animate Objects, Telekinesis.' },
    { level: 18, feature: 'Spell Mastery', summary: 'Cast a 1st + 2nd level spell at will. Infinite Shield!' },
    { level: 20, feature: 'Signature Spells', summary: 'Two 3rd-level spells always prepared, 1/short rest free cast.' },
  ],
  Cleric: [
    { level: 1, feature: 'Divine Domain', summary: 'Subclass + domain spells (always prepared, free).' },
    { level: 2, feature: 'Channel Divinity', summary: 'Turn Undead + domain feature. 1/short rest.' },
    { level: 5, feature: '3rd-Level Spells', summary: 'Spirit Guardians, Revivify, Dispel Magic.' },
    { level: 10, feature: 'Divine Intervention', summary: 'Ask your god for help. Level% chance of success.' },
    { level: 17, feature: '9th-Level Spells', summary: 'Mass Heal, True Resurrection, Gate.' },
    { level: 20, feature: 'Divine Intervention (auto)', summary: 'Your god ALWAYS answers. 100% success.' },
  ],
  Rogue: [
    { level: 1, feature: 'Sneak Attack + Expertise', summary: '1d6 extra damage with advantage/ally nearby. Double prof on 2 skills.' },
    { level: 2, feature: 'Cunning Action', summary: 'Bonus action: Dash, Disengage, or Hide.' },
    { level: 5, feature: 'Uncanny Dodge', summary: 'Reaction: halve damage from one attack.' },
    { level: 7, feature: 'Evasion', summary: 'DEX save for half → take 0 damage. Fail → take half.' },
    { level: 11, feature: 'Reliable Talent', summary: 'Proficient checks can\'t roll below 10. Floor of 10+bonuses.' },
    { level: 20, feature: 'Stroke of Luck', summary: 'Turn any miss into a hit, or treat any check as 20. 1/short rest.' },
  ],
  Paladin: [
    { level: 1, feature: 'Divine Sense + Lay on Hands', summary: 'Detect undead/fiend/celestial. Pool of healing = 5×level.' },
    { level: 2, feature: 'Divine Smite + Fighting Style', summary: 'Spend slots for burst damage on melee hits. Decide AFTER hitting.' },
    { level: 5, feature: 'Extra Attack', summary: 'Attack twice per Attack action.' },
    { level: 6, feature: 'Aura of Protection', summary: '+CHA to ALL saves for you and allies within 10ft. AMAZING.' },
    { level: 14, feature: 'Cleansing Touch', summary: 'End one spell on a creature. CHA mod uses/long rest.' },
    { level: 18, feature: 'Aura Range → 30ft', summary: 'All auras now 30ft instead of 10ft.' },
  ],
};

export function getClassMilestones(className) {
  return CLASS_FEATURE_MILESTONES[className] || [];
}

export function getNextMilestone(className, currentLevel) {
  const milestones = getClassMilestones(className);
  return milestones.find(m => m.level > currentLevel) || null;
}

export function getMilestonesAtLevel(className, level) {
  return getClassMilestones(className).filter(m => m.level === level);
}
