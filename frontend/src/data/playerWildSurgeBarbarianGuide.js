/**
 * playerWildSurgeBarbarianGuide.js
 * Player Mode: Path of Wild Magic Barbarian optimization
 * Pure JS — no React dependencies.
 */

export const WILD_MAGIC_BARBARIAN = {
  class: 'Barbarian (Path of Wild Magic)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Chaotic magic infuses your rage. Random magical effects each time you rage.',
  note: 'Fun, unpredictable, and surprisingly powerful. Every rage is different.',
};

export const WILD_SURGE_TABLE = [
  { roll: 1, effect: 'Each creature within 30ft (except you) takes 1d12 force damage. CON save for half.', rating: 'B', note: 'AoE damage. Hits allies too. Be careful.' },
  { roll: 2, effect: 'Teleport 30ft to unoccupied space. Until rage ends, can teleport 30ft as bonus action.', rating: 'S', note: 'Free Misty Step every turn for the entire rage. Incredible mobility.' },
  { roll: 3, effect: 'Intangible spirit within 30ft. Reaction: spirit deals 1d6 force to any creature that attacks you or ally.', rating: 'A', note: 'Reactive damage. Like Spirit Guardians lite.' },
  { roll: 4, effect: 'Magic tendrils from weapon. Reach 10ft until rage ends. Extra 1d12 force on hit.', rating: 'S', note: '10ft reach + 1d12 extra damage. Best offensive surge.' },
  { roll: 5, effect: 'When hit, roll d6. On 1-3: you take half damage. On 4-6: attacker takes the damage.', rating: 'A', note: 'Damage reflection. Like a mini Armor of Agathys.' },
  { roll: 6, effect: 'Light within 5ft. Adjacent creatures charmed or frightened (your choice) until end of next turn.', rating: 'B', note: 'Frighten/charm in melee range. Good crowd control.' },
  { roll: 7, effect: 'Each creature within 30ft regains 1d12 + your level HP.', rating: 'A', note: 'AoE healing. At level 10: 1d12+10 to everyone nearby.' },
  { roll: 8, effect: 'Flowers and vines grow in 15ft radius. Difficult terrain for everyone except you.', rating: 'B', note: 'Free difficult terrain. Enemies can\'t reach you as easily.' },
];

export const WILD_MAGIC_FEATURES = [
  { feature: 'Magic Awareness', level: 3, effect: 'Action: sense magic within 60ft. Know location and school. PB uses/long rest.', note: 'Free Detect Magic (sort of). Know if enemies have magical buffs.' },
  { feature: 'Wild Surge', level: 3, effect: 'When you enter rage, roll d8 on the Wild Surge table. Effect lasts until rage ends.', note: 'Random but all effects are at least decent. Some are amazing.' },
  { feature: 'Bolstering Magic', level: 6, effect: 'Action: touch a creature. Choose: +1d3 to attacks/checks for 10 min, OR regain a spell slot (up to 3rd level). PB uses/long rest.', note: 'GIVE SPELL SLOTS TO CASTERS. Or buff your own attacks. Incredible support.' },
  { feature: 'Unstable Backlash', level: 10, effect: 'When you take damage or fail a save while raging: reaction to reroll Wild Surge. Replace current effect.', note: 'Don\'t like your surge? Get hit and reroll. Fish for the good ones.' },
  { feature: 'Controlled Surge', level: 14, effect: 'Roll on surge table twice. Choose which effect you want.', note: 'Pick the best of 2 options. No more bad surges.' },
];

export const BOLSTERING_MAGIC_VALUE = {
  attackBuff: '+1d3 to attacks and checks for 10 minutes. Avg +2. Like mini-Bless.',
  spellSlotRecovery: 'Restore a spell slot up to 3rd level to ANY creature. Give the Wizard a 3rd level slot back.',
  math: 'Restoring a 3rd level slot = giving back a Fireball or Counterspell. Enormous value.',
  uses: 'PB uses per long rest. At L6 PB 3: restore 3 spell slots to your casters. Or buff attacks 3 times.',
};

export function wildSurgeDamage(roll) {
  if (roll === 4) return 6.5; // 1d12 extra per hit
  if (roll === 1) return 6.5; // 1d12 AoE (but hits allies)
  return 0;
}

export function bolsteringSpellSlotValue(slotLevel) {
  return slotLevel; // Higher = more valuable
}
