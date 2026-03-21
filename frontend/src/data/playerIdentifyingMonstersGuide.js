/**
 * playerIdentifyingMonstersGuide.js
 * Player Mode: Knowledge checks to identify monsters — what you can learn
 * Pure JS — no React dependencies.
 */

export const KNOWLEDGE_CHECKS = [
  { creature: 'Aberrations', skill: 'Arcana (INT)', examples: 'Beholder, Mind Flayer, Aboleth', note: 'Alien, eldritch creatures.' },
  { creature: 'Beasts', skill: 'Nature (INT)', examples: 'Wolf, Bear, Giant Eagle', note: 'Natural animals and beasts.' },
  { creature: 'Celestials', skill: 'Religion (INT)', examples: 'Angel, Planetar, Unicorn', note: 'Divine beings.' },
  { creature: 'Constructs', skill: 'Arcana (INT)', examples: 'Golem, Animated Armor, Shield Guardian', note: 'Magically created.' },
  { creature: 'Dragons', skill: 'Arcana (INT) or Nature (INT)', examples: 'All dragons, Drakes', note: 'DM may allow either.' },
  { creature: 'Elementals', skill: 'Arcana (INT)', examples: 'Fire Elemental, Djinni, Mephit', note: 'Elemental beings.' },
  { creature: 'Fey', skill: 'Arcana (INT) or Nature (INT)', examples: 'Pixie, Satyr, Hag', note: 'Feywild natives.' },
  { creature: 'Fiends', skill: 'Religion (INT)', examples: 'Demon, Devil, Yugoloth', note: 'Lower planes evil.' },
  { creature: 'Giants', skill: 'Nature (INT) or History (INT)', examples: 'Hill Giant, Storm Giant', note: 'Giant-kin.' },
  { creature: 'Humanoids', skill: 'History (INT) or local knowledge', examples: 'Orcs, Goblins, Bandits', note: 'Common races.' },
  { creature: 'Monstrosities', skill: 'Nature (INT)', examples: 'Owlbear, Mimic, Displacer Beast', note: 'Unnatural creatures.' },
  { creature: 'Oozes', skill: 'Arcana (INT) or Nature (INT)', examples: 'Gelatinous Cube, Black Pudding', note: 'Amorphous.' },
  { creature: 'Plants', skill: 'Nature (INT)', examples: 'Treant, Shambling Mound, Myconid', note: 'Plant creatures.' },
  { creature: 'Undead', skill: 'Religion (INT)', examples: 'Zombie, Vampire, Lich', note: 'Once-dead creatures.' },
];

export const WHAT_YOU_LEARN = {
  easy: { dc: '10-12', info: 'Creature type, common name, basic abilities.', note: 'Everyone should know what a zombie is.' },
  medium: { dc: '13-16', info: 'Resistances, immunities, key attacks.', note: 'Know that trolls regenerate.' },
  hard: { dc: '17-20', info: 'Vulnerabilities, legendary actions, weaknesses.', note: 'Know that fire/acid stops troll regen.' },
  veryHard: { dc: '21+', info: 'Lair actions, specific tactics, lore.', note: 'Detailed knowledge. Rare.' },
};

export const MONSTER_LORE_TIPS = [
  'Ask to make a knowledge check when encountering new monsters.',
  'Arcana: aberrations, constructs, dragons, elementals, fey.',
  'Nature: beasts, giants, monstrosities, oozes, plants.',
  'Religion: celestials, fiends, undead.',
  'High INT characters should make these checks.',
  'Jack of All Trades (Bard): applies to all knowledge checks.',
  'Know resistances BEFORE attacking. Don\'t waste fire on fire elementals.',
  'Legendary Resistance: ask if the creature has it. Plan accordingly.',
  'Trolls: fire or acid stops regeneration. Classic knowledge check.',
  'Rust Monsters: destroy metal. Remove metal before engaging.',
];
