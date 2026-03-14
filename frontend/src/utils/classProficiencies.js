import { CLASSES } from '../data/rules5e';

/**
 * Get class data by name (case-insensitive).
 */
export function getClassData(className) {
  if (!className) return null;
  const lower = className.toLowerCase();
  return CLASSES.find(c => c.name.toLowerCase() === lower) || null;
}

/**
 * Get weapon proficiencies for a class.
 * Returns { simple: boolean, martial: boolean, specific: string[] }
 */
export function getWeaponProficiencies(className) {
  const cls = getClassData(className);
  if (!cls) return { simple: true, martial: false, specific: [] };

  const profs = cls.weaponProficiencies || [];
  const lower = profs.map(p => p.toLowerCase());

  return {
    simple: lower.some(p => p.includes('simple')),
    martial: lower.some(p => p.includes('martial')),
    specific: profs.filter(p => {
      const l = p.toLowerCase();
      return !l.includes('simple weapons') && !l.includes('martial weapons');
    }),
  };
}

/**
 * Get armor proficiencies for a class.
 * Returns { light: boolean, medium: boolean, heavy: boolean, shields: boolean }
 */
export function getArmorProficiencies(className) {
  const cls = getClassData(className);
  if (!cls) return { light: false, medium: false, heavy: false, shields: false };

  const profs = (cls.armorProficiencies || []).map(p => p.toLowerCase());

  return {
    light: profs.some(p => p.includes('light')),
    medium: profs.some(p => p.includes('medium')),
    heavy: profs.some(p => p.includes('heavy') || p.includes('all armor')),
    shields: profs.some(p => p.includes('shield')),
  };
}

/**
 * Get spellcasting info for a class at a given level.
 * Returns { ability: string, type: string, maxSpellLevel: number } or null
 */
export function getSpellcastingInfo(className, level = 1) {
  const cls = getClassData(className);
  if (!cls || !cls.spellcasting) return null;

  const { ability, type } = cls.spellcasting;
  let maxSpellLevel;

  if (type === 'full') {
    // Full casters: spell level = ceil(level/2), max 9
    maxSpellLevel = Math.min(9, Math.ceil(level / 2));
  } else if (type === 'half') {
    // Half casters (Paladin, Ranger): spells at level 2, spell level = ceil((level-1)/2)
    maxSpellLevel = level < 2 ? 0 : Math.min(5, Math.ceil((level - 1) / 2));
  } else if (type === 'third') {
    // Third casters (Eldritch Knight, Arcane Trickster): spells at level 3
    maxSpellLevel = level < 3 ? 0 : Math.min(4, Math.ceil((level - 2) / 3));
  } else {
    maxSpellLevel = 0;
  }

  return { ability, type, maxSpellLevel };
}

/**
 * Check if a class can use a specific weapon category.
 */
export function canUseWeapon(className, weaponCategory) {
  const profs = getWeaponProficiencies(className);
  const cat = (weaponCategory || '').toLowerCase();

  if (cat === 'simple' || cat.includes('simple')) return profs.simple;
  if (cat === 'martial' || cat.includes('martial')) return profs.martial || profs.simple;
  // Specific weapon name check
  return profs.specific.some(s => s.toLowerCase().includes(cat));
}

/**
 * Check if a class can use a specific armor type.
 */
export function canUseArmor(className, armorType) {
  const profs = getArmorProficiencies(className);
  const type = (armorType || '').toLowerCase();

  if (type.includes('light')) return profs.light;
  if (type.includes('medium')) return profs.medium;
  if (type.includes('heavy')) return profs.heavy;
  if (type.includes('shield')) return profs.shields;
  return false;
}
