/**
 * playerDowntime.js
 * Player Mode: Downtime activities reference
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// DOWNTIME ACTIVITIES (PHB / DMG / XGtE)
// ---------------------------------------------------------------------------

export const DOWNTIME_ACTIVITIES = [
  {
    name: 'Crafting',
    duration: 'Varies (5gp/day progress toward item cost)',
    cost: 'Half the item\'s market price in raw materials',
    requirements: ['Proficiency with relevant tools', 'Raw materials', 'Time'],
    description: 'Create nonmagical items including adventuring gear, weapons, and armor.',
    ability: null,
  },
  {
    name: 'Practicing a Profession',
    duration: 'Any number of days',
    cost: 'None',
    requirements: ['Relevant tool or skill proficiency'],
    description: 'Maintain a modest lifestyle without paying expenses. Comfortable if proficient in Performance.',
    ability: null,
  },
  {
    name: 'Recuperating',
    duration: '3+ days',
    cost: 'None (must maintain at least modest lifestyle)',
    requirements: ['At least 3 days of rest'],
    description: 'End one effect that prevents HP recovery, or advantage on next save vs disease/poison.',
    ability: null,
  },
  {
    name: 'Researching',
    duration: 'At least 1 day',
    cost: '1gp per day (minimum)',
    requirements: ['Access to a library or sage'],
    description: 'Gain one piece of lore. DM determines what is available.',
    ability: 'INT',
  },
  {
    name: 'Training (New Language or Tool)',
    duration: '250 days',
    cost: '1gp per day',
    requirements: ['Instructor who knows the language or tool'],
    description: 'Learn a new language or gain proficiency with a new tool.',
    ability: null,
  },
  {
    name: 'Carousing',
    duration: '1 workweek (7 days)',
    cost: 'Varies by lifestyle tier',
    requirements: ['Gold for expenses'],
    description: 'Make contacts in the community. Roll to determine what happens.',
    ability: 'CHA',
  },
  {
    name: 'Crime',
    duration: '1 workweek',
    cost: '25gp (for bribes, supplies)',
    requirements: ['Thieves\' tools or appropriate skill'],
    description: 'Commit a crime for profit. Risk getting caught.',
    ability: 'DEX',
  },
  {
    name: 'Gambling',
    duration: '1 workweek',
    cost: 'Wager (10-1000gp)',
    requirements: ['Gold to wager'],
    description: 'Gamble at dice, cards, or other games of chance.',
    ability: 'WIS',
  },
  {
    name: 'Pit Fighting',
    duration: '1 workweek',
    cost: 'None',
    requirements: ['Combat ability'],
    description: 'Fight in arena bouts for money and reputation.',
    ability: 'STR or CON or special',
  },
  {
    name: 'Relaxation',
    duration: '1 workweek',
    cost: 'Lifestyle expenses',
    requirements: ['None'],
    description: 'Recover from afflictions, gain advantage on saves vs lingering effects.',
    ability: null,
  },
  {
    name: 'Religious Service',
    duration: '1 workweek',
    cost: 'None',
    requirements: ['Temple or shrine'],
    description: 'Perform duties at a temple. Gain favors from the faithful.',
    ability: 'WIS',
  },
  {
    name: 'Scribing a Spell Scroll',
    duration: 'Varies by spell level',
    cost: 'Varies (15gp-250,000gp)',
    requirements: ['Proficiency in Arcana', 'Spell known/prepared', 'Materials'],
    description: 'Create a spell scroll for later use.',
    ability: 'INT',
  },
  {
    name: 'Brewing Potions',
    duration: 'Varies by rarity',
    cost: 'Varies (25gp-50,000gp)',
    requirements: ['Proficiency with Herbalism Kit', 'Recipe/knowledge'],
    description: 'Create potions using alchemical supplies.',
    ability: 'INT',
  },
];

/**
 * Get downtime activities that use a specific ability.
 */
export function getActivitiesByAbility(ability) {
  if (!ability) return DOWNTIME_ACTIVITIES;
  return DOWNTIME_ACTIVITIES.filter(a => a.ability === ability);
}
