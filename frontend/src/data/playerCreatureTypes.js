/**
 * playerCreatureTypes.js
 * Player Mode: Creature type reference for identification and combat
 * Pure JS — no React dependencies.
 */

export const CREATURE_TYPES = [
  { type: 'Aberration', description: 'Utterly alien beings from beyond the planes.', examples: ['Beholder', 'Mind Flayer', 'Aboleth'], commonResistances: [], commonImmunities: [] },
  { type: 'Beast', description: 'Nonhumanoid creatures, part of the natural world.', examples: ['Wolf', 'Giant Spider', 'T-Rex'], commonResistances: [], commonImmunities: [] },
  { type: 'Celestial', description: 'Creatures native to the Upper Planes.', examples: ['Angel', 'Pegasus', 'Unicorn'], commonResistances: ['radiant'], commonImmunities: [] },
  { type: 'Construct', description: 'Made, not born. Animated by magic.', examples: ['Golem', 'Shield Guardian', 'Animated Armor'], commonResistances: [], commonImmunities: ['poison', 'psychic', 'charmed', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned'] },
  { type: 'Dragon', description: 'Large reptilian creatures of ancient origin.', examples: ['Red Dragon', 'Gold Dragon', 'Wyvern'], commonResistances: [], commonImmunities: [] },
  { type: 'Elemental', description: 'Creatures composed of elemental energy.', examples: ['Fire Elemental', 'Water Elemental', 'Gargoyle'], commonResistances: [], commonImmunities: ['poison', 'exhaustion', 'paralyzed', 'petrified', 'poisoned', 'unconscious'] },
  { type: 'Fey', description: 'Magical creatures tied to nature and the Feywild.', examples: ['Dryad', 'Satyr', 'Sprite'], commonResistances: [], commonImmunities: [] },
  { type: 'Fiend', description: 'Creatures of wickedness from the Lower Planes.', examples: ['Demon', 'Devil', 'Succubus'], commonResistances: ['cold', 'fire', 'lightning'], commonImmunities: ['poison', 'poisoned'] },
  { type: 'Giant', description: 'Human-like but enormous.', examples: ['Hill Giant', 'Storm Giant', 'Ogre'], commonResistances: [], commonImmunities: [] },
  { type: 'Humanoid', description: 'Bipedal peoples of the civilized world.', examples: ['Human', 'Elf', 'Orc', 'Goblin'], commonResistances: [], commonImmunities: [] },
  { type: 'Monstrosity', description: 'Frightening creatures that are not ordinary beasts.', examples: ['Owlbear', 'Mimic', 'Basilisk'], commonResistances: [], commonImmunities: [] },
  { type: 'Ooze', description: 'Gelatinous creatures that rarely have a fixed shape.', examples: ['Gelatinous Cube', 'Black Pudding', 'Ochre Jelly'], commonResistances: [], commonImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 'prone'] },
  { type: 'Plant', description: 'Vegetable creatures.', examples: ['Treant', 'Shambling Mound', 'Myconid'], commonResistances: [], commonImmunities: [] },
  { type: 'Undead', description: 'Once-living creatures animated by dark magic.', examples: ['Zombie', 'Vampire', 'Lich'], commonResistances: ['necrotic'], commonImmunities: ['poison', 'poisoned', 'exhaustion'] },
];

export function getCreatureType(type) {
  return CREATURE_TYPES.find(c => c.type.toLowerCase() === (type || '').toLowerCase()) || null;
}

export function getCommonImmunities(type) {
  const ct = getCreatureType(type);
  return ct ? ct.commonImmunities : [];
}

export function isUndead(type) {
  return (type || '').toLowerCase() === 'undead';
}

export function isConstruct(type) {
  return (type || '').toLowerCase() === 'construct';
}
