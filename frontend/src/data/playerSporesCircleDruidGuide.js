/**
 * playerSporesCircleDruidGuide.js
 * Player Mode: Circle of Spores Druid — the fungal zombie commander
 * Pure JS — no React dependencies.
 */

export const SPORES_BASICS = {
  class: 'Druid (Circle of Spores)',
  source: 'Tasha\'s Cauldron of Everything / Guildmasters\' Guide to Ravnica',
  theme: 'Decay is beautiful. Fungal powers. Animate corpses. Melee druid with poison/necrotic.',
  note: 'Uses Wild Shape for Symbiotic Entity (temp HP + extra damage) instead of beast forms. Unique melee druid.',
};

export const SPORES_FEATURES = [
  { feature: 'Halo of Spores', level: 2, effect: 'Reaction: creature within 10ft takes 1d4 necrotic (CON save negates). Scales: 1d6 at L6, 1d8 at L10, 1d10 at L14.', note: 'Free reaction damage every round. No resource cost. Passive DPR boost.' },
  { feature: 'Symbiotic Entity', level: 2, effect: 'Use Wild Shape: gain 4× druid level temp HP. Halo of Spores damage doubles. Melee weapon attacks deal extra 1d6 necrotic.', note: 'At L6: 24 temp HP + 2d6 Halo + 1d6 on melee hits. Melee druid mode activated.', duration: '10 minutes or until temp HP gone' },
  { feature: 'Fungal Infestation', level: 6, effect: 'Reaction when Small/Medium beast or humanoid dies within 10ft: animate as zombie with 1 HP. Lasts 1 hour. WIS mod uses/LR.', note: 'Free zombie minions from combat kills. 1 HP but they absorb hits and get opportunity attacks.' },
  { feature: 'Spreading Spores', level: 10, effect: 'Bonus action: move Halo of Spores to a 10ft cube within 30ft. Creatures entering or starting turn in cube take Halo damage.', note: 'AoE version of Halo. Sets up zones of necrotic damage. Conflicts with Symbiotic Entity if Halo moves.' },
  { feature: 'Fungal Body', level: 14, effect: 'Immune to blinded, deafened, frightened, poisoned. Can\'t be critically hit.', note: 'Five immunities. Crit immunity is huge for a melee character. Amazing capstone.' },
];

export const SPORES_TACTICS = [
  { tactic: 'Symbiotic Entity + Shillelagh', detail: 'Shillelagh (WIS attacks) + Symbiotic Entity (+1d6 necrotic per hit). Full WIS-based melee.', rating: 'S' },
  { tactic: 'Halo every round', detail: 'Reaction Halo of Spores on any enemy within 10ft. Free 1d4-1d10 necrotic. Never waste your reaction.', rating: 'S' },
  { tactic: 'Fungal Infestation army', detail: 'Kill small enemies → animate as 1HP zombies. They absorb hits, trigger opportunity attacks, block movement.', rating: 'A' },
  { tactic: 'Guardian of Nature combo', detail: 'L8: Guardian of Nature (Great Tree form): +10ft reach isn\'t available but advantage on CON saves keeps Symbiotic Entity temp HP up.', rating: 'A' },
  { tactic: 'Spirit Guardians + Halo', detail: 'Multiclass or Magic Initiate: Spirit Guardians + Halo of Spores = double passive AoE.', rating: 'A' },
];

export const SYMBIOTIC_ENTITY_SCALING = [
  { level: 2, tempHP: 8, haloDice: '2d4', meleebonus: '1d6' },
  { level: 4, tempHP: 16, haloDice: '2d4', meleebonus: '1d6' },
  { level: 6, tempHP: 24, haloDice: '2d6', meleebonus: '1d6' },
  { level: 8, tempHP: 32, haloDice: '2d6', meleebonus: '1d6' },
  { level: 10, tempHP: 40, haloDice: '2d8', meleebonus: '1d6' },
  { level: 14, tempHP: 56, haloDice: '2d10', meleebonus: '1d6' },
  { level: 20, tempHP: 80, haloDice: '2d10', meleebonus: '1d6' },
];

export function symbioticEntityTempHP(druidLevel) {
  return druidLevel * 4;
}

export function haloOfSporesDamage(druidLevel, isSymbiotic = false) {
  let die;
  if (druidLevel >= 14) die = 10;
  else if (druidLevel >= 10) die = 8;
  else if (druidLevel >= 6) die = 6;
  else die = 4;
  const diceCount = isSymbiotic ? 2 : 1;
  return diceCount * (die / 2 + 0.5); // avg
}

export function fungalInfestationUses(wisMod) {
  return Math.max(1, wisMod);
}
