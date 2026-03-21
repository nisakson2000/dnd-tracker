/**
 * playerFamiliarTacticsExpandedGuide.js
 * Player Mode: Find Familiar tactics — forms, combos, Chain Pact, and optimization
 * Pure JS — no React dependencies.
 */

export const FIND_FAMILIAR_BASICS = {
  spell: 'Find Familiar (1st level, Ritual)',
  casting: '1 hour ritual. 10 gp incense.',
  duration: 'Permanent until killed. Resummon for 10 gp.',
  action: 'Familiar acts independently. Own initiative. Can\'t attack.',
  senses: 'You can see through its eyes/ears as an action (no range limit).',
  touch: 'Can deliver touch spells within 100ft.',
  dismiss: 'Action to dismiss to pocket dimension. Action to resummon within 30ft.',
};

export const BEST_FAMILIAR_FORMS = [
  { form: 'Owl', rating: 'S+', flySpeed: '60ft', special: 'Flyby (no OAs). 120ft darkvision.', use: 'Best combat familiar. Help action → fly away. No OA.' },
  { form: 'Hawk', rating: 'A+', flySpeed: '60ft', special: 'Advantage on Perception (sight).', use: 'Scouting. Good Perception.' },
  { form: 'Bat', rating: 'A', flySpeed: '30ft', special: 'Blindsight 60ft. Echolocation.', use: 'Underground/dark scouting. Detects invisible.' },
  { form: 'Cat', rating: 'A', flySpeed: 'None (40ft walk, 30ft climb)', special: 'Stealth +4. Tiny.', use: 'Urban infiltration. Fits in small spaces.' },
  { form: 'Spider', rating: 'A+', flySpeed: 'None (20ft walk, 20ft climb)', special: 'Web Sense. Darkvision. Spider Climb.', use: 'Climb anywhere. Web vibration sensing. Very stealthy.' },
  { form: 'Raven', rating: 'A', flySpeed: '50ft', special: 'Mimicry (mimic sounds/voices).', use: 'Distraction. Message delivery.' },
  { form: 'Octopus', rating: 'B+ (underwater)', flySpeed: 'None (5ft walk, 30ft swim)', special: 'Ink cloud. Underwater breathing.', use: 'Aquatic campaigns only.' },
  { form: 'Weasel', rating: 'B+', flySpeed: 'None (30ft walk)', special: 'Advantage on Perception (smell).', use: 'Tracking. Small enough to hide.' },
];

export const CHAIN_PACT_FAMILIARS = [
  { form: 'Imp', rating: 'S+', special: 'Invisible at will. Shapechange. Devil\'s Sight. Resistance to nonmagical.', use: 'Best Chain familiar. Permanent invisibility. Delivers touch spells invisible.' },
  { form: 'Pseudodragon', rating: 'A+', special: 'Magic Resistance. Sting (sleep poison). Blindsight 10ft.', use: 'Magic Resistance advantage on saves. Sleep sting.' },
  { form: 'Quasit', rating: 'A+', special: 'Invisible at will. Shapechange. Scare (1/day).', use: 'Similar to Imp. Scare for fear effect.' },
  { form: 'Sprite', rating: 'A', special: 'Invisible. Heart Sight (detect alignment). Shortbow.', use: 'Detect lies/alignment. Can attack (shortbow + sleep poison).' },
];

export const FAMILIAR_COMBAT_TACTICS = [
  { tactic: 'Help Action (Owl)', method: 'Owl flies in, Help action on enemy, flies away (Flyby). Ally gets advantage.', rating: 'S+' },
  { tactic: 'Touch Spell Delivery', method: 'Familiar delivers Shocking Grasp, Inflict Wounds, Bestow Curse, etc.', rating: 'S' },
  { tactic: 'Dragon\'s Breath Familiar', method: 'Cast Dragon\'s Breath on familiar. It uses breath weapon each turn.', rating: 'S+ (15ft cone AoE)' },
  { tactic: 'Invisible Imp Scout', method: 'Imp goes invisible. Scouts ahead. Shares senses.', rating: 'S+' },
  { tactic: 'Gift of the Ever-Living Ones', method: 'Chain Pact invocation. Max healing when familiar within 100ft.', rating: 'S (Warlock)' },
  { tactic: 'Flanking Partner', method: 'If using flanking rules: familiar on opposite side = advantage.', rating: 'A (optional rule)' },
  { tactic: 'Pocket Dimension Emergency', method: 'Dismiss familiar as action. Resummon later. Saves from AoE.', rating: 'A' },
  { tactic: 'Object Interaction', method: 'Familiar uses item (potions, caltrops, ball bearings). Opens doors.', rating: 'A' },
];

export const FAMILIAR_UTILITY = [
  'Scouting: see through eyes. No range limit. Send ahead.',
  'Message delivery: Raven can mimic voice. Send messages.',
  'Trap detection: send familiar first. If killed, resummon for 10 gp.',
  'Lock picking: tiny familiar (spider) fits through keyholes.',
  'Distraction: familiar draws attention while party moves.',
  'Surveillance: leave familiar in room. Check through its senses later.',
  'Underwater recon: octopus form for aquatic environments.',
  'Night watch: bat with blindsight for underground camps.',
];

export const FAMILIAR_TIPS = [
  'Owl: best combat familiar. Flyby Help action every round. Free advantage.',
  'Dragon\'s Breath on familiar: concentration but familiar breathes 3d6 AoE each turn.',
  'Imp (Chain Pact): invisible at will. Delivers invisible touch spells. Best familiar.',
  'Gift of the Ever-Living Ones: all healing dice MAXIMIZED. Familiar must be within 100ft.',
  'Your familiar can\'t attack (except Chain Pact). Help action is its combat role.',
  'Resummon costs 10 gp. Cheap. Don\'t be afraid to use it as a scout.',
  'Touch spell delivery: familiar uses YOUR spell attack modifier.',
  'Dismiss to pocket dimension before AoE. Resummon safely after.',
  'Spider form: climb on ceiling. Web Sense detects vibrations.',
  'Multiple forms: resummon in different form as needed. 1 hour ritual.',
];
