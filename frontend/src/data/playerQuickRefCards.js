/**
 * playerQuickRefCards.js
 * Player Mode: Quick reference cards for common D&D 5e rules
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// QUICK REFERENCE CARDS
// ---------------------------------------------------------------------------

export const QUICK_REF_CARDS = [
  {
    id: 'actions_in_combat',
    title: 'Actions in Combat',
    category: 'combat',
    items: [
      { name: 'Attack', description: 'Make a melee or ranged attack (or multiple with Extra Attack).' },
      { name: 'Cast a Spell', description: 'Cast a spell with a casting time of 1 action.' },
      { name: 'Dash', description: 'Gain extra movement equal to your speed for this turn.' },
      { name: 'Disengage', description: 'Your movement doesn\'t provoke opportunity attacks for the rest of the turn.' },
      { name: 'Dodge', description: 'Attacks against you have disadvantage; DEX saves have advantage.' },
      { name: 'Help', description: 'Give an ally advantage on their next ability check or attack.' },
      { name: 'Hide', description: 'Make a Stealth check to become hidden.' },
      { name: 'Ready', description: 'Prepare a reaction to a specific trigger.' },
      { name: 'Search', description: 'Make a Perception or Investigation check.' },
      { name: 'Use an Object', description: 'Interact with a second object (first interaction is free).' },
      { name: 'Grapple', description: 'Contested Athletics check to grab a creature (replaces one attack).' },
      { name: 'Shove', description: 'Contested Athletics check to push or knock prone (replaces one attack).' },
    ],
  },
  {
    id: 'conditions',
    title: 'Conditions Quick Ref',
    category: 'conditions',
    items: [
      { name: 'Blinded', description: 'Auto-fail sight checks. Attacks have disadvantage, attacks against have advantage.' },
      { name: 'Charmed', description: 'Can\'t attack charmer. Charmer has advantage on social checks.' },
      { name: 'Deafened', description: 'Auto-fail hearing checks.' },
      { name: 'Frightened', description: 'Disadvantage on checks/attacks while source is in sight. Can\'t move closer.' },
      { name: 'Grappled', description: 'Speed becomes 0. Ends if grappler is incapacitated or thrown out of reach.' },
      { name: 'Incapacitated', description: 'Can\'t take actions or reactions.' },
      { name: 'Invisible', description: 'Heavily obscured. Attacks have advantage, attacks against have disadvantage.' },
      { name: 'Paralyzed', description: 'Incapacitated, auto-fail STR/DEX saves. Attacks have advantage; hits within 5ft are crits.' },
      { name: 'Petrified', description: 'Turned to stone. Weight x10. Resistant to all damage. Immune to poison/disease.' },
      { name: 'Poisoned', description: 'Disadvantage on attack rolls and ability checks.' },
      { name: 'Prone', description: 'Disadvantage on attacks. Melee attacks have advantage, ranged have disadvantage against you.' },
      { name: 'Restrained', description: 'Speed 0. Attacks have disadvantage. Attacks against have advantage. Disadvantage on DEX saves.' },
      { name: 'Stunned', description: 'Incapacitated. Auto-fail STR/DEX saves. Attacks against have advantage.' },
      { name: 'Unconscious', description: 'Incapacitated, drop items, fall prone. Auto-fail STR/DEX. Hits within 5ft are crits.' },
    ],
  },
  {
    id: 'damage_types',
    title: 'Damage Types',
    category: 'reference',
    items: [
      { name: 'Acid', description: 'Corrosive liquid or vapor.' },
      { name: 'Bludgeoning', description: 'Blunt force (hammers, falling).' },
      { name: 'Cold', description: 'Extreme cold (frost, ice).' },
      { name: 'Fire', description: 'Flames and extreme heat.' },
      { name: 'Force', description: 'Pure magical energy (Magic Missile).' },
      { name: 'Lightning', description: 'Electrical energy.' },
      { name: 'Necrotic', description: 'Life-draining energy.' },
      { name: 'Piercing', description: 'Puncturing attacks (arrows, spears).' },
      { name: 'Poison', description: 'Toxic substances.' },
      { name: 'Psychic', description: 'Mental damage.' },
      { name: 'Radiant', description: 'Holy/divine energy.' },
      { name: 'Slashing', description: 'Cutting attacks (swords, axes).' },
      { name: 'Thunder', description: 'Concussive sound waves.' },
    ],
  },
  {
    id: 'resting',
    title: 'Resting Rules',
    category: 'reference',
    items: [
      { name: 'Short Rest (1 hour)', description: 'Spend hit dice to heal. Recover some class features.' },
      { name: 'Long Rest (8 hours)', description: 'Regain all HP, half hit dice (min 1), all spell slots, most features.' },
      { name: 'Long Rest Limit', description: 'Only one long rest per 24-hour period.' },
      { name: 'Interruption', description: 'Long rest interrupted by 1+ hour of fighting, casting, or similar resets it.' },
    ],
  },
];

/**
 * Get a quick reference card by ID.
 */
export function getQuickRefCard(cardId) {
  return QUICK_REF_CARDS.find(c => c.id === cardId);
}

/**
 * Get cards by category.
 */
export function getCardsByCategory(category) {
  return QUICK_REF_CARDS.filter(c => c.category === category);
}
