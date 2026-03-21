/**
 * playerAoOReactionGuide.js
 * Player Mode: Opportunity attacks — rules, optimization, and avoidance
 * Pure JS — no React dependencies.
 */

export const OA_RULES = {
  trigger: 'A creature you can see leaves your reach using its movement.',
  reaction: 'Uses your reaction. One per round.',
  oneAttack: 'One melee attack only. Not Extra Attack.',
  doesNotTrigger: [
    'Forced movement (shove, Thunderwave, Repelling Blast) does NOT trigger AoO.',
    'Teleportation (Misty Step, Thunder Step) does NOT trigger AoO.',
    'Disengage action prevents all AoO for your turn.',
    'Moving within enemy reach (circling) does NOT trigger AoO.',
  ],
  note: 'Only triggered by LEAVING reach, not entering or moving within.',
};

export const OA_OPTIMIZATION = [
  { method: 'Sentinel feat', effect: 'OA reduces target speed to 0. Can OA on Disengage. OA when allies attacked.', rating: 'S+', note: 'Best OA feat. Locks enemies in place.' },
  { method: 'Polearm Master (PAM)', effect: 'OA when creature ENTERS your reach. Reach = 10ft with polearms.', rating: 'S+', note: 'PAM + Sentinel: enter 10ft, speed drops to 0, never reach you.' },
  { method: 'War Caster', effect: 'Cast a spell as your OA instead of melee attack.', rating: 'S', note: 'Booming Blade as OA: damage + thunder if they keep moving.' },
  { method: 'Booming Blade + War Caster', effect: 'OA with Booming Blade. Stop or take thunder damage.', rating: 'S+', note: 'Best OA combo for casters. Lose-lose for enemies.' },
  { method: 'Reach weapons (Glaive, Halberd)', effect: '10ft reach = larger OA threat zone.', rating: 'A+', note: 'Control more space. PAM + reach = OA at 10ft on entry.' },
];

export const AVOID_OA = [
  { method: 'Disengage action', how: 'Use action to Disengage. No AoO this turn.', note: 'Costs action. Rogue/Monk get as bonus action.' },
  { method: 'Misty Step (L2)', how: 'Bonus action teleport 30ft. No AoO.', note: 'Best escape. Bonus action, teleport out.' },
  { method: 'Cunning Action (Rogue)', how: 'Bonus action Disengage.', note: 'Free every turn. Attack then run.' },
  { method: 'Step of the Wind (Monk)', how: 'Bonus action Disengage or Dash (1 ki).', note: 'Also doubles jump distance.' },
  { method: 'Mobile feat', how: 'After melee attacking, no AoO from that creature.', note: 'Attack and go. No action cost.' },
  { method: 'Shocking Grasp', how: 'On hit: target can\'t take reactions.', note: 'Hit, then move away. They can\'t AoO.' },
];

export const OA_TACTICS = [
  { tactic: 'PAM + Sentinel Lock', how: 'Enemy enters 10ft reach: PAM OA. Hit = speed 0.', note: 'Enemy never reaches you.' },
  { tactic: 'Booming Blade Dilemma', how: 'War Caster OA with Booming Blade. Damage now + damage if moving.', note: 'Stop or take thunder damage.' },
  { tactic: 'Bodyguard Sentinel', how: 'Stand next to squishies. Sentinel OA when enemies attack them.', note: 'Protect the caster.' },
  { tactic: 'Reach Zone Control', how: 'Glaive/halberd: 10ft OA zone. Control 20ft diameter.', note: 'Wider threat area = more control.' },
  { tactic: 'Chokepoint Guard', how: 'Stand in doorway. Everything that passes provokes OA.', note: 'One person blocks a corridor.' },
];

export const OA_TIPS = [
  'OA only triggers when LEAVING reach. Not entering or circling.',
  'Forced movement does NOT trigger OA.',
  'Teleportation does NOT trigger OA.',
  'Sentinel: speed to 0 on OA hit. Best melee lockdown feat.',
  'PAM + Sentinel: enemies can\'t reach you. S-tier combo.',
  'War Caster: cast spells as OA. Booming Blade is best.',
  'Mobile feat: attack then move. No OA from that target.',
  'Rogue Cunning Action: bonus action Disengage every turn.',
  'Shocking Grasp: remove reactions on hit. Free escape.',
  'One reaction per round. Don\'t waste on weak targets.',
];
