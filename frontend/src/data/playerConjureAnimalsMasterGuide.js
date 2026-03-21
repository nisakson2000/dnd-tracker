/**
 * playerConjureAnimalsMasterGuide.js
 * Player Mode: Conjure Animals — the most powerful L3 Druid spell
 * Pure JS — no React dependencies.
 */

export const CONJURE_ANIMALS_BASICS = {
  spell: 'Conjure Animals',
  level: 3,
  castTime: '1 action',
  duration: '1 hour (concentration)',
  classes: ['Druid', 'Ranger'],
  options: [
    { count: 1, maxCR: 2 },
    { count: 2, maxCR: 1 },
    { count: 4, maxCR: '1/2' },
    { count: 8, maxCR: '1/4' },
  ],
  dmChoice: 'RAW: DM chooses what appears. You choose CR bracket. Many DMs let players choose.',
  note: '8 creatures is almost always optimal. Action economy overwhelms.',
};

export const BEST_CR_QUARTER_BEASTS = [
  { beast: 'Elk', hp: 13, attack: '+5, 1d6+3 ram + hooves (charge)', note: 'Charge: prone. Best CR 1/4 damage.' },
  { beast: 'Wolf', hp: 11, attack: '+4, 2d4+2 (pack tactics, prone)', note: 'Pack Tactics + prone combo.' },
  { beast: 'Velociraptor', hp: 10, attack: 'Multiattack (pack tactics)', note: 'Two attacks. Pack Tactics.' },
  { beast: 'Giant Badger', hp: 13, attack: 'Multiattack', note: 'Two attacks. Burrow.' },
];

export const WHY_8_IS_BEST = [
  '8 attacks/round. ~4-5 hits even at +4. Far more damage than 1-2 creatures.',
  '8 wolves: each hit can prone. Advantage stacking is devastating.',
  '88 total HP pool absorbs hits meant for party.',
  'Takes many enemy actions to clear.',
];

export const CONJURE_ANIMALS_PROBLEMS = [
  'DM chooses creatures (RAW). Discuss beforehand.',
  '8 creatures slow combat significantly. Roll all attacks at once.',
  'Concentration loss = all creatures gone.',
  'AoE (Fireball) kills most summoned creatures instantly.',
  'Many tables ban or limit to keep combat manageable.',
];

export function conjureAnimalsDPR(numCreatures, avgDamagePerHit, hitChance) {
  const expectedHits = numCreatures * hitChance;
  const totalDPR = expectedHits * avgDamagePerHit;
  return { hits: Math.round(expectedHits), dpr: Math.round(totalDPR), note: `${numCreatures} creatures × ${avgDamagePerHit} avg = ~${Math.round(totalDPR)} DPR` };
}
