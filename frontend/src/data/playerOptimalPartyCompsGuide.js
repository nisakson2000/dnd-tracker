/**
 * playerOptimalPartyCompsGuide.js
 * Player Mode: Optimal party compositions — roles, synergies, and builds
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = [
  { role: 'Striker', function: 'Deal high single-target damage.', bestClasses: ['Rogue', 'Fighter', 'Ranger', 'Warlock', 'Paladin'], note: 'Kill priority targets fast.' },
  { role: 'Tank', function: 'Absorb damage. Control enemy positioning.', bestClasses: ['Barbarian', 'Paladin', 'Fighter', 'Cleric (Forge/Twilight)'], note: 'High AC + HP + threat generation.' },
  { role: 'Controller', function: 'Disable enemies. Shape the battlefield.', bestClasses: ['Wizard', 'Druid', 'Bard', 'Sorcerer'], note: 'Hypnotic Pattern, Wall of Force, Entangle.' },
  { role: 'Healer', function: 'Keep party alive. Remove conditions.', bestClasses: ['Cleric', 'Druid', 'Bard', 'Paladin'], note: 'Healing Word > Cure Wounds. Prevention > healing.' },
  { role: 'Face', function: 'Social encounters. Persuasion, deception.', bestClasses: ['Bard', 'Warlock', 'Paladin', 'Sorcerer', 'Rogue'], note: 'High CHA + social skills.' },
  { role: 'Scout', function: 'Reconnaissance. Stealth. Traps.', bestClasses: ['Rogue', 'Ranger', 'Monk', 'Druid (Wild Shape)'], note: 'Stealth + Perception + investigation.' },
  { role: 'Utility', function: 'Problem solving. Ritual casting. Versatility.', bestClasses: ['Wizard', 'Bard', 'Artificer', 'Druid'], note: 'Ritual spells, knowledge, crafting.' },
];

export const OPTIMAL_4_PLAYER_COMPS = [
  {
    name: 'The Classic',
    comp: ['Fighter (Battle Master)', 'Cleric (Life/Twilight)', 'Wizard (Divination)', 'Rogue (Scout)'],
    strengths: 'Balanced. Covers all roles. Tank, heals, control, skills.',
    weakness: 'Low CHA for social. No strong face.',
    rating: 'S',
  },
  {
    name: 'The Powerhouse',
    comp: ['Paladin (Vengeance)', 'Bard (Lore)', 'Wizard (Chronurgy)', 'Fighter (Echo Knight)'],
    strengths: 'Incredible damage + control. Aura of Protection. Magical Secrets.',
    weakness: 'Light on nature/survival skills.',
    rating: 'S+',
  },
  {
    name: 'The Control Squad',
    comp: ['Wizard (Divination)', 'Druid (Shepherd)', 'Bard (Eloquence)', 'Paladin (Conquest)'],
    strengths: 'Massive battlefield control. Portent + Unsettling Words + Conquest Aura.',
    weakness: 'Lower burst damage. Relies on saving throw spells.',
    rating: 'S',
  },
  {
    name: 'The Nova Team',
    comp: ['Paladin (Vengeance)', 'Sorcerer (Divine Soul)', 'Fighter (Battle Master)', 'Rogue (Assassin)'],
    strengths: 'Enormous burst damage. Surprise round = devastating.',
    weakness: 'Limited healing if Sorcerer loses concentration.',
    rating: 'A+',
  },
  {
    name: 'The Unkillable',
    comp: ['Paladin (Devotion)', 'Cleric (Twilight)', 'Barbarian (Bear Totem)', 'Artificer (Armorer)'],
    strengths: 'Incredible survivability. Aura + Twilight Sanctuary + Rage Resistance.',
    weakness: 'Low ranged options. Limited arcane utility.',
    rating: 'A+',
  },
];

export const PARTY_SYNERGIES = [
  { combo: 'Paladin + Any Allies', synergy: 'Aura of Protection: +CHA to all saves within 10ft.', rating: 'S+' },
  { combo: 'Twilight Cleric + Party', synergy: 'Temp HP every round for everyone within 30ft.', rating: 'S+' },
  { combo: 'Rogue + Any Melee', synergy: 'Ally adjacent to enemy = free Sneak Attack every turn.', rating: 'S' },
  { combo: 'Wizard + Druid', synergy: 'Wizard control + Druid summons. Spike Growth + forced movement.', rating: 'S' },
  { combo: 'Bard (Eloquence) + Save Caster', synergy: 'Unsettling Words (-Inspiration die from save) + big save spell.', rating: 'S' },
  { combo: 'Grave Cleric + Paladin', synergy: 'Path to the Grave (vulnerability) + Divine Smite crit = massive damage.', rating: 'S+' },
  { combo: 'Order Cleric + Rogue', synergy: 'Voice of Authority: Rogue gets reaction attack = extra Sneak Attack.', rating: 'S+' },
  { combo: 'Fighter + Bard/Wizard', synergy: 'Fighter frontline + caster control. Each does their job.', rating: 'A+' },
  { combo: 'Barbarian + Healer', synergy: 'Rage resistance = healing is 2× effective on Barbarian.', rating: 'A+' },
  { combo: 'Warlock (EB) + Druid (Spike Growth)', synergy: 'Repelling Blast pushes through Spike Growth: 2d4 per 5ft.', rating: 'S' },
];

export const MISSING_ROLE_FIXES = [
  { missing: 'Healer', fix: 'Healer feat (10 HP with Healer\'s Kit). Goodberry. Potion stockpile.', note: 'Short rest reliance. Buy lots of potions.' },
  { missing: 'Tank', fix: 'Dodge action. Control spells to prevent melee. Kiting.', note: 'Control > tanking. Hypnotic Pattern prevents damage.' },
  { missing: 'Face', fix: 'Anyone with decent CHA. Enhance Ability (CHA). Friends cantrip.', note: 'Skill proficiency matters more than class.' },
  { missing: 'Arcane Caster', fix: 'Magic Initiate feat. Ritual Caster feat. Scrolls.', note: 'Utility spells via feats or items.' },
  { missing: 'Scout', fix: 'Pass Without Trace (+10 stealth). Familiar scouting. Invisibility.', note: 'Spells replace skills if needed.' },
];

export const PARTY_COMP_TIPS = [
  'Paladin in every party: Aura of Protection is the best feature in the game.',
  'Twilight Cleric: temp HP every round for the whole party. Insanely strong.',
  'Every party needs: healing, control, damage, and skills.',
  'Order Cleric + Rogue: Voice of Authority = extra Sneak Attack per round.',
  'Grave Cleric + Paladin crit: vulnerability + smite = obscene damage.',
  'Missing a healer? Healer feat + Healer\'s Kit = 10 HP per use.',
  'Missing a tank? Control spells prevent more damage than tanking.',
  'Warlock + Druid: Repelling Blast through Spike Growth is devastating.',
  '4 player parties: cover Tank, Healer, Striker, Controller minimum.',
  'Versatile characters (Paladin, Bard) fill multiple roles.',
];
