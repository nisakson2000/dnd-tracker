/**
 * playerTempHPGuide.js
 * Player Mode: Temporary HP rules, sources, and optimization
 * Pure JS — no React dependencies.
 */

export const TEMP_HP_RULES = {
  stacking: 'Temp HP does NOT stack. If you get new temp HP while you have some, you choose which to keep.',
  healing: 'Temp HP is NOT healing. It\'s a buffer. It doesn\'t restore HP — it absorbs damage first.',
  duration: 'Temp HP lasts until depleted or until you finish a long rest (unless a shorter duration is specified).',
  damage: 'When you take damage, temp HP is lost FIRST, then remaining damage reduces actual HP.',
  deathSaves: 'Temp HP at 0 HP: temp HP absorbs damage but you\'re still at 0. You don\'t go to 1 HP.',
  note: 'Temp HP is like a shield — it takes hits so your real HP doesn\'t have to.',
};

export const TEMP_HP_SOURCES = [
  { source: 'Armor of Agathys', amount: '5/level', class: 'Warlock', duration: '1 hour', note: '5 temp HP at 1st, 25 at 5th. Also deals cold damage to melee attackers. Best temp HP spell.', rating: 'S' },
  { source: 'Heroism', amount: 'CHA mod per turn', class: 'Paladin/Bard', duration: 'Concentration, 1 min', note: 'Temp HP refreshes each turn. Also immune to frightened. Excellent sustained.', rating: 'A' },
  { source: 'False Life', amount: '1d4+4 (+ upcast)', class: 'Wizard/Sorcerer/Warlock', duration: '1 hour', note: 'No concentration. Cast before combat. 5-8 temp HP buffer.', rating: 'B' },
  { source: 'Inspiring Leader feat', amount: 'Level + CHA mod', class: 'Any (feat)', duration: 'Until depleted', note: 'Level 10, CHA 20: 15 temp HP to 6 creatures after every short/long rest. Party-wide.', rating: 'S' },
  { source: 'Twilight Sanctuary (Cleric)', amount: '1d6 + Cleric level', class: 'Twilight Cleric', duration: 'Each round for 1 min', note: 'Refreshes EVERY round for all allies in 30ft sphere. Broken good.', rating: 'S' },
  { source: 'Dark One\'s Blessing (Fiend Warlock)', amount: 'CHA mod + Warlock level', class: 'Fiend Warlock', duration: 'Until depleted', note: 'Every time you kill a creature. CHA 20, level 10 = 15 temp HP per kill.', rating: 'A' },
  { source: 'Aid spell', amount: '+5/+10/+15 max HP', class: 'Cleric/Paladin/Bard', duration: '8 hours', note: 'Not temp HP — increases MAX HP. Better than temp HP because it stacks. Cast at dawn.', rating: 'S' },
  { source: 'Chef feat', amount: '1d8 temp HP', class: 'Any (feat)', duration: 'After short rest', note: 'Cook treats during short rest. 4+proficiency creatures get 1d8 temp HP.', rating: 'B' },
  { source: 'Wildfire Spirit (Wildfire Druid)', amount: '1d8', class: 'Wildfire Druid', duration: 'Until depleted', note: 'When spirit teleports, adjacent allies get temp HP. Repositioning + defense.', rating: 'A' },
];

export const TEMP_HP_OPTIMIZATION = [
  { tip: 'Apply temp HP BEFORE combat starts', detail: 'Inspiring Leader, False Life, Armor of Agathys — cast during prep. Free buffer at fight start.', priority: 'S' },
  { tip: 'Temp HP doesn\'t stack — time it right', detail: 'Don\'t cast Heroism if someone has 15 temp HP from Inspiring Leader. Wait until the buffer is depleted.', priority: 'A' },
  { tip: 'Armor of Agathys + Abjuration Wizard', detail: 'Arcane Ward absorbs damage BEFORE Agathys temp HP. The cold retaliation damage stays active longer.', priority: 'S' },
  { tip: 'Armor of Agathys + Heavy Armor', detail: 'High AC means temp HP lasts longer because fewer hits land. Warlock/Paladin multiclass is great for this.', priority: 'A' },
  { tip: 'Refreshing temp HP (Heroism/Twilight)', detail: 'Temp HP that refreshes each turn is effectively healing. Heroism gives CHA mod HP per round.', priority: 'A' },
  { tip: 'Inspiring Leader on short rests', detail: 'The feat specifies a 10-minute speech. Use it during every short rest for party-wide temp HP.', priority: 'S' },
];

export const TEMP_HP_VS_HEALING = {
  differences: [
    { aspect: 'Timing', tempHP: 'Apply before damage', healing: 'Apply after damage' },
    { aspect: 'Stacking', tempHP: 'Doesn\'t stack (choose higher)', healing: 'Stacks (adds to current HP)' },
    { aspect: 'Efficiency', tempHP: 'Prevents need for healing', healing: 'Reactive — damage already taken' },
    { aspect: 'Action economy', tempHP: 'Often pre-combat (free)', healing: 'Usually costs an action in combat' },
    { aspect: 'Max HP', tempHP: 'Effectively increases survivability', healing: 'Capped at max HP' },
  ],
  verdict: 'Temp HP is proactive defense. Healing is reactive. Use both for maximum survivability.',
};

export function chooseTempHP(current, newAmount) {
  return Math.max(current, newAmount);
}

export function inspiringLeaderHP(level, chaMod) {
  return level + chaMod;
}

export function armorOfAgathysValue(spellLevel) {
  const tempHP = spellLevel * 5;
  const coldDamage = spellLevel * 5;
  return { tempHP, coldDamagePerHit: coldDamage, totalValueIfAllAbsorbed: tempHP + coldDamage };
}
