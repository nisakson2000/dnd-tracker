/**
 * playerFirbolgRaceGuide.js
 * Player Mode: Firbolg — the gentle giant
 * Pure JS — no React dependencies.
 */

export const FIRBOLG_BASICS = {
  race: 'Firbolg',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 WIS, +1 STR (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  note: 'Hidden Step (free invisibility for a turn). Firbolg Magic (Detect Magic + Disguise Self). Speech of Beast and Leaf. Perfect for Druids, Rangers, and WIS classes.',
};

export const FIRBOLG_TRAITS = [
  { trait: 'Hidden Step', effect: 'BA: turn invisible until start of next turn, or until you attack/force a save. Once per short rest (legacy) or PB uses/LR (MotM).', note: 'Free invisibility as BA. Attack with advantage. Escape danger. No spell slot. Incredible.' },
  { trait: 'Firbolg Magic', effect: 'Cast Detect Magic and Disguise Self once each per short rest (legacy) or PB uses/LR (MotM). Disguise Self can make you appear up to 3ft shorter.', note: 'Free Detect Magic (always useful). Free Disguise Self for a 7ft tall race (appear normal sized).' },
  { trait: 'Powerful Build', effect: 'Count as one size larger for carrying capacity.', note: 'Carry more. Minor but thematic.' },
  { trait: 'Speech of Beast and Leaf', effect: 'Beasts and plants can understand your speech. Advantage on CHA checks to influence them. They can\'t speak back.', note: 'Talk to animals/plants without a spell. One-way communication but still useful for Druids.' },
];

export const FIRBOLG_CLASS_SYNERGY = [
  { class: 'Druid', priority: 'S', reason: 'WIS bonus. Speech of Beast/Leaf. Hidden Step for emergency escape. Detect Magic free. Perfect thematic and mechanical fit.' },
  { class: 'Ranger', priority: 'A', reason: 'WIS bonus. Hidden Step for ambush. Speech of Beast/Leaf for tracking. Nature theme.' },
  { class: 'Cleric', priority: 'A', reason: 'WIS bonus. Hidden Step to escape melee. Free Detect Magic saves preparation. Solid.' },
  { class: 'Rogue', priority: 'B', reason: 'Hidden Step for free advantage/escape. Disguise Self for infiltration. No DEX bonus though.' },
];

export const FIRBOLG_TACTICS = [
  { tactic: 'Hidden Step + attack', detail: 'BA: invisible. Action: attack with advantage (unseen attacker). Free advantage once per SR.', rating: 'S' },
  { tactic: 'Hidden Step escape', detail: 'BA: invisible. Move away from enemies. They can\'t target you with attacks or single-target spells. Free Disengage+.', rating: 'S' },
  { tactic: 'Detect Magic always on', detail: 'Free Detect Magic per SR. Cast it in every new room. Find magical traps, items, auras.', rating: 'A' },
  { tactic: 'Disguise Self blending', detail: 'Firbolgs are 7-8ft tall. Disguise Self makes you appear 3ft shorter = human-sized. Blend in cities.', rating: 'A' },
  { tactic: 'Animal diplomacy', detail: 'Speech of Beast/Leaf: convince guard dogs to let you pass, ask birds what they\'ve seen, calm mounts.', rating: 'B' },
];

export function hiddenStepUses(profBonus, isMotM = true) {
  return isMotM ? profBonus : 1;
}
