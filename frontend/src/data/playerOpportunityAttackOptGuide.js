/**
 * playerOpportunityAttackOptGuide.js
 * Player Mode: Opportunity attacks — rules, optimization, and tactical usage
 * Pure JS — no React dependencies.
 */

export const OA_RULES = {
  trigger: 'A hostile creature you can see moves OUT of your reach using its movement.',
  cost: 'Uses your reaction (1 per round).',
  doesNotTrigger: [
    'Teleportation (Misty Step, Dimension Door)',
    'Forced movement (shoves, Thunderwave, Repelling Blast)',
    'Disengage action',
    'Moving within reach (circling around you)',
    'Being moved without using movement (grapple drag by ally)',
  ],
  note: 'You choose whether to take it. Sometimes saving your reaction is better.',
};

export const OA_OPTIMIZATION = [
  { method: 'Polearm Master', effect: 'OA when creature ENTERS reach (10ft with glaive/halberd).', rating: 'S+', note: 'Turns OA from reactive to proactive. Best OA feat.' },
  { method: 'Sentinel', effect: 'OA reduces speed to 0. OA even if they Disengage. OA when ally attacked.', rating: 'S+', note: 'Locks enemies in place. Best tank feat.' },
  { method: 'PAM + Sentinel', effect: 'Enemy enters 10ft reach → OA → speed 0. They never reach you.', rating: 'S++', note: 'The God combo. Enemies literally cannot approach you.' },
  { method: 'War Caster', effect: 'Cast a spell as OA instead of melee attack.', rating: 'S', note: 'Booming Blade OA = damage + punish movement. Hold Person OA = fight-ending.' },
  { method: 'Booming Blade OA', effect: 'Hit + thunder damage if they keep moving.', rating: 'S', note: 'With War Caster. They take damage either way — stop or continue.' },
  { method: 'Great Weapon Master', effect: 'If OA kills, get BA attack on your turn... wait, no. OA is off-turn.', rating: 'N/A', note: 'GWM BA attack only triggers on YOUR turn. OA is not your turn.' },
];

export const OA_TACTICAL_USES = [
  { tactic: 'Zone control', detail: 'Stand in chokepoints. Enemies must Disengage or take damage to pass.', priority: 'S' },
  { tactic: 'Protect squishies', detail: 'Stand between caster and enemies. OA punishes anyone trying to reach them.', priority: 'S' },
  { tactic: 'Punish retreat', detail: 'Wounded enemy tries to flee? Free attack might finish them.', priority: 'A+' },
  { tactic: 'Force Disengage', detail: 'Even if they Disengage, that costs their ACTION. They can\'t attack this turn.', priority: 'A+' },
  { tactic: 'Sentinel lock', detail: 'With Sentinel, OA drops speed to 0. Enemy is stuck next to you.', priority: 'S+' },
];

export const REACTION_PRIORITY = {
  note: 'OA uses your reaction. Sometimes other reactions are better.',
  priorities: [
    { reaction: 'Shield spell', priority: 'S+', when: '+5 AC might save your life. Almost always better than OA damage.' },
    { reaction: 'Counterspell', priority: 'S+', when: 'Enemy casting a devastating spell. Always counter over OA.' },
    { reaction: 'Absorb Elements', priority: 'S', when: 'Halving a big elemental attack. Usually better than OA.' },
    { reaction: 'Opportunity Attack', priority: 'A+', when: 'Good when no defensive reactions needed. Especially with Sentinel.' },
    { reaction: 'Hellish Rebuke', priority: 'A', when: 'After being hit. OA is usually better since you choose the target.' },
    { reaction: 'Uncanny Dodge', priority: 'A+', when: 'Halve incoming attack damage. Rogue survival tool.' },
  ],
};

export const OA_CLASS_FEATURES = [
  { class: 'Fighter (Sentinel)', note: 'Best OA class. Multiple ASIs for feats. PAM+Sentinel by L6.' },
  { class: 'Paladin (Sentinel)', note: 'Smite on OAs. Sentinel + Smite = massive punishment for leaving.' },
  { class: 'Barbarian', note: 'Reckless Attack doesn\'t apply to OAs (only on your turn). But rage damage does.' },
  { class: 'Rogue', note: 'Sneak Attack works on OAs (once per TURN, OA is a different turn). Huge damage.' },
  { class: 'War Caster (any caster)', note: 'Spell OAs. Booming Blade, Hold Person, or even Banishment as OA.' },
  { class: 'Cavalier Fighter', note: 'Unwavering Mark: BA attack if marked target attacks someone else. Extra OA-like feature.' },
];
