/**
 * playerDivineSmiteOptGuide.js
 * Player Mode: Divine Smite optimization — when and how to smite
 * Pure JS — no React dependencies.
 */

export const DIVINE_SMITE_RULES = {
  cost: '1 spell slot (any level)',
  timing: 'On hit. Declared AFTER knowing you hit. Can decide after seeing if it\'s a crit.',
  damage: [
    { slot: 1, damage: '2d8 radiant' },
    { slot: 2, damage: '3d8 radiant' },
    { slot: 3, damage: '4d8 radiant' },
    { slot: 4, damage: '5d8 radiant (max)' },
  ],
  undead: '+1d8 extra vs undead and fiends (all slot levels).',
  maxSlot: 'Can use up to a 4th level slot. Higher slots don\'t add more damage.',
  note: 'Not a spell — it\'s a class feature. Can\'t be Counterspelled. Declared after hit roll.',
};

export const SMITE_OPTIMIZATION = [
  { tip: 'Smite on crits', detail: 'Crit doubles all damage dice. 2d8 smite becomes 4d8 on crit. Wait for crits to smite.', rating: 'S' },
  { tip: 'Save slots for crits', detail: 'Don\'t smite every hit. Conserve slots. When you crit: dump your highest slot.', rating: 'S' },
  { tip: 'Smite vs undead/fiends always', detail: '+1d8 bonus vs undead. Even a L1 smite does 3d8 (13.5 avg). Always worth it.', rating: 'S' },
  { tip: 'Don\'t smite round 1', detail: 'Round 1: cast a buff spell (Bless, Shield of Faith). Smite after your concentration spell is up.', rating: 'A' },
  { tip: 'L2 slots are most efficient', detail: '3d8 for L2 vs 2d8 for L1. Extra 1d8 for 1 slot level. L3/L4 have diminishing returns.', rating: 'A' },
  { tip: 'Smite on last hit of the day', detail: 'If you know it\'s the last fight, spend all remaining slots on smites. Don\'t waste them.', rating: 'A' },
];

export const SMITE_CRIT_MATH = [
  { slot: 1, normal: '2d8 (9 avg)', crit: '4d8 (18 avg)', vsUndead: '3d8 (13.5)', critUndead: '6d8 (27)' },
  { slot: 2, normal: '3d8 (13.5)', crit: '6d8 (27)', vsUndead: '4d8 (18)', critUndead: '8d8 (36)' },
  { slot: 3, normal: '4d8 (18)', crit: '8d8 (36)', vsUndead: '5d8 (22.5)', critUndead: '10d8 (45)' },
  { slot: 4, normal: '5d8 (22.5)', crit: '10d8 (45)', vsUndead: '6d8 (27)', critUndead: '12d8 (54)' },
];

export const SMITE_SPELLS_VS_DIVINE = {
  divineSmite: { type: 'Class feature', timing: 'On hit (after roll)', concentration: 'No', note: 'Best for burst. No concentration. Works on crits.' },
  smiteSpells: {
    examples: [
      { spell: 'Wrathful Smite', level: 1, extra: '1d6 psychic + frightened (WIS save)', note: 'Frightened is excellent. Concentration.' },
      { spell: 'Thunderous Smite', level: 1, extra: '2d6 thunder + push 10ft + prone (STR save)', note: 'Prone + push. Loud though.' },
      { spell: 'Branding Smite', level: 2, extra: '2d6 radiant + reveals invisible', note: 'Counters invisibility. Good damage.' },
      { spell: 'Blinding Smite', level: 3, extra: '3d8 radiant + blinded (CON save)', note: 'Blinded is devastating. Best smite spell.' },
      { spell: 'Staggering Smite', level: 4, extra: '4d6 psychic + disadvantage on everything (WIS save)', note: 'Strong debuff if it lands.' },
      { spell: 'Banishing Smite', level: 5, extra: '5d10 force + banish if under 50 HP', note: 'Massive damage + removal. Best high-level smite spell.' },
    ],
    note: 'Smite spells use concentration and must be cast BEFORE attacking (risk of missing). Divine Smite is after the hit.',
  },
  verdict: 'Divine Smite for burst damage (especially crits). Smite spells for conditions (frightened, blinded, banished).',
};

export const SMITE_SLOT_EFFICIENCY = {
  slotsPerDay: [
    { level: 2, slots: '2 L1', totalSmiteDice: '4d8', note: 'Very limited. Be very conservative.' },
    { level: 5, slots: '4 L1, 2 L2', totalSmiteDice: '14d8', note: 'More slots. Can afford 2-3 smites per day.' },
    { level: 9, slots: '4 L1, 3 L2, 2 L3', totalSmiteDice: '24d8', note: 'Good slot budget. Save L3 for crits.' },
    { level: 13, slots: '4 L1, 3 L2, 3 L3, 1 L4', totalSmiteDice: '34d8', note: 'Healthy budget. Smite more freely.' },
  ],
};

export function smiteDamage(slotLevel, isCrit, isUndead) {
  let dice = Math.min(slotLevel + 1, 5);
  if (isUndead) dice += 1;
  if (isCrit) dice *= 2;
  const avg = dice * 4.5;
  return { dice: `${dice}d8`, avg: Math.round(avg), note: `L${slotLevel} smite${isCrit ? ' (CRIT)' : ''}${isUndead ? ' vs undead' : ''}: ${dice}d8 (${Math.round(avg)} avg)` };
}
