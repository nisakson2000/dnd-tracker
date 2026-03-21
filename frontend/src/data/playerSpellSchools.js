/**
 * playerSpellSchools.js
 * Player Mode: Spell school reference with descriptions and colors
 * Pure JS — no React dependencies.
 */

export const SPELL_SCHOOLS = [
  { id: 'abjuration', name: 'Abjuration', color: '#3b82f6', description: 'Protective magic. Shields, wards, and banishment.', examples: ['Shield', 'Counterspell', 'Dispel Magic', 'Banishment'] },
  { id: 'conjuration', name: 'Conjuration', color: '#f59e0b', description: 'Summon creatures, create objects, teleportation.', examples: ['Misty Step', 'Conjure Animals', 'Dimension Door', 'Teleport'] },
  { id: 'divination', name: 'Divination', color: '#8b5cf6', description: 'Reveal information, predict the future.', examples: ['Detect Magic', 'Identify', 'Scrying', 'True Seeing'] },
  { id: 'enchantment', name: 'Enchantment', color: '#ec4899', description: 'Influence minds, charm and control.', examples: ['Charm Person', 'Hold Person', 'Suggestion', 'Dominate'] },
  { id: 'evocation', name: 'Evocation', color: '#ef4444', description: 'Raw elemental damage and energy manipulation.', examples: ['Fireball', 'Lightning Bolt', 'Cure Wounds', 'Healing Word'] },
  { id: 'illusion', name: 'Illusion', color: '#a855f7', description: 'Deceive the senses, create false images.', examples: ['Minor Illusion', 'Invisibility', 'Major Image', 'Mirage Arcane'] },
  { id: 'necromancy', name: 'Necromancy', color: '#6b7280', description: 'Manipulate life force, undead creation.', examples: ['Spare the Dying', 'Animate Dead', 'Revivify', 'Raise Dead'] },
  { id: 'transmutation', name: 'Transmutation', color: '#22c55e', description: 'Change properties of creatures and objects.', examples: ['Polymorph', 'Haste', 'Enlarge/Reduce', 'Stone Shape'] },
];

export function getSchool(id) {
  return SPELL_SCHOOLS.find(s => s.id === id || s.name.toLowerCase() === (id || '').toLowerCase()) || null;
}

export function getSchoolColor(schoolName) {
  const school = getSchool(schoolName);
  return school ? school.color : '#94a3b8';
}

export function getSchoolBySpell(spellSchool) {
  return getSchool((spellSchool || '').toLowerCase());
}
