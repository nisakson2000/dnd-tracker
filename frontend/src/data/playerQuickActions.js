/**
 * playerQuickActions.js
 * Player Mode: One-tap quick actions for common combat decisions
 * Pure JS — no React dependencies.
 */

export const QUICK_ACTIONS = {
  combat: [
    { id: 'attack', label: 'Attack', icon: '⚔️', description: 'Make a melee or ranged attack.', rollNeeded: 'd20 + attack mod vs AC' },
    { id: 'castSpell', label: 'Cast Spell', icon: '✨', description: 'Cast a spell using a spell slot or cantrip.', rollNeeded: 'Varies by spell' },
    { id: 'dash', label: 'Dash', icon: '🏃', description: 'Double your movement speed for this turn.', rollNeeded: 'None' },
    { id: 'dodge', label: 'Dodge', icon: '🛡️', description: 'All attacks against you have disadvantage. Advantage on DEX saves.', rollNeeded: 'None' },
    { id: 'disengage', label: 'Disengage', icon: '↩️', description: 'Your movement doesn\'t provoke Opportunity Attacks.', rollNeeded: 'None' },
    { id: 'help', label: 'Help', icon: '🤝', description: 'Give an ally advantage on their next attack or check.', rollNeeded: 'None' },
    { id: 'hide', label: 'Hide', icon: '👁️', description: 'Make a Stealth check to become hidden.', rollNeeded: 'd20 + Stealth vs Perception' },
    { id: 'ready', label: 'Ready', icon: '⏳', description: 'Set a trigger for an action to take as a reaction.', rollNeeded: 'None until triggered' },
    { id: 'grapple', label: 'Grapple', icon: '🤼', description: 'Contest: your Athletics vs their Athletics/Acrobatics.', rollNeeded: 'Contested check' },
    { id: 'shove', label: 'Shove', icon: '👊', description: 'Push 5ft or knock prone. Athletics contest.', rollNeeded: 'Contested check' },
  ],
  bonus: [
    { id: 'offhand', label: 'Off-hand Attack', icon: '🗡️', description: 'TWF: attack with light weapon in other hand (no mod to damage).', rollNeeded: 'd20 + attack mod' },
    { id: 'cunning', label: 'Cunning Action', icon: '💨', description: 'Rogue: Dash, Disengage, or Hide as bonus action.', rollNeeded: 'Varies' },
    { id: 'rage', label: 'Rage', icon: '🔥', description: 'Barbarian: Enter rage for damage and resistance.', rollNeeded: 'None' },
    { id: 'healingWord', label: 'Healing Word', icon: '💚', description: 'Bonus action heal, 60ft range. 1d4+mod.', rollNeeded: 'None (auto-heal)' },
    { id: 'spiritualWeapon', label: 'Spiritual Weapon', icon: '🔨', description: 'Bonus action attack each turn. No concentration.', rollNeeded: 'd20 + spell attack' },
    { id: 'hex', label: 'Hex/Hunter\'s Mark', icon: '🎯', description: 'Mark target for +1d6 per hit.', rollNeeded: 'None' },
  ],
  reaction: [
    { id: 'oa', label: 'Opportunity Attack', icon: '⚔️', description: 'Melee attack when enemy leaves your reach.', rollNeeded: 'd20 + attack mod' },
    { id: 'shield', label: 'Shield', icon: '🛡️', description: '+5 AC until start of next turn.', rollNeeded: 'None (1st-level slot)' },
    { id: 'counterspell', label: 'Counterspell', icon: '🚫', description: 'Negate a spell. Auto if same/lower level.', rollNeeded: 'Ability check if higher level' },
    { id: 'absorbElements', label: 'Absorb Elements', icon: '🌀', description: 'Halve elemental damage. +1d6 on next melee.', rollNeeded: 'None (1st-level slot)' },
    { id: 'uncannyDodge', label: 'Uncanny Dodge', icon: '⚡', description: 'Halve damage from one attack you can see.', rollNeeded: 'None' },
  ],
};

export function getQuickActions(type) {
  return QUICK_ACTIONS[type] || [];
}

export function getAllQuickActions() {
  return [...QUICK_ACTIONS.combat, ...QUICK_ACTIONS.bonus, ...QUICK_ACTIONS.reaction];
}

export function getActionById(id) {
  return getAllQuickActions().find(a => a.id === id) || null;
}
