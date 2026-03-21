/**
 * playerMinotaurRaceGuide.js
 * Player Mode: Minotaur — the charging bruiser
 * Pure JS — no React dependencies.
 */

export const MINOTAUR_BASICS = {
  race: 'Minotaur',
  source: 'Guildmasters\' Guide to Ravnica / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 STR, +1 CON (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  note: 'Horns natural weapon (1d6+STR). Goring Rush for bonus action dash+attack. Hammering Horns for BA push. Built for melee aggression.',
};

export const MINOTAUR_TRAITS = [
  { trait: 'Horns', effect: '1d6+STR piercing unarmed strike.', note: 'Natural weapon. Better than normal unarmed. Works as Monk weapon with DM permission.' },
  { trait: 'Goring Rush', effect: 'When you Dash: BA horn attack against a creature.', note: 'Dash + free attack. Charge into combat with a hit. Combines movement and damage.' },
  { trait: 'Hammering Horns', effect: 'After hitting with melee attack on your turn: BA to push target 10ft (STR save).', note: 'Free 10ft push on BA. Push into hazards, off cliffs, away from allies. Great forced movement.' },
  { trait: 'Labyrinthine Recall', effect: 'Always know which direction is north. Perfect recall of any path you\'ve traveled.', note: 'Never get lost in dungeons/mazes. Perfect for dungeon crawling campaigns.' },
];

export const MINOTAUR_CLASS_SYNERGY = [
  { class: 'Barbarian', priority: 'S', reason: 'STR+CON. Goring Rush while raging. Hammering Horns push for forced movement. Aggressive melee.' },
  { class: 'Fighter', priority: 'A', reason: 'STR+CON. Hammering Horns as BA when you don\'t have other BA uses. Goring Rush for charging in.' },
  { class: 'Paladin', priority: 'A', reason: 'STR. Hammering Horns push into Spirit Guardians or other hazards. Goring Rush on turn 1.' },
  { class: 'Monk', priority: 'B', reason: 'Horns as monk weapon (DM dependent). Goring Rush conflicts with Flurry of Blows BA.' },
];

export const MINOTAUR_TACTICS = [
  { tactic: 'Hammering Horns + hazards', detail: 'Hit with melee → BA push 10ft into Spike Growth, Spirit Guardians, Wall of Fire, or off a cliff.', rating: 'S' },
  { tactic: 'Goring Rush opener', detail: 'Turn 1: Dash action (60ft) + BA horn attack. Close distance fast and deal damage immediately.', rating: 'A' },
  { tactic: 'Push for ally advantage', detail: 'Push enemy into flanking position or away from squishy allies. Control without spells.', rating: 'A' },
  { tactic: 'No-magic forced movement', detail: 'Hammering Horns every turn = 10ft push. Combined with Sentinel ally: push into Sentinel\'s reach.', rating: 'A' },
];

export function hammeringHornsDC(strMod, profBonus) {
  return 8 + strMod + profBonus;
}
