/**
 * NPC Personality System — Emotional states, daily routines, motivations, and voice notes.
 * Provides depth for NPC roleplay and consistency.
 */

export const EMOTIONAL_STATES = {
  calm: { label: 'Calm', color: '#60a5fa', description: 'Relaxed and composed. Open to conversation.', socialModifier: 0 },
  anxious: { label: 'Anxious', color: '#fbbf24', description: 'Nervous and fidgety. Speaks quickly, avoids eye contact.', socialModifier: -1 },
  grieving: { label: 'Grieving', color: '#a78bfa', description: 'Withdrawn and sad. Short responses. May refuse to haggle.', socialModifier: -2 },
  elated: { label: 'Elated', color: '#4ade80', description: 'Happy and generous. May offer discounts or share secrets freely.', socialModifier: +2 },
  suspicious: { label: 'Suspicious', color: '#f97316', description: 'Watches the party carefully. Evasive answers. Higher prices.', socialModifier: -2 },
  desperate: { label: 'Desperate', color: '#ef4444', description: 'Will do almost anything. Shares secrets, begs for help, offers deals.', socialModifier: +1 },
  vengeful: { label: 'Vengeful', color: '#dc2626', description: 'Fixated on revenge. Will help if it serves their vendetta.', socialModifier: -1 },
  curious: { label: 'Curious', color: '#06b6d4', description: 'Interested in the party. Asks lots of questions. Helpful but nosy.', socialModifier: +1 },
  indifferent: { label: 'Indifferent', color: '#94a3b8', description: 'Doesn\'t care. Minimal effort. "Not my problem."', socialModifier: -1 },
  fearful: { label: 'Fearful', color: '#fbbf24', description: 'Scared of something. May flee, hide, or refuse to engage.', socialModifier: -3 },
};

export const MOOD_DECAY = {
  grieving: { after: 3, becomes: 'melancholy', description: 'Grief softens to sadness' },
  elated: { after: 1, becomes: 'calm', description: 'Joy returns to normalcy' },
  vengeful: { after: 5, becomes: 'indifferent', description: 'Rage burns out without fuel' },
  anxious: { after: 2, becomes: 'calm', description: 'Anxiety fades without stimulus' },
  fearful: { after: 2, becomes: 'anxious', description: 'Terror becomes nervousness' },
  desperate: { after: 3, becomes: 'indifferent', description: 'Desperation turns to resignation' },
};

export const DAILY_ROUTINES = {
  merchant: {
    morning: 'Opens shop at dawn. Sorts inventory. Haggles with suppliers.',
    afternoon: 'Peak business hours. Deals with customers. Counts coins.',
    evening: 'Closes shop. Reviews ledgers. Visits the tavern for gossip.',
    night: 'Home with family. Counts the day\'s take. Plans tomorrow\'s prices.',
  },
  guard: {
    morning: 'Dawn patrol. Checks gates and walls. Reports to captain.',
    afternoon: 'Gate duty or patrol route. Deals with disputes.',
    evening: 'Evening shift or off-duty at the barracks tavern.',
    night: 'Night watch or sleeping in barracks.',
  },
  noble: {
    morning: 'Late breakfast. Reads correspondence. Meets advisors.',
    afternoon: 'Court business. Audiences with petitioners. Political scheming.',
    evening: 'Formal dinner. Entertainment. Social manipulation.',
    night: 'Private chambers. Reading, plotting, or secret meetings.',
  },
  priest: {
    morning: 'Dawn prayers. Opens temple. Blesses the faithful.',
    afternoon: 'Counseling. Tending to the sick. Community service.',
    evening: 'Evening vespers. Meditation. Writing sermons.',
    night: 'Study and prayer. Communion with deity.',
  },
  farmer: {
    morning: 'Before dawn: feed livestock. Work the fields.',
    afternoon: 'Continue fieldwork. Repair tools and fences.',
    evening: 'Return home. Family dinner. Mend clothes.',
    night: 'Early to bed. Tells stories by the fire.',
  },
  tavern_keeper: {
    morning: 'Cleaning from last night. Receiving deliveries. Cooking.',
    afternoon: 'Prep for evening crowd. Manages staff. Gossips with regulars.',
    evening: 'Peak hours. Serving, cooking, breaking up fights, listening.',
    night: 'Last call. Cleaning. Counting coins. Hiding the good stuff.',
  },
  thief: {
    morning: 'Sleeping (works nights). Fencing last night\'s take.',
    afternoon: 'Scouting targets. Meeting contacts. Planning jobs.',
    evening: 'Final preparations. Getting into position.',
    night: 'Active: breaking in, pickpocketing, smuggling, or lurking.',
  },
  scholar: {
    morning: 'Research in library. Translating texts. Experiments.',
    afternoon: 'Teaching or lecturing. Consulting with colleagues.',
    evening: 'Personal research. Writing papers or books.',
    night: 'Stargazing, late-night experiments, or reading by candlelight.',
  },
};

