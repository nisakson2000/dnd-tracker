/**
 * playerSorcadinBuildGuide.js
 * Player Mode: Sorcadin (Sorcerer + Paladin) multiclass build guide
 * Pure JS — no React dependencies.
 */

export const SORCADIN_OVERVIEW = {
  name: 'Sorcadin',
  classes: 'Paladin 6 / Sorcerer X (or Paladin 2 / Sorcerer X)',
  role: 'Nova damage melee combatant with smites and metamagic',
  playstyle: 'Smite on crits, Quickened Booming Blade, Twinned buffs, full armor + shield',
  rating: 'S',
  note: 'The most powerful melee build in 5e. Paladin chassis + Sorcerer fuel = devastating.',
};

export const SORCADIN_BUILDS = [
  {
    build: 'Paladin 6 / Sorcerer 14',
    pros: ['Extra Attack', 'Aura of Protection (+CHA to all saves, 10ft)', 'Subclass feature', 'L7 Sorc spells'],
    cons: ['Delayed spell progression', 'No L9 spells'],
    rating: 'S',
    note: 'The standard. Aura of Protection is too good to skip.',
  },
  {
    build: 'Paladin 2 / Sorcerer 18',
    pros: ['Fastest spell progression', 'L9 spells (Wish)', 'More Sorcery Points', 'Sorcerer capstone'],
    cons: ['No Extra Attack (use Booming Blade)', 'No Aura of Protection'],
    rating: 'A+',
    note: 'For players who want to be a caster who smites, not a Paladin who casts.',
  },
  {
    build: 'Paladin 7 / Sorcerer 13',
    pros: ['Aura of Protection', 'Subclass L7 aura (Conquest fear, Ancients spell resistance)'],
    cons: ['Further delayed spells', 'L7 Sorc spells max'],
    rating: 'A+',
    note: 'Only if the L7 aura is exceptional (Conquest, Ancients).',
  },
];

export const SORCADIN_PROGRESSION = [
  { levels: '1-2 (Paladin)', note: 'Heavy armor, shield, Fighting Style (Defense), Divine Smite, L1 slots.' },
  { levels: '3-5 (Paladin)', note: 'Oath (Vengeance or Conquest recommended), Extra Attack at 5.' },
  { levels: '6 (Paladin)', note: 'Aura of Protection. The reason to go Paladin 6. +CHA to ALL saves in 10ft.' },
  { levels: '7+ (Sorcerer)', note: 'All remaining levels. Divine Soul or Clockwork Soul recommended.' },
];

export const SORCADIN_COMBOS = [
  { combo: 'Smite on crit', detail: 'Wait to declare smite until AFTER you see a crit. Double all smite dice. L4 smite crit = 10d8.', rating: 'S' },
  { combo: 'Quickened Booming Blade', detail: 'BA: Quickened BB → Action: Attack or BB again. Two melee attacks with rider damage.', rating: 'S' },
  { combo: 'Twinned Haste', detail: 'Haste on yourself AND an ally. Both get +2 AC, extra attack, doubled speed.', rating: 'A+' },
  { combo: 'Twinned Booming Blade', detail: 'Hit two different enemies with Booming Blade in one action. Two thunder riders.', rating: 'A' },
  { combo: 'Shield spell + Plate + Shield', detail: 'AC 18 + 2 + 5 = AC 25 as a reaction. Nearly unhittable.', rating: 'S' },
  { combo: 'Hold Person + Smite', detail: 'Hold Person → melee attack = auto-crit (paralyzed) → smite = double dice.', rating: 'S+' },
];

export const SORCADIN_SORCERER_ORIGINS = [
  { origin: 'Divine Soul', rating: 'S', note: 'Cleric spell access: Spirit Guardians, Spiritual Weapon. Favored by the Gods (reroll). Best overall.' },
  { origin: 'Clockwork Soul', rating: 'S', note: 'Restore Balance, expanded spells (Aid, Lesser Restoration). Reliable and defensive.' },
  { origin: 'Shadow Magic', rating: 'A', note: 'Darkness + Devil\'s Sight = advantage on all attacks. Strength of the Grave survival.' },
  { origin: 'Draconic Bloodline', rating: 'B', note: 'Redundant AC (you have plate). Elemental Affinity limited value.' },
];

export const SORCADIN_PALADIN_OATHS = [
  { oath: 'Vengeance', rating: 'S', note: 'Vow of Enmity (advantage vs one target). Hunter\'s Mark. Haste on oath list.' },
  { oath: 'Conquest', rating: 'S', note: 'Frightened + 0 speed aura. Armor of Agathys. Control-focused.' },
  { oath: 'Ancients', rating: 'A+', note: 'Resistance to spell damage in aura (L7). Misty Step on oath list.' },
  { oath: 'Devotion', rating: 'A', note: 'Sacred Weapon (CHA to attacks). Charm immunity aura.' },
];

export const SORCADIN_TIPS = [
  'Start Paladin for heavy armor, CON saves, and martial weapons.',
  'CHA is your #1 stat. It powers smites, Sorcerer spells, AND Aura of Protection.',
  'Don\'t smite on every hit — save slots for crits and important kills.',
  'Sorcery Points are precious. Budget them: 2-3 Quickened BBs per fight.',
  'Spirit Guardians (Divine Soul) + melee + smites = insane sustained damage.',
  'Concentration: Haste, Spirit Guardians, or Hold Person. Pick one per fight.',
];
