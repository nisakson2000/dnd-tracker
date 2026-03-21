/**
 * playerPeakBuildGuide.js
 * Player Mode: Strongest multiclass builds and optimization combos
 * Pure JS — no React dependencies.
 */

export const TOP_BUILDS = [
  {
    name: 'Sorlock (Sorcerer/Warlock)',
    levels: 'Sorcerer X / Warlock 2-3',
    concept: 'Convert Warlock short-rest slots into Sorcery Points. Quicken Eldritch Blast.',
    why: 'Infinite Sorcery Points via short rests. EB + Agonizing Blast + Quicken = 4-8 beams/turn.',
    rating: 'S',
  },
  {
    name: 'Hexblade Paladin',
    levels: 'Paladin X / Hexblade 1-2',
    concept: 'CHA to attacks (Hexblade), crit-smite, full aura support.',
    why: 'Single-stat (CHA) paladin. Shield spell from Hexblade. Short rest slots for extra smites.',
    rating: 'S',
  },
  {
    name: 'Gloom Stalker / Assassin / Fighter',
    levels: 'Gloom Stalker 5 / Assassin 3 / Fighter 2+',
    concept: 'Surprise round = auto-crit. Action Surge + Dread Ambusher = 6 crit attacks.',
    why: 'Highest single-turn nova damage in the game. Wipes bosses turn 1.',
    rating: 'S',
  },
  {
    name: 'Padlock (Paladin/Warlock)',
    levels: 'Paladin 6-7 / Warlock X',
    concept: 'Aura of Protection + Eldritch Blast fallback + short rest smite slots.',
    why: 'Best saves in the game. CHA to all saves within 10ft. Ranged and melee.',
    rating: 'S',
  },
  {
    name: 'Barbarian Rogue',
    levels: 'Barbarian X / Rogue 1-3',
    concept: 'Reckless Attack = guaranteed advantage = guaranteed Sneak Attack.',
    why: 'Rage damage + Sneak Attack. Advantage on every attack. Danger Sense + Evasion.',
    rating: 'A',
  },
  {
    name: 'Peace Cleric 1 / X',
    levels: 'Peace Cleric 1 / Any X',
    concept: 'Emboldening Bond: +1d4 to attacks/saves/checks for the whole party.',
    why: 'One level gives the entire party permanent Bless-like buff. Best 1-level dip.',
    rating: 'S',
  },
  {
    name: 'Bladesinger',
    levels: 'Bladesinger Wizard X',
    concept: 'Full caster with martial AC and Extra Attack (cantrip + weapon).',
    why: '25+ AC, full Wizard spell list, concentration fortress. Does everything.',
    rating: 'S',
  },
  {
    name: 'Moon Druid',
    levels: 'Moon Druid X',
    concept: 'Wild Shape into CR-appropriate beasts. Huge temp HP pool.',
    why: 'L2-4: CR1 beasts have more HP than you. L10: Elemental forms. L20: infinite Wild Shape.',
    rating: 'S (L2-4, L10, L20)',
  },
  {
    name: 'Fighter / Wizard (War Magic)',
    levels: 'Fighter 11 / War Wizard 2+',
    concept: '3 attacks + Shield/Absorb Elements + INT to initiative + Arcane Deflection.',
    why: 'Martial damage with magical defense. Best gish without sacrificing attacks.',
    rating: 'A',
  },
  {
    name: 'Twilight Cleric',
    levels: 'Twilight Cleric X',
    concept: 'Channel Divinity: 1d6+level temp HP to all allies within 30ft every turn.',
    why: 'Effectively heals 5-15 HP per ally per round. Makes the party nearly unkillable.',
    rating: 'S',
  },
];

export const SINGLE_CLASS_POWER = [
  { level: '1-4', strongest: 'Moon Druid (Wild Shape HP pool), Peace Cleric (Bond)' },
  { level: '5-8', strongest: 'Wizard (Fireball/Hypnotic Pattern), Paladin (Extra Attack + Smite + Aura)' },
  { level: '9-12', strongest: 'Wizard (Wall of Force, Animate Objects), Cleric (Spirit Guardians upcast)' },
  { level: '13-16', strongest: 'Wizard (Forcecage, Simulacrum), Bard (Magical Secrets)' },
  { level: '17-20', strongest: 'Wizard (Wish, True Polymorph), Druid (infinite Wild Shape)' },
];

export const ONE_LEVEL_DIPS = [
  { dip: 'Hexblade 1', gives: 'CHA to attacks, medium armor, shields, Shield spell, Hexblade\'s Curse.', bestFor: 'Paladin, Sorcerer, Bard' },
  { dip: 'Peace Cleric 1', gives: 'Emboldening Bond (+1d4 party-wide), Bless, heavy armor.', bestFor: 'Any class' },
  { dip: 'Fighter 1', gives: 'Heavy armor, CON save proficiency, Fighting Style, Second Wind.', bestFor: 'Wizard, Cleric, Druid' },
  { dip: 'Artificer 1', gives: 'Medium armor, shields, CON save proficiency, Guidance, cure wounds.', bestFor: 'Wizard' },
  { dip: 'Life Cleric 1', gives: 'Heavy armor, +2+spell level to all healing spells.', bestFor: 'Druid (Goodberry = 40 HP for 1st level slot)' },
];

export function novaDamage(attacks, damagePerHit, smiteDice, sneakDice) {
  const smiteAvg = (smiteDice || 0) * 4.5;
  const sneakAvg = (sneakDice || 0) * 3.5;
  return attacks * damagePerHit + smiteAvg + sneakAvg;
}