export const NPC_MOTIVATIONS = [
  { motivation: 'Wealth', description: 'Wants to accumulate gold and property. Driven by greed or need.' },
  { motivation: 'Power', description: 'Seeks political, magical, or social influence. Wants control.' },
  { motivation: 'Knowledge', description: 'Driven by curiosity. Wants to learn, discover, understand.' },
  { motivation: 'Revenge', description: 'Someone wronged them. They won\'t rest until they get even.' },
  { motivation: 'Protection', description: 'Wants to keep someone or something safe. Family, town, secret.' },
  { motivation: 'Freedom', description: 'Imprisoned, enslaved, or trapped by circumstance. Wants out.' },
  { motivation: 'Love', description: 'Motivated by love — romantic, familial, or platonic. Will sacrifice for it.' },
  { motivation: 'Redemption', description: 'Made terrible mistakes. Wants to make things right before it\'s too late.' },
  { motivation: 'Faith', description: 'Devoted to a cause, deity, or ideal. Unshakeable conviction.' },
  { motivation: 'Survival', description: 'Just trying to get by. The world is dangerous and they\'re barely making it.' },
  { motivation: 'Legacy', description: 'Wants to be remembered. Building something that outlasts them.' },
  { motivation: 'Duty', description: 'Bound by oath, honor, or obligation. Follows through no matter the cost.' },
];

export const VOICE_NOTES = [
  { voice: 'Deep and gravelly', accent: 'Dwarven', quirk: 'Always clears throat before speaking' },
  { voice: 'High and melodic', accent: 'Elvish', quirk: 'Elongates vowels when thinking' },
  { voice: 'Raspy whisper', accent: 'None', quirk: 'Leans in uncomfortably close' },
  { voice: 'Booming and loud', accent: 'Northern', quirk: 'Laughs at own jokes' },
  { voice: 'Soft and precise', accent: 'Academic', quirk: 'Uses unnecessarily complex words' },
  { voice: 'Fast and nervous', accent: 'Urban', quirk: 'Looks over shoulder constantly' },
  { voice: 'Slow and deliberate', accent: 'Rural', quirk: 'Long pauses between sentences' },
  { voice: 'Warm and motherly', accent: 'Halfling', quirk: 'Offers food during every conversation' },
  { voice: 'Cold and clipped', accent: 'Noble', quirk: 'Never uses contractions' },
  { voice: 'Sing-song and playful', accent: 'Gnomish', quirk: 'Rhymes words unintentionally' },
  { voice: 'Gruff and impatient', accent: 'Military', quirk: 'Speaks in short commands' },
  { voice: 'Silky and persuasive', accent: 'Exotic', quirk: 'Touches your arm when making a point' },
];

export const NPC_FEARS = [
  'Fire', 'Heights', 'The dark', 'Being forgotten', 'Abandonment', 'Failure',
  'Loss of control', 'Death', 'Poverty', 'Magic', 'The undead', 'Betrayal',
  'Enclosed spaces', 'Deep water', 'Losing loved ones', 'Public humiliation',
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateNPCPersonality() {
  return {
    emotionalState: pick(Object.keys(EMOTIONAL_STATES)),
    motivation: pick(NPC_MOTIVATIONS),
    voice: pick(VOICE_NOTES),
    fear: pick(NPC_FEARS),
    routine: pick(Object.keys(DAILY_ROUTINES)),
  };
}

export function getEmotionalState(key) {
  return EMOTIONAL_STATES[key] || EMOTIONAL_STATES.calm;
}

export function getDailyRoutine(role) {
  return DAILY_ROUTINES[role] || DAILY_ROUTINES.merchant;
}
