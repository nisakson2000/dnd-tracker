/**
 * playerBarbarianPathGuide.js
 * Player Mode: Barbarian subclass (Path) comparison and optimization
 * Pure JS — no React dependencies.
 */

export const BARBARIAN_PATHS = [
  {
    path: 'Totem Warrior (Bear)',
    rating: 'S+',
    source: 'PHB',
    keyFeature: 'Resistance to ALL damage except psychic while raging.',
    strengths: ['Effectively double HP while raging', 'Best tank in the game', 'Simple and always effective'],
    weaknesses: ['No offensive boost', 'Psychic damage vulnerability'],
    playstyle: 'Unkillable wall. Stand in the middle of everything and laugh.',
    bestAt: 'Tanking, surviving, being the last one standing.',
  },
  {
    path: 'Totem Warrior (Wolf)',
    rating: 'A+',
    source: 'PHB',
    keyFeature: 'Allies have advantage on melee attacks vs enemies within 5ft of you.',
    strengths: ['Massive party DPR boost', 'Best for melee-heavy parties', 'Pack tactics for everyone'],
    weaknesses: ['You personally don\'t get stronger', 'Less effective in ranged parties'],
    playstyle: 'Force multiplier. Make everyone around you deadlier.',
    bestAt: 'Melee-heavy parties, enabling Rogues (free Sneak Attack).',
  },
  {
    path: 'Zealot',
    rating: 'S',
    source: 'XGE',
    keyFeature: 'Extra 1d6+half level radiant/necrotic on first hit per turn. Free resurrection.',
    strengths: ['Extra damage every turn', 'Free to resurrect (no material cost)', 'Rage Beyond Death at L14'],
    weaknesses: ['Less tanky than Bear', 'Rage Beyond Death has limits'],
    playstyle: 'Aggressive DPS barbarian. Kill things, die, come back, repeat.',
    bestAt: 'Damage, not caring about death, budget-friendly resurrection.',
  },
  {
    path: 'Ancestral Guardian',
    rating: 'S',
    source: 'XGE',
    keyFeature: 'First creature you hit has disadvantage attacking anyone except you. Resistance if they hit others.',
    strengths: ['Forces enemies to target you', 'Best "taunt" mechanic in 5e', 'Works at range with thrown weapons'],
    weaknesses: ['Only works on one target', 'Less effective vs multiple enemies'],
    playstyle: 'True tank. Mark an enemy and force them to deal with you.',
    bestAt: 'Single-target tanking, protecting squishies, boss fights.',
  },
  {
    path: 'Wild Magic',
    rating: 'A',
    source: 'TCE',
    keyFeature: 'Random magical effects when raging. Bolstering Magic buffs allies.',
    strengths: ['Bolstering Magic is incredible (bonus to attacks OR recover spell slot)', 'Fun unpredictability'],
    weaknesses: ['Random effects can be bad', 'Less reliable than other paths'],
    playstyle: 'Chaotic support barbarian. Roll on wild tables and hope for the best.',
    bestAt: 'Parties with casters (Bolstering Magic spell slot recovery), fun factor.',
  },
  {
    path: 'Beast',
    rating: 'A',
    source: 'TCE',
    keyFeature: 'Natural weapons: Bite (heal), Claws (extra attack), Tail (AC reaction).',
    strengths: ['Claws = extra attack at L3', 'No weapons needed', 'Tail gives +1d8 AC reaction'],
    weaknesses: ['Natural weapons aren\'t magic until L6', 'Claws compete with GWM builds'],
    playstyle: 'Anime transformation. Grow claws/fangs/tail and go wild.',
    bestAt: 'Early levels (extra attack at L3), backup tank (tail), grapple builds.',
  },
  {
    path: 'Storm Herald',
    rating: 'B',
    source: 'XGE',
    keyFeature: 'Aura while raging: Desert (fire damage), Sea (lightning), Tundra (temp HP).',
    strengths: ['Tundra temp HP is decent support', 'Thematic'],
    weaknesses: ['Damage auras are weak', 'BA cost competes with other uses', 'Underwhelming compared to other paths'],
    playstyle: 'Elemental barbarian. Cool theme, mediocre execution.',
    bestAt: 'Flavor, Tundra for temp HP support.',
  },
  {
    path: 'Berserker',
    rating: 'C+',
    source: 'PHB',
    keyFeature: 'Frenzy: BA attack while raging. Costs exhaustion.',
    strengths: ['Extra attack as BA', 'Immunity to frightened/charmed at L6', 'Intimidating Presence at L10'],
    weaknesses: ['Exhaustion cost is DEVASTATING', 'One frenzy = disadvantage on everything next day', 'Worst path mechanically'],
    playstyle: 'All-or-nothing. Amazing one fight, useless the next.',
    bestAt: 'One-fight adventuring days, dramatic last stands.',
  },
];

export const BARBARIAN_GENERAL_TIPS = [
  'Reckless Attack is your best feature. Advantage on all STR attacks (grants advantage against you too).',
  'Danger Sense: advantage on DEX saves you can see. Incredible with Evasion (Rogue multiclass).',
  'Rage damage scales: +2 (L1), +3 (L9), +4 (L16). Always rage.',
  'Unarmored Defense: 10 + DEX + CON. Needs 20 DEX + 20 CON to match plate + shield (20 AC).',
  'Half plate + shield (19 AC) is usually better than Unarmored Defense unless very high stats.',
  'Brutal Critical is mathematically weak. Extra die on crits sounds cool, averages to +0.325 DPR.',
  'Barbarians are the best grapplers: Rage gives advantage on STR checks, Athletics expertise via Skill Expert.',
  'Persistent Rage (L15) means rage never drops from not attacking. Huge for grapple builds.',
];

export const BARBARIAN_FEAT_PRIORITY = [
  { feat: 'Great Weapon Master', priority: 'S+', note: 'Reckless Attack = reliable -5/+10. Best barbarian feat.' },
  { feat: 'Polearm Master', priority: 'S', note: 'BA attack + enter-reach OA. PAM+Sentinel = god combo.' },
  { feat: 'Sentinel', priority: 'S', note: 'Lock enemies in place. Combine with PAM or Reckless.' },
  { feat: 'Skill Expert (Athletics)', priority: 'A+', note: 'Expertise in Athletics for grappling. Rage advantage + expertise = unstoppable.' },
  { feat: 'Resilient (WIS)', priority: 'A', note: 'Shore up worst save. Barbarians hate being charmed/frightened out of rage.' },
  { feat: 'Tough', priority: 'A', note: '+2 HP/level. With d12 HD and Bear Totem, you\'re immortal.' },
];
