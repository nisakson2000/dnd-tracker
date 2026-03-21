/**
 * playerStarsDruidGuide.js
 * Player Mode: Circle of Stars Druid — the cosmic constellation caster
 * Pure JS — no React dependencies.
 */

export const STARS_BASICS = {
  class: 'Druid (Circle of Stars)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Starlight and constellations. Star Map focus. Three constellation forms. Best concentration druid.',
  note: 'Uses Wild Shape for Starry Form instead of beast shapes. Three excellent options. Top-tier druid subclass.',
};

export const STARS_FEATURES = [
  { feature: 'Star Map', level: 2, effect: 'Free spellcasting focus. Learn Guidance cantrip (free). Guiding Bolt 1/LR (free, no slot).', note: 'Free Guidance + free Guiding Bolt. Excellent value at L2.' },
  { feature: 'Starry Form', level: 2, effect: 'Use Wild Shape: choose a constellation form. Lasts 10 minutes. Gain benefits based on choice.', note: 'Three forms: Archer (damage), Chalice (healing), Dragon (concentration). All excellent.' },
  { feature: 'Cosmic Omen', level: 6, effect: 'After long rest, roll d6. Even (Weal): reaction to add 1d6 to ally\'s check/save/attack. Odd (Woe): reaction to subtract 1d6 from enemy\'s check/save/attack. PB uses/LR.', note: 'Like Bardic Inspiration or Cutting Words depending on roll. PB uses. Very strong.' },
  { feature: 'Twinkling Constellations', level: 10, effect: 'Starry Form improves: Archer = 2d8. Chalice = 1d8+WIS. Dragon = fly 20ft. Can swap form at start of your turns.', note: 'All three forms get better. Swapping forms each turn is incredible flexibility.' },
  { feature: 'Full of Stars', level: 14, effect: 'While in Starry Form: resistance to bludgeoning/piercing/slashing damage (like Stoneskin for free).', note: 'Resistance to physical damage while in Starry Form. Incredible durability.' },
];

export const STARRY_FORMS = [
  { form: 'Archer', effect: 'Bonus action: ranged spell attack 60ft, 1d8+WIS radiant (2d8+WIS at L10).', rating: 'A', note: 'Free bonus action attack. No slot cost. At L10: 2d8+WIS per turn guaranteed. Great sustained damage.' },
  { form: 'Chalice', effect: 'When you cast a healing spell: another creature within 30ft regains 1d8+WIS HP (1d8+WIS at L10).', rating: 'S', note: 'Bonus healing on every heal spell. Healing Word heals two targets. Double healing efficiency.' },
  { form: 'Dragon', effect: 'Minimum 10 on concentration saves. Treat rolls below 10 as 10 (like Reliable Talent). Fly 20ft at L10.', rating: 'S', note: 'Effectively can\'t fail concentration below 22 damage. Keeps your Conjure Animals/Call Lightning running.' },
];

export const STARS_TACTICS = [
  { tactic: 'Dragon Form + Conjure Animals', detail: 'Conjure 8 wolves → Dragon Form → can\'t fail concentration. Wolves attack every turn. You fire Archer shots or heal.', rating: 'S' },
  { tactic: 'Chalice + Healing Word', detail: 'Healing Word (bonus action): heal target + Chalice heals second target. Two allies healed for 1 bonus action spell slot.', rating: 'S' },
  { tactic: 'Form swapping at L10', detail: 'Start in Dragon for concentration setup → swap to Archer for damage → swap to Chalice when healing needed.', rating: 'S' },
  { tactic: 'Cosmic Omen save reduction', detail: 'Woe: subtract 1d6 from enemy save. Stacks with your save DC. Makes save-or-suck spells land.', rating: 'A' },
  { tactic: 'Guidance + Star Map', detail: 'Always have Guidance running. Free via Star Map (doesn\'t count against cantrips known). +1d4 to every skill check.', rating: 'A' },
];

export function archerFormDamage(wisMod, druidLevel) {
  const dice = druidLevel >= 10 ? 2 : 1;
  return dice * 4.5 + wisMod; // d8 avg = 4.5
}

export function chaliceBonusHealing(wisMod, druidLevel) {
  const diceAvg = 4.5; // 1d8
  return druidLevel >= 10 ? diceAvg + wisMod : diceAvg + wisMod;
}

export function dragonFormMinConSave() {
  return 10; // Minimum 10 on concentration saves
}

export function cosmicOmenUses(proficiencyBonus) {
  return proficiencyBonus;
}
