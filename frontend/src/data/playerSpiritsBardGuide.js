/**
 * playerSpiritsBardGuide.js
 * Player Mode: College of Spirits Bard — the séance storyteller
 * Pure JS — no React dependencies.
 */

export const SPIRITS_BASICS = {
  class: 'Bard (College of Spirits)',
  source: 'Van Richten\'s Guide to Ravenloft',
  theme: 'Channel spirits. Random tales via Bardic Inspiration. Spiritual Focus for spellcasting.',
  note: 'Unique random table mechanic. Tales from Beyond gives Bardic Inspiration random powerful effects. Spirit Session lets you learn spells from other lists. High variance but high ceiling.',
};

export const SPIRITS_FEATURES = [
  { feature: 'Guiding Whispers', level: 3, effect: 'Learn Guidance cantrip. Doesn\'t count against cantrips known.', note: 'Free Guidance. Best cantrip in the game for out-of-combat. +1d4 to any ability check.' },
  { feature: 'Spiritual Focus', level: 3, effect: 'Can use a candle, crystal ball, skull, spirit board, or tarokka deck as a spellcasting focus. At L6: +1d6 to one damage/healing roll of bard spells cast through it.', note: 'Thematic focus. At L6: +1d6 damage or healing per spell. Free boost.' },
  { feature: 'Tales from Beyond', level: 3, effect: 'Bonus action: expend Bardic Inspiration, roll on Spirit Tales table. Gain a tale (effect) you can give to a creature within 30ft as a bonus action within 10 minutes.', note: 'Roll determines the tale: healing, damage, teleportation, AC boost, etc. Random but all options are good.' },
  { feature: 'Spirit Session', level: 6, effect: '1 hour ritual with PB willing creatures: learn one spell from any class list at/below your max spell level. Lasts until next LR.', note: 'Learn ANY spell from ANY class for a day. Wizard, Cleric, Druid spells. Incredible flexibility.' },
  { feature: 'Mystical Connection', level: 14, effect: 'Tales from Beyond: roll on the table twice, choose which tale to use.', note: 'Pick from 2 random options. Much more consistent. Higher chance of getting the tale you need.' },
];

export const SPIRIT_TALES_TABLE = [
  { roll: 1, tale: 'Tale of the Clever Animal', effect: 'Target has advantage on next INT, WIS, or CHA check within 10 minutes.' },
  { roll: 2, tale: 'Tale of the Renowned Duelist', effect: 'Target has +2 AC for 1 minute.' },
  { roll: 3, tale: 'Tale of the Beloved Friends', effect: 'Target and ally within 5ft regain HP = BI die + CHA mod.' },
  { roll: 4, tale: 'Tale of the Runaway', effect: 'Target can teleport 30ft as a reaction when taking damage. Halve the triggering damage.' },
  { roll: 5, tale: 'Tale of the Avenger', effect: 'Target can force creature that damages it to make WIS save or be frightened. Target has advantage on attacks against the creature.' },
  { roll: 6, tale: 'Tale of the Traveler', effect: 'Target can teleport to unoccupied space within 30ft. +BI die temp HP.' },
  { roll: 7, tale: 'Tale of the Beguiler', effect: 'Target can force creature within 30ft to make WIS save or take psychic damage + be incapacitated until end of its next turn.' },
  { roll: 8, tale: 'Tale of the Phantom', effect: 'Target becomes invisible until end of its next turn or until it attacks/casts a spell.' },
  { roll: 9, tale: 'Tale of the Brute', effect: 'Target can force creature it hits with an attack to make STR save or be knocked prone + take extra force damage.' },
  { roll: 10, tale: 'Tale of the Dragon', effect: 'Target can breathe a 30ft cone of force damage (each creature: DEX save, BI die + CHA mod damage).' },
  { roll: 11, tale: 'Tale of the Angel', effect: 'Target regains HP = BI die × 2 + CHA mod. Conditions ended: blinded, deafened, paralyzed, petrified, poisoned.' },
  { roll: 12, tale: 'Tale of the Mind-Bender', effect: 'Target can cast Confusion (no spell slot). INT-based save DC.' },
];

export const SPIRITS_TACTICS = [
  { tactic: 'Spirit Session spell theft', detail: 'L6: learn any spell from any class list for a day. Grab Healing Word, Counterspell, Spirit Guardians — whatever you need.', rating: 'S' },
  { tactic: 'Tales from Beyond flexibility', detail: 'Random but all good. Healing, damage, teleportation, AC boost, or crowd control. Use bonus action to distribute.', rating: 'A' },
  { tactic: 'Guidance spam', detail: 'Free Guidance cantrip. +1d4 to every ability check out of combat. Never leave home without it.', rating: 'S' },
  { tactic: 'Mystical Connection consistency', detail: 'L14: roll twice on tales table, pick one. Much better consistency. Can aim for the tale you need.', rating: 'A' },
];

export function spiritTaleResult(roll) {
  return SPIRIT_TALES_TABLE.find(t => t.roll === roll) || SPIRIT_TALES_TABLE[0];
}

export function spiritualFocusDamageBonus(bardLevel) {
  return bardLevel >= 6 ? 3.5 : 0; // 1d6 avg
}
