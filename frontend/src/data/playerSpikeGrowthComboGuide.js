/**
 * playerSpikeGrowthComboGuide.js
 * Player Mode: Spike Growth forced movement combos — the blender
 * Pure JS — no React dependencies.
 */

export const SPIKE_GROWTH_BASICS = {
  spell: 'Spike Growth',
  level: 2,
  school: 'Transmutation',
  castingTime: '1 action',
  range: '150ft',
  area: '20ft radius',
  duration: 'Concentration, up to 10 minutes',
  components: 'V, S, M',
  classes: ['Druid', 'Ranger'],
  effect: 'Ground becomes difficult terrain. When a creature MOVES through the area: 2d4 piercing damage per 5ft of movement.',
  note: 'Key word: MOVES. Forced movement (push/pull) triggers the damage. 2d4 per 5ft = devastating when combined with forced movement.',
};

export const SPIKE_GROWTH_FORCED_MOVEMENT_COMBOS = [
  { combo: 'Eldritch Blast + Repelling Blast', pusher: 'Warlock', distance: '10ft per beam', damage: '4d4 per beam (2 segments × 2d4)', totalAtL5: '2 beams × 4d4 = 8d4 (20 avg) + EB damage', rating: 'S', note: 'The most famous combo. At L11: 3 beams × 4d4 = 12d4 (30 avg). At L17: 4 beams × 4d4 = 16d4 (40 avg). Plus normal EB damage.' },
  { combo: 'Thorn Whip', pusher: 'Druid (same caster)', distance: '10ft pull toward you', damage: '4d4 per pull (2 segments)', totalAtL5: '1 pull × 4d4 = 10 avg per turn', rating: 'A', note: 'Same caster can do both. Cast Spike Growth, then Thorn Whip each turn to pull enemy through the spikes.' },
  { combo: 'Shove (Athletics)', pusher: 'Any martial', distance: '5ft push', damage: '2d4 per shove (1 segment)', totalAtL5: '5 avg per shove', rating: 'B', note: 'Only 5ft push. Minimal damage but any martial can do it. Multiple shoves if multiple attacks.' },
  { combo: 'Thunderwave', pusher: 'Any caster with Thunderwave', distance: '10ft push', damage: '4d4 per creature pushed', totalAtL5: '10 avg per creature pushed', rating: 'A', note: 'AoE push. Multiple enemies pushed through spikes simultaneously.' },
  { combo: 'Gust of Wind', pusher: 'Any caster', distance: '15ft push per failed save per turn', damage: '6d4 per push (3 segments)', totalAtL5: '15 avg per turn', rating: 'A', note: 'Sustained push every turn. But uses your concentration (need someone else to hold Spike Growth).' },
  { combo: 'Graviturgy: Gravity Well', pusher: 'Graviturgy Wizard', distance: '5ft per spell', damage: '2d4 per spell cast', totalAtL5: '5 avg per spell', rating: 'A', note: 'Free 5ft push on every damage spell. Passive spike damage on every cast.' },
  { combo: 'Crusher feat', pusher: 'Any martial with bludgeoning', distance: '5ft per hit', damage: '2d4 per hit', totalAtL5: '2 hits × 2d4 = 10 avg per turn', rating: 'A', note: 'Each bludgeoning hit pushes 5ft. Two attacks = two pushes = 4d4 extra damage.' },
];

export const SPIKE_GROWTH_MATH = {
  per5ft: '2d4 (avg 5) piercing damage per 5ft of movement through the area.',
  example10ft: '10ft push through = 4d4 (avg 10) damage.',
  example20ft: '20ft push through = 8d4 (avg 20) damage.',
  example30ft: '30ft push through = 12d4 (avg 30) damage.',
  warlockL17: '4 beams × 10ft push each = 40ft total through spikes = 16d4 (avg 40) + 4d10+20 (EB damage) = ~62 total per turn.',
  note: 'This scales with the amount of forced movement, not spell level. Never needs to be upcast.',
};

export const SPIKE_GROWTH_TIPS = [
  { tip: 'Camouflage', detail: 'Spike Growth is camouflaged and looks like natural terrain. Enemies don\'t know it\'s there until they take damage or make Perception/Investigation check.' },
  { tip: 'Difficult terrain', detail: 'The area is difficult terrain. Enemies voluntarily moving through spend double movement AND take 2d4 per 5ft.' },
  { tip: 'Don\'t forget: walking triggers it too', detail: 'Enemies who walk through take damage normally. Forced movement is bonus — the spell is strong even without combos.' },
  { tip: 'Druid + Warlock party', detail: 'Druid casts Spike Growth. Warlock uses Repelling Blast to push enemies back and forth. Best 2-player combo.' },
];

export function spikeGrowthDamage(feetMovedThrough) {
  const segments = Math.floor(feetMovedThrough / 5);
  return { dice: `${segments * 2}d4`, avg: segments * 5 };
}

export function warlockSpikeGrowthDPR(warlockLevel, targetAC, chaMod) {
  const beams = warlockLevel >= 17 ? 4 : warlockLevel >= 11 ? 3 : warlockLevel >= 5 ? 2 : 1;
  const hitChance = Math.min(0.95, Math.max(0.05, (chaMod + 4 + 21 - targetAC) / 20)); // rough PB+CHA
  const ebDamagePerBeam = 5.5 + chaMod; // 1d10 + CHA (Agonizing Blast)
  const spikeDamagePerBeam = 10; // 4d4 avg per 10ft push
  const totalPerBeam = ebDamagePerBeam + spikeDamagePerBeam;
  return { beams, perBeam: totalPerBeam, dpr: Math.round(beams * hitChance * totalPerBeam * 10) / 10 };
}
