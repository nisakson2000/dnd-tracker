/**
 * playerMovementSpeedGuide.js
 * Player Mode: Movement speed — optimization, difficult terrain, dash, flight
 * Pure JS — no React dependencies.
 */

export const MOVEMENT_BASICS = {
  standard: '30ft per turn for most races.',
  dash: 'Action: double your movement for this turn.',
  difficult: 'Difficult terrain: costs 2ft per 1ft moved.',
  prone: 'Standing from prone costs half your movement.',
  jumping: 'Long jump: STR score in feet (with 10ft running start). High jump: 3 + STR mod feet.',
};

export const SPEED_BY_RACE = [
  { race: 'Aarakocra', speed: '25ft walk, 50ft fly', note: 'Fastest flight at L1.' },
  { race: 'Wood Elf', speed: '35ft', note: 'Fastest walking race.' },
  { race: 'Centaur', speed: '40ft', note: 'No armor penalty. Charge feature.' },
  { race: 'Tabaxi', speed: '30ft (double once per turn)', note: 'Feline Agility: double speed. Reset by not moving.' },
  { race: 'Most races', speed: '30ft', note: 'Standard speed.' },
  { race: 'Dwarf', speed: '25ft', note: 'Not reduced by heavy armor. Squat Nimbleness feat: +5ft.' },
  { race: 'Halfling/Gnome', speed: '25ft', note: 'Small. Squat Nimbleness feat: +5ft.' },
];

export const SPEED_BOOSTS = [
  { source: 'Monk Unarmored Movement', bonus: '+10ft at L2, +30ft at L18', note: 'Best class speed. Scales every few levels.' },
  { source: 'Barbarian Fast Movement', bonus: '+10ft at L5', note: 'While not wearing heavy armor.' },
  { source: 'Mobile feat', bonus: '+10ft', note: 'Also: free Disengage after attacking. Great value.' },
  { source: 'Longstrider spell', bonus: '+10ft for 1 hour', note: 'No concentration. Self or touch.' },
  { source: 'Haste spell', bonus: 'Double speed', note: 'Concentration. Also +2 AC and extra action.' },
  { source: 'Boots of Speed', bonus: 'Double speed (BA, 10 min)', note: 'Magic item. Click heels.' },
  { source: 'Elk Totem (Barbarian)', bonus: '+15ft while raging', note: 'Stacks with Fast Movement.' },
  { source: 'Deft Explorer (Ranger)', bonus: '+5ft at L6', note: 'Also gain climb and swim speed.' },
  { source: 'Phantom Steed', bonus: '100ft mount speed', note: 'Ritual. Free 100ft mount. Disappears when damaged.' },
];

export const MOVEMENT_STACKING = {
  example: {
    base: 'Wood Elf Monk L10',
    calculation: '35 (Wood Elf) + 20 (Monk L10) + 10 (Mobile) + 10 (Longstrider) = 75ft',
    withDash: '150ft (Dash action)',
    withDoubleDash: '225ft (Step of the Wind + Dash)',
    withHaste: '150ft base (Haste doubles). Dash: 300ft. Step: 450ft.',
    note: 'Tabaxi doubles this once: 900ft in one turn. Yes really.',
  },
};

export const DIFFICULT_TERRAIN = {
  what: '2ft of movement per 1ft traveled.',
  sources: ['Natural: rubble, jungle, swamp, ice.', 'Spells: Spike Growth, Plant Growth, Web, Grease.', 'Creatures: allies\' spaces are difficult terrain.'],
  ignore: [
    { source: 'Freedom of Movement', note: 'Ignore magical difficult terrain and restraints.' },
    { source: 'Ranger (Natural Explorer)', note: 'Ignore nonmagical difficult terrain in favored terrain.' },
    { source: 'Deft Explorer (Ranger L6)', note: 'Climb/swim speed. Some terrain bypassed.' },
    { source: 'Land\'s Stride (Ranger L8)', note: 'Ignore nonmagical difficult terrain.' },
    { source: 'Spider Climb', note: 'Walk on walls/ceiling. Bypass ground terrain.' },
    { source: 'Flight', note: 'Fly over everything. Best terrain bypass.' },
  ],
};

export const MOVEMENT_TIPS = [
  'Dash doubles your movement. Use when you need to close distance or flee.',
  'Monk: fastest class. +30ft by L18. Step of the Wind for free Dash.',
  'Mobile feat: +10ft and free Disengage. Best movement feat.',
  'Longstrider: +10ft, no concentration, 1 hour. Cast before combat.',
  'Haste: doubles speed. Also +2 AC and extra action.',
  'Phantom Steed: 100ft speed mount. Ritual cast. Free travel.',
  'Difficult terrain: 2ft per 1ft. Spike Growth makes it even worse.',
  'Freedom of Movement: ignore magical difficult terrain.',
  'Jump: STR score in feet (long jump). Plan your ability scores.',
  'Tabaxi Feline Agility: double speed once per rest. Insane burst.',
];
