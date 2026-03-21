/**
 * playerBonusActionManagementGuide.js
 * Player Mode: Bonus action competition and optimization by class
 * Pure JS — no React dependencies.
 */

export const BA_RULES = {
  limit: 'ONE bonus action per turn. Need a feature/spell that grants it.',
  timing: 'Choose when during your turn. Before, between, or after actions.',
  restriction: 'Can\'t swap Action ↔ BA unless a feature says so.',
  spellRule: 'If you cast a BA spell, your Action spell can only be a cantrip.',
};

export const BA_BY_CLASS = [
  { class: 'Fighter', topBAs: 'PAM attack (S), GWM attack on kill/crit (S), Second Wind (A), TWF (A)', bestFirst: 'PAM attack every turn.' },
  { class: 'Rogue', topBAs: 'Hide/Steady Aim for SA (S), Disengage (A+), Dash (A), TWF as SA backup (A)', bestFirst: 'Hide or Steady Aim for Sneak Attack advantage.' },
  { class: 'Monk', topBAs: 'Flurry of Blows (S), Free unarmed (A+), Patient Defense (A), Step of Wind (B+)', bestFirst: 'Flurry for Stunning Strike chances.' },
  { class: 'Paladin', topBAs: 'Vow of Enmity (S), Smite spells (A+), Misty Step (A+), Shield of Faith (A)', bestFirst: 'Vow of Enmity round 1 vs boss.' },
  { class: 'Cleric', topBAs: 'Healing Word (S+), Spiritual Weapon (S), Channel Divinity (varies)', bestFirst: 'Spiritual Weapon R1, Healing Word when ally is down.' },
  { class: 'Warlock', topBAs: 'Hexblade Curse (S), Hex (S), Misty Step (A+)', bestFirst: 'Hexblade Curse on boss, Hex on multi-target.' },
  { class: 'Sorcerer', topBAs: 'Quickened Spell (S+), Misty Step (A+)', bestFirst: 'Quickened EB + EB = 4+ beams per turn.' },
  { class: 'Ranger', topBAs: 'Hunter\'s Mark (A+), Misty Step (A+), Planar Warrior (A)', bestFirst: 'Hunter\'s Mark R1, Misty Step for escape.' },
  { class: 'Bard', topBAs: 'Healing Word (S+), Bardic Inspiration (S), Mantle of Inspiration (A+)', bestFirst: 'Bardic Inspiration to key ally.' },
  { class: 'Druid', topBAs: 'Wild Shape (Moon: BA, A+), Healing Word (S+)', bestFirst: 'Wild Shape R1 (Moon) or Healing Word.' },
  { class: 'Wizard', topBAs: 'Misty Step (A+), Shadow Blade (A)', bestFirst: 'Misty Step for repositioning/escape.' },
  { class: 'Artificer', topBAs: 'Command Steel Defender (A+), Cannon activation (A)', bestFirst: 'Command companion.' },
];

export const BA_TIPS = [
  'Healing Word is the #1 bonus action spell. Pick up downed allies at 60ft range.',
  'Spiritual Weapon has no concentration. Free 1d8+WIS every turn for 10 rounds.',
  'Steady Aim (Rogue): sacrifice movement for advantage. Perfect for ranged rogues.',
  'If you cast a BA spell, your action can only be a cantrip. Plan accordingly.',
  'Quickened Spell: best Sorcerer metamagic. BA Fireball + Action EB (cantrip).',
  'Don\'t feel obligated to use your BA. Only spend it if the effect is worth it.',
  'PAM bonus action attack: 1d4+STR every turn is significant over a full combat.',
];
