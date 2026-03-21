/**
 * playerBestL1SpellsByClassGuide.js
 * Player Mode: Best level 1 spells by class — must-haves and traps
 * Pure JS — no React dependencies.
 */

export const BARD_L1 = [
  { spell: 'Healing Word', rating: 'S+', why: 'BA ranged heal. Pick up downed allies from 60ft.', trap: false },
  { spell: 'Faerie Fire', rating: 'S+', why: 'Advantage on attacks vs affected. DEX save. No friendly fire.', trap: false },
  { spell: 'Dissonant Whispers', rating: 'S', why: '3d6 psychic + forced movement (provokes OA). WIS save.', trap: false },
  { spell: 'Silvery Barbs', rating: 'S+', why: 'Reaction: force reroll + grant advantage. Best L1 spell.', trap: false },
  { spell: 'Sleep', rating: 'A+ (L1-3)', why: 'No save. Ends encounters at low levels. Falls off hard.', trap: false },
  { spell: 'Cure Wounds', rating: 'C', why: 'Action heal. Healing Word is almost always better.', trap: true },
];

export const CLERIC_L1 = [
  { spell: 'Healing Word', rating: 'S+', why: 'BA ranged heal. Core cleric spell. Always prepare.', trap: false },
  { spell: 'Bless', rating: 'S+', why: '+1d4 to attacks and saves for 3 creatures. Best L1 buff.', trap: false },
  { spell: 'Guiding Bolt', rating: 'S', why: '4d6 radiant + next attack has advantage. Great damage at L1.', trap: false },
  { spell: 'Shield of Faith', rating: 'A+', why: '+2 AC. Concentration. Great on tanks.', trap: false },
  { spell: 'Command', rating: 'A+', why: 'One word command. "Grovel" = prone + lose turn. WIS save.', trap: false },
  { spell: 'Inflict Wounds', rating: 'B', why: '3d10 necrotic melee. High damage but melee range + action.', trap: false },
  { spell: 'Sanctuary', rating: 'C+', why: 'Niche. Only works if target doesn\'t attack. Rarely useful.', trap: true },
];

export const DRUID_L1 = [
  { spell: 'Goodberry', rating: 'S', why: '10 berries, 1 HP each. Out of combat healing. Feed to downed allies.', trap: false },
  { spell: 'Entangle', rating: 'S', why: 'Restrained in 20ft square. STR save. Amazing L1 control.', trap: false },
  { spell: 'Healing Word', rating: 'S+', why: 'BA ranged heal. Same as every class — always take.', trap: false },
  { spell: 'Absorb Elements', rating: 'S', why: 'Reaction: halve elemental damage + add to next melee.', trap: false },
  { spell: 'Faerie Fire', rating: 'S+', why: 'Advantage on attacks. Reveals invisible creatures.', trap: false },
  { spell: 'Thunderwave', rating: 'B+', why: '2d8 thunder + push 10ft. Only if cornered. Loud.', trap: false },
];

export const PALADIN_L1 = [
  { spell: 'Bless', rating: 'S+', why: '+1d4 to attacks and saves. Best concentration spell at L1.', trap: false },
  { spell: 'Shield of Faith', rating: 'A+', why: '+2 AC. Concentration — competes with Bless.', trap: false },
  { spell: 'Wrathful Smite', rating: 'A+', why: '1d6 psychic + frightened (WIS save to end, uses ACTION).', trap: false },
  { spell: 'Command', rating: 'A+', why: 'Force enemy to grovel, flee, drop weapon. WIS save.', trap: false },
  { spell: 'Cure Wounds', rating: 'B', why: 'Paladin has no Healing Word. This is your only heal option.', trap: false },
  { spell: 'Heroism', rating: 'B', why: 'Temp HP each turn. Concentration — Bless is usually better.', trap: false },
  { spell: 'Compelled Duel', rating: 'C', why: 'Only affects one target. Concentration. Weak tanking tool.', trap: true },
];

export const RANGER_L1 = [
  { spell: 'Goodberry', rating: 'S', why: 'Out of combat healing. 10 HP total. Essential.', trap: false },
  { spell: 'Absorb Elements', rating: 'S', why: 'Reaction: halve elemental damage. Survival essential.', trap: false },
  { spell: 'Entangle', rating: 'S', why: 'Restrained in area. Best L1 control.', trap: false },
  { spell: 'Fog Cloud', rating: 'A', why: 'Block line of sight. Escape, reposition, anti-ranged.', trap: false },
  { spell: 'Hunter\'s Mark', rating: 'A (overrated)', why: '1d6 extra per hit. Concentration + BA. Competes with better spells.', trap: false },
  { spell: 'Ensnaring Strike', rating: 'B', why: 'Restrained on hit. STR save. Concentration — Entangle is better.', trap: false },
];

