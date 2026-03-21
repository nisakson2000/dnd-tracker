/**
 * playerMonkKiPoints.js
 * Player Mode: Ki point tracking, abilities, and Monk subclass features
 * Pure JS — no React dependencies.
 */

export const KI_RULES = {
  uses: 'Equal to Monk level.',
  recharge: 'Short or Long Rest + 30 minutes of meditation.',
  saveDC: '8 + proficiency bonus + WIS modifier.',
};

export const KI_ABILITIES = [
  { name: 'Flurry of Blows', cost: 1, action: 'Bonus Action', level: 2, description: 'After Attack action: two unarmed strikes as bonus action.' },
  { name: 'Patient Defense', cost: 1, action: 'Bonus Action', level: 2, description: 'Take the Dodge action as a bonus action.' },
  { name: 'Step of the Wind', cost: 1, action: 'Bonus Action', level: 2, description: 'Take the Disengage or Dash action as a bonus action. Jump distance doubled.' },
  { name: 'Stunning Strike', cost: 1, action: 'On hit', level: 5, description: 'Target makes CON save or is stunned until end of your next turn.' },
  { name: 'Deflect Missiles (catch)', cost: 1, action: 'Part of Reaction', level: 3, description: 'If damage reduced to 0, spend 1 ki to throw it back (ranged attack, monk weapon damage).' },
  { name: 'Slow Fall', cost: 0, action: 'Reaction', level: 4, description: 'Reduce falling damage by 5x monk level. (No ki cost.)' },
  { name: 'Stillness of Mind', cost: 0, action: 'Action', level: 7, description: 'End one charmed or frightened effect on yourself. (No ki cost.)' },
  { name: 'Diamond Soul', cost: 1, action: 'On failed save', level: 14, description: 'Reroll a failed saving throw (spend 1 ki).' },
  { name: 'Empty Body', cost: 4, action: 'Action', level: 18, description: 'Become invisible + resistance to all damage except force for 1 minute.' },
  { name: 'Quivering Palm', cost: 3, action: 'On hit', level: 17, description: 'Set up imperceptible vibrations. Can later spend action: target makes CON save or drops to 0 HP. Save: 10d10 necrotic.' },
];

export const MARTIAL_ARTS_DIE = [
  { level: 1, die: 'd4' },
  { level: 5, die: 'd6' },
  { level: 11, die: 'd8' },
  { level: 17, die: 'd10' },
];

export const MONK_SUBCLASS_KI = [
  { subclass: 'Open Hand', abilities: [{ name: 'Open Hand Technique', cost: 0, level: 3, description: 'On Flurry hit: push 15ft, knock prone (DEX save), or prevent reactions.' }] },
  { subclass: 'Shadow', abilities: [{ name: 'Shadow Arts', cost: 2, level: 3, description: 'Cast Darkness, Darkvision, Pass without Trace, or Silence.' }] },
  { subclass: 'Four Elements', abilities: [{ name: 'Elemental Disciplines', cost: 'varies', level: 3, description: 'Spend ki to cast spells (costs vary by discipline).' }] },
  { subclass: 'Drunken Master', abilities: [{ name: 'Drunken Technique', cost: 0, level: 3, description: 'Flurry of Blows: free Disengage + 10ft bonus movement.' }] },
  { subclass: 'Kensei', abilities: [{ name: 'Kensei Weapons', cost: 0, level: 3, description: 'Choose kensei weapons. +2 AC if unarmed strike after Attack with kensei weapon.' }] },
  { subclass: 'Mercy', abilities: [{ name: 'Hands of Healing', cost: 1, level: 3, description: 'Touch to heal martial arts die + WIS mod. Can replace Flurry attack with heal.' }] },
  { subclass: 'Astral Self', abilities: [{ name: 'Arms of the Astral Self', cost: 1, level: 3, description: 'Summon spectral arms (10ft reach, WIS for unarmed, +force damage).' }] },
];

export function getKiPoints(monkLevel) {
  return monkLevel;
}

export function getMartialArtsDie(monkLevel) {
  for (let i = MARTIAL_ARTS_DIE.length - 1; i >= 0; i--) {
    if (monkLevel >= MARTIAL_ARTS_DIE[i].level) return MARTIAL_ARTS_DIE[i].die;
  }
  return 'd4';
}

export function getAvailableKiAbilities(monkLevel) {
  return KI_ABILITIES.filter(a => monkLevel >= a.level);
}

export function getKiSaveDC(profBonus, wisScore) {
  const wisMod = Math.floor((wisScore - 10) / 2);
  return 8 + profBonus + wisMod;
}
