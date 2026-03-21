/**
 * playerActionReminders.js
 * Player Mode: Context-aware action reminders and prompts
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// CONCENTRATION DAMAGE REMINDERS
// ---------------------------------------------------------------------------

export const CONCENTRATION_REMINDER = {
  trigger: 'damage_taken',
  condition: 'concentrating on a spell',
  message: 'Concentration check required!',
  details: 'Make a Constitution saving throw. DC = max(10, damage/2).',
};

// ---------------------------------------------------------------------------
// OPPORTUNITY ATTACK REMINDERS
// ---------------------------------------------------------------------------

export const OA_REMINDER = {
  trigger: 'enemy_leaves_reach',
  message: 'Opportunity Attack available!',
  details: 'Use your reaction to make one melee attack against the leaving creature.',
};

// ---------------------------------------------------------------------------
// TURN-BASED REMINDERS
// ---------------------------------------------------------------------------

export const TURN_REMINDERS = {
  start_of_turn: [
    { check: 'has_aura_damage', message: 'Check for aura damage (Spirit Guardians, etc.)' },
    { check: 'has_regeneration', message: 'Apply regeneration or healing effects' },
    { check: 'has_frightened', message: 'Frightened: You cannot willingly move closer to the source' },
    { check: 'has_hex', message: 'Hex active: Target has disadvantage on chosen ability checks' },
    { check: 'has_rage', message: 'Rage: Must attack or take damage to maintain rage' },
  ],
  end_of_turn: [
    { check: 'has_save_condition', message: 'Make saving throw to end condition' },
    { check: 'has_ongoing_damage', message: 'Apply end-of-turn damage effects' },
    { check: 'has_hexblade_curse', message: 'Hexblade\'s Curse: Check if target dropped to 0 HP (bonus action next turn)' },
  ],
};

// ---------------------------------------------------------------------------
// HIT/MISS REMINDERS
// ---------------------------------------------------------------------------

export const HIT_REMINDERS = [
  { check: 'is_rogue', message: 'Sneak Attack: Did you have advantage or an ally adjacent?', type: 'sneak_attack' },
  { check: 'is_paladin', message: 'Divine Smite: Expend a spell slot for extra radiant damage?', type: 'smite' },
  { check: 'has_hex', message: 'Hex: Add 1d6 necrotic damage to this hit.', type: 'hex' },
  { check: 'has_hunters_mark', message: "Hunter's Mark: Add 1d6 damage to this hit.", type: 'hunters_mark' },
  { check: 'is_barbarian_raging', message: 'Rage: Add rage damage bonus to this melee hit.', type: 'rage' },
  { check: 'has_great_weapon_master', message: 'On crit or kill: Bonus action melee attack available.', type: 'gwm_bonus' },
];

export const MISS_REMINDERS = [
  { check: 'has_lucky', message: 'Lucky: Spend a luck point to reroll?', type: 'lucky' },
  { check: 'has_halfling_lucky', message: 'Halfling Lucky: Reroll that natural 1!', type: 'halfling_lucky' },
  { check: 'has_indomitable', message: 'Indomitable (Fighter): Reroll a failed saving throw.', type: 'indomitable' },
];

// ---------------------------------------------------------------------------
// DAMAGE TAKEN REMINDERS
// ---------------------------------------------------------------------------

export const DAMAGE_TAKEN_REMINDERS = [
  { check: 'has_uncanny_dodge', message: 'Uncanny Dodge: Use reaction to halve the damage?', type: 'uncanny_dodge' },
  { check: 'has_shield_spell', message: 'Shield: Cast as reaction for +5 AC?', type: 'shield' },
  { check: 'has_hellish_rebuke', message: 'Hellish Rebuke: Cast as reaction (2d10 fire)?', type: 'hellish_rebuke' },
  { check: 'has_absorb_elements', message: 'Absorb Elements: Halve the elemental damage and add 1d6 to next melee attack?', type: 'absorb_elements' },
  { check: 'is_raging', message: 'Rage: Resistance to bludgeoning, piercing, and slashing damage.', type: 'rage_resistance' },
  { check: 'has_heavy_armor_master', message: 'Heavy Armor Master: Reduce nonmagical BPS damage by 3.', type: 'ham' },
];

/**
 * Get applicable reminders for a given trigger and character state.
 */
export function getReminders(trigger, characterState = {}) {
  switch (trigger) {
    case 'hit':
      return HIT_REMINDERS.filter(r => characterState[r.check]);
    case 'miss':
      return MISS_REMINDERS.filter(r => characterState[r.check]);
    case 'damage_taken':
      return DAMAGE_TAKEN_REMINDERS.filter(r => characterState[r.check]);
    default:
      return [];
  }
}
