/**
 * playerCombatCheatSheet.js
 * Player Mode: Quick-reference combat cheat sheet for new/intermediate players
 * Pure JS — no React dependencies.
 */

export const COMBAT_TURN_ORDER = [
  { phase: 'Start of Turn', items: ['Resolve start-of-turn effects (e.g., ongoing damage, conditions)', 'Saving throws for conditions (some end at start)', 'Regeneration effects'] },
  { phase: 'Movement', items: ['Move up to your speed', 'Can split movement (move, attack, move)', 'Difficult terrain costs 2x', 'Standing from prone costs half your movement'] },
  { phase: 'Action', items: ['Attack (melee or ranged)', 'Cast a Spell', 'Dash (double movement)', 'Disengage (no opportunity attacks)', 'Dodge (attacks against you have disadvantage)', 'Help (give ally advantage)', 'Hide (Stealth check)', 'Ready (prepare an action with a trigger)', 'Search (Perception/Investigation check)', 'Use an Object'] },
  { phase: 'Bonus Action', items: ['Only if you have a feature that grants one', 'Examples: Two-Weapon Fighting, Cunning Action, Healing Word', 'One per turn, can\'t trade for an action'] },
  { phase: 'Free Interaction', items: ['Interact with one object (draw weapon, open door)', 'Speak briefly (a sentence or two)', 'Drop an item (free, no interaction needed)'] },
  { phase: 'End of Turn', items: ['Resolve end-of-turn effects', 'Saving throws for conditions (some end at end)', 'Concentration checks if damaged'] },
];

export const COMMON_COMBAT_QUESTIONS = [
  { q: 'Can I move and attack?', a: 'Yes! You can split movement before and after your action.' },
  { q: 'Can I use a bonus action instead of an action?', a: 'No. Bonus actions are separate. You can\'t trade them.' },
  { q: 'Do I add my modifier to off-hand attacks?', a: 'No ability modifier to damage (unless negative or you have Two-Weapon Fighting style).' },
  { q: 'When do I roll concentration saves?', a: 'When you take damage. DC is 10 or half damage taken, whichever is higher.' },
  { q: 'Can I ready a spell?', a: 'Yes, but it uses concentration and the slot even if the trigger never happens.' },
  { q: 'How does cover work?', a: 'Half cover: +2 AC/DEX saves. Three-quarters: +5. Full: can\'t be targeted directly.' },
  { q: 'Can I attack twice?', a: 'Only with Extra Attack feature (most martial classes at 5th level) or dual wielding (bonus action).' },
  { q: 'What provokes opportunity attacks?', a: 'Leaving a hostile creature\'s reach. Disengage prevents this.' },
];

export const DAMAGE_TYPE_QUICK_REF = [
  { type: 'Slashing', icon: 'sword', examples: 'Swords, axes' },
  { type: 'Piercing', icon: 'crosshair', examples: 'Arrows, rapiers, spears' },
  { type: 'Bludgeoning', icon: 'hammer', examples: 'Maces, hammers, falling' },
  { type: 'Fire', icon: 'flame', examples: 'Fireball, torches' },
  { type: 'Cold', icon: 'snowflake', examples: 'Ray of Frost, Ice Storm' },
  { type: 'Lightning', icon: 'zap', examples: 'Lightning Bolt, Call Lightning' },
  { type: 'Thunder', icon: 'volume2', examples: 'Thunderwave, Shatter' },
  { type: 'Poison', icon: 'skull', examples: 'Poison Spray, snake bites' },
  { type: 'Acid', icon: 'droplet', examples: 'Acid Splash, black dragon breath' },
  { type: 'Necrotic', icon: 'moon', examples: 'Inflict Wounds, Blight' },
  { type: 'Radiant', icon: 'sun', examples: 'Guiding Bolt, Sacred Flame' },
  { type: 'Force', icon: 'target', examples: 'Magic Missile, Eldritch Blast' },
  { type: 'Psychic', icon: 'brain', examples: 'Vicious Mockery, Mind Blast' },
];

export function getCombatPhase(phase) {
  return COMBAT_TURN_ORDER.find(p => p.phase.toLowerCase().includes(phase.toLowerCase())) || null;
}

export function searchFAQ(query) {
  const lc = query.toLowerCase();
  return COMMON_COMBAT_QUESTIONS.filter(faq =>
    faq.q.toLowerCase().includes(lc) || faq.a.toLowerCase().includes(lc)
  );
}
