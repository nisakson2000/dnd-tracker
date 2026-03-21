/**
 * playerEncounterDifficultyGuide.js
 * Player Mode: Reading encounter difficulty — when to fight, flee, or negotiate
 * Pure JS — no React dependencies.
 */

export const ENCOUNTER_DIFFICULTY_TIERS = [
  { tier: 'Easy', description: 'No real threat. Resources barely spent.', playerAction: 'Use cantrips and basic attacks. Save spell slots.', sign: 'DM says "you see a few goblins" when you\'re level 8.' },
  { tier: 'Medium', description: 'Some danger. A few resources spent.', playerAction: 'Use efficient spells. No need to nova. Standard tactics.', sign: 'Enemies roughly match your numbers. Similar CR to your level.' },
  { tier: 'Hard', description: 'Real danger. Significant resources needed.', playerAction: 'Use concentration spells. Control enemies. Focus fire.', sign: 'Enemies outnumber you or are significantly stronger. Multiple dangerous foes.' },
  { tier: 'Deadly', description: 'Characters may die. Full resource expenditure.', playerAction: 'Open with best control spells. Nova if needed. Consider retreating.', sign: 'CR significantly above party level. Legendary creatures. Multiple high-CR foes.' },
  { tier: 'TPK Territory', description: 'Multiple character deaths likely.', playerAction: 'RUN. Negotiate. Find a creative solution. Do NOT fight fair.', sign: 'Ancient dragon at level 5. Overwhelming force. DM seems worried.' },
];

export const DANGER_SIGNS = [
  { sign: 'Enemy has Legendary Actions', meaning: 'Boss monster. Multiple actions per round. Expect 3-4 actions.', response: 'Burn through Legendary Resistance first, then use control spells.' },
  { sign: 'Enemy has Legendary Resistance', meaning: '3 auto-saves per day. First 3 control spells are wasted.', response: 'Use cheap save-or-suck spells first to drain LR. Then use big spells.' },
  { sign: 'Enemy casts 9th-level spells', meaning: 'CR 17+. Wish, Power Word Kill, Meteor Swarm.', response: 'Counterspell EVERYTHING. Kill the caster first.' },
  { sign: 'Multiple high-CR enemies', meaning: 'Action economy heavily favors them.', response: 'Split them (Wall of Force). Control. Don\'t fight them all simultaneously.' },
  { sign: 'Antimagic Field', meaning: 'All magic stops working in the area.', response: 'Retreat. Fight outside the field. Or send martial characters in.' },
  { sign: 'Terrain favors the enemy', meaning: 'They have cover, high ground, escape routes, etc.', response: 'Reposition. Lure them to favorable terrain. Don\'t fight on their terms.' },
  { sign: 'You\'re already resource-depleted', meaning: 'Low HP, few spell slots, no short rest.', response: 'Avoid combat. Rest first. Negotiate or sneak past.' },
];

export const WHEN_TO_RETREAT = [
  'A party member is dead and you can\'t immediately revive them.',
  'More than half the party is at 25% HP or lower.',
  'You\'ve used most spell slots and the enemy is barely damaged.',
  'The enemy has abilities you can\'t counter (Antimagic, extreme regeneration).',
  'The fight is clearly beyond your level. Live to fight another day.',
  'You learn critical information mid-fight that changes the situation.',
  'The environment is becoming dangerous (lava, collapsing ceiling, flood).',
];

export const RETREAT_TACTICS = [
  { tactic: 'Fog Cloud / Darkness', effect: 'Block line of sight. Enemies can\'t target you.', rating: 'S' },
  { tactic: 'Wall of Force', effect: 'Impassable barrier between you and enemies.', rating: 'S+' },
  { tactic: 'Hypnotic Pattern', effect: 'Incapacitate pursuers. They can\'t chase.', rating: 'S' },
  { tactic: 'Dimension Door / Teleport', effect: 'Instantly escape. Take an ally.', rating: 'S+' },
  { tactic: 'Dash (everyone)', effect: 'Everyone Dashes. Some enemies can\'t keep up.', rating: 'A' },
  { tactic: 'One player holds the line', effect: 'Tank stays behind. Others flee. Heroic sacrifice or retreat.', rating: 'B+ (risky)' },
  { tactic: 'Pass Without Trace + Stealth', effect: '+10 Stealth for everyone. Duck around a corner.', rating: 'S' },
];

export const ENCOUNTER_READING_TIPS = [
  'If the DM describes a creature and emphasizes its power, take it seriously.',
  'Ask: "Do I know anything about this creature?" Arcana/History/Nature check for intel.',
  'Count enemy actions vs your actions. If they have more, you need control spells.',
  'If an enemy has Multiattack with 3+ attacks, they\'re dangerous. Focus fire them.',
  'Legendary Resistance means your first 3 save-or-suck spells are wasted. Plan accordingly.',
  'Know when to retreat. A TPK means the campaign might end. Live and return stronger.',
  'Pre-fight scouting (familiar, Arcane Eye) tells you what you\'re facing before committing.',
  'If you can negotiate, try it first. Not every encounter is a fight.',
  'Resource management: if you\'re already spent, don\'t start another fight.',
  'The DM is not trying to kill you (usually). But they won\'t pull punches if you ignore danger signs.',
];
