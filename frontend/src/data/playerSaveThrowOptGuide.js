/**
 * playerSaveThrowOptGuide.js
 * Player Mode: Saving throws — which matter, how to boost, and what to fear
 * Pure JS — no React dependencies.
 */

export const SAVING_THROW_OVERVIEW = {
  strong: 'DEX, CON, WIS — "big three." Most saves target these.',
  weak: 'STR, INT, CHA — "little three." Less common but can be devastating.',
  proficiency: 'Each class starts with 2 save proficiencies (usually one strong + one weak).',
  formula: 'Save = d20 + ability modifier + proficiency (if proficient) + bonuses.',
};

export const SAVING_THROWS_RANKED = [
  { save: 'WIS', frequency: 'Very High', rating: 'S+', effects: 'Charm, fear, domination, Hold Person, Banishment.', failConsequence: 'Lose turn, fight allies, become puppet. Worst consequences.' },
  { save: 'CON', frequency: 'Very High', rating: 'S+', effects: 'Concentration, poison, Blight, Cloudkill.', failConsequence: 'Lose concentration, heavy damage, poisoned.' },
  { save: 'DEX', frequency: 'High', rating: 'S', effects: 'Fireball, Lightning Bolt, breath weapons, traps.', failConsequence: 'Take full damage. Usually just damage.' },
  { save: 'CHA', frequency: 'Low', rating: 'A', effects: 'Banishment, Calm Emotions, Zone of Truth.', failConsequence: 'Banished to another plane. Charmed.' },
  { save: 'STR', frequency: 'Low', rating: 'B+', effects: 'Entangle, Reverse Gravity, grapple.', failConsequence: 'Restrained, prone, moved. Usually escapable.' },
  { save: 'INT', frequency: 'Very Low', rating: 'B+', effects: 'Mind Flayers, Feeblemind, Synaptic Static.', failConsequence: 'Feeblemind = character-ending. Rare but devastating.' },
];

export const SAVING_THROW_BOOSTERS = [
  { method: 'Resilient (feat)', bonus: '+PB to one save', rating: 'S', note: 'Best for CON or WIS. Scales with level.' },
  { method: 'Aura of Protection (Paladin 6)', bonus: '+CHA to ALL saves (30ft)', rating: 'S++', note: 'Best save boost in the game. +5 to ALL saves for party.' },
  { method: 'Bless (Cleric/Paladin)', bonus: '+1d4 to saves', rating: 'S+', note: '3 creatures: +1d4 saves + attacks. Concentration.' },
  { method: 'War Caster (feat)', bonus: 'Advantage on CON concentration saves', rating: 'S', note: 'Best at low levels. Resilient overtakes at high levels.' },
  { method: 'Magic Resistance (racial)', bonus: 'Advantage vs spells', rating: 'S+', note: 'Yuan-Ti, Gnome, Satyr. Incredible.' },
  { method: 'Cloak/Ring of Protection', bonus: '+1 ALL saves + AC', rating: 'A+', note: 'Uncommon items. They stack.' },
  { method: 'Heroes\' Feast (spell)', bonus: 'Advantage on WIS saves, immune fear', rating: 'S+', note: '24 hours. No concentration.' },
  { method: 'Mind Blank (spell)', bonus: 'Immune psychic/charm/divination', rating: 'S+', note: '24 hours. No concentration. L8 spell.' },
];

export const CLASS_SAVE_PROFICIENCIES = [
  { class: 'Barbarian', saves: 'STR, CON', note: 'Get Resilient (WIS) eventually.' },
  { class: 'Bard', saves: 'DEX, CHA', note: 'Jack of All Trades adds to all saves.' },
  { class: 'Cleric', saves: 'WIS, CHA', note: 'Natural WIS save. Bless helps.' },
  { class: 'Druid', saves: 'INT, WIS', note: 'Need Resilient (CON) for concentration.' },
  { class: 'Fighter', saves: 'STR, CON', note: 'Indomitable: reroll a failed save.' },
  { class: 'Monk', saves: 'STR, DEX', note: 'Diamond Soul (L14): ALL save proficiencies.' },
  { class: 'Paladin', saves: 'WIS, CHA', note: 'Aura of Protection: +CHA to ALL saves.' },
  { class: 'Ranger', saves: 'STR, DEX', note: 'DEX is strong. Need WIS help.' },
  { class: 'Rogue', saves: 'DEX, INT', note: 'Evasion: DEX success = 0 damage.' },
  { class: 'Sorcerer', saves: 'CON, CHA', note: 'Natural CON save for concentration.' },
  { class: 'Warlock', saves: 'WIS, CHA', note: 'Natural WIS proficiency.' },
  { class: 'Wizard', saves: 'INT, WIS', note: 'Need Resilient (CON) badly.' },
  { class: 'Artificer', saves: 'CON, INT', note: 'Flash of Genius: +INT to saves (reaction).' },
];

export const SAVING_THROW_TIPS = [
  'WIS saves are the most important to shore up. Failing = worst outcomes.',
  'CON saves critical for every caster. Resilient (CON) or War Caster essential.',
  'DEX saves are common but usually just damage.',
  'Paladin Aura of Protection is the single best save feature.',
  'Bless: +1d4 to saves AND attacks for 3 people.',
  'Gnomes: advantage on INT/WIS/CHA saves vs magic.',
  'At high levels, saves matter more than AC.',
  'Diamond Soul (Monk 14): proficient in ALL saves.',
  'Heroes\' Feast before boss fights: advantage on WIS saves.',
];
