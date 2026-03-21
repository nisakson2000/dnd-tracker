/**
 * playerBestFourthLevelSpellsGuide.js
 * Player Mode: Best L4 spells — powerful options at character level 7+
 * Pure JS — no React dependencies.
 */

export const BEST_L4_SPELLS = [
  { spell: 'Polymorph', classes: ['Bard', 'Druid', 'Sorcerer', 'Wizard'], rating: 'S', note: 'Turn ally into Giant Ape (157 HP) or disable enemy. WIS save.' },
  { spell: 'Banishment', classes: ['Cleric', 'Paladin', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'S', note: 'Remove enemy from combat (CHA save). Permanent if extraplanar.' },
  { spell: 'Greater Invisibility', classes: ['Bard', 'Sorcerer', 'Wizard'], rating: 'S', note: 'Invisible while attacking for 1 minute. Advantage + can\'t be targeted.' },
  { spell: 'Wall of Fire', classes: ['Druid', 'Sorcerer', 'Wizard'], rating: 'S', note: 'Splits battlefield. 5d8 fire to crossers. Area denial.' },
  { spell: 'Dimension Door', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A+', note: '500ft teleport + 1 passenger. Emergency escape.' },
  { spell: 'Summon Greater Demon', classes: ['Warlock', 'Wizard'], rating: 'A+', note: 'Powerful summon. Risk: loses control if concentration breaks.' },
  { spell: 'Death Ward', classes: ['Cleric', 'Paladin'], rating: 'A+', note: 'Next time target drops to 0: goes to 1 instead. Pre-combat insurance.' },
  { spell: 'Freedom of Movement', classes: ['Bard', 'Cleric', 'Druid', 'Ranger', 'Artificer'], rating: 'A', note: 'Can\'t be restrained, paralyzed, or movement reduced. No concentration.' },
  { spell: 'Guardian of Nature', classes: ['Druid', 'Ranger'], rating: 'A+', note: 'Great Tree: advantage on CON saves, difficult terrain around you. Primal Beast: advantage on attacks.' },
  { spell: 'Shadow of Moil', classes: ['Warlock'], rating: 'A+', note: 'Heavily obscured. Advantage on attacks. 2d8 necrotic to attackers.' },
  { spell: 'Sickening Radiance', classes: ['Sorcerer', 'Warlock', 'Wizard'], rating: 'A+ (S with Wall of Force)', note: '4d10 radiant + exhaustion. "Microwave" combo with Wall of Force.' },
  { spell: 'Aura of Life', classes: ['Paladin'], rating: 'A', note: 'Resistance to necrotic. Allies at 0 HP in aura regain 1 HP start of turn.' },
  { spell: 'Fire Shield', classes: ['Wizard'], rating: 'A', note: 'Resistance to fire or cold + 2d8 retaliation damage. No concentration.' },
];

export const L4_CLASS_PRIORITIES = {
  wizard: 'Polymorph > Banishment > Greater Invisibility > Wall of Fire > Dimension Door.',
  cleric: 'Death Ward > Banishment > Freedom of Movement > Guardian of Faith.',
  druid: 'Polymorph > Wall of Fire > Guardian of Nature > Conjure Woodland Beings.',
  sorcerer: 'Polymorph > Greater Invisibility > Banishment.',
  warlock: 'Banishment > Shadow of Moil > Dimension Door > Sickening Radiance.',
  bard: 'Polymorph > Greater Invisibility > Dimension Door.',
  paladin: 'Death Ward > Banishment > Aura of Life.',
  ranger: 'Guardian of Nature > Freedom of Movement.',
};

export const L4_TIPS = [
  'Polymorph is the most versatile L4 spell. Offense, defense, utility.',
  'Giant Ape (CR 7) is the go-to Polymorph form. 157 HP, 28 damage/round.',
  'Banishment permanently removes extraplanar creatures (fiends, elementals, fey).',
  'Death Ward is cast PRE-COMBAT. Don\'t wait until someone drops.',
  'Wall of Fire splits encounters. Enemies must take 5d8 to cross.',
  'Sickening Radiance + Wall of Force = guaranteed kill in 6 rounds (exhaustion).',
];
