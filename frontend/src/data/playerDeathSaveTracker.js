/**
 * playerDeathSaveTracker.js
 * Player Mode: Death saving throw tracking and rules
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_RULES = {
  when: 'When you start your turn at 0 HP.',
  dc: 'DC 10. Unmodified d20 roll (usually).',
  success: '3 successes = stable (unconscious, 1d4 hours to wake).',
  failure: '3 failures = dead.',
  nat20: 'Natural 20: regain 1 HP and wake up immediately.',
  nat1: 'Natural 1: counts as TWO failures.',
  damage: 'Taking damage while at 0 HP = 1 auto-failure. Crit = 2 failures.',
  healing: 'ANY healing at 0 HP wakes you up. Healing Word is the best response.',
  stable: 'Stable creatures regain 1 HP after 1d4 hours.',
  modifiers: 'Some features add to death saves: Diamond Soul (Monk), Bless, etc.',
};

export const DEATH_SAVE_ODDS = {
  baseSuccess: '55% per roll (11-20 succeed)',
  survivalOverall: '59.5% chance to survive all 3 saves',
  withBless: '1d4 bonus. Survival rate jumps to ~80%',
  withAdvantage: 'Halfling Lucky / Diamond Soul. ~80% per roll',
  afterNat1: '2 failures immediately. Very dangerous.',
  afterDamage: 'Each hit at 0 = another failure. Get them UP or stabilize.',
};

export const ALLY_DOWN_PROTOCOLS = [
  { priority: 1, action: 'Healing Word (bonus action, 60ft)', who: 'Any healer', why: 'Best response. Picks them up without using your action.' },
  { priority: 2, action: 'Lay on Hands (1 HP)', who: 'Paladin', why: 'Minimum healing to wake them. Save the pool.' },
  { priority: 3, action: 'Spare the Dying (cantrip)', who: 'Cleric (or anyone with feat)', why: 'Stabilizes without healing. No HP but no more death saves.' },
  { priority: 4, action: 'Medicine check (DC 10)', who: 'Anyone', why: 'Free to attempt. Stabilizes on success.' },
  { priority: 5, action: 'Potion of Healing', who: 'Anyone adjacent', why: 'Uses your action to feed it to them. 2d4+2 HP.' },
  { priority: 6, action: 'Kill the enemy first', who: 'DPS', why: 'If the enemy is nearly dead, removing the threat may be better.' },
];

export function createDeathSaveState() {
  return {
    successes: 0,
    failures: 0,
    stable: false,
    dead: false,
    conscious: true,
  };
}

export function recordSave(state, roll) {
  if (state.stable || state.dead || state.conscious) return state;

  const newState = { ...state };

  if (roll === 20) {
    return { ...newState, successes: 0, failures: 0, conscious: true };
  }
  if (roll === 1) {
    newState.failures += 2;
  } else if (roll >= 10) {
    newState.successes += 1;
  } else {
    newState.failures += 1;
  }

  if (newState.successes >= 3) newState.stable = true;
  if (newState.failures >= 3) newState.dead = true;

  return newState;
}

export function takeDamageAt0(state, isCrit) {
  if (state.stable || state.dead) return state;
  const newState = { ...state };
  newState.failures += isCrit ? 2 : 1;
  if (newState.failures >= 3) newState.dead = true;
  return newState;
}
