/**
 * playerRangerOptGuide.js
 * Player Mode: Ranger optimization — favored enemy, terrain, Tasha's fixes
 * Pure JS — no React dependencies.
 */

export const RANGER_CORE_FIXES = {
  problem: 'PHB Ranger has weak exploration features that rarely trigger.',
  solution: 'Tasha\'s Cauldron optional features replace the weak ones.',
  key: 'Always use Tasha\'s optional features. They fix the class.',
  note: 'Most DMs allow Tasha\'s. Ask at Session 0.',
};

export const TASHAS_REPLACEMENTS = [
  { original: 'Favored Enemy', replacement: 'Favored Foe', effect: '1d4-1d8 extra damage (no concentration at later levels). Scales.', rating: 'A+', note: 'Much better than situational knowledge bonuses.' },
  { original: 'Natural Explorer', replacement: 'Deft Explorer', effect: 'L1: Expertise in one skill. L6: +5 speed, climb/swim speed. L10: Tireless (temp HP).', rating: 'S', note: 'Always useful. No terrain dependency.' },
  { original: 'Hide in Plain Sight', replacement: 'Nature\'s Veil', effect: 'BA to become invisible until start of next turn. PB uses/LR.', rating: 'S', note: 'Invisible as a bonus action. Incredible.' },
  { original: 'Primeval Awareness', replacement: 'Primal Awareness', effect: 'Free castings of speak with animals, beast sense, speak with plants, etc.', rating: 'A', note: 'Free spells > spending a slot to sense creature types.' },
];

export const SUBCLASS_RANKINGS = [
  { subclass: 'Gloom Stalker', rating: 'S+', why: 'Invisible in darkness, extra attack R1, WIS to initiative, extra damage.', bestFor: 'Damage, ambush, multiclass dips.', note: 'Best Ranger subclass. Amazing 3-level dip.' },
  { subclass: 'Swarmkeeper', rating: 'A+', why: 'Forced movement, extra damage, flight at L7. Versatile.', bestFor: 'Battlefield control + damage.', note: 'Underrated. Forced movement is powerful.' },
  { subclass: 'Fey Wanderer', rating: 'A+', why: 'WIS to CHA checks, psychic damage, fear immunity, misty step.', bestFor: 'Social Rangers, multiclass with Druid.', note: 'WIS to CHA checks makes you a great face.' },
  { subclass: 'Horizon Walker', rating: 'A', why: 'Force damage, teleport, Haste at L9, ethereal step.', bestFor: 'Mobile strikers, planar campaigns.', note: 'Haste on self is solid but uses concentration.' },
  { subclass: 'Hunter', rating: 'A', why: 'Colossus Slayer (1d8 extra/turn), Multiattack Defense, strong features.', bestFor: 'Simple, reliable damage dealer.', note: 'Best PHB subclass. Straightforward and effective.' },
  { subclass: 'Drakewarden', rating: 'A', why: 'Dragon companion that scales. Extra attack, breath weapon, flight.', bestFor: 'Pet class fans. Dragon lovers.', note: 'Drake scales well. Rideable at L7 (Small races) or L15.' },
  { subclass: 'Monster Slayer', rating: 'B+', why: 'Extra damage vs marked target, counter-magic, save bonuses.', bestFor: 'Anti-caster, monster hunting campaigns.', note: 'Niche but effective against specific threats.' },
  { subclass: 'Beast Master', rating: 'B', why: 'Companion uses your BA. Tasha\'s Primal Companion fixes it.', bestFor: 'Pet lovers. Only with Tasha\'s companion.', note: 'PHB beast is terrible. Tasha\'s Primal Companion is required.' },
];

export const BEST_RANGER_SPELLS = [
  { level: 1, spell: 'Goodberry', why: 'Out of combat healing. 10 HP total. Feed to downed allies (1 HP each).', rating: 'S' },
  { level: 1, spell: 'Entangle', why: 'Restrained on failed STR save. Amazing L1 control.', rating: 'S' },
  { level: 1, spell: 'Absorb Elements', why: 'Reaction: halve elemental damage + add to next attack.', rating: 'S' },
  { level: 2, spell: 'Pass Without Trace', why: '+10 to stealth for entire party. Guaranteed surprise rounds.', rating: 'S+' },
  { level: 2, spell: 'Spike Growth', why: '2d4 per 5ft moved. Forced movement = massive damage.', rating: 'S' },
  { level: 2, spell: 'Silence', why: 'Shuts down casters. Ritual rooms. Stealth operations.', rating: 'A+' },
  { level: 3, spell: 'Conjure Animals', why: '8 wolves = 8 attacks + pack tactics. Action economy bomb.', rating: 'S+' },
  { level: 3, spell: 'Plant Growth', why: 'No concentration. 1/4 speed in area. Incredible battlefield control.', rating: 'S' },
  { level: 4, spell: 'Guardian of Nature', why: 'Great Beast: advantage on STR attacks, extra 1d6 force.', rating: 'A+' },
  { level: 5, spell: 'Swift Quiver', why: 'BA: 2 extra attacks with ranged weapon. DPR machine.', rating: 'S' },
];

export const RANGER_BUILD_TIPS = [
  'Always use Tasha\'s optional features. They fix the class.',
  'Gloom Stalker: best subclass. Invisible in darkness. Extra R1 attack.',
  'Pass Without Trace: +10 stealth for party. Best L2 spell.',
  'Conjure Animals: 8 wolves = broken action economy.',
  'DEX > WIS > CON for ranged builds.',
  'STR > CON > WIS for melee/grapple builds (rare).',
  'Archery fighting style: +2 to ranged attacks. Always take it.',
  'Crossbow Expert + Sharpshooter: peak Ranger DPR.',
  'Multiclass Gloom Stalker 3 / Fighter X: nova damage machine.',
  'Favored Foe (Tasha\'s): free extra damage, no action cost.',
];
