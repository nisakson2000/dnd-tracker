/**
 * playerCombatHotkeys.js
 * Player Mode: Quick reference for in-app combat keyboard shortcuts and actions
 * Pure JS — no React dependencies.
 */

export const COMBAT_QUICK_ACTIONS = [
  { action: 'Attack (Melee)', description: 'd20 + STR mod + prof bonus vs target AC.', shortcut: 'Click attack button or quick roll STR check.' },
  { action: 'Attack (Ranged)', description: 'd20 + DEX mod + prof bonus vs target AC. Disadvantage within 5ft of hostile.', shortcut: 'Click attack button or quick roll DEX check.' },
  { action: 'Cast a Spell', description: 'Select spell from spell list. Auto-applies known effects.', shortcut: 'Open spell tab in combat HUD.' },
  { action: 'Dodge', description: 'Uses your action. Attack rolls against you have disadvantage. DEX saves with advantage.', shortcut: 'Action economy tracker → Dodge.' },
  { action: 'Dash', description: 'Uses your action. Gain extra movement equal to your speed.', shortcut: 'Action economy tracker → Dash.' },
  { action: 'Disengage', description: 'Uses your action. Movement doesn\'t provoke opportunity attacks.', shortcut: 'Action economy tracker → Disengage.' },
  { action: 'Help', description: 'Uses your action. Give advantage to an ally\'s next attack or check.', shortcut: 'Action economy tracker → Help.' },
  { action: 'Hide', description: 'Uses your action. DEX (Stealth) check. Must be obscured or behind cover.', shortcut: 'Action economy tracker → Hide.' },
  { action: 'Ready', description: 'Uses your action. Set a trigger and prepared action. Uses reaction when triggered.', shortcut: 'Action economy tracker → Ready.' },
  { action: 'Grapple', description: 'Replaces one attack. STR (Athletics) vs STR (Athletics) or DEX (Acrobatics).', shortcut: 'Attack tab → Grapple button.' },
  { action: 'Shove', description: 'Replaces one attack. STR (Athletics) vs STR (Athletics) or DEX (Acrobatics).', shortcut: 'Attack tab → Shove button.' },
  { action: 'End Turn', description: 'Signal that your turn is complete. Resolves end-of-turn effects.', shortcut: 'End Turn button in action bar.' },
];

export const REACTION_QUICK_REF = [
  { reaction: 'Opportunity Attack', trigger: 'Hostile creature leaves your reach using its movement.', note: 'One melee attack. Uses your reaction.' },
  { reaction: 'Shield (1st)', trigger: 'You are hit by an attack or targeted by Magic Missile.', note: '+5 AC until start of next turn.' },
  { reaction: 'Counterspell (3rd)', trigger: 'You see a creature within 60ft casting a spell.', note: 'Auto-counter if slot ≥ spell level, else DC 10 + spell level.' },
  { reaction: 'Absorb Elements (1st)', trigger: 'You take acid, cold, fire, lightning, or thunder damage.', note: 'Halve the damage. Next melee attack deals extra 1d6 of that type.' },
  { reaction: 'Hellish Rebuke (1st)', trigger: 'You are damaged by a creature within 60ft.', note: '2d10 fire damage (DEX save half).' },
  { reaction: 'Uncanny Dodge (Rogue 5)', trigger: 'An attacker you can see hits you.', note: 'Halve the attack\'s damage.' },
  { reaction: 'Cutting Words (Bard 3)', trigger: 'A creature within 60ft makes an attack, check, or damage roll.', note: 'Subtract your Inspiration die from their roll.' },
];

export function getQuickAction(action) {
  return COMBAT_QUICK_ACTIONS.find(a => a.action.toLowerCase().includes((action || '').toLowerCase())) || null;
}

export function getReactionRef(reaction) {
  return REACTION_QUICK_REF.find(r => r.reaction.toLowerCase().includes((reaction || '').toLowerCase())) || null;
}
