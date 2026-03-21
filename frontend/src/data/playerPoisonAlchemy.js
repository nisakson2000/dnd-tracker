/**
 * playerPoisonAlchemy.js
 * Player Mode: Poisons, alchemy, and alchemical item usage
 * Pure JS — no React dependencies.
 */

export const POISON_TYPES = [
  { type: 'Contact', delivery: 'Touch. Absorbed through skin.', note: 'Apply to surfaces, objects, door handles. Targets touch it and save.' },
  { type: 'Ingested', delivery: 'Must be consumed.', note: 'Food/drink poisoning. Investigation check to detect.' },
  { type: 'Inhaled', delivery: 'Breathed in. Gas/powder cloud.', note: 'Usually 5ft radius. CON save. Affects anyone breathing.' },
  { type: 'Injury', delivery: 'Applied to weapons. Enters through wounds.', note: 'Most common combat poison. Apply to blade, hit target, poison activates.' },
];

export const PURCHASABLE_POISONS = [
  { name: 'Basic Poison', cost: '100 gp', effect: '1d4 poison damage on hit (DC 10 CON). One use.', note: 'PHB. Apply to weapon as action. Lasts 1 minute or first hit.' },
  { name: 'Assassin\'s Blood (ingested)', cost: '150 gp', effect: 'DC 10 CON: 6 poison damage + poisoned 24 hours.', note: 'Cheap ingested poison.' },
  { name: 'Serpent Venom (injury)', cost: '200 gp', effect: 'DC 11 CON: 10 (3d6) poison damage.', note: 'Common injury poison.' },
  { name: 'Purple Worm Poison (injury)', cost: '2,000 gp', effect: 'DC 19 CON: 42 (12d6) poison damage.', note: 'The big one. 42 average damage on a failed save.' },
  { name: 'Wyvern Poison (injury)', cost: '1,200 gp', effect: 'DC 15 CON: 24 (7d6) poison damage.', note: 'Mid-tier. Good balance of cost and damage.' },
  { name: 'Torpor (ingested)', cost: '600 gp', effect: 'DC 15 CON: incapacitated and speed 0 for 4d6 hours.', note: 'Non-lethal takedown. Great for kidnapping NPCs.' },
  { name: 'Midnight Tears (ingested)', cost: '1,500 gp', effect: 'DC 17 CON: 31 (9d6) poison at midnight.', note: 'Delayed activation. Alibi poison — you\'re long gone when it hits.' },
];

export const ALCHEMICAL_ITEMS = [
  { item: 'Alchemist\'s Fire', cost: '50 gp', effect: '1d4 fire/turn until extinguished (DC 10 DEX action). Ignites objects.', note: 'Ranged improvised weapon (20ft). Good vs trolls and regenerating enemies.' },
  { item: 'Acid', cost: '25 gp', effect: '2d6 acid damage. Improvised weapon (20ft).', note: 'Corrodes objects. Can destroy locks, chains, hinges.' },
  { item: 'Holy Water', cost: '25 gp', effect: '2d6 radiant to fiend/undead. Improvised weapon (20ft).', note: 'Anyone can use. Great at low levels vs undead.' },
  { item: 'Antitoxin', cost: '50 gp', effect: 'Advantage on saves vs poison for 1 hour.', note: 'Cheap insurance before fighting poisonous enemies.' },
  { item: 'Oil', cost: '1 sp', effect: '5 fire damage for 2 rounds when ignited. Covers 5ft square.', note: 'Dirt cheap. Pour and ignite with Fire Bolt. Area denial.' },
  { item: 'Smokestick (homebrew)', cost: '10 gp', effect: 'Creates 10ft heavily obscured area for 1 minute.', note: 'Not official 5e but common homebrew. Smoke bomb.' },
];

export const CRAFTING_POISONS = {
  requirement: 'Poisoner\'s Kit proficiency',
  process: 'During downtime, spend time and gold equal to half poison\'s market price.',
  poisonerFeat: 'Ignore poison resistance. +2d8 poison damage on weapon hits. Craft poisons at half cost/time. Apply as bonus action (not action).',
  note: 'Poisoner feat makes poisons viable in combat. Without it, action cost to apply is painful.',
};

export function poisonDamage(diceCont, dieSize, targetConSave, saveDC) {
  const avgDmg = diceCont * (dieSize / 2 + 0.5);
  const saveChance = Math.min(0.95, Math.max(0.05, (targetConSave + 21 - saveDC) / 20));
  return avgDmg * (1 - saveChance) + (avgDmg / 2) * saveChance;
}

export function poisonerFeatDamage(basePoisonDmg) {
  return basePoisonDmg + 9; // +2d8 avg = 9
}
