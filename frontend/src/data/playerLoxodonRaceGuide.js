/**
 * playerLoxodonRaceGuide.js
 * Player Mode: Loxodon — natural armor + trunk utility
 * Pure JS — no React dependencies.
 */

export const LOXODON_BASICS = {
  race: 'Loxodon',
  source: 'Guildmasters\' Guide to Ravnica',
  size: 'Medium',
  speed: '30 feet',
  traits: [
    { name: 'Natural Armor', desc: 'AC = 12 + CON modifier (no armor needed). Can use shield.' },
    { name: 'Trunk', desc: 'Prehensile trunk. Lift/carry small objects. Simple tasks. Cannot wield weapons or shields. Provides touch-range grapples at 5ft extra reach.' },
    { name: 'Keen Smell', desc: 'Advantage on Perception, Investigation, and Survival checks that rely on smell.' },
    { name: 'Loxodon Serenity', desc: 'Advantage on saving throws against charmed and frightened.' },
  ],
  asi: '+2 CON / +1 WIS (legacy)',
  note: 'Natural Armor scales with CON, not DEX. Unique AC formula perfect for STR/CON/WIS builds.',
};

export const LOXODON_AC_TABLE = [
  { con: 14, mod: 2, ac: 14, withShield: 16, note: 'Starting CON 14. Comparable to studded leather.' },
  { con: 16, mod: 3, ac: 15, withShield: 17, note: 'CON 16. Equals breastplate + DEX 2.' },
  { con: 18, mod: 4, ac: 16, withShield: 18, note: 'CON 18. Equals half plate.' },
  { con: 20, mod: 5, ac: 17, withShield: 19, note: 'CON 20. Matches splint armor. With shield: near plate.' },
  { con: 24, mod: 7, ac: 19, withShield: 21, note: 'Theoretical (Barbarian L20 or items). AC 21 with shield.' },
];

export const LOXODON_CLASS_SYNERGY = [
  { class: 'Cleric', rating: 'S', reason: 'WIS for casting. CON for AC and concentration. Natural Armor + Shield = AC 17-19 without heavy armor. Charm/fear advantage.' },
  { class: 'Druid', rating: 'S', reason: 'No metal armor restriction solved. CON-based AC works perfectly. +2 CON/+1 WIS ideal for Druids.' },
  { class: 'Monk', rating: 'B', reason: 'Monk AC = 10+DEX+WIS. Loxodon = 12+CON. Use whichever is higher. Good at low DEX/WIS.' },
  { class: 'Barbarian', rating: 'A', reason: 'Barb AC = 10+DEX+CON. Loxodon = 12+CON. Loxodon formula is better when DEX < 12. Dump DEX, stack CON.' },
  { class: 'Wizard/Sorcerer', rating: 'B', reason: 'CON-based AC means dump DEX. 12+CON > Mage Armor at CON 14+. Niche but functional.' },
  { class: 'Fighter', rating: 'C', reason: 'Heavy armor is better. Loxodon AC caps lower than plate+shield.' },
];

export const TRUNK_USES = [
  'Hold a torch while both hands wield weapon + shield.',
  'Carry potions/small items for quick access.',
  'Manipulate objects (open doors, pull levers) while hands are full.',
  'Grapple at 10ft reach (trunk provides 5ft extra for grapples specifically).',
  'Interact with objects during combat without using object interaction.',
];

export function loxodonAC(conMod, hasShield) {
  const base = 12 + conMod;
  const total = hasShield ? base + 2 : base;
  return { ac: total, note: `Loxodon AC: 12 + ${conMod} CON${hasShield ? ' + 2 shield' : ''} = ${total}` };
}
