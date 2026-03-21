/**
 * playerDamageTypeGuide.js
 * Player Mode: Damage types, common resistances/immunities, and vulnerability reference
 * Pure JS — no React dependencies.
 */

export const DAMAGE_TYPES = [
  { type: 'Acid', color: '#76ff03', icon: '🧪', commonSources: ['Acid Splash', 'Chromatic Orb', 'Black Dragon breath'], commonResistances: ['Oozes', 'Black Dragons'] },
  { type: 'Bludgeoning', color: '#9e9e9e', icon: '🔨', commonSources: ['Mace', 'Quarterstaff', 'Warhammer', 'Fists'], commonResistances: ['Skeletons (vulnerable)', 'Swarms (resistant)'] },
  { type: 'Cold', color: '#81d4fa', icon: '❄️', commonSources: ['Ray of Frost', 'Cone of Cold', 'White Dragon breath'], commonResistances: ['Ice creatures', 'White Dragons', 'Many fiends'] },
  { type: 'Fire', color: '#ff5722', icon: '🔥', commonSources: ['Fireball', 'Fire Bolt', 'Red Dragon breath'], commonResistances: ['Fire Elementals', 'Most fiends', 'Red Dragons'] },
  { type: 'Force', color: '#e040fb', icon: '✨', commonSources: ['Eldritch Blast', 'Magic Missile', 'Spiritual Weapon'], commonResistances: ['Almost nothing resists force damage'] },
  { type: 'Lightning', color: '#ffeb3b', icon: '⚡', commonSources: ['Lightning Bolt', 'Call Lightning', 'Blue Dragon breath'], commonResistances: ['Blue Dragons', 'Shambling Mound (absorbs)'] },
  { type: 'Necrotic', color: '#4a148c', icon: '💀', commonSources: ['Inflict Wounds', 'Hex', 'Chill Touch'], commonResistances: ['Undead (many immune)', 'Shadow creatures'] },
  { type: 'Piercing', color: '#bcaaa4', icon: '🗡️', commonSources: ['Rapier', 'Arrow', 'Spear', 'Bite attacks'], commonResistances: ['Swarms (resistant)'] },
  { type: 'Poison', color: '#69f0ae', icon: '☠️', commonSources: ['Poison Spray', 'Cloudkill', 'Poisoned weapons'], commonResistances: ['Most undead (immune)', 'Most fiends', 'Many constructs'] },
  { type: 'Psychic', color: '#ce93d8', icon: '🧠', commonSources: ['Vicious Mockery', 'Phantasmal Force', 'Mind Blast'], commonResistances: ['Mindless creatures', 'Some constructs'] },
  { type: 'Radiant', color: '#fff176', icon: '☀️', commonSources: ['Guiding Bolt', 'Sacred Flame', 'Divine Smite'], commonResistances: ['Angels (but rarely faced)', 'Very few creatures'] },
  { type: 'Slashing', color: '#a1887f', icon: '⚔️', commonSources: ['Longsword', 'Greataxe', 'Scimitar', 'Claws'], commonResistances: ['Swarms (resistant)', 'Oozes (some)'] },
  { type: 'Thunder', color: '#90caf9', icon: '💥', commonSources: ['Thunderwave', 'Shatter', 'Thunderous Smite'], commonResistances: ['Very few creatures resist thunder'] },
];

export const BEST_DAMAGE_TYPES = [
  { rank: 1, type: 'Force', reason: 'Almost nothing resists it. Eldritch Blast and Magic Missile are reliable.' },
  { rank: 2, type: 'Radiant', reason: 'Very few resistances. Shuts down some undead regeneration.' },
  { rank: 3, type: 'Thunder', reason: 'Rarely resisted. Good AoE options (Shatter, Thunderwave).' },
  { rank: 4, type: 'Psychic', reason: 'Bypasses most physical defenses. Weak against mindless creatures.' },
  { rank: 5, type: 'Fire', reason: 'Most spells deal fire, but also most resisted elemental type.' },
];

export const MAGICAL_WEAPON_RULES = {
  nonmagical: 'Many creatures resist or are immune to nonmagical B/P/S damage.',
  magical: 'Magic weapons bypass nonmagical resistance. This is the most common resistance in the game.',
  silvered: 'Silvered weapons bypass some resistances (werewolves, devils). 100gp to silver a weapon.',
  adamantine: 'Adamantine weapons auto-crit against objects. Adamantine armor negates crits.',
};

export function getDamageTypeInfo(typeName) {
  return DAMAGE_TYPES.find(d => d.type.toLowerCase() === (typeName || '').toLowerCase()) || null;
}

export function getLeastResisted() {
  return BEST_DAMAGE_TYPES.slice(0, 3).map(b => b.type);
}
