/**
 * playerArmyBattles.js
 * Player Mode: Mass combat, army battles, and player roles in large-scale warfare
 * Pure JS — no React dependencies.
 */

export const MASS_COMBAT_BASICS = {
  note: '5e doesn\'t have official mass combat rules. These are common homebrew/supplement approaches.',
  approaches: [
    'Abstracted: DM narrates the battle. Players handle key encounters (boss, gate, rescue).',
    'Unit-based: Groups of soldiers act as single units with combined HP/damage.',
    'Skill challenge: Series of ability checks determine battle outcome. Players influence with actions.',
    'Strongholds & Followers: Matt Colville\'s supplement has full mass combat rules.',
  ],
};

export const PLAYER_BATTLE_ROLES = [
  { role: 'Commander', actions: 'Issue orders. CHA (Persuasion/Intimidation) checks to rally troops, change formation, order charges.', impact: 'Success: allies gain advantage or extra actions. Failure: morale breaks.' },
  { role: 'Champion', actions: 'Challenge enemy leader to single combat. Victory = morale boost for your army.', impact: 'Kills commander = enemy morale check. May end battle early.' },
  { role: 'Artillery', actions: 'Cast AoE spells on enemy formations. Fireball on a platoon = devastating.', impact: 'A single Fireball can eliminate an entire squad (8d6 to 10-20 soldiers).' },
  { role: 'Saboteur', actions: 'Sneak behind enemy lines. Destroy siege equipment, poison supplies, open gates.', impact: 'Eliminates enemy advantages. Stealth/Thieves\' Tools checks.' },
  { role: 'Healer', actions: 'Mass Healing Word, Heal, Spirit Guardians to protect key positions.', impact: 'Keeps elite troops alive. Prayer of Healing between waves.' },
  { role: 'Cavalry', actions: 'Mounted charge into flanks. Break enemy formations.', impact: 'Trample + lance charge = devastating first strike. Requires mounts.' },
];

export const BATTLE_SPELLS = [
  { spell: 'Fireball/Lightning Bolt', level: 3, impact: 'Kills platoons of regular soldiers. 8d6 to a 20ft sphere = 28 avg damage vs 11 HP guards.' },
  { spell: 'Wall of Fire/Force', level: 4, impact: 'Split armies in half. Control chokepoints. Block reinforcements.' },
  { spell: 'Mass Suggestion', level: 6, impact: '12 creatures "surrender" or "retreat." No concentration. Lasts 24 hours.' },
  { spell: 'Earthquake', level: 8, impact: 'Collapse fortifications. Create fissures. Difficult terrain over huge area.' },
  { spell: 'Meteor Swarm', level: 9, impact: '40d6 fire+bludgeoning. 4 points. Obliterates entire battalions.' },
  { spell: 'Control Weather', level: 8, impact: 'Create storms, fog, extreme cold. Affects entire battlefield for 8 hours.' },
  { spell: 'Heroes\' Feast', level: 6, impact: 'Feed 13 creatures. Immune to frighten/poison. +2d10 max HP. Lasts 24 hours.' },
];

export const MORALE_SYSTEM = {
  check: 'WIS save (DC set by DM, usually 10-15) when a unit takes heavy casualties or loses its leader.',
  triggers: [
    'Unit reduced to 50% strength',
    'Commander killed or captured',
    'Flanked or surrounded',
    'Allied unit routed',
    'Magical fear effects (Dragon\'s Frightful Presence, Fear spell)',
  ],
  results: {
    pass: 'Unit holds. Fights on.',
    fail: 'Unit routes. Flees at double speed. Can be rallied with DC 15 CHA check.',
    nat1: 'Unit surrenders or scatters permanently.',
  },
};

export function armyDamageFromSpell(spellDamage, soldiersInArea, soldierHP) {
  const killed = soldiersInArea * (spellDamage >= soldierHP ? 1 : spellDamage / soldierHP);
  return Math.floor(killed);
}

export function moraleDC(casualties, leaderDead, flanked) {
  let dc = 10;
  if (casualties > 0.5) dc += 3;
  if (leaderDead) dc += 5;
  if (flanked) dc += 2;
  return dc;
}
