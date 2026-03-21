/**
 * playerActionSurge.js
 * Player Mode: Fighter Action Surge and Second Wind tracking
 * Pure JS — no React dependencies.
 */

export const ACTION_SURGE = {
  description: 'On your turn, you can take one additional action on top of your regular action and a possible bonus action.',
  level: 2,
  uses: [
    { level: 2, perRest: 1 },
    { level: 17, perRest: 2 },
  ],
  recharge: 'Short or long rest.',
  notes: [
    'You get a FULL extra action — attack, cast a spell, Dash, Dodge, etc.',
    'With Extra Attack, this means 4 attacks at level 5, 6 at level 11, 8 at level 20.',
    'You can cast two leveled spells in one turn with Action Surge (only restriction is bonus action spells limit the other to cantrip).',
    'Action Surge does NOT give an extra bonus action or reaction.',
    'Combine with Haste for 3 actions in one turn (regular + Action Surge + Haste).',
  ],
};

export const SECOND_WIND = {
  description: 'On your turn, you can use a bonus action to regain hit points equal to 1d10 + your Fighter level.',
  level: 1,
  recharge: 'Short or long rest.',
  uses: 1,
  notes: [
    'Uses your bonus action — consider if you have a better bonus action.',
    'Scales with level — at level 10, it\'s 1d10+10 (avg 15.5 HP).',
    'Great for self-sustain without needing a healer.',
    'Can use while in melee without provoking.',
  ],
};

export const INDOMITABLE = {
  description: 'Reroll a saving throw that you fail. You must use the new roll.',
  level: 9,
  uses: [
    { level: 9, perRest: 1 },
    { level: 13, perRest: 2 },
    { level: 17, perRest: 3 },
  ],
  recharge: 'Long rest.',
  notes: [
    'Use on critical saves — Hold Person, Banishment, Dominate Person.',
    'You MUST take the new roll, even if it\'s lower.',
    'Save your uses for saves that would take you out of the fight.',
  ],
};

export function getActionSurgeUses(level) {
  if (level >= 17) return 2;
  if (level >= 2) return 1;
  return 0;
}

export function getSecondWindHealing(level) {
  return { dice: '1d10', bonus: level, average: 5.5 + level };
}

export function getIndomitableUses(level) {
  if (level >= 17) return 3;
  if (level >= 13) return 2;
  if (level >= 9) return 1;
  return 0;
}
