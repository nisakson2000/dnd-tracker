/**
 * Sensory Description Engine — Atmospheric prompts by location type.
 *
 * Each location type has sensory details for sight, sound, smell, temperature,
 * and texture. Descriptions change with time of day.
 *
 * DM can click "Generate Atmosphere" to get a random sensory paragraph
 * for the current scene, or browse individual senses.
 */

const LOCATION_SENSES = {
  tavern: {
    label: 'Tavern / Inn',
    sight: [
      'Warm firelight flickers across rough-hewn beams, casting long shadows between the tables.',
      'A haze of pipe smoke drifts near the ceiling. Mugs of ale leave rings on every surface.',
      'A bard tunes a lute in the corner. The barkeep polishes glasses with a stained cloth.',
      'Trophies and old weapons hang on the walls — souvenirs from a hundred different adventures.',
    ],
    sound: [
      'Raucous laughter erupts from a table of off-duty guards playing cards.',
      'The clink of mugs, the scrape of chairs, and a bard singing an off-key ballad fill the room.',
      'Hushed whispers from a hooded figure in the corner booth.',
      'The fire crackles and pops. Somewhere, a dog whines for scraps.',
    ],
    smell: [
      'Roasting meat, yeast from fresh bread, and the sharp tang of spilled ale.',
      'Pipe tobacco, wood smoke, and something savory bubbling in the kitchen.',
      'Unwashed travelers, cheap perfume, and the earthy scent of wet cloaks drying by the fire.',
    ],
    temperature: ['Warm and stuffy from the crowd and the fireplace.', 'Pleasantly warm — the hearth keeps the chill at bay.'],
    texture: ['Sticky tables, rough wooden benches, a floor crunchy with sawdust and peanut shells.'],
  },

  dungeon: {
    label: 'Dungeon / Underground',
    sight: [
      'Torchlight reveals damp stone walls streaked with minerals. Shadows pool in every alcove.',
      'Ancient carvings line the walls, worn smooth by centuries. Cobwebs span the corridor.',
      'Water glistens on the floor. Something moved in the darkness ahead — or was it a trick of the light?',
      'Bones are scattered near the entrance. A rusted iron door stands ajar.',
    ],
    sound: [
      'Dripping water echoes endlessly. Your footsteps sound impossibly loud.',
      'A distant scraping sound — stone on stone — that stops as suddenly as it started.',
      'The skittering of unseen creatures retreating from your light.',
      'Complete silence. The kind that makes your ears ring.',
    ],
    smell: [
      'Damp earth, mold, and the mineral tang of wet stone.',
      'Something dead — old and dry, thankfully — carried on a faint draft.',
      'Sulfur and brimstone, growing stronger as you descend.',
    ],
    temperature: ['Cold and clammy. Your breath mists in the torchlight.', 'Uncomfortably warm — geothermal heat rises from below.'],
    texture: ['Slick, moss-covered stone underfoot. The walls are cold and weep moisture.'],
  },

  forest: {
    label: 'Forest / Woodland',
    sight: [
      'Shafts of sunlight pierce the canopy, illuminating motes of pollen and tiny insects.',
      'Ancient trees tower overhead, their trunks wider than a wagon. Ferns carpet the forest floor.',
      'A deer freezes at the edge of a clearing, watching you with dark, liquid eyes before bounding away.',
      'Thick undergrowth chokes the path. Vines hang like curtains between the trees.',
    ],
    sound: [
      'Birdsong fills the canopy. Leaves rustle in a breeze you can barely feel on the forest floor.',
      'The crack of a branch somewhere nearby. Too loud for a squirrel.',
      'A stream babbles over smooth stones, just out of sight through the trees.',
      'Insects hum. An owl hoots despite the hour.',
    ],
    smell: [
      'Pine needles, rich earth after rain, and the sweet decay of fallen leaves.',
      'Wildflowers — violet and honeysuckle — grow where sunlight reaches the floor.',
      'Wet moss, mushrooms, and the clean scent of running water.',
    ],
    temperature: ['Cool and shaded beneath the canopy. Pleasantly warm in the clearings.', 'Humid. The air feels thick and green.'],
    texture: ['Soft earth and fallen leaves cushion every step. Branches snag at clothing and hair.'],
  },

  battlefield: {
    label: 'Battlefield / Ruins',
    sight: [
      'Scorched earth and broken weapons litter the ground. Crows circle overhead.',
      'A shattered wall provides cover. The ground is churned to mud by boots and hooves.',
      'Banners hang in tatters from splintered poles. The bodies have been cleared, but dark stains remain.',
      'Smoke still rises from smoldering siege equipment. The sky is hazy and grey.',
    ],
    sound: [
      'Wind moans through the ruins. Metal groans as a damaged structure settles.',
      'Distant shouts and the clash of steel — the fighting isn\'t over yet.',
      'Crows caw and squabble. The silence between their calls is deafening.',
    ],
    smell: [
      'Smoke, iron, and the coppery tang of old blood.',
      'Charred wood, overturned earth, and the acrid bite of alchemist\'s fire.',
    ],
    temperature: ['Cold wind cuts across the open ground.', 'The air is warm from nearby fires.'],
    texture: ['Broken stone and splintered wood crunch underfoot. The mud sucks at your boots.'],
  },

  temple: {
    label: 'Temple / Church',
    sight: [
      'Stained glass windows cast kaleidoscope patterns across marble floors.',
      'Rows of candles flicker before a grand altar. Incense smoke curls toward the vaulted ceiling.',
      'Holy symbols are carved into every surface. The architecture inspires awe and humility.',
      'An elderly priest tends to the shrine in contemplative silence.',
    ],
    sound: [
      'A choir hums a sacred melody from a hidden gallery above.',
      'Whispered prayers echo off stone walls. The acoustics make every word feel significant.',
      'Silence so profound you can hear the candle flames guttering.',
    ],
    smell: [
      'Frankincense and myrrh. Fresh-cut flowers on the altar.',
      'Old stone, beeswax candles, and the lingering scent of sanctified oils.',
    ],
    temperature: ['Cool and still. The thick stone walls keep the temperature constant.'],
    texture: ['Smooth, cold marble underfoot. Polished wooden pews worn smooth by generations.'],
  },

  market: {
    label: 'Market / Bazaar',
    sight: [
      'Colorful awnings shade stalls overflowing with goods. Merchants wave and shout to attract customers.',
      'Exotic fabrics, gleaming weapons, strange fruits, and caged creatures compete for your attention.',
      'A pickpocket slips through the crowd. A fortune-teller beckons from a silk-draped booth.',
      'Wagons loaded with goods clog the narrow lanes between stalls.',
    ],
    sound: [
      'A cacophony of haggling, livestock, street performers, and the clatter of coins.',
      'A crier announces the day\'s prices. Children laugh and chase each other between stalls.',
      'The rhythmic hammering of a blacksmith competes with a spice merchant\'s sales pitch.',
    ],
    smell: [
      'Spices — cinnamon, clove, saffron — mix with roasting chestnuts and fresh-baked bread.',
      'Leather, animal musk, exotic perfumes, and the ever-present smell of the crowd.',
    ],
    temperature: ['Warm from the press of bodies and the midday sun.', 'Shade under the awnings offers some relief.'],
    texture: ['Packed dirt and cobblestones. The jostling crowd presses against you from all sides.'],
  },

  cave: {
    label: 'Cave / Cavern',
    sight: [
      'Stalactites hang like stone teeth from the ceiling. Mineral deposits glitter in your light.',
      'A vast underground lake stretches before you, its surface still as black glass.',
      'Bioluminescent fungi cast an eerie blue-green glow along the walls.',
      'The passage narrows ahead. You\'ll have to squeeze through single file.',
    ],
    sound: [
      'Water drips into pools with a steady rhythm. The echoes distort every sound.',
      'A low rumble — underground river or something else?',
      'Bats chitter and rustle overhead. Their guano crunches underfoot.',
    ],
    smell: ['Mineral-rich air, bat guano, and the musty smell of deep earth.', 'Sulfur and stagnant water.'],
    temperature: ['A constant cool temperature, regardless of the season above.', 'Pockets of warm, humid air near thermal vents.'],
    texture: ['Rough, uneven rock underfoot. Wet surfaces make every step treacherous.'],
  },

  ship: {
    label: 'Ship / Docks',
    sight: [
      'The deck rolls gently with the swell. Rigging creaks overhead. Sails billow with salt wind.',
      'The harbor bustles with activity — cargo being loaded, sailors mending nets, gulls wheeling above.',
      'Waves crash against the hull. The horizon stretches endlessly in every direction.',
    ],
    sound: [
      'The constant creak of timber, the snap of canvas, and the rush of water along the hull.',
      'Sailors shout orders. A bell marks the watch change.',
      'Seagulls cry overhead. The slap of waves against the dock pilings.',
    ],
    smell: ['Salt air, tar, fish, and wet rope.', 'The sharp tang of the sea mixed with the smell of the galley.'],
    temperature: ['The wind cuts through any clothing. Spray soaks everything.', 'Below deck is stuffy and close.'],
    texture: ['Salt-crusted wood, rough hemp rope. The deck shifts beneath your feet.'],
  },
};

