/**
 * playerFathomlessWarlockGuide.js
 * Player Mode: Fathomless Warlock — tentacles and ocean magic
 * Pure JS — no React dependencies.
 */

export const FATHOMLESS_BASICS = {
  class: 'Warlock (The Fathomless)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Deep sea patron. Tentacle attacks, cold damage, and aquatic power.',
  note: 'Strong sustained damage with Tentacle of the Deeps. Good mix of offense and control.',
};

export const FATHOMLESS_FEATURES = [
  { feature: 'Tentacle of the Deeps', level: 1, effect: 'Bonus action: summon spectral tentacle within 60ft for 1 minute. On summon + bonus action later: melee spell attack, 1d8 cold + 10ft speed reduction. PB/long rest uses.', note: 'Bonus action cold damage + slow. Scales with PB uses. Doesn\'t use concentration.' },
  { feature: 'Gift of the Sea', level: 1, effect: '40ft swim speed. Breathe underwater.', note: 'Permanent aquatic abilities. Niche but great in water campaigns.' },
  { feature: 'Oceanic Soul', level: 6, effect: 'Resistance to cold damage. Communicate with any creature in water (understood but can\'t speak back).', note: 'Cold resistance is solid. Water communication is flavorful.' },
  { feature: 'Guardian Coil', level: 6, effect: 'Reaction: when you or creature within 10ft of tentacle takes damage, reduce damage by 1d8.', note: 'Damage reduction reaction using your tentacle. Scales well.' },
  { feature: 'Grasping Tentacles', level: 10, effect: 'Learn Evard\'s Black Tentacles (doesn\'t count against spells known). Cast once/long rest free. When you cast it, tentacle of the deeps damage = 1d8 + cold, and you can\'t take cold damage from Black Tentacles.', note: 'Free 4th-level AoE restrain. Your tentacle gets stronger.' },
  { feature: 'Fathomless Plunge', level: 14, effect: 'Action: teleport self + up to 5 willing creatures within 30ft to body of water you\'ve seen (up to 1 mile). Once/short rest.', note: 'Party-wide teleportation to any water within a mile. Great escape tool.' },
];

export const FATHOMLESS_TACTICS = [
  { tactic: 'EB + Tentacle combo', detail: 'Action: Eldritch Blast (force damage). Bonus action: Tentacle of the Deeps (1d8 cold + slow). Two damage types per turn.', rating: 'S', note: 'Consistent damage every turn. Tentacle slow helps kiting.' },
  { tactic: 'Hex + Tentacle stacking', detail: 'Hex on target. EB (force + 1d6 necrotic per beam). Tentacle (1d8 cold). Three damage sources.', rating: 'A', note: 'Lots of damage dice. But Hex uses concentration + bonus action competition.' },
  { tactic: 'Guardian Coil protection', detail: 'Park tentacle near squishy ally. Reaction: reduce damage to them by 1d8. Free bodyguard.', rating: 'A' },
  { tactic: 'Black Tentacles + Repelling Blast', detail: 'Cast Evard\'s Black Tentacles. Use EB + Repelling Blast to push enemies into the area. Restrained + damage.', rating: 'S', note: 'Restrained enemies have disadvantage on DEX saves and can\'t escape easily.' },
  { tactic: 'Tentacle + Spike Growth', detail: 'Spike Growth + Repelling Blast pushes. Tentacle slows escape. Massive forced movement damage.', rating: 'A' },
];

export const FATHOMLESS_SPELLS = [
  { level: 1, spells: ['Create or Destroy Water', 'Thunderwave'], note: 'Create water for Gift of the Sea utility.' },
  { level: 2, spells: ['Gust of Wind', 'Silence'], note: 'Gust pushes into Black Tentacles. Silence shuts down casters.' },
  { level: 3, spells: ['Lightning Bolt', 'Sleet Storm'], note: 'Lightning Bolt is straight damage. Sleet Storm is excellent battlefield control.' },
  { level: 4, spells: ['Control Water', 'Evard\'s Black Tentacles'], note: 'Black Tentacles is amazing AoE restrain. You get it free at L10.' },
  { level: 5, spells: ['Bigby\'s Hand', 'Cone of Cold'], note: 'Bigby\'s Hand is the best 5th-level concentration spell for Warlocks.' },
];

export const FATHOMLESS_VS_HEXBLADE = {
  fathomless: { pros: ['Bonus action damage (tentacle)', 'Cold resistance', 'Guardian Coil (damage reduction)', 'Free Black Tentacles', 'Better sustained damage'], cons: ['No medium armor/shields', 'No CHA to attacks', 'Less melee viable'] },
  hexblade: { pros: ['CHA to weapon attacks', 'Medium armor + shields', 'Hexblade\'s Curse (crit on 19)', 'Best multiclass dip'], cons: ['No bonus action damage source', 'Curse is once/rest', 'Less ranged synergy'] },
  verdict: 'Hexblade for melee/multiclass. Fathomless for pure EB + bonus action damage.',
};

export function tentacleDamage(level) {
  return 4.5; // 1d8 cold, flat across levels
}

export function tentacleUses(proficiencyBonus) {
  return proficiencyBonus; // PB uses per long rest
}

export function fathomlessTurnDPR(warlockLevel, chaMod, targetAC) {
  const ebBeams = warlockLevel >= 17 ? 4 : warlockLevel >= 11 ? 3 : warlockLevel >= 5 ? 2 : 1;
  const attackBonus = chaMod + Math.min(6, 2 + Math.floor((warlockLevel + 3) / 4));
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const ebDmg = ebBeams * hitChance * (5.5 + chaMod); // 1d10 + CHA per beam
  const tentacleDmg = hitChance * 4.5; // 1d8 cold
  return ebDmg + tentacleDmg;
}
