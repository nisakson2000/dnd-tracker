/**
 * playerArmorerDetailedGuide.js
 * Player Mode: Armorer Artificer — the power armor specialist (detailed builds)
 * Pure JS — no React dependencies.
 */

export const ARMORER_BASICS = {
  class: 'Artificer (Armorer)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Power armor. Heavy armor without STR. Two armor modes: tank or infiltrator.',
  note: 'Best Artificer subclass. Guardian mode = INT-based tank with temp HP. Infiltrator mode = stealth/ranged. Removes heavy armor STR requirement.',
};

export const ARMORER_FEATURES = [
  { feature: 'Tools of the Trade', level: 3, effect: 'Proficiency with heavy armor and smith\'s tools.', note: 'Heavy armor on an INT class. No STR requirement. Full plate at INT-based casting.' },
  { feature: 'Arcane Armor', level: 3, effect: 'Action: turn armor into Arcane Armor. No STR requirement. Can\'t be removed against your will. Replaces missing limbs.', note: 'Wear full plate regardless of STR. Armor can\'t be taken off you. The armor IS you.' },
  { feature: 'Armor Model', level: 3, effect: 'Guardian: thunder gauntlets 1d8, impose disadvantage on attacks vs others. Infiltrator: lightning launcher 1d6+1d6 ranged 90ft, advantage on Stealth, 5ft step.', note: 'Guardian = tank with taunt. Infiltrator = stealth sniper. Switch every long rest.' },
  { feature: 'Extra Attack', level: 5, effect: 'Attack twice when taking Attack action.', note: '2 thunder gauntlet punches or 2 lightning shots per turn.' },
  { feature: 'Armor Modifications', level: 9, effect: 'Armor counts as 4 items for infusions: armor, boots, helmet, weapon. 2 extra infusion slots.', note: 'Stack infusions: Enhanced Defense + Repulsion Shield + Helm of Awareness + Enhanced Weapon.' },
  { feature: 'Perfected Armor', level: 15, effect: 'Guardian: bonus action pull creatures 30ft → 5ft toward you + thunder damage. Infiltrator: +1d6 lightning, target glows (advantage on attacks against it).', note: 'Guardian pulls and damages. Infiltrator marks targets.' },
];

export const ARMORER_GUARDIAN_TACTICS = [
  { tactic: 'Thunder Gauntlets taunt', detail: 'Hit enemy → disadvantage on attacks against anyone except you. Force enemies to attack the tankiest character.', rating: 'S' },
  { tactic: 'Guardian + Shield spell', detail: 'Full plate (18) + Shield (+5) = AC 23. With Enhanced Defense infusion: AC 25. Nearly unhittable.', rating: 'S' },
  { tactic: 'Perfected Armor pull', detail: 'L15 bonus action: pull all enemies 30ft → 5ft closer + thunder damage. Group for AoE spells.', rating: 'A' },
  { tactic: 'Infusion stacking', detail: 'Enhanced Defense + Repulsion Shield + Cloak of Protection. AC 21+ permanent, 23+ with Shield spell.', rating: 'S' },
];

export const ARMORER_INFILTRATOR_TACTICS = [
  { tactic: 'Stealth in full plate', detail: 'Infiltrator mode: no Stealth disadvantage + advantage on Stealth. Full plate stealth operative.', rating: 'S' },
  { tactic: 'Lightning Launcher sniping', detail: '90ft, 1d6+INT+1d6 on first hit. INT-based ranged attacks. No DEX needed.', rating: 'A' },
  { tactic: 'Perfected marking', detail: 'L15: hit → target glows → all attacks have advantage against it. Ranged party support.', rating: 'A' },
];

export const ARMORER_INFUSION_PRIORITIES = [
  { infusion: 'Enhanced Defense', slot: 'Armor', effect: '+1 AC (L10: +2)', rating: 'S' },
  { infusion: 'Repulsion Shield', slot: 'Shield', effect: '+1 AC, reaction: push attacker 15ft (PB/LR)', rating: 'S' },
  { infusion: 'Helm of Awareness', slot: 'Helmet', effect: 'Advantage on initiative. Can\'t be surprised.', rating: 'A' },
  { infusion: 'Enhanced Weapon', slot: 'Gauntlets/Launcher', effect: '+1 to attack/damage (L10: +2)', rating: 'A' },
  { infusion: 'Boots of Elvenkind', slot: 'Boots', effect: 'Advantage on Stealth (sound-based). Stacks with Infiltrator.', rating: 'A' },
];

export function guardianAC(hasEnhancedDefense = false, hasShield = true, hasShieldSpell = false) {
  let ac = 18; // full plate
  if (hasShield) ac += 2;
  if (hasEnhancedDefense) ac += 1;
  if (hasShieldSpell) ac += 5;
  return ac;
}

export function lightningLauncherDamage(intMod, isFirstHit = true) {
  const base = 3.5 + intMod;
  return isFirstHit ? base + 3.5 : base;
}
