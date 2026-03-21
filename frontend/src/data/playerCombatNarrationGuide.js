/**
 * playerCombatNarrationGuide.js
 * Player Mode: How to narrate combat actions for better roleplay
 * Pure JS — no React dependencies.
 */

export const ATTACK_NARRATIONS = {
  miss: [
    'Your blade whistles past their ear, missing by inches.',
    'They twist aside at the last moment, your strike cutting only air.',
    'Your weapon glances off their armor with a shower of sparks.',
    'You overextend, stumbling past as they sidestep.',
    'The attack is good, but they\'re faster — barely dodging.',
  ],
  hit: [
    'Your blade finds a gap in their defense, biting deep.',
    'A solid strike connects — they stagger from the impact.',
    'You catch them off-guard, your weapon striking true.',
    'With a precise thrust, your weapon punches through their guard.',
    'A devastating blow lands exactly where you aimed.',
  ],
  crit: [
    'With perfect precision, your weapon finds the exact weakness in their armor!',
    'Time seems to slow as your attack connects with devastating force!',
    'A masterful strike! The kind warriors tell stories about!',
    'Your weapon strikes with supernatural accuracy — a perfect hit!',
    'You channel everything into this strike — and it pays off spectacularly!',
  ],
  kill: [
    'Your final blow fells them. They crumple to the ground, defeated.',
    'With one last strike, the light leaves their eyes.',
    'They stagger... then collapse. The fight is over for them.',
    'A clean finish. They fall and don\'t get back up.',
    'Your weapon finds its mark for the last time. They\'re done.',
  ],
};

export const SPELL_NARRATIONS = {
  fire: ['Flames erupt from your fingertips', 'A blazing bolt of fire streaks forward', 'The air shimmers with heat as fire engulfs'],
  cold: ['Frost crackles across the ground', 'A beam of freezing energy lances out', 'Ice crystals form in the air around your hands'],
  lightning: ['Electricity arcs from your outstretched hand', 'A bolt of lightning splits the air with a deafening crack', 'Sparks dance between your fingers before erupting outward'],
  necrotic: ['Dark energy coils around your arm', 'Shadowy tendrils reach toward your target', 'The air grows cold and dead around your spell'],
  radiant: ['Golden light blazes from your hands', 'A beam of pure radiance sears outward', 'Divine light erupts, burning away shadows'],
  healing: ['Warm light flows from your hands', 'A gentle green glow surrounds the wound', 'Divine energy mends torn flesh and eases pain'],
};

export const NARRATION_TIPS = [
  'Keep it SHORT. One sentence is perfect. Two sentences max.',
  'Describe what YOUR character does, not the result. Let the DM narrate the enemy\'s reaction.',
  'Use your character\'s fighting style. A Barbarian attacks differently than a Rogue.',
  'Reference your weapon specifically. "I swing my greataxe" not just "I attack."',
  'Include emotion. "With a desperate cry" or "cold determination in their eyes."',
  'Build on what just happened. "After dodging their blow, I counter with..."',
  'Don\'t narrate damage numbers. "I deal 14 damage" breaks immersion.',
  'On a miss, narrate the ATTEMPT, not the failure. It still looked cool.',
  'On a crit, go big. This is your moment. Describe something epic.',
  'On a kill, ask the DM "How do I want to do this?" (Critical Role style).',
];

export const CLASS_COMBAT_FLAVOR = {
  Barbarian: { style: 'Brutal, instinctive, primal', verbs: ['cleave', 'smash', 'crush', 'rend', 'tear'] },
  Fighter: { style: 'Disciplined, tactical, trained', verbs: ['strike', 'parry', 'thrust', 'slash', 'block'] },
  Rogue: { style: 'Quick, precise, opportunistic', verbs: ['slip', 'dart', 'stab', 'twist', 'feint'] },
  Paladin: { style: 'Righteous, powerful, divine', verbs: ['smite', 'cleave', 'consecrate', 'judge', 'purify'] },
  Ranger: { style: 'Patient, deadly, natural', verbs: ['loose', 'track', 'aim', 'pierce', 'mark'] },
  Monk: { style: 'Flowing, precise, centered', verbs: ['strike', 'sweep', 'deflect', 'kick', 'channel'] },
  Wizard: { style: 'Calculated, arcane, intellectual', verbs: ['conjure', 'weave', 'shape', 'invoke', 'unleash'] },
  Sorcerer: { style: 'Instinctive, raw, powerful', verbs: ['surge', 'erupt', 'channel', 'blast', 'overwhelm'] },
  Warlock: { style: 'Dark, otherworldly, eldritch', verbs: ['invoke', 'curse', 'drain', 'blast', 'corrupt'] },
  Cleric: { style: 'Faithful, resolute, divine', verbs: ['call upon', 'bless', 'sanctify', 'smite', 'protect'] },
  Druid: { style: 'Natural, primal, adaptive', verbs: ['summon', 'transform', 'entangle', 'shape', 'call'] },
  Artificer: { style: 'Inventive, technical, arcane', verbs: ['discharge', 'deploy', 'activate', 'calibrate', 'overload'] },
};

export function getRandomNarration(type) {
  const narrations = ATTACK_NARRATIONS[type];
  if (!narrations) return '';
  return narrations[Math.floor(Math.random() * narrations.length)];
}

export function getClassFlavor(className) {
  return CLASS_COMBAT_FLAVOR[className] || null;
}

export function getSpellNarration(damageType) {
  const narrations = SPELL_NARRATIONS[damageType];
  if (!narrations) return '';
  return narrations[Math.floor(Math.random() * narrations.length)];
}
