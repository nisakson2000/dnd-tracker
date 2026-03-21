/**
 * Villain Intelligence — Adaptive villain behavior and counter-strategies.
 * Villains learn from party tactics and prepare countermeasures.
 */

export const VILLAIN_ARCHETYPES = {
  mastermind: {
    label: 'Mastermind',
    description: 'Plans within plans. Never fights directly if avoidable.',
    counterStrategies: [
      'If party uses stealth: deploys magical wards, alarm spells, and disposable sentries.',
      'If party relies on a single strong member: targets them with targeted curses or kidnapping.',
      'If party has a pattern of frontal assault: creates elaborate traps and chokepoints.',
      'If party has divination: uses Nondetection, lead-lined rooms, or false trails.',
      'If party has political allies: blackmails, discredits, or assassinates those allies.',
    ],
    monologueCallbacks: [
      '"I knew you\'d come this way. I\'ve been watching your methods for weeks."',
      '"Your friend in [city]? They work for me now. Have for months."',
      '"You think you\'re the hunters? You\'re the experiment."',
    ],
    spyNetworkLevel: 'extensive',
  },
  brute: {
    label: 'Warlord',
    description: 'Overwhelming force. Respects strength. Challenges rivals.',
    counterStrategies: [
      'If party avoided open battle: burns villages to draw them out.',
      'If party uses hit-and-run: posts guards at every road and bridge.',
      'If party beat their lieutenant: personally leads the next attack with elite guard.',
      'If party has a weak member: challenges the strongest to single combat, threatens the weak.',
      'If party uses magic: recruits anti-magic mercenaries or wild magic creatures.',
    ],
    monologueCallbacks: [
      '"Last time you ran. This time, there\'s nowhere to run."',
      '"Your tricks won\'t work twice. I learn."',
      '"Face me. Alone. Or I burn everything you\'ve ever protected."',
    ],
    spyNetworkLevel: 'minimal',
  },
  manipulator: {
    label: 'Manipulator',
    description: 'Turns allies against each other. Sows doubt and division.',
    counterStrategies: [
      'If party is united: plants evidence that one member is a traitor.',
      'If party relies on NPC allies: turns those NPCs with bribes, threats, or blackmail.',
      'If party exposes their plans: frames someone else and plays the victim.',
      'If party uses Insight checks: has genuine emotions about false narratives.',
      'If party has a reformed villain ally: sends reminders of their past crimes to the party.',
    ],
    monologueCallbacks: [
      '"Who told you I was the villain? Was it [NPC]? Ask them where they were that night."',
      '"I didn\'t make your friend betray you. I just gave them a reason."',
      '"The truth? There are so many truths. Which one would you like?"',
    ],
    spyNetworkLevel: 'moderate',
  },
  fanatic: {
    label: 'True Believer',
    description: 'Utterly convinced they\'re right. Willing to die for the cause.',
    counterStrategies: [
      'If party kills followers: martyrdom inspires more recruits. The movement grows.',
      'If party captures them: hunger strikes, preaching to guards, inspiring jailbreaks.',
      'If party discredits them: doubles down with a dramatic act of faith.',
      'If party tries diplomacy: considers it a sign of weakness and escalates.',
      'If party destroys their temple: "The temple is not the stones. The temple is the belief."',
    ],
    monologueCallbacks: [
      '"You can kill me. You can\'t kill what I believe."',
      '"Every one of mine you strike down becomes a symbol. Thank you for the martyrs."',
      '"I have seen the truth. I pity you for your blindness."',
    ],
    spyNetworkLevel: 'moderate',
  },
  ancient_evil: {
    label: 'Ancient Evil',
    description: 'Patient, powerful, incomprehensible. Time means nothing.',
    counterStrategies: [
      'If party finds a weakness: moves the weakness to a more dangerous location.',
      'If party gains a powerful weapon: corrupts it or sends nightmares to the wielder.',
      'If party seals one entrance: has existed long enough to have dozens of others.',
      'If party finds allies: has faced coalitions before and outlasted them all.',
      'If party uses a prophecy: the prophecy was part of its plan all along.',
    ],
    monologueCallbacks: [
      '"I was ancient when your gods were young. What are you?"',
      '"You are not the first to stand where you stand. You will not be the last."',
      '"Time. I have all of it. You have so very little."',
    ],
    spyNetworkLevel: 'none (doesn\'t need them)',
  },
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function getVillainArchetypes() {
  return Object.entries(VILLAIN_ARCHETYPES).map(([key, v]) => ({
    id: key,
    label: v.label,
    description: v.description,
  }));
}

export function suggestCounterStrategy(archetypeKey, partyTactic) {
  const archetype = VILLAIN_ARCHETYPES[archetypeKey];
  if (!archetype) return 'The villain observes and adapts.';
  return pick(archetype.counterStrategies);
}

export function getVillainMonologue(archetypeKey) {
  const archetype = VILLAIN_ARCHETYPES[archetypeKey];
  if (!archetype) return '"You think you can stop me? How quaint."';
  return pick(archetype.monologueCallbacks);
}
