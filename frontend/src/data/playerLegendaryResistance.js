/**
 * playerLegendaryResistance.js
 * Player Mode: Understanding legendary creatures from the player perspective
 * Pure JS — no React dependencies.
 */

export const LEGENDARY_CREATURE_FEATURES = [
  {
    feature: 'Legendary Resistance',
    description: 'When the creature fails a saving throw, it can choose to succeed instead.',
    uses: 'Usually 3 per day.',
    playerTip: 'Force the creature to burn these BEFORE using your best save-or-suck spells. Use low-level saves first (Heat Metal, Faerie Fire).',
  },
  {
    feature: 'Legendary Actions',
    description: 'The creature can take special actions at the end of other creatures\' turns.',
    uses: 'Usually 3 per round, refreshed at the start of the creature\'s turn.',
    playerTip: 'The creature acts between your turns! Plan for tail attacks, movement, or cantrip-level abilities happening mid-round.',
  },
  {
    feature: 'Lair Actions',
    description: 'On initiative count 20, the lair itself attacks or creates effects.',
    uses: 'Once per round, on initiative 20.',
    playerTip: 'Fight OUTSIDE the lair if possible. Lair actions are free, powerful, and can reshape the battlefield.',
  },
  {
    feature: 'Frightful Presence',
    description: 'Each creature of the dragon\'s choice within 120 feet must make a WIS save or be frightened.',
    uses: 'Activated as an action. Each creature saves once — success = immune for 24h.',
    playerTip: 'Heroes\' Feast (immune to frightened) or Paladin Aura (10ft, immune to fear at 10th) are excellent counters.',
  },
  {
    feature: 'Magic Resistance',
    description: 'Advantage on saving throws against spells and other magical effects.',
    uses: 'Always active.',
    playerTip: 'Spells that don\'t require saves are more reliable (Magic Missile, Wall of Force, Heal).',
  },
];

export const BOSS_FIGHT_STRATEGY = [
  'Burn Legendary Resistances first with cheap spells before using Hold Monster or Banishment.',
  'Focus fire — don\'t split damage across minions unless they\'re a major threat.',
  'Keep your healer safe and in range. Boss fights are marathons.',
  'Use Wall of Force or similar to separate the boss from its minions.',
  'Save Counterspell for the boss\'s nastiest spells.',
  'Spread out to avoid breath weapons, AoE legendary actions, and lair effects.',
  'Haste on the primary damage dealer can significantly shorten the fight.',
  'Know the boss\'s damage immunities before combat — don\'t waste resources on fire if it\'s immune.',
  'Silvered or magical weapons bypass most resistances. Check before attacking.',
  'Action economy is king — summon creatures, use Help action, anything to get more attacks per round.',
];

export const LEGENDARY_RESISTANCE_BURNERS = [
  { spell: 'Heat Metal', level: 2, note: 'No save to apply. Saves only to avoid dropping the item. Forces LR or ongoing damage.' },
  { spell: 'Faerie Fire', level: 1, note: 'Low cost to force a save. If they use LR, you only lost a 1st level slot.' },
  { spell: 'Bane', level: 1, note: 'Cheap save-forcer. Even if they LR, you only spent a 1st level slot.' },
  { spell: 'Blindness/Deafness', level: 2, note: 'No concentration, cheap slot. Great LR bait.' },
  { spell: 'Levitate', level: 2, note: 'CON save. If the creature doesn\'t have a ranged attack, this is devastating even at low level.' },
  { spell: 'Polymorph', level: 4, note: 'Turn the boss into a turtle. If they use LR, that\'s one fewer for Hold Monster.' },
];

export function getLegendaryFeatureInfo(feature) {
  return LEGENDARY_CREATURE_FEATURES.find(f => f.feature.toLowerCase().includes((feature || '').toLowerCase())) || null;
}

export function suggestLRBurner(remainingSlots) {
  if (remainingSlots.includes(1)) return LEGENDARY_RESISTANCE_BURNERS.find(s => s.level === 1);
  if (remainingSlots.includes(2)) return LEGENDARY_RESISTANCE_BURNERS.find(s => s.level === 2);
  return LEGENDARY_RESISTANCE_BURNERS[0];
}
