/**
 * playerLevelUpDecisionGuide.js
 * Player Mode: What to do at each level — decisions, milestones, and priorities
 * Pure JS — no React dependencies.
 */

export const KEY_LEVEL_MILESTONES = [
  { level: 1, milestone: 'Character Creation', detail: 'Class features, race, background, starting equipment. You\'re squishy. Play carefully.' },
  { level: 2, milestone: 'First Subclass Features (some classes)', detail: 'Cleric/Druid/Wizard/Sorcerer/Warlock get subclass at L1-2. Major power spike.' },
  { level: 3, milestone: 'Subclass (most classes)', detail: 'Fighter, Rogue, Barbarian, Bard, Paladin, Ranger, Monk, Artificer get subclass. Big decision.' },
  { level: 4, milestone: 'First ASI/Feat', detail: 'Most important character decision after class. +2 primary stat or a feat.' },
  { level: 5, milestone: 'BIGGEST POWER SPIKE', detail: 'Extra Attack, 3rd-level spells (Fireball, Hypnotic Pattern, Spirit Guardians). Game changes here.' },
  { level: 6, milestone: 'Subclass Feature', detail: 'Most subclasses get a feature. Paladin: Aura of Protection (game-changing).' },
  { level: 7, milestone: 'Varied Features', detail: 'Class-specific. Some get subclass features.' },
  { level: 8, milestone: 'Second ASI/Feat', detail: 'Max primary stat to 20 if possible. Or take a key feat.' },
  { level: 9, milestone: '5th-Level Spells', detail: 'Wall of Force, Animate Objects, Greater Restoration. Casters jump in power again.' },
  { level: 10, milestone: 'Subclass Feature', detail: 'Third subclass feature. Some are very powerful (Aura of Courage).' },
  { level: 11, milestone: 'SECOND BIG SPIKE', detail: 'Fighter: 3rd attack. Casters: 6th-level spells. Martials get class features.' },
  { level: 12, milestone: 'Third ASI/Feat', detail: 'Third opportunity to customize. Most characters are fully online by now.' },
  { level: 13, milestone: '7th-Level Spells', detail: 'Forcecage, Plane Shift, Simulacrum. Campaign-altering magic.' },
  { level: 14, milestone: 'Subclass Capstone', detail: 'Final subclass feature for most classes. Often very powerful.' },
  { level: 16, milestone: 'Fourth ASI/Feat', detail: 'Max a secondary stat or take a luxury feat.' },
  { level: 17, milestone: 'TIER 4 BEGINS', detail: '9th-level spells: Wish, True Polymorph, Meteor Swarm. God-tier abilities.' },
  { level: 19, milestone: 'Fifth ASI/Feat', detail: 'Fifth customization point. Characters are nearly complete.' },
  { level: 20, milestone: 'Capstone', detail: 'Class capstone feature. Some amazing (Druid: unlimited Wild Shape), some underwhelming (Ranger).' },
];

export const ASI_FEAT_DECISION_BY_LEVEL = [
  {
    level: 4,
    priority: 'Max primary stat OR key combat feat',
    recommendations: [
      'If primary stat is 15 or 17: half-feat (Fey Touched, Resilient, etc.) to round up.',
      'If primary stat is 16: +2 ASI to reach 18.',
      'V.Human with L1 feat: you can afford to take another feat here.',
      'GWM/PAM/CBE at L4 if you already have 16+ in your attack stat.',
    ],
  },
  {
    level: 8,
    priority: 'Max primary stat to 20 if possible',
    recommendations: [
      'If primary is 18: +2 to reach 20. This is almost always correct.',
      'If primary is already 20: take best available feat.',
      'Casters: consider War Caster or Resilient (CON) if concentrating often.',
      'Martials: Sentinel, PAM, GWM, Sharpshooter if not taken yet.',
    ],
  },
  {
    level: 12,
    priority: 'Secondary stat or powerful feat',
    recommendations: [
      'Primary should be 20 by now. Work on CON, DEX, or WIS.',
      'Lucky is always good here. 3 rerolls per LR.',
      'Martials: fill out feat combos (PAM + Sentinel, CBE + Sharpshooter).',
      'Casters: Resilient (CON) if not taken, or utility feats.',
    ],
  },
  {
    level: 16,
    priority: 'Luxury feats or secondary stats',
    recommendations: [
      'Tough for more HP. Alert for initiative.',
      'Observant for +5 passive Perception.',
      'Max CON if it\'s been lagging.',
      'This is a "nice to have" level. Your build should already work.',
    ],
  },
  {
    level: 19,
    priority: 'Capstone prep or final customization',
    recommendations: [
      'If you\'re reaching L20, consider whether your capstone is worth it vs multiclassing.',
      'Most capstones are good but not essential. Fighter and Druid capstones are excellent.',
      'Take whatever rounds out your character.',
    ],
  },
];

export const SPELL_LEVEL_PRIORITIES = [
  { spellLevel: 1, mustHave: ['Shield', 'Healing Word', 'Bless', 'Find Familiar'], note: 'Utility and emergency spells. These stay relevant forever.' },
  { spellLevel: 2, mustHave: ['Web', 'Spiritual Weapon', 'Misty Step', 'Pass Without Trace'], note: 'Strong control and utility. Web is S-tier.' },
  { spellLevel: 3, mustHave: ['Fireball', 'Hypnotic Pattern', 'Spirit Guardians', 'Counterspell'], note: 'THE power spike. These define your combat role.' },
  { spellLevel: 4, mustHave: ['Polymorph', 'Banishment', 'Greater Invisibility', 'Dimension Door'], note: 'Single-target removal and major utility.' },
  { spellLevel: 5, mustHave: ['Wall of Force', 'Animate Objects', 'Raise Dead', 'Greater Restoration'], note: 'Fight-ending and campaign-critical spells.' },
  { spellLevel: 6, mustHave: ['Heal', 'Mass Suggestion', 'Sunbeam', 'Heroes\' Feast'], note: 'Powerful but situational. Heroes\' Feast before boss fights.' },
  { spellLevel: 7, mustHave: ['Forcecage', 'Plane Shift', 'Simulacrum', 'Resurrection'], note: 'Campaign-altering. Forcecage has no save.' },
  { spellLevel: 8, mustHave: ['Maze', 'Mind Blank', 'Feeblemind', 'Clone'], note: 'Near-guaranteed removal (Maze, Feeblemind). Clone = immortality.' },
  { spellLevel: 9, mustHave: ['Wish', 'True Polymorph', 'Meteor Swarm', 'Foresight'], note: 'God-tier. Wish can do anything. Foresight = 8hr super-advantage.' },
];

export const LEVEL_UP_TIPS = [
  'L5 is the most important level. Don\'t multiclass before L5 unless you know what you\'re doing.',
  'Max your primary stat to 20 by L8 if possible. +5 vs +4 matters.',
  'Read ALL your new features before the next session. Don\'t discover them mid-combat.',
  'Update your spell list when you level up. Prepared casters: reassess daily.',
  'If multiclassing, plan your breakpoints. Know what you lose and what you gain.',
  'HP increases matter. Roll or take average — know your DM\'s house rule.',
  'At odd levels (L7, L9, L13), casters get new spell levels. Check what\'s available.',
  'L11 is the second biggest spike. Casters get L6 spells, Fighters get 3rd attack.',
  'L17+ is Tier 4. The game changes fundamentally. 9th-level spells exist.',
  'Don\'t skip Proficiency Bonus increases (L5, L9, L13, L17). They boost everything.',
];
