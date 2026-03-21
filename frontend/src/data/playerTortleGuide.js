/**
 * playerTortleGuide.js
 * Player Mode: Tortle race guide — the natural tank
 * Pure JS — no React dependencies.
 */

export const TORTLE_BASICS = {
  race: 'Tortle',
  source: 'The Tortle Package / MotM',
  size: 'Medium',
  speed: '30ft',
  asi: '+2 STR, +1 WIS (original) or flexible (MotM)',
  theme: 'Turtle folk. Natural 17 AC. Shell Defense. Born tank.',
  note: 'The lazy optimizer\'s dream. 17 AC with NO armor, NO DEX investment. Dump DEX and still have great AC.',
};

export const TORTLE_TRAITS = [
  { trait: 'Natural Armor', effect: 'AC = 17. Can\'t add DEX modifier. Can use shield (+2 = 19 AC).', note: 'FLAT 17 AC. No DEX needed. Better than chain mail. With shield: 19 AC at level 1.' },
  { trait: 'Shell Defense', effect: 'Action: withdraw into shell. +4 AC (21 with shield). Speed = 0. Prone. Disadvantage on DEX saves. Advantage on STR/CON saves.', note: '+4 AC but can\'t move. Use when you need to survive until healed.' },
  { trait: 'Claws', effect: 'Unarmed strikes deal 1d4+STR slashing.', note: 'Minor. 1d4 claws are rarely used over weapons.' },
  { trait: 'Hold Breath', effect: 'Hold breath for 1 hour.', note: 'Good for underwater exploration. 1 hour is very generous.' },
  { trait: 'Survival Instinct', effect: 'Proficiency in Survival.', note: 'Free skill. Useful for Rangers/Druids.' },
];

export const TORTLE_AC_ANALYSIS = {
  comparison: [
    { setup: 'Tortle (no armor)', ac: 17, cost: 'Free', note: 'Level 1. No investment.' },
    { setup: 'Tortle + Shield', ac: 19, cost: '10gp', note: 'Level 1. Matches half-plate + shield.' },
    { setup: 'Chain mail + Shield', ac: 18, cost: '85gp', note: 'Requires STR 13, heavy armor proficiency.' },
    { setup: 'Half-plate + Shield', ac: 19, cost: '760gp', note: 'Requires 14 DEX, medium armor proficiency.' },
    { setup: 'Plate + Shield', ac: 20, cost: '1510gp', note: 'Requires STR 15, heavy armor proficiency.' },
    { setup: 'Monk (DEX 20 + WIS 20)', ac: 20, cost: '2 maxed stats', note: 'Requires level 12+ with ASIs.' },
  ],
  verdict: 'Tortle has better AC than almost any medium armor setup, for free, at level 1.',
};

export const TORTLE_BUILDS = [
  { build: 'Tortle Druid', detail: '17 AC Druid. Druids can\'t wear metal armor. Tortle doesn\'t need armor. Best AC Druid option.', rating: 'S', note: 'Solves Druid\'s AC problem completely. 19 with shield.' },
  { build: 'Tortle Monk', detail: '17 AC beats Monk Unarmored Defense until DEX+WIS ≥ 17. Dump DEX, invest in other stats.', rating: 'A', note: 'Controversially good. You don\'t need DEX for AC. Focus on WIS and CON.' },
  { build: 'Tortle Cleric', detail: '19 AC with shield at L1. No heavy armor needed. Works for any domain.', rating: 'A' },
  { build: 'Tortle Barbarian', detail: '17 flat AC > Unarmored Defense (10+DEX+CON) until CON+DEX ≥ 17. With shield: 19.', rating: 'A', note: 'Can\'t use Shell Defense during Rage (can\'t take actions). But 17 base AC is great.' },
  { build: 'Tortle Wizard', detail: '17 AC Wizard with no Mage Armor needed. Save the spell known and spell slots.', rating: 'A', note: 'No need for Mage Armor (13+DEX). Tortle is flat 17. Save a spell known.' },
];

export function tortleAC(hasShield, shellDefense = false) {
  let ac = 17;
  if (hasShield) ac += 2;
  if (shellDefense) ac += 4;
  return ac;
}

export function tortleVsUnarmoredDefense(dexMod, wisMod) {
  const monkAC = 10 + dexMod + wisMod;
  const tortleAC = 17;
  return { monkAC, tortleAC, tortleBetter: tortleAC > monkAC };
}
