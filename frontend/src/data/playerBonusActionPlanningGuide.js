/**
 * playerBonusActionPlanningGuide.js
 * Player Mode: Bonus action economy — maximize your turn efficiency
 * Pure JS — no React dependencies.
 */

export const BONUS_ACTION_RULES = {
  limit: 'One bonus action per turn. Cannot be used as an action.',
  timing: 'You choose when during your turn to use it.',
  twoWeapon: 'TWF off-hand attack is a bonus action.',
  spellRule: 'If you cast a bonus action spell, you can only cast a CANTRIP with your action (not another leveled spell).',
  note: 'Not everyone has a bonus action available every turn. Some classes have more BA options than others.',
};

export const BEST_BONUS_ACTIONS_BY_CLASS = [
  { class: 'Rogue', action: 'Cunning Action', what: 'Dash, Disengage, or Hide as BA.', rating: 'S+' },
  { class: 'Monk', action: 'Flurry of Blows', what: '2 unarmed strikes for 1 ki.', rating: 'S+' },
  { class: 'Monk', action: 'Patient Defense', what: 'Dodge as BA for 1 ki.', rating: 'S' },
  { class: 'Monk', action: 'Step of the Wind', what: 'Dash or Disengage as BA for 1 ki.', rating: 'A+' },
  { class: 'Ranger', action: 'Hunter\'s Mark', what: '+1d6 damage per hit to marked target.', rating: 'S' },
  { class: 'Warlock', action: 'Hex', what: '+1d6 necrotic per hit to cursed target.', rating: 'S' },
  { class: 'Paladin', action: 'Smite Spells', what: 'Wrathful Smite, Thunderous Smite, etc.', rating: 'A+' },
  { class: 'Cleric', action: 'Spiritual Weapon', what: '1d8+mod force as BA. No concentration.', rating: 'S+' },
  { class: 'Bard', action: 'Bardic Inspiration', what: 'Give ally a BI die.', rating: 'S' },
  { class: 'Fighter', action: 'Second Wind', what: '1d10+level HP. 1/short rest.', rating: 'A' },
  { class: 'Sorcerer', action: 'Quickened Spell', what: 'Cast action spell as BA (3 sorcery points).', rating: 'S+' },
  { class: 'Barbarian', action: 'Rage', what: 'Enter rage. Resistance + bonus damage.', rating: 'S' },
  { class: 'Druid', action: 'Wild Shape', what: 'Transform as BA (Moon Druid combat form).', rating: 'A+' },
];

export const BONUS_ACTION_SPELLS_RANKED = [
  { spell: 'Spiritual Weapon', level: 2, rating: 'S+', why: 'BA damage every turn. No concentration. Best BA spell.' },
  { spell: 'Healing Word', level: 1, rating: 'S+', why: 'Ranged BA heal. Pick up downed allies from 60ft.' },
  { spell: 'Misty Step', level: 2, rating: 'S', why: 'BA teleport 30ft. Escape grapples, pits, restraints.' },
  { spell: 'Hex', level: 1, rating: 'S', why: '+1d6 per hit. Moves to new target on kill.' },
  { spell: 'Hunter\'s Mark', level: 1, rating: 'S', why: '+1d6 per hit. Tracks target. Moves on kill.' },
  { spell: 'Shield of Faith', level: 1, rating: 'A+', why: '+2 AC for 10 minutes. Concentration.' },
  { spell: 'Sanctuary', level: 1, rating: 'A', why: 'Protect ally. WIS save to target them.' },
  { spell: 'Shadow Blade', level: 2, rating: 'A+', why: '2d8 psychic finesse weapon. Advantage in dim light.' },
];

export const BA_CONFLICTS = [
  { conflict: 'TWF + Hunter\'s Mark', issue: 'Both need BA. Round 1: cast HM. Round 2+: off-hand attack.', fix: 'Accept losing round 1 off-hand or drop TWF.' },
  { conflict: 'Hex + Eldritch Blast', issue: 'Hex setup costs BA. Fine after round 1.', fix: 'Cast Hex first turn, then EB every turn. Only re-Hex on kill.' },
  { conflict: 'Spiritual Weapon + Healing Word', issue: 'Both BA spells. Can\'t use same turn.', fix: 'Prioritize: SW for damage, HW for downed allies.' },
  { conflict: 'Rage + TWF', issue: 'Rage uses BA on round 1. No off-hand attack.', fix: 'Rage turn 1, off-hand from turn 2 onward.' },
  { conflict: 'Quickened Spell + BA spell', issue: 'Can\'t quicken a leveled spell and cast a BA leveled spell.', fix: 'Quicken + cantrip action, or normal cast + BA spell.' },
];

export const BONUS_ACTION_TIPS = [
  'One BA per turn. Plan which BA you need most.',
  'Healing Word: best BA spell. Pick up downed allies at range.',
  'Spiritual Weapon: free damage every turn. No concentration.',
  'BA spell rule: only cantrips with your action if you cast BA spell.',
  'Misty Step: escape anything. BA teleport 30ft.',
  'Rogue Cunning Action: BA Dash/Disengage/Hide every turn.',
  'Don\'t waste BA. If no good BA option, that\'s fine.',
  'Monk: Flurry > Patient Defense in most cases.',
  'Setup spells (Hex, HM): cost 1 BA, then free value every turn.',
  'Quickened Spell: most powerful BA option. Cast Fireball + EB same turn.',
];
