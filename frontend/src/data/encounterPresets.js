/**
 * Encounter Presets — Ready-to-run encounters organized by theme and CR.
 */

export const ENCOUNTER_PRESETS = [
  {
    name: 'Goblin Ambush',
    cr: '1-2',
    environment: 'road, forest',
    monsters: [
      { name: 'Goblin', count: '3-6', cr: '1/4' },
      { name: 'Goblin Boss', count: '1', cr: '1' },
    ],
    tactics: 'Goblins hide in trees/bushes, attack from range, flee when boss dies.',
    treasure: '2d6 gp, stolen goods, a crude map to their hideout.',
    hooks: ['The goblins carry a note in a language they can\'t read', 'One goblin tries to surrender and offers information'],
  },
  {
    name: 'Undead Patrol',
    cr: '2-3',
    environment: 'dungeon, graveyard, swamp',
    monsters: [
      { name: 'Skeleton', count: '4-6', cr: '1/4' },
      { name: 'Zombie', count: '2-3', cr: '1/4' },
      { name: 'Shadow', count: '1', cr: '1/2' },
    ],
    tactics: 'Mindless. Attack nearest living creature. Shadow targets the weakest.',
    treasure: 'Corroded weapons, 1d6 gp in pockets, a tarnished holy symbol.',
    hooks: ['One skeleton wears the armor of a famous missing knight', 'The undead are drawn to a specific location'],
  },
  {
    name: 'Bandit Roadblock',
    cr: '2-4',
    environment: 'road, bridge, pass',
    monsters: [
      { name: 'Bandit', count: '4-6', cr: '1/8' },
      { name: 'Bandit Captain', count: '1', cr: '2' },
      { name: 'Thug', count: '1-2', cr: '1/2' },
    ],
    tactics: 'Demand toll (10 gp per person). Fight if refused. Captain surrenders at half HP.',
    treasure: '4d6 gp from previous victims, a stolen merchant ledger.',
    hooks: ['The captain is a disgraced noble', 'They\'re collecting tolls for a local crime lord'],
  },
  {
    name: 'Wolf Pack',
    cr: '1-2',
    environment: 'forest, plains, mountain',
    monsters: [
      { name: 'Wolf', count: '4-8', cr: '1/4' },
      { name: 'Dire Wolf', count: '1', cr: '1' },
    ],
    tactics: 'Pack tactics. Circle the party. Target isolated members. Flee if dire wolf dies.',
    treasure: 'None (animal encounter).',
    hooks: ['The wolves are fleeing from something worse', 'A druid is watching the encounter'],
  },
  {
    name: 'Cultist Ritual',
    cr: '3-5',
    environment: 'dungeon, ruins, cave',
    monsters: [
      { name: 'Cultist', count: '4-6', cr: '1/8' },
      { name: 'Cult Fanatic', count: '1-2', cr: '2' },
      { name: 'Shadow Demon (summoned)', count: '0-1', cr: '4' },
    ],
    tactics: 'Cultists protect the fanatic. If ritual completes (3 rounds), demon appears.',
    treasure: '2d6 gp offerings, a ritual book, a dark artifact.',
    hooks: ['The ritual is to open a portal', 'One cultist is an undercover informant'],
  },
  {
    name: 'Ogre\'s Lair',
    cr: '3-4',
    environment: 'cave, forest, hills',
    monsters: [
      { name: 'Ogre', count: '1-2', cr: '2' },
      { name: 'Goblin Servant', count: '2-4', cr: '1/4' },
    ],
    tactics: 'Ogre charges the biggest target. Goblins throw rocks and flee when ogre falls.',
    treasure: 'A pile of bones and 3d6 x 10 gp in a sack, a magic item (uncommon).',
    hooks: ['The ogre has captured a prisoner', 'There\'s a map to a larger dungeon on the wall'],
  },
  {
    name: 'Dragon Wyrmling',
    cr: '4-6',
    environment: 'mountain, cave, ruins',
    monsters: [
      { name: 'Young Dragon (color varies)', count: '1', cr: '4-6' },
      { name: 'Kobold', count: '4-8', cr: '1/8' },
    ],
    tactics: 'Kobolds use traps and pack tactics. Dragon uses breath weapon, then melee.',
    treasure: 'Small hoard: 4d6 x 10 gp, 2d6 gems (50 gp each), 1 magic item (uncommon).',
    hooks: ['The wyrmling\'s parent will come looking', 'The dragon can speak and might negotiate'],
  },
  {
    name: 'Troll Bridge',
    cr: '5-6',
    environment: 'bridge, river, road',
    monsters: [
      { name: 'Troll', count: '1', cr: '5' },
    ],
    tactics: 'Blocks the bridge. Demands tribute (100 gp or a live animal). Regenerates unless burned.',
    treasure: '2d6 x 10 gp in a pile of bones, remains of past victims.',
    hooks: ['The troll has a riddle contest tradition', 'Someone has been feeding the troll to keep travelers away from something beyond the bridge'],
  },
  {
    name: 'Haunted Manor',
    cr: '4-7',
    environment: 'urban, ruins',
    monsters: [
      { name: 'Specter', count: '2-3', cr: '1' },
      { name: 'Poltergeist (ghost)', count: '1', cr: '4' },
      { name: 'Animated Armor', count: '1-2', cr: '1' },
    ],
    tactics: 'Specters harass from walls. Ghost uses Horrifying Visage. Armor guards the master bedroom.',
    treasure: 'Hidden safe: 5d6 x 10 gp, deed to the manor, a family heirloom (magic item).',
    hooks: ['The ghost wants its murder solved', 'The deed makes the party legitimate owners'],
  },
  {
    name: 'Pirate Boarding Party',
    cr: '3-5',
    environment: 'ship, coastal',
    monsters: [
      { name: 'Pirate (bandit)', count: '6-8', cr: '1/8' },
      { name: 'Pirate Bosun (veteran)', count: '1', cr: '3' },
      { name: 'Pirate Captain', count: '1', cr: '2' },
    ],
    tactics: 'Swing aboard on ropes. Captain targets the strongest. Bosun protects the captain.',
    treasure: 'Ship cargo: 2d6 x 10 gp trade goods, a treasure map, rum.',
    hooks: ['The pirates carry a letter of marque from a rival kingdom', 'Their ship has a prisoner below deck'],
  },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function getPresetsByCR(crRange) {
  return ENCOUNTER_PRESETS.filter(p => p.cr === crRange);
}

export function getPresetsByEnvironment(env) {
  return ENCOUNTER_PRESETS.filter(p => p.environment.includes(env));
}

export function generatePresetEncounter(environment = null, crRange = null) {
  let pool = [...ENCOUNTER_PRESETS];
  if (environment) pool = pool.filter(p => p.environment.includes(environment));
  if (crRange) pool = pool.filter(p => p.cr === crRange);
  return pool.length > 0 ? pick(pool) : pick(ENCOUNTER_PRESETS);
}

export function getAllPresets() {
  return [...ENCOUNTER_PRESETS];
}
