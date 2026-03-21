/**
 * Creature Types & Common Resistances/Immunities — D&D 5e Reference
 *
 * Covers roadmap item 360: Damage type reference with common resistances/immunities by creature type.
 * Used by DM quick reference and combat system.
 */

export const DAMAGE_TYPES = {
  physical: ['Bludgeoning', 'Piercing', 'Slashing'],
  elemental: ['Acid', 'Cold', 'Fire', 'Lightning', 'Thunder'],
  magical: ['Force', 'Necrotic', 'Radiant', 'Psychic', 'Poison'],
};

export const CREATURE_TYPES = {
  Aberration: {
    description: 'Utterly alien beings from beyond the planes — mind flayers, beholders, aboleths.',
    commonResistances: [],
    commonImmunities: [],
    commonConditionImmunities: ['Charmed'],
    typicalAbilities: ['Telepathy', 'Darkvision', 'Magic Resistance'],
    examples: ['Beholder', 'Mind Flayer', 'Aboleth', 'Gibbering Mouther'],
  },
  Beast: {
    description: 'Natural animals and wildlife — wolves, bears, eagles, horses.',
    commonResistances: [],
    commonImmunities: [],
    commonConditionImmunities: [],
    typicalAbilities: ['Keen Senses', 'Pack Tactics', 'Charge'],
    examples: ['Wolf', 'Bear', 'Giant Eagle', 'Dire Wolf'],
  },
  Celestial: {
    description: 'Beings from the Upper Planes — angels, couatl, unicorns.',
    commonResistances: ['Radiant'],
    commonImmunities: ['Necrotic', 'Poison'],
    commonConditionImmunities: ['Charmed', 'Exhaustion', 'Frightened', 'Poisoned'],
    typicalAbilities: ['Magic Resistance', 'Divine Awareness', 'Healing Touch', 'Flyby'],
    examples: ['Deva', 'Planetar', 'Solar', 'Unicorn', 'Couatl'],
  },
  Construct: {
    description: 'Magically created beings — golems, animated armor, shield guardians.',
    commonResistances: [],
    commonImmunities: ['Poison', 'Psychic'],
    commonConditionImmunities: ['Charmed', 'Exhaustion', 'Frightened', 'Paralyzed', 'Petrified', 'Poisoned'],
    typicalAbilities: ['Magic Resistance', 'Immutable Form', 'Magic Weapons'],
    examples: ['Iron Golem', 'Shield Guardian', 'Animated Armor', 'Homunculus'],
  },
  Dragon: {
    description: 'Winged, reptilian creatures of ancient lineage — from wyrmlings to ancient dragons.',
    commonResistances: [],
    commonImmunities: ['Varies by color (Fire for Red, Cold for White, etc.)'],
    commonConditionImmunities: ['Frightened (ancient)'],
    typicalAbilities: ['Breath Weapon', 'Frightful Presence', 'Legendary Actions', 'Lair Actions', 'Blindsight', 'Flyby'],
    examples: ['Red Dragon', 'Gold Dragon', 'White Dragon', 'Shadow Dragon'],
    colorImmunities: {
      Red: 'Fire', Gold: 'Fire', Brass: 'Fire',
      White: 'Cold', Silver: 'Cold',
      Blue: 'Lightning', Bronze: 'Lightning',
      Black: 'Acid', Copper: 'Acid',
      Green: 'Poison',
    },
  },
  Elemental: {
    description: 'Beings of pure elemental energy — fire, water, air, earth.',
    commonResistances: ['Bludgeoning/Piercing/Slashing (nonmagical)'],
    commonImmunities: ['Poison'],
    commonConditionImmunities: ['Exhaustion', 'Paralyzed', 'Petrified', 'Poisoned', 'Unconscious'],
    typicalAbilities: ['Elemental Form', 'Damage Absorption'],
    examples: ['Fire Elemental', 'Water Elemental', 'Air Elemental', 'Earth Elemental'],
    elementImmunities: {
      Fire: 'Fire', Water: 'Cold', Air: 'Lightning/Thunder', Earth: 'Poison',
    },
  },
  Fey: {
    description: 'Creatures tied to the Feywild — sprites, satyrs, hags, eladrin.',
    commonResistances: [],
    commonImmunities: [],
    commonConditionImmunities: ['Charmed'],
    typicalAbilities: ['Magic Resistance', 'Innate Spellcasting', 'Fey Ancestry'],
    examples: ['Sprite', 'Satyr', 'Green Hag', 'Dryad', 'Eladrin'],
  },
  Fiend: {
    description: 'Evil beings from the Lower Planes — demons, devils, yugoloths.',
    commonResistances: ['Cold', 'Fire', 'Lightning', 'Bludgeoning/Piercing/Slashing (nonmagical)'],
    commonImmunities: ['Poison'],
    commonConditionImmunities: ['Poisoned'],
    typicalAbilities: ['Magic Resistance', 'Innate Spellcasting', 'Telepathy', 'Darkvision'],
    examples: ['Balor', 'Pit Fiend', 'Succubus', 'Imp', 'Quasit'],
    subtypes: {
      Demon: { chaotic: true, resistances: ['Cold', 'Fire', 'Lightning'] },
      Devil: { lawful: true, resistances: ['Cold'], immunities: ['Fire', 'Poison'] },
    },
  },
  Giant: {
    description: 'Enormous humanoid creatures — hill giants, frost giants, storm giants.',
    commonResistances: [],
    commonImmunities: [],
    commonConditionImmunities: [],
    typicalAbilities: ['Rock throwing', 'Multiattack', 'Huge size'],
    examples: ['Hill Giant', 'Stone Giant', 'Frost Giant', 'Fire Giant', 'Cloud Giant', 'Storm Giant'],
    typeImmunities: { Frost: 'Cold', Fire: 'Fire', Storm: 'Lightning/Thunder' },
  },
  Humanoid: {
    description: 'The most common creature type — humans, elves, dwarves, orcs, goblins.',
    commonResistances: [],
    commonImmunities: [],
    commonConditionImmunities: [],
    typicalAbilities: ['Varies widely', 'Spellcasting', 'Pack Tactics', 'Nimble Escape'],
    examples: ['Bandit', 'Guard', 'Mage', 'Knight', 'Goblin', 'Orc'],
  },
  Monstrosity: {
    description: 'Unnatural creatures not fitting other categories — owlbears, griffons, medusas.',
    commonResistances: [],
    commonImmunities: [],
    commonConditionImmunities: [],
    typicalAbilities: ['Varies widely', 'Natural weapons', 'Special senses'],
    examples: ['Owlbear', 'Griffon', 'Medusa', 'Basilisk', 'Mimic', 'Bulette'],
  },
  Ooze: {
    description: 'Amorphous, gelatinous creatures — slimes, jellies, cubes.',
    commonResistances: ['Acid'],
    commonImmunities: [],
    commonConditionImmunities: ['Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened', 'Prone'],
    typicalAbilities: ['Amorphous', 'Corrosive Form', 'Split', 'Blindsight'],
    examples: ['Gelatinous Cube', 'Black Pudding', 'Ochre Jelly', 'Gray Ooze'],
  },
  Plant: {
    description: 'Sentient or animated vegetation — treants, blights, shambling mounds.',
    commonResistances: [],
    commonImmunities: [],
    commonConditionImmunities: ['Blinded', 'Deafened', 'Exhaustion'],
    typicalAbilities: ['False Appearance', 'Engulf', 'Lightning Absorption'],
    examples: ['Treant', 'Shambling Mound', 'Awakened Tree', 'Twig Blight'],
  },
  Undead: {
    description: 'Once-living beings animated by dark magic — zombies, skeletons, vampires, liches.',
    commonResistances: ['Necrotic'],
    commonImmunities: ['Poison'],
    commonConditionImmunities: ['Exhaustion', 'Poisoned'],
    typicalAbilities: ['Darkvision', 'Undead Fortitude', 'Turn Resistance', 'Life Drain'],
    examples: ['Zombie', 'Skeleton', 'Vampire', 'Lich', 'Ghost', 'Wraith', 'Mummy'],
  },
};

