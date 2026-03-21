/**
 * playerTerrainAdvantageGuide.js
 * Player Mode: Using terrain and environment to your advantage in combat
 * Pure JS — no React dependencies.
 */

export const TERRAIN_PHILOSOPHY = {
  concept: 'The battlefield is a weapon. Positioning and terrain matter as much as your stats.',
  tip: 'Before combat: look at the map. Where is cover? Chokepoints? High ground? Hazards? Plan your positioning.',
};

export const COVER_RULES = [
  { type: 'Half cover', acBonus: '+2 AC, +2 DEX saves', examples: 'Low wall, furniture, another creature', note: 'Most common. Stand behind anything waist-high.' },
  { type: 'Three-quarters cover', acBonus: '+5 AC, +5 DEX saves', examples: 'Arrow slit, thick tree, portcullis', note: '+5 AC is massive. Equivalent to Shield spell permanently.' },
  { type: 'Total cover', acBonus: 'Can\'t be targeted', examples: 'Full wall, closed door, around a corner', note: 'You can\'t be attacked at all. Use to break line of sight.' },
];

export const TERRAIN_TACTICS = [
  { tactic: 'Chokepoints', detail: 'Funnel enemies through a narrow space. One tank blocks while casters AoE the line.', rating: 'S', example: 'Doorway, bridge, narrow corridor. Spirit Guardians in the chokepoint.' },
  { tactic: 'High ground', detail: 'Ranged attacks from elevation. Some DMs grant advantage or +2 to hit.', rating: 'A+', example: 'Rooftop, cliff edge, balcony. Archers and casters above melee.' },
  { tactic: 'Cover cycling', detail: 'Attack from behind cover → duck back. Enemies must approach or take disadvantage.', rating: 'A+', example: 'Pillar, wall corner. Pop out, attack, step back.' },
  { tactic: 'Water/swimming', detail: 'Force enemies into water. Non-swimmers are slowed. Water is difficult terrain.', rating: 'A', example: 'River crossing, flooded room. Thunderwave enemies into water.' },
  { tactic: 'Darkness manipulation', detail: 'Destroy light sources. Darkvision users fight normally; others are blind.', rating: 'A', example: 'Extinguish torches. Darkness spell. Shadow Monk.' },
  { tactic: 'Elevation denial', detail: 'Fly or levitate to places melee enemies can\'t reach.', rating: 'S', example: 'Fly 30ft up. Melee enemies can\'t touch you. Rain down spells.' },
  { tactic: 'Cliff/pit hazards', detail: 'Push enemies off ledges or into pits. Thunderwave, Repelling Blast, shove.', rating: 'A+', example: 'Near a cliff? Thunderwave = 1d8 + fall damage + prone.' },
];

export const TERRAIN_CREATING_SPELLS = [
  { spell: 'Spike Growth', level: 2, effect: '20ft radius thorns, 2d4/5ft moved, concealed.', rating: 'S' },
  { spell: 'Plant Growth', level: 3, effect: '100ft radius, costs 4ft per 1ft moved (no save).', rating: 'S' },
  { spell: 'Wall of Fire', level: 4, effect: 'Splits battlefield, 5d8 fire to crossers.', rating: 'S' },
  { spell: 'Wall of Force', level: 5, effect: 'Invincible wall. No save. Splits encounter.', rating: 'S+' },
  { spell: 'Fog Cloud', level: 1, effect: 'Blocks line of sight. Shuts down ranged enemies.', rating: 'A' },
  { spell: 'Grease', level: 1, effect: '10ft square, DEX save or fall prone.', rating: 'A' },
  { spell: 'Web', level: 2, effect: 'Restrained on fail. Difficult terrain. Flammable.', rating: 'S' },
  { spell: 'Sleet Storm', level: 3, effect: 'Difficult terrain + concentration checks + prone checks.', rating: 'A+' },
  { spell: 'Darkness', level: 2, effect: 'Heavily obscured. Blocks most spellcasting.', rating: 'A' },
];

export const ENVIRONMENTAL_HAZARDS = [
  { hazard: 'Lava', damage: '10d10 fire (entering/starting turn)', note: 'Push enemies in with forced movement.' },
  { hazard: 'Falling', damage: '1d6 per 10ft (max 20d6)', note: 'Shove, Thunderwave, Gust off ledges.' },
  { hazard: 'Deep water', effect: 'Swimming = difficult terrain in heavy armor. Drowning risk.', note: 'Heavy armor disadvantage on Athletics to swim.' },
  { hazard: 'Fire/burning', damage: '1d10 fire per round in flames', note: 'Push enemies into burning terrain.' },
  { hazard: 'Extreme cold', effect: 'CON save or exhaustion', note: 'Long-term hazard for wilderness exploration.' },
  { hazard: 'Thin ice', effect: 'Weight breaks it → falling into freezing water', note: 'Lure heavy enemies onto thin ice.' },
];

export const POSITIONING_TIPS = [
  'Casters: stay behind martials. Let the Fighter be the front line.',
  'Ranged: stay at maximum effective range. 600ft longbow range means you should be FAR back.',
  'Tanks: position between enemies and squishies. Block movement with your body.',
  'Flanking (optional rule): position opposite an ally for advantage on melee attacks.',
  'Never cluster together — one Fireball shouldn\'t hit the whole party.',
  'Control the center of the room. Enemies on the edges have fewer options.',
  'Always leave yourself an escape route. Don\'t get cornered.',
];
