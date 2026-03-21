/**
 * playerSessionEndSummary.js
 * Player Mode: End-of-session summary template and auto-generation
 * Pure JS — no React dependencies.
 */

export const SESSION_SUMMARY_TEMPLATE = {
  sessionNumber: 0,
  date: '',
  duration: '',
  party: [],
  combats: { total: 0, won: 0, fled: 0, losses: 0 },
  discoveries: [],
  npcsEncountered: [],
  questsAdvanced: [],
  loot: { gold: 0, items: [], xp: 0 },
  characterUpdates: { hpChange: 0, levelUp: false, newAbilities: [], itemsGained: [] },
  highlights: { bestMoment: '', worstMoment: '', funniestMoment: '' },
  nextSessionNotes: '',
};

export const SUMMARY_PROMPTS = [
  { category: 'Combat', prompts: ['How many fights did you have?', 'What was the hardest fight?', 'Did anyone go down?', 'Most epic moment?'] },
  { category: 'Roleplay', prompts: ['Any important NPC conversations?', 'Any character development?', 'Funniest RP moment?', 'Most dramatic moment?'] },
  { category: 'Exploration', prompts: ['Where did you explore?', 'Any secrets discovered?', 'New areas mapped?', 'Environmental challenges?'] },
  { category: 'Loot', prompts: ['Gold earned?', 'Magic items found?', 'XP gained?', 'Anything interesting in treasure?'] },
  { category: 'Planning', prompts: ['What\'s the plan for next session?', 'Any loose threads to follow?', 'Resources remaining?', 'Who needs a long rest?'] },
];

export const AUTO_SUMMARY_FIELDS = [
  { field: 'totalDamageDealt', label: 'Total Damage Dealt', icon: '⚔️' },
  { field: 'totalDamageTaken', label: 'Total Damage Taken', icon: '🛡️' },
  { field: 'totalHealing', label: 'Total Healing', icon: '💚' },
  { field: 'spellsSlotUsed', label: 'Spell Slots Used', icon: '✨' },
  { field: 'criticalHits', label: 'Critical Hits', icon: '💥' },
  { field: 'timesDown', label: 'Times at 0 HP', icon: '💀' },
  { field: 'enemiesDefeated', label: 'Enemies Defeated', icon: '☠️' },
  { field: 'goldEarned', label: 'Gold Earned', icon: '💰' },
  { field: 'xpEarned', label: 'XP Earned', icon: '⭐' },
];

export function createSessionSummary(sessionNumber) {
  return {
    ...SESSION_SUMMARY_TEMPLATE,
    sessionNumber,
    date: new Date().toISOString().split('T')[0],
  };
}

export function generateAutoSummary(combatStats, resourcesUsed) {
  const summary = [];
  if (combatStats.totalDamageDealt > 0) summary.push(`Dealt ${combatStats.totalDamageDealt} total damage`);
  if (combatStats.criticalHits > 0) summary.push(`${combatStats.criticalHits} critical hit(s)!`);
  if (combatStats.timesDown > 0) summary.push(`Went down ${combatStats.timesDown} time(s)`);
  if (combatStats.enemiesDefeated > 0) summary.push(`Defeated ${combatStats.enemiesDefeated} enemies`);
  if (resourcesUsed.spellSlots > 0) summary.push(`Used ${resourcesUsed.spellSlots} spell slots`);
  return summary;
}

export function getPrompts(category) {
  const entry = SUMMARY_PROMPTS.find(p => p.category.toLowerCase() === (category || '').toLowerCase());
  return entry ? entry.prompts : [];
}
