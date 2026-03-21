/**
 * playerSessionRecap.js
 * Player Mode: Auto-generate session recap from events and stats
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// RECAP SECTIONS
// ---------------------------------------------------------------------------

export const RECAP_SECTIONS = [
  { id: 'combat', label: 'Combat Summary', icon: 'swords', color: '#ef4444' },
  { id: 'exploration', label: 'Exploration', icon: 'compass', color: '#4ade80' },
  { id: 'social', label: 'Social Encounters', icon: 'users', color: '#f472b6' },
  { id: 'discoveries', label: 'Discoveries', icon: 'eye', color: '#fbbf24' },
  { id: 'loot', label: 'Loot & Rewards', icon: 'package', color: '#60a5fa' },
  { id: 'milestones', label: 'Milestones', icon: 'flag', color: '#a78bfa' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Generate combat summary from session stats.
 */
export function generateCombatRecap(stats) {
  const lines = [];
  if (stats.attacksMade > 0) {
    const hitRate = stats.attacksMade > 0 ? Math.round((stats.attacksHit / stats.attacksMade) * 100) : 0;
    lines.push(`Attacks: ${stats.attacksHit}/${stats.attacksMade} (${hitRate}% hit rate)`);
  }
  if (stats.criticalHits > 0) lines.push(`Critical Hits: ${stats.criticalHits}`);
  if (stats.fumbles > 0) lines.push(`Fumbles: ${stats.fumbles}`);
  if (stats.damageDealt > 0) lines.push(`Total Damage Dealt: ${stats.damageDealt}`);
  if (stats.damageTaken > 0) lines.push(`Total Damage Taken: ${stats.damageTaken}`);
  if (stats.healingDone > 0) lines.push(`Healing Done: ${stats.healingDone}`);
  if (stats.healingReceived > 0) lines.push(`Healing Received: ${stats.healingReceived}`);
  if (stats.spellsCast > 0) lines.push(`Spells Cast: ${stats.spellsCast}`);
  if (stats.deathSavesMade > 0 || stats.deathSavesFailed > 0) {
    lines.push(`Death Saves: ${stats.deathSavesMade} passed, ${stats.deathSavesFailed} failed`);
  }
  if (stats.nat20Count > 0) lines.push(`Natural 20s: ${stats.nat20Count}`);
  if (stats.nat1Count > 0) lines.push(`Natural 1s: ${stats.nat1Count}`);
  return lines;
}

/**
 * Generate event-based recap from feed events.
 */
export function generateEventRecap(events) {
  const byCategory = {};
  for (const event of events) {
    const cat = event.category || 'system';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(event);
  }

  return {
    totalEvents: events.length,
    combatEvents: byCategory.combat?.length || 0,
    narrativeEvents: byCategory.narrative?.length || 0,
    questEvents: byCategory.quest?.length || 0,
    npcEvents: byCategory.npc?.length || 0,
    lootEvents: byCategory.loot?.length || 0,
    categories: byCategory,
  };
}

/**
 * Generate full session recap text.
 */
export function generateFullRecap(stats, events, playerName, sessionDuration) {
  const lines = [];
  lines.push(`=== Session Recap: ${playerName} ===`);

  if (sessionDuration) {
    const hours = Math.floor(sessionDuration / 3600);
    const mins = Math.floor((sessionDuration % 3600) / 60);
    lines.push(`Duration: ${hours > 0 ? `${hours}h ` : ''}${mins}m`);
  }

  lines.push('');

  const combatLines = generateCombatRecap(stats);
  if (combatLines.length > 0) {
    lines.push('--- Combat ---');
    lines.push(...combatLines);
    lines.push('');
  }

  const eventRecap = generateEventRecap(events);
  if (eventRecap.totalEvents > 0) {
    lines.push('--- Activity ---');
    lines.push(`Total Events: ${eventRecap.totalEvents}`);
    if (eventRecap.combatEvents > 0) lines.push(`  Combat: ${eventRecap.combatEvents}`);
    if (eventRecap.narrativeEvents > 0) lines.push(`  Narrative: ${eventRecap.narrativeEvents}`);
    if (eventRecap.questEvents > 0) lines.push(`  Quest: ${eventRecap.questEvents}`);
    if (eventRecap.npcEvents > 0) lines.push(`  NPC: ${eventRecap.npcEvents}`);
    if (eventRecap.lootEvents > 0) lines.push(`  Loot: ${eventRecap.lootEvents}`);
  }

  return lines.join('\n');
}

/**
 * Get highlights (best moments) from stats.
 */
export function getHighlights(stats) {
  const highlights = [];
  if (stats.criticalHits > 0) highlights.push({ type: 'crit', text: `Landed ${stats.criticalHits} critical hit${stats.criticalHits > 1 ? 's' : ''}!`, color: '#fde68a' });
  if (stats.nat20Count > 0) highlights.push({ type: 'nat20', text: `Rolled ${stats.nat20Count} natural 20${stats.nat20Count > 1 ? 's' : ''}!`, color: '#4ade80' });
  if (stats.healingDone > 0) highlights.push({ type: 'healing', text: `Healed ${stats.healingDone} HP total`, color: '#86efac' });
  if (stats.damageDealt > 100) highlights.push({ type: 'damage', text: `Dealt ${stats.damageDealt} total damage!`, color: '#fca5a5' });
  if (stats.deathSavesMade >= 3) highlights.push({ type: 'death_save', text: 'Cheated death!', color: '#a78bfa' });
  return highlights;
}
