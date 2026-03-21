/**
 * playerResourceSummary.js
 * Player Mode: At-a-glance resource summary (spell slots, features, consumables, HP)
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// RESOURCE TYPES
// ---------------------------------------------------------------------------

export const RESOURCE_TYPES = [
  { id: 'hp', label: 'Hit Points', color: '#ef4444', icon: 'heart' },
  { id: 'temp_hp', label: 'Temp HP', color: '#60a5fa', icon: 'shield' },
  { id: 'spell_slots', label: 'Spell Slots', color: '#a78bfa', icon: 'wand' },
  { id: 'hit_dice', label: 'Hit Dice', color: '#fbbf24', icon: 'dice' },
  { id: 'class_resource', label: 'Class Feature', color: '#c9a84c', icon: 'zap' },
  { id: 'consumable', label: 'Consumable', color: '#86efac', icon: 'flask' },
  { id: 'charges', label: 'Item Charges', color: '#f97316', icon: 'battery' },
];

// ---------------------------------------------------------------------------
// RESOURCE HEALTH
// ---------------------------------------------------------------------------

/**
 * Evaluate resource health as a percentage and status.
 */
export function getResourceHealth(current, max) {
  if (max <= 0) return { percent: 0, status: 'empty', color: '#6b7280' };
  const pct = Math.round((current / max) * 100);
  if (pct >= 75) return { percent: pct, status: 'good', color: '#4ade80' };
  if (pct >= 50) return { percent: pct, status: 'moderate', color: '#fbbf24' };
  if (pct >= 25) return { percent: pct, status: 'low', color: '#f97316' };
  if (pct > 0) return { percent: pct, status: 'critical', color: '#ef4444' };
  return { percent: 0, status: 'empty', color: '#6b7280' };
}

/**
 * Generate a resource summary for a character.
 */
export function generateResourceSummary(character, spellSlots, features, consumables) {
  const summary = [];

  // HP
  if (character) {
    const current = character.current_hp ?? 0;
    const max = character.max_hp ?? 1;
    summary.push({
      type: 'hp',
      label: 'HP',
      current,
      max,
      ...getResourceHealth(current, max),
    });
  }

  // Temp HP
  if (character?.temp_hp > 0) {
    summary.push({
      type: 'temp_hp',
      label: 'Temp HP',
      current: character.temp_hp,
      max: character.temp_hp,
      percent: 100,
      status: 'active',
      color: '#60a5fa',
    });
  }

  // Spell Slots (total remaining / total max)
  if (spellSlots && spellSlots.length > 0) {
    const totalRemaining = spellSlots.reduce((sum, s) => sum + Math.max(0, (s.max_slots || 0) - (s.used_slots || 0)), 0);
    const totalMax = spellSlots.reduce((sum, s) => sum + (s.max_slots || 0), 0);
    if (totalMax > 0) {
      summary.push({
        type: 'spell_slots',
        label: 'Spell Slots',
        current: totalRemaining,
        max: totalMax,
        ...getResourceHealth(totalRemaining, totalMax),
      });
    }
  }

  // Class Resources
  if (features) {
    for (const feat of features) {
      if ((feat.uses_total ?? 0) > 0) {
        summary.push({
          type: 'class_resource',
          label: feat.name,
          current: feat.uses_remaining ?? 0,
          max: feat.uses_total,
          ...getResourceHealth(feat.uses_remaining ?? 0, feat.uses_total),
        });
      }
    }
  }

  // Consumables count
  if (consumables && consumables.length > 0) {
    const totalItems = consumables.reduce((sum, c) => sum + (c.quantity ?? 1), 0);
    summary.push({
      type: 'consumable',
      label: 'Consumables',
      current: totalItems,
      max: totalItems,
      percent: 100,
      status: totalItems > 0 ? 'good' : 'empty',
      color: totalItems > 0 ? '#86efac' : '#6b7280',
    });
  }

  return summary;
}

/**
 * Check if a rest is recommended based on resource health.
 */
export function shouldRecommendRest(summary) {
  const low = summary.filter(r => r.status === 'critical' || r.status === 'empty' || r.status === 'low');
  const total = summary.length;
  if (total === 0) return { recommend: false, type: null };
  const lowPercent = low.length / total;
  if (lowPercent >= 0.5) return { recommend: true, type: 'long', reason: 'Most resources depleted' };
  if (low.some(r => r.type === 'hp' && r.percent <= 25)) return { recommend: true, type: 'short', reason: 'HP critically low' };
  if (low.length >= 2) return { recommend: true, type: 'short', reason: 'Multiple resources low' };
  return { recommend: false, type: null };
}
