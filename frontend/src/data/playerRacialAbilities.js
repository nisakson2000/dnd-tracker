/**
 * playerRacialAbilities.js
 * Player Mode: Racial features and abilities reference for combat
 * Pure JS — no React dependencies.
 */

export const RACIAL_COMBAT_FEATURES = [
  { race: 'Dragonborn', feature: 'Breath Weapon', action: 'Action', recharge: 'Short/Long rest', effect: 'AoE damage based on ancestry. DC 8 + CON + prof.', tip: 'Use early when you have less attacks. Scales with prof bonus.' },
  { race: 'Dwarf (Hill)', feature: 'Dwarven Toughness', action: 'Passive', recharge: 'Always', effect: '+1 HP per level.', tip: 'Stacks with Tough feat for +3 HP/level.' },
  { race: 'Dwarf (Mountain)', feature: 'Dwarven Armor Training', action: 'Passive', recharge: 'Always', effect: 'Medium and light armor proficiency.', tip: 'Wizard in medium armor = great AC.' },
  { race: 'Elf (High)', feature: 'Cantrip', action: 'Varies', recharge: 'Always', effect: 'One wizard cantrip (INT-based).', tip: 'Booming Blade or Green-Flame Blade for non-casters.' },
  { race: 'Elf (Wood)', feature: 'Fleet of Foot', action: 'Passive', recharge: 'Always', effect: '35ft base movement.', tip: '5 extra feet adds up. Best with Monk or Mobile feat.' },
  { race: 'Elf (Drow)', feature: 'Faerie Fire', action: 'Action', recharge: 'Long rest', effect: 'Advantage on attacks vs outlined creatures.', tip: 'Party-wide advantage. One of the best racial spells.' },
  { race: 'Gnome', feature: 'Gnome Cunning', action: 'Passive', recharge: 'Always', effect: 'Advantage on INT, WIS, CHA saves vs magic.', tip: 'One of the best defensive racials in the game.' },
  { race: 'Half-Orc', feature: 'Relentless Endurance', action: 'Reaction', recharge: 'Long rest', effect: 'Drop to 1 HP instead of 0 (once).', tip: 'Free Death Ward. Amazing for melee characters.' },
  { race: 'Half-Orc', feature: 'Savage Attacks', action: 'Passive', recharge: 'Always', effect: 'Extra damage die on critical hits.', tip: 'Best with Greataxe (3d12 crits). Champion Fighter synergy.' },
  { race: 'Halfling', feature: 'Lucky', action: 'Passive', recharge: 'Always', effect: 'Reroll natural 1s on attacks, checks, and saves.', tip: 'Never critically fail. Incredibly reliable.' },
  { race: 'Human (Variant)', feature: 'Bonus Feat', action: 'Passive', recharge: 'Always', effect: 'One feat at level 1.', tip: 'GWM, Sharpshooter, or PAM at level 1 is huge.' },
  { race: 'Tiefling', feature: 'Hellish Rebuke', action: 'Reaction', recharge: 'Long rest', effect: '2d10 fire damage when hit (scales with level).', tip: 'Free reaction damage. Great for melee builds.' },
  { race: 'Aasimar', feature: 'Healing Hands', action: 'Action', recharge: 'Long rest', effect: 'Heal HP equal to your level.', tip: 'Emergency healing without spell slots.' },
  { race: 'Goliath', feature: 'Stone\'s Endurance', action: 'Reaction', recharge: 'Short rest', effect: 'Reduce damage by 1d12 + CON mod.', tip: 'On-demand damage reduction. Better than it looks.' },
  { race: 'Tabaxi', feature: 'Feline Agility', action: 'Free', recharge: 'Move 0ft for 1 turn', effect: 'Double movement speed for one turn.', tip: '60ft burst of speed. Amazing for hit-and-run tactics.' },
];

export function getRacialFeatures(race) {
  return RACIAL_COMBAT_FEATURES.filter(f => f.race.toLowerCase().includes((race || '').toLowerCase()));
}

export function getCombatRacials() {
  return RACIAL_COMBAT_FEATURES.filter(f => f.action !== 'Passive');
}