/**
 * Get creature type info.
 */
export function getCreatureType(type) {
  return CREATURE_TYPES[type] || null;
}

/**
 * Get all creature types for UI selection.
 */
export function getAllCreatureTypes() {
  return Object.entries(CREATURE_TYPES).map(([key, ct]) => ({
    id: key,
    label: key,
    description: ct.description,
    examples: ct.examples,
  }));
}

/**
 * Get common resistances/immunities for a creature type.
 */
export function getTypeDefenses(type) {
  const ct = CREATURE_TYPES[type];
  if (!ct) return null;
  return {
    type,
    resistances: ct.commonResistances,
    immunities: ct.commonImmunities,
    conditionImmunities: ct.commonConditionImmunities,
  };
}

/**
 * Get all damage types grouped by category.
 */
export function getDamageTypes() {
  return DAMAGE_TYPES;
}

/**
 * Suggest likely resistances for a creature based on type and subtype.
 */
export function suggestResistances(creatureType, subtype) {
  const ct = CREATURE_TYPES[creatureType];
  if (!ct) return { resistances: [], immunities: [], conditionImmunities: [] };

  const result = {
    resistances: [...ct.commonResistances],
    immunities: [...ct.commonImmunities],
    conditionImmunities: [...ct.commonConditionImmunities],
  };

  if (subtype) {
    if (ct.colorImmunities && ct.colorImmunities[subtype]) {
      result.immunities.push(ct.colorImmunities[subtype]);
    }
    if (ct.typeImmunities && ct.typeImmunities[subtype]) {
      result.immunities.push(ct.typeImmunities[subtype]);
    }
    if (ct.elementImmunities && ct.elementImmunities[subtype]) {
      result.immunities.push(ct.elementImmunities[subtype]);
    }
    if (ct.subtypes && ct.subtypes[subtype]) {
      const st = ct.subtypes[subtype];
      if (st.resistances) result.resistances.push(...st.resistances);
      if (st.immunities) result.immunities.push(...st.immunities);
    }
  }

  return result;
}
