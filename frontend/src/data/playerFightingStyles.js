/**
 * playerFightingStyles.js
 * Player Mode: Fighting Styles reference for martial classes
 * Pure JS — no React dependencies.
 */

export const FIGHTING_STYLES = [
  { name: 'Archery', classes: ['Fighter', 'Ranger'], effect: '+2 to attack rolls with ranged weapons.', combatReminder: 'Ranged attacks: +2 already added to your to-hit.' },
  { name: 'Defense', classes: ['Fighter', 'Paladin', 'Ranger'], effect: '+1 AC while wearing armor.', combatReminder: '+1 AC included in your armor calculation.' },
  { name: 'Dueling', classes: ['Fighter', 'Paladin', 'Ranger'], effect: '+2 damage when wielding a melee weapon in one hand and no other weapons.', combatReminder: 'One-handed melee: +2 damage per hit.' },
  { name: 'Great Weapon Fighting', classes: ['Fighter', 'Paladin'], effect: 'Reroll 1s and 2s on damage dice (must use new roll). Only weapon damage dice.', combatReminder: 'Two-handed weapon: reroll 1s and 2s on weapon damage dice.' },
  { name: 'Protection', classes: ['Fighter', 'Paladin'], effect: 'Reaction: impose disadvantage on attack against adjacent ally. Requires shield.', combatReminder: 'Shield + ally within 5ft attacked → Reaction: disadvantage on that attack.' },
  { name: 'Two-Weapon Fighting', classes: ['Fighter', 'Ranger'], effect: 'Add ability modifier to off-hand attack damage.', combatReminder: 'Off-hand attack: add ability modifier to damage (normally you don\'t).' },
  { name: 'Blind Fighting', classes: ['Fighter', 'Paladin', 'Ranger'], effect: 'Blindsight 10ft. Can see invisible creatures within 10ft.', combatReminder: 'Invisible enemies within 10ft: you can see them.' },
  { name: 'Interception', classes: ['Fighter', 'Paladin'], effect: 'Reaction: reduce damage to ally within 5ft by 1d10 + proficiency bonus. Requires shield or weapon.', combatReminder: 'Ally hit within 5ft → Reaction: reduce damage by 1d10 + prof.' },
  { name: 'Thrown Weapon Fighting', classes: ['Fighter', 'Ranger'], effect: '+2 damage with thrown weapons. Draw thrown weapon as part of attack.', combatReminder: 'Thrown weapons: +2 damage, free draw.' },
  { name: 'Unarmed Fighting', classes: ['Fighter'], effect: 'Unarmed strikes deal 1d6+STR (or 1d8 if both hands free). Grappled creatures take 1d4 bludgeoning at start of your turn.', combatReminder: 'Unarmed: 1d6+STR (1d8 if empty hands). Grappled target: auto 1d4.' },
  { name: 'Superior Technique', classes: ['Fighter'], effect: 'Learn one Battle Master maneuver. Gain one d6 superiority die.', combatReminder: '1 superiority die (d6) + 1 maneuver.' },
  { name: 'Druidic Warrior', classes: ['Ranger'], effect: 'Learn two Druid cantrips. WIS is spellcasting ability.', combatReminder: 'Two Druid cantrips available.' },
  { name: 'Blessed Warrior', classes: ['Paladin'], effect: 'Learn two Cleric cantrips. CHA is spellcasting ability.', combatReminder: 'Two Cleric cantrips available.' },
];

export function getStylesForClass(className) {
  return FIGHTING_STYLES.filter(s =>
    s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

export function getStyle(name) {
  return FIGHTING_STYLES.find(s => s.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

export function getCombatReminder(styleName) {
  const style = getStyle(styleName);
  return style ? style.combatReminder : null;
}
