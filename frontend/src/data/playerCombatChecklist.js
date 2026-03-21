/**
 * playerCombatChecklist.js
 * Player Mode: Round-by-round combat checklist — never miss a step
 * Pure JS — no React dependencies.
 */

export const START_OF_TURN_CHECKLIST = [
  { check: 'Start-of-turn effects', detail: 'Spirit Guardians damage, Aura of Conquest psychic damage, zone effects, ongoing damage.', reminder: 'DM handles these but remind them if they forget.' },
  { check: 'Concentration check', detail: 'If you took damage since last turn while concentrating: DC 10 or half damage (higher) CON save.', reminder: 'Some DMs forget. Track your own concentration.' },
  { check: 'Condition effects', detail: 'Frightened? Can\'t move toward source. Restrained? Speed 0. Blinded? Disadvantage on attacks.', reminder: 'Know your conditions. They change what you can do.' },
  { check: 'Repeat saves', detail: 'Some conditions allow a save at start/end of turn. Hold Person, Frightened, Stunned.', reminder: 'Make saves that are due before choosing actions.' },
];

export const ACTION_PHASE_CHECKLIST = [
  { check: 'Assess the battlefield', detail: 'Who\'s low HP? Where are enemies? Any threats? What changed since your last turn?', reminder: 'Look at the whole picture, not just your target.' },
  { check: 'Choose action', detail: 'Attack, Cast, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use Object.', reminder: 'Don\'t always attack. Sometimes Dodge or Help is better.' },
  { check: 'Move strategically', detail: 'Move before, during, or after action. Use cover. Avoid opportunity attacks.', reminder: 'Unused movement is wasted. Reposition every turn.' },
  { check: 'Bonus action', detail: 'Only if you HAVE one available. TWF, Cunning Action, Spiritual Weapon, etc.', reminder: 'You DON\'T get a bonus action by default. Only specific features/spells.' },
  { check: 'Free object interaction', detail: 'Draw/sheathe weapon, pick up item, open door, pull lever. ONE per turn.', reminder: 'Plan your object interaction. Sheathing + drawing = 2 interactions (costs action).' },
];

export const ATTACK_CHECKLIST = [
  { check: 'Roll to hit', detail: 'd20 + ability mod + proficiency bonus. Compare to target AC.', modifiers: 'Advantage? Disadvantage? Cover? Flanking?' },
  { check: 'Check for advantage/disadvantage', detail: 'Advantage: roll 2d20, take higher. Disadvantage: take lower. They cancel out.', sources: 'Prone (melee adv), invisible (adv), blind (disadv), restrained (disadv to you, adv to enemy).' },
  { check: 'Roll damage', detail: 'Weapon die + ability modifier. Extra dice from Sneak Attack, Smite, Hex, etc.', reminder: 'Ability mod is added to damage. Don\'t forget it.' },
  { check: 'Apply bonus damage', detail: 'Hunter\'s Mark, Hex, Sneak Attack, Divine Smite, Rage bonus.', reminder: 'Bonus damage usually applies once per hit or once per turn. Read the feature.' },
  { check: 'Critical hit?', detail: 'Nat 20: double ALL damage dice (not modifiers). Include Sneak Attack, Smite, etc.', reminder: 'Crits double dice. A 5d6 Sneak Attack crit = 10d6.' },
];

export const SPELLCASTING_CHECKLIST = [
  { check: 'Concentration', detail: 'Are you already concentrating? Casting a new concentration spell ends the old one.', reminder: 'Mark your concentration spell clearly.' },
  { check: 'Components', detail: 'V (verbal), S (somatic), M (material). Do you have hands free? Do you have components?', reminder: 'Shield + weapon in hands = need War Caster for somatic.' },
  { check: 'Bonus action spell rule', detail: 'If you cast a bonus action spell, you can only cast a cantrip with your action.', reminder: 'Healing Word (BA) + Fireball (action) = ILLEGAL. Healing Word + Fire Bolt = legal.' },
  { check: 'Range and line of sight', detail: 'Can you see the target? Are they in range? Any cover?', reminder: 'Most spells require you to see the target. Check.' },
  { check: 'Saving throw DC', detail: '8 + proficiency + casting ability modifier.', reminder: 'Your save DC doesn\'t change based on spell level.' },
];

export const END_OF_TURN_CHECKLIST = [
  { check: 'End-of-turn saves', detail: 'Some effects allow saves at end of your turn (Hold Person, Slow, etc.).', reminder: 'Make these saves. You might end the condition.' },
  { check: 'Reactions available?', detail: 'Do you have reaction features ready? Shield, Counterspell, Opportunity Attack, Absorb Elements?', reminder: 'Your reaction resets at start of YOUR turn. Plan what you\'ll use it for.' },
  { check: 'Update tracker', detail: 'Mark HP changes, spell slots used, features used (Rage, Channel Divinity, etc.).', reminder: 'Track everything. It\'s your responsibility, not the DM\'s.' },
];

export function combatRoundTime() {
  return 6; // Each round = 6 seconds in-game
}

export function totalCombatTime(rounds) {
  return rounds * 6; // seconds
}
