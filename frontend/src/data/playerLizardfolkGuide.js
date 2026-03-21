/**
 * playerLizardfolkGuide.js
 * Player Mode: Lizardfolk race guide — the pragmatic survivor
 * Pure JS — no React dependencies.
 */

export const LIZARDFOLK_BASICS = {
  race: 'Lizardfolk',
  source: 'Volo\'s Guide to Monsters / MotM',
  size: 'Medium',
  speed: '30ft, swim 30ft',
  asi: '+2 CON, +1 WIS (Volo\'s) or flexible (MotM)',
  theme: 'Cold, pragmatic reptilian. Craft weapons from kills. Bite attacks. Natural armor.',
  note: 'Surprisingly versatile. Natural Armor (13+DEX), swim speed, bonus action temp HP, and bite attacks.',
};

export const LIZARDFOLK_TRAITS = [
  { trait: 'Natural Armor', effect: 'AC = 13 + DEX modifier (no armor). Can use shield.', note: '13+DEX = Mage Armor for free. With 16 DEX: 16 AC. With shield: 18 AC. Great for classes without armor.' },
  { trait: 'Hungry Jaws', effect: 'Bonus action: bite attack (1d6+STR piercing). On hit, gain temp HP = PB. PB times per long rest.', note: 'Free bonus action bite + temp HP. Extra attack that also heals. Great sustain.' },
  { trait: 'Bite', effect: 'Unarmed strike: 1d6+STR piercing.', note: '1d6 unarmed. Decent natural weapon.' },
  { trait: 'Cunning Artisan', effect: 'During short rest, craft: shield, club, javelin, 1d4 darts/blowgun needles from a corpse.', note: 'Free equipment from kills. Flavor-rich. Practical in survival campaigns.' },
  { trait: 'Hold Breath', effect: 'Hold breath for 15 minutes.', note: 'Good for underwater exploration.' },
  { trait: 'Nature\'s Intuition (MotM)', effect: 'Proficiency in two skills: Animal Handling, Medicine, Nature, Perception, Stealth, or Survival.', note: 'Two free skills. Perception and Stealth are the best picks.' },
  { trait: 'Swim Speed', effect: '30ft swim speed.', note: 'Matches walking speed. Always useful near water.' },
];

export const LIZARDFOLK_BUILDS = [
  { build: 'Lizardfolk Druid', detail: '+2 CON +1 WIS. Natural Armor 13+DEX (better than leather). No metal armor restriction doesn\'t matter. Swim speed for Wild Shape forms.', rating: 'S' },
  { build: 'Lizardfolk Barbarian', detail: '+2 CON. Hungry Jaws while raging (bonus action bite + temp HP). Natural Armor 13+DEX vs Unarmored Defense 10+DEX+CON.', rating: 'A', note: 'Unarmored Defense is usually better at high levels, but Hungry Jaws is great.' },
  { build: 'Lizardfolk Monk', detail: 'Natural Armor 13+DEX vs Unarmored Defense 10+DEX+WIS. Bite is a natural weapon (works with Martial Arts).', rating: 'B' },
  { build: 'Lizardfolk Ranger', detail: '+2 CON +1 WIS. Swim speed. Nature skills. Hungry Jaws for bonus action when not casting. Survival expert.', rating: 'A' },
  { build: 'Lizardfolk Fighter', detail: '+2 CON. Hungry Jaws for bonus action temp HP. Natural Armor isn\'t relevant (you\'ll wear actual armor). Bite as backup.', rating: 'B' },
];

export const HUNGRY_JAWS_ANALYSIS = {
  tempHPPerUse: 'Equal to proficiency bonus (2-6)',
  usesPerDay: 'Equal to proficiency bonus (2-6)',
  totalTempHP: 'PB × PB per long rest (4-36 temp HP total)',
  note: 'At L5 (PB 3): 3 uses × 3 temp HP = 9 free HP per day. At L17 (PB 6): 6 × 6 = 36 free HP. Plus it\'s an attack.',
  comparison: 'Like a free Second Wind that also deals damage.',
};

export function lizardfolkAC(dexMod, hasShield) {
  return 13 + dexMod + (hasShield ? 2 : 0);
}

export function hungryJawsTempHP(proficiencyBonus) {
  return proficiencyBonus;
}

export function hungryJawsTotalPerDay(proficiencyBonus) {
  return proficiencyBonus * proficiencyBonus; // PB uses × PB temp HP each
}
