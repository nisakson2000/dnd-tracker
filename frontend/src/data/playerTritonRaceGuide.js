/**
 * playerTritonRaceGuide.js
 * Player Mode: Triton — the aquatic guardian
 * Pure JS — no React dependencies.
 */

export const TRITON_BASICS = {
  race: 'Triton',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+1 STR, +1 CON, +1 CHA (legacy) or +2/+1 any (MotM)',
  speed: '30ft, 30ft swim',
  size: 'Medium',
  darkvision: '60ft (MotM)',
  note: 'Amphibious (breathe water and air). Control of the Depths spellcasting. Cold resistance. Three +1s is unique. Best for aquatic campaigns but functional everywhere.',
};

export const TRITON_TRAITS = [
  { trait: 'Amphibious', effect: 'Breathe air and water.', note: 'Never worry about drowning. Permanent water breathing.' },
  { trait: 'Control of the Depths', effect: 'Fog Cloud (L1), Gust of Wind (L3), Wall of Water (L5). Once each per LR. CHA casting (MotM: any stat).', note: 'Free control spells. Fog Cloud for obscurement. Gust of Wind for repositioning. Wall of Water for defense.' },
  { trait: 'Emissary of the Sea', effect: 'Communicate simple ideas with water-breathing beasts. They understand you, you understand them.', note: 'Talk to fish, sharks, octopi. Niche but fun. Information gathering underwater.' },
  { trait: 'Guardian of the Depths', effect: 'Resistance to cold damage. Ignore deep ocean pressure.', note: 'Cold resistance is decent. Deep sea pressure immunity for underwater campaigns.' },
  { trait: 'Swim Speed', effect: '30ft swim speed.', note: 'Full swim speed. No Athletics checks for swimming.' },
];

export const TRITON_CLASS_SYNERGY = [
  { class: 'Paladin', priority: 'A', reason: 'STR+CON+CHA (legacy). All three Paladin stats. Free spells supplement limited spell list. Cold resistance.' },
  { class: 'Fighter', priority: 'A', reason: 'STR+CON. Swim speed for aquatic encounters. Free spells for a non-caster.' },
  { class: 'Warlock', priority: 'A', reason: 'CHA. Fog Cloud + Warlock spell list. Swim speed. Fathomless patron thematic match.' },
  { class: 'Cleric', priority: 'B', reason: 'CON. No WIS bonus. Free spells are nice utility. Cold resistance for frontline.' },
];

export const TRITON_TACTICS = [
  { tactic: 'Fog Cloud + blind fighting', detail: 'Free Fog Cloud. If you have Blind Fighting style: see in fog, enemies can\'t see you. Advantage on attacks.', rating: 'A' },
  { tactic: 'Aquatic superiority', detail: 'Swim speed + amphibious + communicate with sea creatures. Dominate underwater encounters.', rating: 'S (aquatic)' },
  { tactic: 'Wall of Water defense', detail: 'L5: free Wall of Water. Ranged attacks through it have disadvantage. Fire damage halved through it. Good positioning tool.', rating: 'B' },
  { tactic: 'Three-stat Paladin', detail: 'Legacy Triton: +1 STR/CON/CHA. Perfect for the MAD Paladin. All three key stats boosted.', rating: 'A' },
];

export function controlOfTheDepthsSpells(characterLevel) {
  const spells = ['Fog Cloud'];
  if (characterLevel >= 3) spells.push('Gust of Wind');
  if (characterLevel >= 5) spells.push('Wall of Water');
  return spells;
}
