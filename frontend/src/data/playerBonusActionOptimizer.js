/**
 * playerBonusActionOptimizer.js
 * Player Mode: Making the most of your bonus action each turn
 * Pure JS — no React dependencies.
 */

export const BONUS_ACTION_BASICS = {
  limit: 'ONE bonus action per turn. No "saving" it if you don\'t use it.',
  requirement: 'You can only use a bonus action if you have a feature/spell that explicitly uses one.',
  timing: 'You choose WHEN during your turn to use your bonus action.',
  note: 'Not using your bonus action is like wasting 33% of your turn\'s potential.',
};

export const BONUS_ACTIONS_BY_CLASS = {
  Barbarian: [
    { action: 'Rage', when: 'Turn 1 of combat', priority: 'S', note: 'Activate Rage immediately. It lasts the whole fight.' },
    { action: 'Bonus attack (Berserker Frenzy)', when: 'While raging (Berserker)', priority: 'A', note: 'Extra attack but causes exhaustion. Use sparingly.' },
  ],
  Bard: [
    { action: 'Bardic Inspiration', when: 'When an ally needs a boost', priority: 'S', note: 'Give d6-d12 to ally\'s roll. Core class feature.' },
    { action: 'Healing Word', when: 'Ally at 0 HP', priority: 'S', note: 'Pick up downed allies without using your action.' },
  ],
  Cleric: [
    { action: 'Spiritual Weapon attack', when: 'Every turn after casting', priority: 'S', note: 'Free damage every round. No concentration.' },
    { action: 'Healing Word', when: 'Ally at 0 HP', priority: 'S', note: 'Best emergency heal in the game.' },
    { action: 'Shield of Faith', when: 'Before taking hits', priority: 'A', note: '+2 AC. Concentration but very efficient.' },
  ],
  Fighter: [
    { action: 'Second Wind', when: 'HP below 50%', priority: 'A', note: '1d10 + Fighter level. Free healing.' },
    { action: 'PAM bonus attack', when: 'Every turn (if using polearm)', priority: 'S', note: '1d4 + STR extra attack. Consistent DPR boost.' },
    { action: 'TWF offhand attack', when: 'Every turn (if dual wielding)', priority: 'A', note: 'Extra attack with offhand weapon.' },
  ],
  Monk: [
    { action: 'Martial Arts (unarmed strike)', when: 'After attacking with monk weapon', priority: 'A', note: 'Free extra attack every turn.' },
    { action: 'Flurry of Blows', when: 'Need extra damage or Stunning Strike chances', priority: 'S', note: '2 unarmed strikes for 1 ki. Better than Martial Arts.' },
    { action: 'Patient Defense', when: 'Surrounded or protecting concentration', priority: 'A', note: 'Dodge as bonus action. 1 ki.' },
    { action: 'Step of the Wind', when: 'Need to escape or close distance', priority: 'B', note: 'Disengage or Dash as bonus action. 1 ki.' },
  ],
  Paladin: [
    { action: 'Smite spells (Thunderous, Wrathful)', when: 'Before an important attack', priority: 'A', note: 'Bonus action to cast, triggers on next hit.' },
    { action: 'Shield of Faith', when: 'Before taking damage', priority: 'A', note: '+2 AC concentration. Good first-turn play.' },
  ],
  Ranger: [
    { action: 'Hunter\'s Mark', when: 'Turn 1, on biggest threat', priority: 'S', note: '+1d6 per hit. Move to new target when current dies (bonus action).' },
    { action: 'Planar Warrior (Horizon Walker)', when: 'Before attacking', priority: 'A', note: 'Extra 1d8 force damage. Scales.' },
  ],
  Rogue: [
    { action: 'Cunning Action: Hide', when: 'After attacking (ranged Rogue)', priority: 'S', note: 'Hide → advantage → guaranteed Sneak Attack next turn.' },
    { action: 'Cunning Action: Disengage', when: 'After melee Sneak Attack', priority: 'A', note: 'Hit and run without OA.' },
    { action: 'Cunning Action: Dash', when: 'Need to close or flee', priority: 'B', note: 'Double movement.' },
    { action: 'Steady Aim (Tasha\'s)', when: 'Can\'t get advantage otherwise', priority: 'A', note: 'Advantage on next attack but can\'t move this turn.' },
  ],
  Sorcerer: [
    { action: 'Quickened Spell', when: 'Need to cast + cantrip same turn', priority: 'S', note: 'Cast a leveled spell as bonus action, then cantrip as action. 2 sorcery points.' },
    { action: 'Misty Step', when: 'Need to escape or reposition', priority: 'A', note: 'Teleport 30ft. Still have your action.' },
  ],
  Warlock: [
    { action: 'Hex', when: 'Turn 1 on primary target', priority: 'S', note: '+1d6 necrotic per hit. Move when target dies.' },
    { action: 'Misty Step', when: 'Escape melee', priority: 'A', note: 'Teleport 30ft + still Eldritch Blast.' },
  ],
  Wizard: [
    { action: 'Misty Step', when: 'Escape danger', priority: 'A', note: 'Teleport 30ft. Essential escape tool.' },
    { action: 'Expeditious Retreat', when: 'Extended kiting needed', priority: 'B', note: 'Dash as bonus action each turn. Concentration.' },
  ],
  Druid: [
    { action: 'Wild Shape', when: 'Turn 1 (Moon Druid) or utility', priority: 'S (Moon)', note: 'Moon Druid: combat Wild Shape. Others: utility/scout forms.' },
    { action: 'Healing Word', when: 'Ally at 0 HP', priority: 'S', note: 'Pick up downed allies.' },
  ],
};

export const BONUS_ACTION_PRIORITY = {
  description: 'When you have multiple bonus action options, prioritize:',
  order: [
    { priority: 1, category: 'Save a dying ally', examples: ['Healing Word on 0 HP ally'] },
    { priority: 2, category: 'Sustaining damage sources', examples: ['Spiritual Weapon attack', 'Move Hunter\'s Mark'] },
    { priority: 3, category: 'Setup buffs/debuffs', examples: ['Hex', 'Hunter\'s Mark', 'Rage (turn 1)'] },
    { priority: 4, category: 'Extra attacks', examples: ['PAM bonus attack', 'Flurry of Blows', 'TWF offhand'] },
    { priority: 5, category: 'Defensive/movement', examples: ['Misty Step', 'Patient Defense', 'Cunning Action'] },
  ],
};

export function getBonusActions(className) {
  return BONUS_ACTIONS_BY_CLASS[className] || [];
}

export function suggestBonusAction(className, context) {
  const actions = BONUS_ACTIONS_BY_CLASS[className] || [];
  if (context.allyAt0HP) {
    const healWord = actions.find(a => a.action.includes('Healing Word'));
    if (healWord) return healWord;
  }
  return actions.find(a => a.priority === 'S') || actions[0] || { action: 'None available', note: 'No bonus action features for this class at this level.' };
}
