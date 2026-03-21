/**
 * playerSummonSpellComparisonGuide.js
 * Player Mode: Tasha's Summon spells compared — which to pick
 * Pure JS — no React dependencies.
 */

export const TASHAS_SUMMON_OVERVIEW = {
  design: 'Tasha\'s introduced streamlined Summon spells that create a single creature with scaling stats.',
  advantages: ['Faster to run than Conjure Animals/Woodland Beings', 'Predictable creature stats', 'Scale when upcast', 'Don\'t slow combat'],
  note: 'These are generally better-designed than older summon spells (Conjure Animals) for table flow, but Conjure Animals is still more powerful RAW.',
};

export const SUMMON_SPELLS_COMPARED = [
  { spell: 'Summon Beast', level: 2, classes: ['Druid', 'Ranger'], hp: '30 (scales +5/level)', ac: '11+level', attacks: 'Multiattack (2) at L5 upcast', note: 'Earliest Tasha\'s summon. Land/Sea/Air types. Solid early companion.', rating: 'A' },
  { spell: 'Summon Fey', level: 3, classes: ['Druid', 'Ranger', 'Warlock', 'Wizard'], hp: '30 (scales +10/level)', ac: '12+level', attacks: 'Multiattack (2), bonus action teleport 30ft', note: 'Fuming/Mirthful/Tricksy types. Teleport every turn. Good mobility.', rating: 'A' },
  { spell: 'Summon Shadowspawn', level: 3, classes: ['Warlock', 'Wizard'], hp: '35 (scales +15/level)', ac: '12+level', attacks: 'Multiattack (2), frightening gaze or shadow stealth', note: 'Despair/Fear/Fury types. Fear type\'s frightening gaze is excellent control.', rating: 'A' },
  { spell: 'Summon Undead', level: 3, classes: ['Warlock', 'Wizard'], hp: '30 (scales +10/level)', ac: '11+level', attacks: 'Multiattack (2), paralysis (Ghostly) or disease', note: 'Ghostly type: paralyze on hit (CON save). Putrid: poison AoE. Skeletal: ranged.', rating: 'S' },
  { spell: 'Summon Construct', level: 4, classes: ['Artificer', 'Wizard'], hp: '40 (scales +15/level)', ac: '13+level', attacks: 'Multiattack (2), heated body or stone lethargy', note: 'Durable. Clay/Metal/Stone types. Good HP and AC. Defensive summon.', rating: 'A' },
  { spell: 'Summon Elemental', level: 4, classes: ['Druid', 'Ranger', 'Wizard'], hp: '50 (scales +10/level)', ac: '11+level', attacks: 'Multiattack (2), element-specific effects', note: 'Air/Earth/Fire/Water. Each has unique bonus. Fire = bonus fire damage on hit.', rating: 'A' },
  { spell: 'Summon Aberration', level: 4, classes: ['Warlock', 'Wizard'], hp: '40 (scales +10/level)', ac: '11+level', attacks: 'Multiattack (2), psychic effects', note: 'Beholderkin: ranged psychic ray. Slaad: regen. Star Spawn: psychic AoE.', rating: 'A' },
  { spell: 'Summon Celestial', level: 5, classes: ['Cleric', 'Paladin'], hp: '40 (scales +10/level)', ac: '11+level', attacks: 'Multiattack (2), healing touch or radiant attacks', note: 'Avenger: radiant damage. Defender: healing touch. Only Cleric/Paladin summon option.', rating: 'A' },
  { spell: 'Summon Fiend', level: 6, classes: ['Warlock', 'Wizard'], hp: '50 (scales +15/level)', ac: '12+level', attacks: 'Multiattack (2), death throes explosion on death', note: 'Demon/Devil/Yugoloth types. Strong damage. Death Throes is bonus AoE when it dies.', rating: 'A' },
  { spell: 'Summon Draconic Spirit', level: 5, classes: ['Druid', 'Sorcerer', 'Wizard'], hp: '50 (scales +10/level)', ac: '14+level', attacks: 'Multiattack (3!), breath weapon, resistance', note: '3 attacks! Breath weapon AoE. Resistance to chosen element. Best combat summon.', rating: 'S' },
];

export const SUMMON_VS_CONJURE = {
  tashasSummons: { pros: ['Single creature = fast turns', 'Predictable stats', 'Scales cleanly'], cons: ['Lower total action economy', 'Less total damage than 8 wolves'] },
  conjureAnimals: { pros: ['8 creatures = 8 attacks', 'Overwhelming action economy', 'Can grapple, flank, block'], cons: ['Slows combat drastically', 'DM chooses creatures (RAW)', 'Tracking 8 creatures is painful'] },
  verdict: 'Tasha\'s Summons for table speed. Conjure Animals for raw power (if your DM and table are patient).',
};

export function summonHP(baseHP, upcastLevels, hpPerLevel) {
  return baseHP + upcastLevels * hpPerLevel;
}

export function summonAC(baseAC, spellLevel) {
  return baseAC + spellLevel;
}
