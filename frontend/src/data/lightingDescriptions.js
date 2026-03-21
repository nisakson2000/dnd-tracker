export const LIGHTING_SOURCES = {
  torchlight: {
    label: 'Torchlight',
    descriptions: [
      'Warm, flickering torchlight throws dancing shadows on every surface. The light reaches about 40 feet before darkness swallows it.',
      'The torch gutters in a draft, sending shadows leaping across the walls like living things.',
      'Orange torchlight turns faces into masks of shadow and warmth. Beyond its reach, absolute darkness.',
    ],
  },
  candlelight: {
    label: 'Candlelight',
    descriptions: [
      'Candlelight pools around the flame, barely reaching the walls. The room exists in a bubble of amber warmth.',
      'A candelabra flickers, its multiple flames creating overlapping shadows that seem to breathe.',
    ],
  },
  moonlight: {
    label: 'Moonlight',
    descriptions: [
      'Cool silver moonlight streams through gaps, painting everything in shades of blue and grey.',
      'The full moon bathes the landscape in an ethereal glow. Colors are muted but shapes are surprisingly clear.',
      'Thin moonlight barely penetrates the clouds. Shapes blur at the edges. Is that a shadow or a creature?',
    ],
  },
  sunlight: {
    label: 'Sunlight',
    descriptions: [
      'Bright sunlight illuminates everything clearly. No shadows deep enough to hide in.',
      'Shafts of sunlight pierce through gaps above, creating columns of golden light thick with motes of dust.',
      'The harsh midday sun bleaches colors and creates sharp, short shadows.',
    ],
  },
  magical_glow: {
    label: 'Magical Glow',
    descriptions: [
      'An unnatural luminescence emanates from the walls themselves — cold, steady, and unsettling.',
      'Arcane sigils pulse with a faint blue-white light, casting geometric shadows that move of their own accord.',
      'A warm golden radiance fills the space without any visible source. It feels divine — or is meant to.',
    ],
  },
  darkness: {
    label: 'Total Darkness',
    descriptions: [
      'Absolute darkness. Not a photon of light. Sound becomes everything — every drip, every breath, every heartbeat.',
      'The dark is so complete it feels solid, pressing against your eyes. Darkvision reveals grey shapes, but no color.',
      'Even with darkvision, the edges blur. Without it, blindness is total. The dark feels alive.',
    ],
  },
  bioluminescence: {
    label: 'Bioluminescence',
    descriptions: [
      'Soft blue-green light glows from fungi and lichen on the walls, creating an alien, underwater ambience.',
      'Pulsing bioluminescent organisms cast shifting patterns of teal and violet. Beautiful and deeply unsettling.',
    ],
  },
  firelight: {
    label: 'Firelight (Campfire/Hearth)',
    descriptions: [
      'The campfire crackles, casting a warm circle of light. Faces glow orange. Beyond the circle, the night watches.',
      'Hearth-light fills the room with a steady, comforting warmth. Embers glow like tiny stars.',
      'The bonfire roars, throwing light and sparks skyward. Shadows dance wildly at its edges.',
    ],
  },
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateLightingDescription(sourceKey) {
  const source = LIGHTING_SOURCES[sourceKey];
  if (!source) return 'The lighting is unremarkable.';
  return pick(source.descriptions);
}

export function getLightingSources() {
  return Object.entries(LIGHTING_SOURCES).map(([key, s]) => ({
    id: key,
    label: s.label,
  }));
}
