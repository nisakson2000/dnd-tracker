/**
 * playerWarClericGuide.js
 * Player Mode: War Cleric — the martial divine striker
 * Pure JS — no React dependencies.
 */

export const WAR_BASICS = {
  class: 'Cleric (War Domain)',
  source: 'Player\'s Handbook',
  theme: 'Holy warrior. Bonus action attacks. Guided Strike +10. Heavy armor + martial weapons.',
  note: 'Good at low levels, falls off at higher levels. Guided Strike is the main draw. War Priest competes for bonus action.',
};

export const WAR_FEATURES = [
  { feature: 'Bonus Proficiencies', level: 1, effect: 'Heavy armor, martial weapons.', note: 'Full martial equipment. Plate + greatsword or longsword + shield.' },
  { feature: 'War Priest', level: 1, effect: 'When you take Attack action: bonus action weapon attack. WIS mod uses per long rest.', note: 'Extra attack as bonus action. At L1: 3-5 times per day. Competes with Spiritual Weapon for bonus action.' },
  { feature: 'Channel Divinity: Guided Strike', level: 2, effect: '+10 to ONE attack roll. Use after seeing the roll but before result.', note: '+10 is huge. Turn a miss into a guaranteed hit. Use on your most important attack. Save for clutch moments.' },
  { feature: 'Channel Divinity: War God\'s Blessing', level: 6, effect: 'Reaction: give +10 to ANOTHER creature\'s attack roll within 30ft.', note: 'Give +10 to the Rogue\'s attack (guarantee Sneak Attack) or Paladin\'s (guarantee smite hit).' },
  { feature: 'Divine Strike', level: 8, effect: '+1d8 weapon damage once per turn. 2d8 at L14.', note: 'Standard Divine Strike. Extra weapon damage on one hit per turn.' },
  { feature: 'Avatar of Battle', level: 17, effect: 'Resistance to bludgeoning/piercing/slashing from nonmagical weapons.', note: 'Physical resistance. But at L17, most enemies have magical attacks. Late and somewhat obsolete.' },
];

export const WAR_CLERIC_TACTICS = [
  { tactic: 'Guided Strike + GWM/SS', detail: 'Attack with -5 (GWM/SS). Miss? Use Guided Strike: +10 to the roll. Net +5 swing. Guarantees the power attack hit.', rating: 'S' },
  { tactic: 'War God\'s Blessing on Rogue', detail: 'L6: Rogue misses their attack? Reaction: +10 to their roll. Guarantees Sneak Attack damage.', rating: 'S' },
  { tactic: 'Spirit Guardians + melee', detail: 'Spirit Guardians aura + melee attacks with War Priest bonus action. Dual damage sources.', rating: 'A' },
  { tactic: 'Spiritual Weapon over War Priest', detail: 'After L3, Spiritual Weapon is better than War Priest for bonus action (no uses per day limit). Save War Priest for when SW isn\'t up.', rating: 'A' },
];

export const WAR_DOMAIN_SPELLS = [
  { level: 1, spells: ['Divine Favor', 'Shield of Faith'], note: 'Divine Favor: +1d4 radiant per hit (concentration). Shield of Faith: +2 AC.' },
  { level: 3, spells: ['Magic Weapon', 'Spiritual Weapon'], note: 'Spiritual Weapon is the real prize. Magic Weapon for non-magical weapon scenarios.' },
  { level: 5, spells: ['Crusader\'s Mantle', 'Spirit Guardians'], note: 'Crusader\'s Mantle: +1d4 radiant to ALL allies\' melee. Spirit Guardians: best Cleric spell.' },
  { level: 7, spells: ['Freedom of Movement', 'Stoneskin'], note: 'Both defensive. Stoneskin costs 100gp and requires concentration.' },
  { level: 9, spells: ['Flame Strike', 'Hold Monster'], note: 'Hold Monster: paralyze any creature. Auto-crit in melee.' },
];

export function guidedStrikeHitChance(attackBonus, targetAC) {
  const normalHitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const guidedHitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - (attackBonus + 10))) / 20));
  return { normal: normalHitChance, withGuided: guidedHitChance };
}

export function warPriestUses(wisMod) {
  return Math.max(1, wisMod);
}
