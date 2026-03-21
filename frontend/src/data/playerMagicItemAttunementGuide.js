/**
 * playerMagicItemAttunementGuide.js
 * Player Mode: Magic item attunement strategy — managing 3 slots
 * Pure JS — no React dependencies.
 */

export const ATTUNEMENT_RULES = {
  maxSlots: 3,
  process: 'Short rest (1 hour) focusing on the item. Must meet prerequisites.',
  ending: 'Another short rest to end attunement, or item moves 100ft away for 24h, death, or another creature attunes.',
  note: 'Only 3 attunement slots. This is the most important resource management in magic item builds. Choose wisely.',
};

export const ATTUNEMENT_PRIORITY_BY_CLASS = [
  { class: 'Fighter', slots: [
    { priority: 1, item: 'Belt of Giant Strength / Gauntlets of Ogre Power', reason: 'STR to 21-29. Frees ASIs for feats. Massive for GWM builds.' },
    { priority: 2, item: 'Cloak of Displacement / Cloak of Protection', reason: 'Disadvantage on attacks against you / +1 AC and saves.' },
    { priority: 3, item: 'Winged Boots / Boots of Speed', reason: 'Flight or double speed. Mobility defines martial effectiveness.' },
  ]},
  { class: 'Wizard', slots: [
    { priority: 1, item: 'Arcane Grimoire +1/+2/+3', reason: '+spell attack/DC. Better spell saves = better control.' },
    { priority: 2, item: 'Amulet of Health (CON 19)', reason: 'CON 19 = huge HP pool. Frees the dump stat.' },
    { priority: 3, item: 'Cloak of Protection', reason: '+1 AC and saves. Survivability for a squishy caster.' },
  ]},
  { class: 'Cleric', slots: [
    { priority: 1, item: 'Amulet of the Devout +1/+2/+3', reason: '+spell attack/DC + extra Channel Divinity use. Core item.' },
    { priority: 2, item: 'Belt of Giant Strength (melee Cleric)', reason: 'For melee Clerics: STR to 21+. Spirit Guardians + high STR frontline.' },
    { priority: 3, item: 'Ring of Protection / Cloak of Protection', reason: '+1 AC and saves. More survivability for the frontline healer.' },
  ]},
  { class: 'Rogue', slots: [
    { priority: 1, item: 'Cloak of Displacement', reason: 'Disadvantage on attacks against you. Rogues have one big hit — can\'t afford to go down.' },
    { priority: 2, item: 'Winged Boots', reason: 'Flight for ranged Sneak Attack positioning. Unreachable sniper.' },
    { priority: 3, item: 'Ring of Protection', reason: '+1 AC and saves. Evasion + good saves = nearly unkillable.' },
  ]},
];

export const BEST_NON_ATTUNEMENT_ITEMS = [
  { item: '+1/+2/+3 Weapon', note: 'No attunement. +hit, +damage, counts as magical. Always useful.' },
  { item: '+1/+2/+3 Armor', note: 'No attunement. Flat AC boost. Mandatory upgrade.' },
  { item: '+1/+2/+3 Shield', note: 'No attunement. +AC on top of shield bonus.' },
  { item: 'Bag of Holding', note: 'No attunement. 500 lbs in a small bag. Essential utility.' },
  { item: 'Immovable Rod', note: 'No attunement. Creative problem-solving tool. Lock doors, climb, create platforms.' },
  { item: 'Pearl of Power', note: 'Requires attunement BUT recovers a L3 slot. Worth considering for casters.' },
  { item: 'Periapt of Wound Closure', note: 'Attunement. Stabilize automatically, double healing from hit dice. Great for short-rest-heavy games.' },
];

export const ATTUNEMENT_SWAP_STRATEGY = [
  { situation: 'Before dungeon', action: 'Attune to combat items (weapons, armor, defensive items).', note: 'Prioritize survival and damage output.' },
  { situation: 'Before social encounter', action: 'Swap to Headband of Intellect, Ring of Persuasion, or Helm of Telepathy.', note: 'Short rest to swap. Plan ahead.' },
  { situation: 'Before exploration', action: 'Winged Boots, Goggles of Night, Lantern of Revealing.', note: 'Utility items for navigation and detection.' },
  { situation: 'General rule', action: 'Keep 2 combat items permanently attuned. Swap the 3rd slot based on situation.', note: 'Minimize attunement churn — each swap costs a short rest.' },
];

export function attunementSlotsRemaining(currentAttuned) {
  return Math.max(0, 3 - currentAttuned);
}

export function isAttunementWorthSwapping(currentItemValue, newItemValue, shortRestAvailable) {
  if (!shortRestAvailable) return { worth: false, reason: 'No short rest available to swap.' };
  return { worth: newItemValue > currentItemValue, reason: newItemValue > currentItemValue ? 'New item is better for this situation.' : 'Current item is already optimal.' };
}
