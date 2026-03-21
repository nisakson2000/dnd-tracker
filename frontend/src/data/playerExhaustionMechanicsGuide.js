/**
 * playerExhaustionMechanicsGuide.js
 * Player Mode: Exhaustion mechanics — levels, causes, prevention, and recovery
 * Pure JS — no React dependencies.
 */

export const EXHAUSTION_LEVELS = [
  { level: 1, effect: 'Disadvantage on ability checks.', severity: 'Mild', note: 'Skills and tools affected. Saves and attacks still fine.' },
  { level: 2, effect: 'Speed halved.', severity: 'Moderate', note: 'Movement cut in half. Harder to position in combat.' },
  { level: 3, effect: 'Disadvantage on attack rolls and saving throws.', severity: 'Severe', note: 'Combat effectiveness tanks. Saves become dangerous.' },
  { level: 4, effect: 'Hit point maximum halved.', severity: 'Critical', note: 'Max HP cut in half. Very fragile.' },
  { level: 5, effect: 'Speed reduced to 0.', severity: 'Dire', note: 'Cannot move at all. Effectively incapacitated for movement.' },
  { level: 6, effect: 'Death.', severity: 'Fatal', note: 'You die. No saving throw. No death saves. Just dead.' },
];

export const EXHAUSTION_CAUSES = [
  { cause: 'Forced march', rule: 'CON save (DC 10 + 1/hr) for each hour beyond 8 hours of travel.', frequency: 'Common' },
  { cause: 'No food (starvation)', rule: '1 level per day beyond 3 + CON mod days without food.', frequency: 'Common' },
  { cause: 'No water (dehydration)', rule: '1 level per day (2 if hot). CON save halves.', frequency: 'Common' },
  { cause: 'Berserker Rage (Barbarian)', rule: '1 level when Frenzy rage ends.', frequency: 'Class feature' },
  { cause: 'Sickening Radiance', rule: '1 level on failed CON save (4th level spell).', frequency: 'Spell' },
  { cause: 'Dream (spell)', rule: 'Target gains no benefit from rest + 1 level exhaustion.', frequency: 'Spell' },
  { cause: 'Extreme cold', rule: 'CON save (DC 10) each hour or gain 1 level.', frequency: 'Environment' },
  { cause: 'Extreme heat', rule: 'CON save (DC 5 + 1/hr) each hour or gain 1 level.', frequency: 'Environment' },
  { cause: 'Tundra Storm Herald (Barbarian)', rule: 'Target makes CON save or gains 1 level.', frequency: 'Class feature' },
  { cause: 'Some monster abilities', rule: 'Various creatures inflict exhaustion on attacks or auras.', frequency: 'Encounter' },
];

export const EXHAUSTION_RECOVERY = [
  { method: 'Long Rest (with food and drink)', effect: 'Remove 1 level of exhaustion.', note: 'Only 1 level per long rest. Multiple levels take multiple days.' },
  { method: 'Greater Restoration', effect: 'Remove 1 level of exhaustion.', note: '5th level spell. Component: 100gp diamond dust.' },
  { method: 'Potion of Vitality', effect: 'Remove all exhaustion.', note: 'Very rare potion. Removes ALL levels at once.' },
  { method: 'Hero\'s Feast', effect: 'Immunity to frightened, poison. +2d10 max HP. Cures all diseases and poison.', note: 'Does NOT remove exhaustion, but prevents further accumulation from some sources.' },
];

export const EXHAUSTION_PREVENTION = [
  'Create Food and Water (Cleric 3, Paladin 3, Artificer 3): eliminates starvation/dehydration risk.',
  'Goodberry (Druid 1, Ranger 1): 1 berry = 1 day of sustenance. 10 berries per casting.',
  'Ring of Sustenance: no food or water needed. Only 4 hours of sleep.',
  'Berserker Barbarian: avoid Frenzy unless it\'s the boss fight. Exhaustion is brutal.',
  'Forced march: take short rests. Bard/Cleric can cast spells to boost CON saves.',
  'Extreme temperatures: Endure Elements via Ranger\'s Natural Explorer or survival gear.',
  'Sickening Radiance: leave the area immediately. Each failed save = 1 more level.',
  'Keep rations and waterskins stocked. Mundane but essential.',
];

export const EXHAUSTION_TIPS = [
  'Exhaustion stacks. Level 3 means you have levels 1, 2, AND 3 effects simultaneously.',
  'Only 1 level removed per long rest. 3 levels = 3 days of rest to fully recover.',
  'Greater Restoration removes 1 level. Expensive (100gp) but necessary in emergencies.',
  'Berserker Barbarian: Frenzy is a trap at low levels. Save it for critical fights.',
  'Level 3 exhaustion (disadvantage on saves) can be a death spiral. Prioritize recovery.',
  'Sickening Radiance is one of the deadliest spells because exhaustion 6 = death. No save.',
  'Goodberry: carry some. 1 berry prevents starvation for a whole day.',
  'Level 6 = instant death. No death saves. Players should be very cautious at level 4-5.',
];
