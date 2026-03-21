/**
 * playerMagicSchoolEffects.js
 * Player Mode: Magic school descriptions and typical effects
 * Pure JS — no React dependencies.
 */

export const MAGIC_SCHOOLS = [
  { school: 'Abjuration', color: '#3b82f6', description: 'Protective magic. Shields, wards, banishment.', typical: 'Shield, Counterspell, Dispel Magic, Banishment, Globe of Invulnerability', savant: 'Abjuration Wizard gets Arcane Ward (temp HP shield that regenerates).' },
  { school: 'Conjuration', color: '#22c55e', description: 'Summoning creatures and objects, teleportation.', typical: 'Misty Step, Conjure Animals, Dimension Door, Teleportation Circle', savant: 'Conjuration Wizard can create small objects and eventually teleport freely.' },
  { school: 'Divination', color: '#eab308', description: 'Gaining information, seeing the future/past.', typical: 'Detect Magic, Identify, Scrying, True Seeing, Foresight', savant: 'Divination Wizard gets Portent (replace any d20 roll with pre-rolled dice).' },
  { school: 'Enchantment', color: '#ec4899', description: 'Mind control, charm, influence.', typical: 'Charm Person, Hold Person, Suggestion, Dominate Monster', savant: 'Enchantment Wizard can redirect charmed creature\'s attack against another target.' },
  { school: 'Evocation', color: '#ef4444', description: 'Raw elemental damage and energy manipulation.', typical: 'Fireball, Lightning Bolt, Cone of Cold, Meteor Swarm', savant: 'Evocation Wizard gets Sculpt Spells (protect allies from your AoE).' },
  { school: 'Illusion', color: '#a855f7', description: 'Deception, false images, phantom effects.', typical: 'Minor Illusion, Major Image, Invisibility, Mirage Arcane', savant: 'Illusion Wizard can make illusions semi-real at high levels.' },
  { school: 'Necromancy', color: '#6b7280', description: 'Death magic, undead, life force manipulation.', typical: 'Animate Dead, Blight, Circle of Death, Finger of Death', savant: 'Necromancy Wizard heals when killing with spells and creates stronger undead.' },
  { school: 'Transmutation', color: '#f97316', description: 'Changing properties of creatures, objects, or reality.', typical: 'Polymorph, Haste, Fly, Wish, True Polymorph', savant: 'Transmutation Wizard gets the Transmuter\'s Stone (various buffs).' },
];

export const DETECT_MAGIC_SCHOOLS = {
  description: 'Detect Magic reveals the school of magic on auras. Use this to identify what kind of magic is at work:',
  examples: [
    'Abjuration aura → Probably a ward, trap shield, or magical lock.',
    'Conjuration aura → Summoned creature, teleportation circle, or created object.',
    'Divination aura → Scrying sensor, alarm, or tracking spell.',
    'Enchantment aura → Mind control, charm, or compulsion effect.',
    'Evocation aura → Damage trap, Glyph of Warding, or energy effect.',
    'Illusion aura → Fake wall, hidden door, or disguised creature.',
    'Necromancy aura → Undead animation, life drain, or death effect.',
    'Transmutation aura → Altered object, polymorphed creature, or enhanced material.',
  ],
};

export function getSchoolInfo(school) {
  return MAGIC_SCHOOLS.find(s => s.school.toLowerCase() === (school || '').toLowerCase()) || null;
}

export function getSchoolColor(school) {
  const info = getSchoolInfo(school);
  return info ? info.color : '#6b7280';
}
