/**
 * playerHealingStrategyGuide.js
 * Player Mode: Healing strategy — when, how, and how much to heal
 * Pure JS — no React dependencies.
 */

export const HEALING_PHILOSOPHY = {
  problem: 'In 5e, healing cannot keep up with incoming damage.',
  solution: 'Heal strategically: pick up downed allies, prevent deaths, heal between fights.',
  goldRule: 'Dead monsters deal 0 damage. Killing faster > healing through damage.',
};

export const HEALING_PRIORITY = [
  { priority: 1, action: 'Pick up ally at 0 HP', detail: 'Healing Word (BA, 60ft). Best value in the game.', rating: 'S' },
  { priority: 2, action: 'Prevent death', detail: 'Death Ward, Shield, positioning.', rating: 'S' },
  { priority: 3, action: 'Out-of-combat healing', detail: 'Hit Dice, Prayer of Healing, Goodberry.', rating: 'A+' },
  { priority: 4, action: 'Top off before boss', detail: 'Aid, Healing Spirit, full party heal.', rating: 'A' },
  { priority: 5, action: 'Mid-combat healing conscious ally', detail: 'Only if they\'re about to die. Usually suboptimal.', rating: 'B' },
];

export const HEALING_SPELLS_RANKED = [
  { spell: 'Healing Word', level: 1, action: 'BA', range: '60ft', rating: 'S', note: 'Best combat heal.' },
  { spell: 'Mass Healing Word', level: 3, action: 'BA', rating: 'S', note: 'Multi-KO recovery.' },
  { spell: 'Heal', level: 6, healing: '70 flat', rating: 'S', note: 'Real healing when it matters.' },
  { spell: 'Goodberry', level: 1, healing: '10 × 1 HP', rating: 'A+', note: 'Best out-of-combat L1 heal.' },
  { spell: 'Prayer of Healing', level: 2, healing: '2d8+mod (6 targets)', rating: 'A+', note: 'Post-combat party heal.' },
  { spell: 'Aura of Vitality', level: 3, healing: '20d6 over 1 min', rating: 'A', note: 'Best sustained single-target.' },
  { spell: 'Cure Wounds', level: 1, range: 'Touch', rating: 'B+', note: 'Touch + action = suboptimal in combat.' },
];

export const OUT_OF_COMBAT_HEALING = [
  { method: 'Short Rest + Hit Dice', detail: 'Free. Spend up to half your max Hit Dice.', rating: 'S' },
  { method: 'Prayer of Healing', detail: '10 min. 2d8+mod to 6 creatures.', rating: 'A+' },
  { method: 'Goodberry', detail: '10 berries × 1 HP. L1 slot.', rating: 'A+' },
  { method: 'Song of Rest (Bard)', detail: 'Extra 1d6-1d12 HP on SR. Free.', rating: 'A' },
  { method: 'Chef feat', detail: 'Cook: +1d8 HP to PB creatures during SR.', rating: 'A' },
  { method: 'Healer feat', detail: 'Kit: 1d6+4+level HP. Once per creature per rest.', rating: 'A' },
];

export const HEALER_SUBCLASS_RANKING = [
  { subclass: 'Life Cleric', rating: 'S', note: 'Best healer. +2+spell level to ALL healing.' },
  { subclass: 'Shepherd Druid', rating: 'S', note: 'Unicorn Spirit: heal ALL allies on any healing spell.' },
  { subclass: 'Divine Soul Sorcerer', rating: 'A+', note: 'Cleric list + Twinned Spell.' },
  { subclass: 'Dreams Druid', rating: 'A+', note: 'BA 60ft healing pool. No slots needed.' },
  { subclass: 'Mercy Monk', rating: 'A', note: 'Ki-powered healing. No spell slots.' },
];

export const HEALING_MISTAKES = [
  'Healing allies at full HP.',
  'Cure Wounds in combat instead of Healing Word.',
  'Spending all slots on healing instead of offense.',
  'Trying to outheal monster damage.',
  'Not using Hit Dice on short rests.',
  'Healing someone at 20/40 HP when they\'re fine.',
];
