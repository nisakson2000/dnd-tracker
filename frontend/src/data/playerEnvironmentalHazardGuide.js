/**
 * playerEnvironmentalHazardGuide.js
 * Player Mode: Environmental hazards — identification, avoidance, and exploitation
 * Pure JS — no React dependencies.
 */

export const NATURAL_HAZARDS = [
  { hazard: 'Extreme Cold', effect: 'CON save DC 10/hour or gain 1 exhaustion level.', prevention: 'Cold weather gear, Endure Elements, fire spells, Ranger natural explorer.', severity: 'High' },
  { hazard: 'Extreme Heat', effect: 'CON save DC 5+1/hour or gain 1 exhaustion level. Water consumption doubles.', prevention: 'Water, shade, Create Water, cold resistance.', severity: 'High' },
  { hazard: 'Strong Wind', effect: 'Disadvantage on ranged attacks and Perception (hearing). Extinguishes flames.', prevention: 'Take cover, avoid ranged, use melee or spells.', severity: 'Moderate' },
  { hazard: 'Heavy Precipitation', effect: 'Lightly obscured. Extinguishes flames. Disadvantage Perception (sight/hearing).', prevention: 'Darkvision helps. Tiny Hut for rest.', severity: 'Low-Moderate' },
  { hazard: 'Quicksand', effect: 'Sink 1d4+1 feet per round. Restrained. STR check DC 10+depth to escape.', prevention: 'Perception/Survival to spot. Rope. Fly/Levitate.', severity: 'High' },
  { hazard: 'Thin Ice', effect: 'DEX save or fall through. Cold water: CON save or incapacitated.', prevention: 'Perception to spot. Spread weight. Rope safety line.', severity: 'High' },
  { hazard: 'Avalanche/Rockslide', effect: '4d10 bludgeoning + buried (restrained, suffocating). DEX save halves, not buried.', prevention: 'Avoid loud noises near slopes. Perception to spot warnings.', severity: 'Deadly' },
  { hazard: 'Lava', effect: '10d10 fire damage on contact. 18d10 if submerged.', prevention: 'Don\'t touch it. Fly. Fire resistance helps but still massive.', severity: 'Deadly' },
  { hazard: 'Desecrated Ground', effect: 'Undead have advantage on saves. Healing spells are halved.', prevention: 'Hallow spell. Consecrate the area (Cleric).', severity: 'Moderate' },
  { hazard: 'Razorvine', effect: '5 (1d10) slashing on contact. 10ft of movement per round through it.', prevention: 'Cut it. Burn it. Go around. Fly over.', severity: 'Low' },
];

export const DUNGEON_HAZARDS = [
  { hazard: 'Flooding Room', effect: 'Water rises. Suffocation after CON mod+1 minutes.', counter: 'Find the drain/lever. Shape Water. Water Breathing. Escape quickly.' },
  { hazard: 'Collapsing Ceiling', effect: '4d10 bludgeoning (half on DEX save). Buried = restrained.', counter: 'Perception/Investigation to spot weak points. Don\'t trigger.' },
  { hazard: 'Poison Gas', effect: 'CON save or poisoned/damage. Fills area over time.', counter: 'Gust of Wind to clear. Hold breath. Poison resistance/immunity.' },
  { hazard: 'Darkness (magical)', effect: 'Can\'t see. Attacks at disadvantage. Spells requiring sight fail.', counter: 'Dispel Magic. Devil\'s Sight. Daylight spell. Truesight.' },
  { hazard: 'Silence (magical)', effect: 'Can\'t cast spells with verbal components.', counter: 'Move out of area. Dispel Magic. Subtle Spell metamagic.' },
  { hazard: 'Antimagic Zone', effect: 'All magic suppressed. Magic items don\'t work. Spells fail.', counter: 'Leave the zone. Use mundane weapons. Pure martial approach.' },
  { hazard: 'Acid Pool', effect: '2d6-4d6 acid damage per round of contact.', counter: 'Don\'t fall in. Jump over. Fly. Acid resistance.' },
  { hazard: 'Spinning Blades', effect: '2d10 slashing. DEX save to dodge.', counter: 'Perception to spot. Mage Hand to trigger. Time your passage.' },
];

export const EXPLOIT_HAZARDS_OFFENSIVELY = [
  { combo: 'Push into lava/acid', method: 'Shove, Repelling Blast, Thunderwave, Thorn Whip pull.', damage: '10d10 (lava) or 4d6 (acid). No save against the hazard.', rating: 'S+' },
  { combo: 'Spike Growth + forced movement', method: 'Push/pull through Spike Growth. 2d4 per 5ft.', damage: '8d4+ per push. Stackable.', rating: 'S+' },
  { combo: 'Reverse Gravity over hazard', method: 'Cast over lava/spikes. Enemies fall into it.', damage: 'Hazard damage + fall damage.', rating: 'S' },
  { combo: 'Wall of Force + hazard', method: 'Trap enemies in hazard zone. They can\'t escape.', damage: 'Continuous hazard damage.', rating: 'S' },
  { combo: 'Grapple + drag', method: 'Grapple enemy, drag into hazard at half speed.', damage: 'Hazard-dependent.', rating: 'A+' },
];

export const HAZARD_TIPS = [
  'Perception and Investigation find hazards. Always be looking.',
  'Mage Hand: trigger traps from 30ft away. Free and safe.',
  'Fly trivializes most ground-based hazards.',
  'Environmental damage has no save usually. Shoving enemies into lava = guaranteed 10d10.',
  'Spike Growth + any forced movement = massive damage combo.',
  'Create Water extinguishes fires. Shape Water manipulates water hazards.',
  'Gust of Wind clears poison gas and fog.',
  'Antimagic Zones: martials shine. Let the Fighter handle it.',
  'Desecrated Ground halves healing. Remove it or fight elsewhere.',
  'Lava is 10d10 on contact. Even fire resistance only halves. Avoid at all costs.',
];
