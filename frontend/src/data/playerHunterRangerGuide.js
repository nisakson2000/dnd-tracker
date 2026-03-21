/**
 * playerHunterRangerGuide.js
 * Player Mode: Hunter Ranger — the classic monster slayer
 * Pure JS — no React dependencies.
 */

export const HUNTER_BASICS = {
  class: 'Ranger (Hunter)',
  source: 'Player\'s Handbook',
  theme: 'Classic monster hunter. Choose specializations at each tier. Versatile and reliable.',
  note: 'Solid PHB subclass. Customizable through choices at L3, 7, 11, 15. Colossus Slayer is the top pick.',
};

export const HUNTER_FEATURES_L3 = {
  title: 'Hunter\'s Prey (choose one)',
  choices: [
    { feature: 'Colossus Slayer', effect: 'Once per turn, deal extra 1d8 damage to a creature below its HP max.', note: 'Best choice. Free 1d8 every turn. Almost always active after round 1.', rating: 'S' },
    { feature: 'Giant Killer', effect: 'Reaction: when a Large+ creature within 5ft attacks you, make a weapon attack against it.', note: 'Extra reaction attack vs big creatures. Very niche. Only good against large enemies.', rating: 'B' },
    { feature: 'Horde Breaker', effect: 'Once per turn, make another weapon attack against a different creature within 5ft of the original target.', note: 'Extra attack against groups. Good for horde fights but less consistent than Colossus Slayer.', rating: 'A' },
  ],
};

export const HUNTER_FEATURES_L7 = {
  title: 'Defensive Tactics (choose one)',
  choices: [
    { feature: 'Escape the Horde', effect: 'Opportunity attacks against you have disadvantage.', note: 'Free pseudo-Disengage. Good for mobile Rangers.', rating: 'A' },
    { feature: 'Multiattack Defense', effect: 'When a creature hits you with an attack, +4 AC against all subsequent attacks from it this turn.', note: 'Best choice. +4 AC against multiattack monsters (dragons, giants). Scales amazingly.', rating: 'S' },
    { feature: 'Steel Will', effect: 'Advantage on saves vs being frightened.', note: 'Niche. Frightened condition isn\'t common enough.', rating: 'C' },
  ],
};

export const HUNTER_FEATURES_L11 = {
  title: 'Multiattack (choose one)',
  choices: [
    { feature: 'Volley', effect: 'Action: make a ranged attack against each creature within 10ft of a point you can see within your weapon\'s range.', note: 'AoE ranged attack. Hit every enemy in a cluster. Ammo-intensive but devastating.', rating: 'A' },
    { feature: 'Whirlwind Attack', effect: 'Action: make a melee attack against each creature within 5ft of you.', note: 'Melee AoE. Hit everything around you. Good if surrounded.', rating: 'B' },
  ],
};

export const HUNTER_FEATURES_L15 = {
  title: 'Superior Hunter\'s Defense (choose one)',
  choices: [
    { feature: 'Evasion', effect: 'DEX save for half damage: take 0 on success, half on failure.', note: 'Rogue\'s Evasion. Excellent. Fireball = 0 damage on save.', rating: 'S' },
    { feature: 'Stand Against the Tide', effect: 'When a creature misses you with melee, force it to attack another creature within 5ft.', note: 'Redirect missed attacks. Situational but fun.', rating: 'B' },
    { feature: 'Uncanny Dodge', effect: 'Reaction: halve one attack\'s damage against you.', note: 'Good but Evasion is usually better. Take if Evasion isn\'t needed.', rating: 'A' },
  ],
};

export const OPTIMAL_HUNTER_BUILD = {
  l3: 'Colossus Slayer (+1d8 per turn)',
  l7: 'Multiattack Defense (+4 AC vs multiattack)',
  l11: 'Volley (AoE ranged) or Whirlwind (AoE melee)',
  l15: 'Evasion (0 damage on DEX saves)',
  weapon: 'Longbow (ranged) or Two-weapon (melee)',
  style: 'Archery (+2 ranged) or Two-Weapon Fighting',
  note: 'Colossus Slayer + Multiattack Defense + Evasion is the standard optimal path.',
};

export function colossusSlayerDPR(rangerLevel, dexMod, targetAC) {
  const profBonus = Math.min(6, 2 + Math.floor((rangerLevel + 3) / 4));
  const attackBonus = dexMod + profBonus + 2; // Archery style
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const attacks = rangerLevel >= 5 ? 2 : 1;
  const weaponDmg = 4.5 + dexMod; // longbow
  const colossus = 4.5; // 1d8 once per turn
  return attacks * hitChance * weaponDmg + hitChance * colossus;
}

export function multiattackDefenseAC(baseAC) {
  return baseAC + 4; // After first hit from same creature
}
