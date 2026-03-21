/**
 * playerBestL3SpellsByClassGuide.js
 * Player Mode: Best level 3 spells by class — the power spike level
 * Pure JS — no React dependencies.
 */

export const L3_POWER_SPIKE = {
  note: 'Level 3 spells are where casters become truly powerful.',
  key: 'Fireball, Counterspell, Hypnotic Pattern, Spirit Guardians — all L3.',
  milestone: 'Character level 5 = L3 spells + Extra Attack. The biggest power spike.',
};

export const BARD_L3 = [
  { spell: 'Hypnotic Pattern', rating: 'S+', why: '30ft cube. WIS save or incapacitated. Encounter-ending AoE control.' },
  { spell: 'Fear', rating: 'S', why: '30ft cone. WIS save or frightened + dash away. Area denial.' },
  { spell: 'Dispel Magic', rating: 'A+', why: 'Remove any spell effect. Essential utility. Auto at L3 or lower.' },
  { spell: 'Leomund\'s Tiny Hut', rating: 'A+', why: 'Ritual. Safe long rest. 8 hours. Impenetrable dome.' },
  { spell: 'Enemies Abound', rating: 'A', why: 'INT save. Target attacks nearest creature (could be ally). Chaos.' },
  { spell: 'Plant Growth', rating: 'S', why: 'No concentration. 1/4 speed in 100ft radius. Incredible control.' },
];

export const CLERIC_L3 = [
  { spell: 'Spirit Guardians', rating: 'S+', why: '3d8 radiant/round to enemies within 15ft. Concentration. Best Cleric spell.' },
  { spell: 'Revivify', rating: 'S+', why: 'Raise dead within 1 minute. 300gp diamond. Always prepare.' },
  { spell: 'Dispel Magic', rating: 'A+', why: 'Remove spell effects. Essential at every level.' },
  { spell: 'Beacon of Hope', rating: 'A', why: 'Advantage on WIS saves + death saves. Max healing from spells.' },
  { spell: 'Mass Healing Word', rating: 'A', why: 'BA: heal up to 6 creatures. Mass pickup from unconscious.' },
  { spell: 'Sending', rating: 'A', why: '25-word message to anyone, any plane. Communication lifeline.' },
];

export const DRUID_L3 = [
  { spell: 'Conjure Animals', rating: 'S+', why: '8 wolves with pack tactics. Action economy bomb. Best L3 Druid spell.' },
  { spell: 'Plant Growth', rating: 'S', why: 'No concentration. 100ft radius of 1/4 speed terrain. Amazing control.' },
  { spell: 'Call Lightning', rating: 'A+', why: '3d10 per round for 10 minutes. Action to repeat. Great sustained damage.' },
  { spell: 'Dispel Magic', rating: 'A+', why: 'Remove spell effects. Always have it ready.' },
  { spell: 'Sleet Storm', rating: 'A+', why: 'Heavily obscured + difficult terrain + concentration checks. Area denial.' },
  { spell: 'Tidal Wave', rating: 'A', why: '4d8 bludgeoning + prone. No concentration. Good AoE + control.' },
];

export const PALADIN_L3 = [
  { spell: 'Revivify', rating: 'S+', why: 'Raise the dead. 300gp diamond. Always prepared.' },
  { spell: 'Spirit Shroud', rating: 'A+', why: '1d8 extra per hit. Stacks with Extra Attack + Smite.', note: 'Tasha\'s. Great for melee Paladins.' },
  { spell: 'Dispel Magic', rating: 'A+', why: 'Remove magical effects. Essential.' },
  { spell: 'Aura of Vitality', rating: 'A', why: 'BA: 2d6 heal per round for 1 minute. Great out-of-combat healing.' },
  { spell: 'Crusader\'s Mantle', rating: 'B+', why: '+1d4 radiant to all allies\' weapon attacks within 30ft. Party buff.' },
  { spell: 'Blinding Smite', rating: 'B+', why: '3d8 radiant + blinded (CON save). Concentration.' },
];

export const RANGER_L3 = [
  { spell: 'Conjure Animals', rating: 'S+', why: '8 wolves. Pack tactics. Broken action economy.' },
  { spell: 'Plant Growth', rating: 'S', why: 'No concentration. 100ft radius difficult terrain (1/4 speed).' },
  { spell: 'Lightning Arrow', rating: 'A', why: '4d8 lightning + 2d8 splash. One-time burst damage.' },
  { spell: 'Conjure Barrage', rating: 'B+', why: '3d8 damage in 60ft cone. No concentration. AoE option.' },
  { spell: 'Flame Arrows', rating: 'C', why: '1d6 fire per arrow for 12 arrows. Concentration. Not worth it.' },
];

