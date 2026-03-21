/**
 * playerNPCAllyManagement.js
 * Player Mode: Managing NPC allies, sidekicks, and hired help in combat
 * Pure JS — no React dependencies.
 */

export const NPC_ALLY_TYPES = [
  { type: 'Sidekick (Tasha\'s)', control: 'Player or DM', rules: 'Expert/Spellcaster/Warrior classes. Level with party. Full character sheet.', bestFor: 'Small parties needing a permanent extra member.' },
  { type: 'Hirelings', control: 'DM (follows orders)', rules: 'Commoners or low CR NPCs. Don\'t level up. Flee from danger.', bestFor: 'Carrying equipment, guarding camp, non-combat tasks.' },
  { type: 'Retainers', control: 'DM (loyal but independent)', rules: 'CR 1-3 warriors. May have opinions about tactics.', bestFor: 'Extra muscle for specific missions. May disagree with suicidal plans.' },
  { type: 'Summoned creatures', control: 'Player', rules: 'Conjure Animals, Summon spells. Act on your initiative.', bestFor: 'Temporary combat boost. Disappear when concentration drops.' },
  { type: 'Charmed/Dominated', control: 'Player (limited)', rules: 'Charm Person, Dominate Monster. Target follows orders but doesn\'t want to.', bestFor: 'Turning enemies into temporary allies. Risky and temporary.' },
  { type: 'Animal Companions', control: 'Player', rules: 'Beast Master Ranger, Find Familiar, Find Steed. Specific class features.', bestFor: 'Scouting, flanking, Help action. Permanent party member.' },
];

export const ALLY_COMBAT_ETIQUETTE = [
  'Don\'t let NPC allies overshadow PCs. Players should be the heroes.',
  'NPC allies should support, not lead. They follow the party\'s plan.',
  'Keep NPC turns SHORT. 5-10 seconds max. Don\'t slow combat for NPCs.',
  'Use simplified stat blocks for NPCs. Full character sheets are overkill.',
  'Let PCs make the big decisions. NPCs offer advice, not commands.',
  'NPC allies should have a reason to follow the party. Loyalty, payment, shared goals.',
  'If an NPC ally is too powerful, the DM should adjust encounters accordingly.',
];

export const ALLY_TACTICS = [
  { tactic: 'Help action', description: 'NPC uses Help to give a PC advantage. Best use for weak NPCs.', effectiveness: 'A' },
  { tactic: 'Flanking partner', description: 'NPC stands opposite a PC for flanking advantage (variant rule).', effectiveness: 'A' },
  { tactic: 'Guard duty', description: 'NPC protects a specific PC or objective. Readied actions to intercept.', effectiveness: 'B' },
  { tactic: 'Distraction', description: 'NPC engages enemies to draw attention from PCs. Cannon fodder.', effectiveness: 'B' },
  { tactic: 'Ranged support', description: 'NPC archers in the back. Low damage but consistent.', effectiveness: 'B' },
  { tactic: 'Healing support', description: 'NPC healer provides backup healing. Frees PC healer for offense.', effectiveness: 'A' },
];

export const MORALE_SYSTEM = {
  description: 'NPCs have morale. Unlike PCs, they may flee when things go badly.',
  triggers: [
    { trigger: 'Leader killed', effect: 'WIS save DC 10 or flee', severity: 'High' },
    { trigger: 'Half of allies killed', effect: 'WIS save DC 10 or flee', severity: 'High' },
    { trigger: 'Reduced to half HP', effect: 'WIS save DC 10 or flee (cowardly NPCs)', severity: 'Medium' },
    { trigger: 'Facing overwhelming odds', effect: 'May refuse to fight or demand higher pay', severity: 'Medium' },
    { trigger: 'Ally uses terrifying magic', effect: 'Frightened of the caster (even if allied)', severity: 'Low' },
  ],
  prevention: [
    'Pay well and treat fairly',
    'Inspiring Leader feat gives temp HP and morale',
    'Calm Emotions prevents fear-based fleeing',
    'Keep NPCs out of the most dangerous situations',
  ],
};

export const PAYING_HIRELINGS = {
  unskilled: '2 sp/day — laborers, porters, torchbearers',
  skilled: '2 gp/day — guides, translators, artisans',
  mercenary: '5-20 gp/day — soldiers, bodyguards, specialists',
  danger: 'Double or triple pay for dangerous missions',
  share: 'Some NPCs want a share of treasure instead of flat pay',
  note: 'Hirelings who nearly die demand hazard pay or quit entirely.',
};

export function calculateHirelingCost(type, days, dangerLevel) {
  const basePay = { unskilled: 0.2, skilled: 2, mercenary: 10 };
  const base = basePay[type] || 2;
  const multiplier = dangerLevel === 'high' ? 3 : dangerLevel === 'medium' ? 2 : 1;
  return { perDay: base * multiplier, total: base * multiplier * days, currency: 'gp' };
}

export function shouldUseAlly(partySize, combatDifficulty) {
  if (partySize <= 3 && combatDifficulty === 'deadly') return { use: true, reason: 'Small party in deadly encounter. Extra body helps.' };
  if (partySize >= 5) return { use: false, reason: 'Large party. Allies slow combat and dilute spotlight.' };
  return { use: true, reason: 'Can be helpful. Keep their turns fast.' };
}
