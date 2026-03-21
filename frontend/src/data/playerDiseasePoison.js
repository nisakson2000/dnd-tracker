/**
 * playerDiseasePoison.js
 * Player Mode: Common diseases, poisons, and treatment rules
 * Pure JS — no React dependencies.
 */

export const POISON_TYPES = [
  { name: 'Contact', delivery: 'Touch the substance or coated surface.', onset: 'Immediate' },
  { name: 'Ingested', delivery: 'Consume the substance.', onset: 'Usually within minutes' },
  { name: 'Inhaled', delivery: 'Breathe in the substance.', onset: 'Immediate' },
  { name: 'Injury', delivery: 'Applied to weapon; enters bloodstream on hit.', onset: 'On next hit' },
];

export const COMMON_POISONS = [
  { name: 'Basic Poison (vial)', cost: 100, type: 'Injury', dc: 10, effect: '1d4 poison damage (CON save)' },
  { name: 'Assassin\'s Blood', cost: 150, type: 'Ingested', dc: 10, effect: '1d12 poison damage, poisoned 24h' },
  { name: 'Burnt Othur Fumes', cost: 500, type: 'Inhaled', dc: 13, effect: '3d6 poison damage, must repeat save each turn' },
  { name: 'Drow Poison', cost: 200, type: 'Injury', dc: 13, effect: 'Poisoned for 1 hour. Fail by 5+: unconscious' },
  { name: 'Essence of Ether', cost: 300, type: 'Inhaled', dc: 15, effect: 'Poisoned 8 hours. Unconscious until damaged/action to wake' },
  { name: 'Midnight Tears', cost: 1500, type: 'Ingested', dc: 17, effect: 'No effect until midnight. 9d6 poison damage' },
  { name: 'Pale Tincture', cost: 250, type: 'Ingested', dc: 16, effect: '1d6 poison damage + poisoned. Repeat save every 24h (7 saves to end, 2 failures = 3d6 + poisoned)' },
  { name: 'Purple Worm Poison', cost: 2000, type: 'Injury', dc: 19, effect: '12d6 poison damage' },
  { name: 'Torpor', cost: 600, type: 'Ingested', dc: 15, effect: 'Poisoned + incapacitated for 4d6 hours' },
  { name: 'Truth Serum', cost: 150, type: 'Ingested', dc: 11, effect: 'Poisoned 1 hour. Can\'t knowingly lie.' },
  { name: 'Wyvern Poison', cost: 1200, type: 'Injury', dc: 15, effect: '7d6 poison damage' },
];

export const COMMON_DISEASES = [
  { name: 'Cackle Fever', save: 'CON DC 13', onset: '1d4 hours', effect: 'Exhaustion, disadvantage on WIS checks, incapacitated laughing on failed save. 3 saves to cure.' },
  { name: 'Sewer Plague', save: 'CON DC 11', onset: '1d4 days', effect: 'Exhaustion, half healing, no HP recovery from long rest until 3 saves.' },
  { name: 'Sight Rot', save: 'CON DC 15', onset: '1 day', effect: '-1 to Perception/sight checks per day. Blindness at -5. Needs Lesser Restoration or 3 saves with special ointment.' },
];

export const TREATMENT = {
  poison: [
    'Antitoxin (50gp): Advantage on saves vs poison for 1 hour.',
    'Protection from Poison (2nd level): Neutralize one poison.',
    'Lesser Restoration (2nd level): End poisoned condition.',
    'Lay on Hands (Paladin): 5 HP from pool to neutralize one poison.',
  ],
  disease: [
    'Lesser Restoration (2nd level): Cure one disease.',
    'Lay on Hands (Paladin): 5 HP from pool to cure one disease.',
    'Paladin Aura (level 3 Devotion): Immune to disease within 10ft.',
  ],
};

export function getPoisonInfo(name) {
  return COMMON_POISONS.find(p => p.name.toLowerCase().includes(name.toLowerCase())) || null;
}

export function getDiseaseInfo(name) {
  return COMMON_DISEASES.find(d => d.name.toLowerCase().includes(name.toLowerCase())) || null;
}
