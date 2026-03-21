/**
 * playerInventoryEssentialsGuide.js
 * Player Mode: Essential inventory items every adventurer should carry
 * Pure JS — no React dependencies.
 */

export const MUST_CARRY_ITEMS = [
  { item: 'Rope (50ft, Hempen)', cost: '1 gp', weight: '10 lbs', why: 'Climbing, tying, pulling, bridge-making. Universal utility.', rating: 'S' },
  { item: 'Healer\'s Kit', cost: '5 gp', weight: '3 lbs', why: '10 uses. Stabilize without Medicine check. Essential.', rating: 'S' },
  { item: 'Pitons (10)', cost: '5 cp each', weight: '1/4 lb each', why: 'Climbing anchors. Jam doors. Mark paths.', rating: 'A+' },
  { item: 'Torch (10)', cost: '1 cp each', weight: '1 lb each', why: 'Light for non-darkvision. Emergency fire source.', rating: 'A' },
  { item: 'Rations (10 days)', cost: '5 sp/day', weight: '2 lbs/day', why: 'Food. Wilderness survival. Don\'t starve.', rating: 'A' },
  { item: 'Waterskin', cost: '2 sp', weight: '5 lbs full', why: 'Water. Desert/dungeon survival.', rating: 'A' },
  { item: 'Crowbar', cost: '2 gp', weight: '5 lbs', why: 'Advantage on STR checks to pry things. Doors, chests.', rating: 'A+' },
  { item: 'Grappling Hook', cost: '2 gp', weight: '4 lbs', why: 'Attach rope to high places. Climb buildings/walls.', rating: 'A' },
  { item: 'Tinderbox', cost: '5 sp', weight: '1 lb', why: 'Light fires. Light torches. Start campfires.', rating: 'A' },
  { item: 'Bedroll', cost: '1 gp', weight: '7 lbs', why: 'Comfortable rest. Avoid exhaustion in cold.', rating: 'B+' },
];

export const COMBAT_UTILITY_ITEMS = [
  { item: 'Ball Bearings (bag of 1000)', cost: '1 gp', weight: '2 lbs', why: 'Cover 10ft square. DEX save or fall prone. Area denial.', rating: 'S' },
  { item: 'Caltrops (bag of 20)', cost: '1 gp', weight: '2 lbs', why: 'Cover 5ft square. 1 piercing + speed reduced by 10ft.', rating: 'A+' },
  { item: 'Oil Flask', cost: '1 sp', weight: '1 lb', why: 'Throw + ignite: 5 fire damage/round for 2 rounds. 5ft area.', rating: 'A' },
  { item: 'Acid Vial', cost: '25 gp', weight: '1 lb', why: 'Ranged attack: 2d6 acid. Dissolve locks/chains.', rating: 'A' },
  { item: 'Alchemist\'s Fire', cost: '50 gp', weight: '1 lb', why: 'Ranged attack: 1d4 fire/round. Ignites. Target must use action to extinguish.', rating: 'A' },
  { item: 'Holy Water', cost: '25 gp', weight: '1 lb', why: 'Ranged attack: 2d6 radiant vs fiends/undead. Bypass resistance.', rating: 'A' },
  { item: 'Net', cost: '1 gp', weight: '3 lbs', why: 'Restrained on hit (Large or smaller). AC 10, 5 HP to break.', rating: 'B+' },
  { item: 'Hunting Trap', cost: '5 gp', weight: '25 lbs', why: 'Set trap: 1d4 piercing + restrained. DC 13 STR to escape.', rating: 'B' },
  { item: 'Manacles', cost: '2 gp', weight: '6 lbs', why: 'Restrain prisoners. DC 20 STR or DC 15 DEX to escape.', rating: 'B+' },
];

export const EXPLORATION_TOOLS = [
  { item: 'Ten-foot Pole', cost: '5 cp', weight: '7 lbs', why: 'Poke ahead for traps. Test floors. Classic.', rating: 'A+' },
  { item: 'Mirror (Steel)', cost: '5 gp', weight: '1/2 lb', why: 'Look around corners. Check for basilisk/medusa.', rating: 'A' },
  { item: 'Chalk (10 pieces)', cost: '1 cp each', weight: '-', why: 'Mark paths in dungeons. Write messages. Track routes.', rating: 'A' },
  { item: 'Block and Tackle', cost: '1 gp', weight: '5 lbs', why: 'Lift heavy objects. Advantage on STR checks to lift.', rating: 'B+' },
  { item: 'Spyglass', cost: '1000 gp', weight: '1 lb', why: 'See distant objects as if 10× closer. Scouting.', rating: 'B+' },
  { item: 'Bell', cost: '1 gp', weight: '-', why: 'Attach to door/rope for alarm. Cheap alarm system.', rating: 'B' },
  { item: 'Soap', cost: '2 cp', weight: '-', why: 'Make surfaces slippery. Clean up blood evidence.', rating: 'B' },
  { item: 'Hammer + Nails', cost: '1 gp', weight: '3 lbs', why: 'Board up doors. Build things. Practical.', rating: 'B' },
];

export const PARTY_UTILITY_DISTRIBUTION = {
  tank: ['Healer\'s Kit', 'Manacles', 'Crowbar', 'Rope'],
  caster: ['Component pouch', 'Spell focus', 'Ink + paper', 'Chalk'],
  rogue: ['Thieves\' tools', 'Caltrops', 'Ball bearings', 'Mirror', 'Crowbar'],
  ranger: ['Rope', 'Grappling hook', 'Rations', 'Hunting trap', 'Healer\'s kit'],
  everyone: ['Waterskin', 'Rations', 'Bedroll', 'Torches or Light cantrip'],
};

export const INVENTORY_TIPS = [
  'Ball bearings: 1 gp for prone-causing area denial. Best cheap item.',
  'Healer\'s Kit: auto-stabilize without a check. 5 gp. Carry one.',
  'Crowbar: advantage on STR checks to pry. Opens stuck doors.',
  'Rope: 50ft hempen rope. Universal utility. Every party needs it.',
  'Holy Water: 2d6 radiant vs undead/fiends. Bypasses resistance.',
  'Oil Flask + Fire: 5 damage/round for 2 rounds. Cheap extra damage.',
  '10-foot pole: poke ahead for traps. Classic dungeon crawling tool.',
  'Mirror: look around corners without exposing yourself.',
  'Chalk: mark paths in dungeons. Never get lost.',
  'Buy a Bag of Holding ASAP. Carry everything without encumbrance.',
];
