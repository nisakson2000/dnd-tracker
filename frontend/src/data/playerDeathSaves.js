// playerDeathSaves.js
// Death Save Tracking — Player Mode Improvements #13, 86-88
// Pure JS, no React dependencies

// ─── Death Save Rules Reference ───────────────────────────────────────────────

export const DEATH_SAVE_RULES = {
  dc: 10,
  roll: "d20",
  stabilizeAt: {
    successes: 3,
    description: "3 successes = stabilized (unconscious but no longer dying)",
  },
  deathAt: {
    failures: 3,
    description: "3 failures = character dies",
  },
  specialRolls: {
    nat20: {
      value: 20,
      effect: "regain 1 HP and regain consciousness",
      description:
        "Rolling a natural 20 on a death save causes the character to regain 1 HP and become conscious.",
    },
    nat1: {
      value: 1,
      effect: "counts as 2 failures",
      description:
        "Rolling a natural 1 on a death save counts as 2 failures toward death.",
    },
  },
  damageAt0HP: {
    normal: {
      failures: 1,
      description:
        "Taking any damage while at 0 HP counts as 1 death save failure.",
    },
    critical: {
      failures: 2,
      description:
        "Taking a critical hit while at 0 HP counts as 2 death save failures.",
    },
  },
  healingAt0HP: {
    description:
      "Receiving any healing while at 0 HP causes the character to regain consciousness with HP equal to the healing received.",
  },
  resetConditions: [
    "Regaining any hit points resets death saves",
    "Completing a short or long rest resets death saves",
    "Becoming stable resets the failure count but character remains unconscious",
  ],
};

// ─── Death Save Tracker Template ──────────────────────────────────────────────

export const DEATH_SAVE_TRACKER_TEMPLATE = {
  successes: 0,      // 0–3: number of successful death saves
  failures: 0,       // 0–3: number of failed death saves
  stable: false,     // true when 3 successes reached (unconscious but stable)
  dead: false,       // true when 3 failures reached
  conscious: true,   // false when at 0 HP and dying; true when conscious
};

// ─── Spare the Dying ──────────────────────────────────────────────────────────

export const SPARE_THE_DYING = {
  name: "Spare the Dying",
  type: "cantrip",
  school: "Necromancy",
  castingTime: "1 action",
  range: "Touch",
  effect:
    "Auto-stabilizes a dying creature. No death save roll required. The target is stable but remains unconscious.",
  notes: [
    "Does not restore hit points",
    "Target remains unconscious until they regain at least 1 HP",
    "Cannot be used on constructs or undead",
  ],
};

// ─── Death Save Modifiers ─────────────────────────────────────────────────────

export const DEATH_SAVE_MODIFIERS = {
  ringOfProtection: {
    name: "Ring of Protection",
    type: "item",
    bonus: "+1",
    bonusValue: 1,
    bonusType: "flat",
    description: "Grants +1 to all saving throws, including death saves.",
    requires: "Attunement",
  },
  paladinAuraOfProtection: {
    name: "Aura of Protection",
    type: "class_feature",
    source: "Paladin (Level 6+)",
    bonus: "+CHA modifier",
    bonusType: "charisma_modifier",
    range: "10 feet",
    description:
      "Friendly creatures within 10 feet of the paladin (including the paladin) add the paladin's Charisma modifier to all saving throws, including death saves.",
    notes: [
      "Must be within 10 feet of the paladin",
      "Paladin must be conscious for the aura to function",
      "Uses the paladin's CHA modifier, not the dying creature's",
    ],
  },
  bless: {
    name: "Bless",
    type: "spell",
    school: "Enchantment",
    level: 1,
    bonus: "+1d4",
    bonusType: "d4",
    bonusDie: 4,
    description:
      "Targets of the Bless spell add a d4 to all saving throws, including death saves.",
    concentration: true,
    duration: "1 minute (concentration)",
  },
  diamondSoul: {
    name: "Diamond Soul",
    type: "class_feature",
    source: "Monk (Level 14+)",
    bonus: "Reroll once",
    bonusType: "reroll",
    description:
      "Monks of 14th level or higher may reroll any failed saving throw once, keeping the new result. This applies to death saves.",
    notes: [
      "Can only reroll a failed save, not a successful one",
      "Must use the second roll",
      "Applies proficiency bonus to all saving throws as well",
    ],
  },
  deathWard: {
    name: "Death Ward",
    type: "spell",
    school: "Abjuration",
    level: 4,
    bonus: "Automatic success (once)",
    bonusType: "auto_success",
    description:
      "If the protected creature would die or drop to 0 HP, Death Ward triggers once: the creature drops to 1 HP instead and the spell ends. If already at 0 HP and making death saves, Death Ward grants one automatic success without rolling.",
    duration: "8 hours",
    notes: [
      "Triggers automatically — no action required",
      "Expends the spell effect when triggered (one use only)",
      "Does not stack; multiple Death Wards do not grant multiple auto-successes",
    ],
  },
};

