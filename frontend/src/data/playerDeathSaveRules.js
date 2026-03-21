/**
 * playerDeathSaveRules.js
 * Player Mode: Death saving throw rules, stabilization, and healing from 0
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// DEATH SAVE RULES
// ---------------------------------------------------------------------------

export const DEATH_SAVE_RULES = {
  trigger: 'Start your turn at 0 HP and not stabilized.',
  dc: 10,
  success: 'Roll 10+ on d20. Three successes = stabilized.',
  failure: 'Roll 9 or lower. Three failures = death.',
  nat20: 'Regain 1 HP immediately (you\'re conscious again). Resets all saves.',
  nat1: 'Counts as two failures.',
  takingDamage: 'Taking damage while at 0 HP = 1 automatic failure. Critical hit = 2 failures.',
  massiveDamage: 'If remaining damage equals or exceeds your max HP, you die outright.',
  healing: 'Any healing while at 0 HP brings you back to consciousness (HP = healing received).',
  stabilized: 'Stabilized creature regains 1 HP after 1d4 hours.',
};

// ---------------------------------------------------------------------------
// STABILIZATION
// ---------------------------------------------------------------------------

export const STABILIZATION_RULES = {
  medicineDC: 10,
  action: 'Action to stabilize with Medicine check (DC 10).',
  spareTheDying: 'Cantrip: automatically stabilize a creature at 0 HP (touch, action).',
  healersKit: '10 uses. Stabilize without a check.',
  note: 'A stabilized creature is unconscious but no longer making death saves.',
};

// ---------------------------------------------------------------------------
// DEATH SAVE MODIFIERS
// ---------------------------------------------------------------------------

export const DEATH_SAVE_MODIFIERS = [
  { source: 'Bless', modifier: '+1d4', type: 'spell' },
  { source: 'Aura of Protection (Paladin)', modifier: '+CHA mod', type: 'class', note: 'Paladin must be within 10ft (30ft at 18th)' },
  { source: 'Diamond Soul (Monk 14)', modifier: 'Proficiency bonus', type: 'class' },
  { source: 'Bane (on enemy)', modifier: '-1d4 (enemy\'s save)', type: 'spell' },
  { source: 'Beacon of Hope', modifier: 'Advantage', type: 'spell' },
  { source: 'Death Ward', modifier: 'First drop to 0 HP → 1 HP instead', type: 'spell' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Process a death save roll.
 */
export function processDeathSave(d20Roll, currentSuccesses = 0, currentFailures = 0, modifier = 0) {
  const total = d20Roll + modifier;

  if (d20Roll === 20) {
    return { result: 'nat20', successes: 0, failures: 0, alive: true, conscious: true, stabilized: false, hp: 1, message: 'Natural 20! You regain 1 HP!' };
  }

  if (d20Roll === 1) {
    const newFailures = currentFailures + 2;
    if (newFailures >= 3) {
      return { result: 'nat1_death', successes: currentSuccesses, failures: 3, alive: false, conscious: false, stabilized: false, hp: 0, message: 'Natural 1... Two failures. You have died.' };
    }
    return { result: 'nat1', successes: currentSuccesses, failures: newFailures, alive: true, conscious: false, stabilized: false, hp: 0, message: `Natural 1! Two failures (${newFailures}/3).` };
  }

  if (total >= 10) {
    const newSuccesses = currentSuccesses + 1;
    if (newSuccesses >= 3) {
      return { result: 'stabilized', successes: 3, failures: currentFailures, alive: true, conscious: false, stabilized: true, hp: 0, message: 'Three successes! You are stabilized.' };
    }
    return { result: 'success', successes: newSuccesses, failures: currentFailures, alive: true, conscious: false, stabilized: false, hp: 0, message: `Success (${newSuccesses}/3).` };
  }

  const newFailures = currentFailures + 1;
  if (newFailures >= 3) {
    return { result: 'death', successes: currentSuccesses, failures: 3, alive: false, conscious: false, stabilized: false, hp: 0, message: 'Three failures. You have died.' };
  }
  return { result: 'failure', successes: currentSuccesses, failures: newFailures, alive: true, conscious: false, stabilized: false, hp: 0, message: `Failure (${newFailures}/3).` };
}

/**
 * Process taking damage at 0 HP.
 */
export function processDamageAt0HP(damage, maxHP, currentFailures = 0, isCrit = false) {
  if (damage >= maxHP) {
    return { result: 'instant_death', message: 'Massive damage! Instant death — damage equals or exceeds max HP.' };
  }
  const failuresAdded = isCrit ? 2 : 1;
  const newFailures = currentFailures + failuresAdded;
  if (newFailures >= 3) {
    return { result: 'death', failures: 3, message: `${isCrit ? 'Critical hit' : 'Damage'} at 0 HP — death.` };
  }
  return { result: 'failure_added', failures: newFailures, message: `${isCrit ? 'Critical hit — 2 failures' : '1 failure'} from damage (${newFailures}/3).` };
}
