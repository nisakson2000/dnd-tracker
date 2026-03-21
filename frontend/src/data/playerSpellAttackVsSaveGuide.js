/**
 * playerSpellAttackVsSaveGuide.js
 * Player Mode: Spell attack rolls vs saving throw spells comparison
 * Pure JS — no React dependencies.
 */

export const ATTACK_VS_SAVE = {
  spellAttack: {
    mechanic: 'You roll d20 + spellcasting mod + proficiency vs target AC.',
    advantages: [
      'Crits possible (double damage dice on nat 20).',
      'Works with advantage sources (familiar Help, Faerie Fire, Guiding Bolt).',
      'Elven Accuracy works (super-advantage with 3d20).',
      'Some attack spells are very powerful (Eldritch Blast, Scorching Ray, Inflict Wounds).',
    ],
    disadvantages: [
      'Miss = 0 damage (all or nothing).',
      'Half/three-quarter cover adds to AC (+2/+5).',
      'High AC enemies are hard to hit.',
      'Disadvantage from various sources (prone at range, heavily obscured).',
    ],
  },
  savingThrow: {
    mechanic: 'Target rolls d20 + save mod vs your spell save DC (8 + mod + prof).',
    advantages: [
      'Successful save often still deals half damage.',
      'You don\'t roll — enemies roll. Advantage/disadvantage applies to them, not you.',
      'AoE spells: one cast, many saves. Efficient action economy.',
      'Target\'s save bonus is often lower than their AC.',
    ],
    disadvantages: [
      'No crits possible.',
      'Legendary Resistance (3/day auto-succeed) counters save spells.',
      'Magic Resistance (advantage on saves) is common at high CR.',
      'Can\'t benefit from advantage sources like Faerie Fire.',
    ],
  },
};

export const SAVE_TARGETING_GUIDE = {
  STR: { strong: 'Large creatures, Fighters, Barbarians', weak: 'Casters, Small creatures, undead', spells: ['Entangle', 'Thunderwave', 'Telekinesis'] },
  DEX: { strong: 'Rogues, Monks, Rangers', weak: 'Heavy armor wearers, large creatures, zombies', spells: ['Fireball', 'Lightning Bolt', 'Web'] },
  CON: { strong: 'Almost everything (most common proficient save)', weak: 'Very few creatures have bad CON', spells: ['Blight', 'Blindness/Deafness', 'Banishment (CHA save actually)'] },
  INT: { strong: 'Wizards, Artificers', weak: 'Beasts, most monsters, Fighters, Barbarians', spells: ['Phantasmal Force', 'Synaptic Static', 'Mind Sliver'] },
  WIS: { strong: 'Clerics, Druids, Rangers, Monks', weak: 'Undead, constructs, some aberrations', spells: ['Hold Person', 'Hypnotic Pattern', 'Command'] },
  CHA: { strong: 'Sorcerers, Bards, Paladins, Warlocks', weak: 'Beasts, most monsters, Fighters', spells: ['Banishment', 'Zone of Truth', 'Calm Emotions'] },
};

export const WEAKEST_SAVES = {
  note: 'INT, CHA, and STR are the least commonly proficient saves. Target these for best results.',
  ranking: [
    { save: 'INT', reason: 'Rarest save proficiency. Only Wizard/Artificer/Rogue/Fighter. Most monsters have terrible INT saves.' },
    { save: 'CHA', reason: 'Uncommon proficiency. Good against non-caster humanoids and beasts.' },
    { save: 'STR', reason: 'Uncommon proficiency. But many monsters have high base STR regardless.' },
    { save: 'WIS', reason: 'Common proficiency (Cleric, Druid, Ranger, Monk). But many monsters have moderate WIS.' },
    { save: 'DEX', reason: 'Common proficiency (Ranger, Monk, Rogue). But AoE spells targeting DEX still deal half on success.' },
    { save: 'CON', reason: 'Most common strong save. Nearly everything has good CON. Hardest to force failure.' },
  ],
};

export const WHEN_TO_USE_WHICH = [
  { situation: 'Single high-value target', use: 'Save spell (Hold Person, Banishment)', reason: 'Half damage on save. Higher floor than attack miss.' },
  { situation: 'Group of enemies', use: 'AoE save spell (Fireball, Hypnotic Pattern)', reason: 'One spell, many targets. Can\'t do this with attack spells.' },
  { situation: 'Have advantage (Faerie Fire, Familiar)', use: 'Attack spell (Eldritch Blast, Scorching Ray)', reason: 'Advantage benefits attack rolls, not save spells.' },
  { situation: 'Elven Accuracy character', use: 'Attack spell', reason: 'Super-advantage (3d20) massively boosts crit chance.' },
  { situation: 'Enemy has Legendary Resistance', use: 'Attack spell or half-damage save', reason: 'LR auto-succeeds saves. Attack spells bypass LR entirely.' },
  { situation: 'Enemy has Magic Resistance', use: 'Attack spell', reason: 'MR gives advantage on saves. Doesn\'t affect attack spells.' },
  { situation: 'Unknown enemy', use: 'INT save or DEX save (AoE)', reason: 'INT is safest bet (almost always weak). DEX AoE still deals half.' },
];

export function spellHitChance(spellAttackMod, targetAC, hasAdvantage) {
  const needed = targetAC - spellAttackMod;
  const normalChance = Math.max(0.05, Math.min(0.95, (21 - needed) / 20));
  const advChance = 1 - Math.pow(1 - normalChance, 2);
  return {
    normal: `${Math.round(normalChance * 100)}%`,
    withAdvantage: `${Math.round(advChance * 100)}%`,
    note: hasAdvantage ? `With advantage: ${Math.round(advChance * 100)}% to hit AC ${targetAC}` : `${Math.round(normalChance * 100)}% to hit AC ${targetAC}`,
  };
}
