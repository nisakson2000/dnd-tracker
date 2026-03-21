/**
 * playerExoticMounts.js
 * Player Mode: Exotic and flying mounts, mount stats, and mounted builds
 * Pure JS — no React dependencies.
 */

export const COMMON_MOUNTS = [
  { mount: 'Riding Horse', speed: '60ft', hp: 13, cost: '75 gp', fly: false, note: 'Standard. Double PC speed.' },
  { mount: 'Warhorse', speed: '60ft', hp: 19, cost: '400 gp', fly: false, note: 'Trampling Charge. Best mundane mount.' },
  { mount: 'Pony', speed: '40ft', hp: 11, cost: '30 gp', fly: false, note: 'Small riders. Halflings and Gnomes.' },
  { mount: 'Mastiff', speed: '40ft', hp: 5, cost: '25 gp', fly: false, note: 'Small riders. Cheap combat mount.' },
  { mount: 'Elephant', speed: '40ft', hp: 76, cost: '200 gp', fly: false, note: 'Huge. Trampling Charge (3d10+5). Exotic.' },
];

export const MAGICAL_MOUNTS = [
  { mount: 'Find Steed (2nd)', speed: '60ft', hp: 19, source: 'Paladin L5', note: 'Warhorse, shares self-spells (Haste, Shield of Faith). Telepathic bond. Returns when resummoned.' },
  { mount: 'Find Greater Steed (4th)', speed: '90ft fly', hp: 59, source: 'Paladin L13', note: 'Pegasus, Griffon, or Peryton. Flying. Shares all self-targeted spells.' },
  { mount: 'Phantom Steed (3rd)', speed: '100ft', hp: 1, source: 'Wizard ritual', note: 'Fastest ground mount. Ritual = free. Disappears when hit (1 min delay).' },
  { mount: 'Beast Master Companion', speed: 'Varies', hp: 'Varies', source: 'Ranger L3', note: 'Not technically a mount but can be with DM approval (if Large).' },
  { mount: 'Drake Companion', speed: '40ft', hp: 'Varies', source: 'Drakewarden L7', note: 'Becomes Large at L7. Rideable. Breath weapon.' },
  { mount: 'Steel Defender', speed: '40ft', hp: 'Varies', source: 'Battle Smith L3', note: 'Can ride if Small race. Force-Empowered Rend. Repair reaction.' },
];

export const FLYING_MOUNT_RULES = [
  'If your flying mount is knocked prone, you fall. Feather Fall is essential.',
  'If mount drops to 0 HP mid-air, you free-fall. Brace for fall damage.',
  'Mounted combat rules: mount uses Dash/Disengage/Dodge. YOU attack.',
  'Fly speed lets you avoid melee entirely. Stay at ranged attack distance.',
  'Lance: 1d12, reach, one-handed while mounted. Best mounted weapon.',
  'Find Greater Steed shares Haste/Death Ward/Aid when you cast on yourself.',
];

export const MOUNTED_BUILDS = [
  { build: 'Paladin (Find Greater Steed)', detail: 'Pegasus mount, share Haste = both Hasted. Lance + Shield. Best mounted combat.', rating: 'S' },
  { build: 'Cavalier Fighter', detail: 'Unwavering Mark + mounted reach. Born Sentinel feat (free).', rating: 'A' },
  { build: 'Small Barbarian + Medium mount', detail: 'Halfling/Gnome Barbarian on Warhorse. Reckless Attack from mount.', rating: 'A' },
  { build: 'Wizard (Phantom Steed)', detail: '100ft speed mount. Hit-and-run. Ritual cast = free.', rating: 'B' },
];

export function mountFallDamage(altitude) {
  return Math.min(20, Math.floor(altitude / 10)) * 3.5; // d6 avg per 10ft, max 20d6
}

export function mountDashSpeed(baseSpeed) {
  return baseSpeed * 2; // Dash doubles speed
}
