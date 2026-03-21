/**
 * playerPartyRoleOptGuide.js
 * Player Mode: Party roles — what each role does and who fills it best
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = [
  {
    role: 'Striker (Damage Dealer)',
    job: 'Kill things. Maximize DPR (damage per round).',
    bestClasses: ['Fighter', 'Rogue', 'Ranger', 'Warlock', 'Paladin', 'Barbarian'],
    keyFeatures: ['Extra Attack', 'Sneak Attack', 'Eldritch Blast', 'Divine Smite', 'Action Surge'],
    note: 'Every party needs at least one. Two is ideal.',
  },
  {
    role: 'Tank (Defender)',
    job: 'Absorb damage. Protect squishier allies. Control the frontline.',
    bestClasses: ['Fighter (Cavalier)', 'Paladin', 'Barbarian', 'Cleric (heavy armor)'],
    keyFeatures: ['High AC', 'High HP', 'Sentinel', 'Compelled Duel', 'Rage damage resistance'],
    note: 'Paladin is the best tank: AC + HP + Aura + healing.',
  },
  {
    role: 'Healer (Support)',
    job: 'Keep allies alive. Remove conditions. Revive from 0 HP.',
    bestClasses: ['Cleric (Life)', 'Druid (Shepherd)', 'Bard', 'Paladin', 'Celestial Warlock'],
    keyFeatures: ['Healing Word', 'Revivify', 'Lesser/Greater Restoration', 'Lay on Hands'],
    note: 'Healing Word is all you need. Full healbot is suboptimal.',
  },
  {
    role: 'Controller (Battlefield Control)',
    job: 'Lock down enemies. AoE disables. Terrain manipulation.',
    bestClasses: ['Wizard', 'Sorcerer', 'Druid', 'Bard'],
    keyFeatures: ['Hypnotic Pattern', 'Web', 'Wall of Force', 'Slow', 'Banishment'],
    note: 'Most impactful role. One good control spell > multiple damage spells.',
  },
  {
    role: 'Face (Social)',
    job: 'Handle NPCs. Negotiate, persuade, deceive, intimidate.',
    bestClasses: ['Bard', 'Warlock', 'Paladin', 'Sorcerer', 'Rogue (Swashbuckler)'],
    keyFeatures: ['High CHA', 'Expertise (Persuasion)', 'Social spells', 'Charm/Suggestion'],
    note: 'Bard is the best face: expertise + CHA + social spells.',
  },
  {
    role: 'Scout (Exploration)',
    job: 'Detect threats. Find traps. Navigate. Stealth ahead.',
    bestClasses: ['Rogue', 'Ranger', 'Monk', 'Druid'],
    keyFeatures: ['High Perception', 'Stealth expertise', 'Thieves\' Tools', 'Survival', 'Darkvision'],
    note: 'Rogue: best scout. Expertise in Stealth + Perception + Thieves\' Tools.',
  },
  {
    role: 'Utility (Problem Solver)',
    job: 'Have a spell/skill for every situation. Versatile solutions.',
    bestClasses: ['Wizard', 'Bard', 'Artificer', 'Druid'],
    keyFeatures: ['Large spell list', 'Ritual casting', 'Jack of All Trades', 'Tool proficiencies'],
    note: 'Wizard: largest spell list. Ritual casting without prep.',
  },
];

export const PARTY_COMPOSITION_TIPS = [
  '4-person party ideal: Tank + Striker + Controller + Healer/Support.',
  'Bard can fill 3+ roles: Face + Healer + Controller.',
  'Paladin: Tank + Striker + Healer. Best multi-role class.',
  'Every party needs healing access. At minimum: Healing Word.',
  'No Cleric? Bard, Druid, or Celestial Warlock fill the gap.',
  'Two Strikers = fast kills. Two Controllers = overkill.',
  'Scout role: Rogue or Ranger with high Perception + Stealth.',
  'Wizard: best Controller + Utility. Worst if party has no healer.',
  'Communicate roles at Session Zero. Avoid 4 of the same role.',
  'Flexible > specialized. Classes that fill 2-3 roles are strongest.',
];

export const MISSING_ROLE_FIXES = {
  noHealer: 'Anyone take Healer feat. Stock Healing Potions. Celestial Warlock dip.',
  noTank: 'Dodge action. Summons as meatshields. Control spells instead.',
  noController: 'Focus fire (kill fast). Use terrain. Grapple/Shove builds.',
  noFace: 'Write notes before NPC encounters. Use Guidance. Highest CHA speaks.',
  noScout: 'Familiar scouting. Arcane Eye. Alarm/Glyph of Warding.',
};
