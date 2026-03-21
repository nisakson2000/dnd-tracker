/**
 * playerIllusionTactics.js
 * Player Mode: Illusion spells, creative uses, and interaction rules
 * Pure JS — no React dependencies.
 */

export const ILLUSION_RULES = {
  investigation: 'A creature can use its action to make an Investigation check against your spell save DC to determine if something is an illusion.',
  physicalInteraction: 'Physical interaction with an illusion reveals it (touching the wall, walking through the bridge).',
  believing: 'If a creature doesn\'t suspect an illusion, it won\'t investigate. Play it naturally.',
  key: 'Illusions are most powerful when enemies have no reason to doubt them.',
};

export const ILLUSION_SPELLS = [
  {
    spell: 'Minor Illusion (cantrip)',
    effect: 'Sound or image in a 5ft cube. Doesn\'t move.',
    duration: '1 minute',
    uses: ['Create a box to hide behind (full cover)', 'Sound of footsteps to distract', 'Fake treasure to lure enemies', 'Sound of screaming to draw guards away'],
    rating: 'A',
  },
  {
    spell: 'Silent Image (1st)',
    effect: 'Visual illusion up to 15ft cube. Can move it with action.',
    duration: '10 minutes (concentration)',
    uses: ['Wall across a corridor (enemies think it\'s real)', 'Illusion of a monster to frighten NPCs', 'Bridge over a gap (until someone steps on it)', 'Double of yourself running away'],
    rating: 'A',
  },
  {
    spell: 'Phantasmal Force (2nd)',
    effect: 'One creature sees an illusion in a 10ft cube. INT save. It believes the illusion is real.',
    duration: '1 minute (concentration)',
    uses: ['Cage of fire around the target (1d6 psychic/turn)', 'Pit under their feet (they think they\'re falling)', 'Chains restraining them'],
    rating: 'S',
    note: 'The target rationalizes the illusion as real. They take 1d6 psychic damage per turn from perceived danger.',
  },
  {
    spell: 'Major Image (3rd)',
    effect: 'Image up to 20ft cube. Includes sound, smell, temperature. Move with action.',
    duration: '10 minutes (concentration)',
    uses: ['Convincing NPC illusion (can talk if you provide sound)', 'Fire/lava across a corridor', 'Convincing wall or door', 'Monster illusion to scare enemies'],
    rating: 'A',
  },
  {
    spell: 'Hallucinatory Terrain (4th)',
    effect: 'Make terrain look like different terrain. 150ft cube.',
    duration: '24 hours',
    uses: ['Hide a pit trap as solid ground', 'Make a fortress look like a hill', 'Make a road look like a swamp'],
    rating: 'B',
  },
  {
    spell: 'Creation (5th)',
    effect: 'Create a nonliving object. Material determines duration (stone=12hrs, metal=1hr).',
    duration: 'Varies by material',
    uses: ['Create a bridge (wood, 6 hours)', 'Create a key (metal, 1 hour)', 'Create ammunition'],
    rating: 'A',
    note: 'Not technically an illusion — it creates real material that disappears later.',
  },
  {
    spell: 'Programmed Illusion (6th)',
    effect: 'Set an illusion to trigger on a specific condition.',
    duration: 'Permanent until triggered (then 5 minutes)',
    uses: ['Alarm system (trigger: someone enters room)', 'Decoy guard at a post', 'Warning message for allies'],
    rating: 'B',
  },
  {
    spell: 'Mirage Arcane (7th)',
    effect: 'Transform terrain in a 1-mile square. Looks, sounds, smells, and FEELS real.',
    duration: '10 days',
    uses: ['Make a castle. Seriously. It\'s tactile.', 'Create a lake over a battlefield', 'Make walls solid — creatures can climb them'],
    rating: 'S',
    note: 'At this level, illusions become reality. Mirage Arcane creates tactile terrain.',
  },
];

export const ILLUSION_SCHOOL_FEATURES = {
  illusionWizard: [
    { level: 2, feature: 'Improved Minor Illusion', effect: 'Minor Illusion creates BOTH sound and image simultaneously.' },
    { level: 6, feature: 'Malleable Illusions', effect: 'Change the nature of an active illusion as an action.' },
    { level: 10, feature: 'Illusory Self', effect: 'Reaction: create illusory duplicate that causes an attack to miss. Recharges on short rest.' },
    { level: 14, feature: 'Illusory Reality', effect: 'Make ONE element of your illusion REAL for 1 minute. Bridge becomes real. Wall becomes real.' },
  ],
  note: 'Illusory Reality (L14) is one of the strongest wizard features. Your illusions become real.',
};

export function illusionSaveDC(intMod, profBonus) {
  return 8 + intMod + profBonus;
}
