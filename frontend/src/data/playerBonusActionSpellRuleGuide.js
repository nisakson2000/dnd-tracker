/**
 * playerBonusActionSpellRuleGuide.js
 * Player Mode: BA spell + action spell rules (the most misunderstood rule)
 * Pure JS — no React dependencies.
 */

export const BA_SPELL_RULE = {
  rule: 'If you cast a spell as a bonus action, the only spell you can cast with your action is a cantrip with a cast time of 1 action.',
  common_misunderstanding: 'Many players think you can cast two leveled spells in one turn. You cannot (with normal actions).',
  exception: 'Action Surge (Fighter): the extra action from Action Surge is NOT your normal action. You CAN cast a leveled spell with Action Surge even if you cast a BA spell.',
  note: 'This rule applies whenever you cast ANY spell as a bonus action, including Healing Word, Misty Step, Spiritual Weapon, etc.',
};

export const LEGAL_COMBOS = [
  { ba: 'Healing Word (BA)', action: 'Sacred Flame (cantrip)', legal: true, note: 'BA spell + action cantrip. Legal.' },
  { ba: 'Misty Step (BA)', action: 'Firebolt (cantrip)', legal: true, note: 'Teleport + cantrip. Legal.' },
  { ba: 'Spiritual Weapon (BA)', action: 'Toll the Dead (cantrip)', legal: true, note: 'Summon weapon + cantrip. Legal.' },
  { ba: 'Quicken Spell Fireball (BA)', action: 'Fire Bolt (cantrip)', legal: true, note: 'Sorcerer: quickened leveled spell + cantrip. Legal.' },
];

export const ILLEGAL_COMBOS = [
  { ba: 'Healing Word (BA)', action: 'Cure Wounds (L1)', legal: false, note: 'Two leveled spells. ILLEGAL.' },
  { ba: 'Misty Step (BA)', action: 'Fireball (L3)', legal: false, note: 'BA spell + leveled action spell. ILLEGAL.' },
  { ba: 'Spiritual Weapon (BA)', action: 'Spirit Guardians (L3)', legal: false, note: 'Can\'t cast both in same turn. Cast on separate turns.' },
  { ba: 'Quicken Fireball (BA)', action: 'Fireball (L3)', legal: false, note: 'BA spell locks action to cantrip only.' },
];

export const ACTION_SURGE_EXCEPTION = {
  rule: 'Action Surge grants an additional action. If you cast a BA spell, your normal action is limited to cantrips. But Action Surge\'s extra action has no such restriction.',
  example: 'Turn: BA Misty Step → Action: Fire Bolt (cantrip, forced) → Action Surge: Fireball (leveled, allowed).',
  note: 'This is why Fighter 2/Wizard X is so popular. Action Surge lets you cast two leveled spells.',
};

export const REACTION_SPELLS = {
  rule: 'Reaction spells (Shield, Counterspell, Absorb Elements) are NOT affected by the BA spell rule.',
  example: 'BA: Healing Word → Action: Sacred Flame → Reaction: Shield. All three legal in one turn.',
  note: 'Reactions are independent of the BA spell rule. You can always cast reaction spells.',
};

export const BA_SPELL_PLANNING = [
  { tactic: 'Cast SG turn 1, SW turn 2', detail: 'Spirit Guardians (action, turn 1). Spiritual Weapon (BA, turn 2) + cantrip (action). Stagger setup.', rating: 'S' },
  { tactic: 'Healing Word + cantrip', detail: 'Heal downed ally (BA) + attack with cantrip (action). Full damage + healing in one turn.', rating: 'S' },
  { tactic: 'Don\'t waste BA on spells early', detail: 'If you want to cast a leveled action spell this turn, don\'t use BA spells. Plan ahead.', rating: 'A' },
  { tactic: 'Sorcerer Quicken for flexibility', detail: 'Quicken a leveled spell to BA → cast cantrip as action. Or quicken cantrip → cast leveled as action.', rating: 'A' },
];
