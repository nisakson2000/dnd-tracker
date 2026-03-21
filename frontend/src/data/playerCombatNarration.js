/**
 * playerCombatNarration.js
 * Player Mode Improvements 140: Combat narration auto-generated from rolls
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ATTACK NARRATION TEMPLATES
// ---------------------------------------------------------------------------

const CRIT_NARRATIONS = [
  (name, weapon) => `${name} lands a devastating blow with their ${weapon}!`,
  (name, weapon) => `${name}'s ${weapon} strikes with perfect precision!`,
  (name, weapon) => `A masterful strike! ${name}'s ${weapon} finds its mark perfectly!`,
  (name, weapon) => `${name} delivers a crushing critical hit with their ${weapon}!`,
  (name, weapon) => `The ${weapon} sings through the air as ${name} lands a critical strike!`,
];

const HIT_NARRATIONS = [
  (name, weapon) => `${name} strikes true with their ${weapon}.`,
  (name, weapon) => `${name}'s ${weapon} connects solidly.`,
  (name, weapon) => `A clean hit from ${name}'s ${weapon}.`,
  (name, weapon) => `${name} lands a blow with their ${weapon}.`,
];

const MISS_NARRATIONS = [
  (name, weapon) => `${name}'s ${weapon} swings wide.`,
  (name, weapon) => `${name} misses with their ${weapon}.`,
  (name, weapon) => `The ${weapon} fails to connect as ${name}'s strike goes astray.`,
  (name, weapon) => `${name}'s attack with their ${weapon} finds only air.`,
];

const FUMBLE_NARRATIONS = [
  (name, weapon) => `${name} stumbles badly, their ${weapon} clattering awkwardly!`,
  (name, weapon) => `A terrible miss! ${name} nearly drops their ${weapon}!`,
  (name, weapon) => `${name}'s ${weapon} goes wildly off-target!`,
  (name, weapon) => `${name} whiffs spectacularly with their ${weapon}!`,
];

// ---------------------------------------------------------------------------
// SPELL NARRATION TEMPLATES
// ---------------------------------------------------------------------------

const SPELL_CAST_NARRATIONS = [
  (name, spell) => `${name} channels arcane energy, casting ${spell}!`,
  (name, spell) => `${name} weaves a spell — ${spell} takes effect!`,
  (name, spell) => `With mystic words, ${name} unleashes ${spell}!`,
  (name, spell) => `${name} invokes the power of ${spell}!`,
];

const HEAL_NARRATIONS = [
  (name, spell, amount) => `${name} casts ${spell}, mending wounds for ${amount} HP!`,
  (name, spell, amount) => `Healing light flows from ${name}'s hands — ${spell} restores ${amount} HP!`,
  (name, spell, amount) => `${name}'s ${spell} knits torn flesh, healing ${amount} HP!`,
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate attack narration based on roll results.
 */
export function narrateAttack(playerName, weaponName, d20, isCrit, isFumble, isHit, damage = null) {
  let text;
  if (isCrit) {
    text = pickRandom(CRIT_NARRATIONS)(playerName, weaponName);
    if (damage) text += ` (${damage} damage!)`;
  } else if (isFumble) {
    text = pickRandom(FUMBLE_NARRATIONS)(playerName, weaponName);
  } else if (isHit) {
    text = pickRandom(HIT_NARRATIONS)(playerName, weaponName);
    if (damage) text += ` (${damage} damage)`;
  } else {
    text = pickRandom(MISS_NARRATIONS)(playerName, weaponName);
  }
  return text;
}

/**
 * Generate spell narration.
 */
export function narrateSpell(playerName, spellName, healAmount = null) {
  if (healAmount) {
    return pickRandom(HEAL_NARRATIONS)(playerName, spellName, healAmount);
  }
  return pickRandom(SPELL_CAST_NARRATIONS)(playerName, spellName);
}

/**
 * Generate death save narration.
 */
export function narrateDeathSave(playerName, roll, isSuccess) {
  if (roll === 20) return `${playerName}'s eyes snap open — a miracle! They cling to life with 1 HP!`;
  if (roll === 1) return `${playerName}'s grip on life falters badly... two failures marked.`;
  if (isSuccess) return `${playerName} fights back against the void — a successful death save.`;
  return `${playerName} slips closer to the edge... a failed death save.`;
}

/**
 * Generate generic action narration.
 */
export function narrateAction(playerName, action) {
  const actions = {
    dash: `${playerName} sprints forward, doubling their movement!`,
    dodge: `${playerName} focuses entirely on defense, ready to dodge incoming attacks.`,
    disengage: `${playerName} carefully withdraws from combat.`,
    hide: `${playerName} slips into the shadows, attempting to hide.`,
    help: `${playerName} assists an ally, granting them advantage on their next check.`,
    ready: `${playerName} prepares an action, waiting for the right moment.`,
    grapple: `${playerName} reaches out to grapple their opponent!`,
    shove: `${playerName} attempts to shove their opponent!`,
  };
  return actions[action] || `${playerName} takes an action.`;
}