// ─── Helper: Clamp ────────────────────────────────────────────────────────────

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ─── Roll Death Save ──────────────────────────────────────────────────────────

/**
 * Rolls a d20 death save, optionally applying modifiers.
 *
 * @param {Object} modifiers - Active modifiers affecting the roll
 * @param {number}  [modifiers.flatBonus=0]         - Flat numeric bonus (e.g. Ring of Protection)
 * @param {boolean} [modifiers.hasBless=false]      - Whether Bless is active (rolls 1d4 bonus)
 * @param {boolean} [modifiers.hasDeathWard=false]  - Whether Death Ward triggers (auto-success)
 * @param {boolean} [modifiers.hasDiamondSoul=false]- Whether Diamond Soul reroll is available
 * @param {number}  [modifiers.paladinChaBonus=0]   - Paladin Aura of Protection CHA mod bonus
 * @returns {Object} Roll result details
 */
export function rollDeathSave(modifiers = {}) {
  const {
    flatBonus = 0,
    hasBless = false,
    hasDeathWard = false,
    hasDiamondSoul = false,
    paladinChaBonus = 0,
  } = modifiers;

  // Death Ward auto-succeeds without rolling
  if (hasDeathWard) {
    return {
      rawRoll: null,
      blessRoll: null,
      totalBonus: 0,
      finalResult: null,
      isNat20: false,
      isNat1: false,
      success: true,
      deathWardTriggered: true,
      diamondSoulUsed: false,
      notes: ["Death Ward triggered — automatic success (spell expended)."],
    };
  }

  const rawRoll = Math.floor(Math.random() * 20) + 1;
  const isNat20 = rawRoll === 20;
  const isNat1 = rawRoll === 1;

  let blessRoll = null;
  if (hasBless) {
    blessRoll = Math.floor(Math.random() * 4) + 1;
  }

  const totalBonus = flatBonus + paladinChaBonus + (blessRoll ?? 0);
  let finalResult = rawRoll + totalBonus;

  const notes = [];
  let diamondSoulUsed = false;

  // Nat 20 and nat 1 are always treated as-is regardless of modifiers
  const effectiveIsNat20 = rawRoll === 20;
  const effectiveIsNat1 = rawRoll === 1; // Nat 1 ALWAYS counts as 2 failures per PHB

  // Determine initial success/failure (nat1/nat20 bypass DC)
  let success;
  if (effectiveIsNat20) {
    success = true;
  } else if (rawRoll === 1) {
    success = false; // Nat 1 always = 2 failures regardless of modifiers (PHB)
  } else {
    success = finalResult >= DEATH_SAVE_RULES.dc;
  }

  // Diamond Soul: reroll if the save failed
  if (!success && hasDiamondSoul) {
    const reroll = Math.floor(Math.random() * 20) + 1;
    const rerollTotal = reroll + totalBonus;
    const rerollSuccess = reroll === 20 || (reroll !== 1 && rerollTotal >= DEATH_SAVE_RULES.dc);
    diamondSoulUsed = true;
    notes.push(
      `Diamond Soul reroll: ${reroll} (total ${rerollTotal}) — ${rerollSuccess ? "success" : "failure"}.`
    );
    finalResult = rerollTotal;
    success = rerollSuccess;
  }

  if (isNat20) notes.push("Natural 20 — regain 1 HP and regain consciousness!");
  if (rawRoll === 1) notes.push("Natural 1 — counts as 2 failures!");
  if (blessRoll !== null) notes.push(`Bless bonus: +${blessRoll}.`);
  if (flatBonus > 0) notes.push(`Flat bonus: +${flatBonus}.`);
  if (paladinChaBonus > 0) notes.push(`Paladin Aura of Protection: +${paladinChaBonus}.`);

  return {
    rawRoll,
    blessRoll,
    totalBonus,
    finalResult,
    isNat20: effectiveIsNat20,
    isNat1: rawRoll === 1,
    success,
    deathWardTriggered: false,
    diamondSoulUsed,
    notes,
  };
}

