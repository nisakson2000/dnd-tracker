/**
 * playerAttunementSlotGuide.js
 * Player Mode: Attunement rules, slot management, and priority
 * Pure JS — no React dependencies.
 */

export const ATTUNEMENT_RULES = {
  limit: '3 items (default). Artificer: 4/5/6.',
  process: 'Short rest focusing on item.',
  ending: 'Voluntary, death, 100ft+ away for 24hr, or prereqs unmet.',
  note: 'Best items require attunement. Choose wisely.',
};

export const TOP_ATTUNEMENT_ITEMS = [
  { item: 'Cloak of Protection', effect: '+1 AC, +1 saves', rating: 'S+' },
  { item: 'Ring of Protection', effect: '+1 AC, +1 saves', rating: 'S+' },
  { item: 'Belt of Giant Strength', effect: 'STR 21-29', rating: 'S+' },
  { item: 'Amulet of Health', effect: 'CON 19', rating: 'S' },
  { item: 'Winged Boots', effect: 'Fly speed = walk. 4hr/day.', rating: 'S' },
  { item: 'Staff of Power', effect: '+2 AC/saves/attacks + spells.', rating: 'S+' },
  { item: 'Bracers of Defense', effect: '+2 AC (no armor)', rating: 'S (Monks/casters)' },
  { item: 'Rod of the Pact Keeper', effect: '+1-3 spell DC + free slot.', rating: 'S+ (Warlock)' },
];

export const NO_ATTUNEMENT_ESSENTIALS = [
  'Bag of Holding (500 lb storage)',
  '+1/+2/+3 Weapons and Armor',
  'Potions of Healing',
  'Immovable Rod',
  'Decanter of Endless Water',
];

export const ATTUNEMENT_TIPS = [
  'Cloak + Ring of Protection: +2 AC and +2 saves for 2 slots. Often worth it.',
  'Basic +1/+2/+3 weapons and armor DON\'T need attunement.',
  'Artificer gets extra slots. Best magic item user.',
  'Cursed items: can\'t voluntarily unattune. Need Remove Curse.',
  'Winged Boots: flight without concentration. Worth a slot on anyone.',
];
