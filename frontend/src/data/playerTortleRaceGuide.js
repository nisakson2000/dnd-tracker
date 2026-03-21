/**
 * playerTortleRaceGuide.js
 * Player Mode: Tortle — the natural armor turtle
 * Pure JS — no React dependencies.
 */

export const TORTLE_BASICS = {
  race: 'Tortle',
  source: 'The Tortle Package / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 STR, +1 WIS (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  note: 'Natural Armor = AC 17 (no armor needed). Shell Defense for +4 AC (prone). Dump DEX, max casting stats. Best for MAD classes that need high AC without investing in DEX.',
};

export const TORTLE_TRAITS = [
  { trait: 'Natural Armor', effect: 'AC = 17. No DEX bonus. Cannot benefit from wearing armor (shields work).', note: 'AC 17 flat. No DEX needed. Dump DEX to 8. Focus entirely on primary stats. Shield = AC 19.' },
  { trait: 'Shell Defense', effect: 'Action: withdraw into shell. +4 AC (AC 21 with shell), advantage on STR/CON saves. Speed 0, prone, disadvantage on DEX saves.', note: 'AC 21 emergency defense. Use when downed allies need protecting or you\'re being focus-fired.' },
  { trait: 'Claws', effect: '1d4+STR slashing unarmed strike.', note: 'Minor. Slightly better unarmed.' },
  { trait: 'Hold Breath', effect: 'Hold breath for 1 hour.', note: 'Underwater exploration. 1 hour without air. Very useful niche.' },
  { trait: 'Survival Instinct (MotM)', effect: 'Proficiency in Survival.', note: 'Free skill. Exploration utility.' },
];

export const TORTLE_CLASS_SYNERGY = [
  { class: 'Druid (Moon)', priority: 'S', reason: 'Druids can\'t wear metal armor. Tortle: AC 17 with no armor. Dump DEX, max WIS. Perfect.' },
  { class: 'Monk', priority: 'A', reason: 'AC 17 beats Unarmored Defense until very high DEX+WIS. Free to invest elsewhere. Controversial — some DMs say Natural Armor doesn\'t stack with Unarmored Defense (it doesn\'t — choose one).' },
  { class: 'Cleric (caster)', priority: 'A', reason: 'AC 17 + Shield = 19. No DEX investment. Max WIS from L1. Better than medium armor for low-DEX Clerics.' },
  { class: 'Wizard/Sorcerer', priority: 'A', reason: 'AC 17 on a full caster. No Mage Armor needed. Save the spell slot. Dump DEX, max casting stat.' },
  { class: 'Barbarian', priority: 'B', reason: 'AC 17 is good early but Unarmored Defense catches up. No Rage synergy. STR bonus helps though.' },
  { class: 'Fighter/Paladin', priority: 'C', reason: 'Heavy armor gives AC 18+ quickly. Tortle AC 17 is outpaced. Not ideal for armor classes.' },
];

export const TORTLE_AC_COMPARISON = [
  { build: 'Tortle (no shield)', ac: 17, note: 'Flat 17. No DEX investment needed.' },
  { build: 'Tortle + Shield', ac: 19, note: 'Best practical Tortle AC. 19 with zero stat investment.' },
  { build: 'Studded Leather (DEX 20)', ac: 17, note: 'Same as Tortle base, but requires 20 DEX.' },
  { build: 'Half Plate (DEX 14)', ac: 17, note: 'Same as Tortle. Requires 14 DEX and costs gold.' },
  { build: 'Plate Armor', ac: 18, note: 'Only 1 better than Tortle. Costs 1,500gp and requires STR 15.' },
  { build: 'Mage Armor (DEX 16)', ac: 16, note: 'Worse than Tortle AND costs a spell slot.' },
];

export const TORTLE_TACTICS = [
  { tactic: 'Dump DEX caster', detail: 'DEX 8. Max WIS/INT/CHA. AC 17 with no armor. Best for casters who want high casting stats.', rating: 'S' },
  { tactic: 'Moon Druid armor', detail: 'Druids can\'t use metal armor. Tortle bypasses this entirely. AC 17 always.', rating: 'S' },
  { tactic: 'Shell Defense emergency', detail: 'Downed in combat? Shell Defense: AC 21, advantage on STR/CON saves. Hunker down until healed.', rating: 'B' },
  { tactic: 'Shield + Natural Armor', detail: 'AC 19 with zero stat investment. Spend your ASIs entirely on primary stats.', rating: 'A' },
];

export function tortleACComparison(dexMod) {
  return {
    tortle: 17,
    studdedLeather: 12 + dexMod,
    halfPlate: 15 + Math.min(2, dexMod),
    mageArmor: 13 + dexMod,
    note: `Tortle AC 17 vs DEX ${dexMod} alternatives`,
  };
}
