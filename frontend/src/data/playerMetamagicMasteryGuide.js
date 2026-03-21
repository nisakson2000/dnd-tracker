/**
 * playerMetamagicMasteryGuide.js
 * Player Mode: Sorcerer Metamagic — rankings, combos, and sorcery point economy
 * Pure JS — no React dependencies.
 */

export const METAMAGIC_RANKINGS = [
  { name: 'Quickened Spell', cost: '2 SP', rating: 'S+', effect: 'Bonus action cast instead of action.' },
  { name: 'Twinned Spell', cost: 'Level in SP', rating: 'S+', effect: 'Second target for single-target spell.' },
  { name: 'Subtle Spell', cost: '1 SP', rating: 'S', effect: 'No V/S components. Can\'t be Counterspelled.' },
  { name: 'Heightened Spell', cost: '3 SP', rating: 'A+', effect: 'Disadvantage on first save.' },
  { name: 'Careful Spell', cost: '1 SP', rating: 'A', effect: 'CHA mod creatures auto-save.' },
  { name: 'Empowered Spell', cost: '1 SP', rating: 'A', effect: 'Reroll CHA mod damage dice. Combines with others.' },
  { name: 'Seeking Spell', cost: '2 SP', rating: 'A', effect: 'Reroll missed spell attack.' },
  { name: 'Extended Spell', cost: '1 SP', rating: 'B+', effect: 'Double duration (max 24h).' },
  { name: 'Transmuted Spell', cost: '1 SP', rating: 'B+', effect: 'Change damage type.' },
  { name: 'Distant Spell', cost: '1 SP', rating: 'B', effect: 'Double range. Touch → 30ft.' },
];

export const SP_ECONOMY = {
  points: 'Sorcerer level = max SP.',
  slotToSP: 'Convert slot → SP: slot level = SP gained.',
  spToSlot: [
    { slot: 'L1', cost: '2 SP' },
    { slot: 'L2', cost: '3 SP' },
    { slot: 'L3', cost: '5 SP' },
    { slot: 'L4', cost: '6 SP' },
    { slot: 'L5', cost: '7 SP' },
  ],
  tip: 'Convert unused low slots to SP. Don\'t waste them.',
};

export const METAMAGIC_COMBOS = [
  { combo: 'Quickened EB + EB', cost: '2 SP', note: '8 beams at L17. Massive burst.' },
  { combo: 'Twinned Haste', cost: '3 SP', note: 'Two allies hasted. Action economy boost.' },
  { combo: 'Twinned Polymorph', cost: '4 SP', note: 'Two Giant Apes. 314 HP total.' },
  { combo: 'Subtle Counterspell', cost: '1 SP', note: 'Can\'t be countered back.' },
  { combo: 'Heightened Hold Monster', cost: '3 SP', note: 'Disadvantage → likely paralysis.' },
  { combo: 'Careful Hypnotic Pattern', cost: '1 SP', note: 'Allies auto-save. Enemies roll.' },
];

export const METAMAGIC_TIPS = [
  'Quickened + Twinned: must-have picks at L3.',
  'Subtle: can\'t be Counterspelled. Essential in caster duels.',
  'Twinned Haste: best buff Metamagic.',
  'Quickened EB: 8 beams per turn at L17.',
  'Convert unused low slots to SP before resting.',
  'Empowered combines with another Metamagic. Only one that can.',
  'Careful + Hypnotic Pattern: no friendly fire on AoE.',
  'Heightened: 3 SP for disadvantage. Use on big save-or-suck.',
  'Twinned Polymorph: two Giant Apes from one spell.',
  'Budget SP across the adventuring day. Don\'t burn all early.',
];
