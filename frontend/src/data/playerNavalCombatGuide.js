/**
 * playerNavalCombatGuide.js
 * Player Mode: Naval combat, ship rules, and sea encounter tactics
 * Pure JS — no React dependencies.
 */

export const SHIP_BASICS = {
  movement: 'Ships have speed in mph (travel) or feet per round (combat). Crew determines maneuverability.',
  actions: 'On your turn, you can act normally on the ship. Ship actions (helm, weapons) require crew.',
  combat: 'Ship-to-ship combat uses initiative. Ships act on their helmsman\'s initiative.',
  boarding: 'When ships are adjacent, creatures can board with movement. This triggers normal combat.',
};

export const SHIP_TYPES = [
  { ship: 'Rowboat', speed: '1.5 mph', hp: 50, ac: 11, crew: '1-2', cost: '50 gp', note: 'Personal transport. Can carry 2-3 people.' },
  { ship: 'Keelboat', speed: '1 mph (sail)', hp: 100, ac: 15, crew: '1-3', cost: '3,000 gp', note: 'Small sailing vessel. River/coast travel.' },
  { ship: 'Sailing Ship', speed: '2 mph', hp: 300, ac: 15, crew: '20-25', cost: '10,000 gp', note: 'Standard ocean vessel. Can mount weapons.' },
  { ship: 'Galley', speed: '4 mph', hp: 500, ac: 15, crew: '80', cost: '30,000 gp', note: 'Large warship. Multiple weapon mounts.' },
  { ship: 'Warship', speed: '2.5 mph', hp: 500, ac: 15, crew: '60', cost: '25,000 gp', note: 'Military vessel. Heavy armament.' },
  { ship: 'Longship', speed: '3 mph', hp: 300, ac: 15, crew: '40', cost: '10,000 gp', note: 'Viking-style. Fast, shallow draft.' },
];

export const SHIP_WEAPONS = [
  { weapon: 'Ballista', damage: '3d10 piercing', range: '120/480', crew: 3, note: 'Standard ship weapon. Requires action to load + fire.' },
  { weapon: 'Mangonel', damage: '5d10 bludgeoning', range: '200/800 (no short)', crew: 5, note: 'Catapult. Can\'t target within 200ft.' },
  { weapon: 'Cannon', damage: '8d10 bludgeoning', range: '600/2400', crew: 3, note: 'DMG optional. Devastating damage.' },
  { weapon: 'Ram', damage: '2d6 per 5 ship speed', range: 'Contact', crew: 0, note: 'Built into hull. Crash into enemy ship.' },
  { weapon: 'Greek Fire (Alchemist\'s Fire)', damage: '2d6 fire/round', range: '60', crew: 1, note: 'Sets ship on fire. Burns until extinguished.' },
];

export const NAVAL_ROLES = [
  { role: 'Captain', ability: 'CHA', task: 'Give orders. Crew morale. Negotiate with other ships.', bestClass: 'Paladin, Bard' },
  { role: 'Helmsman', ability: 'DEX/WIS', task: 'Steer the ship. Determine initiative. Evasive maneuvers.', bestClass: 'Rogue, Ranger' },
  { role: 'Gunner', ability: 'DEX/INT', task: 'Operate ballista/cannon. Ranged attacks.', bestClass: 'Fighter, Artificer' },
  { role: 'Lookout', ability: 'WIS', task: 'Spot enemies, hazards, land. Perception checks.', bestClass: 'Ranger, Druid' },
  { role: 'Surgeon', ability: 'WIS/INT', task: 'Heal crew. Stabilize wounded. Medicine checks.', bestClass: 'Cleric, Druid' },
  { role: 'Boatswain', ability: 'STR/CON', task: 'Maintain ship. Repair damage. Athletics checks.', bestClass: 'Fighter, Barbarian' },
];

export const NAVAL_SPELLS = [
  { spell: 'Control Water', effect: 'Part water, redirect flow, create whirlpool, flood. Devastating at sea.', rating: 'S+' },
  { spell: 'Call Lightning', effect: 'Repeated lightning strikes from storm clouds. Outdoor = always works at sea.', rating: 'S' },
  { spell: 'Fog Cloud', effect: 'Obscure your ship for escape or ambush.', rating: 'A+' },
  { spell: 'Gust of Wind', effect: 'Fill sails or push enemy ship. Blow enemies overboard.', rating: 'A+' },
  { spell: 'Water Walk', effect: 'Party can walk on water. Boarding without swimming. Ignore falling overboard.', rating: 'S' },
  { spell: 'Water Breathing', effect: '24 hours, 10 creatures. Everyone survives if ship sinks. Ritual castable.', rating: 'S+' },
  { spell: 'Create/Destroy Water', effect: 'Fill enemy ship with water (300 gallons in open container). Or drain yours.', rating: 'A' },
  { spell: 'Wind Wall', effect: 'Block ranged attacks between ships. Protect crew from arrows/bolts.', rating: 'A+' },
  { spell: 'Conjure Animals (dolphins/sharks)', effect: 'Aquatic allies. Dolphins can tow. Sharks attack swimmers.', rating: 'A+' },
  { spell: 'Fireball', effect: 'Set enemy ship on fire. Wooden ships + fire = devastating.', rating: 'S' },
  { spell: 'Fly', effect: 'Board enemy ship from above. Bypass grappling hooks.', rating: 'A+' },
  { spell: 'Misty Step', effect: 'Teleport to enemy ship instantly. Quick boarding.', rating: 'A' },
];

export const NAVAL_COMBAT_TACTICS = [
  'Water Breathing (ritual) should be ALWAYS active at sea. No excuse not to have it.',
  'Control Water creating a whirlpool can trap enemy ships.',
  'Fire is devastating against wooden ships. Fireball, Alchemist\'s Fire, Fire Bolt.',
  'Boarding is usually faster than sinking. Kill the crew, take the ship.',
  'Fog Cloud covers retreat. Enemy can\'t target what they can\'t see.',
  'Fly or Misty Step to enemy ship bypasses the boarding phase entirely.',
  'Grapple the enemy ship (Athletics check) to force boarding combat.',
  'Swimming in armor: heavy = sink. Medium = disadvantage. Light = normal.',
  'Druids can Wild Shape into aquatic forms for underwater advantage.',
  'If the ship is sinking, Mending won\'t help (too slow). Abandon ship.',
];

export const SEA_HAZARDS = [
  { hazard: 'Storm', effect: 'Ship takes damage, crew must make checks. Spells with V components: DC 10 CON to concentrate.', survival: 'Lower sails. Lash down cargo. Crew below deck.' },
  { hazard: 'Reef/Rocks', effect: 'Ship takes 10d10 bludgeoning. Can run aground.', survival: 'Perception check DC 15 to spot. Helmsman DEX check to avoid.' },
  { hazard: 'Whirlpool', effect: 'STR check or pulled in. Ship takes damage per round.', survival: 'Full speed away. Control Water can negate.' },
  { hazard: 'Fog', effect: 'Heavily obscured. Can\'t navigate. Risk of collision.', survival: 'Slow speed. Lookout with Blindsight or Tremorsense.' },
  { hazard: 'Kraken/Sea Monster', effect: 'CR 23 tentacles destroy ships. Legendary creature.', survival: 'Run. Or be very high level. Very, very high level.' },
];
