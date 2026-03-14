export function getHpTier(currentHp, maxHp) {
  if (currentHp <= 0) return { tier: 'dead', label: 'Dead', color: '#6b7280' };
  const pct = currentHp / maxHp;
  if (pct >= 1.0)  return { tier: 'uninjured',  label: 'Uninjured',        color: '#4ade80' };
  if (pct >= 0.75) return { tier: 'scratched',   label: 'Barely Scratched', color: '#a3e635' };
  if (pct >= 0.50) return { tier: 'bloodied',    label: 'Bloodied',         color: '#fbbf24' };
  if (pct >= 0.25) return { tier: 'wounded',     label: 'Badly Wounded',    color: '#f97316' };
  return { tier: 'near_death', label: 'Near Death', color: '#ef4444' };
}
