/**
 * playerShieldSpellOptGuide.js
 * Player Mode: Shield spell — the best defensive reaction in 5e
 * Pure JS — no React dependencies.
 */

export const SHIELD_SPELL_RULES = {
  level: 1,
  school: 'Abjuration',
  castingTime: '1 reaction (when hit by an attack or targeted by Magic Missile)',
  range: 'Self',
  components: 'V, S',
  duration: '1 round',
  classes: ['Sorcerer', 'Wizard'],
  subclasses: ['Hexblade Warlock', 'Artillerist Artificer', 'Battle Smith Artificer'],
  effect: '+5 AC until the start of your next turn, including against the triggering attack. Also blocks Magic Missile entirely.',
};

export const SHIELD_AC_BREAKPOINTS = [
  { baseAC: 10, withShield: 15, note: 'Unarmored Wizard. Shield makes you survivable.' },
  { baseAC: 13, withShield: 18, note: 'Mage Armor (13+DEX). With +2 DEX = AC 20 with Shield.' },
  { baseAC: 15, withShield: 20, note: 'Mage Armor + 2 DEX. AC 20 blocks most attacks.' },
  { baseAC: 16, withShield: 21, note: 'Medium armor + shield (physical). AC 21 is very hard to hit.' },
  { baseAC: 17, withShield: 22, note: 'Half plate. Most monsters need 15+ to hit AC 22.' },
  { baseAC: 18, withShield: 23, note: 'Plate or 20 DEX + Mage Armor. AC 23 blocks almost everything.' },
  { baseAC: 19, withShield: 24, note: '+1 plate or similar. Only bosses hit AC 24 reliably.' },
  { baseAC: 20, withShield: 25, note: '+1 plate + physical shield. AC 25 = near untouchable.' },
];

export const WHEN_TO_CAST_SHIELD = [
  { situation: 'Attack hits your AC by 1-5', priority: 'Always', detail: '+5 will turn the hit into a miss. Maximum value.' },
  { situation: 'Attack hits by exactly 0 (ties)', priority: 'Always', detail: 'Ties go to attacker. Shield makes it a miss.' },
  { situation: 'Attack hits by 6+', priority: 'Rarely', detail: 'Shield won\'t help THIS attack. But +5 AC for the whole round might block others.' },
  { situation: 'Magic Missile incoming', priority: 'Always', detail: 'Shield completely negates Magic Missile. Auto-hit spell → auto-miss.' },
  { situation: 'Multiple enemies likely to attack you', priority: 'High', detail: 'Shield lasts until your next turn. Blocks attacks from ALL enemies.' },
  { situation: 'Low on spell slots', priority: 'Consider carefully', detail: 'Is avoiding this hit worth a spell slot? At 50+ HP, maybe not.' },
  { situation: 'Concentrating on important spell', priority: 'High', detail: 'Avoiding the hit = no concentration save needed.' },
];

export const SHIELD_OPTIMIZATION = [
  { method: 'Mage Armor + Shield', totalAC: '13+DEX+5', note: 'Standard Wizard defensive combo. Effective AC 18-20.' },
  { method: 'Armor + Shield (equip) + Shield (spell)', totalAC: 'Armor+2+5', note: 'Hexblade/Artificer: physical shield + spell Shield stack.' },
  { method: 'War Caster feat', benefit: 'Cast Shield with hands full (weapon+shield).', note: 'Essential for gish builds using Shield spell.' },
  { method: 'Abjuration Wizard', benefit: 'Shield triggers Arcane Ward recharge.', note: 'Every Shield cast adds temp HP to your ward.' },
  { method: 'Eldritch Adept: Armor of Shadows', benefit: 'At-will Mage Armor (save slots for Shield).', note: 'Free Mage Armor = more L1 slots for Shield.' },
];

export const SHIELD_VS_OTHER_REACTIONS = [
  { spell: 'Absorb Elements', when: 'Elemental damage (save-based). Shield doesn\'t help vs DEX saves.', verdict: 'AE for saves, Shield for attacks.' },
  { spell: 'Silvery Barbs', when: 'Enemy succeeds on a save. Shield is defensive, Barbs is offensive.', verdict: 'Different roles. Both essential.' },
  { spell: 'Counterspell', when: 'Enemy casts a spell. Counterspell prevents; Shield only helps AC.', verdict: 'Counterspell for spells, Shield for attacks.' },
  { spell: 'Hellish Rebuke', when: 'When hit by attack. Shield prevents hit; Rebuke retaliates.', verdict: 'Shield is almost always better.' },
];

export const SHIELD_TIPS = [
  'Shield lasts until your NEXT TURN. It blocks all attacks that round, not just the trigger.',
  'You can see the attack roll result before deciding to cast Shield.',
  'Shield blocks Magic Missile completely — the missiles just fizzle.',
  'At L1-2, Shield slots are precious. At L5+, L1 slots are cheap insurance.',
  'Hexblades get Shield on their spell list — massive for melee Warlocks.',
  'If you\'re a Wizard with Mage Armor + Shield, you\'re tankier than many martials for 1 round.',
  'Don\'t forget: Shield requires a free hand for Somatic component (unless War Caster).',
];
