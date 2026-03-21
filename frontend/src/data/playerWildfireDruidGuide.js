/**
 * playerWildfireDruidGuide.js
 * Player Mode: Circle of Wildfire Druid — fire and healing
 * Pure JS — no React dependencies.
 */

export const WILDFIRE_BASICS = {
  class: 'Druid (Circle of Wildfire)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Fire destruction and rebirth. Wildfire Spirit companion. Fire damage + enhanced healing.',
  note: 'Best damage Druid. Wildfire Spirit gives bonus action damage and teleportation. Enhanced Bond boosts both damage and healing.',
};

export const WILDFIRE_FEATURES = [
  { feature: 'Summon Wildfire Spirit', level: 2, effect: 'Expend Wild Shape: summon spirit in 30ft. Creatures within 10ft: DEX save or 2d6 fire. Spirit has stats, bonus action commands.', note: 'Use Wild Shape for a fire buddy instead of beast form. Companion has its own turn via your bonus action.' },
  { feature: 'Enhanced Bond', level: 6, effect: '+1d8 to one damage roll or healing roll of fire/healing spells. Can cast through spirit\'s space.', note: '+1d8 to Cure Wounds AND Fireball. Both. Every spell. Plus cast from spirit\'s location.' },
  { feature: 'Cauterizing Flames', level: 10, effect: 'When a creature you can see dies or a Small+ creature is reduced to 0 HP within 30ft of spirit: spectral flame. Creature entering flame\'s space heals or takes 2d10+WIS fire.', note: 'Death triggers healing or damage zones. Battlefield control from enemy deaths.' },
  { feature: 'Blazing Revival', level: 14, effect: 'If spirit is active when you drop to 0 HP: spirit dies, you gain half your HP back. Once/long rest.', note: 'Auto-revive. Spirit sacrifices itself. You pop back up with half HP.' },
];

export const WILDFIRE_SPIRIT_STATS = {
  hp: '5 + five times your Druid level',
  ac: 13,
  speed: '30ft fly (hover)',
  actions: {
    flameSeed: 'Ranged spell attack, 60ft, 1d6+PB fire damage',
    fieryTeleportation: 'Each creature within 5ft of spirit + within 5ft of destination: DEX save or 1d6+PB fire. Teleport you or willing creature within 5ft of spirit to within 5ft of spirit\'s new location (15ft).',
  },
  note: 'Commands as your bonus action. Flame Seed for consistent damage. Fiery Teleportation for repositioning + AoE.',
};

export const WILDFIRE_TACTICS = [
  { tactic: 'Spirit + Spell combo', detail: 'Action: cast spell (Fireball, Cure Wounds). Bonus action: command spirit (Flame Seed or Fiery Teleportation). Two sources of damage/healing per turn.', rating: 'S' },
  { tactic: 'Enhanced Healing Word', detail: 'Healing Word (bonus action) + 1d8 from Enhanced Bond. Or cast through spirit\'s location for better range.', rating: 'A', note: 'Can\'t do both spirit command AND Healing Word (both bonus action). Choose each turn.' },
  { tactic: 'Fiery Teleportation rescue', detail: 'Spirit is near a downed ally. Fiery Teleportation: teleport ally to safety. Enemies near both locations take fire.', rating: 'S', note: 'Rescue + damage. Best repositioning tool for a Druid.' },
  { tactic: 'Enhanced Fireball', detail: 'Fireball (8d6) + 1d8 from Enhanced Bond = 8d6+1d8 fire. Cast from spirit\'s position for better angles.', rating: 'A' },
  { tactic: 'Cauterizing Flames ambush', detail: 'Kill enemies → flames appear → position allies to heal from flames or bait enemies into fire damage zones.', rating: 'A' },
];

export const WILDFIRE_VS_MOON = {
  wildfire: { pros: ['Bonus action damage every turn', 'Enhanced healing (+1d8)', 'Teleportation via spirit', 'Auto-revive at L14', 'Full spellcasting focus'], cons: ['No Wild Shape combat form', 'Spirit can die (low HP)', 'Fire damage commonly resisted'] },
  moon: { pros: ['Combat Wild Shape (tank)', 'Huge HP pool in beast form', 'Elemental Wild Shape at L10'], cons: ['Loses spellcasting in beast form', 'Falls off at higher levels', 'Less spell damage'] },
  verdict: 'Wildfire for caster Druids who want a companion. Moon for frontline tanking. Wildfire scales better.',
};

export function spiritHP(druidLevel) {
  return 5 + (5 * druidLevel);
}

export function enhancedBondDamage(spellDamage) {
  return spellDamage + 4.5; // +1d8 average
}

export function flameSeedDamage(proficiencyBonus) {
  return 3.5 + proficiencyBonus; // 1d6 + PB
}
