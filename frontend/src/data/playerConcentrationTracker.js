/**
 * playerConcentrationTracker.js
 * Player Mode: Active concentration spell tracking and DC calculator
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_RULES = {
  limit: 'You can only concentrate on ONE spell at a time.',
  duration: 'Lasts for the spell\'s listed duration, or until you lose concentration.',
  lostWhen: [
    'You cast another concentration spell (previous ends immediately).',
    'You take damage and fail a CON save (DC = 10 or half damage, whichever is higher).',
    'You are incapacitated or killed.',
    'DM-specific environmental effects (earthquakes, etc.).',
  ],
  save: 'CON saving throw. DC = max(10, damage / 2). Separate save for each source of damage.',
};

export const CONCENTRATION_PROTECTION = [
  { source: 'War Caster (Feat)', effect: 'Advantage on concentration saves.', value: 'Very high — effectively +5 to your roll.' },
  { source: 'Resilient (CON) (Feat)', effect: 'Add proficiency bonus to CON saves.', value: 'Scales with level. +2 to +6.' },
  { source: 'Both Together', effect: 'Advantage + proficiency on CON saves.', value: 'Near-impossible to fail at high levels.' },
  { source: 'Bladesinger\'s Song of Victory', effect: 'Add INT modifier to concentration saves.', value: '+3 to +5 additional bonus.' },
  { source: 'Mind Sharpener (Artificer Infusion)', effect: '4 charges, auto-succeed on failed save.', value: 'Guaranteed saves, limited uses.' },
  { source: 'Aura of Protection (Paladin 6)', effect: 'Add CHA mod to all saves within 10ft.', value: '+3 to +5 for entire party.' },
  { source: 'Lucky (Feat)', effect: 'Reroll any d20, 3 times per long rest.', value: 'Versatile but limited uses.' },
  { source: 'High CON Score', effect: 'Direct bonus to all CON saves.', value: '+2 to +5 depending on score.' },
];

export const CONCENTRATION_TRACKER_TEMPLATE = {
  spellName: '',
  spellLevel: 0,
  duration: '',
  startRound: 0,
  currentRound: 0,
  savesRequired: 0,
  savesPassed: 0,
  savesFailed: 0,
  isActive: false,
};

export function calculateConcentrationDC(damageTaken) {
  return Math.max(10, Math.floor(damageTaken / 2));
}

export function willPassSave(conMod, profBonus, isProficient, hasWarCaster, dc) {
  let bonus = conMod;
  if (isProficient) bonus += profBonus;

  // With advantage (War Caster), effective bonus is roughly +5
  const effectiveBonus = hasWarCaster ? bonus + 5 : bonus;
  const chanceToPass = Math.min(100, Math.max(5, (21 - (dc - effectiveBonus)) * 5));

  return { bonus, effectiveBonus, chanceToPass, dc };
}

export function createConcentrationEntry(spellName, spellLevel, duration, currentRound) {
  return {
    ...CONCENTRATION_TRACKER_TEMPLATE,
    spellName,
    spellLevel,
    duration,
    startRound: currentRound,
    currentRound,
    isActive: true,
  };
}
