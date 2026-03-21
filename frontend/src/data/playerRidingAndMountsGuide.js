/**
 * playerRidingAndMountsGuide.js
 * Player Mode: Mounted combat rules, best mounts, and tactics
 * Pure JS — no React dependencies.
 */

export const MOUNTED_COMBAT_RULES = {
  mounting: 'Mount/dismount costs half your movement. Mount must be one size larger than you.',
  controlledMount: {
    what: 'You control the mount (most cases for normal mounts).',
    initiative: 'Mount acts on your initiative. Moves as you direct.',
    actions: 'Mount can only Dash, Disengage, or Dodge. Cannot attack.',
    note: 'Horse, warhorse, etc. You ride and control.',
  },
  independentMount: {
    what: 'Mount acts on its own. DM controls it.',
    initiative: 'Mount rolls its own initiative. Takes any action.',
    actions: 'Mount can attack, use abilities, etc.',
    note: 'Intelligent mounts (dragon, pegasus) or DM ruling.',
  },
  falling: 'If mount is knocked prone, DC 10 DEX save or fall prone in adjacent space.',
  forced: 'If forced off mount (shoved), same DC 10 DEX save.',
};

export const MOUNTED_COMBATANT_FEAT = {
  name: 'Mounted Combatant',
  benefits: [
    'Advantage on melee attacks vs creatures smaller than your mount.',
    'Force attacks targeting your mount to target you instead.',
    'Mount takes no damage on DEX save success (half on fail becomes zero).',
  ],
  rating: 'S (for mounted builds)',
  note: 'Essential for mounted builds. Turns mount from liability to asset.',
};

export const BEST_MOUNTS = [
  { mount: 'Warhorse', cr: '1/2', speed: '60ft', hp: '19', cost: '400gp', note: 'Best mundane mount. Trampling Charge (prone + bonus attack).' },
  { mount: 'Riding Horse', cr: '1/4', speed: '60ft', hp: '13', cost: '75gp', note: 'Cheaper. Fragile. Fine for travel.' },
  { mount: 'Mastiff', cr: '1/8', speed: '40ft', hp: '5', cost: '25gp', note: 'For Small races (Halfling, Gnome). Very fragile.' },
  { mount: 'Giant Lizard', cr: '1/4', speed: '30ft, climb 30ft', hp: '19', cost: 'varies', note: 'Spider Climb mount. Climb walls while mounted.' },
  { mount: 'Find Steed (L2 Paladin)', cr: 'varies', speed: '60ft+', hp: 'varies', cost: 'Free (spell)', note: 'Best mount option. Intelligent. Telepathic. Shares self-target spells.' },
  { mount: 'Find Greater Steed (L4 Paladin)', cr: 'varies', speed: '60-90ft', hp: 'varies', cost: 'Free (spell)', note: 'Pegasus (fly 90ft), Griffon, Dire Wolf. Flying mount.' },
  { mount: 'Phantom Steed (L3 Wizard)', cr: '—', speed: '100ft', hp: '1 (disappears)', cost: 'Free (ritual)', note: 'Fastest mount. Ritual cast = no slot. Disappears if hit.' },
];

export const FIND_STEED_TRICKS = {
  spellSharing: 'Spells you cast targeting only yourself also target your steed.',
  examples: [
    { spell: 'Haste', effect: 'Both you AND your steed are hasted. Double movement + extra action.' },
    { spell: 'Death Ward', effect: 'Both get Death Ward. Mount survives a lethal hit.' },
    { spell: 'Shield of Faith', effect: '+2 AC for both. Concentration.' },
    { spell: 'Aura of Vitality', effect: 'Heal both. Bonus action healing.' },
  ],
  note: 'Find Steed spell sharing is incredibly powerful.',
};

export const MOUNTED_TACTICS = [
  { tactic: 'Hit and Run', how: 'Ride in, attack, mount Disengages, ride out. 60ft = enter and leave melee.', note: 'No AoO. Attack and retreat every turn.' },
  { tactic: 'Lance Charge', how: 'Lance: reach (10ft), 1d12 damage, one-handed while mounted.', note: 'Lance + Shield = 1d12 + AC 20. Best mounted weapon.' },
  { tactic: 'Height Advantage', how: 'Some DMs grant advantage on melee attacks from mounted elevation.', note: 'Not RAW but common house rule. Ask your DM.' },
  { tactic: 'Jousting Shield', how: 'Shield + lance + Mounted Combatant feat.', note: 'AC 20+, 1d12+STR, advantage vs smaller targets.' },
];

export const MOUNTED_TIPS = [
  'Mount/dismount = half your movement. Plan transitions.',
  'Controlled mounts can only Dash, Disengage, or Dodge.',
  'Find Steed: best mount spell. Shares self-target spells.',
  'Mounted Combatant feat: essential for mounted builds.',
  'Lance: 1d12, reach, one-handed while mounted. Best mounted weapon.',
  'Hit and run: ride in, attack, mount Disengages, ride out.',
  'Phantom Steed: 100ft speed, ritual cast, no spell slot.',
  'Small races can ride Medium mounts (mastiff, pony).',
  'Find Greater Steed: flying Pegasus mount. Game-changing.',
  'Protect your mount. Mounted Combatant redirects attacks to you.',
];
