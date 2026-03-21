/**
 * playerHalflingGuide.js
 * Player Mode: Halfling race optimization and Lucky trait tactics
 * Pure JS — no React dependencies.
 */

export const HALFLING_TRAITS = {
  asi: '+2 DEX',
  size: 'Small',
  speed: '25ft',
  lucky: 'When you roll a 1 on a d20 for attack/check/save, reroll and use the new roll.',
  brave: 'Advantage on saves vs frightened.',
  halflingNimbleness: 'Move through the space of any Medium or larger creature.',
};

export const HALFLING_SUBTYPES = [
  { subtype: 'Lightfoot', asi: '+1 CHA', trait: 'Naturally Stealthy: hide behind Medium+ creature.', bestFor: 'Rogue, Bard, Sorcerer, Warlock' },
  { subtype: 'Stout', asi: '+1 CON', trait: 'Advantage + resistance vs poison.', bestFor: 'Fighter, Ranger, any frontliner' },
  { subtype: 'Ghostwise (SCAG)', asi: '+1 WIS', trait: 'Silent Speech: telepathy 30ft.', bestFor: 'Druid, Cleric, Monk' },
  { subtype: 'Mark of Hospitality', asi: '+1 CHA', trait: 'Innate spells: Purify Food/Drink, Unseen Servant.', bestFor: 'Support roles, social builds' },
  { subtype: 'Mark of Healing', asi: '+1 WIS', trait: 'Bonus healing spells on spell list.', bestFor: 'Cleric, Druid healer' },
  { subtype: 'Lotusden (EGtW)', asi: '+1 WIS', trait: 'Druidcraft, Entangle (3), Spike Growth (5).', bestFor: 'Druid, nature builds' },
];

export const LUCKY_OPTIMIZATION = {
  power: 'Lucky trait eliminates ~5% of your worst rolls. On a d20, rolling a 1 has a 5% chance. Rerolling turns ~47.5% of those 1s into successes.',
  combos: [
    { combo: 'Lucky trait + Lucky feat', detail: 'Lucky feat: 3 luck points/day to reroll any d20. Combined with racial Lucky = never roll badly.' },
    { combo: 'Lucky + Halfling Divination Wizard', detail: 'Portent replaces rolls. Lucky rerolls 1s. You control the dice.' },
    { combo: 'Lucky + Bountiful Luck feat', detail: 'Use reaction to let an ally within 30ft reroll their 1. Party-wide Lucky.' },
    { combo: 'Lucky + Second Chance feat', detail: 'Force enemy to reroll attack against you. Stack with Lucky for defensive control.' },
  ],
};

export const HALFLING_BUILDS = [
  { build: 'Lightfoot Halfling Rogue', detail: 'Hide behind allies (Naturally Stealthy). DEX + CHA. Lucky saves you on clutch rolls.', rating: 'S' },
  { build: 'Stout Halfling Barbarian', detail: 'Small but fierce. Ride a Medium mount. Poison resistance stacks with Rage resistances.', rating: 'A' },
  { build: 'Ghostwise Halfling Druid', detail: 'Telepathy in Wild Shape (no verbal component needed). WIS bonus. Silent communication.', rating: 'A' },
  { build: 'Lightfoot Halfling Bard', detail: 'CHA + DEX. Hide behind the Fighter. Lucky + Bardic Inspiration = reliable everything.', rating: 'A' },
];

export function luckyRerollChance() {
  return 0.05; // 5% chance of rolling a 1, then rerolled
}

export function effectiveCritFailRate() {
  return 0.05 * 0.05; // 0.25% — need to roll 1 twice
}
