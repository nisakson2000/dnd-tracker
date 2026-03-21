/**
 * playerTurnOrderOptGuide.js
 * Player Mode: Optimizing your turn — what to do and in what order
 * Pure JS — no React dependencies.
 */

export const TURN_STRUCTURE = {
  movement: 'Move up to your speed. Can split before/after actions.',
  action: '1 action: Attack, Cast Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use Object.',
  bonusAction: '1 bonus action (only if a feature grants one).',
  reaction: '1 per round (not per turn). Resets at start of your turn.',
  freeInteraction: 'Interact with 1 object: draw/stow weapon, open door, grab item.',
  communication: 'Brief speaking is free. Short phrases, not speeches.',
};

export const OPTIMAL_TURN_ORDER = [
  {
    step: 1,
    action: 'Assess the situation',
    detail: 'Before acting, scan: Who\'s down? What threats remain? Where are allies?',
    tip: 'Don\'t autopilot. Adjust your plan based on what happened since your last turn.',
  },
  {
    step: 2,
    action: 'Move (if needed, first portion)',
    detail: 'Get into position for your action. Move behind cover, into range, or to flanking.',
    tip: 'Split movement: move 15ft, attack, move 15ft to cover. Legal and smart.',
  },
  {
    step: 3,
    action: 'Bonus Action (if order matters)',
    detail: 'Some BAs should go before your action: Hex (BA) → EB (action). Rage (BA) → Attack.',
    tip: 'Hex/Hunter\'s Mark before attacking. Rage before attacking. Spiritual Weapon can go after.',
  },
  {
    step: 4,
    action: 'Action',
    detail: 'Your main action. Attack, cast spell, or other standard action.',
    tip: 'This is your most impactful action. Don\'t waste it on Disengage when you can Misty Step.',
  },
  {
    step: 5,
    action: 'Bonus Action (if remaining)',
    detail: 'Use remaining BA if applicable. Second attack (TWF), Spiritual Weapon attack, etc.',
    tip: 'If your BA is attack-based, it goes after your Action. If it\'s a buff, it goes before.',
  },
  {
    step: 6,
    action: 'Move (remaining movement)',
    detail: 'Use remaining movement to reposition. Get behind cover. Move away from enemies.',
    tip: 'End your turn in a safe position. Behind cover, behind the tank, out of AoE range.',
  },
  {
    step: 7,
    action: 'Plan your reaction',
    detail: 'Decide what reaction to use this round: Shield, Counterspell, OA, Absorb Elements.',
    tip: 'Have a default reaction planned. "If hit, Shield. If enemy casts, Counterspell."',
  },
];

export const ACTION_DECISION_TREE = [
  { condition: 'Ally is at 0 HP', action: 'Healing Word (BA) + do something else', priority: 1 },
  { condition: 'Enemy caster is concentrating on big spell', action: 'Attack them (break concentration) or Counterspell if they cast', priority: 2 },
  { condition: 'Multiple enemies clustered', action: 'AoE control spell (Hypnotic Pattern, Web) or AoE damage (Fireball)', priority: 3 },
  { condition: 'Boss enemy is uncontrolled', action: 'Big save-or-suck (Hold Monster, Banishment)', priority: 4 },
  { condition: 'You have advantage', action: 'Attack (with GWM/SS if applicable). Best damage opportunity.', priority: 5 },
  { condition: 'No special circumstances', action: 'Attack highest-priority target or maintain concentration spell.', priority: 6 },
  { condition: 'Nothing useful to do', action: 'Dodge action > Help action > Dash to reposition.', priority: 7 },
];

export const TURN_OPTIMIZATION_BY_CLASS = [
  { class: 'Fighter', optimal: 'Attack → BA attack (PAM/TWF) → Move to cover. Action Surge on boss rounds.', note: 'Most straightforward. Attack and reposition.' },
  { class: 'Rogue', optimal: 'Move → Attack (with SA setup) → Cunning Action Hide/Disengage → End behind cover.', note: 'Attack → Hide is the standard Rogue loop.' },
  { class: 'Wizard', optimal: 'Move into position → Cast spell → Move behind cover. Plan Counterspell/Shield reaction.', note: 'Casters should always end behind cover.' },
  { class: 'Cleric', optimal: 'Spiritual Weapon (BA) → Cast/Attack (action) → Move. Healing Word if ally is down.', note: 'SW + SG = BA attack + AoE damage every round.' },
  { class: 'Paladin', optimal: 'Move → Attack (smite on crits) → BA (if available) → Position next to allies (Aura).', note: 'Stay near allies for Aura of Protection. +CHA to their saves.' },
  { class: 'Warlock', optimal: 'Hex (BA, if not active) → Eldritch Blast (action) → Move behind cover.', note: 'EB every round. Hex on first round or when target dies.' },
  { class: 'Barbarian', optimal: 'Rage (BA, R1) → Reckless Attack → Move to engage most enemies.', note: 'Rage R1. Reckless every round. Draw attacks away from allies.' },
  { class: 'Monk', optimal: 'Attack → Flurry of Blows (BA) → Stunning Strike on hits → Move (speed bonus).', note: 'Stun priority targets. Move freely with extra speed.' },
  { class: 'Druid', optimal: 'Concentration spell (action) → Move. OR Wild Shape (BA for Moon) → Attack.', note: 'Moon Druid: BA Wild Shape + attack as beast.' },
  { class: 'Bard', optimal: 'Inspiration (BA) to key ally → Control spell (action) → Move to safety.', note: 'BI to the Paladin/Fighter. Control the field.' },
  { class: 'Ranger', optimal: 'Hunter\'s Mark (BA, R1) → Attack (action) → Move behind cover.', note: 'HM on R1. Attack every subsequent round. Reposition as needed.' },
];

export const TURN_OPTIMIZATION_TIPS = [
  'Split your movement. Move → Act → Move is legal and often optimal.',
  'Buff BAs before attack actions. Hex → EB. Rage → Attack. Order matters.',
  'End your turn behind cover or out of enemy reach if possible.',
  'Don\'t waste actions on Disengage. Just take the OA if the enemy only gets one.',
  'Plan your reaction during your turn. Know what you\'ll do before it\'s needed.',
  'Communicate with your party. "I\'m going to Hold Person the mage. Melee: get ready to crit."',
  'If nothing useful to do: Dodge > Help > Search > Ready > Dash.',
  'Keep your turns fast. Decide before your turn starts. Analyze during others\' turns.',
  'Free object interaction: draw weapon, open door, pick up item. One per turn.',
  'You can drop a weapon for free (no interaction) and draw another (free interaction). TWF trick.',
];
