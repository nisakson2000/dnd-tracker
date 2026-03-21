/**
 * playerSpellSlotManagement.js
 * Player Mode: Spell slot budgeting, conservation, and adventuring day planning
 * Pure JS — no React dependencies.
 */

export const SLOT_TABLES = {
  fullCaster: {
    description: 'Wizard, Cleric, Druid, Bard, Sorcerer',
    slots: {
      1:  { 1: 2 },
      2:  { 1: 3 },
      3:  { 1: 4, 2: 2 },
      4:  { 1: 4, 2: 3 },
      5:  { 1: 4, 2: 3, 3: 2 },
      6:  { 1: 4, 2: 3, 3: 3 },
      7:  { 1: 4, 2: 3, 3: 3, 4: 1 },
      8:  { 1: 4, 2: 3, 3: 3, 4: 2 },
      9:  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
      10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
      11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
      13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
      15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
      17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    },
  },
  halfCaster: {
    description: 'Paladin, Ranger, Artificer',
    slots: {
      2:  { 1: 2 },
      3:  { 1: 3 },
      5:  { 1: 4, 2: 2 },
      7:  { 1: 4, 2: 3 },
      9:  { 1: 4, 2: 3, 3: 2 },
      11: { 1: 4, 2: 3, 3: 3 },
      13: { 1: 4, 2: 3, 3: 3, 4: 1 },
      17: { 1: 4, 2: 3, 3: 3, 4: 2, 5: 1 },
    },
  },
  pactMagic: {
    description: 'Warlock — all slots are the same level, recover on short rest',
    slots: {
      1:  { slots: 1, level: 1 },
      2:  { slots: 2, level: 1 },
      3:  { slots: 2, level: 2 },
      5:  { slots: 2, level: 3 },
      7:  { slots: 2, level: 4 },
      9:  { slots: 2, level: 5 },
      11: { slots: 3, level: 5 },
      17: { slots: 4, level: 5 },
    },
  },
};

export const ADVENTURING_DAY_BUDGET = {
  description: 'The DMG assumes 6-8 medium/hard encounters per long rest with 2 short rests.',
  slotBudget: [
    { encounters: '2 (easy day)', strategy: 'Go nova. Use your best slots freely. You\'ll long rest soon.' },
    { encounters: '3-4 (moderate day)', strategy: 'Use 1-2 high slots per combat. Save one emergency slot.' },
    { encounters: '5-6 (hard day)', strategy: 'Conserve high slots for hard fights. Cantrips and low slots for easy fights.' },
    { encounters: '7-8 (grueling day)', strategy: 'Ration everything. 1 leveled spell per easy fight. Save big slots for the boss.' },
  ],
  rule: 'If you don\'t know how many fights remain, spend about 1/3 of your remaining slots per fight.',
};

export const CONSERVATION_TIPS = [
  { tip: 'Cantrips are free damage', detail: 'Fire Bolt (3d10 at level 11) and Eldritch Blast scale well. Don\'t waste slots on easy fights.', priority: 'S' },
  { tip: 'Rituals save slots', detail: 'Detect Magic, Identify, Comprehend Languages — ritual cast when you have 10 minutes.', priority: 'S' },
  { tip: 'Concentration = value', detail: 'One concentration spell lasts the whole fight. That\'s better than multiple non-concentration spells.', priority: 'A' },
  { tip: 'Upcast wisely', detail: 'Healing Word at 1st level heals 1d4+mod. At 3rd level, only 3d4+mod. Not worth upcasting most heals.', priority: 'A' },
  { tip: 'Short rest recovery', detail: 'Arcane Recovery (Wizard), Natural Recovery (Land Druid), Pact Magic (Warlock). Use short rests.', priority: 'S' },
  { tip: 'Know your nova fights', detail: 'Boss fights deserve your best slots. Don\'t arrive at the boss with nothing left.', priority: 'S' },
  { tip: 'Non-spell solutions', detail: 'Skills, items, creativity. Not every problem needs a spell slot.', priority: 'A' },
  { tip: 'Environmental damage is free', detail: 'Push enemies off cliffs, into lava, under falling rocks. No slots needed.', priority: 'B' },
];

export const SLOT_PRIORITY_BY_LEVEL = {
  description: 'Which spell levels to conserve vs spend freely',
  tiers: [
    { level: '1st', priority: 'Spend freely', reason: 'You have the most of these. Shield, Healing Word, situational utility.' },
    { level: '2nd', priority: 'Moderate conservation', reason: 'Key workhorse spells: Misty Step, Hold Person, Spiritual Weapon.' },
    { level: '3rd', priority: 'Conserve for impact', reason: 'Fireball, Counterspell, Spirit Guardians, Haste. Major fight-changers.' },
    { level: '4th', priority: 'Save for hard fights', reason: 'Polymorph, Banishment, Greater Invisibility. One of these can win a fight.' },
    { level: '5th+', priority: 'Save for emergencies/boss', reason: 'Wall of Force, Animate Objects, Heal. Only 1-2 slots. Use wisely.' },
  ],
};

export function getSlotsForLevel(characterLevel, casterType) {
  const table = SLOT_TABLES[casterType];
  if (!table) return null;

  if (casterType === 'pactMagic') {
    const levels = Object.keys(table.slots).map(Number).sort((a, b) => a - b);
    const applicableLevel = levels.filter(l => l <= characterLevel).pop();
    return applicableLevel ? table.slots[applicableLevel] : null;
  }

  const levels = Object.keys(table.slots).map(Number).sort((a, b) => a - b);
  const applicableLevel = levels.filter(l => l <= characterLevel).pop();
  return applicableLevel ? table.slots[applicableLevel] : null;
}

export function slotBudgetPerFight(totalSlots, expectedFights) {
  if (expectedFights <= 0) return totalSlots;
  const budget = Math.ceil(totalSlots / expectedFights);
  return { perFight: budget, reserve: Math.max(1, Math.floor(totalSlots * 0.1)) };
}

export function totalSlotCount(slots) {
  if (!slots) return 0;
  return Object.values(slots).reduce((sum, count) => sum + count, 0);
}