export const SORCERER_L1 = [
  { spell: 'Shield', rating: 'S+', why: 'Reaction: +5 AC until next turn. Essential survival.', trap: false },
  { spell: 'Silvery Barbs', rating: 'S+', why: 'Reaction: force reroll + grant advantage. Absurdly good.', trap: false },
  { spell: 'Absorb Elements', rating: 'S', why: 'Reaction: halve elemental damage. Always prepare.', trap: false },
  { spell: 'Magic Missile', rating: 'A+', why: 'Auto-hit. 3d4+3 force. Concentration breaker (3 saves).', trap: false },
  { spell: 'Sleep', rating: 'A (L1-3)', why: 'No save. Incredible at L1, useless by L5.', trap: false },
  { spell: 'Chromatic Orb', rating: 'B', why: '3d8 damage, choose type. Needs 50gp diamond. Magic Missile usually better.', trap: false },
  { spell: 'Witch Bolt', rating: 'F', why: '1d12 then 1d12/round but you must use your action. Terrible.', trap: true },
];

export const WARLOCK_L1 = [
  { spell: 'Hex', rating: 'A+', why: '1d6 necrotic per hit. Disadvantage on one ability. Scales with attacks.', trap: false },
  { spell: 'Armor of Agathys', rating: 'S', why: 'Temp HP + cold damage to melee attackers. Scales with upcast.', trap: false },
  { spell: 'Hellish Rebuke', rating: 'A', why: 'Reaction: 2d10 fire when damaged. Good early, falls off.', trap: false },
  { spell: 'Protection from Evil and Good', rating: 'A+', why: 'Disadvantage on attacks from fiends, undead, etc. Campaign-dependent.', trap: false },
  { spell: 'Cause Fear', rating: 'B+', why: 'Frighten one creature. WIS save. Decent single-target control.', trap: false },
  { spell: 'Witch Bolt', rating: 'F', why: 'Same trap as Sorcerer. 1d12/round but costs your action. Terrible.', trap: true },
];

export const WIZARD_L1 = [
  { spell: 'Shield', rating: 'S+', why: '+5 AC reaction. Never leave home without it.', trap: false },
  { spell: 'Absorb Elements', rating: 'S', why: 'Halve elemental damage. Reaction. Essential.', trap: false },
  { spell: 'Silvery Barbs', rating: 'S+', why: 'Force reroll + advantage. Best reaction spell at L1.', trap: false },
  { spell: 'Find Familiar', rating: 'S+', why: 'Owl: flyby Help action. Scout. Deliver touch spells. Ritual cast.', trap: false },
  { spell: 'Magic Missile', rating: 'A+', why: 'Auto-hit. 3 concentration checks. Reliable damage.', trap: false },
  { spell: 'Detect Magic', rating: 'A', why: 'Ritual cast. Always useful in dungeons. Free with ritual.', trap: false },
  { spell: 'Sleep', rating: 'A (L1-3)', why: 'Auto-win encounters at L1. Useless by L5.', trap: false },
  { spell: 'Mage Armor', rating: 'A+', why: '13+DEX AC. 8 hours, no concentration. Essential if no armor.', trap: false },
  { spell: 'Witch Bolt', rating: 'F', why: 'Trap spell. Action each round for 1d12. Awful.', trap: true },
  { spell: 'Color Spray', rating: 'D', why: 'No save but HP-dependent blinding. Falls off instantly.', trap: true },
];

export const L1_SPELL_TIPS = [
  'Shield: best L1 spell in the game. +5 AC reaction. Take it.',
  'Silvery Barbs: force reroll + give advantage. Insanely good.',
  'Healing Word > Cure Wounds. BA ranged > action melee.',
  'Bless: best L1 concentration spell. +1d4 attacks AND saves.',
  'Find Familiar (Wizard): owl flyby Help = free advantage.',
  'Sleep: incredible at L1, drop it by L4-5.',
  'Absorb Elements: halves dragon breath. Always prepared.',
  'Witch Bolt: TRAP. Never take it. Action each round for 1d12.',
  'Goodberry: 10 HP out of combat. Feed 1 to downed allies.',
  'Entangle: best L1 control spell. Restrained in 20ft area.',
];
