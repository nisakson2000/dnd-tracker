/**
 * playerFallingRules.js
 * Player Mode: Falling damage, flying creature rules, and jumping
 * Pure JS — no React dependencies.
 */

export const FALLING_RULES = {
  damage: '1d6 bludgeoning per 10 feet fallen.',
  maximum: '20d6 (200 feet max).',
  landing: 'Creature lands prone if it takes damage.',
  instantaneous: 'Falling happens instantly (500ft per round in combat).',
};

export const JUMPING_RULES = {
  longJump: {
    running: 'Feet equal to STR score (with 10ft running start).',
    standing: 'Half STR score (no running start).',
    clearance: 'Low obstacle (no taller than 1/4 jump distance): DC 10 Athletics to clear.',
  },
  highJump: {
    running: '3 + STR modifier feet (with 10ft running start).',
    standing: 'Half that distance.',
    reach: 'Can extend arms half height above jump. Reach = 1.5x height + jump height.',
  },
};

export const FLYING_RULES = {
  falling: 'A flying creature that is knocked prone, has speed reduced to 0, or is otherwise deprived of the ability to move falls.',
  hover: 'Creatures that can hover don\'t fall when speed is 0 or when knocked prone in the air.',
  featherFall: '1st level spell (reaction): Slow falling to 60ft/round, no damage.',
};

export function calculateFallingDamage(feetFallen) {
  const dice = Math.min(20, Math.floor(feetFallen / 10));
  return { dice, expression: `${dice}d6`, average: Math.floor(dice * 3.5), max: dice * 6 };
}

export function calculateLongJump(strScore, hasRunningStart = true) {
  return hasRunningStart ? strScore : Math.floor(strScore / 2);
}

export function calculateHighJump(strModifier, hasRunningStart = true) {
  const jump = 3 + strModifier;
  return hasRunningStart ? Math.max(0, jump) : Math.max(0, Math.floor(jump / 2));
}
