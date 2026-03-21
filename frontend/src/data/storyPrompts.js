/**
 * Story Prompts — Environmental storytelling details and side quest seeds.
 * DMs use these to add "you notice..." moments and generate quest hooks.
 */

// ── Environmental Storytelling (Item 228) ──
export const ENVIRONMENTAL_DETAILS = {
  dungeon: [
    'Scratches on the wall at waist height — someone was dragged through here.',
    'A child\'s doll sits in the corner, perfectly preserved despite the decay around it.',
    'The stone floor is worn smooth in a path — something paces here regularly.',
    'Fresh torch sconces are mounted on ancient walls. Someone has been maintaining this place.',
    'A half-eaten meal sits on a table. The food is still warm.',
    'Writing on the wall in dried blood. It reads: "DON\'T TRUST THE—" and stops.',
    'A mirror on the wall shows a room slightly different from the one you\'re in.',
    'The air tastes like copper. Your teeth ache slightly.',
  ],
  forest: [
    'Trees in this area grow in a perfect spiral pattern. Nature doesn\'t do this.',
    'A circle of mushrooms rings a clearing. The grass inside is a different shade of green.',
    'Bird calls stop abruptly as you enter this section of forest. Total silence.',
    'Someone has carved small protective runes into every third tree.',
    'A stream runs uphill for about 20 feet before resuming its normal course.',
    'Spider webs between the trees are arranged in geometric patterns too precise for insects.',
    'The undergrowth parts slightly ahead, as if something invisible just walked through.',
    'Flowers grow around a particular tree in an arrangement that looks like a face from above.',
  ],
  urban: [
    'A shop has been boarded up. Neighbors avoid looking at it directly.',
    'Identical posters on every wall — a face with the words "HAVE YOU SEEN THIS PERSON?" The face has been scratched out on all of them.',
    'A street performer\'s song has lyrics that seem to describe your recent actions.',
    'A door in an alley bears a symbol you\'ve seen somewhere before.',
    'The local well has been cordoned off. No one will say why.',
    'Children play a game that mimics a ritual you recognize as dangerous.',
    'A cat follows you for three blocks, then sits and stares before walking away.',
    'Graffiti on a wall warns: "The sewers remember."',
  ],
  tavern: [
    'A hooded figure drops a folded note on your table as they pass. It has a map.',
    'The bard\'s new song is about a group of adventurers who sound a lot like you.',
    'A painting on the wall depicts a location you haven\'t visited yet — but will.',
    'The barkeep wipes the same spot on the bar obsessively, avoiding eye contact.',
    'Someone has scratched a countdown into the bottom of your table. Three marks remain.',
    'A regular patron is conspicuously absent tonight. The barkeep seems nervous about it.',
  ],
  wilderness: [
    'A cairn of perfectly stacked stones marks an intersection. One stone is a different color.',
    'Animal tracks suddenly stop in the middle of an open field. No prints lead away.',
    'A tree has been struck by lightning — but the burn pattern forms a symbol.',
    'Wild animals in this area seem unusually calm and watch you with intelligence.',
    'The ruins of a single wall stand alone in a meadow. There\'s no evidence of other structures.',
    'A pond reflects the sky perfectly — except for one cloud that appears only in the reflection.',
  ],
};

