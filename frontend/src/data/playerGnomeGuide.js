/**
 * playerGnomeGuide.js
 * Player Mode: Gnome race optimization and Gnome Cunning tactics
 * Pure JS — no React dependencies.
 */

export const GNOME_TRAITS = {
  asi: '+2 INT',
  size: 'Small',
  speed: '25ft',
  darkvision: '60ft',
  gnomeCunning: 'Advantage on INT, WIS, and CHA saves vs magic.',
  note: 'Gnome Cunning is one of the best racial features in the game. Advantage on 3/6 saving throws against all magic.',
};

export const GNOME_SUBTYPES = [
  {
    subtype: 'Rock Gnome',
    asi: '+1 CON',
    traits: 'Artificer\'s Lore (2× prof on magic items History). Tinker (build clockwork devices).',
    bestFor: 'Artificer (thematic + INT + CON), any INT class.',
    rating: 'B',
  },
  {
    subtype: 'Forest Gnome',
    asi: '+1 DEX',
    traits: 'Natural Illusionist (Minor Illusion cantrip). Speak with Small Beasts.',
    bestFor: 'Wizard, Rogue, Ranger. Minor Illusion for free is great.',
    rating: 'A',
  },
  {
    subtype: 'Deep Gnome (Svirfneblin)',
    asi: '+1 DEX',
    traits: 'Superior Darkvision 120ft. Stone Camouflage (advantage Stealth in rocky terrain). Age to 500.',
    bestFor: 'Underdark campaigns. Svirfneblin Magic feat adds Nondetection at will + Blindness/Deafness/Blur/Disguise Self 1/day.',
    rating: 'A (Underdark) / B (surface)',
  },
  {
    subtype: 'Mark of Scribing (Eberron)',
    asi: '+1 CHA',
    traits: 'Bonus spells (Comprehend Languages, Magic Mouth, Sending, etc.).',
    bestFor: 'Communication-focused builds.',
    rating: 'B',
  },
];

export const GNOME_CUNNING_VALUE = {
  savesAffected: ['INT saves (Mind Flayer Mind Blast, Feeblemind, Symbol)', 'WIS saves (most common save: Hold Person, Hypnotic Pattern, Dominate)', 'CHA saves (Banishment, Divine Word)'],
  math: 'Advantage ≈ +5 to the roll. Against magic, which is most save effects from level 5+, you\'re significantly safer.',
  synergy: 'Stacks with Paladin Aura (+CHA). A Gnome in a Paladin\'s aura has advantage + CHA bonus on 3 save types vs magic.',
};

export const GNOME_BUILDS = [
  { build: 'Deep Gnome Wizard (Abjuration)', detail: 'Gnome Cunning for saves. Svirfneblin Magic feat: Nondetection at will recharges Arcane Ward.', rating: 'S' },
  { build: 'Forest Gnome Arcane Trickster', detail: 'DEX + INT. Minor Illusion for hiding. Gnome Cunning protects against enchantment.', rating: 'A' },
  { build: 'Rock Gnome Artificer', detail: 'INT + CON. Thematic. Gnome Cunning + medium armor + Shield spell.', rating: 'A' },
  { build: 'Gnome Barbarian', detail: 'Meme build? Actually strong. Gnome Cunning + Rage = resist physical AND magic.', rating: 'B' },
];

export function gnomeCunningSaveBonus() {
  return 5; // Advantage ≈ +5 on average
}

export function svirfneblinWardRecharge(abjWizardLevel) {
  // Nondetection is 3rd level abjuration = recharges Arcane Ward by 6 HP (2× spell level)
  return abjWizardLevel >= 2 ? 6 : 0;
}
