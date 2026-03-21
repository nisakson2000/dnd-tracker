/**
 * playerTavernBrawlerGuide.js
 * Player Mode: Tavern Brawler feat and unarmed/improvised weapon optimization
 * Pure JS — no React dependencies.
 */

export const TAVERN_BRAWLER_FEAT = {
  asi: '+1 STR or CON',
  benefits: [
    'Proficiency with improvised weapons.',
    'Unarmed strikes deal 1d4 damage (instead of 1).',
    'When you hit with unarmed or improvised weapon: bonus action grapple attempt.',
  ],
  note: 'The grapple-on-hit is the real prize. Hit → free grapple → next turn shove prone → advantage on all attacks.',
};

export const IMPROVISED_WEAPONS = [
  { weapon: 'Chair', damage: '1d4 bludgeoning', note: 'Classic tavern weapon. Breaks easily.' },
  { weapon: 'Bottle', damage: '1d4 slashing', note: 'Breaks on hit. Can use as improvised dagger.' },
  { weapon: 'Table leg', damage: '1d4 bludgeoning', note: 'Basically a club.' },
  { weapon: 'Barrel', damage: '1d4 bludgeoning', note: 'Can be thrown (20/60ft range).' },
  { weapon: 'Shield bash', damage: '1d4 bludgeoning', note: 'Improvised attack with shield. Still get AC from shield.' },
  { weapon: 'Corpse', damage: 'DM discretion', note: 'Technically an improvised weapon. Intimidation factor.' },
  { weapon: 'Alchemist\'s Fire', damage: '1d4 fire/round', note: 'Improvised ranged. Hits: ongoing 1d4 fire until DC 10 DEX action.' },
];

export const GRAPPLE_STRIKER_BUILD = {
  concept: 'Hit with unarmed → free grapple → shove prone → advantage on all attacks. Target can\'t stand up.',
  whyCantStand: 'Prone creatures need half movement to stand. Grappled creatures have 0 speed. 0 × 0.5 = 0.',
  build: [
    { level: 1, feat: 'Tavern Brawler (V. Human)', class: 'Barbarian or Fighter' },
    { level: 4, feat: 'Skill Expert (Athletics expertise)', class: 'Continue primary' },
    { level: 5, detail: 'Extra Attack: Attack 1 (hit → grapple) + Attack 2 (shove prone). Now advantage on future attacks.' },
  ],
  rating: 'A',
};

export const UNARMED_BUILDS = [
  { build: 'Tavern Brawler Barbarian', detail: 'Rage + Reckless + grapple. Pin enemies and beat them. Advantage + rage damage.', rating: 'A' },
  { build: 'Tavern Brawler Rune Knight', detail: 'Giant\'s Might (Large) + grapple Large creatures. Rune for +2d6 damage. STR saves.', rating: 'S' },
  { build: 'Tavern Brawler Monk', detail: 'Monk already has unarmed damage. TB adds bonus action grapple. Stunning Strike + grapple.', rating: 'B' },
  { build: 'Tavern Brawler Fighter/Rogue', detail: 'Grapple → Sneak Attack (advantage from prone target). Athletics expertise.', rating: 'A' },
];

export function grappleCheck(strMod, profBonus, hasExpertise, hasAdvantage) {
  const prof = hasExpertise ? profBonus * 2 : profBonus;
  const base = strMod + prof;
  return { bonus: base, avgRoll: 10.5 + base + (hasAdvantage ? 5 : 0) };
}

export function pinDPR(attacks, damagePerHit, hasAdvantage) {
  // Advantage from prone target: +25% hit rate roughly
  const hitBonus = hasAdvantage ? 1.25 : 1;
  return attacks * damagePerHit * hitBonus;
}
