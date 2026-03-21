/**
 * playerFindFamiliarGuide.js
 * Player Mode: Find Familiar optimization — your best L1 spell
 * Pure JS — no React dependencies.
 */

export const FIND_FAMILIAR_BASICS = {
  spell: 'Find Familiar',
  level: 1,
  school: 'Conjuration (Ritual)',
  castingTime: '1 hour',
  range: '10ft',
  components: 'V, S, M (10 gp charcoal/incense/herbs, consumed)',
  duration: 'Instantaneous',
  classes: ['Wizard', 'Pact of the Chain Warlock (expanded options)'],
  note: 'The most versatile L1 spell. Scout, deliver touch spells, use Help action. Ritual cast = free. Every Wizard should have this.',
};

export const FAMILIAR_FORMS = [
  { form: 'Owl', speed: '5ft, fly 60ft', senses: 'Darkvision 120ft', special: 'Flyby (no opportunity attacks)', rating: 'S', note: 'Best combat familiar. Flyby = free Help action every turn without risk. 120ft darkvision for scouting.' },
  { form: 'Cat', speed: '40ft, climb 30ft', senses: 'Darkvision 60ft', special: 'Keen Smell (advantage on Perception via smell)', rating: 'A', note: 'Best urban scout. Inconspicuous. Good climb speed. Nobody suspects a cat.' },
  { form: 'Hawk', speed: '10ft, fly 60ft', senses: 'Normal', special: 'Keen Sight (advantage on Perception via sight)', rating: 'A', note: 'Good daytime scout. Keen Sight for spotting. Not as good as owl at night.' },
  { form: 'Spider', speed: '20ft, climb 20ft', senses: 'Darkvision 30ft', special: 'Spider Climb, Web Sense', rating: 'A', note: 'Tiny. Climb walls. Fit through cracks. Excellent infiltration.' },
  { form: 'Bat', speed: '5ft, fly 30ft', senses: 'Blindsight 60ft', special: 'Echolocation, Keen Hearing', rating: 'B', note: 'Blindsight 60ft. See invisible creatures. Good for detection but slow flyer.' },
  { form: 'Rat', speed: '20ft', senses: 'Darkvision 30ft', special: 'Keen Smell', rating: 'B', note: 'Sewers and dungeons. Small enough to fit through pipes.' },
  { form: 'Raven', speed: '10ft, fly 50ft', senses: 'Normal', special: 'Mimicry (copy voices/sounds)', rating: 'B', note: 'Can mimic voices. Useful for distractions. Not as good as owl for combat.' },
  { form: 'Octopus', speed: '5ft, swim 30ft', senses: 'Darkvision 30ft', special: 'Ink Cloud, Camouflage', rating: 'Niche', note: 'Water campaigns only. Ink cloud for escape. Camouflage for stealth.' },
];

export const FAMILIAR_TACTICS = [
  { tactic: 'Help action every turn (Owl)', detail: 'Owl flies in, takes Help action (advantage on ally\'s next attack), flies away with Flyby. No opportunity attacks. Free advantage every round.', rating: 'S' },
  { tactic: 'Deliver touch spells', detail: 'Familiar can deliver YOUR touch spells. Send owl to deliver Shocking Grasp, Inflict Wounds (via Magic Initiate), or Vampiric Touch from range.', rating: 'S' },
  { tactic: 'Scout ahead', detail: 'See through familiar\'s eyes (action). Send it into the next room. Full recon without risking yourself.', rating: 'S' },
  { tactic: 'Dragon\'s Breath on familiar', detail: 'Cast Dragon\'s Breath on your familiar. It can breathe 3d6 AoE damage each turn. Concentration on you, attacks from familiar.', rating: 'S' },
  { tactic: 'Carry potions/objects', detail: 'Familiar can carry and use objects. Give it a potion to deliver to a downed ally. Creative item delivery.', rating: 'A' },
  { tactic: 'Block line of sight', detail: 'Familiar is a creature. It can provide cover, block doorways, or impose disadvantage on attacks.', rating: 'B' },
  { tactic: 'Dismiss into pocket dimension', detail: 'Action: dismiss familiar to pocket dimension. Resummon as action within 30ft. Teleport your familiar.', rating: 'B' },
];

export const CHAIN_PACT_FAMILIARS = [
  { form: 'Imp', speed: '20ft, fly 40ft', senses: 'Darkvision 120ft', special: 'Invisibility (at will), Shapechange, Devil\'s Sight, poison sting', rating: 'S', note: 'Invisible at will. Devil\'s Sight sees through magical darkness. Best Chain familiar.' },
  { form: 'Pseudodragon', speed: '15ft, fly 60ft', senses: 'Blindsight 10ft, darkvision 60ft', special: 'Magic Resistance (advantage on saves vs spells), poison sting (sleep)', rating: 'A', note: 'Magic Resistance is great. Poison sting can knock targets unconscious. Good choice.' },
  { form: 'Quasit', speed: '40ft', senses: 'Darkvision 120ft', special: 'Invisibility (at will), Shapechange, Scare', rating: 'A', note: 'Similar to Imp but demon-themed. Invisibility at will. Scare ability.' },
  { form: 'Sprite', speed: '10ft, fly 40ft', senses: 'Normal', special: 'Heart Sight (detect alignment), invisibility, poison bow', rating: 'B', note: 'Heart Sight detects alignment/emotions. Good for social intelligence gathering.' },
];

export function familiarHelpActionValue(allyDamagePerHit, allyBaseHitChance) {
  const advantageBoost = 1 - (1 - allyBaseHitChance) * (1 - allyBaseHitChance) - allyBaseHitChance;
  return { extraDamage: allyDamagePerHit * advantageBoost, note: 'Free advantage on one ally\'s attack per round' };
}

export function dragonsBreathFamiliarDPR(breathDice = 3, dieSize = 6, targetsHit = 2) {
  const avgDamage = breathDice * (dieSize / 2 + 0.5);
  return { perTarget: avgDamage, totalDPR: avgDamage * targetsHit };
}
