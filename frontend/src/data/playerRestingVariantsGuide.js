/**
 * playerRestingVariantsGuide.js
 * Player Mode: Resting variants — Gritty Realism, Epic Heroism, and RAW
 * Pure JS — no React dependencies.
 */

export const RESTING_VARIANTS = [
  { variant: 'Standard (RAW)', shortRest: '1 hour', longRest: '8 hours (6 sleeping, 2 light activity)', note: 'Default rules. 6-8 encounters per adventuring day. Short rest classes balanced with long rest classes.' },
  { variant: 'Gritty Realism', shortRest: '8 hours (overnight)', longRest: '7 days (downtime week)', note: 'DMG variant. Massively changes game balance. Spell slots are precious. Short-rest classes benefit greatly.' },
  { variant: 'Epic Heroism', shortRest: '5 minutes', longRest: '1 hour', note: 'DMG variant. Very forgiving. Players are always at full power. Best for high-action, low-strategy games.' },
];

export const GRITTY_REALISM_IMPACT = {
  casters: 'Devastated. Spell slots last 7 days instead of 1. Cantrips and rituals become essential. Every slot is precious.',
  shortRestClasses: 'Massively buffed. Fighter, Warlock, Monk recover on overnight rest (8 hours). They\'re at full power every day.',
  martials: 'Relatively unaffected. Hit Dice recover on short rest (8h). Second Wind, Action Surge recover nightly.',
  healingPressure: 'Healing spells are rare. Hit Dice and Healer feat become critical. Party needs non-magical healing.',
  exploration: 'Overland travel feels dangerous. Each encounter matters more. Resource management is the game.',
  note: 'Gritty Realism fundamentally changes D&D. Discuss with your DM before the campaign starts.',
};

export const EPIC_HEROISM_IMPACT = {
  casters: 'Always at full power. Long rest every hour. Full spell slots constantly. Very powerful.',
  shortRestClasses: 'Still fine but less unique advantage. Everyone recovers quickly.',
  pacing: 'Fights can happen back-to-back. No need to conserve resources. Nova every fight.',
  narrativeFit: 'Good for superhero-style games. Players are always ready for the next challenge.',
  note: 'Epic Heroism makes the game much easier. Works best for cinematic, action-heavy campaigns.',
};

export const REST_TIPS_BY_VARIANT = [
  { variant: 'Standard', tip: 'Push for 2 short rests per day. Budget spell slots across 6-8 encounters. Conserve L3+ slots.' },
  { variant: 'Gritty Realism', tip: 'Hoard spell slots. Use cantrips and weapon attacks. Every slot counts. Warlocks and Fighters shine.' },
  { variant: 'Epic Heroism', tip: 'Nova freely. Short rest after every fight. No need to conserve. Use your best spells every encounter.' },
];

export function encountersPerRestCycle(variant) {
  if (variant === 'gritty') return { perShortRest: 1, perLongRest: '14-21 (over a week)', note: 'Massive number of encounters per long rest cycle.' };
  if (variant === 'epic') return { perShortRest: '1-2', perLongRest: '1-3', note: 'Very few encounters per cycle. Always fresh.' };
  return { perShortRest: '2-3', perLongRest: '6-8', note: 'Standard adventuring day.' };
}
