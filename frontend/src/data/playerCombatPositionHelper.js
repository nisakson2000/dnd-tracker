/**
 * playerCombatPositionHelper.js
 * Player Mode: Optimal positioning advice by class role
 * Pure JS — no React dependencies.
 */

export const POSITION_BY_ROLE = [
  { role: 'Tank (Fighter/Paladin/Barbarian)', idealPosition: 'Front line, between enemies and allies', distance: '0-5ft from enemies', cover: 'Not needed — you ARE the cover', tips: ['Block doorways and chokepoints', 'Use Sentinel to lock enemies in place', 'Stay within 10ft of Paladin for Aura'] },
  { role: 'Melee DPS (Rogue/Monk)', idealPosition: 'Flanking position, adjacent to ally', distance: '5ft from target', cover: 'Move to cover after attacking (Cunning Action)', tips: ['Position opposite an ally for Sneak Attack', 'Don\'t overextend without escape plan', 'Hit-and-run: attack then Disengage'] },
  { role: 'Ranged DPS (Ranger/Fighter)', idealPosition: 'Behind cover, 30-60ft from enemies', distance: 'Max effective range', cover: 'Half or 3/4 cover', tips: ['Find elevated positions', 'Stay outside of 60ft for enemy Counterspell range', 'Move to new cover if enemies advance'] },
  { role: 'Blaster Caster (Wizard/Sorcerer)', idealPosition: '30-60ft behind front line', distance: 'Spell range, behind allies', cover: '3/4 cover preferred', tips: ['Stay 60ft+ from enemies if possible', 'Position for AoE that avoids allies', 'Have Misty Step ready for escape'] },
  { role: 'Healer (Cleric/Druid/Bard)', idealPosition: 'Middle of formation, 30ft from everyone', distance: 'Within 60ft of all allies (Healing Word range)', cover: 'Moderate cover', tips: ['Stay within healing range of everyone', 'Don\'t be the closest target', 'Spirit Guardians Clerics can be at front'] },
  { role: 'Controller (Wizard/Druid)', idealPosition: 'Safe distance, clear sight lines', distance: '30-60ft from front', cover: 'Behind full cover between spells', tips: ['Need line of sight for most spells', 'Position to split enemy groups with walls', 'Stay out of enemy spellcaster range'] },
];

export const DISTANCE_REFERENCE = {
  '5ft': 'Melee range. Adjacent square.',
  '10ft': 'Polearm reach. 2 squares.',
  '30ft': 'Most movement speeds. 6 squares.',
  '60ft': 'Healing Word max range. Counterspell range. 12 squares.',
  '120ft': 'Eldritch Blast, Fire Bolt range. Longbow short range. 24 squares.',
  '150ft': 'Longbow normal range. 30 squares.',
  '300ft': 'Longbow long range (disadvantage). 60 squares.',
};

export const POSITIONING_MISTAKES = [
  { mistake: 'Standing in a cluster', consequence: 'One Fireball or breath weapon hits everyone.', fix: 'Spread at least 10ft apart.' },
  { mistake: 'Caster at the front', consequence: 'Low HP character gets targeted first.', fix: 'Let tanks absorb initial aggro.' },
  { mistake: 'Back to a wall with no exit', consequence: 'Can\'t retreat if things go wrong.', fix: 'Always have 2 escape routes in mind.' },
  { mistake: 'Fighting in a straight line', consequence: 'Line spells (Lightning Bolt) hit multiple party members.', fix: 'Stagger positions. Don\'t line up.' },
  { mistake: 'Ignoring elevation', consequence: 'Enemies on high ground may get advantage.', fix: 'Take the high ground when possible.' },
];

export function suggestPosition(className) {
  return POSITION_BY_ROLE.find(p =>
    p.role.toLowerCase().includes((className || '').toLowerCase())
  ) || POSITION_BY_ROLE[4]; // default to healer/middle
}
