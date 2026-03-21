/**
 * playerCommandSpellGuide.js
 * Player Mode: Command spell — best one-word commands ranked
 * Pure JS — no React dependencies.
 */

export const COMMAND_BASICS = {
  spell: 'Command',
  level: 1,
  school: 'Enchantment',
  castTime: '1 action',
  range: '60 feet',
  duration: 'Instantaneous (1 round effect)',
  save: 'WIS save',
  components: 'V',
  classes: ['Cleric', 'Paladin', 'Fiend Warlock', 'Order Domain'],
  note: 'Verbal only — works while restrained, grappled, or hands full. No concentration.',
};

export const BEST_COMMANDS = [
  { command: 'Grovel', effect: 'Falls prone, ends turn. Melee allies get advantage. Wastes enemy action.', rating: 'S', note: 'Best overall. Prone = advantage for melee, disadvantage for ranged enemy attacks.' },
  { command: 'Flee', effect: 'Moves full speed away by safest route. Provokes OA from everyone.', rating: 'S', note: 'Triggers opportunity attacks from EVERY ally in range. Devastating with Sentinel.' },
  { command: 'Halt', effect: 'Doesn\'t move. Takes no actions. Just stands there.', rating: 'A+', note: 'Full action denial. Enemy loses entire turn. Best for single-target lockdown.' },
  { command: 'Drop', effect: 'Drops whatever it\'s holding.', rating: 'A', note: 'Disarms the enemy. Ally picks up their weapon. L1 slot to remove a weapon.' },
  { command: 'Approach', effect: 'Moves toward you by safest route.', rating: 'B+', note: 'Pull ranged enemies into melee. Pull enemies through hazards (Spirit Guardians, Spike Growth).' },
  { command: 'Betray', effect: 'DM discretion — attack nearest ally?', rating: 'B', note: 'Not RAW guaranteed. Some DMs allow, some don\'t. Ask your DM first.' },
  { command: 'Surrender', effect: 'DM discretion — drops weapons, goes prone?', rating: 'B', note: 'Great for RP. Not combat-reliable since effect is DM-dependent.' },
  { command: 'Undress', effect: 'DM discretion — remove armor?', rating: 'C', note: 'Funny but armor takes time. DM might rule only one piece removed.' },
];

export const COMMAND_UPCAST = {
  note: 'Each slot level above 1st targets one additional creature within 30 feet of each other.',
  scaling: [
    { slot: 1, targets: 1 },
    { slot: 2, targets: 2 },
    { slot: 3, targets: 3 },
    { slot: 4, targets: 4 },
    { slot: 5, targets: 5 },
  ],
  tip: 'L3 Command: "Grovel" on 3 enemies. All prone. All waste their turn. Party gets advantage on all melee attacks.',
};

export const COMMAND_COMBOS = [
  { combo: 'Command (Flee) + Sentinel', effect: 'Enemy provokes OA → Sentinel stops them at 0 speed → they wasted movement AND took damage.', rating: 'S' },
  { combo: 'Command (Approach) + Spirit Guardians', effect: 'Enemy walks into SG aura → takes 3d8 radiant → stuck in aura.', rating: 'S' },
  { combo: 'Command (Approach) + Spike Growth', effect: 'Enemy forced through Spike Growth → 2d4 per 5 feet moved.', rating: 'A+' },
  { combo: 'Command (Grovel) + Melee Party', effect: 'Enemy prone → all melee allies have advantage → GWM/Sharpshooter free hits.', rating: 'S' },
  { combo: 'Command (Drop) + Mage Hand', effect: 'Enemy drops weapon → Mage Hand moves it away → disarmed for the fight.', rating: 'A' },
  { combo: 'Order Domain Voice of Authority', effect: 'Cast Command → ally gets reaction attack → Command effect still happens.', rating: 'S' },
];

export const COMMAND_LIMITATIONS = [
  'Doesn\'t work on undead.',
  'Doesn\'t work if the command is directly harmful (e.g., "die" just makes them fall prone for a turn).',
  'WIS save — many monsters have decent WIS.',
  'One round only — effect ends when their next turn ends.',
  'DM has final say on creative commands.',
];
