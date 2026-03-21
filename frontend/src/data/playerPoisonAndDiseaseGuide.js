/**
 * playerPoisonAndDiseaseGuide.js
 * Player Mode: Poisons and diseases — types, cures, and offensive poison use
 * Pure JS — no React dependencies.
 */

export const POISON_TYPES = [
  { type: 'Contact', method: 'Touch the substance.', note: 'Surfaces, doorknobs.' },
  { type: 'Ingested', method: 'Eat or drink.', note: 'Slipped into food.' },
  { type: 'Inhaled', method: 'Breathe the substance.', note: 'Gas. Area denial.' },
  { type: 'Injury', method: 'Applied to weapon.', note: 'Most common combat poison.' },
];

export const BUYABLE_POISONS = [
  { name: 'Basic Poison', cost: '100 gp', effect: '1d4 poison. CON DC 10.', rating: 'B' },
  { name: 'Serpent Venom', cost: '200 gp', effect: '3d6 poison. CON DC 11.', rating: 'B+' },
  { name: 'Drow Poison', cost: '200 gp', effect: 'Unconscious 1 hour. CON DC 13.', rating: 'A' },
  { name: 'Wyvern Poison', cost: '1,200 gp', effect: '7d6 poison. CON DC 15.', rating: 'A+' },
  { name: 'Purple Worm Poison', cost: '2,000 gp', effect: '12d6 poison. CON DC 19.', rating: 'S' },
  { name: 'Midnight Tears', cost: '1,500 gp', effect: '9d6 at midnight. CON DC 17.', rating: 'A' },
  { name: 'Torpor', cost: '600 gp', effect: 'Incapacitated 4d6 hours. CON DC 15.', rating: 'A' },
];

export const DISEASE_CURES = [
  { spell: 'Lesser Restoration (L2)', cures: 'Disease, poison, blind, deaf, paralyzed.' },
  { spell: 'Protection from Poison (L2)', cures: 'Neutralize poison + advantage for 1 hour.' },
  { spell: 'Greater Restoration (L5)', cures: 'Exhaustion, charm, petrify, curse, stat reduction.' },
  { spell: 'Heal (L6)', cures: 'Disease, blind, deaf + 70 HP.' },
  { item: 'Antitoxin (50gp)', cures: 'Advantage on poison saves for 1 hour.' },
  { class: 'Paladin Lay on Hands', cures: '5 HP from pool: cure 1 disease or poison.' },
];

export const POISONER_FEAT = {
  stat: '+1 CON',
  effects: [
    'Ignore poison resistance.',
    'Apply poison as BA (instead of action).',
    'Craft potent poison: 2d8 damage, DC 14. 1 hour + 50gp.',
  ],
  rating: 'A',
  note: 'Makes poison viable at higher levels.',
};

export const POISON_DISEASE_TIPS = [
  'Lesser Restoration: primary cure. Always prepared on Cleric/Druid.',
  'Lay on Hands: 5 HP from pool = cure disease/poison. Cheapest.',
  'Purple Worm Poison: 12d6 at DC 19. Best injury poison.',
  'Poisoner feat: ignore resistance + BA application.',
  'Antitoxin (50gp): advantage on poison saves. Buy several.',
  'Drow Poison: knock out for stealth missions.',
  'Apply poison before combat. It takes an action otherwise.',
  'Many undead/constructs are poison immune. Check first.',
  'Ingested poisons: social/stealth tool. Slip into food.',
  'Protection from Poison: preventive + cure in one spell.',
];
