/**
 * playerConditionImmunityGuide.js
 * Player Mode: How to become immune or resistant to conditions
 * Pure JS — no React dependencies.
 */

export const CONDITION_IMMUNITIES = [
  {
    condition: 'Frightened',
    sources: [
      { source: 'Heroes\' Feast (L6)', type: 'Spell', note: 'Immunity to fear for 24 hours. Cast before boss fights.' },
      { source: 'Berserker Rage (Barbarian)', type: 'Class', note: 'Immune to charm and fear while raging.' },
      { source: 'Aura of Courage (Paladin L10)', type: 'Class', note: 'You and allies within 10ft immune to frightened.' },
      { source: 'Devotion Paladin Channel Divinity', type: 'Subclass', note: 'Immune to charm for 1 minute.' },
      { source: 'Calm Emotions', type: 'Spell', note: 'Suppress frightened condition.' },
    ],
  },
  {
    condition: 'Charmed',
    sources: [
      { source: 'Fey Ancestry (Elf/Half-Elf)', type: 'Racial', note: 'Advantage on saves vs charmed.' },
      { source: 'Berserker Rage', type: 'Class', note: 'Immune while raging.' },
      { source: 'Mind Blank (L8)', type: 'Spell', note: 'Immune to psychic damage and charm/reading for 24 hours.' },
      { source: 'Protection from Evil and Good', type: 'Spell', note: 'Can\'t be charmed by specific creature types.' },
    ],
  },
  {
    condition: 'Poisoned',
    sources: [
      { source: 'Dwarf (Dwarven Resilience)', type: 'Racial', note: 'Advantage on saves + resistance to poison damage.' },
      { source: 'Warforged', type: 'Racial', note: 'Advantage on saves + resistance. Immune to disease.' },
      { source: 'Yuan-ti (legacy)', type: 'Racial', note: 'Full poison immunity.' },
      { source: 'Heroes\' Feast', type: 'Spell', note: 'Poison immunity for 24 hours.' },
      { source: 'Protection from Poison', type: 'Spell', note: 'Advantage on saves. Neutralize one poison. Resistance to poison damage.' },
    ],
  },
  {
    condition: 'Paralyzed',
    sources: [
      { source: 'Freedom of Movement (L4)', type: 'Spell', note: 'Can\'t be paralyzed or restrained. Auto-escape grapple.' },
      { source: 'Monk Stillness of Mind (L7)', type: 'Class', note: 'Action to end charmed/frightened. Not paralyzed directly but helps.' },
    ],
    note: 'Paralysis is one of the most dangerous conditions. Attacks auto-crit within 5ft. Freedom of Movement is key.',
  },
  {
    condition: 'Stunned',
    sources: [
      { source: 'High CON/WIS saves', type: 'Stat', note: 'Most stun effects require CON or WIS saves. Build to resist.' },
      { source: 'Diamond Soul (Monk L14)', type: 'Class', note: 'Proficiency in all saves. Re-roll failed saves with ki.' },
    ],
    note: 'No reliable immunity exists. Best defense: high save bonuses and Counterspell.',
  },
  {
    condition: 'Restrained',
    sources: [
      { source: 'Freedom of Movement', type: 'Spell', note: 'Immune to restrained. Auto-escape grapple.' },
      { source: 'Misty Step/Teleportation', type: 'Spell', note: 'Teleport out of restraints (if you can cast with V only or Subtle Spell).' },
    ],
  },
  {
    condition: 'Prone',
    sources: [
      { source: 'Flight', type: 'Various', note: 'Flying creatures can\'t be knocked prone (they fall instead). Hovering creatures are immune.' },
      { source: 'Freedom of Movement', type: 'Spell', note: 'Doesn\'t prevent prone but prevents restrained (which often accompanies prone).' },
    ],
  },
];

export const UNIVERSAL_CONDITION_DEFENSE = [
  { defense: 'Paladin Aura of Protection', effect: '+CHA to all saves for allies within 10ft', note: 'Best party-wide save booster.' },
  { defense: 'Bless spell', effect: '+1d4 to saves', note: 'Stacks with everything.' },
  { defense: 'Magic Resistance (Yuan-ti/Satyr)', effect: 'Advantage on saves vs magic', note: 'Most conditions come from magical sources.' },
  { defense: 'Monk Diamond Soul (L14)', effect: 'Proficiency in all saves + ki reroll', note: 'Ultimate save character.' },
  { defense: 'Gnome Cunning', effect: 'Advantage on INT/WIS/CHA saves vs magic', note: '3/6 saves with advantage.' },
];

export function saveBonus(abilityMod, profBonus, hasProficiency, auraBonus = 0) {
  return abilityMod + (hasProficiency ? profBonus : 0) + auraBonus;
}
