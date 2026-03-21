/**
 * playerAthleteFeatGuide.js
 * Player Mode: Athlete feat — mobility half-feat
 * Pure JS — no React dependencies.
 */

export const ATHLETE_BASICS = {
  feat: 'Athlete',
  source: "Player's Handbook",
  type: 'Half-feat (+1 STR or DEX)',
  benefits: [
    '+1 STR or DEX.',
    'Standing up from prone costs only 5ft of movement (not half).',
    'Climbing doesn\'t cost extra movement.',
    'Running long jump or high jump requires only 5ft running start (not 10ft).',
  ],
  rating: 'C+',
  note: 'Underwhelming feat. The +1 stat is the best part. Situational mobility benefits. Take only to round an odd STR/DEX.',
};

export const ATHLETE_NICHE_USES = [
  { use: 'Prone recovery', detail: 'Stand up for 5ft instead of 15ft. Attack in melee without disadvantage immediately.', value: 'B' },
  { use: 'Climbing in combat', detail: 'Climb at full speed. Useful in vertical dungeons, castle sieges.', value: 'C' },
  { use: 'Short running start', detail: 'Only need 5ft to long/high jump. Useful in tight spaces.', value: 'C' },
  { use: 'Half-feat value', detail: '+1 STR/DEX rounds odd score. The real reason to take this feat.', value: 'A' },
];

export const ATHLETE_VS_ALTERNATIVES = {
  vsMobile: 'Mobile gives +10 speed, no OA after melee, ignore difficult terrain when dashing. Far superior.',
  vsSkillExpert: 'Skill Expert gives +1 any stat + proficiency + Expertise. Far more impactful.',
  vsCrusherSlasher: 'Crusher/Slasher give +1 + combat effects on hits. More useful in fights.',
  verdict: 'Athlete is a last-resort half-feat. Take it only when nothing else rounds your stat and fits your character.',
};
