/**
 * playerRangerSubclassGuide.js
 * Player Mode: Ranger subclass comparison and optimization
 * Pure JS — no React dependencies.
 */

export const RANGER_SUBCLASSES = [
  {
    subclass: 'Gloom Stalker',
    rating: 'S+',
    source: 'XGE',
    keyFeature: 'Dread Ambusher: extra attack + 1d8 damage + WIS to initiative on first round. Invisible to Darkvision.',
    strengths: ['Best first round in the game', 'Invisible to Darkvision in darkness', '+WIS to initiative', 'Umbral Sight: free 60ft/+30ft Darkvision'],
    weaknesses: ['Less impactful after round 1', 'Darkness-dependent for invisibility'],
    playstyle: 'Alpha striker. Dominate round 1. Invisible in darkness. Best ranger and one of best multiclass dips.',
  },
  {
    subclass: 'Swarmkeeper',
    rating: 'A+',
    source: 'TCE',
    keyFeature: 'Gathered Swarm: once per turn on hit, 1d6 damage OR move target 15ft OR move self 5ft (no OA).',
    strengths: ['Forced movement every turn (no save)', 'Combo with Spike Growth (3d4 per 5ft = 9d4 for 15ft push)', 'Free movement option', 'Writhing Tide (L7): 10ft fly'],
    weaknesses: ['Swarm effects are modest individually', 'Less burst than Gloom Stalker'],
    playstyle: 'Control ranger. Push enemies through Spike Growth repeatedly. Fly at L7.',
  },
  {
    subclass: 'Fey Wanderer',
    rating: 'A+',
    source: 'TCE',
    keyFeature: 'Dreadful Strikes: +1d4 psychic per hit (once per target per turn). Add WIS to CHA checks.',
    strengths: ['Extra damage on every hit', 'WIS to CHA checks = great face', 'Beguiling Twist: redirect charm/frighten saves', 'Misty Step on spell list'],
    weaknesses: ['1d4 extra is modest', 'Features spread between combat and social'],
    playstyle: 'Fey-touched ranger. Damage + social skills. Best ranger face.',
  },
  {
    subclass: 'Horizon Walker',
    rating: 'A',
    source: 'XGE',
    keyFeature: 'Planar Warrior: BA convert one attack to force damage + 1d8 extra (2d8 at L11). Detect portals.',
    strengths: ['Force damage (almost never resisted)', 'Ethereal Step at L7 (see through walls, phase)', 'Distant Strike at L11 (teleport 10ft before each attack, 3→4 attacks)'],
    weaknesses: ['BA cost competes with other options', 'Early levels feel slow'],
    playstyle: 'Planar warrior. Force damage, teleportation, ethereal scouting.',
  },
  {
    subclass: 'Hunter',
    rating: 'A',
    source: 'PHB',
    keyFeature: 'Choose features at each subclass level: Colossus Slayer (extra 1d8/turn), Multiattack (Volley/Whirlwind).',
    strengths: ['Colossus Slayer: reliable +1d8 damage', 'Volley at L11: ranged attack every creature in 10ft radius', 'Simple and effective'],
    weaknesses: ['No unique mechanic', 'Outclassed by newer subclasses'],
    bestChoices: ['L3: Colossus Slayer (S)', 'L7: Escape the Horde (A) or Multiattack Defense (A+)', 'L11: Volley (S) for ranged or Whirlwind (A+) for melee'],
    playstyle: 'Classic ranger. Solid damage. Pick your features to match your build.',
  },
  {
    subclass: 'Monster Slayer',
    rating: 'A',
    source: 'XGE',
    keyFeature: 'Slayer\'s Prey: +1d6 damage to one target per turn (BA). Supernatural Defense: +1d6 to saves vs target.',
    strengths: ['Consistent +1d6 damage', '+1d6 to saves against your prey (great vs boss spells)', 'Magic-User\'s Nemesis at L15 (Counterspell-like)'],
    weaknesses: ['BA cost to set up', 'Single-target focused', 'Less impactful in multi-enemy fights'],
    playstyle: 'Boss killer. Mark one enemy, deal extra damage, resist their effects.',
  },
  {
    subclass: 'Beast Master',
    rating: 'B+ (Tasha\'s) / C (PHB)',
    source: 'PHB/TCE',
    keyFeature: 'Animal Companion. Tasha\'s Primal Companions: Beast of Land/Sea/Sky (scales with PB).',
    strengths: ['Tasha\'s beasts are good (BA command, scale with ranger level)', 'Extra body for flanking/tanking', 'Beast of Land: Charge is decent'],
    weaknesses: ['PHB companions are terrible (use your action to command)', 'Companion HP is low', 'If beast dies, need 8 hours to replace'],
    playstyle: 'Pet class. ONLY use Tasha\'s optional companions. PHB version is unplayable.',
  },
  {
    subclass: 'Drake Warden',
    rating: 'A',
    source: 'FTD',
    keyFeature: 'Drakewarden Drake: small dragon companion. Grows to Large (rideable) at L7.',
    strengths: ['Drake is decent combatant', 'Rideable at L7 (fly at L15)', 'Infused Strikes: +1d6 elemental per hit', 'Reflexive Resistance at L15'],
    weaknesses: ['Drake HP is modest', 'BA to command drake', 'Not as strong as Gloom Stalker damage'],
    playstyle: 'Dragon rider. Your drake grows into a mount. Fly at L15.',
  },
];

export const RANGER_GENERAL_TIPS = [
  'ALWAYS use Tasha\'s optional features. They replace PHB\'s terrible Natural Explorer and Favored Enemy.',
  'Tasha\'s Favored Foe: free Hunter\'s Mark-lite (no concentration, 1d4→d6 extra, PB/LR).',
  'Tasha\'s Deft Explorer: Expertise (L1), extra language + speed (L6), 2 resistances (L10).',
  'Best ranger spells: Goodberry (A+), Pass Without Trace (S+), Spike Growth (S), Conjure Animals (S).',
  'Pass Without Trace: +10 to Stealth for entire party. Best utility spell on ranger list.',
  'Rangers are the best archers. Extra Attack + Archery style + spells = consistent ranged damage.',
  'Ranger 5 / Rogue X or Ranger 5 / Fighter X are strong multiclass progressions.',
  'Conjure Animals at L5: 8 wolves = Pack Tactics + 8 attacks. Best summoning spell in the game.',
];
