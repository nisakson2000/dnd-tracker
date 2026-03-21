/**
 * playerSummonSpellTacticsGuide.js
 * Player Mode: Tasha's summon spells — optimization and tactical deployment
 * Pure JS — no React dependencies.
 */

export const TASHAS_SUMMONS_RANKED = [
  {
    spell: 'Summon Undead',
    level: 3,
    forms: ['Ghostly (fly + frighten)', 'Putrid (poison aura)', 'Skeletal (ranged + bonus damage)'],
    rating: 'S',
    note: 'Ghostly form: fly + frighten. Best L3 summon.',
  },
  {
    spell: 'Summon Fey',
    level: 3,
    forms: ['Fuming (advantage if ally adjacent)', 'Mirthful (charm on hit)', 'Tricksy (advantage + disadvantage)'],
    rating: 'A+',
    note: 'Good utility. Tricksy gives advantage on attacks.',
  },
  {
    spell: 'Summon Shadowspawn',
    level: 3,
    forms: ['Fury (bonus damage)', 'Despair (frighten aura)', 'Fear (frighten on hit)'],
    rating: 'A+',
    note: 'Fear aura is strong area denial.',
  },
  {
    spell: 'Summon Beast',
    level: 2,
    forms: ['Air (flyby)', 'Land (pack tactics)', 'Water (swim)'],
    rating: 'A',
    note: 'Available at L3. Land form: pack tactics = advantage.',
  },
  {
    spell: 'Summon Elemental',
    level: 4,
    forms: ['Air (fly + shock)', 'Earth (tremor)', 'Fire (ignite)', 'Water (flow)'],
    rating: 'S',
    note: 'Strong at L4. Each element has unique battlefield control.',
  },
  {
    spell: 'Summon Construct',
    level: 4,
    forms: ['Clay (berserk slam)', 'Metal (reflective AC)', 'Stone (lethargy aura)'],
    rating: 'A+',
    note: 'Metal form: heated body + high AC. Stone: slow enemies.',
  },
  {
    spell: 'Summon Aberration',
    level: 4,
    forms: ['Beholderkin (ranged ray)', 'Slaad (regen)', 'Star Spawn (psychic whip)'],
    rating: 'A+',
    note: 'Beholderkin: ranged damage without entering melee.',
  },
  {
    spell: 'Summon Celestial',
    level: 5,
    forms: ['Avenger (radiant + fly)', 'Defender (temp HP aura)'],
    rating: 'S',
    note: 'Defender: temp HP to party each round. Amazing support.',
  },
  {
    spell: 'Summon Fiend',
    level: 6,
    forms: ['Demon (frenzy)', 'Devil (fly + hellfire)', 'Yugoloth (magic resist)'],
    rating: 'S',
    note: 'Strong at L6. Devil form: fly + consistent damage.',
  },
  {
    spell: 'Summon Dragon',
    level: 5,
    forms: ['Chromatic', 'Gem', 'Metallic'],
    rating: 'S+',
    note: 'Fly + breath weapon. Shared resistance aura. Best summon spell.',
  },
];

export const SUMMON_VS_CONJURE = {
  tashasSummons: {
    pros: ['Single creature (fast turns)', 'Predictable stats', 'Scale with slot level', 'DM doesn\'t choose form'],
    cons: ['Less total damage than 8 wolves', 'Single target focus'],
  },
  conjureSpells: {
    pros: ['More bodies = more attacks', 'Action economy advantage', 'Can overwhelm enemies'],
    cons: ['DM chooses creatures (RAW)', 'Slow turns (8 creatures)', 'All die on concentration break'],
  },
  verdict: 'Tasha\'s summons are more reliable and faster at the table. Conjure spells are stronger if DM cooperates.',
};

export const SUMMON_TACTICS = [
  'Summons act on your initiative. You control their actions.',
  'Position summons to flank or body-block for allies.',
  'Summons can take opportunity attacks, freeing your reaction.',
  'Ghostly Undead: fly makes it hard for enemies to reach.',
  'Summon Dragon: shared resistance aura protects nearby allies.',
  'Celestial Defender: temp HP aura each turn. Position in party center.',
  'Concentration: protect it. Losing summon = wasted slot + action.',
  'Upcast summons: higher slot = more HP, better attacks, stronger features.',
  'Use summons to trigger traps, scout ahead, or absorb hits.',
  'Don\'t summon if fight will end in 1-2 rounds. It\'s an Action to cast.',
];
