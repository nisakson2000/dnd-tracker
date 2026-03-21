/**
 * playerInitiativeHelper.js
 * Player Mode Improvements 37, 145, 150: Initiative roll, next-up preview, action planning
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// INITIATIVE HELPERS
// ---------------------------------------------------------------------------

/**
 * Calculate initiative modifier.
 * Initiative = DEX modifier + any bonuses (Alert feat, etc.)
 */
export function getInitiativeModifier(dexScore, bonuses = []) {
  const dexMod = Math.floor((dexScore - 10) / 2);
  const totalBonus = bonuses.reduce((sum, b) => sum + (b.value || 0), 0);
  return dexMod + totalBonus;
}

/**
 * Common initiative bonuses.
 */
export const INITIATIVE_BONUSES = [
  { id: 'alert', name: 'Alert Feat', value: 5, description: '+5 to initiative, cannot be surprised' },
  { id: 'jack_of_all_trades', name: 'Jack of All Trades', value: 'half_prof', description: 'Add half proficiency to initiative (Bard 2+)' },
  { id: 'remarkable_athlete', name: 'Remarkable Athlete', value: 'half_prof', description: 'Add half proficiency to initiative (Champion Fighter 7+)' },
  { id: 'dread_ambusher', name: 'Dread Ambusher', value: 'wis_mod', description: 'Add WIS modifier to initiative (Gloom Stalker Ranger)' },
  { id: 'gift_of_alacrity', name: 'Gift of Alacrity', value: '1d8', description: 'Add 1d8 to initiative for 8 hours (Chronurgy Wizard)' },
  { id: 'war_wizard', name: 'Tactical Wit', value: 'int_mod', description: 'Add INT modifier to initiative (War Magic Wizard 2+)' },
  { id: 'swashbuckler', name: 'Rakish Audacity', value: 'cha_mod', description: 'Add CHA modifier to initiative (Swashbuckler Rogue 3+)' },
];

// ---------------------------------------------------------------------------
// TURN ORDER HELPERS
// ---------------------------------------------------------------------------

/**
 * Find the next player in initiative order after a given player.
 */
export function getNextInOrder(initiativeOrder, currentIndex) {
  if (!initiativeOrder || initiativeOrder.length === 0) return null;
  const nextIdx = (currentIndex + 1) % initiativeOrder.length;
  return initiativeOrder[nextIdx];
}

/**
 * Check if the player is next in order (one turn away).
 */
export function isPlayerUpNext(initiativeOrder, currentTurnIndex, playerName) {
  if (!initiativeOrder || initiativeOrder.length <= 1) return false;
  const nextIdx = (currentTurnIndex + 1) % initiativeOrder.length;
  const next = initiativeOrder[nextIdx];
  return next && (next.name === playerName || next.player_name === playerName);
}

/**
 * Count turns until the player's turn.
 */
export function turnsUntilMyTurn(initiativeOrder, currentTurnIndex, playerName) {
  if (!initiativeOrder || initiativeOrder.length === 0) return -1;
  for (let i = 1; i <= initiativeOrder.length; i++) {
    const idx = (currentTurnIndex + i) % initiativeOrder.length;
    const entry = initiativeOrder[idx];
    if (entry && (entry.name === playerName || entry.player_name === playerName)) {
      return i;
    }
  }
  return -1;
}

// ---------------------------------------------------------------------------
// ACTION PLANNING
// ---------------------------------------------------------------------------

export const PLANNED_ACTION_TEMPLATE = {
  action: '',        // "Attack Goblin with Longsword"
  bonusAction: '',   // "Healing Word on Cleric"
  movement: '',      // "Move behind cover"
  reaction: '',      // "Shield if hit"
  notes: '',         // Any extra notes
};

/**
 * Check if a plan has any content.
 */
export function hasPlan(plan) {
  return !!(plan.action || plan.bonusAction || plan.movement || plan.reaction || plan.notes);
}
