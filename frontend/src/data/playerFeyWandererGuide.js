/**
 * playerFeyWandererGuide.js
 * Player Mode: Fey Wanderer Ranger — the charming fey-touched ranger
 * Pure JS — no React dependencies.
 */

export const FEY_WANDERER_BASICS = {
  class: 'Ranger (Fey Wanderer)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Fey-touched ranger. Psychic damage, social expertise, and charm resistance aura.',
  note: 'Best social Ranger. WIS to CHA checks makes you a face character. Psychic damage on every hit. Excellent all-rounder.',
};

export const FEY_WANDERER_FEATURES = [
  { feature: 'Dreadful Strikes', level: 3, effect: 'Once per turn per target, when you hit: deal extra 1d4 psychic damage (1d6 at L11).', note: 'Extra psychic damage on every hit. Psychic is rarely resisted. Works on each target once per turn.' },
  { feature: 'Otherworldly Glamour', level: 3, effect: 'Add WIS to CHA checks. Gain proficiency in one CHA skill.', note: '+WIS to all CHA checks. With 16 WIS and 14 CHA: +5 to Persuasion/Deception/Intimidation. You\'re the face now.' },
  { feature: 'Beguiling Twist', level: 7, effect: 'Advantage on saves vs charm/frightened. When you or creature you see within 120ft succeeds on save vs charm/fright, use reaction: different creature within 120ft makes WIS save or is charmed/frightened by you for 1 minute.', note: 'Redirect failed charm/fear to another enemy. Enemy tries to fear your party → you charm THEM instead.' },
  { feature: 'Fey Reinforcements', level: 11, effect: 'Cast Summon Fey (no material components, once/long rest free). Concentration.', note: 'Free Summon Fey. Reliable single summon. No material components.' },
  { feature: 'Misty Wanderer', level: 15, effect: 'Cast Misty Step (WIS mod times/long rest, no spell slot). Can bring one willing creature within 5ft.', note: 'Multiple free Misty Steps per day. Bring an ally with you. Incredible mobility.' },
];

export const FEY_WANDERER_TACTICS = [
  { tactic: 'Face Ranger', detail: 'WIS to CHA checks. With WIS 20 + CHA 14: +7 to Persuasion before proficiency. Better than most Bards.', rating: 'S', note: 'Play the social pillar AND combat pillar. Rangers normally can\'t do this.' },
  { tactic: 'Psychic damage consistency', detail: 'Every attack deals +1d4 (later 1d6) psychic per target. Two attacks = 2d4 extra on two targets.', rating: 'A', note: 'Not huge damage but it\'s free, on every hit, and psychic is almost never resisted.' },
  { tactic: 'Beguiling Twist counter', detail: 'Dragon uses Frightful Presence. Your Fighter saves. You redirect: nearby enemy makes WIS save or is frightened/charmed by you.', rating: 'A', note: 'Turn enemy control spells against them. Unique and powerful.' },
  { tactic: 'Misty Step taxi (L15)', detail: 'Misty Step + bring the Barbarian. Teleport allies into flanking position. WIS mod times per day.', rating: 'S' },
  { tactic: 'Summon Fey + attacks', detail: 'Summon Fey (free). Your turn: 2 attacks + Fey\'s attack. Three attacks per round, two characters.', rating: 'A' },
];

export const FEY_WANDERER_VS_GLOOM_STALKER = {
  feyWanderer: { pros: ['Social expertise (WIS to CHA)', 'Psychic damage (rarely resisted)', 'Charm/fear redirect', 'Free Misty Steps at L15', 'Best social Ranger'], cons: ['Less burst damage', 'No invisibility', 'Weaker turn-1 alpha strike'] },
  gloomStalker: { pros: ['Massive turn-1 burst', 'Invisible to darkvision', '+WIS to initiative', 'Best multiclass dip'], cons: ['No social features', 'Darkness-dependent', 'Weaker sustained damage'] },
  verdict: 'Fey Wanderer for RP + consistent damage. Gloom Stalker for combat burst. Both excellent.',
};

export function otherworldlyGlamourBonus(wisMod, chaMod) {
  return wisMod + chaMod; // Total bonus to CHA checks (before proficiency)
}

export function dreadfulStrikesDamage(rangerLevel, targetsHit) {
  const die = rangerLevel >= 11 ? 3.5 : 2.5; // 1d6 or 1d4
  return targetsHit * die;
}

export function mistyStepUses(wisMod) {
  return Math.max(1, wisMod);
}
