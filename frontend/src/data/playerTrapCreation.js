/**
 * playerTrapCreation.js
 * Player Mode: Setting traps, ambush preparation, and defensive setups
 * Pure JS — no React dependencies.
 */

export const MUNDANE_TRAPS = [
  { trap: 'Caltrops (bag)', cost: '1 gp', area: '5ft square', effect: 'DEX save DC 15 or 1 piercing + speed 0 until healed (1 HP minimum).', note: 'Cheap and effective vs charging enemies.' },
  { trap: 'Ball Bearings', cost: '1 gp', area: '10ft square', effect: 'DEX save DC 10 or fall prone.', note: 'Combines well with caltrops.' },
  { trap: 'Hunting Trap', cost: '5 gp', area: '5ft', effect: 'DEX save DC 13 or 1d4 piercing + restrained. STR DC 13 to escape.', note: 'Hide it with Survival/Stealth check. Great for ambushes.' },
  { trap: 'Acid Vial', cost: '25 gp', area: 'Improvised weapon', effect: '2d6 acid damage on hit.', note: 'Can be rigged as a tripwire trap.' },
  { trap: 'Alchemist\'s Fire', cost: '50 gp', area: 'Improvised weapon', effect: '1d4 fire/turn until extinguished (DC 10 DEX action).', note: 'Area denial. Can ignite oil.' },
  { trap: 'Oil Flask + fire', cost: '1 sp + ignition', area: '5ft square', effect: '5 fire damage for 2 rounds when ignited.', note: 'Pour oil, lure enemies in, then ignite with Fire Bolt.' },
];

export const SPELL_TRAPS = [
  { spell: 'Glyph of Warding', level: 3, trigger: 'Customizable', effect: '5d8 element or any spell 3rd or lower stored in glyph.', note: 'Can store Counterspell, Banishment, Hold Person. Incredible.' },
  { spell: 'Alarm', level: 1, trigger: 'Creature enters area', effect: 'Mental or audible alarm.', note: 'Ritual. Set up perimeter. Free warning system.' },
  { spell: 'Snare', level: 1, trigger: 'Creature steps on it', effect: 'Restrained and dangling upside down. STR/DEX check to escape.', note: 'Ranger/Druid/Wizard ritual. Good for ambush setup.' },
  { spell: 'Cordon of Arrows', level: 2, trigger: 'Creature enters 30ft', effect: '1d6 piercing per arrow (up to 4). DEX save DC for half.', note: 'Ranger. Set and forget. Lasts 8 hours.' },
  { spell: 'Spike Growth', level: 2, trigger: 'Movement', effect: '2d4 piercing per 5ft moved. Creatures don\'t know it\'s there.', note: 'Combine with forced movement (Thorn Whip, Repelling Blast) for massive damage.' },
  { spell: 'Symbol', level: 7, trigger: 'Customizable', effect: 'Death, Discord, Fear, Hopelessness, Insanity, Pain, Sleep, Stunning.', note: 'Permanent until triggered. Best long-term trap.' },
];

export const AMBUSH_SETUP = [
  { step: 'Scout the location', detail: 'Find a choke point, natural funnel, or enclosed space. Limit enemy escape routes.' },
  { step: 'Set mundane traps', detail: 'Caltrops/ball bearings at entry points. Hunting traps in expected paths.' },
  { step: 'Cast defensive spells', detail: 'Spike Growth, Glyph of Warding, Alarm, Cordon of Arrows.' },
  { step: 'Position the party', detail: 'Ranged attackers elevated. Melee flanking entry. Casters behind cover.' },
  { step: 'Pass Without Trace', detail: '+10 Stealth to everyone. Near-guaranteed surprise round.' },
  { step: 'Wait for the signal', detail: 'Alarm triggers or spotter signals. Everyone acts on surprise round.' },
];

export const DEFENSIVE_POSITIONS = [
  { position: 'Doorway choke', advantage: 'Only 1-2 enemies can attack. Defender blocks passage.', setup: 'Tank in door, spike growth behind enemies, ranged attackers inside.' },
  { position: 'Elevated position', advantage: 'Ranged attackers fire down. Melee must climb (Athletics check, half move).', setup: 'Climb walls/trees/buildings. Use rope to prevent pursuit.' },
  { position: 'U-shaped ambush', advantage: 'Crossfire from 3 directions. Enemies surrounded immediately.', setup: 'Melee blocks retreat. Ranged on flanks. AoE in the kill zone.' },
  { position: 'Bridge/crossing', advantage: 'Single-file approach. Can destroy bridge to cut off reinforcements.', setup: 'Defend one end. Ready actions for when enemies cross.' },
];

export function trapDC(profBonus, toolMod) {
  return 8 + profBonus + (toolMod || 0);
}

export function spikeGrowthDamage(feetMoved) {
  return Math.floor(feetMoved / 5) * 2 * 2.5; // 2d4 avg per 5ft
}
