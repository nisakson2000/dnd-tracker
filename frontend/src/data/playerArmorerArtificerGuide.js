/**
 * playerArmorerArtificerGuide.js
 * Player Mode: Armorer Artificer — Iron Man in D&D
 * Pure JS — no React dependencies.
 */

export const ARMORER_BASICS = {
  class: 'Artificer (Armorer)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Power armor specialist. Tank or infiltrator with magical armor.',
  note: 'Most versatile Artificer. Two armor modes cover tank and stealth builds. INT for everything.',
};

export const ARMORER_FEATURES = [
  { feature: 'Arcane Armor', level: 3, effect: 'Turn any heavy armor into Arcane Armor. No STR requirement, armor is your spellcasting focus, can don/doff as action, can\'t be removed against your will.', note: 'Heavy armor with no STR requirement. INT-only build is fully viable.' },
  { feature: 'Armor Model', level: 3, effect: 'Choose Guardian (tank) or Infiltrator (stealth). Can switch on short rest.', note: 'Two modes. Guardian: melee tank with Thunder Gauntlets. Infiltrator: ranged striker with Lightning Launcher.' },
  { feature: 'Extra Attack', level: 5, effect: 'Attack twice when you take the Attack action.', note: 'Artificers normally don\'t get Extra Attack. Armorer does.' },
  { feature: 'Armor Modifications', level: 9, effect: 'Armor counts as separate items for infusions: helmet, chest, boots, weapon. Get 2 extra infusion slots (armor only).', note: '+2 infusion slots. Stack 4 infusions on your armor.' },
  { feature: 'Perfected Armor', level: 15, effect: 'Guardian: pull creatures 30ft toward you (bonus action, large AoE). Infiltrator: hit with Lightning Launcher → target glows, next hit deals +1d6 from any source.', note: 'Guardian becomes crowd controller. Infiltrator enables party damage.' },
];

export const ARMOR_MODELS = {
  guardian: {
    name: 'Guardian',
    weapon: 'Thunder Gauntlets: melee, INT for attack/damage, 1d8 thunder. Hit = target has disadvantage on attacks against anyone except you.',
    defense: 'Temporary HP = Artificer level (bonus action)',
    role: 'Tank. Taunt enemies (disadvantage if they attack others). Temp HP every turn.',
    rating: 'S',
    note: 'Best magical tank. INT-based melee + built-in taunt + temp HP.',
  },
  infiltrator: {
    name: 'Infiltrator',
    weapon: 'Lightning Launcher: ranged 90ft, INT for attack/damage, 1d6 lightning + extra 1d6 once per turn.',
    defense: 'Advantage on Stealth checks. No Stealth disadvantage from armor.',
    role: 'Stealth ranged striker. Heavy armor with advantage on Stealth.',
    rating: 'A',
    note: 'Stealth in full plate. 2d6+INT at range. Great for infiltration.',
  },
};

export const ARMORER_INFUSIONS = [
  { infusion: 'Enhanced Defense', effect: '+1 AC (scales to +2 at L10)', priority: 'S', note: 'Stack with plate: 19 AC base → 20/21.' },
  { infusion: 'Repulsion Shield', effect: '+1 AC + reaction: push attacker 15ft (CON save)', priority: 'S', note: '+1 AC AND push enemies away. Guardian must-have.' },
  { infusion: 'Helm of Awareness', effect: 'Advantage on initiative', priority: 'A', note: 'Go first. Important for Guardian to establish position.' },
  { infusion: 'Boots of the Winding Path', effect: 'Bonus action: teleport back to where you were last turn', priority: 'A', note: 'Tactical repositioning. Escape after tanking.' },
  { infusion: 'Cloak of Protection', effect: '+1 AC and saves', priority: 'A', note: 'Stacks with everything. Saves bonus is huge.' },
  { infusion: 'Radiant Weapon', effect: '+1 weapon, 4 charges of Blindness (CON save, 30ft)', priority: 'B', note: 'Guardian doesn\'t need — Thunder Gauntlets replace weapon.' },
];

export const ARMORER_BUILDS = [
  { build: 'Guardian Tank', stats: 'INT > CON > WIS', items: 'Plate + Shield + Thunder Gauntlets', ac: '20+ (plate + shield + Enhanced Defense + Repulsion Shield)', rating: 'S', note: '22-24 AC tank with INT-based attacks and built-in taunt.' },
  { build: 'Infiltrator Sniper', stats: 'INT > DEX > CON', items: 'Half plate + Lightning Launcher', playstyle: 'Stealth advantage, 90ft range, 2d6+INT per turn', rating: 'A' },
  { build: 'Armorer 14/Wizard 6', stats: 'INT > CON', playstyle: 'War Wizard or Bladesinger dip for Shield/Absorb/more slots', rating: 'A', note: 'Stay mostly Artificer for Armor Modifications and Spell-Storing Item.' },
];

export function guardianAC(hasShield, enhancedDefense, repulsionShield, cloakOfProtection) {
  let ac = 18; // plate
  if (hasShield) ac += 2;
  if (enhancedDefense) ac += (enhancedDefense >= 10 ? 2 : 1);
  if (repulsionShield) ac += 1;
  if (cloakOfProtection) ac += 1;
  return ac;
}

export function thunderGauntletDamage(intMod) {
  return 4.5 + intMod; // 1d8 + INT
}

export function lightningLauncherDamage(intMod) {
  return 3.5 + 3.5 + intMod; // 1d6 + 1d6 (once per turn) + INT
}

export function guardianTempHP(artificerLevel) {
  return artificerLevel;
}
