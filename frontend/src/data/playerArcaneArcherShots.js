/**
 * playerArcaneArcherShots.js
 * Player Mode: Arcane Archer shot options reference
 * Pure JS — no React dependencies.
 */

export const ARCANE_SHOTS = [
  { name: 'Banishing Arrow', damage: '2d6 force (4d6 at 18)', save: 'CHA', effect: 'Target banished to Feywild until end of next turn. Incapacitated.', rating: 'A', tip: 'Like a mini-Banishment. Amazing against melee enemies.' },
  { name: 'Beguiling Arrow', damage: '2d6 psychic (4d6 at 18)', save: 'WIS', effect: 'Target charmed by ally within 30ft. Can\'t attack the ally.', rating: 'B', tip: 'Good for protecting squishy party members.' },
  { name: 'Bursting Arrow', damage: '2d6 force (4d6 at 18)', save: 'None', effect: 'All creatures within 10ft of target take damage.', rating: 'A', tip: 'AoE on a Fighter. No save! Great vs groups.' },
  { name: 'Enfeebling Arrow', damage: '2d6 necrotic (4d6 at 18)', save: 'CON', effect: 'Target\'s weapon damage halved until your next turn.', rating: 'B', tip: 'Shut down a heavy-hitting enemy for a round.' },
  { name: 'Grasping Arrow', damage: '2d6 poison (4d6 at 18)', save: 'Athletics check', effect: 'Target takes 2d6 slashing on movement. Speed -10ft. Thorns last 1 min.', rating: 'S', tip: 'Best shot. Persistent damage + movement penalty. Hard to remove.' },
  { name: 'Piercing Arrow', damage: '1d6 piercing (2d6 at 18)', save: 'DEX', effect: 'Shoots through objects/creatures in a 30ft line. Ignores cover.', rating: 'B', tip: 'Hits through walls and full cover. Niche but powerful.' },
  { name: 'Seeking Arrow', damage: '1d6 force (2d6 at 18)', save: 'DEX', effect: 'Arrow seeks target. Ignores cover. Auto-turns corners. 60ft range.', rating: 'A', tip: 'Hit invisible or hidden targets. Can\'t miss (but save for half).' },
  { name: 'Shadow Arrow', damage: '2d6 psychic (4d6 at 18)', save: 'WIS', effect: 'Target can\'t see beyond 5ft until your next turn.', rating: 'A', tip: 'Excellent vs enemy casters. Can\'t target what they can\'t see.' },
];

export const ARCANE_ARCHER_RULES = {
  uses: '2 per short rest (at all levels).',
  learn: 'Know 2 shots at 3rd level. Learn 1 more at 7th, 10th, 15th, 18th.',
  timing: 'Declare AFTER the attack hits (like Smite).',
  scaling: 'Damage dice double at 18th level.',
  note: 'Only works with shortbows and longbows. Not crossbows.',
};

export function getShotInfo(name) {
  return ARCANE_SHOTS.find(s => s.name.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function getTopShots() {
  return ARCANE_SHOTS.filter(s => s.rating === 'S' || s.rating === 'A');
}
