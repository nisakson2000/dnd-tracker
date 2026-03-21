/**
 * playerBerserkerBarbarianGuide.js
 * Player Mode: Path of the Berserker Barbarian — the frenzied warrior
 * Pure JS — no React dependencies.
 */

export const BERSERKER_BASICS = {
  class: 'Barbarian (Path of the Berserker)',
  source: 'Player\'s Handbook',
  theme: 'Pure rage. Extra attack during frenzy. Intimidation. Unstoppable fury.',
  note: 'Iconic but flawed. Frenzy causes exhaustion. Retaliation at L14 is good. Overall weaker than Totem/Zealot due to exhaustion tax.',
};

export const BERSERKER_FEATURES = [
  { feature: 'Frenzy', level: 3, effect: 'While raging, you can enter a Frenzy. Bonus action melee attack each turn. When Frenzy ends: gain 1 level of exhaustion.', note: 'Extra attack every turn is powerful. But exhaustion after EVERY Frenzy is crippling. Disadvantage on checks at L1 exhaust.' },
  { feature: 'Mindless Rage', level: 6, effect: 'While raging, can\'t be charmed or frightened. Existing charm/fear suspended during rage.', note: 'Immunity to two common conditions while raging. Solid defensive feature.' },
  { feature: 'Intimidating Presence', level: 10, effect: 'Action: one creature within 30ft must WIS save (8+prof+CHA) or be frightened. Can sustain as action each turn.', note: 'CHA-based fear. But Barbarians rarely have high CHA. And uses your action. Weak feature.' },
  { feature: 'Retaliation', level: 14, effect: 'When you take damage from a creature within 5ft, use reaction to make a melee attack against it.', note: 'Free reaction attack whenever hit by adjacent enemy. This is the best Berserker feature. Passive extra damage.' },
];

export const FRENZY_EXHAUSTION_ANALYSIS = {
  exhaustionLevels: [
    { level: 1, effect: 'Disadvantage on ability checks', note: 'Affects skills but NOT attacks or saves. Manageable.' },
    { level: 2, effect: 'Speed halved', note: 'Now it hurts. Can\'t close distance as easily.' },
    { level: 3, effect: 'Disadvantage on attacks and saves', note: 'DEVASTATING. Your core combat is now weakened.' },
    { level: 4, effect: 'HP max halved', note: 'You\'re dying.' },
    { level: 5, effect: 'Speed = 0', note: 'Can\'t move. Can\'t fight.' },
    { level: 6, effect: 'Death', note: 'You die.' },
  ],
  recovery: 'One level removed per long rest with food/water. Greater Restoration removes one level.',
  problem: 'Using Frenzy 2-3 times before resting means L2-3 exhaustion. L3 is disadvantage on attacks. You NEED to rest.',
  solution: 'Only Frenzy in important fights. Have access to Greater Restoration. Or just play Zealot/Totem.',
};

export const BERSERKER_TACTICS = [
  { tactic: 'Selective Frenzy', detail: 'Only Frenzy in boss fights or deadly encounters. Regular rage is fine for easy/medium fights.', rating: 'A', note: 'One Frenzy per long rest is manageable. Two is risky. Three is crippling.' },
  { tactic: 'Retaliation counter-attacks', detail: 'L14: take damage → free attack. Combined with Reckless Attack: enemies hit more but you hit back more.', rating: 'S', note: 'Reckless Attack invites hits. Each hit = reaction attack. More damage per round.' },
  { tactic: 'Mindless Rage anti-control', detail: 'L6: immune to charm/fear while raging. Dragon Frightful Presence? Doesn\'t work.', rating: 'A' },
  { tactic: 'Greater Restoration teamwork', detail: 'Have a Cleric/Druid cast Greater Restoration to remove exhaustion. Costs a 5th-level slot + 100gp.', rating: 'A' },
];

export const BERSERKER_VS_TOTEM = {
  berserker: { pros: ['Extra bonus action attack (Frenzy)', 'Charm/fear immunity', 'Retaliation (free reaction attacks)', 'Intimidation'], cons: ['EXHAUSTION from Frenzy', 'CHA-dependent Intimidation', 'Worst PHB Barbarian due to exhaustion'] },
  totem: { pros: ['Bear: resistance to all damage', 'Wolf: party advantage', 'No exhaustion', 'Mix and match'], cons: ['No bonus action attack', 'No charm/fear immunity', 'Less individual damage'] },
  verdict: 'Totem Bear is better for tanking. Berserker has higher DPR ceiling but exhaustion ruins it. Zealot is better DPR without exhaustion.',
};

export function frenzyDPR(barbarianLevel, strMod, targetAC, raging = true) {
  const profBonus = Math.min(6, 2 + Math.floor((barbarianLevel + 3) / 4));
  const attackBonus = strMod + profBonus;
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const rageDmg = raging ? (barbarianLevel >= 16 ? 4 : barbarianLevel >= 9 ? 3 : 2) : 0;
  const attacks = barbarianLevel >= 5 ? 3 : 2; // 2 attacks + 1 Frenzy bonus action
  const damage = 6.5 + strMod + rageDmg; // greatsword + STR + rage
  return attacks * hitChance * damage;
}

export function exhaustionPenalty(exhaustionLevel) {
  const penalties = {
    0: 'None',
    1: 'Disadvantage on ability checks',
    2: 'Speed halved',
    3: 'Disadvantage on attacks and saves',
    4: 'HP max halved',
    5: 'Speed reduced to 0',
    6: 'Death',
  };
  return penalties[exhaustionLevel] || 'Death';
}
