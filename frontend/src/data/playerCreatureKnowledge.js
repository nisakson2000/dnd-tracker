/**
 * playerCreatureKnowledge.js
 * Player Mode: What players can know about monsters based on skill checks
 * Pure JS — no React dependencies.
 */

export const KNOWLEDGE_SKILLS = [
  { creatureType: 'Aberrations', skill: 'Arcana', examples: 'Beholder, Mind Flayer, Aboleth, Gibbering Mouther' },
  { creatureType: 'Beasts', skill: 'Nature', examples: 'Wolf, Bear, Giant Eagle, Owlbear' },
  { creatureType: 'Celestials', skill: 'Religion', examples: 'Angel, Unicorn, Pegasus, Couatl' },
  { creatureType: 'Constructs', skill: 'Arcana', examples: 'Golem, Shield Guardian, Animated Armor' },
  { creatureType: 'Dragons', skill: 'Arcana or Nature', examples: 'Red Dragon, Wyvern, Dragon Turtle' },
  { creatureType: 'Elementals', skill: 'Arcana', examples: 'Fire Elemental, Djinni, Galeb Duhr' },
  { creatureType: 'Fey', skill: 'Arcana or Nature', examples: 'Dryad, Satyr, Hag, Pixie' },
  { creatureType: 'Fiends', skill: 'Religion', examples: 'Devil, Demon, Yugoloth, Succubus' },
  { creatureType: 'Giants', skill: 'History', examples: 'Hill Giant, Storm Giant, Ogre, Troll' },
  { creatureType: 'Humanoids', skill: 'History', examples: 'Goblin, Orc, Bandit, Cultist' },
  { creatureType: 'Monstrosities', skill: 'Nature', examples: 'Basilisk, Hydra, Minotaur, Manticore' },
  { creatureType: 'Oozes', skill: 'Arcana or Nature', examples: 'Gelatinous Cube, Black Pudding, Gray Ooze' },
  { creatureType: 'Plants', skill: 'Nature', examples: 'Shambling Mound, Treant, Myconid' },
  { creatureType: 'Undead', skill: 'Religion', examples: 'Zombie, Vampire, Lich, Ghost, Wraith' },
];

export const KNOWLEDGE_DC_TABLE = [
  { dc: 10, reveals: 'Creature type and basic information (common knowledge).', example: '"That\'s a troll. They\'re big, strong, and mean."' },
  { dc: 15, reveals: 'Key abilities, resistances, and common tactics.', example: '"Trolls regenerate HP every round. Fire and acid stop the regeneration."' },
  { dc: 20, reveals: 'Specific vulnerabilities, immunities, and special abilities.', example: '"This troll variant is a Spirit Troll — only fire damage prevents its regeneration, and it can turn invisible."' },
  { dc: 25, reveals: 'Legendary actions, lair effects, rare variants, and lore.', example: '"The ancient red dragon Infernathos has three legendary actions and its lair creates volcanic fissures."' },
];

export const CREATURE_TYPE_TIPS = {
  Undead: 'Turn Undead (Cleric) affects them. Often immune to poison and exhaustion. Radiant damage is effective.',
  Fiends: 'Often resistant to fire. Silvered weapons bypass resistance. Banishment sends them home permanently.',
  Fey: 'Iron weapons are traditionally effective. Charm effects are common. Be careful with bargains.',
  Constructs: 'Often immune to poison, psychic, and many conditions. Usually don\'t need to eat/sleep.',
  Aberrations: 'Often have psychic abilities. May cause madness. Intelligence-based monsters.',
  Dragons: 'Breath weapon, frightful presence, flight. Fight outside lair if possible. Exploit elemental weaknesses.',
};

export function getKnowledgeSkill(creatureType) {
  const entry = KNOWLEDGE_SKILLS.find(k => k.creatureType.toLowerCase() === (creatureType || '').toLowerCase());
  return entry ? entry.skill : 'Nature or Arcana';
}

export function getKnowledgeRevealed(checkResult) {
  const reveals = [];
  for (const entry of KNOWLEDGE_DC_TABLE) {
    if (checkResult >= entry.dc) reveals.push(entry);
  }
  return reveals;
}