// ── Side Quest Seeds (Item 176) ──
export const SIDE_QUEST_SEEDS = [
  {
    title: 'The Missing Apprentice',
    hook: 'A wizard\'s apprentice has disappeared during a routine herb-gathering trip.',
    complication: 'The apprentice left willingly — they\'ve found something in the woods they don\'t want their master to know about.',
    reward: '50 gp + a minor magic item',
    level: '1-4',
  },
  {
    title: 'The Haunted Bridge',
    hook: 'Travelers refuse to cross an old stone bridge at night. Those who do hear voices.',
    complication: 'The "ghost" is actually a bandit gang using illusion magic to keep people away from their hideout beneath the bridge.',
    reward: '75 gp + bandit loot',
    level: '1-4',
  },
  {
    title: 'The Poisoned Well',
    hook: 'A town\'s only water source has turned bitter. People are getting sick.',
    complication: 'A nearby mining operation is contaminating the water. The mine owner is a powerful noble.',
    reward: '100 gp + town\'s gratitude',
    level: '2-5',
  },
  {
    title: 'The Stolen Heirloom',
    hook: 'A noble\'s family sword was stolen. They\'ll pay handsomely for its return.',
    complication: 'The sword was sold to pay gambling debts. The current owner bought it legally and won\'t give it up.',
    reward: '200 gp',
    level: '2-5',
  },
  {
    title: 'The Beast of [Location]',
    hook: 'Livestock are being killed at night. Huge claw marks. No tracks leading away.',
    complication: 'It\'s a displaced owlbear protecting its cubs. Killing it would orphan the young.',
    reward: '150 gp bounty',
    level: '3-6',
  },
  {
    title: 'The Forger\'s Masterpiece',
    hook: 'Counterfeit coins are flooding the market. The forgeries are nearly perfect.',
    complication: 'The forger is a desperate parent trying to feed their family. The real criminals are the loan sharks who put them in debt.',
    reward: '100 gp + merchant guild favor',
    level: '2-5',
  },
  {
    title: 'The Sealed Tomb',
    hook: 'An earthquake has cracked open an ancient tomb. Strange sounds echo from within.',
    complication: 'The tomb contains a being that was imprisoned, not dead. The seal was placed by an order that no longer exists.',
    reward: 'Ancient treasure (DM determines) + 200 XP',
    level: '3-7',
  },
  {
    title: 'The Rival Adventurers',
    hook: 'Another adventuring party is competing for the same quest. They\'re faster but less careful.',
    complication: 'The rivals accidentally trigger a trap that puts them in danger. Help them or let them fail?',
    reward: 'Quest reward + potential allies or rivals',
    level: '3-7',
  },
  {
    title: 'The Cursed Painting',
    hook: 'An art collector bought a painting that brings misfortune. Now they want it gone.',
    complication: 'The painting contains the trapped soul of a murdered artist. Destroying it kills the soul forever.',
    reward: '300 gp + the painting (if you want it)',
    level: '4-8',
  },
  {
    title: 'The Underground Railroad',
    hook: 'Escaped prisoners from a corrupt nobleman\'s dungeon seek help reaching the border.',
    complication: 'One of the escapees is actually guilty of a terrible crime. The others don\'t know.',
    reward: 'Resistance faction favor + 100 gp',
    level: '3-7',
  },
  {
    title: 'The Dying Dragon',
    hook: 'An ancient dragon is dying of old age and requests an audience with worthy adventurers.',
    complication: 'The dragon wants someone to inherit its hoard — but its heir (a young dragon) feels cheated and will hunt whoever takes it.',
    reward: 'Dragon hoard portion + draconic knowledge',
    level: '8-12',
  },
  {
    title: 'The Time Loop Tavern',
    hook: 'Everyone in a small tavern is reliving the same evening over and over. They don\'t realize it.',
    complication: 'The loop was created by a barmaid who used a wish to undo a terrible event. Breaking the loop brings back the tragedy.',
    reward: 'Arcane knowledge + 500 XP',
    level: '5-10',
  },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function getEnvironmentalDetail(locationType) {
  const details = ENVIRONMENTAL_DETAILS[locationType];
  if (!details) return pick(Object.values(ENVIRONMENTAL_DETAILS).flat());
  return pick(details);
}

export function generateSideQuest(partyLevel = 3) {
  const levelNum = typeof partyLevel === 'string' ? parseInt(partyLevel) : partyLevel;
  const eligible = SIDE_QUEST_SEEDS.filter(q => {
    const [min, max] = q.level.split('-').map(Number);
    return levelNum >= min && levelNum <= max;
  });
  return eligible.length > 0 ? pick(eligible) : pick(SIDE_QUEST_SEEDS);
}

export function getAllLocationTypes() {
  return Object.keys(ENVIRONMENTAL_DETAILS);
}
