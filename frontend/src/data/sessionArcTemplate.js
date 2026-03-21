/**
 * Session Arc Templates — Dramatic structure templates for session planning.
 * Each template provides a narrative framework with beats and pacing guidance.
 */

export const SESSION_ARC_TEMPLATES = {
  classic: {
    label: 'Classic Adventure',
    description: 'The standard adventure arc: hook, rising action, climax, resolution.',
    beats: [
      { name: 'Opening Hook', timing: 'First 15 minutes', tension: 3, description: 'Establish the situation. Present the call to adventure. Give the party a reason to act.', tips: 'Start in media res if possible. "You are already..." is more engaging than "You hear about..."' },
      { name: 'Investigation / Exploration', timing: '15-45 minutes', tension: 4, description: 'The party gathers information, explores, and makes plans. Clues and encounters build understanding.', tips: 'Provide 3 clues for every important revelation (the Rule of Three). Let players feel clever.' },
      { name: 'Rising Action', timing: '45-90 minutes', tension: 6, description: 'Complications arise. Allies and enemies are revealed. Stakes become clear. First significant combat.', tips: 'This is where the session\'s theme crystallizes. Every scene should raise the stakes.' },
      { name: 'Midpoint Twist', timing: '90 minutes', tension: 7, description: 'A revelation changes everything. An ally betrays, a truth is revealed, or the real threat emerges.', tips: 'The best twists are foreshadowed but surprising. They should change strategy, not invalidate work.' },
      { name: 'Escalation', timing: '90-120 minutes', tension: 8, description: 'The party pushes toward the climax. Resources are spent. Hard choices are made.', tips: 'Limit safe rests here. Time pressure and dwindling resources create real tension.' },
      { name: 'Climax', timing: '120-150 minutes', tension: 10, description: 'The main confrontation. Boss fight, final puzzle, or critical social encounter.', tips: 'Make it personal. Reference earlier moments. Let every player contribute.' },
      { name: 'Resolution', timing: 'Last 15-30 minutes', tension: 2, description: 'Aftermath. Rewards distributed. Consequences revealed. Threads for next session planted.', tips: 'End with a hook for next time. A question unanswered, a new threat glimpsed, or a letter received.' },
    ],
  },
  mystery: {
    label: 'Mystery / Investigation',
    description: 'A detective-style session focused on clues, suspects, and revelation.',
    beats: [
      { name: 'The Crime Scene', timing: 'First 20 minutes', tension: 4, description: 'Present the mystery. A crime, disappearance, or strange event. Establish the "what."', tips: 'Give 3-5 clues at the scene. Some obvious, some requiring checks.' },
      { name: 'Suspect Interviews', timing: '20-60 minutes', tension: 5, description: 'Meet NPCs connected to the mystery. Everyone has secrets, motives, and alibis.', tips: 'Make every suspect both plausible and sympathetic. Red herrings should be interesting, not annoying.' },
      { name: 'The Hidden Clue', timing: '60-90 minutes', tension: 6, description: 'A breakthrough discovery that reframes the investigation. New locations or suspects revealed.', tips: 'If players are stuck, have a clue come to them (a witness arrives, evidence is delivered).' },
      { name: 'The Trap / Confrontation', timing: '90-120 minutes', tension: 8, description: 'The party confronts the prime suspect or springs a trap. Combat or social showdown.', tips: 'The culprit should have a understandable motivation. Pure evil is less interesting than tragic evil.' },
      { name: 'The Reveal', timing: '120-140 minutes', tension: 9, description: 'The full truth comes out. Motivations explained. Justice served or denied.', tips: 'Let the players piece it together before you reveal. Guide, don\'t spoonfeed.' },
      { name: 'Aftermath', timing: 'Last 15 minutes', tension: 2, description: 'Consequences ripple out. Was justice served? What does this mean for the wider world?', tips: 'The solved mystery should connect to larger campaign threads.' },
    ],
  },
  dungeon_crawl: {
    label: 'Dungeon Crawl',
    description: 'A classic dungeon delve with exploration, traps, and a boss.',
    beats: [
      { name: 'The Entrance', timing: 'First 15 minutes', tension: 3, description: 'Approach and entry. Environmental storytelling hints at what\'s inside.', tips: 'The entrance itself can be a puzzle or a choice (front door vs. secret entrance).' },
      { name: 'Outer Rooms', timing: '15-45 minutes', tension: 5, description: 'Initial encounters and exploration. Establish the dungeon\'s theme and dangers.', tips: 'Mix combat, traps, and environmental puzzles. Reward exploration.' },
      { name: 'The Guardian', timing: '45-75 minutes', tension: 6, description: 'A significant encounter that guards the path deeper. Mini-boss or trap gauntlet.', tips: 'This fight should teach the party something about the dungeon\'s boss or theme.' },
      { name: 'Deep Rooms', timing: '75-105 minutes', tension: 7, description: 'Harder encounters. More valuable treasure. The dungeon reveals its history.', tips: 'Resource management becomes critical. Short rest decision point.' },
      { name: 'The Boss Lair', timing: '105-140 minutes', tension: 9, description: 'The final chamber. Lair actions, legendary actions, environmental hazards.', tips: 'Make the arena as interesting as the boss. Terrain matters. Multiple phases keep it fresh.' },
      { name: 'Escape / Aftermath', timing: 'Last 15 minutes', tension: 3, description: 'The dungeon may collapse, flood, or produce reinforcements. Treasure division.', tips: 'A ticking clock on the way out adds urgency. "The cave is collapsing!" never gets old.' },
    ],
  },
  social_intrigue: {
    label: 'Social / Political Intrigue',
    description: 'A session focused on politics, negotiation, and manipulation.',
    beats: [
      { name: 'The Invitation', timing: 'First 15 minutes', tension: 3, description: 'The party enters the social arena. A feast, court, negotiation, or gathering.', tips: 'Establish the key NPCs, their goals, and the power dynamics immediately.' },
      { name: 'Working the Room', timing: '15-50 minutes', tension: 4, description: 'Players gather allies, information, and leverage through conversation.', tips: 'Give each NPC a clear want and fear. Let players exploit these.' },
      { name: 'The Complication', timing: '50-80 minutes', tension: 6, description: 'An unexpected event disrupts the gathering. An accusation, assassination attempt, or revelation.', tips: 'This should force players to choose sides or reveal their hand.' },
      { name: 'Alliance Building', timing: '80-110 minutes', tension: 7, description: 'Players use gathered information to forge alliances or undermine enemies.', tips: 'Every alliance should have a cost. No one helps for free in politics.' },
      { name: 'The Vote / Decision', timing: '110-130 minutes', tension: 9, description: 'The climactic social moment. A vote, treaty, duel, or public confrontation.', tips: 'Let the players\' earlier actions determine who supports them. Consequences are earned.' },
      { name: 'New Landscape', timing: 'Last 15 minutes', tension: 3, description: 'The political landscape has shifted. New allies, new enemies, new opportunities.', tips: 'End with the losers plotting revenge or the winners making demands.' },
    ],
  },
  survival: {
    label: 'Survival / Horror',
    description: 'A session focused on resource scarcity, fear, and survival against overwhelming odds.',
    beats: [
      { name: 'The Situation', timing: 'First 15 minutes', tension: 5, description: 'The party is trapped, lost, or hunted. Establish the threat and the scarcity.', tips: 'Start with a loss — equipment gone, party separated, or an ally taken.' },
      { name: 'Scavenging', timing: '15-45 minutes', tension: 6, description: 'Gather resources, find shelter, treat injuries. Every choice has a cost.', tips: 'Present constant small dilemmas: rest here or push on? Use the potion now or save it?' },
      { name: 'The Hunt', timing: '45-75 minutes', tension: 7, description: 'The threat is actively pursuing. Cat-and-mouse encounters. Narrow escapes.', tips: 'Show the threat\'s power indirectly — tracks, destruction, victims. Delay direct confrontation.' },
      { name: 'The Sacrifice', timing: '75-105 minutes', tension: 9, description: 'Something must be given up. A plan requires a sacrifice — equipment, safety, or risk.', tips: 'Make the sacrifice meaningful. Don\'t let players optimize their way out of hard choices.' },
      { name: 'Stand or Escape', timing: '105-135 minutes', tension: 10, description: 'Final confrontation or desperate escape. All resources spent.', tips: 'This should feel earned. If they prepared well, they should have a chance — but not a guarantee.' },
      { name: 'Safety', timing: 'Last 15 minutes', tension: 1, description: 'The immediate danger passes. But what did it cost? What was lost?', tips: 'Quiet aftermath. Let players process. The scars from survival sessions make characters deeper.' },
    ],
  },
};

export function getArcTemplate(key) {
  return SESSION_ARC_TEMPLATES[key] || SESSION_ARC_TEMPLATES.classic;
}

export function getArcOptions() {
  return Object.entries(SESSION_ARC_TEMPLATES).map(([key, arc]) => ({
    id: key,
    label: arc.label,
    description: arc.description,
    beatCount: arc.beats.length,
  }));
}

export function getCurrentBeat(arcKey, elapsedMinutes) {
  const arc = SESSION_ARC_TEMPLATES[arcKey];
  if (!arc) return null;
  // Find the beat that matches the current time
  for (let i = arc.beats.length - 1; i >= 0; i--) {
    const timing = arc.beats[i].timing;
    const match = timing.match(/(\d+)/);
    if (match && elapsedMinutes >= parseInt(match[1])) {
      return { ...arc.beats[i], index: i, total: arc.beats.length };
    }
  }
  return { ...arc.beats[0], index: 0, total: arc.beats.length };
}
