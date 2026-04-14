// Standard 5e Armor AC values — shared between Overview and Inventory
export const ARMOR_AC_TABLE = {
  'Padded Armor': { base: 11, type: 'light' },
  'Leather Armor': { base: 11, type: 'light' },
  'Studded Leather': { base: 12, type: 'light' },
  'Hide Armor': { base: 12, type: 'medium', maxDex: 2 },
  'Chain Shirt': { base: 13, type: 'medium', maxDex: 2 },
  'Scale Mail': { base: 14, type: 'medium', maxDex: 2 },
  'Breastplate': { base: 14, type: 'medium', maxDex: 2 },
  'Half Plate': { base: 15, type: 'medium', maxDex: 2 },
  'Ring Mail': { base: 14, type: 'heavy' },
  'Chain Mail': { base: 16, type: 'heavy' },
  'Splint Armor': { base: 17, type: 'heavy' },
  'Plate Armor': { base: 18, type: 'heavy' },
  'Shield': { bonus: 2 },
};
