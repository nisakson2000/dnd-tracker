/**
 * playerPartyFormation.js
 * Player Mode: Marching order and party formation for exploration
 * Pure JS — no React dependencies.
 */

export const MARCHING_ORDER_TEMPLATES = [
  {
    name: 'Standard Dungeon',
    formation: ['Scout (Rogue/Ranger)', 'Tank (Fighter/Paladin)', 'Support (Cleric/Bard)', 'Caster (Wizard/Sorcerer)'],
    width: 'Single File (5ft corridors)',
    pros: 'Scout finds traps, Tank takes first hit, Casters protected in back.',
    cons: 'Long line. Back can be ambushed. Hard to help the front.',
  },
  {
    name: 'Double File',
    formation: ['Tank + Scout (front)', 'Support + Caster (back)'],
    width: '10ft wide (2 abreast)',
    pros: 'Shorter line. Front pair can both act. Better communication.',
    cons: 'Requires 10ft wide passages. Both front members get targeted.',
  },
  {
    name: 'Diamond Formation',
    formation: ['Scout (point)', 'Melee (left)', 'Melee (right)', 'Caster (rear)'],
    width: 'Open area (15ft+ wide)',
    pros: '360° coverage. Hard to surprise. Good open-area formation.',
    cons: 'Center is empty. Requires open terrain.',
  },
  {
    name: 'Protective Box',
    formation: ['Tank (front)', 'Melee (left)', 'Melee (right)', 'PROTECTED VIP (center)', 'Rearguard (back)'],
    width: '15ft wide',
    pros: 'VIP (healer, quest NPC, squishy caster) is protected on all sides.',
    cons: 'Slow movement. Requires 5 or more party members.',
  },
];

export const POSITION_RESPONSIBILITIES = {
  point: {
    role: 'Point / Scout',
    distance: '30-60ft ahead of party',
    skills: ['Stealth', 'Perception', 'Thieves\' Tools'],
    duties: ['Check for traps', 'Scout rooms before entering', 'Signal the party'],
    bestClasses: ['Rogue', 'Ranger', 'Monk'],
  },
  front: {
    role: 'Front Line / Tank',
    distance: 'At the front of the main group',
    skills: ['Athletics', 'Perception'],
    duties: ['Take the first hit', 'Block narrow passages', 'Engage immediately'],
    bestClasses: ['Fighter', 'Paladin', 'Barbarian'],
  },
  middle: {
    role: 'Middle / Support',
    distance: 'Center of the group',
    skills: ['Medicine', 'Arcana', 'Religion'],
    duties: ['Heal the front line', 'Provide ranged support', 'Identify items/effects'],
    bestClasses: ['Cleric', 'Druid', 'Bard'],
  },
  rear: {
    role: 'Rear Guard',
    distance: 'At the back of the main group',
    skills: ['Perception', 'Stealth'],
    duties: ['Watch for followers', 'Protect the retreat', 'Cover the party\'s back'],
    bestClasses: ['Ranger', 'Fighter', 'Monk'],
  },
};

export function suggestPosition(className) {
  for (const [position, info] of Object.entries(POSITION_RESPONSIBILITIES)) {
    if (info.bestClasses.some(c => c.toLowerCase() === (className || '').toLowerCase())) {
      return { position, ...info };
    }
  }
  return { position: 'middle', ...POSITION_RESPONSIBILITIES.middle };
}

export function createMarchingOrder(partyMembers) {
  return partyMembers.map((member, index) => ({
    ...member,
    position: index === 0 ? 'point' : index < partyMembers.length - 1 ? 'middle' : 'rear',
    order: index + 1,
  }));
}
