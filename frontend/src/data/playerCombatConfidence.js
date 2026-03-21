/**
 * playerCombatConfidence.js
 * Player Mode: Building combat confidence for newer players
 * Pure JS — no React dependencies.
 */

export const CONFIDENCE_BUILDERS = [
  { tip: 'There are no wrong actions', detail: 'Attacking is never bad. Healing is never bad. Moving to cover is never bad. "Optimal" matters less than participating.', level: 'Beginner' },
  { tip: 'You know more than you think', detail: 'If you\'ve played 3+ sessions, you understand the basics. Trust your instincts.', level: 'Beginner' },
  { tip: 'Ask questions freely', detail: '"Can I do this?" is a valid action every turn. DMs want you to try creative things.', level: 'Beginner' },
  { tip: 'Your character is yours', detail: 'Play how you want. The "optimal" choice and the "fun" choice are both valid.', level: 'Beginner' },
  { tip: 'Mistakes make stories', detail: 'The Fireball that hit the party is a legendary tale. The optimized turn is forgotten.', level: 'Beginner' },
  { tip: 'Focus on fun, not optimization', detail: 'Unless your table is highly tactical, having fun is more important than DPR charts.', level: 'Beginner' },
  { tip: 'Start simple, add complexity', detail: 'Master "I attack the nearest enemy" before worrying about combo chains and positioning.', level: 'Beginner' },
  { tip: 'It\'s a team game', detail: 'Your party covers your weaknesses. You don\'t have to do everything yourself.', level: 'All' },
];

export const DECISION_SIMPLIFIERS = [
  { question: 'What should I do?', simple: 'Attack the nearest enemy. This is never a bad choice.', advanced: 'Focus fire the biggest threat. Use your strongest ability.' },
  { question: 'Should I heal or attack?', simple: 'Attack unless someone is at 0 HP.', advanced: 'Dead enemies prevent all future damage. Heal only at 0 HP or if the healer is the only option.' },
  { question: 'Where should I stand?', simple: 'Near the tank if melee, behind the tank if ranged.', advanced: 'Within healing range of an ally, with cover, at optimal weapon range.' },
  { question: 'Which spell should I use?', simple: 'Your favorite one that fits the situation.', advanced: 'Highest-impact spell for the current enemy count and type.' },
  { question: 'Should I use my special ability?', simple: 'Yes. Using it is always better than saving it and never using it.', advanced: 'Use it in the first or second hard encounter of the day.' },
];

export const ANXIETY_REDUCERS = [
  'Everyone forgets rules sometimes. Even experienced players.',
  'Taking 30 seconds on your turn is totally fine. Most people take longer.',
  'If you mess up, the DM can usually help fix it or retcon minor mistakes.',
  'Other players are too focused on their own turns to judge yours.',
  'Your character doesn\'t need to be perfect. Flaws make better characters.',
  'If combat is stressful, tell your DM. They can adjust pacing and complexity.',
  'You can always default to "I attack" while you learn other options.',
  'Watching other players helps. Pay attention to what they do on their turns.',
];

export const PROGRESSION_MILESTONES = [
  { milestone: 'Completed your first combat', celebration: 'You survived! That\'s the hardest part.' },
  { milestone: 'Took your turn in under 30 seconds', celebration: 'You know your character. That\'s confidence.' },
  { milestone: 'Used a class feature without looking it up', celebration: 'You\'ve internalized your abilities. Level up!' },
  { milestone: 'Made a tactical suggestion to the party', celebration: 'You\'re thinking strategically. Leadership emerging.' },
  { milestone: 'Tried something creative', celebration: 'The best moments come from creative play. Keep experimenting.' },
  { milestone: 'Saved an ally with healing', celebration: 'You were the right person in the right place. Hero moment.' },
  { milestone: 'Survived a fight you thought you\'d lose', celebration: 'D&D is about rising to challenges. You rose.' },
  { milestone: 'Taught a rule to another player', celebration: 'You\'ve gone from learning to teaching. Full circle.' },
];

export const DEFAULT_ACTIONS = {
  description: 'When in doubt, do your default action. It\'s never wrong.',
  byClass: {
    Fighter: 'Attack the nearest enemy. Use Action Surge if the fight is hard.',
    Rogue: 'Attack with Sneak Attack. Cunning Action Hide. Repeat.',
    Wizard: 'Cantrip if easy, leveled spell if hard. Stay in the back.',
    Cleric: 'Healing Word if someone\'s down. Otherwise, Sacred Flame or attack.',
    Barbarian: 'Rage, then Reckless Attack the biggest enemy.',
    Paladin: 'Attack. Smite if you crit or if it will kill.',
    Ranger: 'Shoot with your bow. Hunter\'s Mark the biggest enemy.',
    Monk: 'Attack twice, Flurry of Blows. Stunning Strike if target is important.',
    Warlock: 'Eldritch Blast. Every turn. It\'s what you do.',
    Sorcerer: 'Fire Bolt or best damage cantrip. Leveled spell if multiple enemies.',
    Bard: 'Bardic Inspiration an ally. Vicious Mockery or attack.',
    Druid: 'Wild Shape if Circle of Moon. Otherwise, cantrip or control spell.',
  },
};

export function getDefaultAction(className) {
  return DEFAULT_ACTIONS.byClass[className] || 'Attack the nearest enemy. It\'s never wrong.';
}

export function getSimpleDecision(question) {
  return DECISION_SIMPLIFIERS.find(d =>
    d.question.toLowerCase().includes((question || '').toLowerCase())
  ) || DECISION_SIMPLIFIERS[0];
}
