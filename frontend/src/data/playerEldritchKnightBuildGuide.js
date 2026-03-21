/**
 * playerEldritchKnightBuildGuide.js
 * Player Mode: Eldritch Knight — Fighter subclass spellcasting guide
 * Pure JS — no React dependencies.
 */

export const EK_OVERVIEW = {
  subclass: 'Eldritch Knight',
  class: 'Fighter',
  spellcasting: '1/3 caster. Abjuration + Evocation restricted (some free picks).',
  note: 'The tankiest gish. Full Fighter chassis + defensive/utility magic.',
  rating: 'A+',
};

export const EK_KEY_FEATURES = [
  { level: 3, feature: 'Spellcasting', detail: '2 cantrips + 3 known spells (Abjuration/Evocation). INT-based.', note: 'Shield, Absorb Elements, Magic Missile.' },
  { level: 3, feature: 'Weapon Bond', detail: 'Bond with weapons. Can\'t be disarmed. Summon bonded weapon as BA.', note: 'Niche but flavorful. Never lose your weapon.' },
  { level: 7, feature: 'War Magic', detail: 'Cast cantrip → BA weapon attack.', note: 'Booming Blade + BA attack. Competes with Extra Attack at L11.' },
  { level: 10, feature: 'Eldritch Strike', detail: 'Hit with weapon → target has disadvantage on save vs your next spell.', note: 'Hit → Eldritch Strike → Hold Person (disadvantage save) → auto-crit melee.' },
  { level: 15, feature: 'Arcane Charge', detail: 'Teleport 30ft when you Action Surge.', note: 'Free teleport on AS. Incredible positioning.' },
  { level: 18, feature: 'Improved War Magic', detail: 'Cast spell (any level) → BA weapon attack.', note: 'Fireball + BA attack. L18 feature is amazing.' },
];

export const EK_BEST_SPELLS = {
  mustHave: [
    { spell: 'Shield (L1)', why: '+5 AC reaction. Best L1 spell for EK.', rating: 'S+' },
    { spell: 'Absorb Elements (L1)', why: 'Halve elemental damage. Essential reaction.', rating: 'S' },
    { spell: 'Booming Blade (cantrip)', why: 'War Magic combo. Extra thunder damage if they move.', rating: 'S' },
    { spell: 'Find Familiar (free pick)', why: 'Owl Help action = advantage on your attacks.', rating: 'S' },
    { spell: 'Shadow Blade (L2, free pick)', why: '2d8 psychic, advantage in dim light. Incredible EK weapon.', rating: 'A+' },
  ],
  recommended: [
    { spell: 'Mirror Image (free pick)', why: 'No concentration. 3 images absorb attacks. Amazing defense.', rating: 'A+' },
    { spell: 'Misty Step (free pick)', why: 'BA teleport. Escape, reposition, close distance.', rating: 'A+' },
    { spell: 'Haste (free pick, L3)', why: 'Self-Haste: +2 AC, extra attack, doubled speed. Risky if broken.', rating: 'A' },
    { spell: 'Fireball (L3)', why: 'Evocation. AoE damage when melee isn\'t optimal.', rating: 'A' },
    { spell: 'Counterspell (free pick)', why: 'INT-based check. Situational but game-saving.', rating: 'A' },
  ],
};

export const EK_STAT_PRIORITY = {
  primary: 'STR or DEX (attack stat)',
  secondary: 'CON (HP, concentration)',
  tertiary: 'INT (spell DC, spell attacks)',
  note: 'INT doesn\'t need to be high if you focus on non-save spells (Shield, Absorb, Mirror Image). 14 INT is fine.',
};

export const EK_COMBOS = [
  { combo: 'Booming Blade + War Magic', detail: 'BB (action) → BA attack. At L7: 1d8 + weapon + BA weapon.', rating: 'S (L7-10)' },
  { combo: 'Eldritch Strike + Hold Person', detail: 'Hit with weapon (ES) → Hold Person at disadvantage → ally auto-crits.', rating: 'S' },
  { combo: 'Shield + Plate + Shield', detail: 'AC 20 → Shield → AC 25. Nearly unhittable as a reaction.', rating: 'S' },
  { combo: 'Shadow Blade + darkness', detail: 'Shadow Blade advantage in dim/dark + BB damage on top.', rating: 'A+' },
  { combo: 'Action Surge + spell + attacks', detail: 'Spell (action) + Attack (AS) + BA attack = massive turn.', rating: 'S' },
];

export const EK_VS_BLADESINGER = {
  ek: { pros: ['Full Fighter (4 attacks)', 'Heavy armor + shield', 'CON save proficiency', 'More HP'], cons: ['1/3 caster (few slots)', 'Low spell DC', 'INT is tertiary'] },
  bladesinger: { pros: ['Full Wizard (high slots, many spells)', 'Extra Attack + cantrip', 'INT to AC/concentration'], cons: ['d6 HP', 'Light armor only', 'Fragile'] },
  verdict: 'EK for tankiness and weapon focus. Bladesinger for spell versatility and INT synergy.',
};
