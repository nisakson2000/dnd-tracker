/**
 * playerDivineSmiteGuide.js
 * Player Mode: Divine Smite rules, damage, and optimization
 * Pure JS — no React dependencies.
 */

export const DIVINE_SMITE_RULES = {
  trigger: 'When you hit with a melee weapon attack.',
  cost: 'Expend a spell slot.',
  damage: '2d8 radiant + 1d8 per slot level above 1st (max 5d8).',
  bonusVsUndead: '+1d8 against undead or fiends (max becomes 6d8).',
  noAction: 'No action required — it\'s a decision made after you hit.',
  note: 'Can be combined with smite spells (Thunderous Smite, etc.) but uses separate slots.',
  critInteraction: 'Doubles all smite damage dice on a critical hit!',
};

export const SMITE_DAMAGE = [
  { slot: 1, dice: '2d8', avg: 9, critDice: '4d8', critAvg: 18 },
  { slot: 2, dice: '3d8', avg: 13.5, critDice: '6d8', critAvg: 27 },
  { slot: 3, dice: '4d8', avg: 18, critDice: '8d8', critAvg: 36 },
  { slot: 4, dice: '5d8', avg: 22.5, critDice: '10d8', critAvg: 45 },
  { slot: 5, dice: '5d8', avg: 22.5, critDice: '10d8', critAvg: 45 },
];

export const SMITE_SPELLS = [
  { name: 'Thunderous Smite', level: 1, bonus: '2d6 thunder', effect: 'STR save or pushed 10ft + prone.', casting: 'Bonus Action', concentration: true },
  { name: 'Searing Smite', level: 1, bonus: '1d6 fire', effect: 'Target catches fire (1d6 fire per turn, CON save to end).', casting: 'Bonus Action', concentration: true },
  { name: 'Wrathful Smite', level: 1, bonus: '1d6 psychic', effect: 'Target frightened (WIS save each turn to end).', casting: 'Bonus Action', concentration: true },
  { name: 'Branding Smite', level: 2, bonus: '2d6 radiant', effect: 'Target becomes visible (no benefit from invisibility).', casting: 'Bonus Action', concentration: true },
  { name: 'Blinding Smite', level: 3, bonus: '3d8 radiant', effect: 'Target blinded (CON save each turn to end).', casting: 'Bonus Action', concentration: true },
  { name: 'Staggering Smite', level: 4, bonus: '4d6 psychic', effect: 'Target disadvantage on attacks/saves, can\'t use reactions (WIS save).', casting: 'Bonus Action', concentration: true },
  { name: 'Banishing Smite', level: 5, bonus: '5d10 force', effect: 'If target has 50 HP or less after hit, banished (gone if extraplanar).', casting: 'Bonus Action', concentration: true },
];

export const SMITE_TIPS = [
  'Save smites for critical hits — all dice are doubled!',
  'Use lower slots for regular hits, save high slots for crits.',
  'Against undead/fiends, even a 1st level smite does 3d8 (avg 13.5).',
  'Smite spells stack WITH Divine Smite (but use separate slots).',
  'Don\'t blow all slots on smites early — you may need healing spells later.',
  'Improved Divine Smite (11th level) adds 1d8 radiant to every melee hit for free.',
];

export function getSmiteDamage(slotLevel, isUndead = false, isCrit = false) {
  const clamped = Math.min(5, Math.max(1, slotLevel));
  const entry = SMITE_DAMAGE.find(s => s.slot === clamped);
  if (!entry) return null;

  let baseDice = isCrit ? entry.critDice : entry.dice;
  let baseAvg = isCrit ? entry.critAvg : entry.avg;

  if (isUndead) {
    const extraDice = isCrit ? 2 : 1;
    baseAvg += extraDice * 4.5;
    baseDice += ` + ${extraDice}d8`;
  }

  return { dice: baseDice, average: baseAvg, slotLevel: clamped };
}

export function shouldSmite(slotLevel, isCrit, currentSlots, isUndead = false) {
  // Simple heuristic: always smite on crits, be conservative otherwise
  if (isCrit) return true;
  if (isUndead && currentSlots > 1) return true;
  if (slotLevel <= 1 && currentSlots > 2) return true;
  return false;
}
