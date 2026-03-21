/**
 * playerRetreatingProtocol.js
 * Player Mode: When and how to retreat from combat — survival over glory
 * Pure JS — no React dependencies.
 */

export const WHEN_TO_RETREAT = [
  { signal: 'Party below 25% HP with no healer spell slots', urgency: 'Critical', detail: 'No healing available and everyone is low. One more round could mean a TPK.' },
  { signal: 'Two or more party members down', urgency: 'Critical', detail: 'Action economy is destroyed. Remaining members can\'t hold.' },
  { signal: 'Enemy has way more HP than expected', urgency: 'High', detail: 'If the boss is barely scratched after 3 rounds of focus fire, you may be underleveled.' },
  { signal: 'Reinforcements arriving', urgency: 'High', detail: 'If more enemies are joining and you\'re already struggling, leave now.' },
  { signal: 'Key player is dominated/incapacitated', urgency: 'High', detail: 'If the enemy controls your strongest member, retreat and regroup.' },
  { signal: 'No spell slots and enemies have plenty', urgency: 'Medium', detail: 'Attrition favors the enemy if they have resources and you don\'t.' },
  { signal: 'Objective is accomplished', urgency: 'Medium', detail: 'Got the item? Rescued the prisoner? Leave. Don\'t fight for no reason.' },
  { signal: 'DM is telegraphing danger', urgency: 'High', detail: '"Are you SURE you want to do that?" and "This creature looks ancient and powerful" are DM warnings.' },
];

export const RETREAT_TACTICS = [
  { tactic: 'Fighting retreat', detail: 'One person Dodges and covers while others Dash away. Rotate who covers.', bestFor: 'Organized parties with a tank' },
  { tactic: 'Fog Cloud / Darkness', detail: 'Create obscurement. Enemies can\'t see to make ranged attacks. Run.', bestFor: 'Casters with area denial spells' },
  { tactic: 'Wall spells', detail: 'Wall of Fire, Wall of Force, Wall of Stone between you and enemies. Run.', bestFor: 'Casters with Wall spells' },
  { tactic: 'Scatter', detail: 'Everyone runs in different directions. Enemies can\'t chase all of you.', bestFor: 'Desperate situations, fast party members' },
  { tactic: 'Teleportation', detail: 'Dimension Door (2 people), Misty Step, Thunder Step, Teleport (party).', bestFor: 'Casters with teleportation' },
  { tactic: 'Plant Growth', detail: 'No save, no concentration, 100ft radius. Costs 4x movement. Enemies can barely move.', bestFor: 'Druids/Rangers' },
  { tactic: 'Disengage + Dash', detail: 'Rogue: Cunning Action Disengage + Move. Others: Disengage action + movement.', bestFor: 'Rogues especially' },
  { tactic: 'Hypnotic Pattern / Hold Person', detail: 'Disable pursuers. They can\'t chase if they can\'t act.', bestFor: 'Controllers with disabling spells' },
  { tactic: 'Caltrops / Ball Bearings', detail: 'Toss behind you. Creates difficult terrain or prone risk. Cheap and effective.', bestFor: 'Anyone with the items' },
];

export const COVERING_THE_RETREAT = [
  { role: 'Tank / Rear Guard', action: 'Dodge action while standing in a chokepoint. Let allies Dash past you.', sacrifice: 'Medium — tank can absorb hits.' },
  { role: 'Caster', action: 'Drop a Wall spell or area denial (Spike Growth, Web). Then Misty Step away.', sacrifice: 'Low — spell does the work, you escape.' },
  { role: 'Fastest character', action: 'If everyone else is slower, the fastest character runs LAST because they can catch up.', sacrifice: 'Low — speed advantage.' },
  { role: 'Paladin', action: 'Stay within aura range of fleeing allies. +CHA to saves helps against pursuit spells.', sacrifice: 'Medium — Paladin is tanky enough.' },
];

export const REGROUPING = {
  afterRetreat: [
    'Count heads. Is everyone alive? Anyone missing?',
    'Heal up. Use all remaining resources on healing. You\'re done fighting.',
    'Assess what went wrong. Too strong? Wrong tactics? Bad luck?',
    'Plan a return. Better prepared, better strategy, maybe more allies.',
    'Consider leveling up or getting better equipment before returning.',
    'Information gathering. What were the enemy\'s weaknesses? What spells did they use?',
  ],
  shame: 'Retreating is NOT failure. It\'s the smartest tactical decision. The party that retreats lives to fight another day.',
};

export const NO_SHAME_RETREAT = [
  'Even legendary heroes retreat. It\'s called strategy.',
  'A TPK ends the campaign. A retreat is a setback you can recover from.',
  'The BBEG thinks they won. They get overconfident. That\'s YOUR advantage next time.',
  'Your characters don\'t have hit point bars. They don\'t know they have 3 HP. They DO know they\'re dying.',
  'Running away makes the eventual victory even sweeter.',
  'The DM probably doesn\'t want a TPK either. They\'ll help you retreat if you commit to it.',
];

export function shouldRetreat(partyHP, maxHP, membersDown, partySize, healingSlotsLeft) {
  const hpPercent = partyHP / maxHP;
  const downPercent = membersDown / partySize;

  if (downPercent >= 0.5) return { retreat: true, urgency: 'CRITICAL', reason: 'Half the party is down. Get out NOW.' };
  if (hpPercent < 0.2 && healingSlotsLeft <= 0) return { retreat: true, urgency: 'CRITICAL', reason: 'Critically low HP and no healing.' };
  if (hpPercent < 0.3) return { retreat: true, urgency: 'HIGH', reason: 'Party HP is dangerously low.' };
  if (downPercent >= 0.25) return { retreat: true, urgency: 'HIGH', reason: 'Multiple members are down.' };
  return { retreat: false, urgency: 'LOW', reason: 'Party can continue fighting.' };
}
