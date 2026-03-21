/**
 * playerSpellRitualList.js
 * Player Mode: Ritual spells reference and best ritual picks
 * Pure JS — no React dependencies.
 */

export const RITUAL_SPELLS = [
  { spell: 'Alarm', level: 1, classes: ['Ranger', 'Wizard'], effect: 'Ward a 20ft cube. Mental or audible alert when entered.', useCase: 'Rest defense. Set before sleeping.' },
  { spell: 'Detect Magic', level: 1, classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Wizard'], effect: 'Sense magic within 30ft. See school of magic on auras.', useCase: 'Loot scanning. Trap detection. Identifying magic items.' },
  { spell: 'Detect Poison and Disease', level: 1, classes: ['Cleric', 'Druid', 'Paladin', 'Ranger'], effect: 'Sense poisons, diseases, and poisonous creatures within 30ft.', useCase: 'Food/water safety. Dungeon exploration.' },
  { spell: 'Find Familiar', level: 1, classes: ['Wizard'], effect: 'Summon a spirit companion in beast form.', useCase: 'Scouting, Help action, touch spell delivery.' },
  { spell: 'Identify', level: 1, classes: ['Bard', 'Wizard'], effect: 'Learn all magical properties of an item.', useCase: 'Item identification. Alternative: short rest study.' },
  { spell: 'Purify Food and Drink', level: 1, classes: ['Cleric', 'Druid', 'Paladin'], effect: 'Remove poison and disease from food/water within 5ft.', useCase: 'Wilderness survival. Poisoned food rescue.' },
  { spell: 'Speak with Animals', level: 1, classes: ['Bard', 'Druid', 'Ranger'], effect: 'Communicate with beasts for 10 minutes.', useCase: 'Information gathering. Befriend animal guards.' },
  { spell: 'Augury', level: 2, classes: ['Cleric'], effect: 'Receive an omen about a planned action: weal, woe, both, or neither.', useCase: 'Decision making. "Should we open this door?"' },
  { spell: 'Beast Sense', level: 2, classes: ['Druid', 'Ranger'], effect: 'See/hear through a beast\'s senses.', useCase: 'Long-range scouting via birds/wolves.' },
  { spell: 'Gentle Repose', level: 2, classes: ['Cleric', 'Wizard'], effect: 'Preserve a corpse. Extends resurrection window.', useCase: 'Keep a fallen ally fresh until you can cast Revivify/Raise Dead.' },
  { spell: 'Silence', level: 2, classes: ['Bard', 'Cleric', 'Ranger'], effect: '20ft sphere of silence. No sound in or out.', useCase: 'Stealth operations. Anti-spellcaster zone.' },
  { spell: 'Water Breathing', level: 3, classes: ['Druid', 'Ranger', 'Sorcerer', 'Wizard'], effect: 'Up to 10 creatures breathe underwater for 24 hours.', useCase: 'Underwater exploration. No concentration.' },
  { spell: 'Leomund\'s Tiny Hut', level: 3, classes: ['Bard', 'Wizard'], effect: 'Impenetrable dome, 10ft radius, 8 hours.', useCase: 'Best rest defense in the game. Safe long rests anywhere.' },
  { spell: 'Phantom Steed', level: 3, classes: ['Wizard'], effect: 'Create a spectral horse. Speed 100ft. Lasts 1 hour.', useCase: 'Fast overland travel. 10× walking speed.' },
  { spell: 'Commune', level: 5, classes: ['Cleric'], effect: 'Ask your deity 3 yes/no questions.', useCase: 'Critical intel. "Is the artifact behind this door?"' },
  { spell: 'Contact Other Plane', level: 5, classes: ['Warlock', 'Wizard'], effect: 'Ask 5 questions to an extraplanar entity. DC 15 INT save or go insane.', useCase: 'Risky but powerful information gathering.' },
  { spell: 'Rary\'s Telepathic Bond', level: 5, classes: ['Wizard'], effect: 'Telepathic communication for 8 creatures. 1 hour.', useCase: 'Silent party coordination. Stealth missions.' },
];

export const RITUAL_CASTING_RULES = {
  time: '+10 minutes to normal casting time.',
  slot: 'Does NOT expend a spell slot.',
  preparation: 'Wizards can ritual cast any ritual spell in their spellbook (even if not prepared).',
  other: 'Other ritual casters must have the spell prepared (or known).',
  concentration: 'Ritual spells that require concentration still require it.',
  feat: 'Ritual Caster feat: learn ritual spells from one class\'s list.',
};

export function getRitualSpellsForClass(className) {
  return RITUAL_SPELLS.filter(s =>
    s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

export function getTopRituals() {
  return RITUAL_SPELLS.filter(s =>
    ['Detect Magic', 'Find Familiar', 'Leomund\'s Tiny Hut', 'Water Breathing', 'Alarm'].includes(s.spell)
  );
}