// ── Time of Day modifiers ──
const TIME_MODIFIERS = {
  dawn: { light: 'The first grey light of dawn', mood: 'quiet and expectant', color: 'pale gold and rose' },
  morning: { light: 'Clear morning sunlight', mood: 'busy and purposeful', color: 'warm and bright' },
  afternoon: { light: 'The high sun beats down', mood: 'languid and warm', color: 'harsh and saturated' },
  evening: { light: 'Long shadows stretch across everything', mood: 'winding down', color: 'amber and copper' },
  night: { light: 'Moonlight and starlight', mood: 'mysterious and watchful', color: 'silver and deep blue' },
  midnight: { light: 'Near-total darkness', mood: 'silent and unsettling', color: 'black and grey' },
};

// ── Weather overlays ──
const WEATHER_OVERLAYS = {
  clear: '',
  rain: 'Rain drums steadily on every surface. Puddles form quickly. Visibility is reduced.',
  storm: 'Thunder rumbles overhead. Lightning illuminates the scene in stark flashes. The wind howls.',
  fog: 'Thick fog rolls in, reducing visibility to arm\'s length. Sounds are muffled and distorted.',
  snow: 'Snow falls silently, muffling all sound. The world turns white and featureless.',
  wind: 'A fierce wind whips at cloaks and banners. Dust stings your eyes.',
};

