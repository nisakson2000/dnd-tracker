/**
 * playerBattlefieldAwareness.js
 * Player Mode: Reading the battlefield, threat assessment, and situational awareness
 * Pure JS — no React dependencies.
 */

export const THREAT_ASSESSMENT = {
  description: 'Quickly evaluate enemies to prioritize targets.',
  indicators: [
    { indicator: 'Spellcaster (robes, staff, components)', threat: 'S', action: 'Highest priority. Kill or disable before they cast devastating spells.' },
    { indicator: 'Healer/support', threat: 'S', action: 'Second priority. They undo your damage. Remove them early.' },
    { indicator: 'Ranged attackers', threat: 'A', action: 'They hit your backline. Send someone to engage them or use cover.' },
    { indicator: 'Big brute (large, armored)', threat: 'A', action: 'Dangerous but predictable. Tank can handle them. Focus fire if AC is low.' },
    { indicator: 'Swarm of minions', threat: 'B', action: 'AoE to clear. Individually weak but action economy is dangerous in numbers.' },
    { indicator: 'Commander/leader', threat: 'A', action: 'Often buffs others. Killing the leader may cause morale break or end buffs.' },
    { indicator: 'Flying enemies', threat: 'A', action: 'Melee can\'t reach them. Ranged/spell priority. Ground them if possible.' },
    { indicator: 'Invisible/hidden enemies', threat: 'S', action: 'Faerie Fire, See Invisibility, or AoE to reveal. Can\'t fight what you can\'t see.' },
  ],
};

export const BATTLEFIELD_READING = [
  { element: 'Cover positions', question: 'Where can I get +2 or +5 AC? Walls, pillars, overturned tables.', impact: 'High for ranged characters' },
  { element: 'Chokepoints', question: 'Are there doorways, bridges, or narrow passages to funnel enemies?', impact: 'High for tanks and AoE' },
  { element: 'Elevation', question: 'Can I get to high ground? Balconies, rooftops, cliffs.', impact: 'Medium — DM may grant advantage' },
  { element: 'Difficult terrain', question: 'Where is movement restricted? Rubble, ice, undergrowth, water.', impact: 'High for positioning' },
  { element: 'Environmental hazards', question: 'Fire, pits, cliffs, water, lava. Can I push enemies into them?', impact: 'High if present' },
  { element: 'Escape routes', question: 'If we need to retreat, where do we go? Can enemies cut us off?', impact: 'Critical for survival' },
  { element: 'Ally positions', question: 'Where are my allies? Am I in healing range? Am I blocking line of sight?', impact: 'High always' },
  { element: 'Light conditions', question: 'Is it dark? Dim? Bright? Darkvision only helps with darkness → dim light.', impact: 'Medium — affects advantage/disadvantage' },
];

export const FOCUS_FIRE_STRATEGY = {
  description: 'Concentrating attacks on one target is almost always better than spreading damage.',
  why: [
    'A dead enemy deals 0 damage. An injured enemy deals full damage.',
    '3 allies hitting one enemy = 1 dead enemy. 3 allies hitting 3 enemies = 3 injured enemies still attacking.',
    'Exception: AoE spells that hit multiple enemies are worth spreading damage.',
  ],
  protocol: [
    'Call out a target. "Focus the caster" or "Everyone hit the big one."',
    'Start with the most dangerous enemy (usually casters/healers).',
    'If a target is almost dead, finish it off even if it\'s not the highest threat.',
    'Track enemy HP loosely: "bloodied" = below half, "badly hurt" = below quarter.',
  ],
};

export const ENEMY_TELLS = [
  { behavior: 'Casting a spell with verbal/somatic components', meaning: 'Counterspell opportunity. Ready your reaction.', response: 'Counterspell if devastating, or prepare to break concentration.' },
  { behavior: 'Moving to a specific position', meaning: 'May be setting up AoE, flanking, or reaching your backline.', response: 'Intercept with OA, Sentinel, or repositioning.' },
  { behavior: 'Using a legendary action', meaning: 'Boss-tier creature. Expects legendary resistance too.', response: 'Burn LR with cheap spells. Save big spells for after LR is gone.' },
  { behavior: 'Retreating or disengaging', meaning: 'Getting reinforcements, using ranged attacks, or fleeing.', response: 'Pursue if safe, or prepare for phase 2.' },
  { behavior: 'Targeting the healer specifically', meaning: 'Smart enemy. Knows healers keep the party alive.', response: 'Protect the healer. Bodyguard, Shield, or kill the attacker.' },
  { behavior: 'Ignoring the tank', meaning: 'Smart enemy bypassing the frontline.', response: 'Tank needs Compelled Duel, Sentinel, or repositioning.' },
];

export const COMMUNICATION_CALLOUTS = [
  { callout: '"Focus fire on [target]"', when: 'Start of combat or when priority shifts', purpose: 'Coordinate damage for fastest kills.' },
  { callout: '"I\'m going down next hit"', when: 'HP is critical', purpose: 'Alert healer to prepare Healing Word.' },
  { callout: '"Caster in the back"', when: 'Enemy caster spotted', purpose: 'Prioritize the caster target.' },
  { callout: '"I\'m concentrating on [spell]"', when: 'Maintaining a key spell', purpose: 'Allies know to protect you from damage.' },
  { callout: '"Save your reaction"', when: 'Expecting a counterspell opportunity', purpose: 'Don\'t waste reaction on OA.' },
  { callout: '"Spread out"', when: 'Enemy has AoE', purpose: 'Minimize targets hit by Fireball/breath weapon.' },
  { callout: '"Don\'t break my [spell]"', when: 'An ally might attack a Hypnotic Pattern target', purpose: 'Remind allies that damage breaks charm/sleep.' },
  { callout: '"It\'s bloodied"', when: 'Enemy is below half HP', purpose: 'Encourage focus fire to finish it.' },
];

export function assessThreatLevel(enemyCount, enemyTypes, partySize) {
  const typeWeights = { caster: 3, healer: 3, ranged: 2, brute: 2, minion: 0.5 };
  const threatScore = enemyTypes.reduce((sum, type) => sum + (typeWeights[type] || 1), 0);
  const ratio = threatScore / partySize;

  if (ratio >= 3) return { level: 'Deadly', recommendation: 'Nova everything. Use your best resources.' };
  if (ratio >= 2) return { level: 'Hard', recommendation: 'Serious fight. Use leveled spells and class features.' };
  if (ratio >= 1) return { level: 'Medium', recommendation: 'Standard fight. Conserve high-level resources.' };
  return { level: 'Easy', recommendation: 'Cantrips and basic attacks. Save resources.' };
}

export function suggestTarget(enemies) {
  const priority = ['caster', 'healer', 'ranged', 'commander', 'brute', 'minion'];
  for (const type of priority) {
    const target = enemies.find(e => e.type === type && e.hp > 0);
    if (target) return { target, reason: `${type}s are highest priority. Remove them first.` };
  }
  return { target: enemies[0], reason: 'Attack the nearest enemy.' };
}
