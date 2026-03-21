/**
 * playerImprovisation.js
 * Player Mode: Creative combat improvisation and environmental interaction
 * Pure JS — no React dependencies.
 */

export const IMPROVISED_ACTIONS = [
  { action: 'Throw Sand/Dirt', ruling: 'Action or free (DM call). DEX save or blinded until end of their next turn.', dc: '10-12', note: 'Pocket sand! Not RAW but most DMs allow it as a creative move.' },
  { action: 'Tackle', ruling: 'Athletics contest (like Shove but more dramatic). Both creatures prone on success.', dc: 'Contested', note: 'Grapple + shove combined. You also go prone though.' },
  { action: 'Kick Dirt into Fire', ruling: 'Free action or bonus (DM call). Creates brief smoke for concealment.', dc: 'None', note: 'Creative use of environment. Won\'t work long but may grant one turn of concealment.' },
  { action: 'Slide Under Legs', ruling: 'Acrobatics check. Move through hostile creature\'s space.', dc: '15-20 (size dependent)', note: 'Move through a Large+ creature\'s space. Great for repositioning.' },
  { action: 'Disarm', ruling: 'Attack roll vs target\'s Athletics or Acrobatics. Weapon falls at their feet.', dc: 'Contested', note: 'Optional rule (DMG p.271). Doesn\'t consume your action — replaces one attack.' },
  { action: 'Improvised Weapon', ruling: 'Anything not designed as a weapon. 1d4 damage. Proficiency only if similar to a real weapon.', dc: 'Normal attack', note: 'Chair, mug, rock, severed arm — if you can lift it, you can hit with it.' },
  { action: 'Push Off Ledge', ruling: 'Shove action. Target falls if within 5ft of edge. Falling = 1d6 per 10ft.', dc: 'Contested Athletics', note: 'One of the most devastating improvised moves. Position enemies near edges.' },
  { action: 'Swing from Chandelier', ruling: 'Athletics check + attack at advantage (DM call). Fun and dramatic.', dc: '12-15', note: 'Fail = fall prone. Succeed = move 15-20ft and attack with advantage. Cinematic!' },
  { action: 'Break Floor/Ceiling', ruling: 'Attack against AC 15-17 object. Creates difficult terrain or falling hazard.', dc: 'Object AC', note: 'Weakened structures can be destroyed. Always ask the DM about structural supports.' },
  { action: 'Use Enemy as Shield', ruling: 'Grapple first, then use their body as half cover (+2 AC).', dc: 'Contested', note: 'Grappled creature provides cover. Attacks against you might hit THEM.' },
];

export const CREATIVE_THINKING_PROMPTS = [
  'What\'s in the environment that isn\'t bolted down? It\'s a weapon or a tool.',
  'Can the terrain help or hinder? High ground, water, fire, narrowchokepints?',
  'Is there anything above the enemy? Chandeliers, stalactites, beams?',
  'Can you change the environment? Create fire, ice, water, darkness?',
  'What would a movie hero do here? The DM probably wants to say yes to cool stuff.',
  'Can you combine actions with an ally? One distracts, one strikes?',
  'What would the enemy NOT expect? Surprise tactics are often more effective.',
  'Can physics help? Gravity, momentum, leverage, fire + flammable materials?',
];

export const DM_RULING_EXPECTATIONS = [
  { ruling: 'The Rule of Cool', description: 'If it\'s creative and cinematic, many DMs will allow it with an appropriate check.', tip: 'Describe what you want to do in vivid detail. Enthusiasm is contagious.' },
  { ruling: 'Ability Check', description: 'Most improvised actions require an appropriate ability check (Athletics, Acrobatics, etc.).', tip: 'The DM sets the DC. Higher DC for more impactful effects.' },
  { ruling: 'Action Cost', description: 'Most improvised actions cost your Action. Some minor ones might be free or bonus.', tip: 'Ask: "Would this cost my action or could it be part of my attack?"' },
  { ruling: 'Damage', description: 'Improvised damage is usually 1d4-1d6 for thrown objects, 1d6 per 10ft for falls.', tip: 'The environment damage often exceeds weapon damage at low levels.' },
  { ruling: 'Risk', description: 'Creative actions often have a failure cost. Swinging from a chandelier might mean falling prone.', tip: 'Accept the risk. The memorable moments come from bold plays.' },
];

export function getImprovisedAction(actionName) {
  return IMPROVISED_ACTIONS.find(a =>
    a.action.toLowerCase().includes((actionName || '').toLowerCase())
  ) || null;
}

export function getRandomPrompt() {
  return CREATIVE_THINKING_PROMPTS[Math.floor(Math.random() * CREATIVE_THINKING_PROMPTS.length)];
}
