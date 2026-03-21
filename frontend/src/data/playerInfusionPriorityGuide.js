/**
 * playerInfusionPriorityGuide.js
 * Player Mode: Artificer Infusions ranked — best picks at each level
 * Pure JS — no React dependencies.
 */

export const INFUSION_RULES = {
  known: 'Know 4 infusions at L2, up to 12 at L18.',
  active: 'Can have 2 active at L2, up to 6 at L18.',
  rules: 'Can\'t infuse the same item twice. Each infusion on a separate item. Replaces existing magic properties.',
  note: 'Infusions = FREE magic items for your party. Incredibly versatile.',
};

export const INFUSIONS_RANKED = [
  { name: 'Enhanced Weapon', level: 2, effect: '+1 weapon (L10: +2)', rating: 'S+', note: 'Best early infusion. +1 weapon for the Fighter.' },
  { name: 'Enhanced Arcane Focus', level: 2, effect: '+1 to spell attacks (L10: +2)', rating: 'S+', note: 'Best caster infusion. Give to Warlock/Wizard.' },
  { name: 'Enhanced Defense', level: 2, effect: '+1 AC armor/shield (L10: +2)', rating: 'S', note: '+1 AC on the tank\'s shield or armor. Always useful.' },
  { name: 'Mind Sharpener', level: 2, effect: 'Auto-succeed concentration save (4 charges/LR)', rating: 'S+', note: 'Give to the concentrating caster. 4 free concentration saves. Incredible.' },
  { name: 'Bag of Holding', level: 2, effect: '500 lb storage', rating: 'A+', note: 'Essential utility. Every party needs one.' },
  { name: 'Homunculus Servant', level: 2, effect: 'Tiny construct companion. BA to command: 1d4+PB force ranged attack.', rating: 'A+', note: 'BA attack every round + scouting. Like a familiar that attacks.' },
  { name: 'Returning Weapon', level: 2, effect: '+1 thrown weapon that returns after each throw.', rating: 'A', note: 'Thrown weapon builds. +1 javelin that comes back.' },
  { name: 'Replicate Magic Item', level: 2, effect: 'Create a specific magic item from a list.', rating: 'Varies', note: 'Depends on which item. Winged Boots (L10), Cloak of Protection, etc.' },
  { name: 'Spell-Refueling Ring', level: 6, effect: 'Recover 1 spell slot up to L3, 1/day.', rating: 'S', note: 'Free Pearl of Power. Give to any caster.' },
  { name: 'Radiant Weapon', level: 6, effect: '+1 weapon + 4 charges of Faerie Fire (BA, action).', rating: 'A+', note: 'Free +1 weapon + AoE advantage granting.' },
  { name: 'Helm of Awareness', level: 10, effect: 'Advantage on initiative. Can\'t be surprised.', rating: 'S', note: 'Weapon of Warning as a helm. Give to the controller caster.' },
  { name: 'Winged Boots (Replicate)', level: 10, effect: 'Fly speed = walk speed. 4 hr/day.', rating: 'S', note: 'Flight without concentration. Game-changing.' },
  { name: 'Cloak of Protection (Replicate)', level: 2, effect: '+1 AC and saves.', rating: 'S', note: '+1 to ALL saves. One of the best items period.' },
  { name: 'Boots of Elvenkind (Replicate)', level: 2, effect: 'Advantage on Stealth (sound).', rating: 'A', note: 'For the sneaky party member.' },
  { name: 'Goggles of Night (Replicate)', level: 2, effect: 'Darkvision 60ft.', rating: 'A', note: 'For the Human or other non-darkvision race.' },
];

export const INFUSION_PRIORITY_BY_LEVEL = [
  { level: '2-5', picks: ['Enhanced Weapon (for martial)', 'Mind Sharpener (for caster)', 'Bag of Holding', 'Homunculus Servant'], note: '+1 weapon + concentration protection = best start.' },
  { level: '6-9', picks: ['Spell-Refueling Ring', 'Radiant Weapon', 'Enhanced Defense'], note: 'Free spell slot recovery. Upgrade to radiant weapon.' },
  { level: '10-14', picks: ['Helm of Awareness', 'Winged Boots', '+2 Enhanced weapons/defense'], note: 'Flight and initiative advantage. Upgrade to +2.' },
  { level: '15+', picks: ['Best replicate items', 'All +2 gear', 'Situational picks'], note: 'By now you have 5-6 active infusions. Cover all party needs.' },
];

export const INFUSION_TIPS = [
  'Infusions = free magic items. Artificer is the best party support class.',
  'Mind Sharpener on the Spirit Guardians Cleric or Haste Sorcerer. Game-changing.',
  'Enhanced Weapon for the party\'s main damage dealer. +1 to hit and damage.',
  'Bag of Holding: craft it day 1. Essential utility.',
  'Homunculus Servant: BA ranged attack + scouting. Like a combat familiar.',
  'Spell-Refueling Ring at L6: free Pearl of Power for any caster.',
  'Replicate Magic Item opens up Cloak/Ring of Protection, Winged Boots, etc.',
  'Infusions break when you die or choose to end them. Communicate with party.',
  'At L10: Helm of Awareness (advantage initiative) to the controller Wizard.',
  'Artificer infuses items for the PARTY. Think about team needs, not just yourself.',
];
