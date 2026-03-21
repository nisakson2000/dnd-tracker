/**
 * playerPartyPositioningGuide.js
 * Player Mode: Party formation, positioning, and marching order tactics
 * Pure JS — no React dependencies.
 */

export const MARCHING_ORDER_ROLES = [
  { position: 'Point (Front)', idealClasses: ['Fighter', 'Paladin', 'Barbarian'], role: 'Highest AC/HP. Triggers traps. First contact.', note: 'High passive Perception preferred. Shield + heavy armor.' },
  { position: 'Second Line', idealClasses: ['Ranger', 'Monk', 'Rogue'], role: 'Scouting support. Ranged + melee flex.', note: 'Can dart forward or fall back. Perception/Investigation.' },
  { position: 'Middle', idealClasses: ['Cleric', 'Bard', 'Druid'], role: 'Healing range to front and back. Concentration spells.', note: 'Protected position. Can buff/heal either direction.' },
  { position: 'Rear Guard', idealClasses: ['Wizard', 'Sorcerer', 'Warlock'], role: 'Ranged damage. Watches behind. AoE coverage.', note: 'Farthest from melee. Passive Perception for rear ambush.' },
];

export const COMBAT_FORMATIONS = [
  {
    name: 'Standard Line',
    formation: 'Frontline melee | backline ranged/casters',
    pros: ['Simple', 'Protects casters', 'Clear fire lanes'],
    cons: ['Vulnerable to flanking', 'AoE hits line'],
    rating: 'A',
  },
  {
    name: 'Phalanx (Tight)',
    formation: 'Tanks shoulder-to-shoulder. Casters directly behind.',
    pros: ['Sentinel/PAM coverage', 'Aura of Protection range', 'Hard to bypass'],
    cons: ['AoE magnet (Fireball)', 'Limited flanking'],
    rating: 'A+',
  },
  {
    name: 'Diamond',
    formation: 'Tank front, 2 flankers mid, caster rear',
    pros: ['360° coverage', 'Hard to surround', 'Flexible'],
    cons: ['Spread thin', 'Harder to coordinate'],
    rating: 'A',
  },
  {
    name: 'Spread (Anti-AoE)',
    formation: 'All members 30+ ft apart',
    pros: ['No AoE hits multiple allies', 'Hard to target group'],
    cons: ['Healing range issues', 'Can\'t support each other', 'Auras wasted'],
    rating: 'B+ (situational)',
  },
  {
    name: 'Bodyguard',
    formation: 'All melee surround one key caster (concentration)',
    pros: ['Protects concentration', 'Sentinel wall', 'Opportunity attacks deter'],
    cons: ['Only works for 1 caster', 'Others exposed'],
    rating: 'S (when protecting key spell)',
  },
];

export const POSITIONING_RULES = {
  threatened: 'Within 5ft of hostile = threatened. Leaving provokes OA.',
  cover: 'Half (+2 AC), three-quarters (+5 AC), full (untargetable).',
  highGround: 'No RAW bonus, but many DMs give advantage or +2.',
  flanking: 'Optional rule: advantage when allies on opposite sides.',
  choke: 'Narrow passages = only 1-2 enemies can engage. Huge advantage.',
};

export const FORMATION_TIPS = [
  'Don\'t cluster: one Fireball (20ft radius) hits everyone within 40ft diameter.',
  'Paladin Aura of Protection: 10ft. Party must stay close enough to benefit.',
  'Sentinel fighter at choke point = enemies can\'t pass.',
  'Put concentration casters behind melee line, not beside it.',
  'Rogue needs an ally within 5ft of target for Sneak Attack. Position accordingly.',
  'Spirit Guardians Cleric should be IN melee, not behind it.',
  'Spread to 30ft+ vs enemy casters with AoE. Cluster vs melee-only enemies.',
  'Marching order: highest passive Perception at front AND back.',
  'Dim light: Darkvision characters lead. Torch-holders in middle.',
  'Flying characters: stay above melee range but within spell/healing range.',
];

export const CHOKEPOINT_TACTICS = [
  { tactic: 'Doorway Block', method: 'Tank in doorframe. Only 1 enemy engages at a time.', rating: 'S' },
  { tactic: 'Hallway Funnel', method: 'Tank + Sentinel in 5ft hall. AoE behind into crowd.', rating: 'S+' },
  { tactic: 'Bridge Defense', method: 'Single file enemies. Ranged picks them off.', rating: 'S' },
  { tactic: 'Wall Spell Split', method: 'Wall of Force/Fire splits room. Fight half.', rating: 'S+' },
  { tactic: 'Spike Growth Funnel', method: 'Spike Growth in corridor. Enemies take 2d4/5ft.', rating: 'S' },
];
