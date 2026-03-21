/**
 * playerHealingOptGuide.js
 * Player Mode: Healing optimization — when, how, and how much to heal
 * Pure JS — no React dependencies.
 */

export const HEALING_PHILOSOPHY = {
  core: 'In 5e, healing to PREVENT damage is better than healing AFTER damage.',
  yoyo: 'Yo-yo healing: let ally drop to 0, Healing Word for 1 HP, they act normally.',
  prevention: 'Control spells, AC buffs, and killing enemies faster > healing throughput.',
  rule: 'Don\'t heal chip damage. Heal only to revive (0 HP) or prevent death.',
};

export const HEALING_SPELLS_RANKED = [
  { spell: 'Healing Word', level: 1, rating: 'S+', action: 'BA', range: '60ft', healing: '1d4+mod', note: 'Best healing spell. BA + ranged + revive. Always prepare.' },
  { spell: 'Heal', level: 6, rating: 'S+', action: 'Action', range: '60ft', healing: '70 HP', note: 'Massive single-target heal. Cures blindness, deafness, disease.' },
  { spell: 'Mass Healing Word', level: 3, rating: 'S', action: 'BA', range: '60ft', healing: '1d4+mod to 6 targets', note: 'Mass revive. 6 allies up from 0.' },
  { spell: 'Cure Wounds', level: 1, rating: 'B+', action: 'Action', range: 'Touch', healing: '1d8+mod', note: 'More HP than Healing Word but costs Action + Touch. Usually worse.' },
  { spell: 'Aura of Vitality', level: 3, rating: 'A+', action: 'BA each turn', range: '30ft', healing: '2d6/turn for 10 turns = 20d6', note: 'Best total healing per slot. Out of combat: 70 HP average.' },
  { spell: 'Prayer of Healing', level: 2, rating: 'A (out of combat)', action: '10 minutes', range: '30ft', healing: '2d8+mod to 6 targets', note: 'Post-combat group heal. Not usable in combat.' },
  { spell: 'Goodberry', level: 1, rating: 'S (with Life Cleric dip)', action: 'Action', range: 'Self', healing: '10 berries × 1 HP (or 4 with Life Cleric)', note: 'Life Cleric 1 / Druid X: each berry heals 4 HP. 40 HP per L1 slot.' },
  { spell: 'Mass Cure Wounds', level: 5, rating: 'A', action: 'Action', range: '60ft', healing: '3d8+mod to 6 targets', note: 'Big group heal. Expensive slot.' },
  { spell: 'Revivify', level: 3, rating: 'S+', action: 'Action', range: 'Touch', healing: 'Revive with 1 HP', note: 'Death insurance. 300 gp diamond. Always have one prepared.' },
];

export const HEALING_FEATURES_RANKED = [
  { feature: 'Lay on Hands', class: 'Paladin', pool: '5 × Paladin level', rating: 'S+', note: '1 HP per point. Use 1 at a time for revives. Most efficient healing.' },
  { feature: 'Life Domain', class: 'Cleric', effect: '+2+spell level to healing spells', rating: 'S+', note: 'All healing boosted. Goodberry combo.' },
  { feature: 'Shepherd Druid', class: 'Druid', effect: 'Unicorn Spirit totem: +level HP when healing', rating: 'S', note: 'Best AoE healing support.' },
  { feature: 'Song of Rest', class: 'Bard', effect: 'Extra Hit Die healing on short rest', rating: 'A', note: 'Free extra healing. Scales with level.' },
  { feature: 'Celestial Warlock', class: 'Warlock', effect: 'Healing Light: BA heal pool', rating: 'A+', note: 'BA heal on a Warlock. Rare and valuable.' },
];

export const HEALING_STRATEGY = [
  { rule: 'Don\'t heal chip damage', reason: 'It\'s inefficient. Enemies deal more per turn than you heal. Kill them faster.' },
  { rule: 'Heal at 0 HP only', reason: '1 HP = fully functional. Get them up to act on their turn.' },
  { rule: 'Healing Word > Cure Wounds', reason: 'BA + range > Action + touch. You still get your Action for attacks/cantrips.' },
  { rule: 'Lay on Hands: 1 HP at a time', reason: '50 HP pool = 50 revives. Not 1 big heal.' },
  { rule: 'Save slots for control', reason: 'Hypnotic Pattern prevents more damage than any heal restores.' },
  { rule: 'Revivify always prepared', reason: 'Death insurance. 300 gp diamond. Non-negotiable.' },
  { rule: 'Short rest > healing spells', reason: 'Hit Dice are free healing. Push for short rests between fights.' },
];

export const HEALING_TIPS = [
  'Healing Word: best healing spell. BA + 60ft range + revive from 0.',
  'Don\'t heal chip damage. Wait until ally drops, then Healing Word.',
  'Lay on Hands: use 1 HP at a time. 50 HP pool = 50 revives.',
  'Prevention > healing. Kill enemies and control the battlefield.',
  'Revivify: always prepared. Always carry a 300 gp diamond.',
  'Life Cleric 1 / Druid X: Goodberry heals 4 HP each. 40 HP per L1 slot.',
  'Cure Wounds is a trap. Healing Word is almost always better.',
  'Aura of Vitality: 20d6 healing over 10 rounds. Best total healing/slot.',
  'Short rests use Hit Dice. Free healing. Push the party to rest.',
  'Heal (L6): 70 HP instant. Save for emergencies.',
];
