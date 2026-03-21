/**
 * playerSavingThrowOptGuide.js
 * Player Mode: Saving throw optimization — proficiencies, boosters, and priorities
 * Pure JS — no React dependencies.
 */

export const SAVE_FREQUENCY = [
  { save: 'DEX', frequency: 'Very High', commonSources: 'Fireball, Lightning Bolt, breath weapons, traps', note: 'Most common damage save. Half damage on success.' },
  { save: 'WIS', frequency: 'Very High', commonSources: 'Hold Person, Hypnotic Pattern, Charm, Fear', note: 'Most dangerous save. Failure = lose your turn or worse.' },
  { save: 'CON', frequency: 'High', commonSources: 'Concentration, poison, Resilient terrain, some spells', note: 'Concentration saves are CON. Critical for casters.' },
  { save: 'STR', frequency: 'Low', commonSources: 'Grapple escape (check), some push effects, few spells', note: 'Rarely targeted by spells. Dump stat for saves.' },
  { save: 'INT', frequency: 'Very Low', commonSources: 'Mind Flayer, Intellect Devourer, Feeblemind, Maze', note: 'Rare but DEVASTATING when it happens.' },
  { save: 'CHA', frequency: 'Low', commonSources: 'Banishment, Zone of Truth, some planar effects', note: 'Banishment is the big one. Usually for extraplanar.' },
];

export const SAVE_TIERS = {
  strong: { saves: ['DEX', 'CON', 'WIS'], note: 'These three are targeted most. Proficiency here matters.' },
  weak: { saves: ['STR', 'INT', 'CHA'], note: 'Rarely targeted. Safe to leave weak (usually).' },
  note: 'Each class starts proficient in one strong + one weak save.',
};

export const SAVE_BOOSTERS = [
  { method: 'Resilient (feat)', effect: '+1 to stat + proficiency in that save.', rating: 'S+', note: 'Best way to add save proficiency. Resilient (CON) or (WIS).' },
  { method: 'Paladin Aura of Protection', effect: '+CHA mod to ALL saves within 10ft.', rating: 'S+ (best in game)', note: '+5 to all saves for entire party. Best defensive aura.' },
  { method: 'Cloak of Protection', effect: '+1 to ALL saves + AC.', rating: 'S', note: 'Uncommon magic item. Requires attunement.' },
  { method: 'Ring of Protection', effect: '+1 to ALL saves + AC.', rating: 'S', note: 'Stack with Cloak for +2 all saves.' },
  { method: 'Bless', effect: '+1d4 to saves and attacks.', rating: 'S', note: 'Concentration. Affects 3 targets. Average +2.5.' },
  { method: 'Lucky (feat)', effect: 'Reroll any d20 3/LR.', rating: 'S+', note: 'Use on failed saves. 3 free rerolls per day.' },
  { method: 'Magic Resistance', effect: 'Advantage on saves vs spells.', rating: 'S+', note: 'Yuan-ti, Satyr, Gnome (INT/WIS/CHA). Extremely powerful.' },
  { method: 'Monk Diamond Soul (L14)', effect: 'Proficiency in ALL saves. Spend Ki to reroll.', rating: 'S+', note: 'Best save feature in the game.' },
  { method: 'Indomitable (Fighter)', effect: 'Reroll failed save 1/LR (2 at L13, 3 at L17).', rating: 'A', note: 'Worse than Lucky but free.' },
  { method: 'Absorb Elements', effect: 'Reaction: resistance to elemental damage (halves damage).', rating: 'S', note: 'Not a save booster but equivalent effect on DEX save damage.' },
];

export const CLASS_SAVE_PROFICIENCIES = [
  { class: 'Barbarian', saves: ['STR', 'CON'], weakness: 'WIS/DEX/INT', fix: 'Resilient (WIS). High CON helps concentration.' },
  { class: 'Bard', saves: ['DEX', 'CHA'], weakness: 'CON/WIS', fix: 'Resilient (CON) for concentration. War Caster alternative.' },
  { class: 'Cleric', saves: ['WIS', 'CHA'], weakness: 'CON/DEX', fix: 'Resilient (CON). Heavy armor helps vs attacks.' },
  { class: 'Druid', saves: ['INT', 'WIS'], weakness: 'CON/DEX', fix: 'Resilient (CON) for Wild Shape concentration.' },
  { class: 'Fighter', saves: ['STR', 'CON'], weakness: 'WIS/DEX', fix: 'Resilient (WIS). Indomitable helps at L9.' },
  { class: 'Monk', saves: ['STR', 'DEX'], weakness: 'WIS (until Diamond Soul)', fix: 'High WIS from class. Diamond Soul at L14 = all proficient.' },
  { class: 'Paladin', saves: ['WIS', 'CHA'], weakness: 'CON/DEX', fix: 'Aura of Protection (+CHA to all) covers weaknesses.' },
  { class: 'Ranger', saves: ['STR', 'DEX'], weakness: 'WIS/CON', fix: 'Resilient (CON) for concentration on Hunter\'s Mark.' },
  { class: 'Rogue', saves: ['DEX', 'INT'], weakness: 'WIS/CON', fix: 'Evasion (L7) = DEX saves take 0 damage on success.' },
  { class: 'Sorcerer', saves: ['CON', 'CHA'], weakness: 'DEX/WIS', fix: 'CON proficiency = great concentration. Resilient (WIS).' },
  { class: 'Warlock', saves: ['WIS', 'CHA'], weakness: 'CON/DEX', fix: 'Resilient (CON) if concentrating.' },
  { class: 'Wizard', saves: ['INT', 'WIS'], weakness: 'CON/DEX', fix: 'Resilient (CON) MANDATORY for concentration.' },
];

export const SAVE_TIPS = [
  'WIS saves are the most dangerous. Failing = charmed, frightened, or incapacitated.',
  'DEX saves are most common. Evasion (Rogue/Monk) makes them trivial.',
  'CON saves: critical for concentration. Resilient (CON) or War Caster.',
  'Paladin Aura of Protection: +CHA to ALL saves in 10ft. Best defensive feature.',
  'Resilient (WIS): every martial should consider this by L8-12.',
  'Lucky: 3 free save rerolls per long rest. Best universal defense.',
  'Gnome Cunning: advantage on INT/WIS/CHA saves vs magic. Incredibly strong.',
  'Bless: +1d4 to saves. Stack with Aura of Protection for unhittable saves.',
  'Don\'t dump WIS below 10. Failed WIS saves lose you entire turns.',
  'Shield doesn\'t help saves. Only AC. Use Absorb Elements for elemental saves.',
];
