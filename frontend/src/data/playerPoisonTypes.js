/**
 * playerPoisonTypes.js
 * Player Mode: Poison types, effects, and crafting
 * Pure JS — no React dependencies.
 */

export const POISON_TYPES = [
  { type: 'Contact', delivery: 'Touch or skin contact', onset: 'Immediate', note: 'Applied to surfaces — doors, weapons, objects.' },
  { type: 'Ingested', delivery: 'Eaten or drunk', onset: 'Usually 1d6-4d6 minutes', note: 'Slip into food/drink. Often delayed onset.' },
  { type: 'Inhaled', delivery: 'Breathe gas/dust', onset: 'Immediate', note: 'Typically fills a 5ft cube. Hold breath to avoid (but not indefinitely).' },
  { type: 'Injury', delivery: 'Wound (weapon/trap)', onset: 'Immediate on hit', note: 'Applied to weapons/ammunition. One use per application.' },
];

export const COMMON_POISONS = [
  { name: 'Basic Poison', cost: '100 gp', type: 'Injury', effect: '1d4 poison damage. DC 10 CON save.', duration: '1 minute (dry after)' },
  { name: 'Assassin\'s Blood', cost: '150 gp', type: 'Ingested', effect: 'DC 10 CON or 1d12 poison + poisoned 24h. Save = 1d6 only.' },
  { name: 'Burnt Othur Fumes', cost: '500 gp', type: 'Inhaled', effect: 'DC 13 CON or 3d6 poison. Must repeat save each turn. 3 saves = end.' },
  { name: 'Crawler Mucus', cost: '200 gp', type: 'Contact', effect: 'DC 13 CON or poisoned + paralyzed. Repeat save each turn.' },
  { name: 'Drow Poison', cost: '200 gp', type: 'Injury', effect: 'DC 13 CON or poisoned + unconscious 1 hour. Wake on damage or action to wake.' },
  { name: 'Essence of Ether', cost: '300 gp', type: 'Inhaled', effect: 'DC 15 CON or poisoned + unconscious 8 hours. Wake on damage or action.' },
  { name: 'Malice', cost: '250 gp', type: 'Inhaled', effect: 'DC 15 CON or poisoned + blinded. Repeat save each turn.' },
  { name: 'Midnight Tears', cost: '1,500 gp', type: 'Ingested', effect: 'No effect until midnight. Then DC 17 CON or 9d6 poison. Save = half.' },
  { name: 'Pale Tincture', cost: '250 gp', type: 'Ingested', effect: 'DC 16 CON or 1d6 poison + poisoned. Repeat every 24h, taking 1d6 each fail. 7 saves = end.' },
  { name: 'Purple Worm Poison', cost: '2,000 gp', type: 'Injury', effect: 'DC 19 CON or 12d6 poison. Save = half.' },
  { name: 'Serpent Venom', cost: '200 gp', type: 'Injury', effect: 'DC 11 CON or 3d6 poison. Save = half.' },
  { name: 'Torpor', cost: '600 gp', type: 'Ingested', effect: 'DC 15 CON or poisoned + incapacitated 4d6 hours.' },
  { name: 'Truth Serum', cost: '150 gp', type: 'Ingested', effect: 'DC 11 CON or poisoned 1 hour. Can\'t knowingly lie.' },
  { name: 'Wyvern Poison', cost: '1,200 gp', type: 'Injury', effect: 'DC 15 CON or 7d6 poison. Save = half.' },
];

export const POISON_CRAFTING = {
  tool: 'Poisoner\'s Kit (50 gp, proficiency required)',
  time: 'Varies by poison complexity (DM discretion)',
  harvestDC: 'DC 20 Nature check to harvest poison from a dead creature (DC varies)',
  harvestRisk: 'Failing the harvest check by 5+ exposes you to the poison.',
  feat: 'Poisoner feat: ignore resistance, +2d8 poison damage coating (1/short rest), craft poisons for half cost/time.',
};

export function getPoisonsByType(type) {
  return COMMON_POISONS.filter(p => p.type.toLowerCase() === (type || '').toLowerCase());
}

export function getPoisonInfo(name) {
  return COMMON_POISONS.find(p => p.name.toLowerCase() === (name || '').toLowerCase()) || null;
}
