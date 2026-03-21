/**
 * Prophecy System — Cryptic prophecies, omens, and fulfillment tracking.
 * DMs create prophecies that can be partially or fully fulfilled by party actions.
 */

export const PROPHECY_TEMPLATES = [
  {
    text: 'When the silver moon weeps blood, the forgotten king shall rise from his throne of bones.',
    interpretation: 'A lunar eclipse may trigger the return of an ancient ruler — possibly undead.',
    conditions: ['lunar_event', 'undead_ruler', 'ancient_throne'],
  },
  {
    text: 'Three keys, three doors, three prices. The first is gold, the second is time, the third is truth.',
    interpretation: 'A quest requiring literal or metaphorical keys. Each costs something different.',
    conditions: ['find_keys', 'pay_gold', 'sacrifice_truth'],
  },
  {
    text: 'The child of two worlds will mend what was broken, or shatter it beyond all repair.',
    interpretation: 'A half-race character (or someone born between worlds) has a pivotal choice ahead.',
    conditions: ['half_race_choice', 'mending_or_breaking'],
  },
  {
    text: 'Beware the one who speaks with honey, for their heart is a wasps\' nest.',
    interpretation: 'A charismatic NPC is secretly a villain or betrayer.',
    conditions: ['betrayal', 'charismatic_villain'],
  },
  {
    text: 'The flame that burns twice as bright burns half as long. The brightest flame of all burns only once.',
    interpretation: 'A powerful but costly ability or artifact. Using it at full power destroys it.',
    conditions: ['powerful_artifact', 'single_use'],
  },
  {
    text: 'When the last tree falls in the Whisperwood, the silence will speak louder than any scream.',
    interpretation: 'Environmental destruction triggers a catastrophic magical event.',
    conditions: ['forest_destruction', 'magical_catastrophe'],
  },
  {
    text: 'Five will enter the dark. Four will return. The fifth will save them all — from beyond.',
    interpretation: 'A party member will seemingly die but their sacrifice enables final victory.',
    conditions: ['party_loss', 'sacrifice_victory'],
  },
  {
    text: 'The crown seeks the head that does not want it. The throne fears the one who does not covet it.',
    interpretation: 'The rightful ruler is someone who doesn\'t desire power.',
    conditions: ['reluctant_ruler', 'crown_quest'],
  },
];

export const OMEN_TYPES = [
  { type: 'nature', examples: ['Birds fly in unusual patterns', 'Animals flee the area', 'Plants wilt overnight', 'An unseasonable storm appears', 'A rainbow appears at midnight'] },
  { type: 'celestial', examples: ['A star falls from the sky', 'The moon appears larger than usual', 'An eclipse at an unexpected time', 'Constellations seem to shift', 'The northern lights appear in the south'] },
  { type: 'personal', examples: ['A recurring dream intensifies', 'A scar begins to glow', 'A weapon hums when pointed in a direction', 'An old wound aches with purpose', 'A holy symbol grows warm'] },
  { type: 'social', examples: ['Strangers recognize you from a description you didn\'t give', 'Children point and whisper', 'A fortune teller refuses to read your cards', 'An old prophecy painting in a temple resembles you', 'Three different people give you the same warning'] },
  { type: 'supernatural', examples: ['Candles flicker in unison', 'Mirrors show a different reflection momentarily', 'Shadows move against the light', 'Writing appears in condensation', 'A ghost appears but only points'] },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateProphecy() {
  return pick(PROPHECY_TEMPLATES);
}

export function generateOmen(type = null) {
  const omenType = type
    ? OMEN_TYPES.find(o => o.type === type)
    : pick(OMEN_TYPES);
  if (!omenType) return pick(OMEN_TYPES.flatMap(o => o.examples));
  return pick(omenType.examples);
}

export function getOmenTypes() {
  return OMEN_TYPES.map(o => ({ id: o.type, label: o.type.charAt(0).toUpperCase() + o.type.slice(1) }));
}
