/**
 * playerPoisonCureGuide.js
 * Player Mode: Poisons, diseases, and curses — prevention and cures
 * Pure JS — no React dependencies.
 */

export const POISON_TYPES = [
  { type: 'Contact', delivery: 'Touch', example: 'Assassin\'s Blood' },
  { type: 'Ingested', delivery: 'Eat/drink', example: 'Midnight Tears, Truth Serum' },
  { type: 'Inhaled', delivery: 'Breathe', example: 'Burnt Othur Fumes' },
  { type: 'Injury', delivery: 'Weapon wound', example: 'Purple Worm Poison, Serpent Venom' },
];

export const NOTABLE_POISONS = [
  { poison: 'Purple Worm Poison', dc: 19, damage: '12d6', cost: '2,000 gp', rating: 'S' },
  { poison: 'Wyvern Poison', dc: 15, damage: '7d6', cost: '1,200 gp', rating: 'A+' },
  { poison: 'Drow Poison', dc: 13, damage: 'Unconscious 1hr', cost: '200 gp', rating: 'A' },
  { poison: 'Midnight Tears', dc: 17, damage: '9d6 (at midnight)', cost: '1,500 gp', rating: 'S' },
  { poison: 'Truth Serum', dc: 11, damage: 'Can\'t lie 1hr', cost: '150 gp', rating: 'A (utility)' },
];

export const PREVENTION_AND_CURES = [
  { method: 'Lesser Restoration (L2)', effect: 'End disease, poison, blindness, deafness, paralysis.', rating: 'S+' },
  { method: 'Greater Restoration (L5)', effect: 'End charm, petrification, curse, ability/HP reduction.', rating: 'S+' },
  { method: 'Remove Curse (L3)', effect: 'End all curses. Break cursed item attunement.', rating: 'S' },
  { method: 'Protection from Poison (L2)', effect: 'Advantage vs poison + neutralize one.', rating: 'S' },
  { method: 'Heroes\' Feast (L6)', effect: 'Immune to poison + fear. 24hr.', rating: 'S+' },
  { method: 'Antitoxin (50gp)', effect: 'Advantage on poison saves. 1hr.', rating: 'A' },
  { method: 'Dwarf Resilience', effect: 'Advantage on poison saves + resistance.', rating: 'A+' },
  { method: 'Paladin L3', effect: 'Immune to disease.', rating: 'S' },
  { method: 'Monk L10', effect: 'Immune to poison AND disease.', rating: 'S' },
];

export const POISON_TIPS = [
  'Lesser Restoration cures most things. Always prepare it.',
  'Dwarves: best anti-poison race. Advantage + resistance.',
  'Heroes\' Feast before poisonous areas = total immunity.',
  'Antitoxin is cheap (50gp). Carry some.',
  'Purple Worm Poison (12d6) is worth the 2,000gp investment.',
  'Remove Curse breaks attunement to cursed items.',
  'Paladin L3 immune to disease. Monk L10 immune to poison + disease.',
];
