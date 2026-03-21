/**
 * playerMountedCombat.js
 * Player Mode: Mounted combat rules, mount options, and cavalry tactics
 * Pure JS — no React dependencies.
 */

export const MOUNTED_COMBAT_RULES = {
  mounting: 'Mount/dismount costs half your movement. Mount must be one size larger than you.',
  controlledMount: {
    description: 'You control the mount (most common). It acts on your initiative.',
    actions: 'Mount can only Dash, Disengage, or Dodge. It cannot attack.',
    movement: 'You use the mount\'s speed instead of yours.',
    note: 'Best for most combat situations — predictable and safe.',
  },
  independentMount: {
    description: 'Mount acts on its own initiative with its own actions.',
    actions: 'Mount can attack, but the DM controls its behavior.',
    note: 'Used for intelligent mounts (INT 6+) like pegasus, griffon, dragon.',
  },
  falling: 'If mount is knocked prone, DC 10 DEX save or fall off (land prone, costs half movement to stand).',
  mountDying: 'If mount drops to 0 HP, you must succeed on a DEX save or fall prone.',
};

export const BEST_MOUNTS = [
  { mount: 'Warhorse', speed: '60ft', hp: 19, cost: '400 gp', note: 'Best mundane mount. Trampling Charge (DC 14 STR or prone + bonus hooves).', rating: 'A' },
  { mount: 'Riding Horse', speed: '60ft', hp: 13, cost: '75 gp', note: 'Cheap and fast. No combat features. Fine for travel.', rating: 'B' },
  { mount: 'Mastiff', speed: '40ft', hp: 5, cost: '25 gp', note: 'Small race mount. Halflings and gnomes. Cheap but fragile.', rating: 'C' },
  { mount: 'Elk', speed: '50ft', hp: 13, cost: 'Wild', note: 'Charge attack. Good Find Steed option.', rating: 'B' },
  { mount: 'Find Steed (Paladin)', speed: '60ft', hp: 19, cost: '2nd level slot', note: 'Warhorse stats. Shares your buff spells. Telepathic bond. Best mount in game.', rating: 'S' },
  { mount: 'Find Greater Steed', speed: 'Varies', hp: 'Varies', cost: '4th level slot', note: 'Pegasus (90ft fly), Griffon, Dire Wolf, Rhinoceros. Flying mount is game-changing.', rating: 'S' },
  { mount: 'Phantom Steed (ritual)', speed: '100ft', hp: 1, cost: 'Ritual', note: '100ft speed! But 1 HP and disappears 1 min after taking damage. Sprint mount, not combat.', rating: 'A' },
  { mount: 'Broom of Flying', speed: '50ft fly', hp: 'N/A', cost: 'Magic item', note: 'Not technically a mount but functions as one. No attacks of opportunity from ground enemies.', rating: 'A' },
];

export const MOUNTED_COMBAT_FEAT = {
  name: 'Mounted Combatant',
  benefits: [
    'Advantage on melee attacks vs unmounted creatures smaller than your mount.',
    'Force attacks targeting your mount to target you instead.',
    'Mount takes 0 damage on successful DEX saves (Evasion for your mount).',
  ],
  rating: 'S (if building around mounted combat)',
  note: 'Redirecting attacks to yourself protects your mount. Evasion effect prevents Fireball from one-shotting it.',
};

export const LANCE_RULES = {
  weapon: 'Lance',
  damage: '1d12 piercing',
  properties: ['Reach', 'Special'],
  special: 'Disadvantage on attacks within 5ft. Requires two hands unless mounted.',
  tactic: 'Ride past enemies at 60ft speed. Attack with reach at 10ft. Enemy can\'t opportunity attack (you\'re out of range). Repeat.',
  combo: 'Lance + Shield while mounted = 1d12 damage + AC bonus. Best mounted weapon.',
};

export const CAVALRY_TACTICS = [
  { tactic: 'Hit and run', detail: 'Ride in, attack, use remaining movement to ride out of melee range. 60ft mount speed makes this easy.', rating: 'S' },
  { tactic: 'Lance charge', detail: 'Lance at 10ft reach while mounted. Attack without entering 5ft range. No disadvantage, no opportunity attacks.', rating: 'S' },
  { tactic: 'Trample and go', detail: 'Warhorse Trampling Charge: move through enemy space, knock prone (DC 14 STR), bonus action hooves attack.', rating: 'A' },
  { tactic: 'Aerial superiority', detail: 'Flying mount (Find Greater Steed: Pegasus). Attack from above, fly out of melee range. Melee enemies can\'t reach you.', rating: 'S' },
  { tactic: 'Shared buffs (Paladin)', detail: 'Find Steed shares self-targeted spells. Cast Haste on yourself — mount also gets Haste. Double the value.', rating: 'S' },
  { tactic: 'Mobile healer', detail: 'Ride to downed allies, Healing Word as bonus action, ride away. Cover the whole battlefield.', rating: 'A' },
];

export function mountSpeed(baseSpeed, isDashing) {
  return isDashing ? baseSpeed * 2 : baseSpeed;
}

export function canMount(riderSize, mountSize) {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  return sizes.indexOf(mountSize) > sizes.indexOf(riderSize);
}
