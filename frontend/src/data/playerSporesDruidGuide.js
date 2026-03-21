/**
 * playerSporesDruidGuide.js
 * Player Mode: Circle of Spores Druid optimization
 * Pure JS — no React dependencies.
 */

export const SPORES_BASICS = {
  class: 'Druid (Circle of Spores)',
  theme: 'Melee Druid who uses Wild Shape for combat buffs instead of beast forms.',
  note: 'Uses Wild Shape charges for Symbiotic Entity instead of transforming.',
};

export const SPORES_FEATURES = [
  { feature: 'Halo of Spores', level: 2, effect: 'Reaction: creature within 10ft takes 1d4 necrotic (CON save). Scales: 1d6 (6), 1d8 (10), 1d10 (14).', note: 'Free reaction damage every round. No resource cost.' },
  { feature: 'Symbiotic Entity', level: 2, effect: 'Wild Shape charge: gain 4× Druid level temp HP. Halo of Spores deals double dice. Melee attacks deal +1d6 necrotic.', note: 'L6: 24 temp HP. L10: 40 temp HP. Plus bonus damage on every hit.' },
  { feature: 'Fungal Infestation', level: 6, effect: 'Reaction: when Small/Medium beast/humanoid dies within 10ft, raise it as a zombie with 1 HP.', note: 'Free zombies. They last 1 hour. Stack up minions.' },
  { feature: 'Spreading Spores', level: 10, effect: 'Bonus action: place Halo of Spores in a 10ft cube within 30ft. Lasts 1 minute.', note: 'AoE zone of necrotic damage. Frees up your reaction.' },
  { feature: 'Fungal Body', level: 14, effect: 'Immune to blinded, deafened, frightened, poisoned. Can\'t be critically hit.', note: 'No crits against you = massive survivability boost.' },
];

export const SPORES_TACTICS = [
  { tactic: 'Symbiotic Entity + Shillelagh', detail: 'Shillelagh: WIS to attack/damage with staff (d8). +1d6 necrotic per hit. Full caster who melees.', rating: 'A' },
  { tactic: 'Symbiotic Entity + Spirit Guardians', detail: 'Temp HP keeps you alive in melee. Spirit Guardians deals AoE. Halo adds reaction damage.', rating: 'S' },
  { tactic: 'Zombie army', detail: 'Fungal Infestation raises zombies from dead enemies. Free action economy.', rating: 'A' },
  { tactic: 'Spreading Spores + melee', detail: 'Place spore cloud on enemies. You attack in melee. Double damage zone.', rating: 'A' },
  { tactic: 'Guardian of Nature (Primal Beast)', detail: 'L4 spell: +1d6 force per hit, advantage on STR attacks/saves. Stack with Symbiotic Entity.', rating: 'A' },
];

export const SPORES_VS_MOON = {
  spores: { pros: ['Full spellcasting in "Wild Shape"', 'Reaction damage every round', 'Temp HP is solid', 'Free zombies'], cons: ['Temp HP depletes fast at higher levels', 'No beast form utility (swim, fly, scout)', 'Melee-dependent'] },
  moon: { pros: ['Huge HP from beast forms', 'Elemental forms at L10', 'Better tanking', 'Infinite Wild Shape at L20'], cons: ['Can\'t cast spells in Wild Shape', 'CR-limited forms', 'Boring at mid levels (L5-9)'] },
  verdict: 'Spores for caster-who-melees. Moon for dedicated tank/shapeshifter.',
};

export function symbioticEntityTempHP(druidLevel) {
  return 4 * druidLevel;
}

export function haloOfSporesDamage(druidLevel, isSymbiotic) {
  let dice;
  if (druidLevel >= 14) dice = 10;
  else if (druidLevel >= 10) dice = 8;
  else if (druidLevel >= 6) dice = 6;
  else dice = 4;
  return isSymbiotic ? dice : dice / 2; // avg damage: die/2, doubled if symbiotic uses 2 dice
}
