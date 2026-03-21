/**
 * playerAttunementManagementGuide.js
 * Player Mode: Attunement slots — managing your 3 most important items
 * Pure JS — no React dependencies.
 */

export const ATTUNEMENT_RULES = {
  maxSlots: 3,
  process: 'Short rest spent focusing on the item. Can attune to one new item per SR.',
  endAttunement: 'End attunement voluntarily (no action), or it ends if you die, lose the item, or exceed 3 slots.',
  note: 'Only 3 attunement slots means every slot is precious. Choose wisely.',
};

export const BEST_ATTUNEMENT_ITEMS = {
  universal: [
    { item: 'Cloak of Protection', effect: '+1 AC, +1 all saves', rating: 'S', note: 'Best universal attunement item. Always useful.' },
    { item: 'Ring of Protection', effect: '+1 AC, +1 all saves', rating: 'S', note: 'Stacks with Cloak of Protection (different items).' },
    { item: 'Amulet of Health', effect: 'CON becomes 19', rating: 'S', note: 'HP boost + better CON saves. Best for low-CON characters.' },
    { item: 'Belt of Giant Strength', effect: 'STR 21-29', rating: 'S', note: 'Frees up ASIs. Best for STR builds or grapplers.' },
    { item: 'Winged Boots', effect: 'Fly = walking speed, 4 hrs/day', rating: 'S', note: 'Flight without concentration. Game-changing.' },
  ],
  caster: [
    { item: 'Staff of Power', effect: '+2 AC, +2 saves, +2 spell attacks, many spells', rating: 'S+', note: 'Best caster item. Does everything.' },
    { item: 'Rod of the Pact Keeper', effect: '+1/2/3 spell attacks and DC. Recover 1 slot/LR.', rating: 'S', note: 'Warlock-specific. DC increase is huge.' },
    { item: 'Bloodwell Vial', effect: '+1/2/3 spell attacks and DC. Recover 5 SP/LR.', rating: 'S', note: 'Sorcerer-specific. SP recovery is incredible.' },
    { item: 'Amulet of the Devout', effect: '+1/2/3 spell attacks and DC. Extra Channel Divinity.', rating: 'S', note: 'Cleric/Paladin. Extra CD is powerful.' },
  ],
  martial: [
    { item: '+X Weapon (attunement)', effect: '+1/2/3 attack and damage', rating: 'S', note: 'Some +X weapons require attunement for special properties.' },
    { item: 'Cloak of Displacement', effect: 'Disadvantage on attacks against you until hit', rating: 'S', note: 'Pseudo-permanent disadvantage. Resets if not hit.' },
    { item: 'Animated Shield', effect: '+2 AC, no hand needed', rating: 'A+', note: 'Shield AC with both hands free. GWM + shield AC.' },
    { item: 'Mantle of Spell Resistance', effect: 'Advantage on saves vs spells', rating: 'S', note: 'Incredible defensive item vs casters.' },
  ],
};

export const ATTUNEMENT_SLOT_PRIORITY = {
  slot1: 'Defensive item (Cloak/Ring of Protection, Mantle of Spell Resistance)',
  slot2: 'Offensive item (+X weapon, Rod of the Pact Keeper, Bloodwell Vial)',
  slot3: 'Utility/stat item (Belt of Giant Strength, Amulet of Health, Winged Boots)',
  note: 'Adjust based on your build. Casters may want 2 offensive items. Tanks may want 2 defensive.',
};

export const ATTUNEMENT_TIPS = [
  'You can only attune to ONE copy of an item. Two Rings of Protection = only one works.',
  'Artificers get extra attunement slots at L10 (4), L14 (5), L18 (6). They\'re the exception.',
  'Some powerful items DON\'T require attunement (+X weapons without special properties, Bag of Holding).',
  'Prioritize items that affect EVERY turn (AC, save bonuses) over situational items.',
  'If an item requires attunement and doesn\'t give much, it\'s probably not worth a slot.',
  'Swap attunement during short rests as needed. Anticipate upcoming challenges.',
];

export const ITEMS_THAT_DONT_NEED_ATTUNEMENT = [
  { item: 'Bag of Holding', note: '500 lbs storage. No attunement. Auto-include.' },
  { item: '+X Armor (most)', note: '+1/2/3 AC boost. Usually no attunement.' },
  { item: '+X Weapon (basic)', note: 'Simple +X weapons often don\'t need attunement.' },
  { item: 'Potion of Healing (all)', note: 'Consumable. No attunement ever.' },
  { item: 'Spell Scrolls', note: 'Consumable. No attunement.' },
  { item: 'Immovable Rod', note: 'Incredible utility. No attunement.' },
  { item: 'Rope of Climbing', note: 'Animated 60ft rope. No attunement.' },
];
