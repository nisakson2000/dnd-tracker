/**
 * playerRestingRules.js
 * Player Mode: Comprehensive resting rules (short & long rest)
 * Pure JS — no React dependencies.
 */

export const SHORT_REST = {
  duration: '1 hour minimum.',
  activities: 'Light: eating, drinking, reading, tending wounds.',
  restrictions: 'No strenuous activity.',
  benefits: [
    'Spend hit dice to heal (roll + CON modifier per die).',
    'Warlock: recover all Pact Magic slots.',
    'Fighter: recover Second Wind, Action Surge.',
    'Monk: recover all ki points.',
    'Bard (5th+): recover all Bardic Inspiration.',
    'Cleric/Paladin: recover Channel Divinity.',
    'Druid: recover Wild Shape uses.',
    'Wizard (1/day): Arcane Recovery (recover spell slot levels = half wizard level).',
  ],
};

export const LONG_REST = {
  duration: '8 hours minimum.',
  activities: 'Sleep at least 6 hours. Up to 2 hours of light activity (walking, reading, keeping watch).',
  restrictions: '1 hour of strenuous activity (fighting, casting, walking) interrupts the rest.',
  frequency: 'Can only benefit from one long rest per 24 hours.',
  benefits: [
    'Regain all lost HP.',
    'Regain all spell slots.',
    'Regain all class resources (ki, rage, sorcery points, etc.).',
    'Recover hit dice: half your total (minimum 1).',
    'Reduce exhaustion by 1 level (if food/water consumed).',
  ],
};

export const WATCH_SCHEDULE = {
  rule: 'During a long rest, at least one person should keep watch for 2 hours.',
  shifts: (partySize) => {
    if (partySize <= 0) return [];
    const watchHours = 8;
    const hoursPerShift = Math.ceil(watchHours / partySize);
    return Array.from({ length: partySize }, (_, i) => ({
      shift: i + 1,
      hours: Math.min(hoursPerShift, 2),
      note: hoursPerShift <= 2 ? 'Light activity — won\'t interrupt long rest.' : 'WARNING: Over 2 hours may interrupt long rest.',
    }));
  },
};

export const INTERRUPTED_REST = {
  combat: 'If interrupted by combat lasting more than 1 minute, must restart the rest.',
  walking: 'More than 1 hour of walking during a long rest invalidates it.',
  spellcasting: 'Casting spells counts as strenuous activity (1 minute per spell level).',
  shortInterrupt: 'Brief combat (under 1 minute) does not interrupt a long rest.',
};

export function getHitDiceRecovery(totalHitDice) {
  return Math.max(1, Math.floor(totalHitDice / 2));
}

export function canLongRest(lastLongRestTimestamp) {
  if (!lastLongRestTimestamp) return true;
  const hoursSince = (Date.now() - lastLongRestTimestamp) / (1000 * 60 * 60);
  return hoursSince >= 24;
}
