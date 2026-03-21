/**
 * playerInspirationUsageGuide.js
 * Player Mode: DM Inspiration — earning, using, and maximizing it
 * Pure JS — no React dependencies.
 */

export const INSPIRATION_RULES = {
  what: 'DM awards Inspiration for good roleplaying, clever ideas, or fun moments.',
  mechanic: 'Spend Inspiration to gain advantage on one attack roll, ability check, or saving throw.',
  limit: 'You either have it or you don\'t. Can\'t stack multiple Inspirations.',
  sharing: 'RAW: you can give your Inspiration to another player.',
  timing: 'Declare BEFORE the roll (RAW). Some DMs allow after roll but before result.',
};

export const BEST_USES = [
  { use: 'Critical Saving Throw', priority: 'S+', why: 'Failed save vs Hold Person, Banishment, or death effect = campaign-ending.' },
  { use: 'Key Attack Roll', priority: 'S', why: 'Paladin smite crit fishing. Fighter Action Surge turn. One big hit.' },
  { use: 'Death Saving Throw', priority: 'S+', why: 'Advantage on death save. 20 = auto-stabilize with 1 HP.' },
  { use: 'Crucial Ability Check', priority: 'A', why: 'Persuading the king, disarming the trap, final Athletics check.' },
  { use: 'Counterspell Check', priority: 'S', why: 'Counterspelling a higher-level spell. Advantage on the ability check.' },
  { use: 'Grapple/Shove Contest', priority: 'A', why: 'Grapple the boss. Shove off the cliff. High-impact contests.' },
];

export const HOW_TO_EARN = [
  { method: 'Roleplay Your Flaws', how: 'Act on your flaw even when it hurts you.', note: 'DMs love when you lean into character flaws.' },
  { method: 'Clever Problem Solving', how: 'Creative solution the DM didn\'t expect.', note: 'Think outside the box. Use the environment.' },
  { method: 'Stay In Character', how: 'Consistent personality, voice, decisions.', note: 'Make choices your character would, not optimal ones.' },
  { method: 'Advance the Story', how: 'Follow plot hooks. Engage with NPCs.', note: 'DMs appreciate players who engage with their world.' },
  { method: 'Help Other Players', how: 'Set up cool moments for others.', note: 'Pass the spotlight. Help new players.' },
  { method: 'Make the Table Laugh', how: 'In-character humor. Fun moments.', note: 'Fun > optimal play at most tables.' },
];

export const VARIANT_RULES = [
  { variant: 'Inspiration Pool', rule: 'Can stack up to 3 Inspiration.', note: 'Rewards consistent good play.' },
  { variant: 'Inspiration Dice', rule: 'Inspiration = extra d6 added to roll (not advantage).', note: 'Stacks with advantage. More flexible.' },
  { variant: 'Player-Awarded', rule: 'Players can award Inspiration to each other.', note: 'Encourages spotlighting each other.' },
  { variant: 'Start of Session', rule: 'Everyone starts each session with Inspiration.', note: 'Ensures everyone gets to use it.' },
  { variant: 'Hero Points (DMG)', rule: 'Gain hero points per level. Spend for +1d6 to any roll.', note: 'More granular than Inspiration.' },
];

export const INSPIRATION_TIPS = [
  'Use it or lose it. You can\'t stack Inspiration.',
  'Best use: saving throws. Failed saves can be devastating.',
  'Death saves: advantage can save your life. Literally.',
  'Give Inspiration to the player who needs it most.',
  'Roleplay your flaws. DMs reward embracing weakness.',
  'Ask your DM how they award Inspiration at Session 0.',
  'Don\'t hoard it. You\'ll earn more by playing well.',
  'Paladin smite crit fishing: Inspiration = advantage = better crit chance.',
  'Counterspell ability check: Inspiration can make the difference.',
  'Some DMs forget to award it. Gently remind them.',
];
