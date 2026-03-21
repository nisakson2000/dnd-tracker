/**
 * playerRoleplayIntegration.js
 * Player Mode: Integrating roleplay with combat mechanics
 * Pure JS — no React dependencies.
 */

export const COMBAT_ROLEPLAY = [
  { moment: 'Describe your attacks', tip: 'Don\'t say "I attack." Say "I lunge forward, driving my blade under the orc\'s guard." DMs often reward creativity.', mechanic: 'No mechanical benefit, but builds immersion and DM goodwill.' },
  { moment: 'Describe your spells', tip: 'Flavor the spell. "My hands glow with golden light as I call down a pillar of sacred flame" vs "I cast Sacred Flame."', mechanic: 'Same spell, better table experience.' },
  { moment: 'Talk to enemies mid-fight', tip: 'Intimidate, taunt, negotiate. "Surrender now or your friends die next." Free object interaction includes 6 seconds of speech.', mechanic: 'Intimidation check can frighten. DM may grant advantage.' },
  { moment: 'React to being hit', tip: 'Describe the pain, the stagger, the grit. "The arrow punches through my shoulder. I grit my teeth and keep fighting."', mechanic: 'Builds drama. DMs may offer inspiration dice.' },
  { moment: 'Critical hit flavor', tip: 'Crits deserve epic descriptions. "My blade finds the gap in his plate, and I twist. The dragon roars."', mechanic: 'Critical hit descriptions are memorable moments.' },
  { moment: 'Death saves', tip: 'Narrate the struggle. "My vision tunnels. I see my companions fighting above me. I cling to consciousness."', mechanic: 'Tension building. Other players engage more with rescue.' },
];

export const BACKGROUND_IN_COMBAT = [
  { background: 'Soldier', integration: 'Issue tactical orders. Use military terminology. "Form a defensive line!" Rally allies.', mechanic: 'Help action flavored as battlefield command.' },
  { background: 'Criminal', integration: 'Fight dirty. Pocket sand, hidden daggers, target weak spots.', mechanic: 'Flavor for Sneak Attack, Cunning Action.' },
  { background: 'Noble', integration: 'Duel with honor (or without it). Challenge enemies. Parry and riposte.', mechanic: 'Flavor for Battle Master maneuvers.' },
  { background: 'Acolyte', integration: 'Pray before battle. Channel divine fury. "By the light of Pelor!"', mechanic: 'Flavor for divine spells, Channel Divinity.' },
  { background: 'Sage', integration: 'Analyze enemy weaknesses. "Trolls regenerate — use fire!" Share knowledge.', mechanic: 'Arcana/Nature/Religion checks to identify creatures.' },
  { background: 'Outlander', integration: 'Fight like a wild predator. Primal screams. Terrain awareness.', mechanic: 'Survival checks, favored terrain bonuses (Ranger).' },
];

export const BOND_FLAWS_IN_COMBAT = {
  bonds: [
    'Protect a specific ally at all costs. Take hits for them. Shield them.',
    'Sworn to defeat a certain enemy type. Charge at them recklessly.',
    'Must honor a code of combat. Challenge leaders. Refuse dishonorable tactics.',
  ],
  flaws: [
    'Cowardice: flee when below half HP. Require a rallying moment to return.',
    'Bloodlust: refuse to take prisoners. Attack downed enemies.',
    'Overconfidence: always target the biggest threat. Ignore tactical advice.',
    'Grudge: prioritize a specific enemy type over tactical targets.',
  ],
  note: 'Playing flaws makes roleplay richer. DMs award inspiration for playing against optimal strategy.',
};

export const INSPIRATION_TRIGGERS = [
  'Play your character\'s personality in a way that creates interesting drama.',
  'Make a suboptimal choice because it\'s what your character would do.',
  'Describe a creative solution that surprises the table.',
  'Roleplay a flaw that costs you something meaningful.',
  'Rally the party with an in-character speech.',
  'Show mercy or cruelty when the opposite is expected.',
];

export function creativityBonus(description) {
  // Simple heuristic: longer, more detailed descriptions suggest more roleplay effort
  if (!description) return 0;
  const words = description.split(' ').length;
  if (words > 20) return 2; // DM might give advantage
  if (words > 10) return 1; // DM might give inspiration
  return 0;
}
