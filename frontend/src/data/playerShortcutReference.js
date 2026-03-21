/**
 * playerShortcutReference.js
 * Player Mode: Quick reference card for the most important combat info
 * Pure JS — no React dependencies.
 */

export const COMBAT_QUICK_CARD = {
  yourTurn: [
    'MOVE: Up to your speed (can split before/after action)',
    'ACTION: Attack, Cast, Dash, Dodge, Disengage, Help, Hide, Ready, Search, Use Object',
    'BONUS ACTION: If you have one (class feature, TWF, some spells)',
    'FREE: One object interaction (draw/sheathe weapon, open door)',
    'TALK: Brief communication (few words/sentences)',
  ],
  otherTurns: [
    'REACTION: One per round (OA, Shield, Counterspell, Absorb Elements)',
    'Refreshes at the START of your next turn',
  ],
  importantNumbers: [
    'Nat 20: Auto-hit + double damage dice',
    'Nat 1: Auto-miss',
    'Concentration DC: max(10, damage/2)',
    'Death Save DC: 10 (nat 1 = 2 failures, nat 20 = regain 1 HP)',
    'Falling: 1d6 per 10ft (max 20d6)',
    'Suffocating: CON mod +1 minutes, then CON mod rounds at 0 HP',
  ],
};

export const CLASS_QUICK_CARDS = {
  Barbarian: { key: 'Rage (bonus action)', reminder: 'Advantage on STR checks/saves, resistance to B/P/S, +2-4 damage. Can\'t cast spells. Must attack or take damage each turn.' },
  Bard: { key: 'Bardic Inspiration', reminder: 'd6-d12 to ally\'s attack/check/save. Bonus action, 60ft. Uses = CHA mod/rest.' },
  Cleric: { key: 'Channel Divinity', reminder: 'Turn Undead + domain feature. 1-3 uses per short rest.' },
  Druid: { key: 'Wild Shape', reminder: '2 uses per short rest. Moon Druid = combat forms. Bonus action to transform.' },
  Fighter: { key: 'Action Surge', reminder: 'One extra FULL action. 1/short rest (2 at 17th). Second Wind: bonus action 1d10+level HP.' },
  Monk: { key: 'Ki Points', reminder: 'Flurry (2 bonus attacks), Patient Defense (Dodge), Step of Wind (Dash/Disengage). 1 ki each. Stunning Strike: 1 ki on hit.' },
  Paladin: { key: 'Divine Smite', reminder: '2d8 + 1d8/slot above 1st. Decide AFTER hitting. +1d8 vs undead/fiend. Max 5d8.' },
  Ranger: { key: 'Hunter\'s Mark', reminder: 'Bonus action, +1d6 per hit, advantage on tracking. Transfer as bonus action when target dies.' },
  Rogue: { key: 'Sneak Attack', reminder: '1/turn, Xd6 extra damage. Need advantage OR ally within 5ft of target. Cunning Action: bonus Dash/Disengage/Hide.' },
  Sorcerer: { key: 'Metamagic', reminder: 'Twin (double target), Quicken (bonus action), Subtle (no V/S), Careful (allies auto-save). Sorcery points = level.' },
  Warlock: { key: 'Eldritch Blast + Invocations', reminder: 'EB: 1d10 per beam (scales at 5/11/17). Agonizing: +CHA to each. Repelling: push 10ft per beam. Slots recover on SHORT rest.' },
  Wizard: { key: 'Arcane Recovery', reminder: '1/day after short rest: recover spell slots totaling half wizard level (max 5th). Ritual casting from spellbook.' },
};

export function getClassCard(className) {
  return CLASS_QUICK_CARDS[className] || null;
}

export function getCombatCard() {
  return COMBAT_QUICK_CARD;
}
