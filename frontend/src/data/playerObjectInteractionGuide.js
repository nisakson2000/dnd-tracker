/**
 * playerObjectInteractionGuide.js
 * Player Mode: Free object interaction rules and optimization
 * Pure JS — no React dependencies.
 */

export const OBJECT_INTERACTION_BASICS = {
  freeInteraction: 'You get ONE free object interaction per turn. Examples: draw/sheathe weapon, open door, pick up item.',
  additionalUse: 'A second interaction in the same turn requires your ACTION.',
  notAnAction: 'Free interaction does NOT cost your action, bonus action, or reaction.',
  commonExamples: [
    'Draw or sheathe a weapon',
    'Open or close a door',
    'Pick up a dropped item',
    'Hand an item to another character',
    'Pull a lever or flip a switch',
    'Remove a ring',
    'Open a container (like a chest)',
    'Grab a torch from a sconce',
    'Turn a key in a lock',
    'Stow one item and draw another (DM may rule as two interactions)',
  ],
};

export const OBJECT_INTERACTION_EDGE_CASES = [
  { scenario: 'Drawing and throwing multiple weapons', rule: 'Draw 1 weapon (free interaction). Throw it. Can\'t draw another without action/bonus action or feat.', solution: 'Dual Wielder feat: draw 2 weapons at once. Or use a returning weapon.' },
  { scenario: 'Switching between melee and ranged', rule: 'Sheathe sword (free) → draw bow (need action). Or: drop sword (free, not sheathe) → draw bow (free).', solution: 'DROP weapons instead of sheathing. Dropping is free. Draw new weapon as free interaction.' },
  { scenario: 'Using a potion', rule: 'RAW: Use an Object action. Takes your full action. Many DMs house-rule it as bonus action.', solution: 'Ask your DM before the campaign starts. Thief Rogue: Fast Hands lets you use objects as bonus action.' },
  { scenario: 'Loading a crossbow', rule: 'Loading property: load as part of the attack. Free. But can only fire once per turn unless Crossbow Expert.', solution: 'Crossbow Expert feat removes loading restriction.' },
  { scenario: 'Retrieving component pouch items', rule: 'Accessing component pouch or focus is part of the spellcasting. Free.', solution: 'No issue unless your hands are holding weapons AND you need somatic components. War Caster helps.' },
];

export const THIEF_FAST_HANDS = {
  class: 'Rogue (Thief)',
  feature: 'Fast Hands (L3): Use Cunning Action bonus action to Use an Object, make Sleight of Hand check, or use Thieves\' Tools.',
  applications: [
    'Use potion as bonus action (RAW: potions are Use an Object)',
    'Throw caltrops, ball bearings, alchemist\'s fire as bonus action',
    'Use Healer\'s Kit as bonus action (with Healer feat: heal as bonus action)',
    'Throw acid vial, holy water, oil flask as bonus action',
    'Activate magic items that use Use an Object (DM ruling varies)',
  ],
  note: 'Thief with Healer feat: bonus action heal 1d6+4+target level HP. Budget healer without magic.',
};

export const COMMON_ITEMS_IN_COMBAT = [
  { item: 'Alchemist\'s Fire', action: 'Action (Use Object)', effect: '1d4 fire/turn until DC 10 DEX save as action. 50gp.', note: 'Persistent damage. Good at low levels.' },
  { item: 'Acid Vial', action: 'Action (ranged attack)', effect: '2d6 acid damage. 25gp.', note: 'Improvised ranged attack. Decent burst.' },
  { item: 'Ball Bearings', action: 'Action (Use Object)', effect: '10ft area: DEX save DC 10 or prone. 1gp.', note: 'Cheap crowd control. Prone = advantage for melee.' },
  { item: 'Caltrops', action: 'Action (Use Object)', effect: '5ft area: DEX save DC 15 or 1 piercing + speed reduced by 10ft. 1gp.', note: 'Decent area denial. 10ft speed reduction is meaningful.' },
  { item: 'Oil Flask', action: 'Action (ranged attack or pour)', effect: 'Douse 5ft area. If ignited: 5 fire damage for 2 rounds. 1sp.', note: 'Pour on enemy → ally ignites with fire spell. Extra fire damage.' },
  { item: 'Holy Water', action: 'Action (ranged attack)', effect: '2d6 radiant to fiends/undead. 25gp.', note: 'Solid damage vs undead at low levels. Improvised weapon attack.' },
  { item: 'Net', action: 'Action (attack)', effect: 'Restrained (AC 10, 5 HP, DC 10 STR/slashing). Disadvantage on attack (ranged within 5ft range).', note: 'Restrained is powerful. But only 5/15ft range = always disadvantage. Crossbow Expert removes.' },
  { item: 'Healer\'s Kit', action: 'Action (Use Object)', effect: 'Stabilize dying creature (no Medicine check). 10 uses. 5gp.', note: 'Guaranteed stabilization. No check needed. Essential for non-healers.' },
];

export function canDrawAndAttack(hasFreeInteraction) {
  return hasFreeInteraction; // one free interaction per turn
}
