/**
 * playerRacialTraits.js
 * Player Mode: Racial combat traits and ability bonuses reference
 * Pure JS — no React dependencies.
 */

export const RACIAL_COMBAT_TRAITS = [
  { race: 'Dwarf', traits: ['Darkvision 60ft', 'Dwarven Resilience (advantage vs poison, resistance to poison damage)', 'Stonecunning (double proficiency on stone History)'] },
  { race: 'Hill Dwarf', traits: ['Dwarven Toughness (+1 HP per level)'], parent: 'Dwarf' },
  { race: 'Mountain Dwarf', traits: ['Light/Medium armor proficiency'], parent: 'Dwarf' },
  { race: 'Elf', traits: ['Darkvision 60ft', 'Fey Ancestry (advantage vs charm, immune to sleep)', 'Trance (4 hours instead of 8)'] },
  { race: 'High Elf', traits: ['Extra cantrip (wizard list)', 'Extra language'], parent: 'Elf' },
  { race: 'Wood Elf', traits: ['Fleet of Foot (35ft speed)', 'Mask of the Wild (hide in light natural obscurement)'], parent: 'Elf' },
  { race: 'Drow', traits: ['Superior Darkvision 120ft', 'Sunlight Sensitivity (disadvantage in sunlight)', 'Drow Magic (Dancing Lights, Faerie Fire, Darkness)'], parent: 'Elf' },
  { race: 'Halfling', traits: ['Lucky (reroll natural 1s on attacks/checks/saves)', 'Brave (advantage vs frightened)', 'Halfling Nimbleness (move through larger creatures)'] },
  { race: 'Lightfoot Halfling', traits: ['Naturally Stealthy (hide behind Medium+ creatures)'], parent: 'Halfling' },
  { race: 'Stout Halfling', traits: ['Stout Resilience (advantage vs poison, resistance to poison)'], parent: 'Halfling' },
  { race: 'Human', traits: ['+1 to all ability scores', 'Extra language'] },
  { race: 'Variant Human', traits: ['+1 to two scores', 'Extra skill', 'Extra feat'] },
  { race: 'Dragonborn', traits: ['Breath Weapon (2d6, scales with level)', 'Damage Resistance (breath weapon type)'] },
  { race: 'Gnome', traits: ['Darkvision 60ft', 'Gnome Cunning (advantage on INT/WIS/CHA saves vs magic)'] },
  { race: 'Half-Elf', traits: ['Darkvision 60ft', 'Fey Ancestry', '+2 CHA, +1 to two other scores', '2 extra skills'] },
  { race: 'Half-Orc', traits: ['Darkvision 60ft', 'Relentless Endurance (drop to 1 HP instead of 0, 1/long rest)', 'Savage Attacks (extra die on melee crit)'] },
  { race: 'Tiefling', traits: ['Darkvision 60ft', 'Hellish Resistance (fire resistance)', 'Infernal Legacy (Thaumaturgy, Hellish Rebuke, Darkness)'] },
  { race: 'Aasimar', traits: ['Darkvision 60ft', 'Celestial Resistance (necrotic + radiant resistance)', 'Healing Hands (heal = level, 1/long rest)'] },
  { race: 'Goliath', traits: ['Stone\'s Endurance (reduce damage by 1d12+CON, 1/short rest)', 'Powerful Build (count as Large for carry/push)', 'Mountain Born (cold resistance, acclimated to high altitude)'] },
  { race: 'Firbolg', traits: ['Hidden Step (invisible until next turn, 1/short rest)', 'Speech of Beast and Leaf', 'Powerful Build'] },
  { race: 'Tabaxi', traits: ['Darkvision 60ft', 'Feline Agility (double speed until you stop, recharges when you don\'t move)', 'Cat\'s Claws (1d4 slashing, climb 20ft)'] },
  { race: 'Kenku', traits: ['Mimicry (replicate sounds)', 'Expert Forgery (advantage to produce forgeries)'] },
  { race: 'Tortle', traits: ['Natural Armor (AC 17, can\'t wear armor)', 'Shell Defense (action: +4 AC, prone, speed 0)', 'Hold Breath (1 hour)'] },
];

export function getRacialTraits(race) {
  const entry = RACIAL_COMBAT_TRAITS.find(r => r.race.toLowerCase() === (race || '').toLowerCase());
  if (!entry) return [];
  const traits = [...entry.traits];
  if (entry.parent) {
    const parent = RACIAL_COMBAT_TRAITS.find(r => r.race.toLowerCase() === entry.parent.toLowerCase());
    if (parent) traits.unshift(...parent.traits);
  }
  return traits;
}

export function hasDarkvision(race) {
  const traits = getRacialTraits(race);
  return traits.some(t => t.toLowerCase().includes('darkvision'));
}

export function getDarkvisionRange(race) {
  const traits = getRacialTraits(race);
  const dv = traits.find(t => t.toLowerCase().includes('darkvision'));
  if (!dv) return 0;
  const match = dv.match(/(\d+)ft/);
  return match ? parseInt(match[1]) : 60;
}