// ─── Process Death Save ───────────────────────────────────────────────────────

/**
 * Applies a death save roll result to the tracker.
 *
 * @param {Object}  tracker  - Current death save tracker (use DEATH_SAVE_TRACKER_TEMPLATE shape)
 * @param {number}  roll     - The final result of the death save roll (post-modifiers)
 * @param {boolean} isNat20 - Whether the raw die showed a natural 20
 * @param {boolean} isNat1  - Whether the raw die showed a natural 1
 * @returns {Object} Updated tracker copy with result metadata
 */
export function processDeathSave(tracker, roll, isNat20 = false, isNat1 = false) {
  if (tracker.stable || tracker.dead || tracker.conscious) {
    return {
      ...tracker,
      message: tracker.stable
        ? "Character is already stable."
        : tracker.dead
        ? "Character is dead."
        : "Character is conscious and not making death saves.",
      changed: false,
    };
  }

  const updated = { ...tracker };
  const messages = [];

  if (isNat20) {
    // Nat 20: regain 1 HP, become conscious, reset death saves
    updated.conscious = true;
    updated.successes = 0;
    updated.failures = 0;
    updated.stable = false;
    updated.dead = false;
    messages.push("Natural 20! Character regains 1 HP and regains consciousness.");
    return { ...updated, currentHP: 1, message: messages.join(" "), changed: true };
  }

  if (isNat1) {
    // Nat 1: 2 failures
    updated.failures = clamp(updated.failures + 2, 0, 3);
    messages.push("Natural 1 — 2 failure(s) added.");
  } else if (roll >= DEATH_SAVE_RULES.dc) {
    updated.successes = clamp(updated.successes + 1, 0, 3);
    messages.push(`Roll ${roll} — success.`);
  } else {
    updated.failures = clamp(updated.failures + 1, 0, 3);
    messages.push(`Roll ${roll} — failure.`);
  }

  // Check outcomes
  if (updated.successes >= 3) {
    updated.stable = true;
    updated.failures = 0;
    messages.push("3 successes — character is stable!");
  }

  if (updated.failures >= 3) {
    updated.dead = true;
    messages.push("3 failures — character has died.");
  }

  return { ...updated, message: messages.join(" "), changed: true };
}

// ─── Take Damage at 0 HP ──────────────────────────────────────────────────────

/**
 * Applies the death save failure(s) from taking damage while at 0 HP.
 *
 * @param {Object}  tracker    - Current death save tracker
 * @param {boolean} isCritical - Whether the hit was a critical hit (2 failures instead of 1)
 * @returns {Object} Updated tracker copy
 */
export function takeDamageAt0HP(tracker, isCritical = false) {
  if (tracker.dead) {
    return { ...tracker, message: "Character is already dead.", changed: false };
  }
  if (tracker.conscious) {
    return {
      ...tracker,
      message: "Character is conscious — they take damage normally, not a death save failure.",
      changed: false,
    };
  }

  const failuresToAdd = isCritical
    ? DEATH_SAVE_RULES.damageAt0HP.critical.failures
    : DEATH_SAVE_RULES.damageAt0HP.normal.failures;

  const updated = { ...tracker };
  updated.stable = false; // Damage destabilizes a stable creature
  updated.failures = clamp(updated.failures + failuresToAdd, 0, 3);

  const messages = [
    isCritical
      ? `Critical hit at 0 HP — ${failuresToAdd} death save failures added.`
      : `Damage taken at 0 HP — ${failuresToAdd} death save failure added.`,
  ];

  if (updated.failures >= 3) {
    updated.dead = true;
    messages.push("3 failures — character has died.");
  }

  return { ...updated, message: messages.join(" "), changed: true };
}

