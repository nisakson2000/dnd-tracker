/**
 * playerSpellcastingRules.js
 * Player Mode: Core spellcasting rules that players frequently get wrong
 * Pure JS — no React dependencies.
 */

export const CASTING_RULES = [
  { rule: 'Bonus Action Spell Restriction', detail: 'If you cast a spell as a bonus action, you can ONLY cast a CANTRIP with your action. No Action + Bonus Action leveled spells in one turn.', commonMistake: 'Casting Healing Word (bonus) + Fireball (action). NOT ALLOWED.', exception: 'Action Surge (Fighter) lets you take an extra action — RAW debated, most DMs allow it.' },
  { rule: 'Concentration', detail: 'Only ONE concentration spell at a time. New concentration = old one drops. Take damage = CON save (DC 10 or half damage).', commonMistake: 'Maintaining Bless AND Spirit Guardians. NOT POSSIBLE. Pick one.', exception: 'None. This is a hard rule.' },
  { rule: 'Verbal Components', detail: 'Must speak clearly. Can\'t cast in Silence. Enemies can hear you casting.', commonMistake: 'Stealthily casting a V spell. You\'re literally shouting arcane words.', exception: 'Subtle Spell (Sorcerer) removes V and S components.' },
  { rule: 'Somatic Components', detail: 'Need a free hand for gestures. Can\'t do with both hands full (shield + weapon).', commonMistake: 'Casting with sword + shield without War Caster feat.', exception: 'War Caster feat allows casting with full hands.' },
  { rule: 'Material Components', detail: 'Arcane focus replaces materials WITHOUT a gold cost. Gold cost materials must be tracked.', commonMistake: 'Using a focus for Revivify (300gp diamond required). NOPE.', exception: 'Component pouch also works for non-gold materials.' },
  { rule: 'Spell Level vs Character Level', detail: 'Spell levels go 1-9. Character levels go 1-20. A 5th-level character doesn\'t automatically get 5th-level spells.', commonMistake: 'Confusing the two. Full casters get 5th-level spells at character level 9.', exception: 'Warlocks get Mystic Arcanum for 6th-9th level spells.' },
  { rule: 'Upcasting', detail: 'Many spells gain extra effects when cast using a higher slot. Check spell description.', commonMistake: 'Assuming ALL spells get better when upcast. Many don\'t.', exception: 'Some spells specifically state "At Higher Levels."' },
  { rule: 'Spell Attacks in Melee', detail: 'Ranged spell attacks have DISADVANTAGE when a hostile creature is within 5ft of you.', commonMistake: 'Casting Fire Bolt at point blank without disadvantage.', exception: 'Crossbow Expert feat removes this penalty for ALL ranged attacks.' },
  { rule: 'Targeting Through Cover', detail: 'Total cover blocks ALL targeting. Most spells require a clear path to the target.', commonMistake: 'Casting through a solid wall or around corners.', exception: 'Sacred Flame ignores cover. Some AoE goes around corners (Fireball).' },
  { rule: 'Readying a Spell', detail: 'You can Ready a spell, but you MUST hold concentration on it, and the slot is used even if the trigger never happens.', commonMistake: 'Readying a spell for free without losing the slot.', exception: 'None. The slot is always expended.' },
];

export const SPELL_INTERACTION_RULES = {
  antimagicField: 'Spells don\'t function in an Antimagic Field. Magic items become mundane.',
  dispelMagic: 'Auto-dispel if spell level ≤ your slot. Otherwise: ability check DC 10 + spell level.',
  counterspell: 'Reaction to negate a spell being cast within 60ft. Auto if same level, check if higher.',
  identifySpell: 'Reaction (Arcana check) to identify a spell being cast. Not automatic.',
  twinSpell: 'Can only twin spells that target ONE creature. Can\'t twin if it CAN target multiple.',
};

export function getRule(ruleName) {
  return CASTING_RULES.find(r => r.rule.toLowerCase().includes((ruleName || '').toLowerCase())) || null;
}

export function getAllMistakes() {
  return CASTING_RULES.map(r => ({ rule: r.rule, mistake: r.commonMistake }));
}
