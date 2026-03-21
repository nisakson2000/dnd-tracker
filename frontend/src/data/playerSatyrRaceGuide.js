/**
 * playerSatyrRaceGuide.js
 * Player Mode: Satyr — the fey magic-resistant trickster
 * Pure JS — no React dependencies.
 */

export const SATYR_BASICS = {
  race: 'Satyr',
  source: 'Mythic Odysseys of Theros',
  asis: '+2 CHA, +1 DEX',
  speed: '35ft',
  size: 'Medium',
  type: 'Fey (not Humanoid)',
  note: 'Magic Resistance (advantage on magical saves). Fey creature type (immune to Hold Person, Charm Person). 35ft speed. Mirthful Leaps. One of the best races in the game.',
};

export const SATYR_TRAITS = [
  { trait: 'Fey', effect: 'Your creature type is Fey, not Humanoid.', note: 'HUGE. Immune to Hold Person, Charm Person, Dominate Person — all target Humanoids. Immune to common spells.' },
  { trait: 'Magic Resistance', effect: 'Advantage on saving throws against spells and other magical effects.', note: 'Same as Yuan-ti. Advantage on ALL magical saves. Incredible defense.' },
  { trait: 'Ram', effect: '1d4+STR bludgeoning unarmed strike (headbutt).', note: 'Minor. Better than normal unarmed. Flavor.' },
  { trait: 'Mirthful Leaps', effect: 'Add 1d8 to long/high jump distance. No running start needed.', note: 'Extra jump distance. Occasionally useful for terrain.' },
  { trait: 'Reveler', effect: 'Proficiency in Performance and Persuasion. Proficiency with one instrument.', note: 'Two CHA skill proficiencies. Good for Bard or face characters.' },
];

export const SATYR_VS_YUAN_TI = {
  satyr: { advantages: ['Fey type (immune to humanoid-targeting spells)', '35ft speed', 'Two skill proficiencies', 'Not evil-coded'], disadvantages: ['No poison immunity', 'No free Suggestion'] },
  yuanTi: { advantages: ['Poison immunity', 'Free Suggestion spell', 'More intimidating flavor'], disadvantages: ['Humanoid type', '30ft speed', 'Often banned'] },
  verdict: 'Satyr is arguably better. Fey type immunity to Hold/Charm/Dominate Person is worth more than poison immunity. Both have Magic Resistance.',
};

export const SATYR_CLASS_SYNERGY = [
  { class: 'Bard', priority: 'S', reason: 'CHA + DEX. Magic Resistance. Fey type. Performance/Persuasion proficiency. Thematically perfect.' },
  { class: 'Paladin', priority: 'S', reason: 'CHA. Magic Resistance + Aura. Fey type blocks Hold Person (which is Paladin\'s biggest weakness). Incredible.' },
  { class: 'Warlock', priority: 'S', reason: 'CHA caster. Magic Resistance. Fey Warlock is thematic. Immune to humanoid spells.' },
  { class: 'Sorcerer', priority: 'A', reason: 'CHA. Magic Resistance protects concentration. Fey type. 35ft speed for positioning.' },
  { class: 'Rogue', priority: 'A', reason: 'DEX bonus. Magic Resistance. Two free skills. Fey type protection. Fast speed.' },
];

export const SATYR_TACTICS = [
  { tactic: 'Immune to humanoid spells', detail: 'Hold Person? Doesn\'t work on you. Charm Person? Nope. Dominate Person? Not a humanoid. Huge defensive advantage.', rating: 'S' },
  { tactic: 'Anti-caster build', detail: 'Satyr Paladin: Magic Resistance + Aura + Fey type. Near-immune to most save-or-suck spells.', rating: 'S' },
  { tactic: 'Face character', detail: 'Free Performance + Persuasion + CHA bonus. Natural party face with two free social skills.', rating: 'A' },
  { tactic: 'Speed advantage', detail: '35ft base. Faster than most races. Better positioning, chasing, retreating.', rating: 'B' },
];

export function feyTypeImmunities() {
  return ['Hold Person', 'Charm Person', 'Dominate Person', 'Crown of Madness', 'Calm Emotions (targeting humanoids)'];
}
