/**
 * playerSummonSpellsGuide.js
 * Player Mode: Summon spells (Tasha's) vs Conjure spells comparison
 * Pure JS — no React dependencies.
 */

export const TASHAS_SUMMONS = [
  {
    spell: 'Summon Beast',
    level: 2,
    classes: ['Druid', 'Ranger'],
    forms: ['Air (flyby)', 'Land (pack tactics)', 'Water (swim)'],
    hp: '30 + 5/slot above 2',
    attacks: '1 (2 at slot L5+)',
    rating: 'A',
    note: 'Solid early summon. Land form with Pack Tactics is strong. Scales well.',
  },
  {
    spell: 'Summon Fey',
    level: 3,
    classes: ['Wizard', 'Druid', 'Warlock', 'Ranger'],
    forms: ['Fuming (advantage on attacks if damaged)', 'Mirthful (charm on hit)', 'Tricksy (disengage/hide as BA)'],
    hp: '30 + 10/slot above 3',
    attacks: '1 (2 at slot L6+)',
    rating: 'A',
    note: 'Good utility options. Mirthful charm is strong control. Scales well.',
  },
  {
    spell: 'Summon Undead',
    level: 3,
    classes: ['Wizard', 'Warlock'],
    forms: ['Ghostly (fly, frighten)', 'Putrid (poison aura)', 'Skeletal (ranged, bonus damage)'],
    hp: '30 + 10/slot above 3',
    attacks: '1 (2 at slot L6+)',
    rating: 'A',
    note: 'Ghostly form is excellent. Frighten on hit, fly speed. Warlock favorite.',
  },
  {
    spell: 'Summon Shadowspawn',
    level: 3,
    classes: ['Wizard', 'Warlock'],
    forms: ['Fury (extra damage when near enemy)', 'Despair (frighten aura)', 'Fear (halve speed on hit)'],
    hp: '35 + 15/slot above 3',
    attacks: '1 (2 at slot L6+)',
    rating: 'A',
    note: 'Higher HP than other L3 summons. Fear form halving speed is great control.',
  },
  {
    spell: 'Summon Aberration',
    level: 4,
    classes: ['Wizard', 'Warlock'],
    forms: ['Beholderkin (ranged + hover)', 'Slaad (regen + multiattack)', 'Star Spawn (psychic + teleport)'],
    hp: '40 + 10/slot above 4',
    attacks: '1-2',
    rating: 'A+',
    note: 'Strong at L4. Slaad regeneration is excellent. Beholderkin for ranged.',
  },
  {
    spell: 'Summon Construct',
    level: 4,
    classes: ['Wizard', 'Artificer'],
    forms: ['Clay (berserk slam)', 'Metal (reflect damage)', 'Stone (lethargy aura)'],
    hp: '40 + 15/slot above 4',
    attacks: '1 (2 at slot L6+)',
    rating: 'A',
    note: 'Highest HP summon. Metal form reflects damage. Stone slows enemies.',
  },
  {
    spell: 'Summon Elemental',
    level: 4,
    classes: ['Wizard', 'Druid', 'Ranger'],
    forms: ['Air (fly, lightning)', 'Earth (extra damage)', 'Fire (ignite)', 'Water (acid)'],
    hp: '50 + 10/slot above 4',
    attacks: '1 (2 at slot L6+)',
    rating: 'A',
    note: 'Good HP. Four element options. Earth does solid damage.',
  },
  {
    spell: 'Summon Celestial',
    level: 5,
    classes: ['Cleric', 'Paladin'],
    forms: ['Avenger (radiant melee, fly)', 'Defender (heal, temporary HP)'],
    hp: '40 + 10/slot above 5',
    attacks: '2',
    rating: 'A+',
    note: 'Defender form heals allies. Avenger has radiant damage + flight. Great for Clerics.',
  },
  {
    spell: 'Summon Draconic Spirit',
    level: 5,
    classes: ['Wizard', 'Druid', 'Sorcerer'],
    forms: ['Chromatic (resistance)', 'Gem (ranged, no OA on allies)', 'Metallic (breath weapon)'],
    hp: '50 + 10/slot above 5',
    attacks: '2 + breath weapon',
    rating: 'S',
    note: 'One of the strongest summons. Breath weapon is AoE. Gem form protects allies.',
  },
];

export const SUMMON_VS_CONJURE = {
  tashasSummons: {
    pros: ['Stat block in spell description — consistent', 'Scales with slot level', 'You control the summon', 'Less DM discretion'],
    cons: ['Only one creature', 'Less thematic variety'],
  },
  conjureSpells: {
    pros: ['Multiple creatures possible (Conjure Animals: 8 beasts at L3)', 'Action economy advantage (8 attacks > 1)', 'More thematic'],
    cons: ['DM chooses what appears (RAW)', 'Slows combat with many creatures', 'Contested ruling — many tables ban or limit'],
  },
  verdict: 'Tasha\'s summons are more reliable and less disruptive. Conjure Animals is more powerful if DM allows choice. Most tables prefer Tasha\'s.',
};

export function summonHP(baseHP, slotLevel, spellMinLevel, hpPerSlot) {
  const bonusHP = Math.max(0, slotLevel - spellMinLevel) * hpPerSlot;
  return { total: baseHP + bonusHP, note: `Summon HP: ${baseHP} + ${bonusHP} (slot ${slotLevel}) = ${baseHP + bonusHP}` };
}
