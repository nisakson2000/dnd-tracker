/**
 * playerPoisonDiseaseGuide.js
 * Player Mode: Poisons, diseases, and how to deal with them
 * Pure JS — no React dependencies.
 */

export const POISON_TYPES = [
  { type: 'Contact', delivery: 'Touch the poison or poisoned surface', save: 'CON save on contact', note: 'Applied to objects. Doorknobs, weapon coatings.' },
  { type: 'Ingested', delivery: 'Eat or drink the poison', save: 'CON save when consumed', note: 'Must be put in food/drink. Detect with Detect Poison.' },
  { type: 'Inhaled', delivery: 'Breathe poisonous gas/dust', save: 'CON save when breathing it', note: 'Area effect. Holding breath prevents (CON mod minutes).' },
  { type: 'Injury', delivery: 'Applied to weapon, enters through wound', save: 'CON save when hit with coated weapon', note: 'Most common. Coat a weapon before combat.' },
];

export const COMMON_POISONS = [
  { poison: 'Basic Poison (PHB)', cost: '100gp', effect: '1d4 poison damage (CON DC 10)', type: 'Injury', note: 'Only player-accessible poison in PHB. Weak.' },
  { poison: 'Serpent Venom', cost: '200gp', effect: '3d6 poison (CON DC 11)', type: 'Injury', note: 'Common upgrade. Decent early-game.' },
  { poison: 'Purple Worm Poison', cost: '2,000gp', effect: '12d6 poison (CON DC 19)', type: 'Injury', note: 'Best injury poison. Massive damage.' },
  { poison: 'Assassin\'s Blood', cost: '150gp', effect: '1d12 + poisoned 24hrs (CON DC 10)', type: 'Ingested', note: 'For infiltration. Poison a drink.' },
  { poison: 'Midnight Tears', cost: '1,500gp', effect: '9d6 poison at midnight (CON DC 17)', type: 'Ingested', note: 'Delayed. Poison at dinner, kills at midnight.' },
  { poison: 'Pale Tincture', cost: '250gp', effect: '1d6 + poisoned. Repeat save every 24hrs for 7 days.', type: 'Ingested', note: 'Slow death over a week. Hard to cure.' },
];

export const POISON_RESISTANCE_IMMUNITY = [
  { source: 'Dwarf (Dwarven Resilience)', effect: 'Advantage on saves vs poison. Resistance to poison damage.', rating: 'S' },
  { source: 'Yuan-Ti Pureblood', effect: 'Immune to poison damage and poisoned condition.', rating: 'S+' },
  { source: 'Grung', effect: 'Immune to poison damage and poisoned condition.', rating: 'S+' },
  { source: 'Protection from Poison (L2)', effect: 'Neutralize one poison. Advantage on poison saves. Resistance to poison damage. 1 hour.', rating: 'A+' },
  { source: 'Periapt of Proof Against Poison', effect: 'Immune to poison damage and poisoned condition.', rating: 'S' },
  { source: 'Heroes\' Feast (L6)', effect: 'Immune to poison and frightened for 24 hours.', rating: 'S' },
  { source: 'Paladin Aura (L6)', effect: 'Not specific to poison, but +CHA to all saves helps.', rating: 'A' },
];

export const DISEASE_RULES = {
  contraction: 'Various: monster attacks, contaminated water, magical effects.',
  cure: [
    'Lesser Restoration (L2) — cures one disease. Most common solution.',
    'Paladin Lay on Hands (5 HP per disease cured).',
    'Monk Purity of Body (L10) — immune to disease.',
    'Heroes\' Feast (L6) — cures and prevents disease for 24 hours.',
    'Long rest + medicine checks (DM-dependent).',
  ],
  note: 'Diseases in 5e are relatively rare and easily cured. Lesser Restoration handles most.',
};

export const COMMON_DISEASES = [
  { disease: 'Cackle Fever', source: 'Contact with infected', effect: 'Exhaustion. Fits of laughter. Disadvantage on ability checks.', cure: 'Lesser Restoration. Or 3 successful DC 13 CON saves (1/day).' },
  { disease: 'Sewer Plague', source: 'Rat bite, contaminated water', effect: 'Exhaustion. Half HP from resting. Disadvantage on CON/STR checks.', cure: 'Lesser Restoration. Or 3 DC 11 CON saves.' },
  { disease: 'Sight Rot', source: 'Contaminated water', effect: '-1 to attack/ability checks per day until cured. Blindness at -5.', cure: 'Lesser Restoration. Or truesight ointment (expensive).' },
  { disease: 'Mummy Rot', source: 'Mummy attacks', effect: 'Can\'t regain HP. Max HP decreases over time. Dies at 0 max HP.', cure: 'Remove Curse + magic healing within 1 hour of curse.' },
];

export const POISON_USING_TIPS = [
  'Assassin Rogues benefit most from poisons (applied before assassination).',
  'Purple Worm Poison on a Rogue\'s sneak attack = devastating burst.',
  'Coat weapons before combat. Application takes 1 action.',
  'One dose of injury poison coats 1 slashing/piercing weapon or 3 pieces of ammo.',
  'Poisoner feat: halves crafting time, DC 14, ignore poison resistance.',
  'Poisoner\'s Kit proficiency: craft poisons at half cost.',
  'Detect Poison and Disease (L1, ritual): know if food/drink is poisoned. Essential for intrigue campaigns.',
];
