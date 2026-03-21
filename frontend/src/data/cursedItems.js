/**
 * Cursed & Sentient Item System — Items with hidden curses and items with personalities.
 */

export const CURSED_ITEMS = [
  {
    name: 'Sword of Vengeance',
    type: 'weapon',
    rarity: 'Uncommon',
    appearAs: '+1 Longsword',
    curse: 'You are unwilling to part with the sword. When you take damage, you must make a DC 15 Wisdom save or go berserk, attacking the nearest creature until it or you drop to 0 HP.',
    revealCondition: 'Curse activates on first combat after attunement.',
    removal: 'Remove Curse spell breaks attunement. The sword can be discarded afterward.',
    lore: 'Forged by a blacksmith whose family was murdered. The blade carries his rage.',
  },
  {
    name: 'Armor of Vulnerability',
    type: 'armor',
    rarity: 'Rare',
    appearAs: '+2 Plate Armor',
    curse: 'You have vulnerability to one damage type (bludgeoning, piercing, or slashing — DM chooses). The armor can\'t be removed without Remove Curse.',
    revealCondition: 'Curse revealed when you first take damage of the vulnerable type.',
    removal: 'Remove Curse allows removal. The armor is still +2 but cursed if re-attuned.',
    lore: 'Crafted by a devil as a gift to a vain king. Protection at a price.',
  },
  {
    name: 'Shield of Missile Attraction',
    type: 'shield',
    rarity: 'Rare',
    appearAs: '+2 Shield',
    curse: 'When a ranged attack targets a creature within 10 feet of you, the curse causes you to become the target instead.',
    revealCondition: 'Activates when the first ranged attack occurs near you.',
    removal: 'Remove Curse allows you to unattune. Shield is still +2 but cursed.',
    lore: 'A coward enchanted this shield to protect himself — at others\' expense.',
  },
  {
    name: 'Necklace of Strangulation',
    type: 'wondrous',
    rarity: 'Rare',
    appearAs: 'Necklace of Adaptation',
    curse: 'Once donned, the necklace constricts. You take 6d6 bludgeoning at the start of each turn until the necklace is destroyed (AC 20, 50 HP, immune to poison/psychic) or Remove Curse is cast.',
    revealCondition: 'Curse activates 1d6 rounds after being put on.',
    removal: 'Remove Curse to remove safely. Or destroy the necklace (while taking damage).',
    lore: 'Created by assassins of the Silken Cord guild.',
  },
  {
    name: 'Ring of Clumsiness',
    type: 'ring',
    rarity: 'Uncommon',
    appearAs: 'Ring of Free Action',
    curse: 'Your Dexterity score is reduced to 8. You stumble frequently. Stealth checks auto-fail.',
    revealCondition: 'Effects begin 1 hour after putting on the ring.',
    removal: 'Remove Curse. Ring crumbles to dust when removed.',
    lore: 'A prank item made by a gnome trickster god\'s followers.',
  },
  {
    name: 'Berserker Axe',
    type: 'weapon',
    rarity: 'Rare',
    appearAs: '+1 Battleaxe',
    curse: 'Your HP max increases by 1 per level (real benefit). But whenever you take damage, DC 15 Wisdom save or attack the nearest creature. You can\'t voluntarily end rage.',
    revealCondition: 'Curse activates the first time you\'re damaged in combat.',
    removal: 'Remove Curse breaks attunement.',
    lore: 'A barbarian chieftain\'s weapon that consumed his mind. He killed his own clan.',
  },
];

export const SENTIENT_ITEMS = [
  {
    name: 'Azureflame',
    type: 'Longsword +2',
    alignment: 'Lawful Good',
    intelligence: 14,
    wisdom: 16,
    charisma: 18,
    senses: 'Hearing and darkvision 120 ft.',
    communication: 'Telepathy with wielder. Speaks Common and Celestial.',
    personality: 'Noble, self-righteous, and occasionally condescending. Believes it knows better than the wielder.',
    purpose: 'Protect the innocent and destroy undead.',
    conflict: 'If the wielder allows innocents to be harmed, Azureflame demands they make amends. Repeated failures cause the sword to attempt to dominate the wielder (CHA contest).',
    powers: ['Sheds bright light 30 ft on command', '+1d6 radiant vs undead', 'Can detect undead within 60 ft'],
  },
  {
    name: 'Whisper',
    type: 'Dagger +1',
    alignment: 'Chaotic Neutral',
    intelligence: 18,
    wisdom: 10,
    charisma: 16,
    senses: 'Hearing and darkvision 60 ft.',
    communication: 'Telepathy only. Never speaks aloud.',
    personality: 'Curious, amoral, and constantly asking questions. Treats everything as a learning opportunity, including murder.',
    purpose: 'Gather knowledge and secrets. Every secret is valuable.',
    conflict: 'Whisper insists on knowing everything the wielder knows. If kept in the dark about plans, it sulks and withholds its powers. May share your secrets with others if bored.',
    powers: ['Advantage on Stealth checks', 'Can cast Detect Thoughts 1/day', 'Remembers everything it hears'],
  },
  {
    name: 'Doomhammer',
    type: 'Warhammer +2',
    alignment: 'Neutral Evil',
    intelligence: 12,
    wisdom: 14,
    charisma: 20,
    senses: 'Hearing and darkvision 120 ft.',
    communication: 'Speaks through the wielder\'s mouth when angry. Telepathy otherwise.',
    personality: 'Bloodthirsty, manipulative, and seductive. Promises power and delivers — at a cost. Gets louder in combat.',
    purpose: 'Destroy. Everything. Eventually.',
    conflict: 'If the wielder goes more than 3 days without combat, Doomhammer begins whispering suggestions to provoke fights. Prolonged peace causes CHA contest for control.',
    powers: ['+1d8 thunder damage on crit', 'Thunderclap on hit (1/short rest, DC 14 CON save or deafened)', 'Wielder gains resistance to thunder damage'],
  },
  {
    name: 'Memoriam',
    type: 'Staff +1',
    alignment: 'True Neutral',
    intelligence: 20,
    wisdom: 18,
    charisma: 8,
    senses: 'Truesight 30 ft.',
    communication: 'Telepathy. Communicates in complete, formal sentences.',
    personality: 'Encyclopedic, dry, and socially oblivious. Provides information whether asked or not. Has no sense of humor.',
    purpose: 'Record and preserve all knowledge. The library must grow.',
    conflict: 'Memoriam refuses to allow the destruction of any book, scroll, or written text. Will resist wielders who burn libraries or destroy knowledge.',
    powers: ['Cast Identify at will', 'Cast Comprehend Languages 3/day', 'Advantage on Arcana and History checks'],
  },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateCursedItem() {
  return pick(CURSED_ITEMS);
}

export function generateSentientItem() {
  return pick(SENTIENT_ITEMS);
}

export function getAllCursedItems() {
  return [...CURSED_ITEMS];
}

export function getAllSentientItems() {
  return [...SENTIENT_ITEMS];
}
