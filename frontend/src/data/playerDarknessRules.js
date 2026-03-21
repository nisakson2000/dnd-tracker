/**
 * playerDarknessRules.js
 * Player Mode: Darkness, dim light, and vision interaction rules
 * Pure JS — no React dependencies.
 */

export const DARKNESS_SPELL = {
  level: 2,
  range: '60ft',
  area: '15ft radius sphere',
  duration: '10 minutes (concentration)',
  effect: 'Magical darkness. Nonmagical light can\'t illuminate it. Darkvision can\'t see through it.',
  dispel: 'Light spells of 3rd level or higher (Daylight) dispel it. Dispel Magic works.',
  keyRule: 'Creatures in magical darkness are effectively BLINDED — can\'t see and attacks have disadvantage.',
};

export const DARKNESS_COMBOS = [
  { combo: 'Darkness + Devil\'s Sight', class: 'Warlock', rating: 'S', description: 'You see in magical darkness. Enemies don\'t. Permanent advantage for you, disadvantage for them — they cancel to normal rolls for you, but enemies still can\'t see you.', actualMath: 'You have advantage (unseen attacker). They have disadvantage (blinded). Net: you attack normally, they attack with disadvantage.' },
  { combo: 'Darkness + Shadow Sorcerer', class: 'Shadow Sorcerer', rating: 'S', description: 'Eyes of the Dark at level 1: see through your own Darkness spell. Cast it with 2 sorcery points (no concentration!).' },
  { combo: 'Darkness + Blind Fighting Style', class: 'Fighter/Ranger/Paladin', rating: 'A', description: '10ft blindsight. You see creatures within 10ft in darkness. Limited range but effective.' },
  { combo: 'Darkness on self', class: 'Any melee', rating: 'B', description: 'Cast Darkness centered on yourself. Enemies can\'t target you with spells requiring sight. Downside: allies can\'t target you either.' },
  { combo: 'Darkness + familiar', class: 'Warlock (Chain)', rating: 'A', description: 'See through familiar\'s senses outside the darkness while you fight inside it.' },
];

export const VISION_INTERACTIONS = {
  normalVision: {
    brightLight: 'See normally',
    dimLight: 'Lightly obscured — disadvantage on Perception (sight)',
    darkness: 'Heavily obscured — effectively blinded',
  },
  darkvision: {
    brightLight: 'See normally',
    dimLight: 'See as if bright light',
    darkness: 'See as dim light (grayscale) within range — still lightly obscured',
    magicalDarkness: 'Can\'t see through it. Darkvision doesn\'t help.',
  },
  devilsSight: {
    magicalDarkness: 'See normally in magical AND nonmagical darkness up to 120ft',
    note: 'This is NOT darkvision. It\'s a separate, superior ability.',
  },
  blindsight: {
    anyDarkness: 'Perceives surroundings without sight. Unaffected by darkness.',
    range: 'Usually 10ft (Blind Fighting) or 30ft+ (some creatures)',
    note: 'Works against invisibility too.',
  },
  truesight: {
    everything: 'Sees in darkness, sees invisible, sees through illusions, sees into Ethereal Plane.',
    range: 'Usually 120ft',
    note: 'The ultimate vision. Granted by True Seeing spell (6th level).',
  },
};

export const LIGHT_CANTRIPS = [
  { cantrip: 'Light', range: 'Touch', area: '20ft bright + 20ft dim', duration: '1 hour', note: 'Basic. Outshined by many alternatives.' },
  { cantrip: 'Dancing Lights', range: '120ft', area: '4 torches, 10ft dim each', duration: '1 min (concentration)', note: 'Flexible but uses concentration. Can move lights.' },
  { cantrip: 'Produce Flame', range: 'Self', area: '10ft bright + 10ft dim', duration: '10 minutes', note: 'Druid. Can also throw for 1d8 fire damage.' },
  { cantrip: 'Sacred Flame', range: '60ft', area: 'None (attack)', duration: 'Instant', note: 'Not a light source, but targets DEX save and ignores cover.' },
];

export const COMMON_MISTAKES = [
  { mistake: 'Thinking Darkvision sees in darkness perfectly', correction: 'Darkvision treats darkness as DIM LIGHT (lightly obscured, disadvantage on Perception). Not bright light.' },
  { mistake: 'Using Darkvision to see in magical darkness', correction: 'Darkvision explicitly doesn\'t work in magical darkness. Only Devil\'s Sight, Blindsight, or Truesight.' },
  { mistake: 'Forgetting Darkvision is grayscale', correction: 'Darkvision can\'t discern color in darkness. "You see a red wire and a blue wire" doesn\'t work.' },
  { mistake: 'Darkness cancels advantage/disadvantage', correction: 'If both attacker and target can\'t see each other, advantage and disadvantage cancel out = normal roll. Not "nothing happens."' },
  { mistake: 'Assuming all party members have Darkvision', correction: 'Humans, Halflings (non-Lotusden), and Dragonborn don\'t have Darkvision. Carry torches.' },
];

export function canSeeInCondition(visionType, lightLevel) {
  if (visionType === 'truesight') return { canSee: true, quality: 'perfect' };
  if (visionType === 'blindsight') return { canSee: true, quality: 'perfect (within range)' };
  if (visionType === 'devilsSight' && lightLevel !== 'bright') return { canSee: true, quality: 'perfect' };
  if (visionType === 'darkvision') {
    if (lightLevel === 'magicalDarkness') return { canSee: false, quality: 'blinded' };
    if (lightLevel === 'darkness') return { canSee: true, quality: 'dim (lightly obscured)' };
    return { canSee: true, quality: 'normal' };
  }
  // Normal vision
  if (lightLevel === 'bright') return { canSee: true, quality: 'normal' };
  if (lightLevel === 'dim') return { canSee: true, quality: 'lightly obscured' };
  return { canSee: false, quality: 'blinded' };
}
