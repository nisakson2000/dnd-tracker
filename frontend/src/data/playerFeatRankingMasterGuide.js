/**
 * playerFeatRankingMasterGuide.js
 * Player Mode: Complete feat tier list — ranked by power and build
 * Pure JS — no React dependencies.
 */

export const FEAT_TIER_S = [
  { feat: 'Great Weapon Master', builds: 'STR melee (two-handed)', effect: '-5 to hit, +10 damage. BA attack on kill/crit.', note: 'Best martial feat. Advantage negates the -5.' },
  { feat: 'Sharpshooter', builds: 'Ranged', effect: '-5/+10. No long range disadvantage. Ignore cover.', note: 'Best ranged feat. Archery style helps offset.' },
  { feat: 'Polearm Master', builds: 'Glaive/halberd/QS/spear', effect: 'BA 1d4 attack. OA when creature enters reach.', note: 'God combo with Sentinel.' },
  { feat: 'Sentinel', builds: 'Tanks/melee', effect: 'OA = speed 0. OA on Disengage. OA when ally attacked.', note: 'Best tank feat. Locks enemies.' },
  { feat: 'Crossbow Expert', builds: 'Hand crossbow', effect: 'Ignore loading. BA hand crossbow. No melee disadvantage.', note: 'Core for hand crossbow + Sharpshooter.' },
  { feat: 'War Caster', builds: 'Casters (gish)', effect: 'Advantage concentration. Somatic with hands full. Spell OA.', note: 'Booming Blade OA is incredible.' },
  { feat: 'Lucky', builds: 'Any', effect: '3 rerolls per LR. Force enemy reroll.', note: 'Best universal feat. Some DMs ban it.' },
  { feat: 'Alert', builds: 'Any', effect: '+5 initiative. Can\'t be surprised.', note: 'Going first is incredibly valuable.' },
  { feat: 'Resilient (CON)', builds: 'Casters', effect: 'CON save proficiency. +1 CON.', note: 'Better than War Caster for concentration at high level.' },
];

export const FEAT_TIER_A = [
  { feat: 'Fey Touched', effect: 'Free Misty Step + 1 spell. +1 mental stat.', note: 'Best half-feat for casters.' },
  { feat: 'Shadow Touched', effect: 'Free Invisibility + 1 spell. +1 mental stat.', note: 'Good but Fey Touched usually better.' },
  { feat: 'Elven Accuracy', effect: 'Triple advantage (3d20). Elf/Half-Elf only.', note: 'Crit fishing machine.' },
  { feat: 'Skill Expert', effect: '+1 any. Proficiency + Expertise.', note: 'Athletics expertise for grapplers.' },
  { feat: 'Telekinetic', effect: 'BA shove 5ft (no save). Invisible Mage Hand.', note: 'Free BA action economy.' },
  { feat: 'Mobile', effect: '+10 speed. Free Disengage from attacked targets.', note: 'Saves Monks ki every turn.' },
  { feat: 'Tough', effect: '+2 HP per level.', note: 'Simple but massive HP boost.' },
  { feat: 'Ritual Caster', effect: 'Learn ritual spells from any class.', note: 'Find Familiar on a Fighter = amazing.' },
  { feat: 'Metamagic Adept', effect: '2 metamagic + 2 SP.', note: 'Subtle Counterspell on a Wizard.' },
  { feat: 'Chef', effect: '+1d8 HP on SR for PB creatures. Temp HP treats.', note: 'Great support feat. +1 CON/WIS.' },
];

export const FEAT_TIER_B = [
  { feat: 'Dual Wielder', note: '+1 AC dual-wielding. Non-light TWF. B+.' },
  { feat: 'Healer', note: '1d6+4+level HP once per creature per SR with healer\'s kit. B+.' },
  { feat: 'Inspiring Leader', note: 'Level+CHA temp HP to 6 creatures. 10 min speech. B+.' },
  { feat: 'Mounted Combatant', note: 'Advantage vs smaller. Redirect attacks. Mount Evasion. B+.' },
  { feat: 'Defensive Duelist', note: '+PB AC reaction with finesse weapon. B.' },
  { feat: 'Magic Initiate', note: '2 cantrips + 1 L1 from another class. B.' },
  { feat: 'Actor', note: '+1 CHA. Advantage on disguise Deception/Performance. B.' },
  { feat: 'Observant', note: '+5 passive Perception/Investigation. +1 INT/WIS. B.' },
  { feat: 'Savage Attacker', note: 'Reroll damage once/turn. ~+1 DPR. Weak. C+.' },
];

export const FEAT_SELECTION_TIPS = [
  'Max your primary stat to 20 FIRST, then take feats. Exception: half-feats on odd scores.',
  'Half-feats (+1 stat) are best when you have an odd ability score. 15 → 16 is huge.',
  'Variant Human and Custom Lineage get free feat at L1. Pick a build-defining one.',
  'Fighters get 7 ASIs. Take more feats than any other class.',
  'Don\'t take feats that don\'t match your build. GWM on a DEX Fighter is wasted.',
  'Check prerequisites: some feats need specific stats, armor, or racial requirements.',
];
