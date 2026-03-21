/**
 * playerMountedCombatGuide.js
 * Player Mode: Mounted combat rules, tactics, and mount options
 * Pure JS — no React dependencies.
 */

export const MOUNTED_COMBAT_RULES = {
  mounting: 'Costs half your movement speed. Mount must be within 5 feet.',
  dismounting: 'Costs half your movement speed.',
  controlledMount: 'You control it. It acts on your initiative. Can only Dash, Disengage, or Dodge. Cannot attack.',
  independentMount: 'It acts on its own initiative. Can attack but may not obey. DM controls it.',
  forcedDismount: 'If mount is knocked prone, you must succeed DC 10 DEX save or fall off and land prone in 5ft.',
  mountDamage: 'If an effect moves mount against its will, DC 10 DEX save to stay mounted.',
  mountDeath: 'If mount drops to 0 HP, you can use reaction to dismount and land on feet. Otherwise you fall prone.',
};

export const MOUNT_OPTIONS = [
  { mount: 'Warhorse', size: 'Large', speed: '60ft', hp: 19, ac: 11, attacks: 'Hooves (2d6+4)', cost: '400 gp', note: 'Best mundane combat mount. Trampling Charge is excellent.', tier: 'A' },
  { mount: 'Riding Horse', size: 'Large', speed: '60ft', hp: 13, ac: 10, attacks: 'Hooves (2d4+3)', cost: '75 gp', note: 'Budget option. Fragile in combat.', tier: 'C' },
  { mount: 'Elephant', size: 'Huge', speed: '40ft', hp: 76, ac: 12, attacks: 'Gore (3d8+5), Stomp (3d10+5)', cost: '200 gp', note: 'Tanky. Slow but hits hard. Size advantage for reach.', tier: 'A' },
  { mount: 'Pteranodon', size: 'Medium', speed: '10ft/60ft fly', hp: 13, ac: 13, attacks: 'Bite (2d4+1)', cost: 'Find Steed', note: 'Flying mount for Small riders. Fragile but mobile.', tier: 'B' },
  { mount: 'Giant Elk', size: 'Huge', speed: '60ft', hp: 42, ac: 14, attacks: 'Ram (2d6+5), Hooves (4d8+5)', cost: 'Find Steed/Wild', note: 'Fast, tough, intelligent. Great if available.', tier: 'A' },
  { mount: 'Pegasus', size: 'Large', speed: '60ft/90ft fly', hp: 59, ac: 12, attacks: 'Hooves (2d6+4)', cost: 'Find Greater Steed', note: 'Flying mount with solid HP. The dream mount.', tier: 'S' },
  { mount: 'Griffon', size: 'Large', speed: '30ft/80ft fly', hp: 59, ac: 12, attacks: 'Beak (1d8+4), Claws (2d6+4)', cost: 'Find Greater Steed/Tame', note: 'Fast flyer with multiattack. Aggressive.', tier: 'S' },
];

export const MOUNTED_COMBATANT_FEAT = {
  name: 'Mounted Combatant',
  benefits: [
    'Advantage on melee attacks against unmounted creatures smaller than your mount',
    'Force attacks targeting your mount to target you instead',
    'Mount takes no damage on successful DEX saves (half on fail instead of half/full)',
  ],
  rating: 'S-tier for mounted builds, useless otherwise',
  bestWith: ['Paladin (Find Steed)', 'Cavalier Fighter', 'Beast Master Ranger'],
};

export const FIND_STEED_SPELLS = [
  { spell: 'Find Steed', level: 2, class: 'Paladin', options: ['Warhorse', 'Pony', 'Camel', 'Elk', 'Mastiff'], note: 'Intelligent, celestial/fey/fiend. Shares self-targeting spells. Telepathic bond within 1 mile.' },
  { spell: 'Find Greater Steed', level: 4, class: 'Paladin', options: ['Pegasus', 'Griffon', 'Dire Wolf', 'Rhinoceros', 'Saber-toothed Tiger'], note: 'Flying mounts. Same benefits as Find Steed but way better options.' },
  { spell: 'Phantom Steed', level: 3, class: 'Wizard', options: ['Quasi-real horse'], note: 'Ritual castable! 100ft speed. Lasts 1 hour. Fades in 1 minute when dispelled. Great for travel.' },
];

export const MOUNTED_TACTICS = [
  { tactic: 'Hit and Run', description: 'Controlled mount Disengages. You attack as you pass by. No opportunity attacks.', effectiveness: 'S' },
  { tactic: 'Charge and Smite', description: 'Paladin on warhorse. Charge in, Divine Smite on the hit. Devastating alpha strike.', effectiveness: 'S' },
  { tactic: 'Aerial bombardment', description: 'On a flying mount, stay at 60ft+. Rain down ranged attacks or spells.', effectiveness: 'A' },
  { tactic: 'Lance from horseback', description: 'Lance has reach (10ft) and works one-handed while mounted. Free hand for shield.', effectiveness: 'A' },
  { tactic: 'Spell sharing', description: 'Find Steed mounts share self-targeting buffs. Cast Haste on yourself = Hasted mount too.', effectiveness: 'S' },
];

export function canMount(riderSize, mountSize) {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  return sizes.indexOf(mountSize) > sizes.indexOf(riderSize);
}

export function getMountsForLevel(level) {
  if (level >= 13) return MOUNT_OPTIONS; // All options
  if (level >= 5) return MOUNT_OPTIONS.filter(m => !['Pegasus', 'Griffon'].includes(m.mount));
  return MOUNT_OPTIONS.filter(m => ['Warhorse', 'Riding Horse'].includes(m.mount));
}

export function getMountInfo(mountName) {
  return MOUNT_OPTIONS.find(m =>
    m.mount.toLowerCase().includes((mountName || '').toLowerCase())
  ) || null;
}
