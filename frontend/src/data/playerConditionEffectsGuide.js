/**
 * playerConditionEffectsGuide.js
 * Player Mode: All conditions in 5e — what they do and how to remove them
 * Pure JS — no React dependencies.
 */

export const CONDITIONS = [
  {
    condition: 'Blinded',
    effects: ['Auto-fail sight-based checks', 'Attack rolls have disadvantage', 'Attacks against you have advantage'],
    removal: ['Greater Restoration', 'Lesser Restoration (some causes)', 'Wait for effect to end'],
    severity: 'High',
  },
  {
    condition: 'Charmed',
    effects: ['Can\'t attack charmer or target them with harmful abilities', 'Charmer has advantage on social checks against you'],
    removal: ['Calm Emotions', 'Taking damage (some charms)', 'Wait for duration to end'],
    severity: 'Medium',
  },
  {
    condition: 'Deafened',
    effects: ['Auto-fail hearing-based checks', 'Can\'t hear spells with verbal components (doesn\'t prevent casting)'],
    removal: ['Lesser Restoration', 'Wait for effect to end'],
    severity: 'Low',
  },
  {
    condition: 'Frightened',
    effects: ['Disadvantage on ability checks and attacks while source of fear is in line of sight', 'Can\'t willingly move closer to fear source'],
    removal: ['Calm Emotions', 'Heroes\' Feast (immunity)', 'Break line of sight', 'Berserker Rage (immune)'],
    severity: 'Medium-High',
  },
  {
    condition: 'Grappled',
    effects: ['Speed becomes 0', 'Can\'t benefit from any bonus to speed'],
    removal: ['Escape action (Athletics/Acrobatics vs grappler)', 'Misty Step/teleportation', 'Freedom of Movement'],
    severity: 'Medium',
  },
  {
    condition: 'Incapacitated',
    effects: ['Can\'t take actions or reactions'],
    removal: ['Depends on cause — often waiting for effect end'],
    severity: 'High',
  },
  {
    condition: 'Invisible',
    effects: ['Impossible to see without special sense', 'Advantage on attack rolls', 'Attacks against you have disadvantage'],
    removal: ['Faerie Fire', 'See Invisibility', 'Dispel Magic', 'AoE spells still work'],
    severity: 'Beneficial',
  },
  {
    condition: 'Paralyzed',
    effects: ['Incapacitated', 'Can\'t move or speak', 'Auto-fail STR and DEX saves', 'Attacks have advantage', 'Hits within 5ft are auto-crits'],
    removal: ['Greater Restoration', 'Wait for effect to end', 'Repeat saves (some effects)'],
    severity: 'Critical',
  },
  {
    condition: 'Petrified',
    effects: ['Incapacitated + can\'t move + unaware', 'Resistance to all damage', 'Immune to poison/disease', 'Auto-fail STR/DEX saves'],
    removal: ['Greater Restoration', 'Wish', 'Specific reversal methods'],
    severity: 'Critical',
  },
  {
    condition: 'Poisoned',
    effects: ['Disadvantage on attack rolls and ability checks'],
    removal: ['Lesser Restoration', 'Protection from Poison', 'Lay on Hands (5 HP)', 'Wait for duration'],
    severity: 'Medium',
  },
  {
    condition: 'Prone',
    effects: ['Disadvantage on attack rolls', 'Melee attacks against you have advantage', 'Ranged attacks against you have disadvantage', 'Can crawl (half speed)'],
    removal: ['Stand up (costs half movement)', 'Can\'t stand if speed is 0 (grappled+prone combo)'],
    severity: 'Medium',
  },
  {
    condition: 'Restrained',
    effects: ['Speed 0', 'Attacks have disadvantage', 'Attacks against you have advantage', 'Disadvantage on DEX saves'],
    removal: ['Break free (STR check vs DC)', 'Teleportation', 'Freedom of Movement'],
    severity: 'High',
  },
  {
    condition: 'Stunned',
    effects: ['Incapacitated', 'Can\'t move', 'Can speak only falteringly', 'Auto-fail STR/DEX saves', 'Attacks have advantage'],
    removal: ['Wait for effect to end (usually end of next turn)'],
    severity: 'Critical',
  },
  {
    condition: 'Unconscious',
    effects: ['Incapacitated + can\'t move + drops what holding + falls prone', 'Auto-fail STR/DEX saves', 'Attacks have advantage', 'Hits within 5ft are auto-crits'],
    removal: ['Healing', 'Taking damage (0 HP: wakes at 1 HP on nat 20 death save)', 'Shake awake (if from sleep, not 0 HP)'],
    severity: 'Critical',
  },
];

export const EXHAUSTION_LEVELS = [
  { level: 1, effect: 'Disadvantage on ability checks', note: 'Annoying but manageable.' },
  { level: 2, effect: 'Speed halved', note: 'Significant movement penalty.' },
  { level: 3, effect: 'Disadvantage on attack rolls and saving throws', note: 'Extremely dangerous in combat.' },
  { level: 4, effect: 'HP maximum halved', note: 'Half your max HP. Critical.' },
  { level: 5, effect: 'Speed reduced to 0', note: 'Can\'t move at all.' },
  { level: 6, effect: 'Death', note: 'You die. No saves, no HP — just dead.' },
];

export const EXHAUSTION_REMOVAL = {
  longRest: 'Remove 1 level per long rest (with food and water).',
  greaterRestoration: 'Remove 1 level of exhaustion (L5 spell).',
  heroicFeast: 'Heroes\' Feast doesn\'t cure exhaustion but prevents fear/poison.',
  note: 'Exhaustion stacks. Getting 2 levels before resting means 2 long rests to fully recover.',
};

export const CONDITION_IMMUNITY_SOURCES = {
  charmed: ['Elves (advantage)', 'Devotion Paladin Aura (immune in aura)', 'Calm Emotions', 'Mindless Rage (Berserker, immune)'],
  frightened: ['Heroes\' Feast (24hr immunity)', 'Berserker Rage', 'Devotion Paladin Aura', 'Calm Emotions'],
  poisoned: ['Dwarf (advantage + resistance)', 'Yuan-Ti (immune)', 'Monk Purity of Body (L10, immune)', 'Heroes\' Feast'],
  prone: ['Freedom of Movement (immune)', 'Flying creatures (can\'t be knocked prone unless grounded)'],
};
