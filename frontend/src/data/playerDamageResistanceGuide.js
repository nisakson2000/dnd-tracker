/**
 * playerDamageResistanceGuide.js
 * Player Mode: Damage resistance, immunity, vulnerability rules and optimization
 * Pure JS — no React dependencies.
 */

export const RESISTANCE_RULES = {
  resistance: 'Take HALF damage of that type (rounded down)',
  immunity: 'Take ZERO damage of that type',
  vulnerability: 'Take DOUBLE damage of that type',
  stacking: 'Multiple sources of resistance to the same type DON\'T stack. You still take half, not quarter.',
  order: 'Apply resistance/vulnerability AFTER all other modifiers (bonuses, reductions).',
  mixed: 'If you have both resistance AND vulnerability to the same type, they cancel out = normal damage.',
};

export const COMMON_RESISTANCES = {
  racial: [
    { race: 'Tiefling', resists: ['Fire'], source: 'Infernal Legacy' },
    { race: 'Dragonborn', resists: ['Varies by draconic ancestry'], source: 'Draconic Resistance' },
    { race: 'Dwarf (Hill)', resists: ['Poison (advantage on saves)'], source: 'Dwarven Resilience' },
    { race: 'Goliath', resists: ['Cold (Stone\'s Endurance reduces damage)'], source: 'Stone\'s Endurance' },
    { race: 'Yuan-ti', resists: ['Magic (advantage on saves vs spells)'], source: 'Magic Resistance' },
    { race: 'Aasimar', resists: ['Necrotic', 'Radiant'], source: 'Celestial Resistance' },
  ],
  class: [
    { class: 'Barbarian (Rage)', resists: ['Bludgeoning', 'Piercing', 'Slashing'], source: 'Rage' },
    { class: 'Bear Totem', resists: ['All except Psychic (during Rage)'], source: 'Totem Spirit: Bear' },
    { class: 'Forge Cleric (6)', resists: ['Fire'], source: 'Soul of the Forge' },
    { class: 'Storm Sorcerer (6)', resists: ['Lightning', 'Thunder'], source: 'Storm Guide' },
    { class: 'Draconic Sorcerer (6)', resists: ['Chosen dragon type'], source: 'Elemental Affinity' },
  ],
  spells: [
    { spell: 'Absorb Elements', resists: ['Triggering element'], duration: '1 round', note: 'Reaction. Reduces incoming elemental damage.' },
    { spell: 'Protection from Energy', resists: ['Choose: acid, cold, fire, lightning, or thunder'], duration: '1 hour (conc)', note: 'Concentration. Single target.' },
    { spell: 'Stoneskin', resists: ['Nonmagical B/P/S'], duration: '1 hour (conc)', note: '4th level + 100gp diamond dust consumed.' },
    { spell: 'Investiture spells', resists: ['Varies by element'], duration: '10 min (conc)', note: '6th level. Also grants thematic powers.' },
  ],
  items: [
    { item: 'Ring of Resistance', resists: ['One type (varies)'], rarity: 'Rare', note: 'Requires attunement. Permanent resistance to one type.' },
    { item: 'Brooch of Shielding', resists: ['Force'], rarity: 'Uncommon', note: 'Also immune to Magic Missile.' },
    { item: 'Armor of Resistance', resists: ['One type (varies)'], rarity: 'Rare', note: 'Armor with built-in resistance.' },
    { item: 'Cloak of the Bat', resists: ['None (but advantage on Stealth)'], rarity: 'Rare', note: 'Not resistance but helps avoid damage entirely.' },
  ],
};

export const DAMAGE_TYPE_FREQUENCY = [
  { type: 'Fire', frequency: 'Very Common', sources: 'Dragons, fiends, traps, spells', counter: 'Fire resistance, Absorb Elements' },
  { type: 'Slashing', frequency: 'Very Common', sources: 'Swords, claws, most melee', counter: 'Rage, Stoneskin, heavy armor' },
  { type: 'Bludgeoning', frequency: 'Very Common', sources: 'Clubs, fists, falling', counter: 'Rage, Stoneskin' },
  { type: 'Piercing', frequency: 'Very Common', sources: 'Arrows, spears, bites', counter: 'Rage, Stoneskin' },
  { type: 'Necrotic', frequency: 'Common', sources: 'Undead, shadow, Inflict Wounds', counter: 'Aasimar resistance, Death Ward' },
  { type: 'Cold', frequency: 'Common', sources: 'Ice monsters, winter, spells', counter: 'Cold resistance, Absorb Elements' },
  { type: 'Lightning', frequency: 'Moderate', sources: 'Storm creatures, blue dragons, spells', counter: 'Lightning resistance, Absorb Elements' },
  { type: 'Poison', frequency: 'Common', sources: 'Monsters, traps, assassins', counter: 'Poison resistance (Dwarf), Protection from Poison' },
  { type: 'Psychic', frequency: 'Rare', sources: 'Mind flayers, some aberrations', counter: 'Very few sources of psychic resistance' },
  { type: 'Radiant', frequency: 'Rare', sources: 'Angels, clerics, paladins', counter: 'Radiant resistance (very rare)' },
  { type: 'Force', frequency: 'Rare', sources: 'Eldritch Blast, Magic Missile, Disintegrate', counter: 'Almost nothing resists force. Brooch of Shielding.' },
  { type: 'Thunder', frequency: 'Uncommon', sources: 'Thunderwave, Shatter, storm creatures', counter: 'Thunder resistance, Absorb Elements' },
  { type: 'Acid', frequency: 'Uncommon', sources: 'Black dragons, oozes, traps', counter: 'Acid resistance, Absorb Elements' },
];

export function getResistanceSources(damageType) {
  const sources = [];
  for (const [category, items] of Object.entries(COMMON_RESISTANCES)) {
    for (const item of items) {
      if (item.resists && item.resists.some(r => r.toLowerCase().includes(damageType.toLowerCase()))) {
        sources.push({ ...item, category });
      }
    }
  }
  return sources;
}

export function calculateResistDamage(damage, hasResistance, hasVulnerability, hasImmunity) {
  if (hasImmunity) return 0;
  if (hasResistance && hasVulnerability) return damage; // Cancel out
  if (hasVulnerability) return damage * 2;
  if (hasResistance) return Math.floor(damage / 2);
  return damage;
}
