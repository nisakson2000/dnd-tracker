/**
 * playerHealingWordVsCureWoundsGuide.js
 * Player Mode: Healing Word vs Cure Wounds — the definitive comparison
 * Pure JS — no React dependencies.
 */

export const HEALING_WORD = {
  spell: 'Healing Word',
  level: 1,
  castingTime: 'Bonus action',
  range: '60ft',
  healing: '1d4 + spellcasting mod',
  note: 'The best healing spell in 5e. Bonus action = you still attack/cast cantrip. 60ft range = heal from safety. The healing amount doesn\'t matter as much as the action economy.',
};

export const CURE_WOUNDS = {
  spell: 'Cure Wounds',
  level: 1,
  castingTime: 'Action',
  range: 'Touch',
  healing: '1d8 + spellcasting mod',
  note: 'More healing per cast but costs your ACTION and requires TOUCH. You have to run up to the wounded ally and give up your turn.',
};

export const COMPARISON = [
  { category: 'Action economy', healingWord: 'Bonus action (still have action)', cureWounds: 'Full action (turn is over)', winner: 'Healing Word' },
  { category: 'Range', healingWord: '60ft', cureWounds: 'Touch', winner: 'Healing Word' },
  { category: 'Healing amount', healingWord: '1d4+mod (avg ~7 at +5)', cureWounds: '1d8+mod (avg ~9 at +5)', winner: 'Cure Wounds (slightly)' },
  { category: 'Picking up allies at 0 HP', healingWord: '60ft bonus action = pop them up AND attack', cureWounds: 'Must be adjacent and use your entire turn', winner: 'Healing Word' },
  { category: 'Risk', healingWord: 'Cast from 60ft away, behind cover', cureWounds: 'Must touch = be in melee range of threats', winner: 'Healing Word' },
  { category: 'Paired with cantrip', healingWord: 'Bonus action heal + action cantrip (Sacred Flame)', cureWounds: 'Can\'t attack at all', winner: 'Healing Word' },
];

export const HEALING_PHILOSOPHY = {
  yoYoHealing: 'In 5e, healing is most efficient when picking up downed allies. A creature at 1 HP functions identically to one at full HP. Healing Word for 5 HP on a downed ally = they\'re back in the fight.',
  preventiveHealing: 'Healing before someone drops is usually worse than dealing damage to kill enemies. Dead enemies deal 0 damage.',
  bestStrategy: 'Let allies drop → Healing Word (bonus action) → they\'re back with 5 HP → you also attack/cast on your turn.',
  exception: 'Against enemies with multi-attack that can down AND kill on the same turn, preventive healing matters more.',
  note: 'Healing Word is the best L1 spell for Clerics, Bards, and Druids. Always prepare it. Always.',
};

export const HEALING_SPELL_TIER_LIST = [
  { spell: 'Healing Word', level: 1, rating: 'S', reason: 'Bonus action, 60ft range, picks up downed allies. Best L1 heal.' },
  { spell: 'Heal', level: 6, rating: 'S', reason: '70 HP + cure conditions. Action but massive healing. Worth the action cost.' },
  { spell: 'Mass Healing Word', level: 3, rating: 'A', reason: 'Bonus action, heal up to 6 creatures. Party-wide pickup.' },
  { spell: 'Aura of Vitality', level: 3, rating: 'A', reason: 'Bonus action: 2d6 heal each round for 1 minute. 20d6 total. Best sustained healing.' },
  { spell: 'Cure Wounds', level: 1, rating: 'B', reason: 'More healing than HW but action cost is too high. Only use if HW isn\'t available.' },
  { spell: 'Prayer of Healing', level: 2, rating: 'B', reason: '10-minute cast. Out-of-combat only. 2d8+mod to 6 creatures. Short rest healing supplement.' },
  { spell: 'Goodberry', level: 1, rating: 'A', reason: '10 berries, 1 HP each. Can be fed to unconscious allies (as action). Life Cleric: each berry heals 4 HP.' },
];

export function healingWordAvg(spellcastingMod, slotLevel = 1) {
  const dice = slotLevel;
  return dice * 2.5 + spellcastingMod;
}

export function cureWoundsAvg(spellcastingMod, slotLevel = 1) {
  const dice = slotLevel;
  return dice * 4.5 + spellcastingMod;
}

export function yoYoHealingValue() {
  return { note: 'A creature at 1 HP fights just as well as one at full HP. Healing Word for any amount = full combat effectiveness restored.' };
}
