/**
 * playerDruidSpellOptGuide.js
 * Player Mode: Druid spell optimization — best spells by level, preparation strategy
 * Pure JS — no React dependencies.
 */

export const DRUID_SPELL_PRIORITY = [
  {
    level: 'Cantrips',
    mustHave: ['Guidance (+1d4 to ability checks)', 'Produce Flame (ranged attack + light)', 'Thorn Whip (pull 10ft + damage)'],
    situational: ['Shillelagh (melee Druids)', 'Druidcraft (flavor)', 'Mold Earth (utility)'],
  },
  {
    level: '1st',
    mustHave: ['Goodberry (10 berries, 1 HP each, feed unconscious allies)', 'Entangle (AoE restrain, no friendly fire placement)', 'Healing Word (BA ranged heal, revive downed allies)'],
    situational: ['Faerie Fire (advantage granting)', 'Absorb Elements (reaction damage reduction)', 'Fog Cloud (cover/escape)'],
  },
  {
    level: '2nd',
    mustHave: ['Pass without Trace (+10 Stealth for party)', 'Spike Growth (AoE forced movement damage)', 'Moonbeam (AoE, move each turn, forces shapechangers to revert)'],
    situational: ['Heat Metal (devastating vs armored enemies)', 'Summon Beast (Tasha\'s, reliable summon)', 'Lesser Restoration'],
  },
  {
    level: '3rd',
    mustHave: ['Conjure Animals (8 wolves = massive damage)', 'Call Lightning (sustained AoE, outdoor)', 'Dispel Magic'],
    situational: ['Plant Growth (quarter speed, no save)', 'Tidal Wave (AoE + prone)', 'Revivify'],
  },
  {
    level: '4th',
    mustHave: ['Polymorph (Giant Ape, T-Rex)', 'Conjure Woodland Beings (if DM gives Pixies)', 'Guardian of Nature (Great Tree = advantage + extra damage)'],
    situational: ['Ice Storm', 'Wall of Fire', 'Freedom of Movement'],
  },
  {
    level: '5th',
    mustHave: ['Transmute Rock (no save difficult terrain + restrain on failed STR save)', 'Wall of Stone (permanent wall)', 'Greater Restoration'],
    situational: ['Maelstrom', 'Contagion', 'Reincarnate'],
  },
  {
    level: '6th+',
    mustHave: ['Heal (70 HP instant)', 'Transport via Plants (teleportation network)', 'Tsunami/Fire Storm (AoE)'],
    situational: ['Sunbeam', 'Plane Shift', 'Shapechange (L9)'],
  },
];

export const DRUID_CIRCLE_SPELL_SYNERGIES = [
  { circle: 'Shepherd', synergy: 'Conjure Animals + Spirit Totem (Bear: temp HP to summons). Best summoner.', rating: 'S+' },
  { circle: 'Land', synergy: 'Free circle spells (Haste, Lightning Bolt, etc. by terrain). Slot efficient.', rating: 'A+' },
  { circle: 'Moon', synergy: 'Wild Shape is your main feature. Spells are pre-buff + concentration support.', rating: 'S' },
  { circle: 'Stars', synergy: 'Starry Form replaces Wild Shape. Archer (2d8+WIS BA), Chalice (heal when casting), Dragon (concentration).', rating: 'S' },
  { circle: 'Wildfire', synergy: 'Wildfire Spirit: BA 2d6 fire + teleport allies. Enhanced Bonds: +1d8 to fire/healing.', rating: 'S' },
  { circle: 'Spores', synergy: 'Symbiotic Entity: temp HP + extra necrotic damage. Melee focused.', rating: 'A' },
  { circle: 'Dreams', synergy: 'Balm of the Summer Court: BA healing. Hidden Paths: teleport ally.', rating: 'A+' },
];

export const DRUID_SPELL_TIPS = [
  'Goodberry: 1 berry revives an unconscious ally. Always prepare it.',
  'Pass without Trace: +10 Stealth. Party-wide. Best infiltration spell.',
  'Spike Growth + forced movement = 2d4 per 5ft pushed through. Combine with Thorn Whip (pull).',
  'Conjure Animals: 8 wolves with Pack Tactics. Highest DPR summon in 5e.',
  'Heat Metal: no save to end it. Against plate armor, it\'s devastating (drop weapon or take damage).',
  'Druids prepare spells from ENTIRE list. Change daily. Ultimate flexibility.',
  'Healing Word > Cure Wounds. BA + range. Get allies up from 0.',
  'Call Lightning: sustained damage outdoors. 3d10 per round, no new slots.',
  'Plant Growth: quarter speed, no save, not concentration. Incredible area denial.',
  'Polymorph into Giant Ape (157 HP) for emergency tanking.',
];