export const SORCERER_L3 = [
  { spell: 'Fireball', rating: 'S+', why: '8d6 fire, 20ft radius. Classic. Still the damage benchmark.' },
  { spell: 'Counterspell', rating: 'S+', why: 'Reaction: negate a spell. Must-have on any caster.' },
  { spell: 'Haste', rating: 'S', why: '+2 AC, double speed, extra attack. Best single-target buff.' },
  { spell: 'Hypnotic Pattern', rating: 'S+', why: 'Incapacitate entire groups. WIS save. Encounter-ending.' },
  { spell: 'Fly', rating: 'A+', why: '60ft fly speed. 10 min concentration. Bypass terrain.' },
  { spell: 'Slow', rating: 'A+', why: '-2 AC, half speed, no reactions, limited actions. WIS save. Debilitating.' },
  { spell: 'Lightning Bolt', rating: 'A', why: '8d6 lightning, 100ft line. Same damage as Fireball, harder to aim.' },
];

export const WARLOCK_L3 = [
  { spell: 'Counterspell', rating: 'S+', why: 'Negate enemy spells. Essential on any caster.' },
  { spell: 'Hypnotic Pattern', rating: 'S+', why: 'Incapacitate groups. Best control at this level.' },
  { spell: 'Hunger of Hadar', rating: 'A+', why: 'Difficult terrain + blind + cold/acid damage. No save for blind.' },
  { spell: 'Fly', rating: 'A+', why: 'Flight for 10 minutes. Concentration.' },
  { spell: 'Summon Fey / Undead', rating: 'A+', why: 'Tasha\'s summons. Reliable, scales well.' },
  { spell: 'Spirit Shroud', rating: 'A', why: '1d8 extra per EB beam. Great with Eldritch Blast at higher levels.' },
  { spell: 'Gaseous Form', rating: 'B+', why: 'Fly through cracks, immune to nonmagical damage. Escape anything.' },
];

export const WIZARD_L3 = [
  { spell: 'Fireball', rating: 'S+', why: '8d6 fire, 20ft radius. The damage standard. Learn it.' },
  { spell: 'Counterspell', rating: 'S+', why: 'Negate enemy spells as a reaction. Non-negotiable.' },
  { spell: 'Hypnotic Pattern', rating: 'S+', why: 'AoE incapacitate. Wins encounters by itself.' },
  { spell: 'Haste', rating: 'S', why: 'Best buff spell. +2 AC, double speed, extra attack.' },
  { spell: 'Fly', rating: 'A+', why: '60ft fly speed. Concentration. Upcasts for more targets.' },
  { spell: 'Slow', rating: 'A+', why: 'Debuff up to 6 creatures. -2 AC, half speed, limited actions.' },
  { spell: 'Dispel Magic', rating: 'A+', why: 'Remove any spell effect. Always in the book.' },
  { spell: 'Tiny Hut', rating: 'A+', why: 'Ritual. Safe rest. 8 hours. Essential exploration spell.' },
  { spell: 'Sleet Storm', rating: 'A', why: 'Heavily obscured, difficult terrain, concentration checks. Area denial.' },
  { spell: 'Animate Dead', rating: 'A (campaign-dependent)', why: 'Skeleton army. Action economy. Some tables ban it.' },
];

export const L3_SPELL_TIPS = [
  'L3 spells are the biggest power spike. Choose wisely.',
  'Fireball: 8d6 AoE. The damage benchmark at every level.',
  'Counterspell: mandatory on every caster. No exceptions.',
  'Hypnotic Pattern: best control spell at L3. WIS save, AoE incapacitate.',
  'Spirit Guardians: Cleric\'s bread and butter. 3d8/round in 15ft.',
  'Conjure Animals: 8 wolves = broken. Best L3 Druid/Ranger spell.',
  'Revivify: always prepare on Cleric/Paladin. Carry 300gp diamonds.',
  'Haste: best buff but lethal if concentration drops (lose a turn).',
  'Plant Growth: no concentration! 1/4 speed terrain is incredible.',
  'L3 slots are precious. Don\'t waste them on damage when control wins.',
];
