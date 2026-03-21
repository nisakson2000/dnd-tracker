/**
 * playerBestPolymorphFormsGuide.js
 * Player Mode: Polymorph spell — best forms, tactics, and rules
 * Pure JS — no React dependencies.
 */

export const POLYMORPH_RULES = {
  level: 'L4 (Druid, Sorcerer, Wizard, Bard)',
  target: 'One creature. WIS save (unwilling). Willing = auto.',
  newForm: 'Beast with CR ≤ target\'s level or CR.',
  stats: 'All game statistics replaced by beast\'s (including mental).',
  hp: 'Gain beast HP. When beast HP 0, revert with original HP.',
  duration: '1 hour (concentration).',
  note: 'Can\'t cast spells in beast form.',
};

export const BEST_FORMS = [
  { form: 'Giant Ape', cr: '8', hp: '157', attacks: '2x Fist +9, 3d10+6', note: 'THE form. 157 HP + 2 attacks. Best overall.' },
  { form: 'T-Rex', cr: '8', hp: '136', attacks: 'Bite +10, 4d12+7', note: 'Higher damage. Huge size.' },
  { form: 'Mammoth', cr: '6', hp: '126', attacks: 'Gore + Stomp', note: '126 HP. Trampling Charge prone.' },
  { form: 'Giant Crocodile', cr: '5', hp: '85', attacks: 'Bite (grapple) + Tail', note: 'Grapple bite. Good in water.' },
  { form: 'Killer Whale', cr: '3', hp: '90', speed: '60ft swim', note: 'Best underwater form.' },
  { form: 'Giant Constrictor Snake', cr: '2', hp: '60', attacks: 'Grapple + restrain', note: 'Best control form at lower levels.' },
  { form: 'Giant Scorpion', cr: '3', hp: '52', attacks: '2 Claws + poison Sting', note: 'Mid-level option with poison.' },
];

export const POLYMORPH_TACTICS = [
  { tactic: 'HP Battery', how: 'Polymorph downed ally (0 HP) → Giant Ape (157 HP).' },
  { tactic: 'Boss Removal', how: 'Polymorph boss into turtle. Handle adds first.' },
  { tactic: 'Emergency Tank', how: 'Polymorph squishy caster → Giant Ape. They tank.' },
  { tactic: 'Self-Polymorph', how: 'You become Giant Ape. You control it. 157 HP.' },
  { tactic: 'Scout Form', how: 'Become a hawk. Fly over territory. Beast INT though.' },
];

export const POLYMORPH_WARNINGS = [
  'Mental stats become beast\'s. Giant Ape INT = 7.',
  'Can\'t cast spells in beast form.',
  'Concentration: one hit could break it.',
  'Excess damage carries to real form.',
  'Dispel Magic ends Polymorph instantly.',
];

export const POLYMORPH_TIPS = [
  'Giant Ape: 157 HP, 2 attacks. THE Polymorph form.',
  'Polymorph downed allies. 0 HP → 157 HP.',
  'Polymorph the boss into a turtle. Fight adds.',
  'Mental stats change. Can\'t strategize as beast.',
  'Concentration! Protect it.',
  'Dispel Magic instantly reverts. Beware.',
  'Excess damage carries over.',
  'No spellcasting in beast form.',
  'T-Rex: more damage than Giant Ape.',
  'Mammoth: 126 HP with Trampling Charge.',
];
