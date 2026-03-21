/**
 * playerSummonsComparisonGuide.js
 * Player Mode: All summoning spells compared — which to use and when
 * Pure JS — no React dependencies.
 */

export const SUMMONING_SPELLS_RANKED = [
  {
    spell: 'Conjure Animals',
    level: 3,
    class: 'Druid, Ranger',
    summons: '8 CR 1/4 beasts (e.g., wolves)',
    duration: 'Concentration, 1 hour',
    rating: 'S+',
    note: 'Best summon spell. 8 wolves with Pack Tactics = massive damage + action economy. DM chooses creatures (RAW).',
  },
  {
    spell: 'Animate Objects',
    level: 5,
    class: 'Bard, Sorcerer, Wizard, Artificer',
    summons: '10 Tiny objects (coins, pebbles)',
    duration: 'Concentration, 1 minute',
    rating: 'S+',
    note: '10 Tiny objects: +8 to hit, 1d4+4 damage each = 47 avg DPR. Best damage summon.',
  },
  {
    spell: 'Conjure Woodland Beings',
    level: 4,
    class: 'Druid, Ranger',
    summons: '8 CR 1/4 fey (e.g., Pixies)',
    duration: 'Concentration, 1 hour',
    rating: 'S+ (if Pixies)',
    note: 'If DM allows Pixies: they cast Polymorph, Fly, etc. Broken. DM chooses (RAW).',
  },
  {
    spell: 'Summon Undead (Tasha\'s)',
    level: 3,
    class: 'Warlock, Wizard',
    summons: '1 undead spirit (Ghostly, Putrid, or Skeletal)',
    duration: 'Concentration, 1 hour',
    rating: 'A+',
    note: 'Tasha\'s summons. YOU choose the form. Reliable, no DM picking. Scales with slot.',
  },
  {
    spell: 'Summon Fey (Tasha\'s)',
    level: 3,
    class: 'Druid, Ranger, Warlock, Wizard',
    summons: '1 fey spirit (Fuming, Mirthful, or Tricksy)',
    duration: 'Concentration, 1 hour',
    rating: 'A+',
    note: 'Tasha\'s. Good damage + advantage mechanic. Reliable.',
  },
  {
    spell: 'Summon Beast (Tasha\'s)',
    level: 2,
    class: 'Druid, Ranger',
    summons: '1 bestial spirit (Air, Land, or Water)',
    duration: 'Concentration, 1 hour',
    rating: 'A',
    note: 'Earliest summon. Level 2. Pack Tactics (Land form). Good scaling.',
  },
  {
    spell: 'Conjure Elemental',
    level: 5,
    class: 'Druid, Wizard',
    summons: '1 elemental (CR ≤ 5)',
    duration: 'Concentration, 1 hour',
    rating: 'A',
    note: 'Strong creature but HOSTILE if concentration breaks. Risky.',
  },
  {
    spell: 'Find Familiar',
    level: 1,
    class: 'Wizard',
    summons: '1 spirit in beast form',
    duration: 'Permanent until killed',
    rating: 'S+ (utility)',
    note: 'Not combat summon. Help action, scouting, deliver touch spells. Best utility.',
  },
  {
    spell: 'Find Steed',
    level: 2,
    class: 'Paladin',
    summons: '1 intelligent mount',
    duration: 'Permanent until killed',
    rating: 'S+',
    note: 'Permanent mount. Shares self-target spells. Incredible for mounted builds.',
  },
  {
    spell: 'Animate Dead',
    level: 3,
    class: 'Cleric, Wizard',
    summons: '1 skeleton or zombie (maintain with recasting)',
    duration: '24 hours (must recast to maintain)',
    rating: 'A',
    note: 'No concentration! Build an army over time. Requires daily slot investment.',
  },
  {
    spell: 'Summon Celestial (Tasha\'s)',
    level: 5,
    class: 'Cleric, Paladin',
    summons: '1 celestial spirit (Avenger or Defender)',
    duration: 'Concentration, 1 hour',
    rating: 'A+',
    note: 'Tasha\'s. Ranged or melee. Heals allies. Good scaling.',
  },
  {
    spell: 'Conjure Minor Elementals',
    level: 4,
    class: 'Druid, Wizard',
    summons: '8 CR 1/4 elementals',
    duration: 'Concentration, 1 hour',
    rating: 'A',
    note: 'Similar to Conjure Animals but elementals. DM chooses.',
  },
];

export const TASHA_VS_PHB_SUMMONS = {
  phb: {
    pros: ['More creatures = more action economy', 'Pack Tactics (wolves)', 'Higher raw DPR with 8 creatures'],
    cons: ['DM chooses creatures (RAW)', 'Slow turns (8 creatures = 8 attack rolls)', 'Bookkeeping nightmare'],
  },
  tashas: {
    pros: ['YOU choose the form', 'One creature = fast turns', 'Scales with spell slot', 'No DM interference'],
    cons: ['Lower action economy (1 creature)', 'Less raw DPR', 'Still uses concentration'],
  },
  verdict: 'PHB summons are stronger IF the DM gives you good creatures. Tasha\'s are reliable and faster at the table.',
};

export const SUMMONING_TIPS = [
  'Conjure Animals: 8 wolves with Pack Tactics. Best raw damage summon.',
  'Animate Objects: 10 tiny objects. Best single-target damage summon.',
  'Tasha\'s summons: YOU choose. No DM surprises. Faster turns.',
  'Animate Dead: NO concentration. Build a zombie army over time.',
  'Conjure Woodland Beings: if DM gives Pixies, they cast Polymorph on your party.',
  'Summon spells use concentration. Protect it. War Caster or Resilient (CON).',
  'When all summons die, the spell ends. Protect your creatures.',
  'Conjure Elemental: hostile if concentration breaks. Dangerous.',
  'Find Steed is permanent. Shares self-target spells. Best Paladin feature.',
  'Keep summoned creature stat blocks ready. Don\'t slow down the table.',
];
