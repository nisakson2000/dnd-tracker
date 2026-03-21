/**
 * playerSneakAttackMasteryGuide.js
 * Player Mode: Rogue Sneak Attack — maximizing damage, triggers, and tactics
 * Pure JS — no React dependencies.
 */

export const SNEAK_ATTACK_RULES = {
  trigger: 'Once per TURN (not round). Finesse or ranged weapon. Advantage OR ally within 5ft of target.',
  damage: '1d6 at L1, scaling +1d6 every odd level. 10d6 at L19.',
  frequency: 'Once per TURN. Can trigger on your turn AND on other turns (reaction attacks).',
  weapons: 'Must use finesse or ranged weapon. Rapier, shortsword, dagger, shortbow, hand crossbow, etc.',
  note: 'Sneak Attack is the Rogue\'s ENTIRE damage budget. It must trigger every round.',
};

export const SNEAK_ATTACK_SCALING = [
  { level: 1, dice: '1d6', avg: 3.5 },
  { level: 3, dice: '2d6', avg: 7 },
  { level: 5, dice: '3d6', avg: 10.5 },
  { level: 7, dice: '4d6', avg: 14 },
  { level: 9, dice: '5d6', avg: 17.5 },
  { level: 11, dice: '6d6', avg: 21 },
  { level: 13, dice: '7d6', avg: 24.5 },
  { level: 15, dice: '8d6', avg: 28 },
  { level: 17, dice: '9d6', avg: 31.5 },
  { level: 19, dice: '10d6', avg: 35 },
];

export const SNEAK_ATTACK_TRIGGERS = [
  { trigger: 'Advantage on attack', method: 'Hide (BA), Faerie Fire, Flanking (optional rule), ally spells.', reliability: 'S' },
  { trigger: 'Ally within 5ft of target', method: 'Any conscious ally adjacent to your target. Most common trigger.', reliability: 'S+' },
  { trigger: 'Swashbuckler: 1v1', method: 'No other creature within 5ft of you. Built-in SA trigger.', reliability: 'S' },
  { trigger: 'Insightful Fighting (Inquisitive)', method: 'BA Insight vs Deception. SA without advantage or ally for 1 min.', reliability: 'A+' },
];

export const DOUBLE_SNEAK_ATTACK = {
  concept: 'SA is once per TURN, not per ROUND. You can SA on your turn AND on someone else\'s turn.',
  methods: [
    { method: 'Opportunity Attack', trigger: 'Enemy leaves your reach. SA on their turn.', reliability: 'A+', note: 'Requires enemy to leave your reach. Sentinel helps.' },
    { method: 'Commander\'s Strike', trigger: 'Fighter Battle Master gives you a reaction attack on their turn.', reliability: 'S', note: 'Best reliable double SA. Fighter gives you their attack.' },
    { method: 'Haste (ally casts)', trigger: 'Extra action on your turn, plus your normal reaction SA.', reliability: 'A+', note: 'Haste gives extra attack action. Still only 1 SA/turn.' },
    { method: 'Order Cleric: Voice of Authority', trigger: 'Cleric casts spell on you → you get reaction attack.', reliability: 'S', note: 'Free reaction attack on Cleric\'s turn. SA triggers.' },
    { method: 'War Caster + Booming Blade', trigger: 'Opportunity attack with Booming Blade. SA + BB damage.', reliability: 'A', note: 'Booming Blade + SA on opportunity attack. Extra damage if they move.' },
    { method: 'Sentinel feat', trigger: 'Enemy attacks ally → reaction attack. SA on their turn.', reliability: 'A+', note: 'More opportunities for reaction attacks = more double SA.' },
  ],
  note: 'Double Sneak Attack per round is the biggest DPR jump for Rogues. Build for it.',
};

export const SNEAK_ATTACK_BUILDS = [
  { build: 'Swashbuckler Duelist', weapons: 'Rapier + Shield', sa: 'Built-in 1v1 SA. No need for allies.', rating: 'S' },
  { build: 'Scout Archer', weapons: 'Hand Crossbow + Crossbow Expert', sa: 'BA attack for second SA attempt.', rating: 'A+' },
  { build: 'Arcane Trickster', weapons: 'Rapier', sa: 'Find Familiar Help action = free advantage.', rating: 'S' },
  { build: 'Assassin Nova', weapons: 'Any', sa: 'Surprise = auto-crit. All SA dice doubled.', rating: 'S+ (when it works)' },
  { build: 'Rogue/Fighter MC', weapons: 'Rapier', sa: 'Action Surge for extra attacks. Commander\'s Strike from BM ally.', rating: 'A+' },
];

export const SNEAK_ATTACK_TIPS = [
  'SA is once per TURN. Get a reaction attack for double SA per ROUND.',
  'Ally within 5ft is the most reliable trigger. Stay near your melee allies.',
  'Cunning Action Hide (BA): hide behind cover → attack with advantage → SA.',
  'Arcane Trickster: familiar uses Help → advantage → guaranteed SA.',
  'Swashbuckler: free SA in 1v1. Free Disengage from enemies you attack. Best Rogue.',
  'Commander\'s Strike (Battle Master) = reaction attack on Fighter\'s turn = double SA.',
  'Assassin: surprise auto-crit sounds amazing but requires DM to allow surprise regularly.',
  'Sentinel: more reaction attacks = more chances for off-turn SA.',
  'If you miss your attack, you miss SA for the turn. Steady Aim (Tasha\'s) helps accuracy.',
  'Elven Accuracy + advantage = 14% crit chance. SA dice doubled on crit.',
];
