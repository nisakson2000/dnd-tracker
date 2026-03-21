export const MORAL_DILEMMAS = [
  {
    title: 'The Informant',
    setup: 'A captured enemy offers vital information about an imminent attack — but only if you let them go free. They\'ve killed innocents before.',
    choice_a: 'Accept the deal and release them',
    choice_b: 'Refuse and try to get the information another way',
    stakes: 'Lives hang in the balance either way. Trust is the currency.',
    themes: ['justice', 'pragmatism', 'trust'],
  },
  {
    title: 'The Plague Village',
    setup: 'A village is infected with a magical plague. A quarantine would save the region but doom the villagers. A cure exists but requires a rare component guarded by a dangerous creature.',
    choice_a: 'Enforce the quarantine — sacrifice the few for the many',
    choice_b: 'Break quarantine to seek the cure — risk spreading the plague',
    stakes: 'There\'s no clean answer. Every option has a cost.',
    themes: ['sacrifice', 'risk', 'compassion'],
  },
  {
    title: 'The Child Soldier',
    setup: 'You discover the enemy army uses magically aged children as soldiers. They fight like adults but are children inside. One surrenders to you.',
    choice_a: 'Treat them as a prisoner of war',
    choice_b: 'Try to reverse the magic and restore their childhood',
    stakes: 'The reversal is dangerous and might kill them. Imprisonment feels cruel.',
    themes: ['innocence', 'mercy', 'war'],
  },
  {
    title: 'The Tyrant\'s Heir',
    setup: 'The tyrant is dead. Their young child is the only legitimate heir. The child is kind and intelligent — but the people fear the bloodline.',
    choice_a: 'Support the child\'s claim and guide them to be a just ruler',
    choice_b: 'Remove the child from succession to give the people peace',
    stakes: 'Stability vs. justice. Fear vs. hope.',
    themes: ['legacy', 'leadership', 'fear'],
  },
  {
    title: 'The Necessary Evil',
    setup: 'An allied NPC has been secretly committing atrocities to fund the war effort against a greater evil. The money has saved thousands.',
    choice_a: 'Expose them and cut off the funding',
    choice_b: 'Stay silent until the greater threat is dealt with',
    stakes: 'How much evil is acceptable in service of good?',
    themes: ['ends vs. means', 'accountability', 'war'],
  },
  {
    title: 'The Sentient Weapon',
    setup: 'A powerful sentient weapon offers to help defeat the villain — but it feeds on the wielder\'s memories. Each use erases a cherished memory permanently.',
    choice_a: 'Use the weapon and pay the price',
    choice_b: 'Find another way, even if it takes longer and costs more lives',
    stakes: 'What are your memories worth? What if they\'re all you have?',
    themes: ['sacrifice', 'identity', 'power'],
  },
  {
    title: 'The Turncoat',
    setup: 'A former enemy wants to defect and join your side. They have critical intelligence. But one of your allies was personally wronged by this person.',
    choice_a: 'Accept the defector despite your ally\'s objections',
    choice_b: 'Turn them away to maintain party trust',
    stakes: 'Strategic advantage vs. personal loyalty.',
    themes: ['forgiveness', 'loyalty', 'pragmatism'],
  },
  {
    title: 'The Forbidden Knowledge',
    setup: 'A library contains the knowledge to defeat the villain — but also instructions for creating weapons of mass destruction. You can\'t take one without the other.',
    choice_a: 'Take all the knowledge and guard the dangerous parts',
    choice_b: 'Destroy the library to prevent the weapons from ever being made',
    stakes: 'Knowledge is power — and power corrupts.',
    themes: ['knowledge', 'responsibility', 'trust'],
  },
  {
    title: 'The Promised Land',
    setup: 'Refugees need a home. An uninhabited but sacred forest could shelter them, but desecrating it would anger the nature spirits who protect the region.',
    choice_a: 'Settle the refugees and deal with the spirits\' wrath',
    choice_b: 'Honor the forest and find the refugees another solution',
    stakes: 'Immediate human need vs. long-term environmental and spiritual balance.',
    themes: ['nature', 'need', 'sacred'],
  },
  {
    title: 'The Last Resort',
    setup: 'The party discovers that a powerful ritual can stop the apocalypse — but it requires a willing sacrifice. One NPC the party loves volunteers.',
    choice_a: 'Let the NPC sacrifice themselves',
    choice_b: 'Refuse and search for another way with no guarantee of success',
    stakes: 'One life for the world. But is it your choice to make?',
    themes: ['sacrifice', 'agency', 'hope'],
  },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateDilemma(themes = []) {
  if (themes.length > 0) {
    const filtered = MORAL_DILEMMAS.filter(d =>
      d.themes.some(t => themes.includes(t))
    );
    if (filtered.length > 0) return pick(filtered);
  }
  return pick(MORAL_DILEMMAS);
}

export function getDilemmaThemes() {
  const allThemes = new Set();
  MORAL_DILEMMAS.forEach(d => d.themes.forEach(t => allThemes.add(t)));
  return [...allThemes].sort();
}