/**
 * Generate a full atmospheric description.
 * @param {string} locationType — key from LOCATION_SENSES
 * @param {string} timeOfDay — key from TIME_MODIFIERS (optional)
 * @param {string} weather — key from WEATHER_OVERLAYS (optional)
 * @returns {{ description: string, senses: { sight, sound, smell, temperature, texture } }}
 */
export function generateAtmosphere(locationType = 'tavern', timeOfDay = 'evening', weather = 'clear') {
  const loc = LOCATION_SENSES[locationType] || LOCATION_SENSES.tavern;
  const time = TIME_MODIFIERS[timeOfDay] || TIME_MODIFIERS.evening;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const senses = {
    sight: pick(loc.sight),
    sound: pick(loc.sound),
    smell: pick(loc.smell),
    temperature: pick(loc.temperature),
    texture: pick(loc.texture),
  };

  let description = `${time.light} casts ${time.color} tones. ${senses.sight} ${senses.sound} The air carries ${senses.smell.toLowerCase()} ${senses.temperature}`;

  const weatherOverlay = WEATHER_OVERLAYS[weather];
  if (weatherOverlay) {
    description += ` ${weatherOverlay}`;
  }

  return { description, senses, timeOfDay: time, location: loc.label };
}

/**
 * Get all available location types for UI selection.
 */
export function getLocationTypes() {
  return Object.entries(LOCATION_SENSES).map(([key, loc]) => ({
    id: key,
    label: loc.label,
  }));
}

/**
 * Get time of day options.
 */
export function getTimeOptions() {
  return Object.entries(TIME_MODIFIERS).map(([key, t]) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    mood: t.mood,
  }));
}

/**
 * Get weather options.
 */
export function getWeatherOptions() {
  return Object.keys(WEATHER_OVERLAYS).map(key => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));
}

export { LOCATION_SENSES, TIME_MODIFIERS, WEATHER_OVERLAYS };
