/**
 * playerEncounterTypes.js
 * Player Mode: Recognizing encounter types and adjusting strategy accordingly
 * Pure JS — no React dependencies.
 */

export const ENCOUNTER_TYPES = [
  {
    type: 'Trash Mob / Easy Encounter',
    signs: ['Many weak enemies', 'Low HP targets', 'Simple attacks only'],
    strategy: 'Cantrips and basic attacks. Save resources. AoE if grouped. Speed > optimization.',
    resourceSpend: 'Minimal — cantrips, weapon attacks, maybe one low-level spell.',
    mistakes: 'Wasting high-level spell slots on enemies that die to two sword swings.',
  },
  {
    type: 'Standard Encounter',
    signs: ['Mix of enemy types', 'Moderate HP', 'Some special abilities'],
    strategy: 'One concentration spell, focus fire on biggest threat. Use class features as needed.',
    resourceSpend: 'Moderate — 1-2 leveled spells, some class features.',
    mistakes: 'Going nova and having nothing left for harder fights later.',
  },
  {
    type: 'Boss Fight',
    signs: ['One powerful enemy', 'Legendary actions/resistances', 'Lair actions', 'High HP'],
    strategy: 'Burn Legendary Resistances with cheap spells. Nova damage after LR gone. Protect concentration.',
    resourceSpend: 'High — use your best slots, Action Surge, Smites, etc.',
    mistakes: 'Using your best save-or-suck spell while LR is still available.',
  },
  {
    type: 'Boss + Minions',
    signs: ['One strong enemy with several weaker ones', 'Minions support/protect the boss'],
    strategy: 'AoE the minions, then focus boss. Or ignore minions and rush boss if minions are weak.',
    resourceSpend: 'High — AoE for minions, single-target for boss.',
    mistakes: 'Spending all resources on minions and having nothing for the boss.',
  },
  {
    type: 'Ambush (you\'re ambushed)',
    signs: ['Surprise round against you', 'Enemies in advantageous positions', 'Surrounded'],
    strategy: 'Survive round 1. Defensive actions. Regroup. Then counter-attack.',
    resourceSpend: 'Defensive — Shield, Absorb Elements, Dodge, healing.',
    mistakes: 'Panicking and wasting actions. Stay calm, survive, then fight.',
  },
  {
    type: 'Ambush (you ambush them)',
    signs: ['You have surprise', 'You chose the battlefield', 'Enemies unaware'],
    strategy: 'Alpha strike. Use your strongest abilities on round 1. Assassinate if possible.',
    resourceSpend: 'Front-loaded — spend big on round 1 for maximum impact.',
    mistakes: 'Not coordinating the ambush. If one person attacks early, surprise is ruined for everyone.',
  },
  {
    type: 'Wave Encounter',
    signs: ['Enemies come in groups', 'Reinforcements arrive after initial group', 'Multiple phases'],
    strategy: 'Conserve resources early. Don\'t go nova on wave 1 if more are coming.',
    resourceSpend: 'Distributed — budget resources across waves.',
    mistakes: 'Using all spell slots on wave 1, then being helpless for waves 2 and 3.',
  },
  {
    type: 'Puzzle/Skill Encounter',
    signs: ['Combat is optional', 'Environmental challenges', 'Requires specific checks/spells'],
    strategy: 'Think before fighting. The solution might not be combat. Try skills, spells, diplomacy.',
    resourceSpend: 'Minimal combat resources. Utility spells may help.',
    mistakes: 'Defaulting to "I attack" when the encounter is designed to be solved creatively.',
  },
  {
    type: 'Chase / Escape',
    signs: ['Fleeing or pursuing', 'Time pressure', 'Environmental obstacles'],
    strategy: 'Speed and control. Dash, Expeditious Retreat, slowing spells on pursuers.',
    resourceSpend: 'Mobility spells, control spells. Not damage.',
    mistakes: 'Stopping to fight when you should be running, or vice versa.',
  },
  {
    type: 'Social Encounter with Combat Potential',
    signs: ['Talking to hostile NPCs', 'Tension in the room', 'Weapons visible but not drawn'],
    strategy: 'Try diplomacy first. Prepare for combat. If violence starts, you want to go first.',
    resourceSpend: 'Social skills first. Buff subtly if possible (Enhance Ability, Guidance).',
    mistakes: 'Attacking first when diplomacy could have avoided the fight entirely.',
  },
];

export const ENCOUNTER_DIFFICULTY_READING = {
  easy: { signs: ['DM narrates casually', 'Enemies are common types', 'No dramatic music'], recommendation: 'Conserve everything.' },
  medium: { signs: ['DM describes enemies in detail', 'Specific tactical positions', 'Some tension'], recommendation: 'Standard resource use.' },
  hard: { signs: ['DM emphasizes danger', 'Environmental hazards', 'Enemies use tactics'], recommendation: 'Use strong spells and features.' },
  deadly: { signs: ['DM warns explicitly', 'Boss music', 'Enemies have legendary actions'], recommendation: 'Everything you have. This is the fight that matters.' },
};

export function identifyEncounterType(enemyCount, hasLegendary, isSurprised, hasWaves) {
  if (isSurprised) return 'Ambush (you\'re ambushed)';
  if (hasLegendary && enemyCount <= 2) return 'Boss Fight';
  if (hasLegendary && enemyCount > 2) return 'Boss + Minions';
  if (hasWaves) return 'Wave Encounter';
  if (enemyCount >= 6) return 'Trash Mob / Easy Encounter';
  return 'Standard Encounter';
}

export function getEncounterStrategy(encounterType) {
  return ENCOUNTER_TYPES.find(e => e.type === encounterType) || ENCOUNTER_TYPES[1];
}
