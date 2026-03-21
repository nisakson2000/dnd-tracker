/**
 * playerTieflingGuide.js
 * Player Mode: Tiefling race variants and optimization
 * Pure JS — no React dependencies.
 */

export const TIEFLING_BASE = {
  source: 'PHB + Mordenkainen\'s Tome of Foes',
  asi: '+2 CHA, +1 INT (PHB) — variants change ability scores and spells.',
  size: 'Medium',
  speed: '30ft',
  darkvision: '120ft',
  hellishResistance: 'Resistance to fire damage.',
  infernalLegacy: 'Thaumaturgy cantrip. L3: Hellish Rebuke (2d10 fire reaction). L5: Darkness.',
};

export const TIEFLING_VARIANTS = [
  { variant: 'Asmodeus (PHB)', asi: '+2 CHA, +1 INT', spells: 'Thaumaturgy, Hellish Rebuke (3), Darkness (5)', note: 'Default. Good for Warlocks, Sorcerers.' },
  { variant: 'Zariel', asi: '+2 CHA, +1 STR', spells: 'Thaumaturgy, Searing Smite (3), Branding Smite (5)', note: 'Melee Tiefling. Perfect for Paladin.' },
  { variant: 'Levistus', asi: '+2 CHA, +1 CON', spells: 'Ray of Frost, Armor of Agathys (3), Darkness (5)', note: 'Best defensive variant. Free Armor of Agathys.' },
  { variant: 'Glasya', asi: '+2 CHA, +1 DEX', spells: 'Minor Illusion, Disguise Self (3), Invisibility (5)', note: 'Rogue/infiltration build. Stealth + deception.' },
  { variant: 'Dispater', asi: '+2 CHA, +1 DEX', spells: 'Thaumaturgy, Disguise Self (3), Detect Thoughts (5)', note: 'Social encounters. Mind-reading + disguise.' },
  { variant: 'Mammon', asi: '+2 CHA, +1 INT', spells: 'Mage Hand, Tenser\'s Floating Disk (3), Arcane Lock (5)', note: 'Utility focused. Niche.' },
  { variant: 'Baalzebul', asi: '+2 CHA, +1 INT', spells: 'Thaumaturgy, Ray of Sickness (3), Crown of Madness (5)', note: 'Poison themed. Decent for flavor.' },
  { variant: 'Fierna', asi: '+2 CHA, +1 WIS', spells: 'Friends, Charm Person (3), Suggestion (5)', note: 'Social powerhouse. Charm + Suggest.' },
  { variant: 'Feral (SCAG)', asi: '+2 DEX, +1 INT', spells: 'Same as Asmodeus', note: 'DEX build. Good for Rogues. Some DMs don\'t allow.' },
];

export const TIEFLING_BUILDS = [
  { build: 'Zariel Tiefling Paladin', detail: 'STR + CHA. Free Smite spells. Fire resistance for melee tanking.', rating: 'S' },
  { build: 'Levistus Tiefling Warlock', detail: 'CON + CHA. Armor of Agathys stacks with Warlock\'s own cast. Fire + cold covered.', rating: 'S' },
  { build: 'Glasya Tiefling Rogue', detail: 'DEX + CHA. Free Disguise Self + Invisibility. Perfect infiltrator.', rating: 'A' },
  { build: 'Fierna Tiefling Bard', detail: 'WIS + CHA. Free Charm Person + Suggestion. Social encounter dominance.', rating: 'A' },
  { build: 'Asmodeus Tiefling Sorcerer', detail: 'CHA + INT. Hellish Rebuke reaction. Darkness + Devil\'s Sight combo.', rating: 'A' },
];

export function hellishRebukeDamage(spellLevel) {
  const dice = spellLevel + 1; // 2d10 at 1st, +1d10 per level
  return dice * 5.5; // d10 avg
}

export function armorOfAgathysTempHP(spellLevel) {
  return spellLevel * 5; // 5 temp HP per spell level
}
