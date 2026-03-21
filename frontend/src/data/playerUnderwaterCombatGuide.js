/**
 * playerUnderwaterCombatGuide.js
 * Player Mode: Underwater combat rules and tactics
 * Pure JS — no React dependencies.
 */

export const UNDERWATER_COMBAT_RULES = {
  meleePenalty: 'Melee attacks with non-piercing weapons: disadvantage unless creature has swim speed.',
  rangedPenalty: 'Ranged weapon attacks auto-miss beyond normal range. Within normal range: disadvantage (unless crossbow, net, or javelin/trident/dart/spear).',
  exceptedMeleeWeapons: ['Dagger', 'Javelin', 'Shortsword', 'Spear', 'Trident'],
  exceptedRangedWeapons: ['Crossbow (any)', 'Net'],
  swimSpeed: 'Creatures with swim speed: no melee penalties. Still have ranged weapon penalties.',
  note: 'Piercing melee weapons work fine underwater. Slashing/bludgeoning have disadvantage.',
};

export const UNDERWATER_MOVEMENT = {
  swimming: 'Without swim speed: each foot costs 1 extra foot (like difficult terrain) unless you have swim speed.',
  sinking: 'Heavy armor: you sink. Medium armor: DM discretion. Light armor: you can swim.',
  holding_breath: 'Hold breath: 1 + CON mod minutes (minimum 30 seconds). Suffocating: 0 HP after CON mod rounds (min 1).',
  exhaustion: 'Swimming for hours without swim speed may cause exhaustion (DM discretion).',
};

export const UNDERWATER_SPELLCASTING = {
  verbalComponents: 'RAW: you can speak underwater (short phrases). Verbal components work. Some DMs rule otherwise.',
  fireSpells: 'Fire spells: normal unless fully submerged (DM discretion). Commonly ruled: fire spells don\'t work underwater.',
  lightningSpells: 'Lightning spells: VERY effective. Some DMs have them hit all creatures in the water within range.',
  coldSpells: 'Cold spells: normal effectiveness. Thematic underwater.',
  thunderSpells: 'Thunder spells: normal or enhanced (sound travels well in water). DM discretion.',
  bestSpells: ['Lightning Bolt', 'Call Lightning', 'Witch Bolt', 'Tidal Wave', 'Maelstrom', 'Control Water'],
};

export const UNDERWATER_CLASS_RATINGS = [
  { class: 'Druid', rating: 'S', reason: 'Wild Shape into shark/octopus. Water breathing spells. Control Water. Natural underwater caster.' },
  { class: 'Warlock (Fathomless)', rating: 'S', reason: 'Swim speed, water breathing for party, tentacle attacks. Built for water.' },
  { class: 'Monk', rating: 'A', reason: 'Unarmed strikes are bludgeoning (disadvantage), but can use Shortsword. Unarmored Movement swim speed at L9.' },
  { class: 'Ranger', rating: 'A', reason: 'Crossbow works normally. Hunter\'s Mark. Natural Explorer (coast) for water travel.' },
  { class: 'Fighter', rating: 'B', reason: 'Crossbow Fighter works. Melee: need piercing weapons. Heavy armor sinks you.' },
  { class: 'Barbarian', rating: 'C', reason: 'No ranged options. Greatsword has disadvantage. Need to use spear/trident. Rage benefits still work.' },
  { class: 'Wizard/Sorcerer', rating: 'A', reason: 'Lightning spells excel. No fire spells. Control Water, Water Breathing utility.' },
];

export const UNDERWATER_PREP = [
  { prep: 'Water Breathing spell', detail: 'L3 ritual. 24-hour duration. Party-wide. Essential for extended underwater.', priority: 1 },
  { prep: 'Swim speed', detail: 'Potion of Swimming, Alter Self, Wild Shape, racial swim speed, Mariner Fighting Style.', priority: 1 },
  { prep: 'Piercing weapons', detail: 'Switch to daggers, shortswords, spears, tridents, javelins. Avoid slashing/bludgeoning.', priority: 2 },
  { prep: 'Crossbow', detail: 'Only ranged weapon that works normally underwater (within normal range).', priority: 2 },
  { prep: 'Light source', detail: 'Torches don\'t work. Use Light cantrip, Driftglobe, or darkvision.', priority: 3 },
  { prep: 'Communication', detail: 'Speaking is limited. Telepathy, Message cantrip, or hand signals.', priority: 3 },
];

export function breathHoldingMinutes(conMod) {
  return Math.max(0.5, 1 + conMod); // minimum 30 seconds
}

export function suffocationRounds(conMod) {
  return Math.max(1, conMod); // minimum 1 round
}
