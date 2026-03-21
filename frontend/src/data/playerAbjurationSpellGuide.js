/**
 * playerAbjurationSpellGuide.js
 * Player Mode: Abjuration spells — protection, warding, and defense
 * Pure JS — no React dependencies.
 */

export const ABJURATION_SPELLS_RANKED = [
  { spell: 'Shield', level: 1, rating: 'S+', note: '+5 AC as reaction until start of next turn. Auto-include for every arcane caster.' },
  { spell: 'Absorb Elements', level: 1, rating: 'S+', note: 'Halve elemental damage as reaction + bonus on next melee hit. Must-have.' },
  { spell: 'Counterspell', level: 3, rating: 'S+', note: 'Negate enemy spell. Most important reaction in the game vs casters.' },
  { spell: 'Dispel Magic', level: 3, rating: 'S', note: 'End one spell effect. Solve magical problems. Always prepare.' },
  { spell: 'Protection from Evil and Good', level: 1, rating: 'A+', note: 'Disadvantage on attacks from aberrations/celestials/elementals/fey/fiends/undead. Advantage on saves vs their effects.' },
  { spell: 'Mage Armor', level: 1, rating: 'A+', note: '13+DEX AC for 8 hours. Essential for unarmored casters.' },
  { spell: 'Death Ward', level: 4, rating: 'S', note: 'Don\'t die the first time you drop to 0. 8 hours, no concentration. Pre-fight must.' },
  { spell: 'Banishment', level: 4, rating: 'S', note: 'CHA save or removed from the fight. If native to another plane, permanently banished.' },
  { spell: 'Aid', level: 2, rating: 'S', note: '+5 max HP to 3 creatures for 8 hours. Upcasts for +5 per level. No concentration.' },
  { spell: 'Lesser Restoration', level: 2, rating: 'A+', note: 'Remove blinded, deafened, paralyzed, or poisoned. Always have access.' },
  { spell: 'Greater Restoration', level: 5, rating: 'S', note: 'Remove charmed, petrified, exhaustion, curse, stat reduction. 100gp. Critical.' },
  { spell: 'Pass Without Trace', level: 2, rating: 'S+', note: '+10 to Stealth for entire party. Best utility spell in the game.' },
  { spell: 'Warding Bond', level: 2, rating: 'A', note: '+1 AC and saves to target. You take same damage they take. Tanky support.' },
  { spell: 'Globe of Invulnerability', level: 6, rating: 'A+', note: 'L5 or lower spells can\'t affect area inside. Dome of anti-magic.' },
  { spell: 'Antimagic Field', level: 8, rating: 'S', note: '10ft sphere: NO magic works. Walk up to enemy caster, end their career.' },
  { spell: 'Mind Blank', level: 8, rating: 'A+', note: 'Immune to psychic damage, divination, and charm for 24 hours. Ultimate mental protection.' },
  { spell: 'Forbiddance', level: 6, rating: 'A', note: 'Ward area vs teleportation + 5d10 damage to chosen creature types. Ritual, permanent.' },
  { spell: 'Private Sanctum', level: 4, rating: 'B+', note: 'Block scrying, teleportation, and planar travel in area. Safe room.' },
];

export const ABJURATION_TIPS = [
  'Shield and Absorb Elements should ALWAYS be prepared if you have access to them.',
  'Counterspell: position within 60ft of enemy casters. You need to SEE the casting.',
  'Death Ward before boss fights. 8 hours means cast it during morning prep.',
  'Aid at higher levels is incredible. L9 Aid = +35 max HP to 3 creatures.',
  'Pass Without Trace makes your entire party invisible to Perception.',
  'Protection from Evil and Good covers most monster types. Incredibly efficient for L1.',
  'Greater Restoration removes exhaustion — one of the only ways to do so.',
  'Abjuration Wizard\'s Arcane Ward + Shield = tankiest Wizard possible.',
];