// ─── Receive Healing ──────────────────────────────────────────────────────────

/**
 * Applies healing to a character at 0 HP, restoring consciousness and resetting death saves.
 *
 * @param {Object} tracker       - Current death save tracker
 * @param {number} healingAmount - HP restored by the healing effect
 * @returns {Object} Updated tracker copy with new HP info
 */
export function receiveHealing(tracker, healingAmount = 0) {
  if (tracker.dead) {
    return {
      ...tracker,
      message: "Character is dead and cannot be healed (requires Revivify or similar).",
      changed: false,
    };
  }

  const hp = Math.max(1, Math.floor(healingAmount));
  const updated = {
    ...tracker,
    successes: 0,
    failures: 0,
    stable: false,
    dead: false,
    conscious: true,
  };

  return {
    ...updated,
    currentHP: hp,
    message: `Healed for ${hp} HP — character regains consciousness with ${hp} HP. Death saves reset.`,
    changed: true,
  };
}

// ─── Stabilize ────────────────────────────────────────────────────────────────

/**
 * Stabilizes the character (e.g., via Spare the Dying or a successful Medicine check).
 * The character remains unconscious but is no longer making death saves.
 *
 * @param {Object} tracker - Current death save tracker
 * @returns {Object} Updated tracker copy
 */
export function stabilize(tracker) {
  if (tracker.dead) {
    return { ...tracker, message: "Character is dead and cannot be stabilized.", changed: false };
  }
  if (tracker.conscious) {
    return { ...tracker, message: "Character is already conscious.", changed: false };
  }
  if (tracker.stable) {
    return { ...tracker, message: "Character is already stable.", changed: false };
  }

  const updated = {
    ...tracker,
    stable: true,
    failures: 0,
    successes: 0,
    conscious: false,
    dead: false,
  };

  return {
    ...updated,
    message: "Character is now stable — unconscious but no longer dying. Death saves reset.",
    changed: true,
  };
}

// ─── Reset Death Saves ────────────────────────────────────────────────────────

/**
 * Resets the death save tracker to its initial state (e.g., after a rest or full recovery).
 *
 * @returns {Object} A fresh death save tracker matching DEATH_SAVE_TRACKER_TEMPLATE
 */
export function resetDeathSaves() {
  return {
    ...DEATH_SAVE_TRACKER_TEMPLATE,
    message: "Death saves reset.",
    changed: true,
  };
}

// ─── Get Death Save Status ────────────────────────────────────────────────────

/**
 * Returns a human-readable status summary and metadata for the current tracker state.
 *
 * @param {Object} tracker - Current death save tracker
 * @returns {Object} Status object with label, description, and urgency level
 */
export function getDeathSaveStatus(tracker) {
  if (tracker.dead) {
    return {
      label: "Dead",
      description: "The character has died (3 death save failures).",
      urgency: "critical",
      successes: tracker.successes,
      failures: tracker.failures,
      stable: false,
      conscious: false,
      dead: true,
    };
  }

  if (tracker.conscious) {
    return {
      label: "Conscious",
      description: "The character is conscious and not in death save territory.",
      urgency: "none",
      successes: tracker.successes,
      failures: tracker.failures,
      stable: tracker.stable,
      conscious: true,
      dead: false,
    };
  }

  if (tracker.stable) {
    return {
      label: "Stable",
      description:
        "The character is stable and unconscious. They are no longer making death saves.",
      urgency: "low",
      successes: tracker.successes,
      failures: tracker.failures,
      stable: true,
      conscious: false,
      dead: false,
    };
  }

  // Dying — calculate urgency
  let urgency = "high";
  if (tracker.failures === 2) urgency = "critical";
  else if (tracker.failures === 1) urgency = "high";
  else if (tracker.successes === 2) urgency = "medium";

  const successesNeeded = 3 - tracker.successes;
  const failuresUntilDeath = 3 - tracker.failures;

  return {
    label: "Dying",
    description: `Character is dying. Needs ${successesNeeded} more success(es) to stabilize; ${failuresUntilDeath} more failure(s) until death.`,
    urgency,
    successes: tracker.successes,
    failures: tracker.failures,
    successesNeeded,
    failuresUntilDeath,
    stable: false,
    conscious: false,
    dead: false,
  };
}
