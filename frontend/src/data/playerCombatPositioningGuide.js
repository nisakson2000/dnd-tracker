/**
 * playerCombatPositioningGuide.js
 * Player Mode: Combat positioning — where to stand and why it matters
 * Pure JS — no React dependencies.
 */

export const POSITIONING_PRINCIPLES = [
  { principle: 'Frontline / Backline', detail: 'Tanks in front, casters in back. Simple but effective. Protect squishies.', rating: 'S' },
  { principle: 'Cover Usage', detail: 'Fight near walls, pillars, doorways. +2 AC (half) or +5 AC (3/4 cover). Free defense.', rating: 'S' },
  { principle: 'Spread Out', detail: 'Don\'t cluster. AoE spells (Fireball) punish groups. 20ft apart minimum.', rating: 'S+' },
  { principle: 'Control Chokepoints', detail: 'Doorways, bridges, narrow corridors. One tank + Sentinel = impassable.', rating: 'S+' },
  { principle: 'Ranged Elevation', detail: 'High ground for ranged attackers. Harder to reach. DM may grant advantage.', rating: 'A+' },
  { principle: 'Flank Avoidance', detail: 'Don\'t let enemies surround you. Keep your back to a wall if possible.', rating: 'A+' },
  { principle: 'Escape Routes', detail: 'Always know where the exit is. If the fight goes badly, you need to run.', rating: 'A' },
];

export const POSITIONING_BY_ROLE = [
  {
    role: 'Tank / Frontliner',
    position: 'Between enemies and allies. At chokepoints if possible.',
    tips: [
      'Stand in doorways to block enemies. Sentinel = they can\'t pass.',
      'Stay within reach of multiple enemies to threaten OAs.',
      'Don\'t chase enemies. Hold your ground and let them come to you.',
      'Spirit Guardians (Cleric): wade into enemy groups. Damage on approach.',
    ],
  },
  {
    role: 'Ranged DPS',
    position: 'Behind the frontline. 60-120ft from enemies. Near cover.',
    tips: [
      'Stay at max effective range. Enemies waste movement reaching you.',
      'Use half/3/4 cover between attacks. "Duck and shoot."',
      'If enemies close in, use Disengage or Misty Step to reposition.',
      'Sharpshooter: you ignore cover on enemies. Fight near your own cover.',
    ],
  },
  {
    role: 'Caster (Controller)',
    position: 'Behind frontline. 60ft+ from enemies. Near cover. Within 60ft of enemy casters.',
    tips: [
      'Stay within Counterspell range (60ft) of enemy casters.',
      'Don\'t stand near other casters. AoE hits you both.',
      'Position to maximize AoE coverage without hitting allies.',
      'Misty Step is your emergency repositioning tool.',
    ],
  },
  {
    role: 'Healer / Support',
    position: 'Middle of party. Within 60ft of everyone (Healing Word range).',
    tips: [
      'Central position lets you reach any ally with Healing Word.',
      'Stay behind tanks but close enough to reach frontline.',
      'If you\'re a melee healer (Life Cleric), be near the front.',
      'Don\'t be the farthest away. If you go down, no one can reach you.',
    ],
  },
  {
    role: 'Rogue / Skirmisher',
    position: 'Flanks. Behind enemies. Near exits.',
    tips: [
      'Attack from where you have advantage (flanking, Hide).',
      'After attacking, Cunning Action Disengage or Hide.',
      'Don\'t stand next to enemies at end of turn. Hit and run.',
      'Position for Sneak Attack: near an ally or have advantage.',
    ],
  },
];

export const COMMON_POSITIONING_MISTAKES = [
  { mistake: 'Clustering together', consequence: 'One Fireball hits everyone. 8d6 × 4 party members = TPK territory.', fix: 'Spread 20+ feet apart.' },
  { mistake: 'Casters in melee', consequence: 'Concentration saves every hit. Low AC = getting hit often.', fix: 'Stay behind frontline. Use range.' },
  { mistake: 'Ignoring cover', consequence: 'Missing free +2 or +5 AC from walls and obstacles.', fix: 'Always fight near cover.' },
  { mistake: 'Chasing fleeing enemies', consequence: 'Running past other enemies provokes OAs. Overextend.', fix: 'Let ranged deal with runners. Or use Sentinel.' },
  { mistake: 'Not protecting the caster', consequence: 'Enemy rushes past tank to attack squishy Wizard.', fix: 'Sentinel OA stops them. Or position in chokepoint.' },
  { mistake: 'Standing in enemy AoE zone', consequence: 'Dragon breath, boss AoE spells, legendary actions.', fix: 'Spread out. Know the boss\'s AoE range.' },
];

export const POSITIONING_TIPS = [
  'Your position at the START of combat often determines the outcome. Pre-combat positioning matters.',
  'In surprise rounds, positioning before initiative is critical. Scout first.',
  'Cover is the most underused tactical advantage. Fight near walls and pillars.',
  'Spirit Guardians Clerics should be at the FRONT, not the back. They need enemies nearby.',
  'Rogues need adjacency (ally within 5ft of target) for Sneak Attack. Position accordingly.',
  'Counterspell range is 60ft. Know where the enemy caster is and stay within range.',
  'Sentinel tanks should position so enemies MUST pass through them to reach allies.',
  'Flying characters have the best positioning options. Fly is a game-changing spell.',
  'In dungeons, the marching order IS your combat positioning. Set it up correctly.',
  'Misty Step, Dimension Door, and Fly are the best repositioning spells.',
];
