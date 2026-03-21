/**
 * playerAbjurationWizardGuide.js
 * Player Mode: Abjuration Wizard — the ultimate tank wizard
 * Pure JS — no React dependencies.
 */

export const ABJURATION_BASICS = {
  class: 'Wizard (School of Abjuration)',
  theme: 'The wizard who doesn\'t die. Arcane Ward absorbs damage. Counter everything.',
  keyFeature: 'Arcane Ward: when you cast an abjuration spell, gain a ward = 2× Wizard level + INT mod HP.',
};

export const ABJURATION_FEATURES = [
  { feature: 'Arcane Ward', level: 2, effect: 'Ward HP = 2× Wizard level + INT mod. Recharge: +2× spell level when casting abjuration spells.', note: 'L6 with 18 INT: 16 HP ward. Recharge by casting Shield (+2), Absorb Elements (+2), Counterspell (+6).' },
  { feature: 'Projected Ward', level: 6, effect: 'When creature within 30ft takes damage, use reaction to have your ward absorb damage instead.', note: 'Protect allies with your ward HP. Bodyguard wizard.' },
  { feature: 'Improved Abjuration', level: 10, effect: 'Add proficiency bonus to ability checks for abjuration spells.', note: 'Counterspell and Dispel Magic checks get +PB. Nearly always succeed.' },
  { feature: 'Spell Resistance', level: 14, effect: 'Advantage on saves vs spells. Resistance to spell damage.', note: 'Like Yuan-Ti but for a Wizard. Half damage from all spells.' },
];

export const WARD_MANAGEMENT = {
  recharging: [
    'Cast Shield (+2 ward HP) — you\'re casting this anyway.',
    'Cast Absorb Elements (+2 ward HP) — also something you\'d cast.',
    'Cast Counterspell (+6 ward HP) — huge recharge.',
    'Cast Alarm as ritual — abjuration, recharges +2 ward HP per cast.',
    'Deep Gnome: Nondetection at will (3rd abjuration) = +6 ward HP per cast, infinite times.',
  ],
  maxWard: 'Ward caps at 2× Wizard level + INT mod. Can\'t exceed this.',
  damageOrder: 'Ward absorbs damage before your HP. If ward runs out, remaining damage hits you.',
};

export const DEEP_GNOME_ABJURATION = {
  combo: 'Deep Gnome race + Svirfneblin Magic feat + Abjuration Wizard',
  trick: 'Nondetection (3rd level abjuration) at will. Each cast recharges ward by 6.',
  result: 'Infinite ward HP. Between fights: cast Nondetection repeatedly until ward is full.',
  math: 'L6, INT 18: Ward max = 16. Cast Nondetection 3 times = 18 HP (capped at 16). Full ward, no slots spent.',
  rating: 'S — best Abjuration Wizard race combination',
};

export const ABJURATION_SPELL_PRIORITY = [
  { spell: 'Shield', level: 1, note: '+5 AC reaction + recharge ward. Cast it constantly.' },
  { spell: 'Absorb Elements', level: 1, note: 'Halve elemental damage + recharge ward. Essential.' },
  { spell: 'Counterspell', level: 3, note: 'Negate enemy spells + recharge ward +6. Improved Abjuration adds PB to check.' },
  { spell: 'Dispel Magic', level: 3, note: 'Remove magical effects. PB bonus from Improved Abjuration.' },
  { spell: 'Banishment', level: 4, note: 'Remove creatures from combat. Abjuration = recharge +8 ward.' },
  { spell: 'Globe of Invulnerability', level: 6, note: 'Block all spells 5th and lower. Abjuration = +12 ward recharge.' },
];

export function arcaneWardMax(wizardLevel, intMod) {
  return 2 * wizardLevel + intMod;
}

export function wardRecharge(spellLevel) {
  return 2 * spellLevel;
}

export function improvedCounterspellCheck(profBonus, targetSpellLevel) {
  const dc = 10 + targetSpellLevel;
  const bonus = profBonus; // Improved Abjuration adds PB
  return { dc, bonus, successChance: Math.min(100, Math.max(5, (21 - (dc - bonus)) * 5)) };
}
