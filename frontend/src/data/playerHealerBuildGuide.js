/**
 * playerHealerBuildGuide.js
 * Player Mode: Best healer builds — subclasses, spells, and healing philosophy
 * Pure JS — no React dependencies.
 */

export const HEALING_PHILOSOPHY = {
  rule1: 'You can\'t outheal damage in 5e. Don\'t try. Healing in combat is reactive, not proactive.',
  rule2: 'The best healing is picking up downed allies with Healing Word (BA, 60ft range).',
  rule3: 'Preventing damage (control, buff, tank) is better than healing damage.',
  rule4: 'Out-of-combat healing (Hit Dice, short rests) is where most HP recovery happens.',
  note: 'The "healbot" playstyle is a trap. Heal when necessary, but spend most actions on control/damage.',
};

export const BEST_HEALER_SUBCLASSES = [
  { subclass: 'Life Cleric', rating: 'S', class: 'Cleric', keyFeature: 'Disciple of Life: healing spells heal +2+spell level extra. Heavy armor.', note: 'Best pure healer. Goodberry combo: each berry heals 4 HP (with 1-level multiclass).' },
  { subclass: 'Shepherd Druid', rating: 'S', class: 'Druid', keyFeature: 'Unicorn Spirit Totem: every healing spell also heals all allies in 30ft for spell level HP.', note: 'AoE healing on every heal spell. Incredible sustain.' },
  { subclass: 'Divine Soul Sorcerer', rating: 'S', class: 'Sorcerer', keyFeature: 'Cleric + Sorcerer spell list. Twin Healing Word, Twin Cure Wounds.', note: 'Twin heal = two allies from one slot. Most flexible healer.' },
  { subclass: 'Mercy Monk', rating: 'A+', class: 'Monk', keyFeature: 'Hands of Healing: 1 ki = heal 1 martial arts die + WIS. No spell slots.', note: 'Ki-based healing. No action cost (replace one Flurry attack). Unique.' },
  { subclass: 'Celestial Warlock', rating: 'A+', class: 'Warlock', keyFeature: 'Healing Light: BA heal d6 pool. Recover on LR.', note: 'Warlock with healing. Small pool but free BA heals.' },
  { subclass: 'Stars Druid', rating: 'A', class: 'Druid', keyFeature: 'Chalice Starry Form: when you cast healing, another creature within 30ft heals 1d8+WIS.', note: 'Free secondary heal every time you heal.' },
  { subclass: 'Grave Cleric', rating: 'A+', class: 'Cleric', keyFeature: 'Circle of Mortality: maximize healing dice on creatures at 0 HP. Spare the Dying at 30ft BA.', note: 'Best at picking up downed allies. Maximum Healing Word on downed = huge.' },
  { subclass: 'Redemption Paladin', rating: 'A', class: 'Paladin', keyFeature: 'Aura of the Guardian: take damage instead of ally as reaction.', note: 'Absorb damage for allies. Not traditional healing but effective.' },
];

export const BEST_HEALING_SPELLS = [
  { spell: 'Healing Word', level: 1, rating: 'S+', note: 'BA, 60ft range. Pick up downed allies. THE healing spell. Always prepare.' },
  { spell: 'Mass Healing Word', level: 3, rating: 'A+', note: 'BA, 60ft, heal up to 6 creatures. Mass pickup after AoE knock.' },
  { spell: 'Cure Wounds', level: 1, rating: 'A', note: 'Touch, 1d8+mod. More healing than Healing Word but costs action + touch.' },
  { spell: 'Aura of Vitality', level: 3, rating: 'S (out of combat)', note: 'BA heal 2d6 each round for 1 min. 20d6 healing over 10 rounds. Incredible between fights.' },
  { spell: 'Aid', level: 2, rating: 'S', note: '+5 max HP to 3 creatures for 8 hours. Prevents going down. Pre-fight must.' },
  { spell: 'Heal', level: 6, rating: 'S', note: '70 HP instant heal. Removes blind/deaf/disease. Emergency full restore.' },
  { spell: 'Mass Heal', level: 9, rating: 'S+', note: '700 HP distributed. Full party restoration.' },
  { spell: 'Goodberry', level: 1, rating: 'S (Life Cleric)', note: '10 berries × 1 HP each. With Life Cleric: 10 × 4 HP = 40 HP per L1 slot.' },
  { spell: 'Prayer of Healing', level: 2, rating: 'A (out of combat)', note: '2d8+mod to 6 creatures. 10 min cast. SR alternative.' },
  { spell: 'Heroes\' Feast', level: 6, rating: 'S', note: 'All eaters: immune to frightened/poisoned, advantage on WIS saves, 2d10 max HP. 24 hours.' },
  { spell: 'Death Ward', level: 4, rating: 'S', note: 'First 0 HP = 1 HP instead. 8 hours. Pre-fight insurance.' },
];

export const HEALING_TIPS = [
  'Healing Word > Cure Wounds in almost every situation. BA + range wins.',
  'Don\'t heal allies above 0 HP in combat unless they\'re about to take massive damage.',
  'Use your action for damage/control, BA for Healing Word when someone goes down.',
  'Aid + Death Ward before boss fights. Prevention > cure.',
  'Goodberry + Life Cleric (even 1-level dip): 40 HP for a L1 slot. Best healing efficiency.',
  'Aura of Vitality between fights: 20d6 (avg 70) healing for a L3 slot. Incredible value.',
  'The best healer is one who prevents damage entirely. Bless, Hypnotic Pattern, Shield of Faith.',
];
