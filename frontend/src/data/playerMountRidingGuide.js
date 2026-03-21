/**
 * playerMountRidingGuide.js
 * Player Mode: Mounted combat rules, builds, and optimization
 * Pure JS — no React dependencies.
 */

export const MOUNTED_COMBAT_RULES = {
  mounting: 'Costs half your movement to mount/dismount.',
  controlledMount: {
    description: 'You control the mount (willing creature, INT < yours).',
    initiative: 'Mount acts on YOUR turn.',
    actions: 'Mount can only Dash, Disengage, or Dodge.',
  },
  independentMount: {
    description: 'Mount acts independently (intelligent creatures).',
    initiative: 'Mount has its own initiative and full actions.',
  },
  falling: 'If mount knocked prone: DC 10 DEX save or fall off prone.',
  sizeReq: 'Mount must be at least one size larger than you.',
};

export const MOUNTED_COMBATANT_FEAT = {
  effects: [
    'Advantage on melee attacks vs unmounted creatures smaller than mount.',
    'Force attacks targeting mount to target you instead.',
    'Mount takes 0 damage on successful DEX save (Evasion for mount).',
  ],
  rating: 'S+ (for mounted builds)',
};

export const BEST_MOUNTS = [
  { mount: 'Warhorse', source: '400 gp', speed: '60ft', hp: '19', rating: 'A', note: 'Trampling Charge.' },
  { mount: 'Find Steed', source: 'Paladin L2 spell', speed: '60ft', rating: 'S+', note: 'Shares self-targeting spells. Resummon if killed.' },
  { mount: 'Find Greater Steed', source: 'Paladin L4 spell', speed: '90ft (Pegasus)', rating: 'S+', note: 'Flying mount. Best mobility.' },
  { mount: 'Phantom Steed', source: 'Wizard L3 Ritual', speed: '100ft', hp: '1', rating: 'A+', note: '100ft speed. Free ritual cast.' },
  { mount: 'Steel Defender', source: 'Battle Smith L3', speed: '40ft', rating: 'A+ (Small only)', note: 'Medium. Only Small riders.' },
];

export const LANCE_TACTICS = {
  damage: '1d12 piercing',
  properties: 'Reach. Disadvantage within 5ft. One-handed while mounted.',
  rating: 'S (mounted)',
  combo: 'Lance + Shield + Mounted Combatant = best mounted loadout.',
};

export const MOUNTED_BUILDS = [
  {
    name: 'Paladin Cavalier',
    mount: 'Find Steed → Find Greater Steed',
    strategy: 'Lance + Shield. Share Haste with steed. Smite on advantage hits.',
    rating: 'S+',
  },
  {
    name: 'Small Race Indoor Mount',
    mount: 'Medium creatures (Wolf, Dog, Steel Defender)',
    strategy: 'Ride Medium mounts in dungeons. Works indoors.',
    rating: 'A+',
  },
  {
    name: 'Phantom Steed Kiter',
    mount: 'Phantom Steed (ritual)',
    strategy: '100ft speed. Cast spells while kiting. Free to ritual cast.',
    rating: 'A+',
  },
];

export const MOUNTED_TIPS = [
  'Mounted Combatant feat: mandatory for mount builds.',
  'Find Steed shares self-targeting spells. Haste both = amazing.',
  'Lance: 1d12 one-handed while mounted. Best mounted weapon.',
  'Controlled mount can Disengage: free escape after your attacks.',
  'Small races ride Medium creatures. Works indoors/dungeons.',
  'Phantom Steed: 100ft speed, ritual cast, free.',
  'Flying mounts (Pegasus): best mobility in the game.',
  'Mount can Dodge while you attack. Harder to kill your mount.',
];
