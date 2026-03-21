/**
 * playerCombatRecoveryProtocol.js
 * Player Mode: Post-combat recovery procedures and resource assessment
 * Pure JS — no React dependencies.
 */

export const RECOVERY_PRIORITY = [
  { priority: 1, action: 'Stabilize dying allies', detail: 'Healing Word, Spare the Dying, or Medicine check. Don\'t let anyone die post-combat.' },
  { priority: 2, action: 'Heal critical injuries', detail: 'Heal anyone below 25% HP. Prioritize those who can heal themselves last.' },
  { priority: 3, action: 'Cure conditions', detail: 'Remove poison, disease, blindness. Lesser/Greater Restoration. Lay on Hands for poison/disease.' },
  { priority: 4, action: 'Assess remaining resources', detail: 'Spell slots, ki, rage, Channel Divinity, hit dice. Can you survive another fight?' },
  { priority: 5, action: 'Decide: push on or rest?', detail: 'If below 50% resources, short rest. If below 25%, consider long rest. If urgent quest, push on.' },
  { priority: 6, action: 'Secure the area', detail: 'Are more enemies coming? Post a watch. Barricade doors. Set up Alarm spell.' },
  { priority: 7, action: 'Loot and investigate', detail: 'Search bodies, check for magic items, gather information from the scene.' },
];

export const SHORT_REST_RECOVERY = {
  duration: '1 hour',
  hitDice: 'Spend hit dice to heal. Roll hit die + CON mod per die spent.',
  features: [
    { feature: 'Action Surge', class: 'Fighter', recovers: 'All uses' },
    { feature: 'Channel Divinity', class: 'Cleric/Paladin', recovers: 'All uses' },
    { feature: 'Ki Points', class: 'Monk', recovers: 'All points' },
    { feature: 'Pact Magic slots', class: 'Warlock', recovers: 'All slots' },
    { feature: 'Bardic Inspiration (level 5+)', class: 'Bard', recovers: 'All uses' },
    { feature: 'Second Wind', class: 'Fighter', recovers: 'All uses' },
    { feature: 'Wild Shape', class: 'Druid', recovers: 'All uses' },
    { feature: 'Arcane Recovery (1/day)', class: 'Wizard', recovers: 'Half wizard level in spell slots (rounded up)' },
    { feature: 'Natural Recovery (1/day)', class: 'Druid (Land)', recovers: 'Half druid level in spell slots (rounded up)' },
    { feature: 'Superiority Dice', class: 'Battle Master', recovers: 'All dice' },
  ],
  doesNotRecover: ['Most spell slots', 'Long rest features', 'Exhaustion', 'Hit die (those are long rest)'],
};

export const LONG_REST_RECOVERY = {
  duration: '8 hours (minimum 6 hours sleep, 2 hours light activity)',
  recovers: [
    'All HP',
    'Half of total hit dice (rounded down, minimum 1)',
    'All spell slots',
    'All class features',
    'One level of exhaustion',
  ],
  restrictions: [
    'Only one long rest per 24 hours',
    'Light activity during rest: reading, talking, eating, standing watch (2 hours max)',
    'Combat or strenuous activity for 1+ hour restarts the long rest timer',
    'Must have food and water available (or suffer exhaustion)',
  ],
  interruption: 'If interrupted by combat (1+ minute) or strenuous activity (1+ hour), the rest must start over.',
};

export const RESOURCE_ASSESSMENT = {
  greenLight: {
    threshold: '75%+ resources remaining',
    recommendation: 'Push on. You can handle another encounter.',
    details: 'Most spell slots, full HP, class features available.',
  },
  yellowLight: {
    threshold: '50-75% resources remaining',
    recommendation: 'Short rest if possible. Can handle one more easy/medium encounter.',
    details: 'Some spell slots used. HP moderate. Core features available.',
  },
  orangeLight: {
    threshold: '25-50% resources remaining',
    recommendation: 'Short rest needed. Only push on if absolutely necessary.',
    details: 'Most spell slots used. HP low. Some features expended.',
  },
  redLight: {
    threshold: 'Below 25% resources',
    recommendation: 'Long rest or retreat. Another fight could be fatal.',
    details: 'Few/no spell slots. Low HP. Most features used.',
  },
};

export const HIT_DICE_STRATEGY = [
  'Spend hit dice on short rests, not potions. Hit dice are free.',
  'Con-boosted characters should spend dice first (higher average).',
  'Save at least 2-3 hit dice for emergencies later in the day.',
  'Barbarian d12s average 6.5+CON. Very efficient.',
  'Wizard d6s average 3.5+CON. Less efficient — supplement with healing spells.',
  'Periapt of Wound Closure doubles hit dice healing. Extremely efficient.',
  'Song of Rest (Bard) adds 1d6-1d12 to EACH ally\'s hit die healing. Have the Bard present.',
];

export function assessResources(currentHP, maxHP, slotsUsed, totalSlots, featuresUsed, totalFeatures) {
  const hpPercent = currentHP / maxHP;
  const slotPercent = 1 - (slotsUsed / totalSlots);
  const featurePercent = 1 - (featuresUsed / totalFeatures);
  const overall = (hpPercent + slotPercent + featurePercent) / 3;

  if (overall >= 0.75) return { ...RESOURCE_ASSESSMENT.greenLight, overall: Math.round(overall * 100) };
  if (overall >= 0.5) return { ...RESOURCE_ASSESSMENT.yellowLight, overall: Math.round(overall * 100) };
  if (overall >= 0.25) return { ...RESOURCE_ASSESSMENT.orangeLight, overall: Math.round(overall * 100) };
  return { ...RESOURCE_ASSESSMENT.redLight, overall: Math.round(overall * 100) };
}

export function hitDiceHealing(hitDie, conMod, diceSpent) {
  const avgPerDie = (hitDie / 2 + 0.5) + conMod;
  return { perDie: avgPerDie, total: avgPerDie * diceSpent };
}

export function shouldShortRest(hpPercent, slotsUsedPercent, hasShortRestFeatures) {
  if (hpPercent < 0.5) return { rest: true, reason: 'HP is low. Spend hit dice to recover.' };
  if (hasShortRestFeatures && slotsUsedPercent > 0.5) return { rest: true, reason: 'Recover short rest features (Action Surge, Channel Divinity, ki, etc.).' };
  if (slotsUsedPercent > 0.75) return { rest: true, reason: 'Running low on resources.' };
  return { rest: false, reason: 'Resources are fine. Push on if time is a factor.' };
}
