/**
 * playerBonusActionEconomy.js
 * Player Mode: Bonus action optimization and conflict resolution
 * Pure JS — no React dependencies.
 */

export const BONUS_ACTION_SOURCES = {
  universal: [
    { action: 'Two-Weapon Fighting', requirement: 'Wielding two light weapons', effect: 'Off-hand attack (no ability mod to damage unless Fighting Style)', note: 'Only if you took Attack action. Competes with ALL other bonus actions.' },
    { action: 'Potion (variant rule)', requirement: 'DM allows', effect: 'Drink a potion as bonus action (some DMs: action = max healing, bonus = roll)', note: 'Popular house rule. Ask at session zero.' },
  ],
  classSpecific: [
    { class: 'Rogue', action: 'Cunning Action', effect: 'Dash, Disengage, or Hide as bonus action', level: 2, note: 'Incredible mobility. Defines Rogue combat.' },
    { class: 'Monk', action: 'Martial Arts/Flurry', effect: 'Unarmed strike (free) or Flurry of Blows (1 Ki: 2 unarmed strikes)', level: 1, note: 'Monks always have a bonus action use. Never wasted.' },
    { class: 'Barbarian', action: 'Rage', effect: 'Enter rage as bonus action', level: 1, note: 'Turn 1 priority. Then bonus action is free for other things.' },
    { class: 'Cleric', action: 'Spiritual Weapon', effect: '1d8+mod force damage as bonus action each turn', level: 3, note: 'NOT concentration. The best cleric bonus action. Cast once, use every turn.' },
    { class: 'Warlock', action: 'Hex', effect: 'Curse target for +1d6 necrotic per hit', level: 1, note: 'Move Hex as bonus action when target dies. Competes with other BA spells.' },
    { class: 'Ranger', action: 'Hunter\'s Mark', effect: '+1d6 per hit on marked target', level: 2, note: 'Same pattern as Hex. Move when target dies. Concentration.' },
    { class: 'Paladin', action: 'Smite spells', effect: 'Various bonus action smite spells', level: 2, note: 'Wrathful Smite (fear), Thunderous Smite (push). All concentration.' },
    { class: 'Fighter (Battle Master)', action: 'Commander\'s Strike', effect: 'Ally makes attack as reaction + superiority die', level: 3, note: 'Give attack to Rogue for extra Sneak Attack.' },
    { class: 'Sorcerer', action: 'Quickened Spell', effect: 'Cast a spell as bonus action (2 sorcery points)', level: 3, note: 'Quickened Eldritch Blast/damage cantrip + leveled spell as action.' },
  ],
};

export const BONUS_ACTION_CONFLICTS = [
  { conflict: 'Spiritual Weapon vs Healing Word', resolution: 'Both are bonus action spells. Can\'t do both in one turn. Spiritual Weapon is recurring, Healing Word is emergency.', winner: 'Spiritual Weapon for damage, Healing Word for saving lives.' },
  { conflict: 'Hex vs Misty Step', resolution: 'Both bonus action spells. Moving Hex uses your bonus. Misty Step also uses it.', winner: 'Misty Step if you need to escape. Hex if you need damage.' },
  { conflict: 'Two-Weapon Fighting vs Cunning Action', resolution: 'Rogue: almost always Cunning Action. Bonus action attack without Sneak Attack is weak.', winner: 'Cunning Action. Hide for advantage on next attack is better.' },
  { conflict: 'Rage vs anything else', resolution: 'Turn 1: always Rage. After that, bonus action is free.', winner: 'Rage on turn 1, then flexible.' },
  { conflict: 'Flurry of Blows vs Patient Defense', resolution: 'Offense vs defense. Flurry for damage/stun. Patient Defense if you\'re tanking.', winner: 'Flurry usually. Patient Defense if low HP and waiting for heals.' },
];

export const BONUS_ACTION_TIPS = [
  'You only get ONE bonus action per turn. Plan which one you\'ll use before your turn.',
  'A turn without using your bonus action is a wasted opportunity.',
  'Bonus action spells + cantrip as action is a common combo pattern.',
  'You CAN\'T cast two leveled spells if one is a bonus action spell (even with Action Surge).',
  'If you have multiple bonus action options, prioritize: sustained damage > one-time damage > mobility.',
  'Spiritual Weapon is the best repeating bonus action in the game. No concentration. Every turn damage.',
];

export function getBonusActionsForClass(className) {
  return BONUS_ACTION_SOURCES.classSpecific.filter(a =>
    a.class.toLowerCase().includes((className || '').toLowerCase())
  );
}

export function getConflict(action1, action2) {
  return BONUS_ACTION_CONFLICTS.find(c =>
    c.conflict.toLowerCase().includes((action1 || '').toLowerCase()) &&
    c.conflict.toLowerCase().includes((action2 || '').toLowerCase())
  ) || null;
}
