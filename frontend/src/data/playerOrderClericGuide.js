/**
 * playerOrderClericGuide.js
 * Player Mode: Order Domain Cleric — the commander cleric
 * Pure JS — no React dependencies.
 */

export const ORDER_BASICS = {
  class: 'Cleric (Order Domain)',
  source: 'Tasha\'s Cauldron of Everything / Guildmaster\'s Guide to Ravnica',
  theme: 'Law and authority. Grant allies extra attacks. Heavy armor support.',
  note: 'Incredible 1-level dip for any support caster. Voice of Authority is one of the best features in the game.',
};

export const ORDER_FEATURES = [
  { feature: 'Voice of Authority', level: 1, effect: 'When you cast a spell on an ally (1st level+), that ally can use their reaction to make a weapon attack.', note: 'THIS IS THE FEATURE. Cast Healing Word on the Rogue → Rogue gets Sneak Attack on your turn (new turn = new SA). Bless → ally attacks.' },
  { feature: 'Order\'s Demand', level: 1, effect: 'Heavy armor + Intimidation or Persuasion. Channel Divinity: each creature within 30ft must WIS save or be charmed until end of your next turn or take damage.', note: 'AoE charm is strong but VoA is the real prize.' },
  { feature: 'Embodiment of the Law', level: 6, effect: 'Cast an enchantment spell of 1st level+ as bonus action (WIS mod times/long rest).', note: 'Hold Person as bonus action. Command as bonus action. Then attack or cantrip.' },
  { feature: 'Divine Strike', level: 8, effect: '+1d8 psychic on weapon hit (2d8 at 14).', note: 'Psychic damage rarely resisted. Best Divine Strike damage type.' },
  { feature: 'Order\'s Wrath', level: 17, effect: 'Once per turn when you deal Divine Strike damage, curse the target. Next ally hit deals 2d8 psychic.', note: 'Extra 2d8 for the first ally to hit your target.' },
];

export const VOICE_OF_AUTHORITY_COMBOS = [
  { combo: 'Healing Word → Rogue attacks', detail: 'Bonus action Healing Word on Rogue. Rogue uses reaction to attack. It\'s YOUR turn, so Rogue gets Sneak Attack again (SA is 1/turn, not 1/round).', rating: 'S', note: 'Double Sneak Attack per round. Best combo in the game for 1st-level spell.' },
  { combo: 'Bless → ally attacks', detail: 'Cast Bless on 3 allies. ONE of them (your choice) gets a reaction attack.', rating: 'A', note: 'Bless + free attack. Great turn 1.' },
  { combo: 'Aid → ally attacks', detail: 'Cast Aid on 3 allies. One gets reaction attack. Aid doesn\'t use concentration.', rating: 'A' },
  { combo: 'Shield of Faith → Paladin attacks', detail: 'Give Paladin +2 AC AND a reaction attack (which they can Smite on).', rating: 'A' },
  { combo: 'Warding Bond → attack', detail: 'Warding Bond an ally: +1 AC, +1 saves, resistance to all damage. Plus they attack.', rating: 'A' },
];

export const ORDER_DIP_ANALYSIS = {
  who: 'Any support caster — Divine Soul Sorcerer, Bard, Druid',
  cost: '1 level (delays spell progression by 1)',
  gain: ['Heavy armor + shield', 'Voice of Authority (reaction attacks for allies)', 'Healing Word (if not already)', 'Bless (if not already)'],
  bestWith: 'Divine Soul Sorcerer. Twin Healing Word → TWO allies get reaction attacks. Metamagic + VoA = broken.',
  rating: 'S-tier multiclass dip',
  note: 'One of the best 1-level dips in 5e. Heavy armor + VoA is incredible value.',
};

export const ORDER_SPELLS = {
  domainSpells: [
    { level: 1, spells: 'Command, Heroism', note: 'Command is great (bonus action at L6). Heroism gives temp HP each turn + triggers VoA.' },
    { level: 2, spells: 'Hold Person, Zone of Truth', note: 'Hold Person = auto-crit on paralyzed target. Cast as bonus action at L6.' },
    { level: 3, spells: 'Mass Healing Word, Slow', note: 'Mass Healing Word heals 6 targets AND one gets VoA attack.' },
    { level: 4, spells: 'Compulsion, Locate Creature', note: 'Compulsion can force movement. Locate Creature is situational.' },
    { level: 5, spells: 'Commune, Dominate Person', note: 'Dominate Person is powerful mind control.' },
  ],
};

export function voaExtraDamage(rogueLevel) {
  // Extra Sneak Attack from Voice of Authority
  const saDice = Math.ceil(rogueLevel / 2);
  return saDice * 3.5; // Average SA damage
}

export function embodimentUses(wisMod) {
  return Math.max(1, wisMod);
}
