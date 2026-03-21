/**
 * playerFeyTouchedGuide.js
 * Player Mode: Fey Touched feat — the best half-feat
 * Pure JS — no React dependencies.
 */

export const FEY_TOUCHED_BASICS = {
  feat: 'Fey Touched',
  source: 'Tasha\'s Cauldron of Everything',
  asi: '+1 to INT, WIS, or CHA',
  spells: ['Misty Step (always)', 'One L1 divination or enchantment spell of your choice'],
  uses: 'Each spell 1/LR free, or using spell slots.',
  note: 'Best half-feat in the game. +1 to a key stat + free Misty Step + free L1 spell. Every caster should consider this.',
};

export const BEST_L1_SPELL_CHOICES = [
  { spell: 'Bless', school: 'Enchantment', rating: 'S', note: '+1d4 to attacks and saves for 3 creatures. Best buff spell in the game. Non-Cleric classes love getting this.' },
  { spell: 'Gift of Alacrity', school: 'Divination (Dunamancy)', rating: 'S', note: '+1d8 to initiative for 8 hours. No concentration. If your DM allows Dunamancy, this is the pick.' },
  { spell: 'Hex', school: 'Enchantment', rating: 'A', note: '+1d6 per hit + disadvantage on one ability check type. Good for Warlocks who want it free, others for extra damage.' },
  { spell: 'Hunter\'s Mark', school: 'Divination', rating: 'A', note: '+1d6 per hit. Good for martials who want extra damage without multiclassing Ranger.' },
  { spell: 'Command', school: 'Enchantment', rating: 'A', note: 'Versatile control spell. "Flee," "Grovel," "Drop." No concentration.' },
  { spell: 'Dissonant Whispers', school: 'Enchantment', rating: 'A', note: '3d6 psychic + forced movement (provokes OAs). Good damage + control.' },
  { spell: 'Silvery Barbs', school: 'Enchantment', rating: 'S', note: 'If allowed. Force reroll + grant advantage. The most powerful L1 spell.' },
  { spell: 'Heroism', school: 'Enchantment', rating: 'B', note: 'Temp HP per turn. Good for frontliners without access to it.' },
];

export const FEY_TOUCHED_BY_CLASS = [
  { class: 'Wizard', stat: 'INT +1', bestSpell: 'Gift of Alacrity or Bless', note: 'INT to 18 with standard array + CL. Free Misty Step saves a spell known slot.', rating: 'S' },
  { class: 'Cleric', stat: 'WIS +1', bestSpell: 'Gift of Alacrity or Hex', note: 'WIS +1. Already has Bless. Gift of Alacrity for initiative or Hex for Spirit Guardians + Hex combo.', rating: 'A' },
  { class: 'Sorcerer', stat: 'CHA +1', bestSpell: 'Bless or Gift of Alacrity', note: 'CHA +1. Sorcerers have limited spells known — free spells are invaluable.', rating: 'S' },
  { class: 'Warlock', stat: 'CHA +1', bestSpell: 'Bless', note: 'CHA +1. Bless on short rest class. Misty Step without using a Pact slot.', rating: 'A' },
  { class: 'Paladin', stat: 'CHA +1', bestSpell: 'Gift of Alacrity', note: 'CHA +1 for aura. Free Misty Step for mobility. Gift of Alacrity for initiative.', rating: 'A' },
  { class: 'Fighter (Eldritch Knight)', stat: 'INT +1', bestSpell: 'Bless', note: 'INT +1 for spell DC. Bless for party support. Misty Step for mobility.', rating: 'A' },
  { class: 'Rogue', stat: 'CHA or INT +1', bestSpell: 'Bless or Gift of Alacrity', note: 'Free Misty Step for escape. Bless for party buff. Initiative for Assassin.', rating: 'A' },
];

export function feyTouchedValue(statIncrease = 1, mistyStepSlotsSaved = 1) {
  return { statBoost: statIncrease, freeSpells: 2, slotsSaved: mistyStepSlotsSaved + 1, note: '+1 stat + 2 free spell casts per day. Incredible feat efficiency.' };
}
