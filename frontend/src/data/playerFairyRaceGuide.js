/**
 * playerFairyRaceGuide.js
 * Player Mode: Fairy — permanent flight + innate spellcasting
 * Pure JS — no React dependencies.
 */

export const FAIRY_BASICS = {
  race: 'Fairy',
  source: 'The Wild Beyond the Witchlight',
  size: 'Small',
  speed: '30 feet',
  flySpeed: '30 feet (no armor restriction)',
  traits: [
    { name: 'Fairy Magic', desc: 'Druidcraft cantrip. Faerie Fire (L1, 1/LR). Enlarge/Reduce (L3, 1/LR). Can also cast with spell slots.' },
    { name: 'Flight', desc: '30ft fly speed. Works in any armor. No restrictions.' },
    { name: 'Fey', desc: 'Creature type is Fey, not Humanoid. Immune to Hold/Charm/Dominate Person.' },
  ],
  asi: '+2/+1 or +1/+1/+1 (MotM flexible)',
  note: 'Permanent flight with no restrictions. Fey type avoids humanoid-targeting spells. Faerie Fire is excellent.',
};

export const FAIRY_FLIGHT_VALUE = {
  combat: [
    'Stay 30ft+ in air: melee enemies can\'t reach you without ranged attacks or flight.',
    'Rain down Eldritch Blast, Fire Bolt, or bow attacks from safety.',
    'No opportunity attacks when you fly out of reach (they can\'t reach you).',
  ],
  exploration: [
    'Fly over pits, traps, difficult terrain.',
    'Scout from above.',
    'Reach high ledges, windows, rooftops.',
  ],
  restrictions: [
    'If knocked prone while flying: you fall.',
    'Gust of Wind, Thunderwave can push you away.',
    'Speed is only 30ft (same as walking). Aarakocra gets 50ft.',
    'Small size: can be carried by medium creatures but can\'t carry them.',
  ],
};

export const FAIRY_CLASS_SYNERGY = [
  { class: 'Warlock (Eldritch Blast)', rating: 'S', reason: 'Fly + EB from 120ft. Completely untouchable by melee. Agonizing Blast + Repelling Blast = push them back.' },
  { class: 'Wizard/Sorcerer', rating: 'S', reason: 'Fly above melee. Cast spells from safety. Faerie Fire + control spells.' },
  { class: 'Cleric', rating: 'A', reason: 'Fly + Spirit Guardians. Float 10ft up = enemies must reach you to take SG damage. Or just avoid melee entirely.' },
  { class: 'Ranger (ranged)', rating: 'A', reason: 'Fly + longbow. Difficult to reach. Faerie Fire for advantage on attacks.' },
  { class: 'Fighter (melee)', rating: 'C', reason: 'Flight is wasted on melee builds. You want to be in melee, not above it.' },
  { class: 'Barbarian', rating: 'D', reason: 'Barbarians need to be in melee. Small size = no Heavy weapons. Anti-synergy.' },
];

export const FEY_TYPE_BENEFITS = [
  { spell: 'Hold Person', level: 2, effect: 'Targets humanoids only. Fairy is Fey. Immune.' },
  { spell: 'Charm Person', level: 1, effect: 'Targets humanoids only. Fairy is Fey. Immune.' },
  { spell: 'Dominate Person', level: 5, effect: 'Targets humanoids only. Fairy is Fey. Immune.' },
  { spell: 'Crown of Madness', level: 2, effect: 'Targets humanoids only. Fairy is Fey. Immune.' },
  { downside: 'Ranger favored enemy', note: 'Rangers with Fey as favored enemy get bonuses against you in PvP.' },
  { downside: 'Protection from Evil and Good', note: 'Wards against Fey. Disadvantage on your attacks against warded creatures.' },
];

export const FAERIE_FIRE_VALUE = {
  spell: 'Faerie Fire',
  level: 1,
  effect: 'DEX save or outlined in light. Advantage on attacks against them. Can\'t be invisible.',
  note: 'One of the best L1 spells. Advantage for the entire party. Counters invisibility. Free cast 1/LR.',
  combos: [
    'Rogue ally: guaranteed advantage = guaranteed Sneak Attack.',
    'GWM/Sharpshooter ally: advantage offsets -5 penalty.',
    'Elven Accuracy ally: advantage becomes super-advantage (3d20).',
  ],
};
