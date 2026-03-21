/**
 * Fame & Infamy System — Regional reputation tracking.
 * Party reputation varies by region and spreads via trade routes.
 */

export const REPUTATION_TIERS = [
  { min: -100, max: -76, label: 'Hated', color: '#7f1d1d', effects: 'Attacked on sight. Maximum prices. No services.', icon: 'skull' },
  { min: -75, max: -51, label: 'Reviled', color: '#ef4444', effects: 'Guards follow you. Double prices. Refused at inns.', icon: 'thumbs-down' },
  { min: -50, max: -26, label: 'Disliked', color: '#f97316', effects: '50% price increase. Suspicious NPCs. Reluctant help.', icon: 'frown' },
  { min: -25, max: -1, label: 'Wary', color: '#fbbf24', effects: '25% price increase. NPCs are cautious. Limited information.', icon: 'eye' },
  { min: 0, max: 0, label: 'Unknown', color: '#94a3b8', effects: 'Normal prices and reactions. No reputation precedes you.', icon: 'minus' },
  { min: 1, max: 25, label: 'Known', color: '#60a5fa', effects: 'Recognized occasionally. Normal prices. Basic goodwill.', icon: 'smile' },
  { min: 26, max: 50, label: 'Respected', color: '#818cf8', effects: '10% discount. Helpful NPCs. Free basic information.', icon: 'thumbs-up' },
  { min: 51, max: 75, label: 'Famous', color: '#c084fc', effects: '25% discount. Free lodging. NPCs seek you out for quests.', icon: 'star' },
  { min: 76, max: 100, label: 'Legendary', color: '#fbbf24', effects: 'Songs sung about you. Armies rally. History remembers.', icon: 'crown' },
];

export const REPUTATION_EVENTS = {
  positive: [
    { event: 'Saved a town from danger', points: 15, spread: 'fast' },
    { event: 'Defeated a major villain', points: 20, spread: 'fast' },
    { event: 'Donated generously to the poor', points: 5, spread: 'slow' },
    { event: 'Completed a public quest', points: 10, spread: 'medium' },
    { event: 'Protected travelers on the road', points: 8, spread: 'medium' },
    { event: 'Healed the sick during a plague', points: 12, spread: 'fast' },
    { event: 'Brokered a peace agreement', points: 15, spread: 'fast' },
    { event: 'Won a tournament fairly', points: 10, spread: 'medium' },
  ],
  negative: [
    { event: 'Killed innocents', points: -20, spread: 'fast' },
    { event: 'Stole from a merchant', points: -5, spread: 'medium' },
    { event: 'Betrayed an ally publicly', points: -15, spread: 'fast' },
    { event: 'Destroyed property', points: -8, spread: 'medium' },
    { event: 'Defied local authority', points: -10, spread: 'medium' },
    { event: 'Desecrated a holy site', points: -12, spread: 'fast' },
    { event: 'Failed to protect those in need', points: -5, spread: 'slow' },
    { event: 'Broke a sworn promise', points: -10, spread: 'medium' },
  ],
};

export const SPREAD_RATES = {
  fast: { sessions: 1, description: 'News travels quickly — by messenger, magic, or panic' },
  medium: { sessions: 2, description: 'Word spreads through trade routes and travelers' },
  slow: { sessions: 4, description: 'Gradual word of mouth over time' },
};

export const COLLATERAL_TRACKING = [
  { type: 'civilian_casualties', label: 'Civilian Casualties', pointsPer: -3 },
  { type: 'property_damage', label: 'Property Destroyed', pointsPer: -2 },
  { type: 'broken_promises', label: 'Broken Promises', pointsPer: -4 },
  { type: 'debts_unpaid', label: 'Unpaid Debts', pointsPer: -2 },
  { type: 'lives_saved', label: 'Lives Saved', pointsPer: 2 },
  { type: 'quests_completed', label: 'Quests Completed', pointsPer: 3 },
];

export function getReputationTier(points) {
  return REPUTATION_TIERS.find(t => points >= t.min && points <= t.max) || REPUTATION_TIERS[4];
}

export function calculateReputationSpread(basePoints, regionDistance) {
  // Reputation diminishes with distance: nearby regions get full effect, distant get less
  const falloff = Math.max(0, 1 - (regionDistance * 0.2));
  return Math.round(basePoints * falloff);
}

export function getReputationModifier(points) {
  const tier = getReputationTier(points);
  if (points >= 51) return { priceModifier: 0.75, socialAdvantage: true };
  if (points >= 26) return { priceModifier: 0.9, socialAdvantage: false };
  if (points >= 1) return { priceModifier: 1.0, socialAdvantage: false };
  if (points >= -25) return { priceModifier: 1.25, socialAdvantage: false };
  if (points >= -50) return { priceModifier: 1.5, socialAdvantage: false };
  return { priceModifier: 2.0, socialAdvantage: false };
}
