/**
 * playerLevelUpPrioritiesGuide.js
 * Player Mode: Level-up priorities — what to do at each tier
 * Pure JS — no React dependencies.
 */

export const LEVEL_TIERS = [
  { tier: 'Tier 1 (L1-4)', name: 'Local Heroes', theme: 'Learning basics. Survival is priority. Resources are scarce.', note: 'Most vulnerable. One crit can kill.' },
  { tier: 'Tier 2 (L5-10)', name: 'Heroes of the Realm', theme: 'Power spikes. Extra Attack, L3 spells. You\'re formidable.', note: 'Most campaigns spend the most time here.' },
  { tier: 'Tier 3 (L11-16)', name: 'Masters of the Realm', theme: 'High-level features. Reality-bending abilities.', note: 'Casters pull ahead. Martials need magic items.' },
  { tier: 'Tier 4 (L17-20)', name: 'Masters of the World', theme: 'L9 spells. Wish. True Polymorph. Gods-level power.', note: 'Very few campaigns reach this tier.' },
];

export const KEY_LEVEL_SPIKES = [
  { level: 1, spike: 'Character creation', note: 'Racial features, class features, starting gear.' },
  { level: 2, spike: 'Subclass (some)', classes: 'Cleric, Druid, Wizard get subclass at L2.', note: 'Significant power from subclass features.' },
  { level: 3, spike: 'Subclass (most)', classes: 'Most classes get subclass. Martials get key features.', note: 'L2 spells for half-casters. Biggest early spike for many.' },
  { level: 4, spike: 'First ASI/Feat', note: '+2 to main stat OR a feat. Critical choice.', tip: 'Usually: max your main stat. If 16 already: consider a half-feat to reach 18.' },
  { level: 5, spike: 'BIGGEST power spike', note: 'Extra Attack (martials), L3 spells (casters: Fireball, Spirit Guardians, Hypnotic Pattern).', tip: 'NEVER multiclass before L5. This is the most important level.' },
  { level: 6, spike: 'Subclass feature', note: 'Most classes get a subclass feature here. Paladin gets Aura of Protection.', tip: 'Paladin 6 is a key multiclass breakpoint.' },
  { level: 7, spike: 'L4 spells', note: 'Polymorph, Banishment, Greater Invisibility, Wall of Fire.', tip: 'Major control spells online.' },
  { level: 8, spike: 'Second ASI/Feat', note: 'Max your main stat if you haven\'t. Or take a power feat.', tip: 'GWM, SS, PAM, War Caster — now or never for these.' },
  { level: 9, spike: 'L5 spells', note: 'Wall of Force, Animate Objects, Steel Wind Strike, Destructive Wave.', tip: 'Another major power spike for casters.' },
  { level: 11, spike: 'Third Extra Attack (Fighter) / L6 spells', note: 'Disintegrate, Heal, Sunbeam. Fighters get 3 attacks.', tip: 'Caster-martial gap widens.' },
  { level: 13, spike: 'L7 spells', note: 'Forcecage, Simulacrum, Teleport, Plane Shift.', tip: 'Game-changing spells. Campaign-level power.' },
  { level: 17, spike: 'L9 spells', note: 'Wish, True Polymorph, Meteor Swarm.', tip: 'Reality-warping power. Campaign endgame.' },
  { level: 20, spike: 'Capstone', note: 'Class capstone abilities. Druid: unlimited Wild Shape. Barbarian: 24 STR/CON.', tip: 'Most capstones are disappointing. Multiclass is often better at 20.' },
];

export const ASI_PRIORITY = {
  martials: [
    'L4: +2 main stat (STR or DEX to 18)',
    'L6 (Fighter): Power feat (GWM, SS, PAM)',
    'L8: Max main stat to 20 OR second feat',
    'L12+: CON, feats (Resilient, Lucky), or secondary stat',
  ],
  casters: [
    'L4: +2 casting stat (to 18)',
    'L8: Max casting stat to 20',
    'L12: War Caster or Resilient (CON)',
    'L16+: Lucky, Alert, or Tough',
  ],
  halfCasters: [
    'L4: +2 main stat',
    'L8: Max main stat to 20 OR power feat',
    'L12: Secondary stat or feat',
  ],
  note: 'Max your primary stat FIRST. Everything else is secondary.',
};

export const LEVEL_UP_CHECKLIST = [
  'Update HP: roll or take average. Add CON mod.',
  'Check for new class features at this level.',
  'Check for subclass feature at this level.',
  'If ASI level (4/8/12/16/19): choose +2 stat or feat.',
  'If caster: check for new spell level access. Choose/prepare new spells.',
  'Update proficiency bonus if it increased (L5, 9, 13, 17).',
  'Update spell save DC and spell attack bonus if casting stat or PB changed.',
  'Update passive Perception/Investigation if WIS or PB changed.',
  'Check multiclass breakpoints: is now the right time to dip?',
];

export const FEAT_TIMING = {
  earlyFeats: ['Fey Touched (half-feat, L4)', 'PAM (martial, L4)', 'War Caster (caster, L4)'],
  midFeats: ['GWM/SS (L8 after stat max)', 'Sentinel (L8-12)', 'Resilient CON (L12)'],
  lateFeats: ['Lucky (anytime but often L12+)', 'Alert (L12+)', 'Tough (L12+)'],
  note: 'Half-feats at L4 (stat boost + effect). Full feats at L8+ (after main stat maxed).',
};
