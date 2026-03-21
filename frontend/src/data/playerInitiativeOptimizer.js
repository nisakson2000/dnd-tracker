/**
 * playerInitiativeOptimizer.js
 * Player Mode: Initiative optimization and going-first strategies
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_SOURCES = [
  { source: 'DEX modifier', bonus: '+1 to +5', availability: 'Everyone', note: 'Base initiative. High DEX = going first more often.' },
  { source: 'Alert feat', bonus: '+5', availability: 'Any class', note: 'The single biggest initiative boost. Also can\'t be surprised.' },
  { source: 'Dread Ambusher (Gloom Stalker)', bonus: '+WIS mod', availability: 'Ranger 3+', note: 'WIS to initiative. With 16 WIS = +3 extra. Stacks with DEX.' },
  { source: 'War Wizard (Initiative)', bonus: '+INT mod', availability: 'Wizard 2+', note: 'INT to initiative. With 20 INT = +5 extra. War Wizard is great for initiative.' },
  { source: 'Swashbuckler Rakish Audacity', bonus: '+CHA mod', availability: 'Rogue 3+', note: 'CHA to initiative. Incentivizes CHA for the Rogue.' },
  { source: 'Gift of Alacrity (Chronurgy)', bonus: '+1d8', availability: 'Chronurgy Wizard', note: 'Lasts 8 hours. Non-concentration. Can be shared via Arcane Abeyance.' },
  { source: 'Weapon of Warning', bonus: 'Advantage on initiative', availability: 'Magic item (Uncommon)', note: 'Advantage ≈ +5 average. Also prevents surprise. Great item.' },
  { source: 'Jack of All Trades (Bard)', bonus: '+half proficiency', availability: 'Bard 2+', note: 'Initiative IS an ability check. JoAT applies. +1 to +3 by level.' },
  { source: 'Remarkable Athlete (Champion)', bonus: '+half proficiency to initiative', availability: 'Fighter 7+', note: 'Same as JoAT but only for Champion Fighters.' },
  { source: 'Barbarian Feral Instinct', bonus: 'Advantage on initiative', availability: 'Barbarian 7+', note: 'Advantage + can act on surprise rounds (if raging).' },
];

export const GOING_FIRST_IMPORTANCE = {
  critical: [
    'Assassin Rogue: Assassinate requires acting before the target. Going first = auto-crit.',
    'Gloom Stalker: Dread Ambusher extra attack only works on first turn. Earlier = more impact.',
    'Controller casters: Dropping Hypnotic Pattern before enemies act can end a fight instantly.',
    'Any caster vs casters: Counterspell their first spell. Going first = dictating the tempo.',
  ],
  important: [
    'Barbarian: Rage on turn 1. Can\'t rage if you\'re already taking damage.',
    'Cleric: Bless or Spirit Guardians before allies need to roll.',
    'Paladin: Aura of Protection helps MORE if you haven\'t taken damage yet.',
    'Anyone: Enemies who act before you might kill/disable you before your turn.',
  ],
  lessImportant: [
    'Tanks who want enemies to come to them (going last can be fine).',
    'Support characters who react to the situation (but still prefer going first).',
    'Characters with limited first-turn impact (no buffs, no AoE, no setup).',
  ],
};

export const INITIATIVE_BUILDS = [
  { build: 'Gloom Stalker + Alert', totalBonus: 'DEX + WIS + 5', maxBonus: '+15', note: 'Go first, get Dread Ambusher extra attack + extra 1d8, invisible in darkness.' },
  { build: 'War Wizard + Alert', totalBonus: 'DEX + INT + 5', maxBonus: '+15', note: 'Go first, drop Hypnotic Pattern or Web. Fight\'s half over.' },
  { build: 'Swashbuckler + Alert', totalBonus: 'DEX + CHA + 5', maxBonus: '+15', note: 'Go first, Sneak Attack without needing an ally nearby (Rakish Audacity).' },
  { build: 'Chronurgy Wizard + Alert + Gift of Alacrity', totalBonus: 'DEX + INT + 5 + 1d8', maxBonus: '+23', note: 'Highest possible initiative in the game. Go first literally every time.' },
];

export function calculateInitiativeBonus(dexMod, otherBonuses) {
  return dexMod + (otherBonuses || []).reduce((sum, b) => sum + b, 0);
}

export function averageInitiative(bonus, hasAdvantage) {
  const base = 10.5 + bonus; // d20 average
  if (hasAdvantage) return 13.825 + bonus; // advantage average
  return base;
}

export function goFirstChance(yourBonus, enemyBonus) {
  // Simplified: chance you beat an enemy with given bonus
  const diff = yourBonus - enemyBonus;
  return Math.min(95, Math.max(5, 50 + (diff * 5)));
}
