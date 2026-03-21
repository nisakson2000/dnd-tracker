/**
 * playerCombatAwareness.js
 * Player Mode: Situational awareness indicators and threat assessment
 * Pure JS — no React dependencies.
 */

export const THREAT_INDICATORS = [
  { indicator: 'Enemy is casting a spell', threat: 'High', response: 'Counterspell if possible. Ready action to interrupt. Focus them down.', color: '#f44336' },
  { indicator: 'Multiple enemies surrounding an ally', threat: 'High', response: 'AoE to clear. Thunderwave/Shatter. Shove enemies away. Healing Word if ally drops.', color: '#f44336' },
  { indicator: 'Enemy retreating/fleeing', threat: 'Low', response: 'Opportunity attack. Don\'t chase into unknown territory. Could be leading you to ambush.', color: '#4caf50' },
  { indicator: 'Reinforcements arriving', threat: 'Critical', response: 'Block the entrance. AoE the arrival point. Consider retreat.', color: '#9c27b0' },
  { indicator: 'Enemy buffing allies', threat: 'Medium', response: 'Kill the buffer or Dispel Magic. Don\'t let them stack buffs.', color: '#ff9800' },
  { indicator: 'Environmental hazard active', threat: 'Medium', response: 'Reposition. Don\'t stand in the fire/acid/lava. Use the hazard against enemies.', color: '#ff9800' },
  { indicator: 'Party bunched up', threat: 'Medium', response: 'Spread out! Fireball, breath weapons, and AoEs will devastate a clustered party.', color: '#ff9800' },
  { indicator: 'Enemy using hit-and-run', threat: 'Medium', response: 'Ready actions. Sentinel feat. Or ignore and focus achievable targets.', color: '#ffc107' },
  { indicator: 'Boss at low HP', threat: 'Varies', response: 'Focus fire to finish. Beware desperation moves (self-destruct, Power Word Kill).', color: '#ffc107' },
  { indicator: 'Invisible enemy', threat: 'High', response: 'Faerie Fire, See Invisibility, flour/sand, attack with disadvantage at last known location.', color: '#f44336' },
];

export const POSITIONING_AWARENESS = {
  coverTypes: [
    { type: 'Half Cover', acBonus: 2, saveBonus: 2, example: 'Low wall, furniture, another creature' },
    { type: 'Three-Quarters Cover', acBonus: 5, saveBonus: 5, example: 'Arrow slit, thick tree, barricade' },
    { type: 'Full Cover', acBonus: 'Untargetable', saveBonus: 'Untargetable', example: 'Wall, closed door, pillar' },
  ],
  highGround: 'DM may grant advantage on ranged attacks. Always try for elevation.',
  chokepoints: 'Force enemies through narrow spaces. One fighter can hold a doorway.',
  flanking: 'Optional rule: advantage when on opposite sides. Check with DM.',
};

export const COMBAT_AWARENESS_CHECKLIST = [
  'Where are my allies? Who needs help?',
  'Where is the biggest threat? Are we focusing fire?',
  'Am I in AoE danger? Should I spread out?',
  'Do I have cover? Can I move to cover?',
  'Who is concentrating on a spell? Protect them.',
  'Are there environmental features I can use?',
  'How many enemies remain? Is this fight winnable?',
  'Do I have my reaction available? What\'s my plan for it?',
];

export function assessThreat(indicator) {
  return THREAT_INDICATORS.find(t => t.indicator.toLowerCase().includes((indicator || '').toLowerCase())) || null;
}

export function getCoverBonus(coverType) {
  return POSITIONING_AWARENESS.coverTypes.find(c => c.type.toLowerCase().includes((coverType || '').toLowerCase())) || null;
}
