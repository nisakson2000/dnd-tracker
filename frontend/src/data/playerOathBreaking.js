/**
 * playerOathBreaking.js
 * Player Mode: Paladin Oath tenets and Oathbreaker consequences
 * Pure JS — no React dependencies.
 */

export const PALADIN_OATHS = [
  {
    oath: 'Devotion',
    tenets: ['Honesty: Don\'t lie or cheat.', 'Courage: Never fear to act.', 'Compassion: Aid others, protect the weak.', 'Honor: Treat others with fairness.', 'Duty: Be responsible for your actions.'],
    breakingExample: 'Torturing a prisoner for information. Abandoning innocents.',
  },
  {
    oath: 'Ancients',
    tenets: ['Kindle the Light: Spread hope and joy.', 'Shelter the Light: Protect good in the world.', 'Preserve Your Own Light: Find joy in life.', 'Be the Light: Be a beacon of hope.'],
    breakingExample: 'Destroying nature for personal gain. Spreading despair.',
  },
  {
    oath: 'Vengeance',
    tenets: ['Fight the Greater Evil: Focus on the biggest threats.', 'No Mercy for the Wicked: Destroy evil without hesitation.', 'By Any Means Necessary: The ends justify the means.', 'Restitution: Make evil pay for its crimes.'],
    breakingExample: 'Letting a known evil escape. Showing mercy to irredeemable evil.',
  },
  {
    oath: 'Crown',
    tenets: ['Law: The law is paramount.', 'Loyalty: Serve your sovereign faithfully.', 'Courage: Take action when needed.', 'Responsibility: Bear the consequences of your actions.'],
    breakingExample: 'Treason. Defying lawful authority for personal reasons.',
  },
  {
    oath: 'Conquest',
    tenets: ['Douse the Flame of Hope: Rule through strength and fear.', 'Rule with an Iron Fist: Crush resistance.', 'Strength Above All: Power determines who is right.'],
    breakingExample: 'Showing weakness. Submitting to those you could defeat.',
  },
  {
    oath: 'Redemption',
    tenets: ['Peace: Violence is a last resort.', 'Innocence: Everyone can be redeemed.', 'Patience: Change takes time.', 'Wisdom: Guide others toward redemption.'],
    breakingExample: 'Killing when you could have subdued. Refusing to forgive.',
  },
];

export const OATHBREAKER_CONSEQUENCES = {
  description: 'A Paladin who breaks their oath may face consequences from their deity or the source of their power.',
  possibilities: [
    'Warning vision/dream from their deity.',
    'Temporary loss of divine features (DM discretion).',
    'Quest of atonement to regain standing.',
    'Permanent switch to Oathbreaker subclass (DMG).',
    'Loss of Paladin levels (rare, usually only for extreme violations).',
  ],
  atonement: 'Discuss with your DM. Usually involves a quest, sacrifice, or sincere change in behavior.',
  oathbreaker: 'The Oathbreaker subclass (DMG) gains dark powers instead. Undead-themed abilities.',
};

export function getOathInfo(oathName) {
  return PALADIN_OATHS.find(o => o.oath.toLowerCase() === (oathName || '').toLowerCase()) || null;
}

export function checkOathViolation(oathName, action) {
  const oath = getOathInfo(oathName);
  if (!oath) return null;
  return { oath: oath.oath, tenets: oath.tenets, breakingExample: oath.breakingExample };
}
