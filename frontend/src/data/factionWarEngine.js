/**
 * Faction War Engine — Territory control, escalation, and diplomacy.
 * Tracks faction conflicts that evolve with or without party intervention.
 */

export const WAR_ESCALATION_STAGES = [
  { stage: 1, label: 'Tensions', color: '#fbbf24', description: 'Diplomatic insults, trade disputes, border incidents. War is not yet inevitable.', playerImpact: 'Diplomacy can prevent escalation. Side quests to mediate.' },
  { stage: 2, label: 'Skirmishes', color: '#f97316', description: 'Small battles on borders. Raids on supply lines. Espionage.', playerImpact: 'Can support one side or attempt to de-escalate. Combat encounters increase.' },
  { stage: 3, label: 'Open War', color: '#ef4444', description: 'Full military engagement. Armies march. Civilians flee.', playerImpact: 'Party actions have major impact. Key battles can be influenced.' },
  { stage: 4, label: 'Total War', color: '#dc2626', description: 'Scorched earth. No neutrals. Every resource dedicated to victory.', playerImpact: 'Forced to pick sides or become targets of both. War crimes possible.' },
  { stage: 5, label: 'Aftermath', color: '#94a3b8', description: 'One side has won or both are exhausted. Occupation, rebuilding, or partition.', playerImpact: 'Shape the peace. Influence reconstruction. Deal with war criminals.' },
];

export const FACTION_WAR_EVENTS = [
  { event: 'Border Incident', stage: 1, description: 'A patrol from one faction crosses into the other\'s territory. Shots are fired.', consequence: 'Tensions rise. Both sides demand an apology.' },
  { event: 'Assassination Attempt', stage: 1, description: 'A leader of one faction is targeted. The other faction is blamed (possibly falsely).', consequence: 'Public outrage. War hawks gain influence.' },
  { event: 'Trade Embargo', stage: 1, description: 'One faction cuts off trade. The other\'s economy suffers.', consequence: 'Civilian hardship. Smuggling opportunities.' },
  { event: 'Spy Network Exposed', stage: 2, description: 'Spies from one faction are discovered and executed.', consequence: 'Diplomatic crisis. Information advantage shifts.' },
  { event: 'Border Fortress Falls', stage: 2, description: 'A strategic position is captured. The losing side is demoralized.', consequence: 'Territory changes. Refugee crisis begins.' },
  { event: 'Supply Line Raided', stage: 2, description: 'A critical supply convoy is ambushed and destroyed.', consequence: 'One army faces shortages. Morale drops.' },
  { event: 'Major Battle', stage: 3, description: 'Thousands clash on an open field. The outcome shapes the war.', consequence: 'Decisive shift in power. Many casualties.' },
  { event: 'Siege Begins', stage: 3, description: 'A major city is surrounded and cut off.', consequence: 'Civilian suffering. Starvation timer begins.' },
  { event: 'Alliance Shift', stage: 3, description: 'A third faction joins one side, changing the balance.', consequence: 'New fronts open. Old alliances questioned.' },
  { event: 'Scorched Earth', stage: 4, description: 'Retreating armies destroy everything to deny it to the enemy.', consequence: 'Farmland ruined. Famine spreads.' },
  { event: 'War Crimes', stage: 4, description: 'A massacre of prisoners or civilians is reported.', consequence: 'International condemnation. Possible third-party intervention.' },
  { event: 'Peace Negotiations', stage: 5, description: 'Exhausted sides agree to talk. But trust is shattered.', consequence: 'Party can influence terms. Old grudges surface.' },
  { event: 'Occupation', stage: 5, description: 'The victor occupies the loser\'s territory. Resistance forms.', consequence: 'Guerrilla warfare. Collaboration vs. resistance dilemmas.' },
];

export const DIPLOMACY_OPTIONS = [
  { action: 'Mediate', difficulty: 'DC 15 Persuasion', effect: 'Reduce tension by 1 stage if both sides agree to talks.' },
  { action: 'Expose False Flag', difficulty: 'DC 18 Investigation', effect: 'Reveal that an incident was staged. Prevents escalation.' },
  { action: 'Broker Trade Deal', difficulty: 'DC 14 Persuasion', effect: 'Economic incentive for peace. -1 tension.' },
  { action: 'Deliver Ultimatum', difficulty: 'DC 16 Intimidation', effect: 'Force one side to back down. Risk: may escalate if failed.' },
  { action: 'Hostage Exchange', difficulty: 'DC 13 Diplomacy', effect: 'Return prisoners. Build goodwill. -1 tension.' },
  { action: 'Marriage Alliance', difficulty: 'DC 17 Persuasion', effect: 'Propose a political marriage. Long-term peace if accepted.' },
  { action: 'Sabotage War Effort', difficulty: 'DC 15 Stealth/Deception', effect: 'Weaken one side to force negotiations.' },
  { action: 'Champion Duel', difficulty: 'Combat', effect: 'Each side nominates a champion. Winner\'s faction gets favorable terms.' },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function getWarStage(stageNum) {
  return WAR_ESCALATION_STAGES.find(s => s.stage === stageNum) || WAR_ESCALATION_STAGES[0];
}

export function getEventsForStage(stage) {
  return FACTION_WAR_EVENTS.filter(e => e.stage === stage);
}

export function generateWarEvent(stage) {
  const events = getEventsForStage(stage);
  return events.length > 0 ? pick(events) : pick(FACTION_WAR_EVENTS);
}
