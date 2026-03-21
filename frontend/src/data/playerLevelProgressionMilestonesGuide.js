/**
 * playerLevelProgressionMilestonesGuide.js
 * Player Mode: Key power spikes and milestones at each level
 * Pure JS — no React dependencies.
 */

export const POWER_SPIKE_LEVELS = [
  { level: 1, milestone: 'Character Creation', gains: ['Class features.', 'Starting equipment.', 'Background skills.'], note: 'You\'re squishy. Be careful.' },
  { level: 2, milestone: 'Subclass (some classes)', gains: ['Subclass for Cleric, Druid, Wizard, Warlock, Sorcerer.', 'Action Surge (Fighter).', 'Reckless Attack (Barbarian).', 'Cunning Action (Rogue).'], note: 'Big power boost. Many classes get their identity here.' },
  { level: 3, milestone: 'Subclass (most classes)', gains: ['Subclass for Fighter, Barbarian, Rogue, Ranger, Monk, Paladin, Bard, Artificer.', 'L2 spells for half-casters.'], note: 'Every class now has a subclass. Major identity point.' },
  { level: 4, milestone: 'First ASI/Feat', gains: ['+2 to a stat or a feat.', 'Max primary stat to 18 if possible.'], note: 'Huge decision point. Stats vs feats.' },
  { level: 5, milestone: 'THE Power Spike', gains: ['Extra Attack (martials).', 'L3 spells (full casters): Fireball, Counterspell, Spirit Guardians.', 'Proficiency bonus goes to +3.', 'Cantrip damage increases.'], note: 'BIGGEST power spike in 5e. Everything doubles.' },
  { level: 6, milestone: 'Subclass Feature', gains: ['Paladin: Aura of Protection (+CHA to all saves).', 'Extra Attack for some classes.', 'Subclass features.'], note: 'Paladin L6 = best feature in the game.' },
  { level: 7, milestone: 'L4 Spells / Subclass', gains: ['Polymorph, Banishment (casters).', 'Subclass features.', 'Evasion (Rogue, Monk).'], note: 'Polymorph is game-changing. Giant Ape (157 HP).' },
  { level: 8, milestone: 'Second ASI/Feat', gains: ['+2 to a stat or a feat.', 'Max primary stat to 20.'], note: 'Max your primary stat. Or take key feat.' },
  { level: 9, milestone: 'L5 Spells', gains: ['Wall of Force, Animate Objects, Synaptic Static.', 'Proficiency bonus goes to +4.'], note: 'High-impact spells. Encounters change dramatically.' },
  { level: 11, milestone: 'Tier 3 Begins', gains: ['L6 spells: Mass Suggestion, Heroes\' Feast.', 'Extra Attack (3) for Fighter.', 'Improved Divine Smite (Paladin).'], note: 'You\'re now very powerful. World-shaking threats.' },
  { level: 13, milestone: 'L7 Spells', gains: ['Forcecage, Simulacrum, Teleport, Plane Shift.', 'Proficiency bonus goes to +5.'], note: 'Reality-bending magic. Travel across planes.' },
  { level: 17, milestone: 'Tier 4 Begins', gains: ['L9 spells: Wish, True Polymorph, Foresight.', 'Proficiency bonus goes to +6.', 'Capstone features approaching.'], note: 'Godlike power. Few campaigns reach this.' },
  { level: 20, milestone: 'Capstone', gains: ['Class capstone feature.', 'All features unlocked.', 'Unlimited Rage (Barbarian).', 'Primal Champion (Barbarian): +4 STR/CON.'], note: 'Full power. Very rare to reach.' },
];

export const MULTICLASS_DELAY_COST = {
  delayExtraAttack: 'Delaying L5 = no Extra Attack while allies have it. Massive DPR loss.',
  delayL3Spells: 'Delaying L5 (caster) = no Fireball/Counterspell. Huge power gap.',
  delayAura: 'Delaying Paladin L6 = no Aura of Protection. Best feature delayed.',
  rule: 'ALWAYS get to L5-6 in your main class before multiclassing.',
};

export const WHEN_TO_MULTICLASS = [
  { timing: 'After L5', why: 'Extra Attack or L3 spells secured. Can afford 1-3 level dip.', examples: 'Fighter 5 → Warlock 1-2. Paladin 6 → Hexblade 1-2.' },
  { timing: 'After L6 (Paladin)', why: 'Aura of Protection secured. This feature defines Paladin.', examples: 'Paladin 6 → Sorcerer/Warlock/Bard.' },
  { timing: 'L1 (Hexblade dip)', why: 'Some builds start with 1 level dip then go main class.', examples: 'Hexblade 1 → Paladin X. CHA for attacks from level 1.' },
  { timing: 'Never', why: 'Single class is simpler and still powerful. 13+ features are strong.', examples: 'Full Wizard, full Paladin, full Cleric.' },
];

export const PROGRESSION_TIPS = [
  'L5 is THE power spike. Extra Attack + L3 spells. Everything doubles.',
  'Never delay L5 in your primary class. The gap is too big.',
  'Paladin L6: Aura of Protection. Don\'t multiclass before this.',
  'L4/L8: ASIs. Max primary stat. +1 = 5% more success.',
  'L9: L5 spells. Wall of Force, Animate Objects. Game-changers.',
  'Tier 3 (L11+): you\'re genuinely powerful. Threats match.',
  'L13: L7 spells. Forcecage, Simulacrum. Reality-breaking.',
  'L17: L9 spells. Wish, True Polymorph. Godlike power.',
  'Cantrip damage scales at L5, 11, 17. Character level, not class.',
  'Proficiency bonus: +2 (L1), +3 (L5), +4 (L9), +5 (L13), +6 (L17).',
];
