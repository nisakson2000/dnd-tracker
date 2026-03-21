/**
 * playerFamiliarTacticsGuide.js
 * Player Mode: Find Familiar optimization — best forms, tactics, and uses
 * Pure JS — no React dependencies.
 */

export const FAMILIAR_RULES = {
  spell: 'Find Familiar (L1 Wizard, ritual). Also via Magic Initiate, Ritual Caster, Pact of the Chain.',
  action: 'Familiar acts on its own initiative. Can\'t attack (unless Pact of the Chain).',
  senses: 'You can see through your familiar\'s eyes as an action (and are blind/deaf to your own senses).',
  touch: 'Familiar can deliver touch spells. Uses your reaction when familiar is within 100ft.',
  dismiss: 'Dismiss to pocket dimension as an action. Resummon within 30ft.',
  death: 'If familiar dies, spend 10gp + 1 hour to resummon. Or spend a slot if you have Find Familiar prepared.',
  note: 'Familiar is a spirit, not a beast. Immune to some beast-only effects.',
};

export const BEST_FAMILIAR_FORMS = [
  { form: 'Owl', rating: 'S+', speed: '60ft fly', hp: '1', senses: 'Darkvision 120ft, keen sight/hearing', why: 'Flyby: no opportunity attacks when flying out of reach. Help action + fly away = free advantage.', note: 'Best combat familiar. Flyby is unmatched.' },
  { form: 'Hawk', rating: 'A', speed: '60ft fly', hp: '1', senses: 'Keen sight', why: 'Good flyer. Keen sight for scouting. No flyby though.', note: 'Worse owl in most cases. Pick owl.' },
  { form: 'Cat', rating: 'A', speed: '40ft, climb 30ft', hp: '2', senses: 'Darkvision, keen smell', why: 'Stealth +4. Fits in urban settings. Inconspicuous.', note: 'Best urban familiar. Nobody suspects a cat.' },
  { form: 'Spider', rating: 'A+', speed: '20ft, climb 20ft', hp: '1', senses: 'Darkvision, web sense', why: 'Tiny. Web sense. Spider Climb. Infiltrate anywhere.', note: 'Best infiltration familiar. Fits through cracks.' },
  { form: 'Bat', rating: 'B+', speed: '30ft fly', hp: '1', senses: 'Blindsight 60ft', why: 'Blindsight 60ft. Sees in magical darkness.', note: 'Blindsight beats illusions and darkness. Niche but powerful.' },
  { form: 'Octopus', rating: 'B', speed: '30ft swim', hp: '3', senses: 'Darkvision 30ft', why: 'Underwater scouting. Ink cloud.', note: 'Aquatic campaigns only. Best underwater familiar.' },
  { form: 'Rat', rating: 'B', speed: '20ft', hp: '1', senses: 'Darkvision 30ft, keen smell', why: 'Inconspicuous in urban/dungeon settings. Tiny.', note: 'Like a worse cat. But nobody looks twice at a rat.' },
];

export const CHAIN_PACT_FAMILIARS = [
  { form: 'Imp', rating: 'S+', hp: '10', abilities: 'Invisible at will. Fly 40ft. Sting: 1d4+3 + 3d6 poison. Shapechange.', note: 'Best Chain familiar. Permanent invisibility. Can attack via Investment of Chain Master.' },
  { form: 'Pseudodragon', rating: 'A+', hp: '7', abilities: 'Fly 60ft. Sting: 1d4+2 + DC 11 CON save or poisoned (incapacitated).', note: 'Poisoned condition is strong. Magic Resistance while bonded.' },
  { form: 'Quasit', rating: 'A', hp: '7', abilities: 'Invisible at will. Shapechange. Scare (frighten).', note: 'Like Imp but less damage. Frighten is niche.' },
  { form: 'Sprite', rating: 'B+', hp: '2', abilities: 'Fly 40ft. Heart Sight (detect alignment). Shortbow + poison (sleep).', note: 'Heart Sight: know creature\'s alignment/emotions. Unique intel.' },
];

export const FAMILIAR_TACTICS = [
  { tactic: 'Help Action (Owl)', how: 'Owl flies in, uses Help on ally\'s target, flies out. No AoO (flyby).', note: 'Free advantage on one attack per round. Zero risk.' },
  { tactic: 'Touch Spell Delivery', how: 'Familiar moves to target. You cast Shocking Grasp, Inflict Wounds, etc. through familiar.', note: 'Inflict Wounds through owl: 3d10 necrotic at 60ft effective range.' },
  { tactic: 'Scout Ahead', how: 'Send familiar ahead. See through its eyes.', note: 'Know what\'s in the next room. Avoid ambushes.' },
  { tactic: 'Distraction', how: 'Familiar causes commotion. Guards investigate.', note: 'Cat knocks things over. Owl hoots. Spider crawls on someone.' },
  { tactic: 'Trigger Traps', how: 'Send familiar to trigger pressure plates, trip wires.', note: 'Familiar dies? 10gp + 1 hour to resummon. Worth it.' },
  { tactic: 'Carry Items', how: 'Familiar can carry small objects. Potions, keys, scrolls.', note: 'Invisible Imp delivers a potion to a downed ally.' },
  { tactic: 'Flanking Partner', how: 'Position familiar on opposite side for flanking (if used).', note: 'Familiar can\'t attack but can provide flanking position.' },
  { tactic: 'Dragon\'s Breath (L2)', how: 'Cast Dragon\'s Breath on familiar. It uses action to breathe 15ft cone.', note: 'Familiar can\'t Attack but Dragon\'s Breath isn\'t the Attack action. RAW works.' },
];

export const FAMILIAR_TIPS = [
  'Owl is the best combat familiar. Flyby + Help = free advantage.',
  'Touch spell delivery: Inflict Wounds through owl = 3d10 at range.',
  'Scout ahead. See through familiar eyes. Avoid ambushes.',
  'Trigger traps with your familiar. 10gp to resummon. Worth it.',
  'Invisible Imp (Chain Pact): best familiar in the game.',
  'Dragon\'s Breath on familiar: 15ft cone breath weapon every turn.',
  'Familiar is not a beast. It\'s a spirit in beast form.',
  'Dismiss familiar to pocket dimension before dangerous fights.',
  'Cat in cities, owl in wilderness, spider in dungeons.',
  'Find Familiar is a ritual. Cast without using a spell slot.',
];
