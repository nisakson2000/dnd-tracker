/**
 * playerCreativeActions.js
 * Player Mode: Creative combat actions beyond "I attack" — improvised actions, stunts, and creative problem solving
 * Pure JS — no React dependencies.
 */

export const CREATIVE_ACTION_FRAMEWORK = {
  principle: 'D&D is not limited to the actions on your character sheet. You can try ANYTHING reasonable.',
  dmRole: 'The DM adjudicates creative actions. Usually an ability check with a DC they set.',
  rule: 'If you can describe it and it makes physical sense, you can attempt it.',
  tip: 'Creative actions are memorable. "I swing from the chandelier" is a better story than "I attack."',
};

export const CREATIVE_COMBAT_IDEAS = [
  { action: 'Throw sand/dirt in eyes', check: 'Improvised attack or Sleight of Hand vs AC', effect: 'Blinded until they use an action to clear it (DM discretion)', category: 'Debuff' },
  { action: 'Kick a table into enemies', check: 'Athletics (DC 12-15)', effect: 'Difficult terrain, possible prone, 1d4 bludgeoning', category: 'Control' },
  { action: 'Swing from a chandelier', check: 'Acrobatics or Athletics (DC 13)', effect: 'Move across the room without provoking OAs + possible kick attack', category: 'Movement' },
  { action: 'Cut a rope bridge', check: 'Slashing weapon attack vs AC 11-15 (rope)', effect: 'Enemies on bridge fall. Massive fall damage potential.', category: 'Environmental' },
  { action: 'Collapse a doorway', check: 'Athletics (DC 15-20) or attack the supports', effect: 'Block passage. Enemies can\'t follow.', category: 'Environmental' },
  { action: 'Grapple and shove off a cliff', check: 'Athletics vs Athletics/Acrobatics (grapple then shove)', effect: 'Both fall unless you succeed on a second Athletics check to let go', category: 'Kill shot' },
  { action: 'Use an enemy as a shield', check: 'Grapple + DM ruling', effect: 'Half cover (+2 AC) from the grappled creature\'s body', category: 'Defense' },
  { action: 'Disarm an enemy', check: 'Attack roll vs Athletics or Acrobatics (DMG variant rule)', effect: 'Enemy drops their weapon. You can kick it away.', category: 'Control' },
  { action: 'Intimidate mid-combat', check: 'Intimidation vs Insight', effect: 'Frightened condition or enemy surrenders (DM discretion)', category: 'Social' },
  { action: 'Break a potion on a downed ally', check: 'Free object interaction (DM may require no check)', effect: 'Heal ally at 0 HP without using your action to administer', category: 'Healing' },
  { action: 'Set fire to something', check: 'Tinderbox, fire spell, or torch', effect: 'Create fire hazard, smoke screen, or destroy objects', category: 'Environmental' },
  { action: 'Slide under a large creature', check: 'Acrobatics (DC varies by creature size)', effect: 'Move through hostile space, avoid OA, possibly attack from below', category: 'Movement' },
  { action: 'Throw an ally (Fastball Special)', check: 'Athletics (thrower) + Acrobatics (throwee)', effect: 'Launch a Small ally at a target. They can attack on landing.', category: 'Combo' },
  { action: 'Use a door as cover', check: 'Object interaction to open/close', effect: 'Half cover (+2 AC) or full cover if you close it entirely', category: 'Defense' },
  { action: 'Pour holy water on undead', check: 'Improvised ranged attack (20ft)', effect: '2d6 radiant damage. No save.', category: 'Damage' },
];

export const IMPROVISED_WEAPONS = {
  rules: 'An improvised weapon deals 1d4 damage. DM may assign a different die if similar to a real weapon.',
  proficiency: 'No proficiency bonus unless DM rules it\'s similar to a weapon you\'re proficient with.',
  examples: [
    { item: 'Chair', damage: '1d4 bludgeoning', similar: 'Club' },
    { item: 'Broken bottle', damage: '1d4 piercing', similar: 'Dagger' },
    { item: 'Table leg', damage: '1d4 bludgeoning', similar: 'Club' },
    { item: 'Rock/brick', damage: '1d4 bludgeoning', similar: 'Thrown weapon (20/60)' },
    { item: 'Chain', damage: '1d4 bludgeoning', similar: 'Whip (if DM agrees)' },
    { item: 'Another creature (Tavern Brawler)', damage: '1d4 bludgeoning', similar: 'Special — requires Tavern Brawler feat for proficiency' },
  ],
  tavernBrawler: 'Tavern Brawler feat: Proficient with improvised weapons, bonus action grapple after hitting with unarmed/improvised.',
};

export const KNOWLEDGE_CHECKS_IN_COMBAT = [
  { check: 'Arcana', examples: 'Identify a spell being cast, recognize a magical creature\'s weakness', action: 'Free (DM may allow) or Action' },
  { check: 'Nature', examples: 'Identify a plant creature\'s vulnerability, recognize natural hazards', action: 'Free or Action' },
  { check: 'Religion', examples: 'Know an undead/fiend\'s weakness, recognize divine symbols', action: 'Free or Action' },
  { check: 'History', examples: 'Recognize a legendary weapon, recall a tactical weakness of a known enemy type', action: 'Free or Action' },
  { check: 'Medicine', examples: 'Stabilize an ally (DC 10), identify a poison', action: 'Action (stabilize) or free (identify)' },
  { check: 'Investigation', examples: 'Find a hidden mechanism, spot a weak point in armor/structure', action: 'Action' },
];

export const DIPLOMACY_IN_COMBAT = {
  description: 'Combat doesn\'t have to end with everyone dead. You can try to negotiate.',
  options: [
    { option: 'Demand surrender', check: 'Intimidation vs WIS/Insight', when: 'Enemies are bloodied or outnumbered. Intelligent creatures may surrender.' },
    { option: 'Offer terms', check: 'Persuasion vs DM discretion', when: 'Enemies are losing or have something to gain from stopping.' },
    { option: 'Parley', check: 'Persuasion or Deception', when: 'Mid-combat pause. One round of talking. Both sides consider.' },
    { option: 'Deceptive retreat', check: 'Deception vs Insight', when: 'Pretend to surrender or retreat, then ambush.' },
  ],
  note: 'DM decides if enemies are willing to talk. Beasts and mindless undead usually aren\'t.',
};

export function getCreativeActions(category) {
  if (!category) return CREATIVE_COMBAT_IDEAS;
  return CREATIVE_COMBAT_IDEAS.filter(a => a.category.toLowerCase() === category.toLowerCase());
}

export function suggestCreativeAction(terrain, enemyType, playerHasAdvantage) {
  const suggestions = [];
  if (terrain === 'indoor') suggestions.push('Flip tables for cover', 'Swing from fixtures', 'Collapse doorways');
  if (terrain === 'outdoor') suggestions.push('Push into hazards', 'Use elevation', 'Create fire/smoke');
  if (terrain === 'underground') suggestions.push('Collapse tunnels', 'Use darkness', 'Trigger cave-ins');
  if (enemyType === 'undead') suggestions.push('Holy water (2d6 radiant)', 'Use radiant damage sources');
  if (playerHasAdvantage) suggestions.push('Grapple + shove combo', 'Disarm attempt');
  return suggestions.length ? suggestions : ['Attack the nearest enemy — sometimes simple is best.'];
}
