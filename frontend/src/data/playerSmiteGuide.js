/**
 * playerSmiteGuide.js
 * Player Mode: Paladin Divine Smite rules, smite spells, and optimization
 * Pure JS — no React dependencies.
 */

export const DIVINE_SMITE_RULES = {
  cost: 'Expend a spell slot on a hit (after knowing you hit)',
  damage: '2d8 radiant per slot level + 1d8 per slot level above 1st',
  maximum: '5d8 (using a 4th level slot). Caps at 4th even with higher slots.',
  undead: '+1d8 against undead and fiends',
  critical: 'All smite dice are doubled on a critical hit',
  note: 'Not a spell — doesn\'t require concentration, can\'t be Counterspelled',
  when: 'AFTER you hit. You can wait to see if you crit before deciding to smite.',
};

export const SMITE_DAMAGE_TABLE = [
  { slot: 1, dice: '2d8', avg: 9, avgUndead: 13.5, critAvg: 18, critUndeadAvg: 27 },
  { slot: 2, dice: '3d8', avg: 13.5, avgUndead: 18, critAvg: 27, critUndeadAvg: 36 },
  { slot: 3, dice: '4d8', avg: 18, avgUndead: 22.5, critAvg: 36, critUndeadAvg: 45 },
  { slot: 4, dice: '5d8 (max)', avg: 22.5, avgUndead: 27, critAvg: 45, critUndeadAvg: 54 },
  { slot: 5, dice: '5d8 (cap)', avg: 22.5, avgUndead: 27, critAvg: 45, critUndeadAvg: 54 },
];

export const SMITE_SPELLS = [
  { spell: 'Searing Smite', level: 1, damage: '1d6 fire + 1d6/round (CON save ends)', concentration: true, note: 'Ongoing damage but uses concentration. Worse than Divine Smite usually.' },
  { spell: 'Thunderous Smite', level: 1, damage: '2d6 thunder + push 10ft + prone (STR save)', concentration: true, note: 'Knockback + prone is great. But loud (heard 300ft away).' },
  { spell: 'Wrathful Smite', level: 1, damage: '1d6 psychic + Frightened (WIS save)', concentration: true, note: 'Frightened is excellent CC. Requires action to end, not just save.' },
  { spell: 'Branding Smite', level: 2, damage: '2d6 radiant + visible glow (no invisibility)', concentration: true, note: 'Counter-invisibility. The damage is mediocre for a 2nd level slot.' },
  { spell: 'Blinding Smite', level: 3, damage: '3d8 radiant + Blinded (CON save)', concentration: true, note: 'Blinded is devastating. 3d8 is solid. Best smite spell.' },
  { spell: 'Staggering Smite', level: 4, damage: '4d6 psychic + disadvantage (WIS save)', concentration: true, note: 'Disadvantage on everything. Would be great if not 4th level.' },
  { spell: 'Banishing Smite', level: 5, damage: '5d10 force + banish if below 50 HP', concentration: true, note: 'Huge damage (5d10!) + instant removal if target is low. Finisher spell.' },
];

export const SMITE_OPTIMIZATION = [
  { tip: 'Save smites for crits', detail: 'Wait to see if you crit. A crit doubles ALL smite dice. 4d8 → 8d8 radiant. This is how Paladins one-shot bosses.' },
  { tip: 'Don\'t smite trash mobs', detail: 'Use weapon damage on weak enemies. Save slots for bosses and dangerous threats.' },
  { tip: 'Smite stacks with smite spells', detail: 'You can Wrathful Smite (bonus action pre-attack) AND Divine Smite (on hit). Both apply.' },
  { tip: 'Improved Divine Smite (11th)', detail: 'All melee attacks add 1d8 radiant automatically. No slot needed. Permanent damage boost.' },
  { tip: 'Warlock multiclass slots for smite', detail: 'Pact Magic slots work for Divine Smite AND refresh on short rest. Hexblade 2/Paladin X is nuclear.' },
  { tip: 'Two-weapon fighting for more smites', detail: 'More attacks = more opportunities to crit and smite. But costs bonus action.' },
  { tip: 'Great Weapon Fighting style', detail: 'Reroll 1s and 2s on smite dice? Debated. Crawford says no — it only applies to the weapon\'s damage dice.' },
];

export const CRIT_SMITE_MATH = {
  level5_1stSlot: { normal: '2d8 = 9 avg', crit: '4d8 = 18 avg', withWeapon: 'Greatsword: 4d6+4d8+STR = ~35 avg' },
  level5_2ndSlot: { normal: '3d8 = 13.5 avg', crit: '6d8 = 27 avg', withWeapon: 'Greatsword: 4d6+6d8+STR = ~45 avg' },
  level9_3rdSlot: { normal: '4d8 = 18 avg', crit: '8d8 = 36 avg', withWeapon: 'Greatsword: 4d6+8d8+STR = ~55 avg' },
  note: 'A level 9 Paladin critting with a 3rd level smite on a greatsword does ~55 damage in one hit. On undead, even more.',
};

export function smiteDamage(slotLevel, isCrit, isUndead) {
  const baseDice = Math.min(5, 1 + slotLevel);
  const undeadDice = isUndead ? 1 : 0;
  const totalDice = (baseDice + undeadDice) * (isCrit ? 2 : 1);
  return { dice: totalDice, dieSize: 8, average: totalDice * 4.5 };
}

export function shouldSmite(currentHP, isUndead, isCrit, slotLevel, remainingSlots) {
  if (isCrit) return { smite: true, reason: 'Always smite on a crit. Double dice is too good to pass up.' };
  if (isUndead && remainingSlots > 1) return { smite: true, reason: 'Extra d8 against undead. Worth it.' };
  if (remainingSlots <= 1) return { smite: false, reason: 'Save your last slot for emergencies (healing, Revivify).' };
  if (currentHP <= smiteDamage(slotLevel, false, isUndead).average) return { smite: true, reason: 'This will kill or nearly kill the target.' };
  return { smite: false, reason: 'Save for a crit or a more impactful moment.' };
}
