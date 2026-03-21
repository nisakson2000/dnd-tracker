/**
 * playerSunSoulMonkGuide.js
 * Player Mode: Way of the Sun Soul Monk — the ranged ki blaster
 * Pure JS — no React dependencies.
 */

export const SUN_SOUL_BASICS = {
  class: 'Monk (Way of the Sun Soul)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Ranged radiant attacks. Dragonball Z energy blasts. Monk with range options but lower overall power.',
  note: 'Radiant Sun Bolt gives Monks a reliable ranged attack (30ft). Searing Arc Strike is a ki-fueled Burning Hands. Sun Shield gives temp HP aura at L17. Thematic but not top-tier.',
};

export const SUN_SOUL_FEATURES = [
  { feature: 'Radiant Sun Bolt', level: 3, effect: 'Ranged spell attack, 30ft range, 1d4+DEX radiant damage. Replaces unarmed strikes (including Flurry of Blows).', note: 'Scales with Martial Arts die. Ranged Flurry of Blows = 4 ranged attacks at L5. Decent but 30ft is short.' },
  { feature: 'Searing Arc Strike', level: 6, effect: 'After Attack action: spend 2+ ki for Burning Hands (3d6 fire). Extra ki = upcast (+1d6/ki, max 3 extra).', note: '3d6 AoE for 2 ki. Can upcast to 6d6 for 5 ki. Ki-expensive but decent AoE.' },
  { feature: 'Searing Sunburst', level: 11, effect: '0 ki: 2d6 radiant in 20ft sphere at 150ft (CON save). Spend 1-3 ki for +2d6 each.', note: 'Free 2d6 AoE at 150ft. With 3 ki: 8d6 (28 avg). Long range, no concentration.' },
  { feature: 'Sun Shield', level: 17, effect: 'Emit bright light 30ft. When hit by melee: 5+WIS mod radiant damage to attacker.', note: 'Passive retaliation. 5+5 = 10 radiant per melee hit taken. Decent but late.' },
];

export const SUN_SOUL_TACTICS = [
  { tactic: 'Ranged Flurry of Blows', detail: 'L5: 4 ranged attacks at 30ft. Each deals martial arts die + DEX. Full Monk damage from range.', rating: 'A' },
  { tactic: 'Searing Sunburst free AoE', detail: 'L11: free 2d6 AoE at 150ft. No ki, no action cost beyond action. Add ki for more damage.', rating: 'B' },
  { tactic: 'Kite enemies', detail: 'Stay at 30ft. Radiant Sun Bolt for damage. Step of the Wind to maintain distance. Never get hit.', rating: 'A' },
  { tactic: 'Switch melee/ranged', detail: 'Flexibility to go melee (Stunning Strike) or ranged (Sun Bolt). Adapt to situation.', rating: 'B' },
];

export const SUN_SOUL_VERDICT = {
  strengths: 'Ranged option for Monks, radiant damage type, thematic/fun',
  weaknesses: 'Low damage compared to other Monks, ki-hungry, 30ft is short range, no CC',
  comparison: 'Mercy Monk and Astral Self outperform in most situations. Sun Soul is best for "anime energy blast" fantasy.',
  recommendation: 'Play for flavor and fun. Not optimized but functional. Great for casual games.',
};

export function radiantSunBoltDamage(dexMod, martialArtsDie) {
  return { perBolt: `1d${martialArtsDie}+${dexMod}`, avg: (martialArtsDie / 2 + 0.5) + dexMod, range: 30 };
}

export function searingSunburstDamage(kiSpent = 0) {
  const dice = 2 + (kiSpent * 2);
  return { damage: `${dice}d6`, avg: dice * 3.5, range: 150, aoe: '20ft sphere', kiCost: kiSpent };
}
