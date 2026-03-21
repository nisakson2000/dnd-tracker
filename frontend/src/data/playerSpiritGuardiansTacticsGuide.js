/**
 * playerSpiritGuardiansTacticsGuide.js
 * Player Mode: Spirit Guardians tactics deep-dive
 * Pure JS — no React dependencies.
 */

export const SG_CORE = {
  spell: 'Spirit Guardians',
  level: 3,
  damage: '3d8 radiant/necrotic per enemy per round',
  area: '15ft radius around you',
  duration: '10 min (concentration)',
  key: 'Damages on entry AND start of enemy turn. Halves speed.',
};

export const SG_BEST_TACTICS = [
  { tactic: 'SG + Dodge', detail: 'Cast SG → Dodge every turn. Enemies take damage passively while having disadvantage to hit you.', rating: 'S' },
  { tactic: 'SG + Spiritual Weapon', detail: 'BA: Spiritual Weapon attack. Action: Dodge/cantrip. Both spells dealing damage.', rating: 'S' },
  { tactic: 'SG in a chokepoint', detail: 'Stand in doorway. Enemies MUST enter your aura. Each one takes 3d8.', rating: 'S' },
  { tactic: 'Forced movement combo', detail: 'Ally Repelling Blasts enemy through your SG aura = extra 3d8 per entry.', rating: 'S' },
  { tactic: 'Upcast for bosses', detail: 'L5 SG = 5d8 per enemy per round. 22.5 avg per creature.', rating: 'A+' },
  { tactic: 'SG + heavy armor', detail: 'Plate + shield + SG = AC 20 damage aura. Walk into enemy groups.', rating: 'A+' },
];

export const SG_DAMAGE_COMPARISON = {
  vsFireball: 'Fireball: 28 avg, once. SG: 13.5/enemy/round × 10 rounds = up to 135 per enemy.',
  vsMoonbeam: 'SG: 15ft radius, passive. Moonbeam: 5ft radius, action to move. SG vastly superior.',
  note: 'SG is the highest sustained DPR spell in the game for groups of enemies.',
};

export const SG_CONCENTRATION_PROTECTION = [
  'Heavy armor + shield (AC 20) = fewer hits.',
  'War Caster: advantage on CON saves.',
  'Resilient (CON): proficiency on saves.',
  'Dodge action: disadvantage on attacks against you.',
  'Shield spell: +5 AC as reaction.',
  'Absorb Elements: halve elemental damage = lower save DC.',
];
