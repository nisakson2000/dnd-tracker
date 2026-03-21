/**
 * playerShortRestHelper.js
 * Player Mode: Short rest step-by-step guide and resource recovery
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SHORT REST RULES
// ---------------------------------------------------------------------------

export const SHORT_REST_RULES = {
  duration: '1 hour (minimum)',
  activities: 'Light activity: eating, drinking, reading, tending wounds.',
  restrictions: 'No strenuous activity (walking, fighting, casting spells).',
  interruption: 'If interrupted by combat or other strenuous activity (1+ hour of walking, fighting, or similar), must restart.',
};

// ---------------------------------------------------------------------------
// SHORT REST STEPS
// ---------------------------------------------------------------------------

export const SHORT_REST_STEPS = [
  { step: 1, label: 'Spend Hit Dice', description: 'Roll hit dice to heal. Add CON modifier per die. Can spend one at a time.', required: false },
  { step: 2, label: 'Recover Class Resources', description: 'Some class features recharge on short rest.', required: false },
  { step: 3, label: 'Recover Spell Slots', description: 'Warlock Pact Magic slots recover. Wizards can use Arcane Recovery (1/day after short rest).', required: false },
  { step: 4, label: 'Channel Divinity', description: 'Cleric/Paladin Channel Divinity uses recover.', required: false },
  { step: 5, label: 'Other Recoveries', description: 'Check for any other features that recharge on short rest.', required: false },
];

// ---------------------------------------------------------------------------
// CLASS SHORT REST FEATURES
// ---------------------------------------------------------------------------

export const SHORT_REST_CLASS_FEATURES = [
  { className: 'Fighter', features: ['Second Wind', 'Action Surge', 'Superiority Dice (Battle Master)'] },
  { className: 'Warlock', features: ['Pact Magic spell slots'] },
  { className: 'Monk', features: ['Ki Points'] },
  { className: 'Bard', features: ['Bardic Inspiration (5th level)'] },
  { className: 'Cleric', features: ['Channel Divinity'] },
  { className: 'Paladin', features: ['Channel Divinity'] },
  { className: 'Druid', features: ['Wild Shape uses'] },
  { className: 'Wizard', features: ['Arcane Recovery (1/day, spell slot levels = half wizard level)'] },
  { className: 'Sorcerer', features: ['(None by default — can convert sorcery points to slots)'] },
  { className: 'Ranger', features: ['(None by default)'] },
  { className: 'Barbarian', features: ['(None — rage uses recharge on long rest)'] },
  { className: 'Rogue', features: ['(None by default)'] },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate hit dice healing.
 */
export function calculateHitDiceHealing(hitDieSize, conModifier, diceCount = 1) {
  // Average healing per die
  const avgPerDie = (hitDieSize / 2 + 0.5) + conModifier;
  return {
    average: Math.max(1, Math.floor(avgPerDie * diceCount)),
    minimum: Math.max(1, diceCount * (1 + conModifier)),
    maximum: diceCount * (hitDieSize + conModifier),
    perDie: Math.max(1, Math.floor(avgPerDie)),
  };
}

/**
 * Get short rest features for a class.
 */
export function getShortRestFeatures(className) {
  const entry = SHORT_REST_CLASS_FEATURES.find(
    c => c.className.toLowerCase() === (className || '').toLowerCase()
  );
  return entry ? entry.features : [];
}

/**
 * Build short rest checklist for a character.
 */
export function buildShortRestChecklist(className, level, currentHP, maxHP, hitDiceRemaining) {
  const checklist = [];

  if (currentHP < maxHP && hitDiceRemaining > 0) {
    checklist.push({ id: 'hit_dice', label: `Spend Hit Dice (${hitDiceRemaining} remaining)`, checked: false, priority: 'high' });
  }

  const features = getShortRestFeatures(className);
  features.forEach((feat, i) => {
    if (!feat.startsWith('(')) {
      checklist.push({ id: `feature_${i}`, label: `Recover: ${feat}`, checked: false, priority: 'medium' });
    }
  });

  return checklist;
}
