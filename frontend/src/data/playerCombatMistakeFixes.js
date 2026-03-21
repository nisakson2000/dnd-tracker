/**
 * playerCombatMistakeFixes.js
 * Player Mode: Common combat mistakes with specific fixes
 * Pure JS — no React dependencies.
 */

export const COMBAT_MISTAKES = [
  {
    mistake: 'Not using your full movement',
    frequency: 'Very Common',
    impact: 'High',
    explanation: 'Many players stand still and attack. But you have 30ft of movement EVERY turn.',
    fix: 'After attacking, move behind cover or out of enemy reach. Split movement: move 15ft, attack, move 15ft away.',
  },
  {
    mistake: 'Forgetting bonus actions',
    frequency: 'Very Common',
    impact: 'High',
    explanation: 'Most classes have something to do with their bonus action. Unused bonus actions are wasted potential.',
    fix: 'Write your bonus action options on your character sheet. Check them EVERY turn.',
  },
  {
    mistake: 'Attacking the nearest enemy',
    frequency: 'Common',
    impact: 'High',
    explanation: 'The nearest enemy is often the toughest (front-line). The real threats are in the back.',
    fix: 'Prioritize: 1) Casters, 2) Ranged, 3) Low-HP enemies near death, 4) Then the tank.',
  },
  {
    mistake: 'Hoarding spell slots',
    frequency: 'Common',
    impact: 'Medium',
    explanation: 'Saving your best spells "for later" means you often finish the day with unused slots.',
    fix: 'Save your top 1-2 slot levels for emergencies. Use everything else. You can\'t take slots to the grave.',
  },
  {
    mistake: 'Spreading damage evenly',
    frequency: 'Common',
    impact: 'Very High',
    explanation: 'An enemy at 1 HP does the same damage as one at full HP. Wounded enemies still attack.',
    fix: 'Focus fire. Kill one enemy completely before moving to the next. Dead enemies deal 0 damage.',
  },
  {
    mistake: 'Clustering together',
    frequency: 'Common',
    impact: 'High',
    explanation: 'Standing next to each other invites Fireball, breath weapons, and AoE devastation.',
    fix: 'Stay 20+ feet apart unless you specifically need aura benefits (Paladin). Fireball = 20ft radius.',
  },
  {
    mistake: 'Not using the Help action',
    frequency: 'Uncommon',
    impact: 'Medium',
    explanation: 'If you can\'t deal meaningful damage, Help gives an ally advantage instead.',
    fix: 'Familiars can Help every turn for free (owl + Flyby). Players can Help if their attacks are ineffective.',
  },
  {
    mistake: 'Forgetting reactions',
    frequency: 'Common',
    impact: 'High',
    explanation: 'Shield, Absorb Elements, opportunity attacks — reactions are a free action on someone else\'s turn.',
    fix: 'Keep your reaction spell/ability visible. Announce what you\'re saving your reaction for.',
  },
  {
    mistake: 'Not communicating',
    frequency: 'Common',
    impact: 'Very High',
    explanation: 'Acting individually instead of as a team. No focus fire, no coordination.',
    fix: 'Call targets ("FOCUS the mage!"). Announce your plans ("I\'m casting Fireball at B3 — clear out!"). Communicate HP.',
  },
  {
    mistake: 'Using inefficient actions',
    frequency: 'Uncommon',
    impact: 'Medium',
    explanation: 'Using your action for something that could be a bonus action, or doing something suboptimal.',
    fix: 'Know what each action type can do: Action (attack, spell, Dash), Bonus (class features), Reaction (defense).',
  },
];

export const QUICK_FIX_CHECKLIST = [
  'Did I use my MOVEMENT? (Can I get to cover or better position?)',
  'Did I use my ACTION? (Attack, spell, or Help if nothing else)',
  'Did I use my BONUS ACTION? (Class feature, off-hand attack, bonus spell)',
  'What am I saving my REACTION for? (Shield, Counterspell, Opportunity Attack)',
  'Is there a FREE OBJECT INTERACTION I should do? (Draw weapon, open door)',
  'Did I COMMUNICATE my plan to the party?',
];

export function getMistake(topic) {
  return COMBAT_MISTAKES.find(m =>
    m.mistake.toLowerCase().includes((topic || '').toLowerCase())
  ) || null;
}

export function getHighImpactMistakes() {
  return COMBAT_MISTAKES.filter(m => m.impact === 'Very High' || m.impact === 'High');
}

export function getMostCommonMistakes() {
  return COMBAT_MISTAKES.filter(m => m.frequency === 'Very Common');
}
