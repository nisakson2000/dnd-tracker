/**
 * playerEnvironmentalHazardsGuide.js
 * Player Mode: Environmental hazards — damage, survival, and exploitation
 * Pure JS — no React dependencies.
 */

export const FALLING_DAMAGE = {
  rule: '1d6 bludgeoning per 10 feet fallen, max 20d6 (200 feet).',
  average: { '10ft': '3.5', '20ft': '7', '50ft': '17.5', '100ft': '35', '200ft': '70 (max)' },
  landing: 'Land prone. Fall is instantaneous (no reaction except Feather Fall or Slow Fall).',
  objects: 'Heavy objects deal damage as falling: 1d6 per 10 feet per 200 lbs.',
  tips: [
    'Feather Fall (L1): reaction, 5 creatures, 60ft/round descent, 0 damage. Always prepare.',
    'Monk Slow Fall: reduce by 5×level. L10 Monk reduces 50 damage.',
    'Wild Shape: if fall would drop beast to 0 HP, excess carries to real form. Buffer.',
    'Levitate, Fly, and similar spells prevent falling entirely.',
  ],
};

export const FIRE_HAZARDS = {
  lava: '10d10 fire damage per round submerged. 2d10 on contact. Very few resistances help.',
  normalFire: '1d10 fire damage per round. Ignites flammable objects.',
  spreading: 'Fire spreads in dry conditions. DM discretion.',
  survival: [
    'Fire resistance halves damage. Fire immunity negates.',
    'Absorb Elements (L1): halve one fire damage instance as reaction.',
    'Protection from Energy (L3): fire resistance for 1 hour (concentration).',
    'Tieflings, Red/Gold Dragonborn have fire resistance.',
    'Potion of Fire Resistance: 1 hour, no concentration.',
  ],
};

export const WATER_HAZARDS = {
  drowning: {
    rule: 'Can hold breath for 1 + CON mod minutes (minimum 30 seconds). Then 0 HP at start of next turn if still suffocating.',
    note: 'This means you go straight to 0 HP and start dying. Not gradual damage — instant incapacitation.',
  },
  swimming: 'Each foot costs 1 extra foot of movement (double cost). Rough water may require Athletics checks.',
  underwater: 'Melee disadvantage (except daggers, javelins, shortswords, spears, tridents). Ranged auto-miss beyond normal range, disadvantage within.',
  rapids: 'DC 10-15 Athletics to avoid being swept away. 1d6-2d6 bludgeoning if slammed into rocks.',
  survival: [
    'Water Breathing (L3, ritual): 10 creatures breathe underwater for 24 hours.',
    'Alter Self: grow gills (10 min, concentration).',
    'Triton, Sea Elf, Water Genasi can breathe underwater.',
    'Cap of Water Breathing: unlimited underwater breathing (attunement).',
  ],
};

export const EXTREME_TEMPERATURES = {
  extremeHeat: {
    effect: 'DC 5 CON save each hour (DC +1 per hour). Fail = 1 level exhaustion.',
    mitigation: 'Drink water doubles, cold resistance, Create or Destroy Water, appropriate clothing.',
  },
  extremeCold: {
    effect: 'DC 10 CON save each hour or gain 1 level exhaustion. Cold resistance = auto-succeed.',
    mitigation: 'Cold weather gear, fire, cold resistance, warming spells.',
  },
  highAltitude: {
    effect: 'Above 10,000ft: each hour without acclimatization, DC 10 CON save or 1 exhaustion.',
    mitigation: 'Acclimatization (30+ days), flying mounts, magic.',
  },
};

export const OTHER_HAZARDS = [
  { hazard: 'Quicksand', effect: 'Sink 1d4+1 feet/round. DC 10 Athletics to move 5ft. Fully submerged = suffocating.', counter: 'Spread weight (prone). Ally pulls you. Fly. Shape Water.' },
  { hazard: 'Slippery Ice', effect: 'Difficult terrain. DC 10 Acrobatics or fall prone.', counter: 'Climbing pitons, Spider Climb, careful movement.' },
  { hazard: 'Thin Ice', effect: 'DC 10 DEX save or break through. Cold water = DC 10 CON or 1 exhaustion/min.', counter: 'Spread weight, test ahead, distribute party.' },
  { hazard: 'Avalanche/Rockslide', effect: '4d10 bludgeoning, DEX save for half. Buried = suffocating.', counter: 'Avoid triggering (quiet movement), Feather Fall, Wall of Force.' },
  { hazard: 'Poisonous Gas', effect: 'DC 12-15 CON save or poisoned/damage.', counter: 'Hold breath, Gust of Wind, Protection from Poison, gas masks.' },
  { hazard: 'Razorvine', effect: '5(1d10) slashing for entering/starting turn. Difficult terrain.', counter: 'Fire burns it. Fly over. Push enemies into it.' },
  { hazard: 'Desecrated Ground', effect: 'Undead in area have advantage on saves. Dead may rise.', counter: 'Hallow spell, Dispel Evil and Good, avoid resting there.' },
  { hazard: 'Frigid Water', effect: 'DC 10 CON save per minute or 1 level exhaustion.', counter: 'Get out fast. Fire/warmth. Cold resistance.' },
];

export const EXPLOIT_HAZARDS_TIPS = [
  'Shove enemies into lava, off cliffs, or into hazards. Forced movement doesn\'t provoke OAs.',
  'Thunderwave/Repelling Blast enemies into environmental dangers. Creative use of push effects.',
  'Create hazards: Spike Growth, Wall of Fire, Cloud of Daggers. Force enemies through them.',
  'Mold Earth to dig pits. Enemies fall in for falling damage + difficult terrain escape.',
  'Heat Metal on enemies in heavy armor near flammable terrain. They ignite surroundings.',
  'Use environmental hazards as cover: stand behind fire, enemies won\'t chase through.',
];
