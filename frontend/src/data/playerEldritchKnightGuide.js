/**
 * playerEldritchKnightGuide.js
 * Player Mode: Eldritch Knight subclass optimization and spell selection
 * Pure JS — no React dependencies.
 */

export const EK_BASICS = {
  class: 'Fighter (Eldritch Knight)',
  spellcasting: 'Third-caster (spell slots at 1/3 Fighter level)',
  ability: 'Intelligence',
  restriction: 'Abjuration and Evocation only (except at levels 3, 8, 14, 20 — any school)',
  cantrips: { level3: 2, level10: 3 },
  keyFeature: 'War Magic (L7): cantrip + bonus action weapon attack. Improved War Magic (L18): spell + bonus action attack.',
};

export const EK_SPELL_PICKS = {
  mustHave: [
    { spell: 'Shield', level: 1, school: 'Abjuration', note: '+5 AC as reaction. Best defensive spell in the game.' },
    { spell: 'Absorb Elements', level: 1, school: 'Abjuration', note: 'Halve elemental damage + add to next attack.' },
    { spell: 'Find Familiar', level: 1, school: 'Conjuration', note: 'Free school slot. Owl for Help action (flyby = no OA).' },
    { spell: 'Shadow Blade', level: 2, school: 'Illusion', note: 'Free school slot. 2d8 psychic finesse weapon. Advantage in dim light.' },
    { spell: 'Booming Blade', level: 0, school: 'Evocation', note: 'War Magic combo. Extra damage if target moves.' },
    { spell: 'Green-Flame Blade', level: 0, school: 'Evocation', note: 'War Magic combo. Cleave damage to adjacent enemy.' },
  ],
  strong: [
    { spell: 'Misty Step', level: 2, school: 'Conjuration', note: 'Free school slot. Bonus action teleport 30ft.' },
    { spell: 'Haste', level: 3, school: 'Transmutation', note: 'Free school slot. Self-Haste for extra attack + AC + speed.' },
    { spell: 'Mirror Image', level: 2, school: 'Illusion', note: 'Free school slot. No concentration defense.' },
    { spell: 'Counterspell', level: 3, school: 'Abjuration', note: 'Shut down enemy casters.' },
    { spell: 'Blur', level: 2, school: 'Illusion', note: 'Free school slot. Disadvantage on attacks against you.' },
  ],
};

export const EK_TACTICS = [
  { tactic: 'War Magic combo', detail: 'Booming Blade + bonus action attack = 2 hits with extra thunder damage.', level: 7 },
  { tactic: 'Shield stacking', detail: 'Heavy armor + shield + Shield spell = 25+ AC. Nearly unhittable.', level: 3 },
  { tactic: 'Absorb + Extra Attack', detail: 'Take fire breath, absorb it, next turn add fire damage to all attacks.', level: 3 },
  { tactic: 'Shadow Blade + Extra Attack', detail: '2d8 psychic per hit × 2-4 attacks. Advantage in dim/dark.', level: 8 },
  { tactic: 'Action Surge + Haste', detail: 'Self-Haste → Action Surge = 5 attacks in one turn (L11).', level: 11 },
  { tactic: 'Weapon Bond + throw', detail: 'Throw weapon, summon it back. Infinite thrown weapon.', level: 3 },
];

export const EK_MULTICLASS = [
  { combo: 'EK 7 / War Wizard 2', benefit: '+INT to initiative, +2 AC/+4 saves as reaction, more cantrips/slots.', rating: 'S' },
  { combo: 'EK 7 / Bladesinger 2', benefit: 'Bladesong stacks with everything. +INT to AC and concentration.', rating: 'A' },
  { combo: 'EK 11 / Wizard X', benefit: 'After 3rd Extra Attack, Wizard levels for more spell slots.', rating: 'A' },
  { combo: 'EK 5 / Artificer 2', benefit: 'Infusions + spell slots. Enhanced weapon/armor.', rating: 'B' },
];

export function ekSpellSlots(fighterLevel) {
  const table = [0,0,0,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4];
  return { first: table[fighterLevel] || 0, second: fighterLevel >= 7 ? (fighterLevel >= 13 ? 3 : 2) : 0, third: fighterLevel >= 13 ? (fighterLevel >= 19 ? 3 : 2) : 0 };
}

export function warMagicDPR(cantripDamage, weaponDamage, strOrDexMod) {
  return cantripDamage + weaponDamage + strOrDexMod;
}
