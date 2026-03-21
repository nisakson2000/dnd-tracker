/**
 * playerNecromancyWizardGuide.js
 * Player Mode: School of Necromancy Wizard — the army builder
 * Pure JS — no React dependencies.
 */

export const NECROMANCY_BASICS = {
  class: 'Wizard (School of Necromancy)',
  source: 'Player\'s Handbook',
  theme: 'Undead army commander. Raise skeletons and zombies. Drain life.',
  note: 'Build an undead army. Undead Thralls gives +HP and damage. Slows down combat if not managed well.',
};

export const NECROMANCY_FEATURES = [
  { feature: 'Necromancy Savant', level: 2, effect: 'Copy necromancy spells for half time and gold.', note: 'Saves gold on key spells like Animate Dead.' },
  { feature: 'Grim Harvest', level: 2, effect: 'When you kill a creature with a spell (1st level+): regain HP = 2× spell level (3× for necromancy spells). Not vs constructs/undead.', note: 'Free healing on kills. At L3: kill with a L2 spell = 4 HP back (6 if necromancy). Sustain.' },
  { feature: 'Undead Thralls', level: 6, effect: 'Animate Dead: create one additional undead. Your undead get +Wizard level HP and +PB to damage.', note: 'THE FEATURE. Extra undead + HP + damage. At L10: skeletons get +10 HP and +4 damage each.' },
  { feature: 'Inured to Undeath', level: 10, effect: 'Resistance to necrotic damage. HP max can\'t be reduced.', note: 'Necrotic resistance + immune to max HP reduction. Wraith can\'t drain you.' },
  { feature: 'Command Undead', level: 14, effect: 'Action: target undead (CHA save, advantage if INT ≥8). On fail: it obeys you. Reroll save each hour (if INT ≥12) or permanently controlled (INT <12).', note: 'Steal enemy undead. Permanently control mindless undead. Turn a Death Knight\'s minions against it.' },
];

export const ANIMATE_DEAD_ARMY = {
  spellSlots: [
    { slotLevel: 3, undeadCreated: 1, undeadReasserted: 4, note: 'Base cast: 1 new undead. Or reassert control over 4 existing.' },
    { slotLevel: 4, undeadCreated: 2, undeadReasserted: 6, note: 'Upcast to L4: 2 new undead. Reassert 6.' },
    { slotLevel: 5, undeadCreated: 3, undeadReasserted: 8, note: 'Upcast to L5: 3 new undead. Reassert 8.' },
    { slotLevel: 6, undeadCreated: 4, undeadReasserted: 10, note: 'Upcast to L6: 4 new.' },
  ],
  maintenanceCost: 'Must re-cast Animate Dead every 24 hours to maintain control. Uses slots daily.',
  maxArmy: 'Limited by daily spell slots for maintenance. Typically 8-14 undead is practical.',
  tip: 'Cast before long rest → 24-hour timer starts. Short rest → Arcane Recovery → cast more. Maximize first day.',
};

export const SKELETON_VS_ZOMBIE = {
  skeleton: { hp: 13, ac: 13, attacks: 'Shortbow (+4, 1d6+2) or Shortsword (+4, 1d6+2)', note: 'Ranged attacks! Archers are better. Line them up behind cover.', rating: 'S' },
  zombie: { hp: 22, ac: 8, attacks: 'Slam (+3, 1d6+1)', note: 'More HP, Undying Fortitude (CON save to go to 1 HP). Tanks. But low AC and bad damage.', rating: 'B' },
  verdict: 'Skeletons are almost always better. Ranged, better AC, better damage. Zombies only for meat shields.',
};

export const NECROMANCER_TACTICS = [
  { tactic: 'Skeleton archers', detail: '8 skeleton archers: 8 shortbow attacks (+4 each + PB extra damage). 8 × 0.65 × (3.5+2+PB) = massive DPR.', rating: 'S' },
  { tactic: 'Grim Harvest sustain', detail: 'Kill weak enemies with necromancy spells. Regain 3× spell level HP. Self-sustaining in combat.', rating: 'A' },
  { tactic: 'Command Undead steal', detail: 'L14: steal an enemy undead. Permanently control zombie/skeleton types. Turn the enemy\'s army.', rating: 'S' },
  { tactic: 'Speed management', detail: 'Have undead stat blocks ready. Roll all attacks at once. Use average damage. Don\'t slow down the table.', rating: 'N/A', note: 'This is a responsibility, not a tactic. Be prepared or don\'t play Necromancer.' },
];

export function undeadThrallsHP(baseHP, wizardLevel) {
  return baseHP + wizardLevel;
}

export function undeadThrallsDamage(baseDamage, proficiencyBonus) {
  return baseDamage + proficiencyBonus;
}

export function skeletonArcherDPR(skeletonCount, wizardLevel, targetAC) {
  const profBonus = Math.min(6, 2 + Math.floor((wizardLevel + 3) / 4));
  const attackBonus = 4; // Skeleton's base attack
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const damage = 3.5 + 2 + profBonus; // 1d6+2+PB (Undead Thralls)
  return skeletonCount * hitChance * damage;
}

export function maxUndead(dailySlots) {
  // Each L3 slot can reassert 4 undead
  return dailySlots * 4; // Rough max sustainable
}
