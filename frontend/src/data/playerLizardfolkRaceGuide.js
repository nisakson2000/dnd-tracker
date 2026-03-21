/**
 * playerLizardfolkRaceGuide.js
 * Player Mode: Lizardfolk — the primal survivor
 * Pure JS — no React dependencies.
 */

export const LIZARDFOLK_BASICS = {
  race: 'Lizardfolk',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 CON, +1 WIS (legacy) or +2/+1 any (MotM)',
  speed: '30ft, 30ft swim',
  size: 'Medium',
  note: 'Natural Armor (AC 13 + DEX). Bite attack (1d6). Hold Breath 15 min. Hungry Jaws for temp HP. Craftsman: make weapons from corpses. Unique and versatile.',
};

export const LIZARDFOLK_TRAITS = [
  { trait: 'Natural Armor', effect: 'AC = 13 + DEX mod. Can\'t wear armor (shields work).', note: 'AC 13+DEX. With DEX 16: AC 16. With shield: 18. Competes with medium armor at low levels.' },
  { trait: 'Bite', effect: '1d6+STR unarmed strike (piercing).', note: 'Better unarmed. Works with Monk. Natural weapon for grapple-bite builds.' },
  { trait: 'Hold Breath', effect: '15 minutes.', note: 'Very long breath holding. Combined with swim speed = excellent aquatic explorer.' },
  { trait: 'Hungry Jaws', effect: 'BA: bite attack. On hit: gain temp HP = CON mod (min 1). PB uses/LR (MotM) or 1/SR (legacy).', note: 'Free BA attack + temp HP. At CON +3: free 3 temp HP per use. Excellent action economy.' },
  { trait: 'Natural Armor', effect: 'Alternative: AC 13 + DEX (choose this or worn armor, not both).', note: 'Better than leather (AC 11+DEX). Matches studded leather (12+DEX) at baseline.' },
  { trait: 'Hunter\'s Lore (legacy)', effect: 'Two of: Animal Handling, Nature, Perception, Stealth, Survival.', note: 'Two free skills. Changed in MotM to one skill.' },
  { trait: 'Cunning Artisan', effect: 'During short rest: create shield, club, javelin, or 1d4 darts from corpse.', note: 'Free equipment from dead enemies. Thematic and useful when equipment is scarce.' },
];

export const LIZARDFOLK_CLASS_SYNERGY = [
  { class: 'Druid', priority: 'S', reason: 'CON+WIS. Natural Armor = no metal armor needed (Druid restriction). Swim speed for Wild Shape setup. Perfect.' },
  { class: 'Barbarian', priority: 'A', reason: 'CON. Natural Armor competes with Unarmored Defense. Hungry Jaws BA attack. Bite while grappling.' },
  { class: 'Ranger', priority: 'A', reason: 'CON+WIS. Swim speed. Natural Armor + DEX. Hunter\'s Lore skills. Excellent wilderness ranger.' },
  { class: 'Monk', priority: 'A', reason: 'Natural Armor or Unarmored Defense (choose higher). Bite = monk weapon. Hungry Jaws BA at low levels before Flurry.' },
  { class: 'Fighter', priority: 'B', reason: 'Natural Armor outpaced by heavy armor. CON is nice. Hungry Jaws for BA damage.' },
];

export const LIZARDFOLK_TACTICS = [
  { tactic: 'Hungry Jaws temp HP', detail: 'BA: bite attack + CON mod temp HP. Free temp HP every short rest (legacy) or PB/LR (MotM). Sustain.', rating: 'A' },
  { tactic: 'Natural Armor + Shield', detail: 'AC 13+DEX+2 (shield). DEX 16 = AC 18. No armor cost, no weight. Perfect for Druids.', rating: 'A' },
  { tactic: 'Grapple + bite', detail: 'Grapple enemy → bite with advantage (if prone). Natural weapon so you don\'t need a free hand for a weapon.', rating: 'A' },
  { tactic: 'Corpse crafting', detail: 'Short rest: make weapons from dead enemies. Lost your equipment? Make new stuff from the dragon you killed.', rating: 'B' },
  { tactic: 'Aquatic combat', detail: '30ft swim speed + 15 min breath holding. Underwater combat without disadvantage. Aquatic campaigns.', rating: 'A' },
];

export function lizardfolkAC(dexMod, hasShield = false) {
  return 13 + dexMod + (hasShield ? 2 : 0);
}

export function hungryJawsTempHP(conMod) {
  return Math.max(1, conMod);
}
