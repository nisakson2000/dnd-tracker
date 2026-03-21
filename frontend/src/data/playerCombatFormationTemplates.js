/**
 * playerCombatFormationTemplates.js
 * Player Mode: Pre-built combat formation templates for common scenarios
 * Pure JS — no React dependencies.
 */

export const FORMATION_TEMPLATES = [
  {
    name: 'Standard Line',
    description: 'Tanks front, ranged behind. Classic formation.',
    positions: [
      { role: 'Tank', row: 'Front', spacing: '5ft apart', notes: 'Shoulder to shoulder. Block enemy advance.' },
      { role: 'Melee DPS', row: 'Front (flanks)', spacing: '5ft from tanks', notes: 'Position for flanking when enemies engage tanks.' },
      { role: 'Ranged/Caster', row: 'Back (30-60ft)', spacing: '10ft apart', notes: 'Spread to avoid AoE. Line of sight to front.' },
      { role: 'Healer', row: 'Back-center', spacing: '30ft from front', notes: 'Equal distance to all allies for healing range.' },
    ],
    bestFor: 'Open terrain, defending a position',
    weakness: 'Vulnerable to flanking and AoE on the back line',
  },
  {
    name: 'Diamond',
    description: 'One tank front, one rear. Casters in the middle.',
    positions: [
      { role: 'Point (Tank)', row: 'Front', spacing: 'Leading', notes: 'Draws initial aggro. Takes first contact.' },
      { role: 'Wings (DPS)', row: 'Middle-sides', spacing: '15ft from point', notes: 'React to threats from either side.' },
      { role: 'Center (Caster)', row: 'Middle', spacing: '10ft from wings', notes: 'Protected by all sides. Best for concentration casters.' },
      { role: 'Rear Guard', row: 'Back', spacing: '15ft behind center', notes: 'Watches for ambush. Secondary tank.' },
    ],
    bestFor: 'Unknown territory, dungeon corridors',
    weakness: 'Smaller frontline — one tank can be overwhelmed',
  },
  {
    name: 'Tight Cluster',
    description: 'Everyone within 10ft for aura benefits.',
    positions: [
      { role: 'Paladin (center)', row: 'Center', spacing: 'All within 10ft', notes: 'Aura of Protection covers everyone.' },
      { role: 'All others', row: 'Adjacent', spacing: '5-10ft from center', notes: 'Stay within aura range.' },
    ],
    bestFor: 'Paladin aura, Bless range, Spirit Guardians',
    weakness: 'EXTREMELY vulnerable to AoE (Fireball hits everyone)',
  },
  {
    name: 'Spread Out',
    description: 'Everyone 20+ feet apart. Anti-AoE formation.',
    positions: [
      { role: 'Everyone', row: 'Spread', spacing: '20-30ft apart', notes: 'No AoE can hit more than 1-2 of you. Fireball radius = 20ft.' },
    ],
    bestFor: 'Fighting casters, dragons, or AoE-heavy enemies',
    weakness: 'Can\'t support each other easily. Healing is harder.',
  },
  {
    name: 'Chokepoint Hold',
    description: 'Block a narrow passage. Maximum defense.',
    positions: [
      { role: 'Tank 1', row: 'Doorway/corridor', spacing: 'Blocking passage', notes: 'Only 1-2 enemies can attack at once. Sentinel feat is king here.' },
      { role: 'Polearm (reach)', row: '10ft behind tank', spacing: 'Behind blocker', notes: 'Attack through/over the tank. Polearm Master for opportunity attacks.' },
      { role: 'Ranged', row: '30ft behind', spacing: 'Behind polearm', notes: 'Free shots. Enemies can\'t reach you.' },
      { role: 'Healer', row: 'Behind ranged', spacing: '40ft+ back', notes: 'Heal the tank. Completely safe.' },
    ],
    bestFor: 'Dungeons, defending a room, outnumbered fights',
    weakness: 'If enemies have ranged/AoE, the chokepoint works against you too',
  },
];

export const FORMATION_RULES = [
  'Communicate your formation BEFORE combat starts.',
  'Adjust formation when the situation changes — don\'t be rigid.',
  'If fighting AoE enemies: spread out (20ft+ apart).',
  'If you have a Paladin: cluster within 10ft for Aura of Protection.',
  'Spirit Guardians + frontline formation = enemies take damage just approaching.',
  'Sentinel feat on the chokepoint holder = enemies can\'t pass.',
  'Polearm Master + Sentinel = enemies can\'t even get close.',
];

export function getFormation(name) {
  return FORMATION_TEMPLATES.find(f =>
    f.name.toLowerCase().includes((name || '').toLowerCase())
  ) || null;
}

export function suggestFormation(scenario) {
  const scenarios = {
    'aoe': 'Spread Out',
    'dragon': 'Spread Out',
    'dungeon': 'Diamond',
    'chokepoint': 'Chokepoint Hold',
    'corridor': 'Chokepoint Hold',
    'paladin': 'Tight Cluster',
    'open': 'Standard Line',
    'defend': 'Standard Line',
  };
  const key = Object.keys(scenarios).find(k => (scenario || '').toLowerCase().includes(k));
  return key ? getFormation(scenarios[key]) : getFormation('Standard Line');
}
