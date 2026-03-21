/**
 * playerCombatThreatMap.js
 * Player Mode: Threat mapping and danger zone awareness
 * Pure JS — no React dependencies.
 */

export const THREAT_ZONES = [
  { zone: 'Melee Zone', range: '0-5ft', threats: ['Opportunity attacks when leaving', 'Full melee damage', 'Grapple/shove attempts'], avoidance: 'Disengage action, Cunning Action, or Misty Step to leave safely.' },
  { zone: 'Reach Zone', range: '10ft', threats: ['Polearm attacks', 'Polearm Master OA on entry', 'Whip attacks'], avoidance: 'Enter from the side, not directly. Or use ranged attacks.' },
  { zone: 'Close Range', range: '15-30ft', threats: ['Short-range spells (Burning Hands, Thunderwave)', 'Charge attacks', 'One move to reach you'], avoidance: 'Move back after your turn. Use difficult terrain between you.' },
  { zone: 'Medium Range', range: '30-60ft', threats: ['Most spell ranges', 'Counterspell range (60ft)', 'Breath weapon cones', 'Crossbow range'], avoidance: 'Move beyond 60ft to avoid Counterspell. Use cover.' },
  { zone: 'Long Range', range: '60-120ft', threats: ['Longbow, Fire Bolt', 'Some long-range spells', 'Eldritch Blast'], avoidance: 'Full cover. Most spells can\'t reach here.' },
  { zone: 'Extreme Range', range: '120ft+', threats: ['Very few attacks reach here', 'Spell Sniper + Eldritch Blast (240ft)'], avoidance: 'Almost always safe. Sniper builds only.' },
];

export const DANGER_INDICATORS = [
  { indicator: 'Enemy caster with hands free', danger: 'High', reason: 'Fireball, Hold Person, or worse incoming. Counterspell ready or rush them.' },
  { indicator: 'Multiple enemies surrounding one ally', danger: 'Critical', reason: 'Focus fire on your ally. They\'ll drop fast. Intervene immediately.' },
  { indicator: 'Enemy moving to flank', danger: 'Medium', reason: 'Setting up advantage (if flanking rules). Reposition or intercept.' },
  { indicator: 'Large creature approaching', danger: 'High', reason: 'Multi-attack with high damage. Don\'t let it reach your squishies.' },
  { indicator: 'Enemy retreating behind allies', danger: 'Low-Medium', reason: 'May be casting, healing, or fleeing. Could signal reinforcements.' },
  { indicator: 'New enemies appearing', danger: 'High', reason: 'Reinforcements change action economy. Reassess tactics immediately.' },
  { indicator: 'Enemy concentrating on a spell', danger: 'High', reason: 'The effect is ongoing. Break their concentration with damage.' },
  { indicator: 'Unexplored area in the battlefield', danger: 'Medium', reason: 'Ambush potential. Don\'t turn your back on unexplored areas.' },
];

export const THREAT_ASSESSMENT = {
  actionEconomy: 'Count enemy actions per round. 4 enemies with 1 attack each = 4 attacks. 1 enemy with Multiattack (3) = 3 attacks. More total attacks = more dangerous.',
  damageOutput: 'Estimate enemy damage per round. If they can down a party member in 1-2 rounds, it\'s a high threat.',
  controlAbilities: 'Can they stun, paralyze, charm, or restrain? Control abilities are more dangerous than raw damage.',
  mobilityAdvantage: 'Flying enemies, teleporting enemies, or enemies with higher speed control engagement range.',
};

export const TACTICAL_AWARENESS_CHECKLIST = [
  'Where is the enemy caster? Am I within Counterspell range (60ft)?',
  'Is anyone flanked or surrounded?',
  'Where is the nearest cover?',
  'Are enemies clustered for AoE?',
  'Are my allies clustered for ENEMY AoE?',
  'Which enemy is closest to dropping?',
  'Is anyone concentrating? Is it protected?',
  'Where are the exits? Can we retreat?',
  'Are there environmental hazards (cliffs, fire, water)?',
  'What\'s behind the next door/corner?',
];

export function assessThreatLevel(enemyCount, enemyAverageDamage, partySize, partyAverageHP) {
  const enemyDPR = enemyCount * enemyAverageDamage;
  const roundsToTPK = (partySize * partyAverageHP) / enemyDPR;

  if (roundsToTPK <= 2) return { level: 'Deadly', color: '#9c27b0', advice: 'Consider retreat. Use everything.' };
  if (roundsToTPK <= 4) return { level: 'Hard', color: '#f44336', advice: 'Use class resources freely. Focus fire.' };
  if (roundsToTPK <= 6) return { level: 'Medium', color: '#ff9800', advice: 'Normal combat. Use resources wisely.' };
  return { level: 'Easy', color: '#4caf50', advice: 'Conserve resources. Cantrips and basic attacks.' };
}

export function getZone(distanceFt) {
  return THREAT_ZONES.find(z => {
    const [min, max] = z.range.replace('ft', '').replace('+', '-999').split('-').map(Number);
    return distanceFt >= min && distanceFt <= max;
  }) || THREAT_ZONES[THREAT_ZONES.length - 1];
}
