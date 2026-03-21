/**
 * playerSorcererMetamagicGuide.js
 * Player Mode: Metamagic options ranked and analyzed
 * Pure JS — no React dependencies.
 */

export const METAMAGIC_BASICS = {
  concept: 'Sorcery Points fuel Metamagic, letting Sorcerers modify spells in ways no other caster can.',
  spPerLevel: 'SP = Sorcerer level (2 at L2, 20 at L20)',
  fontOfMagic: 'Convert spell slots to SP (slot level = SP gained) or SP to spell slots (varies by slot level).',
  metamagicKnown: '2 at L3, 3 at L10, 4 at L17',
  note: 'Metamagic is THE reason to play Sorcerer. Choose carefully — you can only swap at certain levels.',
};

export const METAMAGIC_RANKED = [
  { name: 'Quickened Spell', cost: '2 SP', effect: 'Change casting time from 1 action to 1 bonus action.', rating: 'S', note: 'Cast Fireball as bonus action + cantrip or another leveled spell (if different). Most versatile Metamagic.' },
  { name: 'Twinned Spell', cost: 'Spell level SP (1 for cantrips)', effect: 'Spell that targets one creature targets a second creature.', rating: 'S', note: 'Twin Haste = two allies Hasted. Twin Polymorph = two allies as Giant Apes. Twin Disintegrate. Game-changing.' },
  { name: 'Subtle Spell', cost: '1 SP', effect: 'No verbal or somatic components.', rating: 'A', note: 'Undetectable casting. Cast in Silence zones. Can\'t be Counterspelled (no perceptible casting). Social stealth casting.' },
  { name: 'Heightened Spell', cost: '3 SP', effect: 'Target has disadvantage on first save vs your spell.', rating: 'A', note: 'Expensive (3 SP) but guarantees your big spell lands. Use on Hold Monster, Banishment, etc.' },
  { name: 'Empowered Spell', cost: '1 SP', effect: 'Reroll up to CHA mod damage dice. Must use new rolls.', rating: 'B', note: 'Cheap (1 SP). Reroll low Fireball dice. Can be combined with other Metamagics. Marginal improvement.' },
  { name: 'Careful Spell', cost: '1 SP', effect: 'Choose CHA mod creatures to auto-succeed on your spell\'s save.', rating: 'B', note: 'They succeed the save — so they still take half damage from Fireball. Not as good as Sculpt Spells.' },
  { name: 'Extended Spell', cost: '1 SP', effect: 'Double spell duration (max 24 hours).', rating: 'C', note: 'Niche. Aid becomes 16 hours. Mage Armor becomes 16 hours. Rarely worth the Metamagic slot.' },
  { name: 'Distant Spell', cost: '1 SP', effect: 'Double range. Touch becomes 30ft.', rating: 'C', note: 'Touch to 30ft for Cure Wounds/Inflict Wounds. Or double Fireball to 300ft. Niche.' },
  { name: 'Transmuted Spell', cost: '1 SP', effect: 'Change damage type to acid/cold/fire/lightning/poison/thunder.', rating: 'B', note: 'Avoid resistance. Turn Fireball into Lightning Ball. Useful but niche.' },
  { name: 'Seeking Spell', cost: '2 SP', effect: 'Reroll a missed spell attack.', rating: 'C', note: 'Niche. Few Sorcerer spells use attack rolls. Use on Chromatic Orb or Scorching Ray.' },
];

export const METAMAGIC_COMBOS = [
  { combo: 'Quickened Spell + Action cantrip', detail: 'Quicken Fireball (bonus action) → Fire Bolt (action). Two spells per turn.', note: 'Can\'t cast two leveled spells (bonus action spell rule). But cantrip + leveled works.', rating: 'S' },
  { combo: 'Twinned Haste', detail: 'Twin Haste: two allies get +2 AC, double speed, extra attack. 3 SP.', rating: 'S', note: 'One of the best uses of Twinned. If concentration drops, BOTH targets get lethargy.' },
  { combo: 'Twinned Polymorph', detail: 'Twin Polymorph: two allies become Giant Apes (157 HP, 7d10+6 damage). 4 SP.', rating: 'S' },
  { combo: 'Subtle Counterspell', detail: 'Subtle Counterspell: no components → enemy can\'t Counterspell your Counterspell. Win the counter-war.', rating: 'S' },
  { combo: 'Heightened + save-or-suck', detail: 'Heightened Hold Monster: target saves with disadvantage. Much more likely to land. 3+5 = 8 SP total.', note: 'Expensive but reliable.' },
  { combo: 'Empowered + Quickened', detail: 'Quicken Fireball (bonus action) → Empowered (reroll low dice). Two Metamagics on one spell. 3 SP total.', rating: 'A' },
];

export const SP_ECONOMY = {
  level3: { sp: 3, note: 'Can Quicken once or Twin a L1 spell. Very limited.' },
  level5: { sp: 5, note: 'Can Quicken twice + Subtle once. Starting to feel good.' },
  level9: { sp: 9, note: 'Solid pool. Twin Haste (3) + Quicken (2) + extras.' },
  level13: { sp: 13, note: 'Comfortable. Multiple big Metamagics per day.' },
  level20: { sp: 20, note: 'Full pool. Convert some slots to SP for even more.' },
  slotConversion: 'L1→1SP, L2→2SP, L3→3SP, L4→4SP, L5→5SP. Higher slots can\'t be created from SP.',
};

export function twinSpellCost(spellLevel) {
  return Math.max(1, spellLevel); // Cantrip = 1 SP, otherwise = spell level
}

export function metamagicUsesPerDay(sorcererLevel, metamagicCost) {
  return Math.floor(sorcererLevel / metamagicCost);
}
