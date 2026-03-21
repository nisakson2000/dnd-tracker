/**
 * playerKiPointGuide.js
 * Player Mode: Monk Ki point management, optimization, and feature guide
 * Pure JS — no React dependencies.
 */

export const KI_RULES = {
  pool: 'Ki points = Monk level',
  refresh: 'All ki points restore on SHORT or long rest',
  saveDC: '8 + proficiency + WIS modifier',
  note: 'Ki is a short rest resource. Push for short rests between combats.',
};

export const KI_ABILITIES = [
  { ability: 'Flurry of Blows', cost: 1, action: 'After Attack action', effect: '2 unarmed strikes as bonus action (instead of 1)', level: 2, rating: 'S', note: 'Your bread and butter. Extra attack = more damage + Stunning Strike chances.' },
  { ability: 'Patient Defense', cost: 1, action: 'Bonus action', effect: 'Dodge as bonus action', level: 2, rating: 'B', note: 'Defensive option. Use when you\'re being focused or need to survive a round.' },
  { ability: 'Step of the Wind', cost: 1, action: 'Bonus action', effect: 'Disengage or Dash as bonus action. Jump distance doubled.', level: 2, rating: 'B', note: 'Mobility. Good for repositioning or escaping. Less useful than Flurry of Blows usually.' },
  { ability: 'Stunning Strike', cost: 1, action: 'On hit with melee weapon attack', effect: 'Target must CON save or be Stunned until end of your next turn', level: 5, rating: 'S', note: 'THE Monk ability. Stunned = can\'t act, auto-fail STR/DEX saves, attacks have advantage. Game-changing.' },
  { ability: 'Deflect Missiles', cost: '1 (to throw)', action: 'Reaction', effect: 'Reduce ranged attack damage by 1d10+DEX+level. If reduced to 0, spend 1 ki to throw it back.', level: 3, rating: 'A', note: 'Free damage reduction. Throwing costs ki but is amazing when it works.' },
  { ability: 'Slow Fall', cost: 0, action: 'Reaction', effect: 'Reduce fall damage by 5× Monk level', level: 4, rating: 'B', note: 'Free! No ki cost. Level 10 Monk ignores 50ft of falling.' },
  { ability: 'Stillness of Mind', cost: 0, action: 'Action', effect: 'End one charmed or frightened effect on yourself', level: 7, rating: 'A', note: 'Free condition removal. Costs your action though.' },
  { ability: 'Empty Body', cost: 4, action: 'Action', effect: 'Invisible + resistance to all damage (except force) for 1 minute', level: 18, rating: 'S', note: 'Greater Invisibility + resistance to everything. Costs 4 ki but incredibly powerful.' },
];

export const STUNNING_STRIKE_STRATEGY = {
  description: 'Stunning Strike is your most impactful ability. Use it wisely.',
  tips: [
    'Target creatures with LOW CON saves. Casters, most humanoids, many fey/fiends.',
    'Don\'t Stunning Strike dragons, giants, or undead — they have high CON.',
    'Use it on your first Flurry of Blows hit. If it lands, your remaining attacks have advantage.',
    'Multiple Stunning Strikes per turn: each hit can attempt it. Overwhelm the target.',
    'Stunning Strike on OAs is legal. Stun them before they can act on their turn.',
    'Don\'t waste all ki on Stunning Strike. Save at least 1 for Flurry of Blows.',
    'At level 5 with Flurry: 4 attacks × 1 ki each = 4 Stunning Strike attempts. Very ki-hungry.',
  ],
  badTargets: ['High CON creatures', 'Undead (many immune to stun)', 'Constructs', 'Legendary Resistance creatures'],
  goodTargets: ['Spellcasters', 'Rogues/Dex-based enemies', 'Humanoids', 'Most medium-sized creatures'],
};

export const KI_ECONOMY = [
  { level: 5, kiPool: 5, perCombat: '2-3 ki', note: 'Very tight. 1 Flurry + 1-2 Stunning Strikes per combat. Need short rests.' },
  { level: 8, kiPool: 8, perCombat: '3-4 ki', note: 'Getting better. 1 Flurry + 2 Stunning Strikes + 1 utility. Comfortable with rests.' },
  { level: 11, kiPool: 11, perCombat: '4-5 ki', note: 'Decent pool. Can Flurry most turns and Stun key targets.' },
  { level: 15, kiPool: 15, perCombat: '5-7 ki', note: 'Generous. Can use ki freely without worry. 2-3 combats per short rest.' },
  { level: 20, kiPool: 20, perCombat: '7-10 ki', note: 'Flush with ki. Use Empty Body, Flurry every turn, Stun often.' },
];

export const SUBCLASS_KI_FEATURES = [
  { subclass: 'Open Hand', feature: 'Open Hand Technique: free effects on Flurry hits (push, prone, no reactions)', kiCost: 0, rating: 'S', note: 'Free effects! No ki cost. The best ki-efficient subclass.' },
  { subclass: 'Shadow', feature: 'Shadow Arts: Darkness, Darkvision, Pass Without Trace, Silence for 2 ki each', kiCost: 2, rating: 'A', note: 'Pass Without Trace for 2 ki is amazing. Shadow Step at 6 is free.' },
  { subclass: 'Four Elements', feature: 'Elemental Disciplines: spells for ki points', kiCost: '2-6', rating: 'C', note: 'Extremely ki-hungry. Casting spells depletes your main resource. Weakest subclass.' },
  { subclass: 'Kensei', feature: 'Deft Strike: +martial arts die damage for 1 ki on weapon hit', kiCost: 1, rating: 'B', note: 'Modest damage boost. Kensei is more about weapon options than ki features.' },
  { subclass: 'Mercy', feature: 'Hands of Harm: extra necrotic damage for 1 ki. Hands of Healing: heal for 1 ki.', kiCost: 1, rating: 'A', note: 'Versatile. Damage OR healing. Harm doesn\'t require a separate action.' },
  { subclass: 'Astral Self', feature: 'Arms of the Astral Self: WIS for attacks, extra reach, extra unarmed', kiCost: 1, rating: 'A', note: 'WIS-based attacks solve Monk MADness. 10ft reach is great.' },
];

export function getKiPoints(monkLevel) {
  return monkLevel;
}

export function stunDC(wisdomMod, proficiencyBonus) {
  return 8 + wisdomMod + proficiencyBonus;
}

export function stunSuccessChance(targetConSave, dc) {
  const needed = dc - targetConSave;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function kiPerCombatBudget(monkLevel, combatsPerShortRest) {
  return Math.floor(monkLevel / combatsPerShortRest);
}
