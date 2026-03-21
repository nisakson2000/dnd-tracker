/**
 * playerGithzeraiGuide.js
 * Player Mode: Githzerai race guide — the psychic monk
 * Pure JS — no React dependencies.
 */

export const GITHZERAI_BASICS = {
  race: 'Githzerai',
  source: 'Mordenkainen\'s Tome of Foes / MotM',
  size: 'Medium',
  speed: '30ft',
  asi: '+2 WIS, +1 INT (original) or flexible (MotM)',
  theme: 'Disciplined psychic monks from Limbo. Mental fortitude and free Shield spell.',
  note: 'Best defensive race for casters. Free Shield spell (PB/LR in MotM) + advantage on charm/frighten saves. Psychic resistance.',
};

export const GITHZERAI_TRAITS_ORIGINAL = [
  { trait: 'Mental Discipline', effect: 'Advantage on saves vs charmed and frightened.', note: 'Two of the most debilitating conditions — advantage against both.' },
  { trait: 'Githzerai Psionics', effect: 'Mage Hand (invisible). Lv 3: Shield once/LR. Lv 5: Detect Thoughts once/LR. WIS spellcasting.', note: 'Free Shield spell once per day. Shield is the best reaction spell in the game.' },
];

export const GITHZERAI_TRAITS_MOTM = [
  { trait: 'Githzerai Psionics (MotM)', effect: 'Mage Hand (invisible, PB/LR). Lv 3: Shield (no components, PB/LR). Lv 5: Detect Thoughts (no components, PB/LR).', note: 'PB uses of Shield per long rest! 2-6 free Shields per day. Incredible.' },
  { trait: 'Mental Discipline', effect: 'Advantage on saves vs charmed and frightened.', note: 'Same as original. Great defense.' },
  { trait: 'Psychic Resilience', effect: 'Resistance to psychic damage.', note: 'MotM added this. Nice bonus.' },
];

export const GITHZERAI_BUILDS = [
  { build: 'Githzerai Druid', detail: '+2 WIS. Free Shield (PB/LR) on a class that normally can\'t cast Shield. Massive AC spike.', rating: 'S', note: 'Druids have no Shield access normally. Free PB uses per day is game-changing.' },
  { build: 'Githzerai Cleric', detail: '+2 WIS. Free Shield stacks with heavy armor. 23+ AC on reaction.', rating: 'S' },
  { build: 'Githzerai Monk', detail: '+2 WIS. Shield + Unarmored Defense. Already high AC, Shield spikes it further.', rating: 'A' },
  { build: 'Githzerai Ranger', detail: '+2 WIS. Shield for AC, charm/frighten advantage, Detect Thoughts for tracking.', rating: 'A' },
  { build: 'Githzerai Wizard', detail: 'Wizard already has Shield. But free casts save spell slots. Advantage on mental saves covers weaknesses.', rating: 'A' },
];

export const GITHZERAI_SHIELD_ANALYSIS = {
  motmUsesAtLevel5: 3, // PB 3
  motmUsesAtLevel9: 4,
  motmUsesAtLevel13: 5,
  motmUsesAtLevel17: 6,
  acBoost: 5, // +5 AC until start of next turn
  note: 'Free Shield is worth about 1-2 spell slots per use. At PB 6: 6 free Shields = equivalent of 6 first-level slots saved.',
  bestFor: 'Classes without Shield: Druids, Rangers, Barbarians, Monks, Bards.',
};

export function githzeraiShieldAC(baseAC) {
  return baseAC + 5;
}

export function shieldUses(proficiencyBonus, isMotM = true) {
  return isMotM ? proficiencyBonus : 1;
}
