/**
 * playerMountCombat.js
 * Player Mode: Mounted combat rules and mount options
 * Pure JS — no React dependencies.
 */

export const MOUNTED_COMBAT_RULES = {
  mounting: 'Costs half your movement speed to mount or dismount.',
  initiative: 'Controlled mount acts on your initiative. Intelligent mounts act independently.',
  controlledActions: 'Controlled mount can only Dash, Disengage, or Dodge. Cannot attack.',
  independentActions: 'Intelligent mounts (Find Steed, griffon) act independently and can attack.',
  falling: 'If mount is knocked prone, rider must succeed on DC 10 DEX save or fall prone (within 5ft).',
  forcedDismount: 'Effect that moves you against your will: DC 10 DEX save or fall off.',
  mountDown: 'If mount drops to 0 HP, you must dismount as part of your movement.',
};

export const COMMON_MOUNTS = [
  { mount: 'Riding Horse', speed: '60 ft', hp: 13, ac: 10, cost: '75 gp', notes: 'Standard mount. Can\'t attack.' },
  { mount: 'Warhorse', speed: '60 ft', hp: 19, ac: 11, cost: '400 gp', notes: 'Can be controlled in battle. Hooves attack.' },
  { mount: 'Pony', speed: '40 ft', hp: 11, ac: 10, cost: '30 gp', notes: 'Small creatures\' mount. Less capacity.' },
  { mount: 'Mastiff', speed: '40 ft', hp: 5, ac: 12, cost: '25 gp', notes: 'Small creatures\' mount. Good for Halflings.' },
  { mount: 'Elephant', speed: '40 ft', hp: 76, ac: 12, cost: '200 gp', notes: 'Huge mount. Can carry multiple riders.' },
  { mount: 'Camel', speed: '50 ft', hp: 15, ac: 9, cost: '50 gp', notes: 'Desert mount. Long endurance.' },
];

export const MAGICAL_MOUNTS = [
  { mount: 'Find Steed (2nd)', speed: '60 ft', hp: 19, ac: 11, notes: 'Intelligent, telepathic bond. Shares self-targeting spells. Warhorse, pony, etc.' },
  { mount: 'Find Greater Steed (4th)', speed: '90 ft (Pegasus)', hp: 59, ac: 14, notes: 'Griffon, Pegasus, Peryton. Flying mounts!' },
  { mount: 'Phantom Steed (3rd)', speed: '100 ft', hp: 1, ac: 10, notes: 'Ritual. 1 hour duration. Incredibly fast but dies in one hit.' },
  { mount: 'Steel Defender (Artificer)', speed: '40 ft', hp: 'Level-based', ac: '15+', notes: 'Battle Smith companion. Can be ridden if Medium.' },
  { mount: 'Drake Companion (Ranger)', speed: '40 ft', hp: 'Level-based', ac: '14+', notes: 'Drakewarden companion. Becomes Large and rideable at 7th level.' },
];

export const MOUNTED_COMBATANT_FEAT = {
  name: 'Mounted Combatant',
  benefits: [
    'Advantage on melee attack rolls against unmounted creatures smaller than your mount.',
    'Force any attack targeting your mount to target you instead.',
    'If your mount succeeds on a DEX save for half damage, it takes no damage instead (Evasion for mount).',
  ],
  note: 'Essential feat for mounted builds. Protects your mount and gives you advantage on most attacks.',
};

export function getMountInfo(name) {
  const common = COMMON_MOUNTS.find(m => m.mount.toLowerCase().includes((name || '').toLowerCase()));
  if (common) return common;
  return MAGICAL_MOUNTS.find(m => m.mount.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function canRide(riderSize, mountSize) {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const riderIdx = sizes.indexOf(riderSize);
  const mountIdx = sizes.indexOf(mountSize);
  return mountIdx >= riderIdx + 1; // mount must be at least one size larger
}
