/**
 * playerPhantomRogueGuide.js
 * Player Mode: Phantom Rogue — death-touched rogue with soul tokens
 * Pure JS — no React dependencies.
 */

export const PHANTOM_BASICS = {
  class: 'Rogue (Phantom)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Ghost-touched rogue. Steal souls, spread Sneak Attack damage, become incorporeal.',
  note: 'Excellent subclass. Wails from the Grave adds AoE to SA. Tokens of the Departed give free Asks of the Dead.',
};

export const PHANTOM_FEATURES = [
  { feature: 'Whispers of the Dead', level: 3, effect: 'After each short/long rest, gain proficiency in one skill or tool of your choice.', note: 'Any skill, any tool. Need Thieves\' Tools? Medicine? Persuasion? Pick it fresh each rest.' },
  { feature: 'Wails from the Grave', level: 3, effect: 'After dealing Sneak Attack, deal half SA dice (rounded down) in necrotic damage to another creature within 30ft of SA target. PB times/long rest.', note: 'AoE Sneak Attack! Hit one target, damage another. No save. No attack roll.' },
  { feature: 'Tokens of the Departed', level: 9, effect: 'When a creature within 30ft dies, capture a soul trinket (reaction). Max = PB trinkets. Destroy a trinket: ask one question to dead creature\'s spirit, or gain advantage on death saves/CON saves.', note: 'Free Speak with Dead. Advantage on important saves. Collect souls.' },
  { feature: 'Ghost Walk', level: 13, effect: 'Bonus action: become ghostly for 10 min. Fly 10ft, move through creatures/objects (take 1d10 if you end turn inside). Once/long rest or destroy trinket.', note: 'Phase through walls. 10ft fly. Scout anywhere. Escape anything.' },
  { feature: 'Death\'s Friend', level: 17, effect: 'Wails from the Grave no longer costs uses. Free every Sneak Attack. Plus: if no trinkets, gain one when you finish a long rest.', note: 'EVERY Sneak Attack now hits two targets. Permanent cleave.' },
];

export const PHANTOM_TACTICS = [
  { tactic: 'Wails cleave', detail: 'SA on primary target. Second creature within 30ft takes half SA dice necrotic. No save, no attack.', rating: 'S', note: 'At L5: 3d6 SA. Wail = 1d6 to second target. At L11: 6d6 SA, Wail = 3d6 splash.' },
  { tactic: 'Skill flexibility', detail: 'Need Athletics to climb? Pick it. Need Medicine to stabilize? Pick it. Change every short rest.', rating: 'A', note: 'You\'re proficient in EVERYTHING (one at a time).' },
  { tactic: 'Soul token economy', detail: 'Hoard trinkets from kills. Use for: Speak with Dead (info), advantage on death saves (survival), or fuel Ghost Walk.', rating: 'A' },
  { tactic: 'Ghost Walk scouting', detail: 'Phase through dungeon walls. 10ft fly through floors/ceilings. Scout entire dungeon safely (10 min duration).', rating: 'A' },
  { tactic: 'L17 permanent Wails', detail: 'Every SA splashes to a second target for free. In a fight with multiple enemies, you damage 2 per turn always.', rating: 'S' },
];

export const WAILS_DAMAGE_TABLE = [
  { rogueLevel: 3, saDice: '2d6', wailDice: '1d6', wailAvg: 3.5 },
  { rogueLevel: 5, saDice: '3d6', wailDice: '1d6', wailAvg: 3.5 },
  { rogueLevel: 7, saDice: '4d6', wailDice: '2d6', wailAvg: 7 },
  { rogueLevel: 9, saDice: '5d6', wailDice: '2d6', wailAvg: 7 },
  { rogueLevel: 11, saDice: '6d6', wailDice: '3d6', wailAvg: 10.5 },
  { rogueLevel: 13, saDice: '7d6', wailDice: '3d6', wailAvg: 10.5 },
  { rogueLevel: 15, saDice: '8d6', wailDice: '4d6', wailAvg: 14 },
  { rogueLevel: 17, saDice: '9d6', wailDice: '4d6', wailAvg: 14 },
  { rogueLevel: 19, saDice: '10d6', wailDice: '5d6', wailAvg: 17.5 },
];

export function wailsFromTheGraveDamage(rogueLevel) {
  const saDice = Math.ceil(rogueLevel / 2);
  const wailDice = Math.floor(saDice / 2);
  return wailDice * 3.5;
}

export function wailsUses(proficiencyBonus) {
  return proficiencyBonus;
}

export function maxSoulTrinkets(proficiencyBonus) {
  return proficiencyBonus;
}
