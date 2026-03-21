/**
 * playerPartyFormationGuide.js
 * Player Mode: Party marching order, exploration formations, and travel positions
 * Pure JS — no React dependencies.
 */

export const MARCHING_ORDERS = [
  {
    name: 'Standard Single File',
    positions: ['Scout (ahead)', 'Tank/Frontline', 'Support/Healer', 'Caster', 'Rear Guard'],
    bestFor: 'Narrow corridors, dungeons, caves',
    weakness: 'Only front and back can fight. Middle is trapped.',
    note: 'Most common dungeon formation. Scout stays 60ft ahead.',
  },
  {
    name: 'Two Abreast',
    positions: ['Tank + Melee DPS (front)', 'Healer + Support (middle)', 'Caster + Ranged (back)'],
    bestFor: '10ft wide corridors, standard dungeons',
    weakness: 'AoE hits the pair. Back row blocked from melee.',
    note: 'Good balance of speed and defense.',
  },
  {
    name: 'Diamond/Box',
    positions: ['Tank (front)', 'Melee (left)', 'Melee (right)', 'Caster/Healer (center)', 'Ranged (back)'],
    bestFor: 'Open areas, wilderness travel, roads',
    weakness: 'Spreads the party. Hard to cover all sides.',
    note: 'Best for open terrain where enemies can come from any direction.',
  },
  {
    name: 'Scout + Main Body',
    positions: ['Scout (100-200ft ahead)', 'Main group (clustered)', 'Rear Scout (100ft behind)'],
    bestFor: 'Enemy territory, hostile wilderness',
    weakness: 'Scout can be isolated and killed. Main group can\'t help fast enough.',
    note: 'Scouts use Stealth. Main body moves normally. Communication via signal or Message cantrip.',
  },
  {
    name: 'Convoy',
    positions: ['Point Guard', 'Protected NPCs/cart', 'Flanking Guards (sides)', 'Rear Guard'],
    bestFor: 'Escorting NPCs, caravan duty, protecting a package',
    weakness: 'Spread thin. Hard to concentrate force.',
    note: 'Protect the center. Guards ready actions to respond to threats.',
  },
];

export const POSITION_ROLES = [
  { position: 'Scout/Point', idealClass: ['Rogue', 'Ranger', 'Monk'], skills: ['Stealth', 'Perception', 'Investigation'], job: 'Move ahead of the party. Spot traps, enemies, and ambushes. Report back.', distance: '60-200ft ahead' },
  { position: 'Front/Vanguard', idealClass: ['Fighter', 'Paladin', 'Barbarian'], skills: ['Athletics', 'Perception'], job: 'First to engage. Absorb initial contact. Block enemies from reaching backline.', distance: 'Leading the main group' },
  { position: 'Middle/Support', idealClass: ['Cleric', 'Bard', 'Druid'], skills: ['Medicine', 'Religion', 'Nature'], job: 'Heal, buff, support. Close enough to reach anyone. Protected by front and back.', distance: 'Center of group' },
  { position: 'Backline/Artillery', idealClass: ['Wizard', 'Sorcerer', 'Warlock'], skills: ['Arcana', 'Investigation'], job: 'Ranged damage and control. Stay behind tanks. Maximum distance from danger.', distance: 'Rear of main group' },
  { position: 'Rear Guard', idealClass: ['Ranger', 'Fighter', 'Paladin'], skills: ['Perception', 'Survival'], job: 'Watch for followers, cover the retreat, prevent ambush from behind.', distance: '20-60ft behind group' },
];

export const TRAVEL_ACTIVITIES = [
  { activity: 'Navigate', skill: 'Survival', effect: 'Prevent getting lost. DC varies by terrain.', who: 'Best: Ranger (Natural Explorer ignores difficult terrain and can\'t get lost)' },
  { activity: 'Keep Watch', skill: 'Perception', effect: 'Spot threats, ambushes, and points of interest. Passive Perception + active checks.', who: 'Highest Perception character' },
  { activity: 'Track', skill: 'Survival', effect: 'Follow creature tracks. DC varies by terrain and age of tracks.', who: 'Ranger or high Survival character' },
  { activity: 'Forage', skill: 'Survival', effect: 'Find food and water. DC varies by terrain. Can feed party without rations.', who: 'Druid, Ranger, or Outlander background' },
  { activity: 'Map', skill: 'None', effect: 'Create a map of explored area. Helps with navigation and prevents getting lost.', who: 'Anyone, but low Perception characters are less useful elsewhere' },
  { activity: 'Stealth', skill: 'Stealth', effect: 'Entire group moves stealthily. Use slowest member\'s Stealth. Can\'t be Stealthy at Fast pace.', who: 'Everyone (group check)' },
];

export const HALLWAY_WIDTHS = {
  '5ft': { abreast: 1, squeeze: 'Tight. Single file only. Small creatures might go 2-abreast.', combat: 'One defender can hold the line.' },
  '10ft': { abreast: 2, squeeze: 'Standard. Two can walk side by side.', combat: 'Two defenders can block. Most formations work.' },
  '15ft': { abreast: 3, squeeze: 'Wide. Three abreast or 2 + space.', combat: 'Harder to block. Flanking possible.' },
  '20ft+': { abreast: 4, squeeze: 'Very wide. Practically open terrain.', combat: 'Full combat maneuvers. Formations matter less.' },
};

export function suggestFormation(corridorWidth, partySize, isHostile) {
  if (corridorWidth <= 5) return MARCHING_ORDERS[0]; // Single file
  if (corridorWidth <= 10) return isHostile ? MARCHING_ORDERS[3] : MARCHING_ORDERS[1]; // Scout+main or two abreast
  return MARCHING_ORDERS[2]; // Diamond for open areas
}

export function assignPositions(partyMembers) {
  // partyMembers: [{name, class}]
  const frontClasses = ['Fighter', 'Paladin', 'Barbarian'];
  const midClasses = ['Cleric', 'Bard', 'Druid'];
  const backClasses = ['Wizard', 'Sorcerer', 'Warlock'];
  const scoutClasses = ['Rogue', 'Ranger', 'Monk'];

  return partyMembers.map(m => {
    if (scoutClasses.includes(m.class)) return { ...m, position: 'Scout' };
    if (frontClasses.includes(m.class)) return { ...m, position: 'Front' };
    if (midClasses.includes(m.class)) return { ...m, position: 'Middle' };
    if (backClasses.includes(m.class)) return { ...m, position: 'Back' };
    return { ...m, position: 'Middle' };
  });
}
