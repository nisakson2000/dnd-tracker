/**
 * playerSummonReference.js
 * Player Mode: Summoned creature management and reference
 * Pure JS — no React dependencies.
 */

export const SUMMON_SPELLS = [
  { spell: 'Find Familiar (1st)', type: 'Ritual', duration: 'Until dismissed/killed', concentration: false, creatures: 'One tiny beast (see familiar list)', action: 'Familiar uses your bonus action for movement/actions.' },
  { spell: 'Conjure Animals (3rd)', type: 'Summon', duration: '1 hour', concentration: true, creatures: 'Choose: 1 CR2, 2 CR1, 4 CR1/2, or 8 CR1/4 beasts', action: 'They act on your initiative, obey your verbal commands (no action).' },
  { spell: 'Summon Beast (2nd, Tasha\'s)', type: 'Summon', duration: '1 hour', concentration: true, creatures: 'One bestial spirit (Air, Land, or Water form)', action: 'Acts on your initiative. Obeys commands.' },
  { spell: 'Summon Fey (3rd, Tasha\'s)', type: 'Summon', duration: '1 hour', concentration: true, creatures: 'One fey spirit (Fuming, Mirthful, or Tricksy)', action: 'Acts on your initiative. Obeys commands.' },
  { spell: 'Summon Undead (3rd, Tasha\'s)', type: 'Summon', duration: '1 hour', concentration: true, creatures: 'One undead spirit (Ghostly, Putrid, or Skeletal)', action: 'Acts on your initiative. Obeys commands.' },
  { spell: 'Conjure Elemental (5th)', type: 'Summon', duration: '1 hour', concentration: true, creatures: 'One elemental CR5 or lower', action: 'WARNING: If concentration breaks, elemental goes hostile!' },
  { spell: 'Conjure Minor Elementals (4th)', type: 'Summon', duration: '1 hour', concentration: true, creatures: '1 CR2, 2 CR1, 4 CR1/2, or 8 CR1/4 elementals', action: 'Obey verbal commands.' },
  { spell: 'Animate Dead (3rd)', type: 'Summon', duration: '24 hours', concentration: false, creatures: 'One skeleton or zombie per casting', action: 'Obey commands. Must recast every 24h or they go free.' },
  { spell: 'Summon Greater Demon (4th)', type: 'Summon', duration: '1 hour', concentration: true, creatures: 'One demon CR5 or lower', action: 'CHA save each turn to break free. Blood circle helps contain.' },
  { spell: 'Find Steed (2nd)', type: 'Summon', duration: 'Until dismissed/killed', concentration: false, creatures: 'Warhorse, pony, camel, elk, or mastiff (celestial/fey/fiend)', action: 'Intelligent, telepathic bond. Shares self-targeting spells.' },
  { spell: 'Find Greater Steed (4th)', type: 'Summon', duration: 'Until dismissed/killed', concentration: false, creatures: 'Griffon, pegasus, peryton, dire wolf, rhinoceros, saber-toothed tiger', action: 'Same as Find Steed but more powerful mounts.' },
];

export const SUMMON_MANAGEMENT_TIPS = [
  'Pre-roll summon stats and write them on a card/sheet before combat.',
  'Tasha\'s summon spells (Summon Beast, etc.) are simpler — one stat block that scales.',
  'Concentration summons disappear if you lose concentration — protect yourself!',
  'Summoned creatures act on YOUR initiative, right after you.',
  'Commands are free (no action) unless the spell says otherwise.',
  'Don\'t summon 8 creatures unless you can run them quickly — it slows combat.',
  'Animate Dead needs recasting every 24 hours to maintain control.',
];

export const SUMMON_COMBAT_ACTIONS = [
  'Attack (uses summon\'s attack action)',
  'Dash (double movement)',
  'Dodge (disadvantage on attacks against it)',
  'Help (give advantage to an ally\'s attack)',
  'Ready (prepare an action for a trigger)',
  'Disengage (avoid opportunity attacks)',
];

export function getSummonSpellInfo(spellName) {
  return SUMMON_SPELLS.find(s => s.spell.toLowerCase().includes((spellName || '').toLowerCase())) || null;
}

export function isConcentrationSummon(spellName) {
  const info = getSummonSpellInfo(spellName);
  return info ? info.concentration : false;
}
