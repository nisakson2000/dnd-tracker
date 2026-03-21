/**
 * playerSpellInteraction.js
 * Player Mode: Spell interactions, combos, and conflicts
 * Pure JS — no React dependencies.
 */

export const SPELL_CONFLICTS = [
  { spell1: 'Bless', spell2: 'Spirit Guardians', conflict: 'Both require concentration. Can\'t maintain both. Choose one.', resolution: 'Usually Spirit Guardians wins for Cleric in melee. Bless wins if supporting from range.' },
  { spell1: 'Haste', spell2: 'Any concentration buff', conflict: 'Haste requires concentration. Dropping it causes LETHARGY (lose a full turn).', resolution: 'Protect the Haste caster at all costs. War Caster + Resilient (CON).' },
  { spell1: 'Darkness', spell2: 'Most party spells', conflict: 'Darkness blocks LINE OF SIGHT. Your allies can\'t target through it either.', resolution: 'Only use with Devil\'s Sight Warlock. Or cast it on enemy casters to block THEIR spells.' },
  { spell1: 'Silence', spell2: 'Verbal spells', conflict: 'Silence blocks ALL verbal spells in the area — yours AND enemies\'.', resolution: 'Use it on enemy casters. Keep YOUR casters outside the Silence.' },
  { spell1: 'Counterspell', spell2: 'Counterspell', conflict: 'Enemy can Counterspell your Counterspell. But a third caster can counter THEIR counter.', resolution: 'Have multiple casters. Use Subtle Spell (Sorcerer) to make Counterspell un-counterable.' },
  { spell1: 'Polymorph', spell2: 'Healing spells', conflict: 'Polymorphed creature has beast\'s HP. Damage doesn\'t carry to real HP until form drops.', resolution: 'Don\'t heal a polymorphed ally — heal them AFTER the polymorph drops.' },
  { spell1: 'Antimagic Field', spell2: 'Everything', conflict: 'ALL magic is suppressed inside the field. Magic items become mundane. Spells don\'t work.', resolution: 'Martials thrive here. Send the Fighter/Barbarian into the field.' },
];

export const SPELL_COMBOS = [
  { combo: 'Hold Person + Melee Attacks', effect: 'Paralyzed = auto-crit from within 5ft. Smite crits are devastating.', rating: 'S' },
  { combo: 'Spike Growth + Repelling Blast', effect: 'Push through Spike Growth = 2d4 per 5ft. 4 beams × 10ft = 8d4 extra.', rating: 'S' },
  { combo: 'Bestow Curse + Hex', effect: 'Stacks! Extra d6 necrotic (Hex) + d8 necrotic (Bestow Curse) per hit.', rating: 'A' },
  { combo: 'Enlarge + Grapple', effect: 'Become Large → grapple Huge creatures. Advantage on STR checks from Enlarge.', rating: 'A' },
  { combo: 'Faerie Fire + Full Party', effect: 'Entire party has advantage on attacks. No concentration save, just initial WIS.', rating: 'S' },
  { combo: 'Grease + Any Fire', effect: 'DM-dependent: some rule Grease is flammable. If so, add fire damage.', rating: 'B' },
  { combo: 'Animate Objects + Bless', effect: '10 tiny objects with +1d4 to attacks = extremely high hit rate.', rating: 'A' },
  { combo: 'Spirit Guardians + Dodge', effect: 'Mobile damage aura while Dodging. Enemies have disadvantage to hit you.', rating: 'A' },
];

export const DISPEL_INTERACTIONS = {
  dispelMagic: 'Targets one spell on a creature/object. DC = 10 + spell level if higher than your slot.',
  counterspell: 'Targets a spell BEING CAST. Must be within 60ft and see the caster.',
  antimagicField: 'Suppresses (not dispels) all magic in the area. Spells resume when field moves.',
  removeCurse: 'Removes curses. Some magic items require Identify to know they\'re cursed first.',
};

export function getSpellConflict(spell1, spell2) {
  return SPELL_CONFLICTS.find(c =>
    (c.spell1.toLowerCase().includes((spell1 || '').toLowerCase()) && c.spell2.toLowerCase().includes((spell2 || '').toLowerCase())) ||
    (c.spell1.toLowerCase().includes((spell2 || '').toLowerCase()) && c.spell2.toLowerCase().includes((spell1 || '').toLowerCase()))
  ) || null;
}

export function getSpellCombos(rating) {
  return SPELL_COMBOS.filter(c => c.rating === rating);
}
