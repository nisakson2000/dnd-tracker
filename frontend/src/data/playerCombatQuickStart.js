/**
 * playerCombatQuickStart.js
 * Player Mode: Quick start guide for new players entering combat
 * Pure JS — no React dependencies.
 */

export const COMBAT_BASICS = [
  { step: 1, title: 'Roll Initiative', description: 'Roll 1d20 + your DEX modifier. This determines turn order. Highest goes first.', tip: 'Write your initiative result down. The DM will call turns in order.' },
  { step: 2, title: 'Know Your Turn Structure', description: 'On your turn you get: 1 Action, 1 Bonus Action, 1 Reaction (on any turn), Movement, and 1 Free Object Interaction.', tip: 'You don\'t have to use everything. But try to at least use your Action and Movement.' },
  { step: 3, title: 'Move', description: 'You can move up to your speed (usually 30ft). You can split movement before and after your action.', tip: 'Don\'t just stand still! Move to cover, move to flank, move away from danger.' },
  { step: 4, title: 'Take Your Action', description: 'Attack, Cast a Spell, Dash (double move), Disengage (no opportunity attacks), Dodge (attacks have disadvantage), Help (give ally advantage), Hide (Stealth check), Ready (set a trigger), Search, or Use an Object.', tip: 'Attack is most common. If you can\'t reach an enemy, Dash to get closer.' },
  { step: 5, title: 'Roll to Hit', description: 'Roll 1d20 + attack bonus. If the result equals or exceeds the target\'s AC, you hit!', tip: 'Your attack bonus is on your character sheet. It includes proficiency + ability modifier.' },
  { step: 6, title: 'Roll Damage', description: 'If you hit, roll your weapon\'s damage dice + ability modifier. Tell the DM the total and damage type.', tip: 'Example: Longsword = 1d8 + STR modifier. "I deal 11 slashing damage."' },
  { step: 7, title: 'End Your Turn', description: 'Say "I end my turn" so the DM knows to move on. Consider what you\'d use your Reaction for.', tip: 'Keep track of your Reaction. Shield (wizard), Opportunity Attack (melee), etc.' },
];

export const NEWBIE_CHEAT_SHEET = {
  toHit: 'Roll d20 + number on your sheet next to the weapon',
  damage: 'Roll the dice listed for your weapon + ability mod',
  spellSave: 'You set a DC. Enemy rolls their save. Below your DC = spell works',
  spellAttack: 'Roll d20 + spell attack modifier (on your sheet)',
  advantageDisadvantage: 'Advantage = roll 2d20 take HIGHER. Disadvantage = take LOWER.',
  criticalHit: 'Nat 20 = auto-hit + double damage dice',
  criticalMiss: 'Nat 1 = auto-miss. That\'s it.',
  deathSaves: 'At 0 HP: roll d20. 10+ = success. Below 10 = fail. 3 successes = stable. 3 fails = dead.',
};

export const FIRST_COMBAT_TIPS = [
  'Don\'t overthink it. "I hit it with my sword" is a perfectly valid turn.',
  'Ask the DM if you\'re unsure. They WANT to help you.',
  'It\'s okay to take a few seconds to think. But try to plan during others\' turns.',
  'You don\'t have to be optimal. Just do something fun.',
  'If you don\'t know what to do: Attack the nearest enemy.',
  'Remember to add your modifier to BOTH your attack roll AND damage roll.',
  'Tell the DM what you want to do in plain language. They\'ll tell you what to roll.',
  'If something seems cool, try it! The DM will figure out the rules.',
];

export const COMMON_NEW_PLAYER_MISTAKES = [
  { mistake: 'Forgetting to add modifiers', fix: 'Your attack roll is d20 + attack bonus. Your damage is dice + ability modifier. Always add the bonus.' },
  { mistake: 'Not moving', fix: 'You have 30ft of movement. Use it! Get behind cover, move into range, or retreat from danger.' },
  { mistake: 'Waiting for the perfect turn', fix: 'Any action is better than no action. Attack, even if you\'re not sure it\'s optimal.' },
  { mistake: 'Trying to use all abilities at once', fix: 'Learn one feature at a time. Master your basic attack first, then add class features.' },
  { mistake: 'Not asking for help', fix: 'The table wants you to succeed. Ask "what can I do?" and someone will help.' },
  { mistake: 'Forgetting reactions', fix: 'Opportunity Attacks are free. If an enemy walks away from you, you get a free swing.' },
];

export function getStep(stepNumber) {
  return COMBAT_BASICS.find(s => s.step === stepNumber) || null;
}

export function getQuickRef(topic) {
  return NEWBIE_CHEAT_SHEET[topic] || null;
}
