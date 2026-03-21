/**
 * playerSummoningStrategy.js
 * Player Mode: Summoning spells ranked, action economy, and management
 * Pure JS — no React dependencies.
 */

export const SUMMONING_OVERVIEW = {
  whySummon: 'Summoned creatures give you extra actions per round. Best way to win action economy.',
  concentration: 'Almost all summon spells require concentration. Protect it at all costs.',
  control: 'You control summoned creatures on your turn. They act on your initiative (usually).',
};

export const BEST_SUMMON_SPELLS = [
  { spell: 'Conjure Animals', level: 3, class: 'Druid/Ranger', creatures: '8 beasts (CR 1/4) or 4 (CR 1/2) or 2 (CR 1) or 1 (CR 2)', note: '8 wolves with Pack Tactics is the best option. 8 attacks/round with advantage.', rating: 'S' },
  { spell: 'Animate Objects', level: 5, class: 'Wizard/Bard', creatures: '10 Tiny objects (1d4+4 damage each, +8 to hit)', note: '10 attacks at +8 for 1d4+4 each = avg 65 DPR. Best sustained damage spell.', rating: 'S' },
  { spell: 'Summon Undead (Tasha\'s)', level: 3, class: 'Warlock/Wizard', creatures: '1 undead spirit (Ghostly, Putrid, or Skeletal)', note: 'Scales with slot level. No DM choice on form. Reliable.', rating: 'A' },
  { spell: 'Summon Fey (Tasha\'s)', level: 3, class: 'Druid/Ranger/Warlock/Wizard', creatures: '1 fey spirit (Fuming, Mirthful, or Tricksy)', note: 'Good damage + utility. Advantage on frightened targets (Fuming).', rating: 'A' },
  { spell: 'Summon Beast (Tasha\'s)', level: 2, class: 'Druid/Ranger', creatures: '1 bestial spirit (Air, Land, or Sea)', note: 'Available at level 3. Solid early-game summon.', rating: 'A' },
  { spell: 'Conjure Elemental', level: 5, class: 'Druid/Wizard', creatures: '1 elemental (up to CR 5)', note: 'Earth Elemental = 126 HP tank. BUT: if you lose concentration, it goes hostile.', rating: 'B' },
  { spell: 'Conjure Woodland Beings', level: 4, class: 'Druid/Ranger', creatures: '8 fey (CR 1/4), 4 (CR 1/2), etc.', note: 'Pixies (CR 1/4) can cast Polymorph, Fly, etc. IF the DM lets you choose.', rating: 'S (if DM allows choice) / B (if not)' },
  { spell: 'Summon Aberration (Tasha\'s)', level: 4, class: 'Warlock/Wizard', creatures: '1 aberrant spirit (Beholderkin, Slaad, Star Spawn)', note: 'Beholderkin shoots eye ray. Good single summon.', rating: 'A' },
  { spell: 'Summon Celestial (Tasha\'s)', level: 5, class: 'Cleric/Paladin', creatures: '1 celestial spirit (Avenger or Defender)', note: 'Defender gives temp HP to allies. Avenger does radiant damage.', rating: 'A' },
  { spell: 'Summon Draconic Spirit (Fizban\'s)', level: 5, class: 'Druid/Sorcerer/Wizard', creatures: '1 draconic spirit', note: 'Breath weapon + flight. Good damage and mobility.', rating: 'A' },
];

export const SUMMONING_TIPS = [
  '8 CR 1/4 creatures > 1 CR 2 creature. More attacks = more damage = better action economy.',
  'Tasha\'s summon spells are MUCH easier to manage than Conjure spells (one creature, fixed stats).',
  'Protect concentration. War Caster or Resilient (CON). Your summons disappear if you lose it.',
  'Position summons to flank, body-block, and absorb hits. They\'re expendable.',
  'Conjure Animals: the DM technically chooses the creatures. Discuss expectations beforehand.',
  'Don\'t use summoning in narrow spaces. 8 wolves need room to maneuver.',
  'Have stat blocks ready. Summoning slows combat if you\'re looking things up.',
];

export const TASHA_VS_PHB_SUMMONS = {
  tashas: {
    pros: ['You choose the exact creature', 'One creature = faster turns', 'Scales with slot level', 'Fixed stat block'],
    cons: ['Only one creature', 'Less total action economy'],
  },
  phb: {
    pros: ['Multiple creatures = more attacks', 'Better action economy', 'More tactical options'],
    cons: ['DM may choose creatures', 'Slows combat (8 turns)', 'More bookkeeping'],
  },
  verdict: 'Tasha\'s for convenience. PHB for raw power (if your DM cooperates).',
};

export function animateObjectsDPR(tinyCount, hitBonus, targetAC) {
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - hitBonus)) / 20));
  const damagePerHit = 6.5; // 1d4+4
  return Math.round(tinyCount * hitChance * damagePerHit * 10) / 10;
}

export function conjureAnimalsDPR(wolfCount, packTactics, targetAC) {
  const hitBonus = 4; // wolf +4
  const hitChance = packTactics
    ? 1 - Math.pow(1 - Math.min(0.95, Math.max(0.05, (21 - (targetAC - hitBonus)) / 20)), 2)
    : Math.min(0.95, Math.max(0.05, (21 - (targetAC - hitBonus)) / 20));
  const damagePerHit = 7; // 2d4+2
  return Math.round(wolfCount * hitChance * damagePerHit * 10) / 10;
}
