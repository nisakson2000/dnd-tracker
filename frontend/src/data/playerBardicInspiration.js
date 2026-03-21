/**
 * playerBardicInspiration.js
 * Player Mode: Bardic Inspiration tracking, die sizes, and College features
 * Pure JS — no React dependencies.
 */

export const BARDIC_INSPIRATION_DIE = [
  { level: 1, die: 'd6' },
  { level: 5, die: 'd8' },
  { level: 10, die: 'd10' },
  { level: 15, die: 'd12' },
];

export const BARDIC_INSPIRATION_USES = {
  recharge: 'Long Rest (Short Rest at 5th level with Font of Inspiration).',
  uses: 'Equal to CHA modifier (minimum 1).',
  action: 'Bonus Action to grant to a creature within 60ft.',
  duration: 'Lasts 10 minutes. Can add to one ability check, attack roll, or saving throw.',
  rule: 'Used AFTER rolling the d20 but BEFORE the DM says whether it succeeds.',
};

export const COLLEGE_FEATURES = [
  { college: 'Lore', feature: 'Cutting Words', level: 3, description: 'Reaction: subtract Bardic Inspiration die from enemy\'s attack roll, ability check, or damage roll.' },
  { college: 'Valor', feature: 'Combat Inspiration', level: 3, description: 'Recipient can add die to weapon damage roll or to AC as reaction.' },
  { college: 'Swords', feature: 'Blade Flourish', level: 3, description: 'On weapon hit, expend die for extra damage + Defensive/Slashing/Mobile Flourish.' },
  { college: 'Glamour', feature: 'Mantle of Inspiration', level: 3, description: 'Bonus action: expend die, up to 5 allies gain temp HP (die + CHA) and can move without OA.' },
  { college: 'Whispers', feature: 'Psychic Blades', level: 3, description: 'On weapon hit, expend die for extra psychic damage (2d6 at 3rd, scales).' },
  { college: 'Creation', feature: 'Mote of Potential', level: 3, description: 'Inspiration die gains extra effect based on use (ability check: +die to both; attack: thunder damage on hit; save: temp HP on success).' },
  { college: 'Eloquence', feature: 'Unsettling Words', level: 3, description: 'Bonus action: subtract Bardic Inspiration die from next saving throw of target within 60ft.' },
];

export function getInspirationDie(bardLevel) {
  for (let i = BARDIC_INSPIRATION_DIE.length - 1; i >= 0; i--) {
    if (bardLevel >= BARDIC_INSPIRATION_DIE[i].level) return BARDIC_INSPIRATION_DIE[i].die;
  }
  return 'd6';
}

export function getMaxUses(chaScore) {
  return Math.max(1, Math.floor((chaScore - 10) / 2));
}

export function rechargesOnShortRest(bardLevel) {
  return bardLevel >= 5;
}

export function getCollegeFeature(college) {
  return COLLEGE_FEATURES.filter(c => c.college.toLowerCase() === (college || '').toLowerCase());
}
