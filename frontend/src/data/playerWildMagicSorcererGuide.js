/**
 * playerWildMagicSorcererGuide.js
 * Player Mode: Wild Magic Sorcerer — the chaotic caster
 * Pure JS — no React dependencies.
 */

export const WILD_MAGIC_BASICS = {
  class: 'Sorcerer (Wild Magic)',
  source: 'Player\'s Handbook',
  theme: 'Chaotic magic surges. Unpredictable effects. Tides of Chaos advantage. Bend Luck.',
  note: 'Fun and flavorful but unreliable. Wild Magic Surge can help or hinder. DM-dependent (they choose when to trigger surges).',
};

export const WILD_MAGIC_FEATURES = [
  { feature: 'Wild Magic Surge', level: 1, effect: 'After casting L1+ sorcerer spell, DM can have you roll d20. On 1: roll on Wild Magic Surge table.', note: '5% chance per spell (if DM triggers it). 50 possible effects ranging from amazing to disastrous.' },
  { feature: 'Tides of Chaos', level: 1, effect: 'Gain advantage on one attack, check, or save. Once per long rest. DM can restore it by triggering a Wild Magic Surge.', note: 'Free advantage 1/LR. If DM restores it via surges, you get unlimited advantage but more surges.' },
  { feature: 'Bend Luck', level: 6, effect: '2 SP: reaction to add or subtract 1d4 from another creature\'s attack, check, or save.', note: 'Excellent. +1d4 to ally save vs Hold Person. -1d4 from enemy attack. Very versatile.' },
  { feature: 'Controlled Chaos', level: 14, effect: 'When rolling on Wild Magic Surge table, roll twice and choose which effect to apply.', note: 'Reduces bad outcomes significantly. Choose the beneficial surge.' },
  { feature: 'Spell Bombardment', level: 18, effect: 'When you roll damage, if any die shows max: reroll that die and add to total. Once per turn.', note: 'Extra damage on max rolls. On Fireball (8d6): ~24% chance of at least one 6. Modest boost.' },
];

export const NOTABLE_WILD_SURGES = [
  { roll: '07-08', effect: 'You cast Fireball centered on yourself (L3).', type: 'Dangerous', note: '8d6 fire to you and everyone within 20ft. Can TPK at low levels.' },
  { roll: '09-10', effect: 'You cast Magic Missile (5 darts, L5).', type: 'Beneficial', note: 'Free 5-dart Magic Missile. 5d4+5 = solid damage.' },
  { roll: '21-22', effect: 'You grow a long beard of feathers that lasts until you sneeze.', type: 'Harmless', note: 'Flavor only. Many surge results are cosmetic.' },
  { roll: '33-34', effect: 'You are immune to all damage for next round (incapacitated).', type: 'Mixed', note: 'Immune to damage but can\'t act. Good if you\'re about to take massive damage.' },
  { roll: '41-42', effect: 'You turn into a potted plant until start of next turn.', type: 'Dangerous', note: 'Incapacitated, can\'t move. Vulnerable for a round.' },
  { roll: '79-80', effect: 'You can\'t speak for next minute. Pink bubbles float from mouth.', type: 'Harmful', note: 'Can\'t cast spells with verbal components for 10 rounds. Very bad.' },
  { roll: '99-00', effect: 'You regain all expended sorcery points.', type: 'Amazing', note: 'Full SP recovery. At L20: 20 SP back. Best possible surge.' },
];

export const WILD_MAGIC_TACTICS = [
  { tactic: 'Tides of Chaos fishing', detail: 'Use Tides of Chaos constantly. DM restores it via surge → you get advantage again. Infinite advantage cycle.', rating: 'S (DM dependent)' },
  { tactic: 'Bend Luck clutch saves', detail: '2 SP: ±1d4 to any roll you see. Save it for critical moments. Ally failing a death save? +1d4.', rating: 'S' },
  { tactic: 'Stay away from allies', detail: 'Some surges are AoE centered on you. Keep distance from allies to minimize friendly fire.', rating: 'A' },
  { tactic: 'Controlled Chaos at L14', detail: 'Roll twice on surge table, choose. Odds of getting a good result jump significantly.', rating: 'A' },
];

export function bendLuckCost() {
  return 2; // 2 SP
}

export function surgeChance(d20Roll) {
  return d20Roll === 1; // 5% chance
}

export function spellBombardmentChance(numDice, dieSize) {
  // Chance of at least one max roll
  return 1 - Math.pow((dieSize - 1) / dieSize, numDice);
}
