/**
 * playerMountedCombatBuildGuide.js
 * Player Mode: Mounted combat rules and optimization
 * Pure JS — no React dependencies.
 */

export const MOUNTED_COMBAT_RULES = {
  mounting: 'Mounting/dismounting costs half your movement. Mount must be one size larger.',
  controlled: 'You control the mount. It uses YOUR initiative. Can only Dash, Disengage, or Dodge. Can\'t attack.',
  independent: 'Mount acts on its own initiative. Can attack but DM controls it.',
  movement: 'Use the mount\'s speed, not yours.',
  dismount: 'Mount knocked prone: DC 10 DEX save or fall prone yourself.',
};

export const MOUNTED_COMBATANT_FEAT = {
  benefits: [
    'Advantage on melee attacks vs unmounted creatures smaller than mount.',
    'Redirect attacks targeting mount to target you instead.',
    'Mount Evasion: no damage on DEX save success, half on fail.',
  ],
  rating: 'S (for mounted builds)',
};

export const BEST_MOUNTS = [
  { mount: 'Warhorse', speed: '60ft', hp: 19, rating: 'A' },
  { mount: 'Find Steed (Paladin L2)', speed: '60ft', note: 'Re-summonable. Shares buff spells.', rating: 'S' },
  { mount: 'Find Greater Steed (L4)', speed: '60ft fly (Pegasus)', note: 'Flying + shared concentration spells.', rating: 'S+' },
  { mount: 'Phantom Steed (Wizard ritual)', speed: '100ft', hp: 1, rating: 'A+' },
  { mount: 'Steel Defender (Battle Smith)', speed: '40ft', note: 'Small race only. Scales with level.', rating: 'A' },
];

export const PALADIN_MOUNT_SYNERGY = {
  sharedSpells: ['Haste (both get +2 AC, double speed)', 'Death Ward (both protected)', 'Aid (both get HP)', 'Shield of Faith (both +2 AC)'],
  lance: 'One-handed while mounted, 1d12 damage, 10ft reach. Best mounted weapon.',
};

export const MOUNTED_TACTICS = [
  { tactic: 'Hit and run', detail: 'Mount Disengages → approach → attack → retreat. No OA.', rating: 'S' },
  { tactic: 'Lance + shield', detail: '1d12 reach + AC. Unique combo only possible mounted.', rating: 'S' },
  { tactic: 'Flying superiority', detail: 'Fly between turns. Melee can\'t reach. Dive attack and retreat.', rating: 'S' },
  { tactic: 'Shared Haste', detail: 'Find Steed + Haste = both Hasted. 120ft fly speed.', rating: 'S' },
];

export const MOUNTED_PROBLEMS = [
  'Mounts die easily past L5. 19 HP Warhorse = one Fireball.',
  'Tight dungeon corridors. Large mounts don\'t fit.',
  'Smart enemies target the mount to dismount you.',
  'Find Steed solves most problems (re-summonable, intelligent, buff sharing).',
];
