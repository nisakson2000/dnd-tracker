/**
 * playerHealerGuide.js
 * Player Mode: Complete healing optimization guide for support players
 * Pure JS — no React dependencies.
 */

export const HEALING_PHILOSOPHY = {
  rule1: 'Don\'t heal proactively. An enemy at full HP does the same damage as one at 1 HP.',
  rule2: 'Healing in combat is for getting downed allies up. Healing Word is king.',
  rule3: 'The best healing is PREVENTING damage. Control spells > healing spells.',
  rule4: 'Out of combat healing: use Hit Dice on short rests. Save spell slots.',
  rule5: 'Dead enemies deal 0 damage. Often, killing faster IS the best healing.',
};

export const HEALING_SPELL_TIER_LIST = [
  { spell: 'Healing Word', level: 1, action: 'Bonus', range: '60ft', healing: '1d4+mod', rating: 'S', reason: 'BONUS ACTION. 60ft range. Get downed allies up from anywhere. The best healing spell.' },
  { spell: 'Cure Wounds', level: 1, action: 'Action', range: 'Touch', healing: '1d8+mod', rating: 'B', reason: 'More healing but costs your ACTION and requires TOUCH. Healing Word is almost always better.' },
  { spell: 'Goodberry', level: 1, action: 'Action', range: 'Self', healing: '1 HP per berry (10 total)', rating: 'A', reason: 'Out of combat: 10 HP for a 1st-level slot. Each berry also counts as a day\'s food.' },
  { spell: 'Aura of Vitality', level: 3, action: 'Action + Bonus each turn', range: '30ft', healing: '2d6/turn (10 turns = 20d6)', rating: 'A', reason: 'Best total healing per slot. But requires concentration and 10 rounds. Great out of combat.' },
  { spell: 'Heal', level: 6, action: 'Action', range: '60ft', healing: '70 HP flat', rating: 'S', reason: '70 HP. 60ft range. Also ends blindness, deafness, and disease. Emergency button.' },
  { spell: 'Mass Healing Word', level: 3, action: 'Bonus', range: '60ft', healing: '1d4+mod to 6 creatures', rating: 'A', reason: 'Get multiple downed allies up in one bonus action. Situational but clutch.' },
  { spell: 'Prayer of Healing', level: 2, action: '10 minutes', range: '30ft', healing: '2d8+mod to 6 creatures', rating: 'B', reason: 'Out of combat only (10-minute cast). Good after a fight when short rest isn\'t available.' },
  { spell: 'Life Transference', level: 3, action: 'Action', range: '30ft', healing: '4d8 (you take half)', rating: 'B', reason: 'Risky — you take damage. But 4d8 healing is solid. Life Cleric synergy.' },
  { spell: 'Mass Cure Wounds', level: 5, action: 'Action', range: '60ft', healing: '3d8+mod to 6 creatures', rating: 'A', reason: '5th level but heals the whole party significantly. Great for bad situations.' },
];

export const HEALER_CLASSES_RANKED = [
  { class: 'Life Cleric', rating: 'S', reason: 'Best healer bar none. +2+spell level bonus to all healing. Heavy armor. Spirit Guardians for damage.' },
  { class: 'Shepherd Druid', rating: 'A', reason: 'Unicorn Spirit: everyone in aura heals when you cast a healing spell. Incredible efficiency.' },
  { class: 'Divine Soul Sorcerer', rating: 'A', reason: 'Twinned Healing Word = two allies healed for one bonus action. Metamagic + cleric spells.' },
  { class: 'Stars Druid', rating: 'A', reason: 'Chalice Starry Form: when you heal, another creature within 30ft also heals 1d8+WIS.' },
  { class: 'Celestial Warlock', rating: 'B', reason: 'Healing Light: bonus action d6 healing pool. Short rest recovery. Decent supplement.' },
  { class: 'Paladin', rating: 'B', reason: 'Lay on Hands: 5×level HP pool. Action to use but incredibly flexible. Removes disease/poison.' },
  { class: 'Bard', rating: 'B', reason: 'Healing Word + Bardic Inspiration support. Not a primary healer but great supplement.' },
  { class: 'Ranger', rating: 'C', reason: 'Has healing spells but limited slots. Goodberry is the main contribution.' },
];

export const HEALING_ITEMS = [
  { item: 'Potion of Healing', healing: '2d4+2 (avg 7)', cost: '50 gp', action: 'Action (some DMs: bonus)', rarity: 'Common' },
  { item: 'Potion of Greater Healing', healing: '4d4+4 (avg 14)', cost: '100-150 gp', action: 'Action', rarity: 'Uncommon' },
  { item: 'Healer\'s Kit (10 uses)', healing: 'Stabilize only (0 HP)', cost: '5 gp', action: 'Action', rarity: 'Mundane' },
  { item: 'Healer feat + Kit', healing: '1d6+4+level HP', cost: '5 gp (kit)', action: 'Action', rarity: 'Feat investment' },
  { item: 'Periapt of Wound Closure', healing: 'Auto-stabilize + double Hit Dice healing', cost: 'Rare item', action: 'Passive', rarity: 'Uncommon' },
];

export function getBestHealingSpell(slotLevel) {
  return HEALING_SPELL_TIER_LIST.filter(s => s.level <= slotLevel).sort((a, b) => {
    const ratingOrder = { S: 0, A: 1, B: 2, C: 3 };
    return (ratingOrder[a.rating] || 99) - (ratingOrder[b.rating] || 99);
  });
}

export function shouldHealOrAttack(allyHP, allyMaxHP, enemiesRemaining) {
  const hpPercent = allyHP / allyMaxHP;
  if (allyHP === 0) return { action: 'HEAL — ally is DOWN', spell: 'Healing Word (bonus action)' };
  if (hpPercent < 0.15) return { action: 'HEAL — ally is about to drop', spell: 'Healing Word or Cure Wounds' };
  if (enemiesRemaining <= 1) return { action: 'ATTACK — killing last enemy prevents all damage', spell: 'Damage spell' };
  return { action: 'ATTACK — ally is still up, kill enemies to prevent future damage', spell: 'Damage or control spell' };
}
