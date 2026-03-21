/**
 * playerEquipmentSets.js
 * Player Mode: Equipment loadout presets and quick-swap
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// EQUIPMENT SLOTS
// ---------------------------------------------------------------------------

export const EQUIPMENT_SLOTS = [
  { id: 'main_hand', label: 'Main Hand', accepts: ['weapon', 'shield', 'focus'] },
  { id: 'off_hand', label: 'Off Hand', accepts: ['weapon', 'shield', 'focus'] },
  { id: 'armor', label: 'Armor', accepts: ['armor'] },
  { id: 'head', label: 'Head', accepts: ['helm', 'hat', 'circlet'] },
  { id: 'cloak', label: 'Cloak', accepts: ['cloak', 'cape'] },
  { id: 'neck', label: 'Neck', accepts: ['amulet', 'necklace'] },
  { id: 'ring_1', label: 'Ring 1', accepts: ['ring'] },
  { id: 'ring_2', label: 'Ring 2', accepts: ['ring'] },
  { id: 'gloves', label: 'Gloves', accepts: ['gloves', 'gauntlets'] },
  { id: 'boots', label: 'Boots', accepts: ['boots', 'shoes'] },
  { id: 'belt', label: 'Belt', accepts: ['belt', 'girdle'] },
];

// ---------------------------------------------------------------------------
// LOADOUT TEMPLATE
// ---------------------------------------------------------------------------

export const LOADOUT_TEMPLATE = {
  id: '',
  name: '',           // e.g., "Combat", "Stealth", "Social"
  slots: {},          // { main_hand: itemId, off_hand: itemId, ... }
  description: '',
};

// ---------------------------------------------------------------------------
// STARTING EQUIPMENT BY CLASS
// ---------------------------------------------------------------------------

export const CLASS_STARTING_EQUIPMENT = {
  Barbarian: ['Greataxe OR any martial melee weapon', '2 handaxes OR any simple weapon', 'Explorer\'s Pack', '4 javelins'],
  Bard: ['Rapier OR longsword OR any simple weapon', 'Diplomat\'s Pack OR Entertainer\'s Pack', 'Lute OR any musical instrument', 'Leather armor', 'Dagger'],
  Cleric: ['Mace OR warhammer (if proficient)', 'Scale mail OR leather armor OR chain mail (if proficient)', 'Light crossbow + 20 bolts OR any simple weapon', 'Priest\'s Pack OR Explorer\'s Pack', 'Shield', 'Holy symbol'],
  Druid: ['Wooden shield OR any simple weapon', 'Scimitar OR any simple melee weapon', 'Leather armor', 'Explorer\'s Pack', 'Druidic focus'],
  Fighter: ['Chain mail OR leather armor + longbow + 20 arrows', 'Martial weapon + shield OR 2 martial weapons', 'Light crossbow + 20 bolts OR 2 handaxes', 'Dungeoneer\'s Pack OR Explorer\'s Pack'],
  Monk: ['Shortsword OR any simple weapon', 'Dungeoneer\'s Pack OR Explorer\'s Pack', '10 darts'],
  Paladin: ['Martial weapon + shield OR 2 martial weapons', '5 javelins OR any simple melee weapon', 'Priest\'s Pack OR Explorer\'s Pack', 'Chain mail', 'Holy symbol'],
  Ranger: ['Scale mail OR leather armor', '2 shortswords OR 2 simple melee weapons', 'Dungeoneer\'s Pack OR Explorer\'s Pack', 'Longbow', '20 arrows'],
  Rogue: ['Rapier OR shortsword', 'Shortbow + 20 arrows OR shortsword', 'Burglar\'s Pack OR Dungeoneer\'s Pack OR Explorer\'s Pack', 'Leather armor', '2 daggers', 'Thieves\' tools'],
  Sorcerer: ['Light crossbow + 20 bolts OR any simple weapon', 'Component pouch OR arcane focus', 'Dungeoneer\'s Pack OR Explorer\'s Pack', '2 daggers'],
  Warlock: ['Light crossbow + 20 bolts OR any simple weapon', 'Component pouch OR arcane focus', 'Scholar\'s Pack OR Dungeoneer\'s Pack', 'Leather armor', 'Any simple weapon', '2 daggers'],
  Wizard: ['Quarterstaff OR dagger', 'Component pouch OR arcane focus', 'Scholar\'s Pack OR Explorer\'s Pack', 'Spellbook'],
};

/**
 * Create a new loadout preset.
 */
export function createLoadout(name, description = '') {
  return {
    ...LOADOUT_TEMPLATE,
    id: `loadout_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    description,
    slots: {},
  };
}
