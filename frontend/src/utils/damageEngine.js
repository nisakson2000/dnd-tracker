export const DAMAGE_TYPES = [
  'acid',
  'bludgeoning',
  'cold',
  'fire',
  'force',
  'lightning',
  'necrotic',
  'piercing',
  'poison',
  'psychic',
  'radiant',
  'slashing',
  'thunder',
];

export function calculateEffectiveDamage({
  amount,
  damageType,
  resistances = [],
  vulnerabilities = [],
  immunities = [],
}) {
  const type = damageType?.toLowerCase();

  if (immunities.map(t => t.toLowerCase()).includes(type)) {
    return { effective: 0, modifier: 'immune', original: amount };
  }

  if (resistances.map(t => t.toLowerCase()).includes(type)) {
    return { effective: Math.floor(amount / 2), modifier: 'resistant', original: amount };
  }

  if (vulnerabilities.map(t => t.toLowerCase()).includes(type)) {
    return { effective: amount * 2, modifier: 'vulnerable', original: amount };
  }

  return { effective: amount, modifier: 'normal', original: amount };
}

export function resolveDeathSave(roll) {
  if (roll === 20) {
    return {
      type: 'nat20',
      successes: 0,
      failures: 0,
      description: 'Natural 20! Regain 1 HP and reset death saves.',
    };
  }

  if (roll === 1) {
    return {
      type: 'nat1',
      successes: 0,
      failures: 2,
      description: 'Natural 1! Two death save failures.',
    };
  }

  if (roll >= 10) {
    return {
      type: 'success',
      successes: 1,
      failures: 0,
      description: `Rolled ${roll} — death save success.`,
    };
  }

  return {
    type: 'failure',
    successes: 0,
    failures: 1,
    description: `Rolled ${roll} — death save failure.`,
  };
}

export function checkConcentration(damageTaken) {
  return Math.max(10, Math.floor(damageTaken / 2));
}

export function calculateHealingResult({ amount, currentHp, maxHp, tempHp = 0 }) {
  const wasAtZero = currentHp === 0;
  const newHp = Math.min(currentHp + amount, maxHp);
  const actualHealing = newHp - currentHp;

  return { newHp, actualHealing, wasAtZero };
}

export function applyDamageToHp({ damage, currentHp, tempHp = 0, maxHp }) {
  let remaining = damage;
  let newTempHp = tempHp;
  let newHp = currentHp;

  if (newTempHp > 0) {
    if (remaining >= newTempHp) {
      remaining -= newTempHp;
      newTempHp = 0;
    } else {
      newTempHp -= remaining;
      remaining = 0;
    }
  }

  newHp = Math.max(0, currentHp - remaining);

  const droppedToZero = currentHp > 0 && newHp === 0;
  const overkill = remaining > currentHp ? remaining - currentHp : 0;
  const massiveDamage = droppedToZero && overkill >= maxHp;

  return { newHp, newTempHp, overkill, droppedToZero, massiveDamage };
}
