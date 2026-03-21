/**
 * playerIllusionWizardGuide.js
 * Player Mode: School of Illusion Wizard — reality bender
 * Pure JS — no React dependencies.
 */

export const ILLUSION_BASICS = {
  class: 'Wizard (School of Illusion)',
  source: 'Player\'s Handbook',
  theme: 'Master of illusions. Make illusions real. DM-dependent but potentially the strongest Wizard.',
  note: 'Ceiling is the highest of any subclass. Illusory Reality makes illusions REAL. But depends heavily on DM ruling.',
};

export const ILLUSION_FEATURES = [
  { feature: 'Improved Minor Illusion', level: 2, effect: 'Minor Illusion creates both sound AND image simultaneously.', note: 'Quality of life improvement. Create a box with accompanying sounds. More convincing illusions.' },
  { feature: 'Malleable Illusions', level: 6, effect: 'Action: change the nature of an active illusion spell (as if re-casting it with different parameters).', note: 'Reshape illusions on the fly. Wall becomes door. Monster becomes different monster. Adapt in real-time.' },
  { feature: 'Illusory Self', level: 10, effect: 'Reaction: when attacked, create illusory duplicate. Attack automatically misses. Once/short rest.', note: 'Free miss. Like Shield but guaranteed. Once per short rest.' },
  { feature: 'Illusory Reality', level: 14, effect: 'When you cast an illusion spell (1st level+), one inanimate object in the illusion becomes REAL for 1 minute.', note: 'THIS IS THE FEATURE. Create an illusory bridge → it\'s real. Illusory wall → real wall. Illusory cage → real cage.' },
];

export const ILLUSORY_REALITY_USES = [
  { use: 'Real wall', detail: 'Cast Silent Image of a wall. It becomes a real wall. Block corridors, trap enemies, create cover.', rating: 'S' },
  { use: 'Real bridge', detail: 'Cast Minor Illusion of a bridge over a chasm. Walk across. (Wait — needs 1st level+ spell. Use Silent Image.)', rating: 'A' },
  { use: 'Real cage', detail: 'Silent Image of an iron cage around an enemy. It becomes real. No save. No attack roll. Just trapped.', note: 'DM may rule on this. It\'s a 1st-level spell creating a cage. Discuss with DM.', rating: 'S (DM-dependent)' },
  { use: 'Real floor', detail: 'Enemies walk over illusory floor hiding a pit. Make the floor real. Then drop concentration. Floor disappears.', rating: 'A' },
  { use: 'Real cover', detail: 'Create illusory boulder. It\'s real. +5 AC from total cover. Move it with Malleable Illusions.', rating: 'A' },
];

export const ILLUSION_TACTICS = [
  { tactic: 'Minor Illusion box', detail: 'Create opaque 5ft box around yourself. Enemies can\'t see you. You can\'t see them. But you\'re hidden.', rating: 'A', note: 'Free cantrip. Hide in combat. Enemies must investigate (INT check vs your DC).' },
  { tactic: 'Silent Image flexibility', detail: '15ft cube illusion. 1st level slot. With Malleable Illusions: reshape every round. It does whatever you need.', rating: 'A' },
  { tactic: 'Major Image permanence', detail: 'L6 Major Image becomes permanent when cast at 6th level. Permanent, reshapeable illusion.', rating: 'S' },
  { tactic: 'Illusory Self defense', detail: 'Guaranteed miss. No roll needed. Once per short rest. Save for the big hit.', rating: 'A' },
  { tactic: 'Phantasmal Force abuse', detail: '2nd level, INT save. Target takes 1d6 psychic/turn and rationalizes the illusion. Target is effectively controlled.', rating: 'A', note: 'Target believes the illusion is real. They act accordingly. DM adjudication heavy.' },
];

export const ILLUSION_VS_DIVINATION = {
  illusion: { pros: ['Illusory Reality (make illusions real)', 'Highest creative ceiling', 'Malleable Illusions (adapt)', 'Free miss (Illusory Self)'], cons: ['DM-dependent', 'Requires creativity', 'Investigation checks can counter', 'Features before L14 are weak'] },
  divination: { pros: ['Portent (replace any d20)', 'Reliable and consistent', 'Expert Divination (free slots)', 'Not DM-dependent'], cons: ['Less creative options', 'Lower ceiling', 'Portent is only 2/day'] },
  verdict: 'Illusion with a generous DM is the strongest Wizard. Divination is the safest and most consistent.',
};

export function illusionDCCheck(wizardLevel, intMod) {
  const profBonus = Math.min(6, 2 + Math.floor((wizardLevel + 3) / 4));
  return 8 + profBonus + intMod;
}

export function phantasmalForceDPR() {
  return 3.5; // 1d6 per turn, automatically
}
