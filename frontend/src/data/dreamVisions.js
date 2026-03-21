/**
 * Dream & Vision System — Prophetic dreams, divine messages, and patron visions.
 * DMs can roll a dream for a PC during long rests or significant story moments.
 */

export const DREAM_TYPES = {
  warning: {
    label: 'Warning Dream',
    description: 'A dream that warns of approaching danger.',
    templates: [
      'You stand at a crossroads shrouded in fog. One path glows faintly with warmth. The other reeks of decay. A voice whispers: "Choose before the moon is dark."',
      'You\'re running through a burning city you\'ve never seen. People call your name, but when you turn, they\'re already ash. You wake with the smell of smoke in your nostrils.',
      'A great eye opens in the dark above you. It sees everything. It blinks once — and you know it has found what it was looking for.',
      'Water rises around your ankles, your waist, your neck. Just before it closes over your head, you see your reflection — and it\'s someone else.',
      'You dream of a clock with no hands. Its ticking grows louder, faster, until it drowns out everything. Then silence. Then: "It has already begun."',
    ],
    mechanicalEffect: 'Gain advantage on the first saving throw related to the dream\'s subject.',
  },
  memory: {
    label: 'Memory Dream',
    description: 'A dream replaying a pivotal moment, sometimes altered.',
    templates: [
      'You relive a childhood memory, but the details are wrong. The sky is green. Your mother\'s face is someone else\'s. She says something she never said in life.',
      'A battle you fought plays again, but this time you see it from your enemy\'s perspective. Their fear. Their reasons.',
      'You dream of the moment you decided to become an adventurer. But in the dream, you chose differently. You see the life you would have lived.',
      'A conversation with a dead friend replays perfectly. At the end, they say one new thing: a name you don\'t recognize.',
    ],
    mechanicalEffect: 'Gain Inspiration.',
  },
  prophecy: {
    label: 'Prophetic Vision',
    description: 'A vision of what might come to pass.',
    templates: [
      'Three images flash before you: a crown shattering, a river running red, and a child laughing in a field of wildflowers. You don\'t know the order.',
      'You see yourself standing over a defeated enemy. But when you look at your hands, they\'re not yours. Someone else wins this fight wearing your face.',
      'A map unfolds in your mind. You can see a place you\'ve never been, marked with an X that pulses like a heartbeat.',
      'You watch the sun rise three times. Each sunrise is a different color: gold, silver, red. On the red dawn, the sun doesn\'t stop rising.',
    ],
    mechanicalEffect: 'Gain advantage on one ability check related to the vision\'s subject.',
  },
  patron: {
    label: 'Patron Message',
    description: 'A message from a warlock\'s patron, a cleric\'s deity, or a similar entity.',
    templates: [
      'A vast presence fills the darkness. No form, just weight and attention. It speaks without words: approval, hunger, and a direction — east.',
      'Your patron appears as they truly are, just for an instant. The image is too much for mortal minds. You remember only a feeling: urgency.',
      'A gift appears in the dream: a tool, a weapon, a key. When you wake, you can still feel its weight in your hand — though it\'s gone.',
      'Your deity\'s holy symbol burns in the darkness like a star. It dims and brightens in a rhythm you realize matches a heartbeat — not yours.',
    ],
    mechanicalEffect: 'Regain one use of a class feature (Channel Divinity, Pact slot, etc.).',
  },
  nightmare: {
    label: 'Nightmare',
    description: 'A terrifying dream that may or may not be more than a dream.',
    templates: [
      'Something chases you through corridors that rearrange themselves. You run for hours. When you wake, you\'re exhausted.',
      'You dream you\'re paralyzed while something moves in the room. It stands over you. It breathes. You can\'t see it. You can\'t move.',
      'Everyone you love turns to look at you simultaneously. Their eyes are wrong — too dark, too empty. They speak in unison: "We remember what you did."',
      'You fall through darkness forever. You hit bottom, but the impact doesn\'t wake you. You lie there in the dark, hearing footsteps approach.',
    ],
    mechanicalEffect: 'No benefit from long rest (no HP or slot recovery). Can be prevented by Protection from Evil and Good.',
  },
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateDream(type = null) {
  const dreamType = type
    ? DREAM_TYPES[type]
    : pick(Object.values(DREAM_TYPES));

  if (!dreamType) return null;

  return {
    type: dreamType.label,
    text: pick(dreamType.templates),
    mechanicalEffect: dreamType.mechanicalEffect,
    generatedAt: new Date().toISOString(),
  };
}

export function getDreamTypes() {
  return Object.entries(DREAM_TYPES).map(([key, d]) => ({
    id: key,
    label: d.label,
    description: d.description,
  }));
}
