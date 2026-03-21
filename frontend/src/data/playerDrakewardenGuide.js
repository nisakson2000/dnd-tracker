/**
 * playerDrakewardenGuide.js
 * Player Mode: Drakewarden Ranger — dragon companion ranger
 * Pure JS — no React dependencies.
 */

export const DRAKEWARDEN_BASICS = {
  class: 'Ranger (Drakewarden)',
  source: 'Fizban\'s Treasury of Dragons',
  theme: 'Bond with a drake companion that grows from Small to Large (rideable). Dragon-themed ranger.',
  note: 'Best pet Ranger. Drake scales with level, becomes a mount at L7, and eventually flies. Fun and effective.',
};

export const DRAKEWARDEN_FEATURES = [
  { feature: 'Draconic Gift', level: 3, effect: 'Learn Thaumaturgy cantrip. Speak/understand Draconic.', note: 'Flavor ribbon. Draconic is useful for dragon encounters.' },
  { feature: 'Drake Companion', level: 3, effect: 'Summon drake (bonus action, 1/long rest or spell slot). Small dragon with your choice of damage type. Commands as bonus action. Attack: 1d6+PB damage of chosen type.', note: 'Your drake. Bonus action to command. Scales with PB. Choose damage type each summon.' },
  { feature: 'Bond of Fang and Scale', level: 7, effect: 'Drake becomes Medium (rideable if you\'re Small/Medium). Drake gets swim/climb/fly 40ft (fly only for 10 min). Reaction: add 1d6 to any save when near drake.', note: 'RIDE YOUR DRAKE. Fly for 10 min. +1d6 to saves. Incredible at L7.' },
  { feature: 'Drake\'s Breath', level: 11, effect: 'Action (1/long rest or spell slot): drake breathes 30ft cone, DEX save, 8d6 damage of drake\'s type. Once per long rest or use spell slot.', note: '8d6 breath weapon. Like a mini Fireball in a cone. Can upcast with higher slots.' },
  { feature: 'Perfected Bond', level: 15, effect: 'Drake becomes Large. Fly is no longer limited to 10 min. Drake bite deals extra 1d6. Resistance: when drake or rider takes damage, use reaction to give the other one resistance to that damage.', note: 'Large flying drake mount. Permanent flight. Shared resistance. You\'re a dragon rider.' },
];

export const DRAKE_STATS = {
  ac: '14 + PB (natural armor)',
  hp: '5 + five times ranger level',
  speed: '40ft',
  bite: '1d6 + PB (chosen damage type)',
  damageTypes: ['Acid', 'Cold', 'Fire', 'Lightning', 'Poison'],
  immunities: 'Immune to chosen damage type',
  savingThrows: 'DEX, WIS (uses your spell attack modifier)',
  note: 'Drake scales with your level. At L15 with PB +5: AC 19, good HP, 1d6+1d6+5 damage.',
};

export const DRAKEWARDEN_TACTICS = [
  { tactic: 'Mounted combat', detail: 'L7: ride drake (Medium). L15: Large drake with permanent flight. Fly above enemies, attack from above.', rating: 'S', note: 'True dragon rider fantasy. Fly + attack. Enemies without ranged can\'t touch you.' },
  { tactic: 'Shared resistance', detail: 'L15: reaction when you or drake takes damage → other gains resistance. Essentially halve damage once per round.', rating: 'S' },
  { tactic: 'Drake\'s Breath AoE', detail: 'L11: 30ft cone, 8d6 damage. Choose type at summon. Fire/lightning vs most enemies. Cold/acid for themed fights.', rating: 'A' },
  { tactic: 'Drake as tank', detail: 'Drake has 5+5×level HP and AC 14+PB. Send it in to absorb hits while you range.', rating: 'A' },
  { tactic: 'Save boosting', detail: 'L7: reaction +1d6 to any save when near drake. Fail a save by 1-3? Drake saves you.', rating: 'A' },
];

export const DRAKEWARDEN_VS_BEASTMASTER = {
  drakewarden: { pros: ['Drake scales better', 'Flying mount at L7/L15', 'Breath weapon AoE', 'Damage type choice', 'Save boosting'], cons: ['Drake has lower HP than some beasts', 'Bonus action economy', 'Drake can die'] },
  beastmaster: { pros: ['Primal Companion is tankier', 'Better at low levels', 'More creature variety'], cons: ['No flight', 'No breath weapon', 'No save boosting', 'Less thematic'] },
  verdict: 'Drakewarden is the better pet Ranger overall. Flight and breath weapon are too good.',
};

export function drakeHP(rangerLevel) {
  return 5 + (5 * rangerLevel);
}

export function drakeAC(proficiencyBonus) {
  return 14 + proficiencyBonus;
}

export function drakeBiteDamage(proficiencyBonus, perfectedBond = false) {
  return 3.5 + proficiencyBonus + (perfectedBond ? 3.5 : 0); // 1d6+PB (+1d6 at L15)
}

export function drakeBreathDamage(spellSlotLevel = 0) {
  const baseDice = 8;
  const extraDice = spellSlotLevel > 3 ? (spellSlotLevel - 3) : 0;
  return (baseDice + extraDice) * 3.5; // d6 avg
}
