/**
 * playerInitiativeTracker.js
 * Player Mode: Initiative tracking state management and display
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_MODIFIERS = [
  { source: 'DEX modifier', type: 'base', stacks: true },
  { source: 'Alert feat (+5)', type: 'feat', stacks: true },
  { source: 'Champion of the Wild (+WIS)', type: 'class', stacks: true },
  { source: 'Jack of All Trades (+half prof)', type: 'class', stacks: true },
  { source: 'Weapon of Warning (advantage)', type: 'item', stacks: false },
  { source: 'War Magic (+2 after casting cantrip/1st)', type: 'class', stacks: true },
  { source: 'Swashbuckler (+CHA)', type: 'class', stacks: true },
  { source: 'Gift of Alacrity (+1d8)', type: 'spell', stacks: true },
  { source: 'Advantage (multiple sources)', type: 'advantage', stacks: false },
];

export const GOING_FIRST_TIPS = [
  'First turn sets the tone. Use it for your best opening move.',
  'Buff spells (Bless, Faerie Fire) are best cast before enemies act.',
  'Control spells (Web, Hypnotic Pattern) can shut down groups before they move.',
  'First-turn Rogue: Hide for Sneak Attack advantage.',
  'First-turn Paladin: Move to front. Shield of Faith or Bless.',
  'Alert feat: +5 initiative AND can\'t be surprised. Top-tier.',
];

export const GOING_LAST_TIPS = [
  'React to what happened. Your allies\' and enemies\' positions are known.',
  'Heal allies who went down in the first round.',
  'AoE in positions where enemies have already clumped.',
  'Going last isn\'t bad — it\'s information advantage.',
  'Ready an action if you can\'t do anything useful this round.',
];

export function rollInitiative(dexMod, bonuses) {
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + dexMod + (bonuses || 0);
  return { roll, dexMod, bonuses, total, isNat20: roll === 20 };
}

export function sortInitiativeOrder(entries) {
  return [...entries].sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    // Tie-breaking: higher DEX goes first
    return (b.dexMod || 0) - (a.dexMod || 0);
  });
}

export function createInitiativeEntry(name, total, dexMod, isPlayer) {
  return {
    id: Date.now() + Math.random(),
    name,
    total,
    dexMod: dexMod || 0,
    isPlayer: isPlayer !== false,
    hasActed: false,
    conditions: [],
  };
}
