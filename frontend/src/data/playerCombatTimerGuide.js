/**
 * playerCombatTimerGuide.js
 * Player Mode: Turn timer guidelines, speed optimization, and combat pacing
 * Pure JS — no React dependencies.
 */

export const TURN_TIMER_TIERS = [
  { tier: 'Speed Demon', seconds: '0-15', description: 'Martial with one attack. "I hit the goblin. 18 to hit, 11 damage. Done."', suitable: ['Champion Fighter', 'Barbarian', 'Simple builds'] },
  { tier: 'Standard', seconds: '15-30', description: 'Attack + bonus action or simple spell. Well-prepared players.', suitable: ['Most martials', 'Cantrip casters', 'Rogues'] },
  { tier: 'Complex', seconds: '30-45', description: 'Spellcaster choosing and resolving a leveled spell. Acceptable.', suitable: ['Full casters', 'Multi-attackers', 'Paladins'] },
  { tier: 'Slow', seconds: '45-60', description: 'Multiple summons, complex spell interactions. Tolerable but push for improvement.', suitable: ['Summoners', 'Complex builds'] },
  { tier: 'Too Long', seconds: '60+', description: 'Scrolling through spell lists, asking rules questions, not paying attention.', suitable: ['No one — this needs improvement'] },
];

export const SPEED_TRICKS = [
  { trick: 'Pre-roll damage', detail: 'Roll attack and damage dice at the same time. "17 to hit, 9 damage" as one statement.', saves: '5-10 seconds' },
  { trick: 'Plan during others\' turns', detail: 'Have your action ready before your turn starts. Adjust if battlefield changes.', saves: '15-30 seconds' },
  { trick: 'Know your spells', detail: 'Read spell descriptions BEFORE your turn. Have the text ready or memorized.', saves: '10-20 seconds' },
  { trick: 'Use a spell card or cheat sheet', detail: 'Physical cards or digital quick-reference for your most-used spells and abilities.', saves: '10-15 seconds' },
  { trick: 'Announce your full turn at once', detail: '"I move here, attack the orc — 19 to hit, 12 damage — bonus action Healing Word on the Rogue, 8 HP. Done."', saves: '10-15 seconds' },
  { trick: 'Pre-calculate modifiers', detail: 'Write down your attack bonus, damage, save DC, and common rolls on a sticky note.', saves: '5-10 seconds' },
  { trick: 'Ask rules questions between turns', detail: 'Text the DM or look it up while waiting. Don\'t eat your turn with rules debates.', saves: '20-60 seconds' },
  { trick: 'Default to attack', detail: 'If you can\'t decide in 10 seconds, just attack. Attack is never a bad option.', saves: '30+ seconds' },
];

export const TIMER_IMPLEMENTATION = {
  softTimer: {
    description: 'DM says "you\'re up" and starts counting. After 30-60 seconds, gently prompts.',
    pros: 'Relaxed, low pressure, good for new players',
    cons: 'Easy to ignore, some players still take too long',
  },
  hardTimer: {
    description: 'Visible timer (phone, hourglass). When it runs out, you Dodge and turn ends.',
    pros: 'Strict pacing, combat stays fast and exciting',
    cons: 'Can stress players, punishes complex characters',
  },
  escalatingTimer: {
    description: '60 seconds for your first round, 45 for second, 30 for third onwards.',
    pros: 'Allows planning time in round 1, speeds up as combat flows',
    cons: 'Slightly complex to track',
  },
  hourglass: {
    description: 'Physical 30-second hourglass passed to the active player.',
    pros: 'Tactile, visible, creates urgency without feeling digital',
    cons: 'Hard to enforce strictly',
  },
};

export const COMBAT_PACING = [
  { issue: 'Analysis paralysis', fix: 'Establish a "default action" for each player. If stuck, do the default.', severity: 'High' },
  { issue: 'Phone distraction', fix: 'Phones away during combat. Character sheet apps only if used.', severity: 'High' },
  { issue: 'Rules arguments', fix: '"DM rules now, look it up later" policy. Never argue during combat.', severity: 'High' },
  { issue: 'Storytelling every attack', fix: 'Narrate hits and kills. Skip narration on routine attacks. Save drama for big moments.', severity: 'Low' },
  { issue: 'Rolling too slowly', fix: 'Pre-sort dice. Roll attack + damage together. Have dice ready.', severity: 'Medium' },
  { issue: 'Asking "what can I do?"', fix: 'Cheat sheet with all actions. Review between sessions. Know your character.', severity: 'High' },
];

export const QUICK_REFERENCE_TEMPLATE = {
  sections: [
    { label: 'Attack', fields: ['To hit: +__', 'Damage: __d__ + __', 'Range: __ft'] },
    { label: 'Spell Save DC', fields: ['DC: __', 'Spell Attack: +__'] },
    { label: 'Bonus Action', fields: ['Options: ____________'] },
    { label: 'Reaction', fields: ['Options: ____________'] },
    { label: 'Key Spells', fields: ['Spell 1: ____ (Slot __)', 'Spell 2: ____ (Slot __)', 'Spell 3: ____ (Slot __)'] },
    { label: 'HP / AC', fields: ['AC: __', 'HP: __ / __', 'Speed: __ft'] },
  ],
  note: 'Fill this out before the session. Tape it to your DM screen or keep it next to your character sheet.',
};

export function getTurnTimeTier(seconds) {
  return TURN_TIMER_TIERS.find(t => {
    const [min, max] = t.seconds.replace('+', '-999').split('-').map(Number);
    return seconds >= min && seconds <= max;
  }) || TURN_TIMER_TIERS[4];
}

export function getSpeedTricks(currentAvgSeconds) {
  if (currentAvgSeconds <= 15) return [];
  if (currentAvgSeconds <= 30) return SPEED_TRICKS.slice(0, 3);
  if (currentAvgSeconds <= 45) return SPEED_TRICKS.slice(0, 5);
  return SPEED_TRICKS;
}
