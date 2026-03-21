/**
 * playerFirebolgGuide.js
 * Player Mode: Firbolg race guide — gentle giant of the forest
 * Pure JS — no React dependencies.
 */

export const FIRBOLG_BASICS = {
  race: 'Firbolg',
  source: 'Volo\'s Guide to Monsters / MotM',
  size: 'Medium',
  speed: '30ft',
  asi: '+2 WIS, +1 STR (Volo\'s) or flexible (MotM)',
  theme: 'Gentle forest giant. Natural magic, invisibility, and disguise.',
  note: 'Excellent Druid/Cleric/Ranger race. Free invisibility + disguise + Speech of Beast and Leaf.',
};

export const FIRBOLG_TRAITS = [
  { trait: 'Firbolg Magic', effect: 'Cast Detect Magic and Disguise Self (appear up to 3ft shorter) once each per short rest. WIS is spellcasting ability.', note: 'Free Detect Magic per short rest. Disguise Self to look human-sized. Great utility.' },
  { trait: 'Hidden Step', effect: 'Bonus action: turn invisible until start of next turn, or until you attack/force a save. Once per short rest.', note: 'Free invisibility every short rest. Use for: advantage on attacks, escape, repositioning.' },
  { trait: 'Powerful Build', effect: 'Count as one size larger for carry/push/lift capacity.', note: 'Carry more. Grapple interactions. Flavor: you\'re big.' },
  { trait: 'Speech of Beast and Leaf', effect: 'Communicate simple ideas to beasts and plants. Advantage on CHA checks to influence them.', note: 'Talk to animals and plants without spells. Great RP flavor.' },
];

export const FIRBOLG_BUILDS = [
  { build: 'Firbolg Druid', detail: '+2 WIS is perfect. Hidden Step for escape. Disguise Self for social. Speech of Beast and Leaf fits perfectly.', rating: 'S', note: 'The quintessential Firbolg class. Everything synergizes.' },
  { build: 'Firbolg Cleric', detail: '+2 WIS. Hidden Step for positioning. Detect Magic for free. Nature or Life domain thematically.', rating: 'S' },
  { build: 'Firbolg Ranger', detail: '+1 STR +2 WIS. Natural fit. Speech of Beast and Leaf enhances Ranger RP. Hidden Step for ambushes.', rating: 'A' },
  { build: 'Firbolg Monk', detail: '+2 WIS for AC/saves. Hidden Step for advantage on first attack. Not optimal but functional.', rating: 'B' },
  { build: 'Firbolg Rogue', detail: 'Hidden Step = free advantage on attack = Sneak Attack trigger. Once per short rest invisibility is great for Rogues.', rating: 'A', note: 'Surprising synergy. Big sneaky Firbolg.' },
];

export const FIRBOLG_TACTICS = [
  { tactic: 'Hidden Step → attack', detail: 'Bonus action invisible → attack with advantage → Sneak Attack/first strike. Every short rest.', rating: 'A' },
  { tactic: 'Disguise Self infiltration', detail: 'Appear 3ft shorter (normal human height). Infiltrate settlements. Free per short rest.', rating: 'A' },
  { tactic: 'Detect Magic scouting', detail: 'Free Detect Magic per short rest. Find magic items, traps, enchantments without spending slots.', rating: 'A' },
  { tactic: 'Beast negotiation', detail: 'Talk to guard dogs, horses, birds. Get info, avoid combat, gain allies. No spell required.', rating: 'B' },
];

export function hiddenStepAdvantageHitChance(attackBonus, targetAC) {
  const baseChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  return 1 - Math.pow(1 - baseChance, 2); // Advantage
}
