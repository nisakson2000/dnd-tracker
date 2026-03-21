/**
 * playerSurvivorTips.js
 * Player Mode: Character survival tips for dangerous campaigns
 * Pure JS — no React dependencies.
 */

export const SURVIVAL_PRIORITIES = [
  { priority: 1, tip: 'Don\'t split the party', reason: 'Action economy is everything. 4v4 is way better than 2v4 twice.' },
  { priority: 2, tip: 'Always have an escape plan', reason: 'Misty Step, Dimension Door, or just knowing the exit. Don\'t get cornered.' },
  { priority: 3, tip: 'Keep Healing Word prepared', reason: 'Bonus action, 60ft range. Pick up downed allies without wasting your action.' },
  { priority: 4, tip: 'Carry diamonds for Revivify', reason: '300gp in diamonds is the difference between resurrection and rolling a new character.' },
  { priority: 5, tip: 'Don\'t fight everything', reason: 'Some encounters are meant to be avoided. Retreat is a valid strategy.' },
  { priority: 6, tip: 'Short rest when you can', reason: 'Hit dice, class features, and Warlock slots recover on short rests. Use them.' },
  { priority: 7, tip: 'Position matters more than damage', reason: 'A well-positioned character takes less damage than a poorly-positioned one deals.' },
  { priority: 8, tip: 'Save your best abilities', reason: 'Don\'t blow everything on the first encounter. The DM may have 3 more coming.' },
  { priority: 9, tip: 'Communicate with your party', reason: 'Focus fire, coordinate actions, call out threats. Communication wins fights.' },
  { priority: 10, tip: 'Know when you\'re in over your head', reason: 'Multiple party members down? Healer out of slots? Time to run.' },
];

export const DEADLY_SITUATIONS = [
  { situation: 'TPK Incoming', signs: ['Multiple members at 0 HP', 'Healer unconscious', 'Out of spell slots'], response: 'Someone casts Fog Cloud/Darkness. Everyone Dashes for the exit. Sacrifice play if needed.' },
  { situation: 'Ambushed', signs: ['Enemies have surprise', 'Party is spread out', 'No cover'], response: 'Dodge on first turn. Regroup. Retreat to better ground if possible.' },
  { situation: 'Boss is Too Strong', signs: ['Can\'t hit its AC', 'It has Legendary Resistance', 'Immune to your damage type'], response: 'Change tactics. Use saves instead of attacks. Target non-immune damage types. Consider retreat.' },
  { situation: 'Drowning/Suffocating', signs: ['Underwater without Water Breathing', 'In Cloudkill', 'Buried alive'], response: 'CON mod + 1 minutes of breath. After that: 0 HP in CON mod rounds. Dash for safety.' },
  { situation: 'Falling', signs: ['Knocked off cliff', 'Flying disabled mid-air', 'Floor collapsed'], response: 'Feather Fall (reaction). Monk: Slow Fall. Nothing? 1d6 per 10ft, max 20d6 at 200ft.' },
];

export const EMERGENCY_SPELLS = [
  { spell: 'Feather Fall (1st)', trigger: 'Falling', effect: 'Reaction: slow fall to 60ft/round for 5 creatures. No damage.' },
  { spell: 'Healing Word (1st)', trigger: 'Ally at 0 HP', effect: 'Bonus action, 60ft range. Pick them up.' },
  { spell: 'Misty Step (2nd)', trigger: 'Need to escape', effect: 'Bonus action teleport 30ft. No OA.' },
  { spell: 'Counterspell (3rd)', trigger: 'Enemy casting', effect: 'Negate a spell. Save the party from Fireball/Hold Person.' },
  { spell: 'Revivify (3rd)', trigger: 'Ally died', effect: 'Bring back from the dead within 1 minute. 300gp diamond.' },
  { spell: 'Death Ward (4th)', trigger: 'Before danger', effect: 'Pre-cast. Next time you\'d drop to 0, go to 1 instead.' },
];

export function assessDanger(hpPercent, downMembers, partySize, slotsRemaining) {
  if (downMembers >= Math.ceil(partySize / 2)) return { level: 'Critical', advice: 'Consider retreat immediately.' };
  if (hpPercent < 20 && slotsRemaining <= 1) return { level: 'Severe', advice: 'One more hit could be fatal. Play defensively.' };
  if (hpPercent < 40) return { level: 'Moderate', advice: 'Be cautious. Prioritize healing and defensive actions.' };
  return { level: 'Manageable', advice: 'Stay aggressive but conserve resources.' };
}
