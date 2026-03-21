/**
 * playerLevel1Survival.js
 * Player Mode: Surviving levels 1-3 — the most dangerous tier of play
 * Pure JS — no React dependencies.
 */

export const LEVEL1_DANGERS = {
  hp: 'Most PCs have 8-12 HP at level 1. A single crit can kill outright.',
  damage: 'Goblin deals 1d6+2 (avg 5.5). Two hits drops most casters.',
  resources: 'Level 1 casters get 2 spell slots. Fighters get one Second Wind. That\'s it.',
  death: 'Massive damage rule: if remaining damage ≥ your max HP after 0, you die instantly. At 8 HP, taking 16+ damage in one hit = instant death.',
  note: 'Level 1 is genuinely the most dangerous level. Don\'t be a hero.',
};

export const SURVIVAL_TIPS = [
  { tip: 'Take the Dodge action', detail: 'If you\'re in danger and can\'t kill the threat, Dodge imposes disadvantage on all attacks against you. Better than swinging and missing.' },
  { tip: 'Use cover', detail: 'Half cover (+2 AC), three-quarters (+5 AC). Stand behind things. Your AC matters enormously at level 1.' },
  { tip: 'Focus fire', detail: 'Dead enemies deal 0 damage. Spreading damage across 4 enemies means 4 enemies still attacking. Kill one at a time.' },
  { tip: 'Carry a ranged option', detail: 'Every character should have a ranged attack. Javelins (30/120ft), light crossbow, or cantrips.' },
  { tip: 'Buy a healing potion', detail: '50 gp. Heals 2d4+2 (avg 7). At level 1 this is nearly a full heal. Worth every copper.' },
  { tip: 'Run away', detail: 'Seriously. If the fight is going badly, Disengage and retreat. Dead PCs can\'t level up.' },
  { tip: 'Sleep spell', detail: 'Best level 1 spell. 5d8 HP of creatures fall asleep. No save. Wipes entire encounters at tier 1.' },
  { tip: 'Help action', detail: 'If you have nothing better to do, Help gives an ally advantage. Free and always useful.' },
  { tip: 'Take a shield', detail: '+2 AC for any class with shield proficiency. That\'s a 10% reduction in hits taken.' },
  { tip: 'Short rest after every fight', detail: 'At level 1, you have 1 Hit Die. Use it. Recover half your HP for free.' },
];

export const FIRST_LEVEL_SPELLS_RANKED = [
  { spell: 'Sleep', rating: 'S', note: 'No save, no attack roll. 5d8 HP of enemies just stop fighting. Best at levels 1-3.' },
  { spell: 'Shield', rating: 'S', note: '+5 AC reaction. Turns hits into misses. Saves your life.' },
  { spell: 'Healing Word', rating: 'S', note: 'Bonus action ranged heal. Pick up downed allies. The best low-level heal.' },
  { spell: 'Bless', rating: 'S', note: '+1d4 to attacks and saves for 3 people. Massive impact for a 1st level slot.' },
  { spell: 'Guiding Bolt', rating: 'A', note: '4d6 radiant + advantage on next attack. Strong opener.' },
  { spell: 'Entangle', rating: 'A', note: 'Restrained in 20ft square. STR save. Great crowd control.' },
  { spell: 'Magic Missile', rating: 'A', note: 'Auto-hit 3d4+3 force damage. Guaranteed damage. Finishes low HP targets.' },
  { spell: 'Faerie Fire', rating: 'A', note: 'Advantage on attacks vs outlined targets. Party-wide benefit. Counters invisibility.' },
];

export const STARTING_GEAR_PRIORITY = [
  'Armor: best you can afford and use. Chain mail (75 gp) for heavy armor users.',
  'Shield: +2 AC for 10 gp. No-brainer.',
  'Healing Potion: 50 gp. Emergency heal.',
  'Ranged weapon: light crossbow (25 gp) or javelins (5 sp each).',
  'Explorer\'s Pack: rope, torches, rations. Basics covered.',
  'Component pouch or arcane focus: don\'t forget this, casters.',
];

export function effectiveHP(maxHP, ac, enemyAttackBonus) {
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (ac - enemyAttackBonus)) / 20));
  return maxHP / hitChance;
}

export function canOneShot(maxHP) {
  // If single hit deals >= 2× max HP from 0, instant death
  return maxHP * 2; // damage threshold for instant death at full HP
}
