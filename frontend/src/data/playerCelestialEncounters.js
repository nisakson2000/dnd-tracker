/**
 * playerCelestialEncounters.js
 * Player Mode: Interacting with celestials — allies, threats, and divine encounters
 * Pure JS — no React dependencies.
 */

export const CELESTIAL_TYPES = [
  { name: 'Couatl', cr: 4, alignment: 'LG', note: 'Shapechange, divine spellcasting, Shielded Mind (immune to scrying/detection). Often quest givers.' },
  { name: 'Unicorn', cr: 5, alignment: 'LG', note: 'Legendary actions, healing touch, teleport. Protectors of sacred groves.' },
  { name: 'Pegasus', cr: 2, alignment: 'CG', note: 'Flying mount. Only serves good-aligned riders willingly.' },
  { name: 'Deva', cr: 10, alignment: 'LG', note: 'Angelic Weapons (+4d8 radiant). Shapechange. Divine messengers.' },
  { name: 'Planetar', cr: 16, alignment: 'LG', note: '200 HP, multi-attack (4d6+7d8), Divine Awareness, innate casting.' },
  { name: 'Solar', cr: 21, alignment: 'LG', note: '243 HP, Slaying Longbow (kill if <100 HP, CON DC 15). Legendary Resistance ×3.' },
  { name: 'Ki-rin', cr: 12, alignment: 'LG', note: 'Innate spellcasting (Cleric list), Create Food/Water, lair = hallowed ground.' },
  { name: 'Empyrean', cr: 23, alignment: 'CG/NE', note: 'Titan child of a god. Can be evil. Trembling Strike (save or prone). Legendary ×3.' },
];

export const CELESTIAL_TRAITS = {
  common: ['Radiant damage resistance/immunity', 'Darkvision', 'Magic Resistance (most)', 'Condition immunities (charmed, exhaustion, frightened)'],
  weapons: 'Angelic weapons deal extra radiant damage (added to attacks).',
  alignment: 'Almost always Good. Evil celestials (fallen angels) exist but are rare.',
  communication: 'Many celestials speak all languages (Tongues effect) and can telepathically communicate.',
};

export const FIGHTING_CELESTIALS = {
  when: 'Fallen angels, corrupted celestials, or defending artifacts they guard.',
  challenges: [
    'Magic Resistance = disadvantage on save spells.',
    'Radiant damage immunity/resistance — avoid radiant sources.',
    'High WIS saves — enchantment spells are unreliable.',
    'Legendary Resistance (high CR celestials) — burn through before relying on save effects.',
    'Flying speed — need ranged options or flight.',
  ],
  weaknesses: [
    'Necrotic damage — few celestials resist it.',
    'Nonmagical physical damage still works (they\'re not immune).',
    'Antimagic Field shuts down innate spellcasting.',
    'DEX saves tend to be lower than WIS/CHA for bulky celestials.',
  ],
};

export const CELESTIAL_AS_ALLIES = [
  'Planar Ally (6th): Request a celestial. Must negotiate payment (service, quest, gold).',
  'Conjure Celestial (7th): Summon CR 4 or below (Couatl is best pick).',
  'Divine Intervention (Cleric 10+): Direct divine aid. 100% success at L20.',
  'Holy Avenger weapon: +3, +2d10 radiant vs fiends/undead, aura of advantage on saves.',
  'Celestial Warlock: Patron is a celestial. Healing Light, radiant/fire resistance.',
];

export function solarSlayingBow(targetCurrentHP) {
  if (targetCurrentHP < 100) return 'Target must make CON DC 15 save or die.';
  return 'Normal damage (2d6+2d8+6 piercing + 6d8 radiant).';
}

export function angelicWeaponDamage(baseDamage, extraRadiantDice) {
  return baseDamage + (extraRadiantDice * 4.5);
}
