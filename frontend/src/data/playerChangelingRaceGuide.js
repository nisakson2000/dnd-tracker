/**
 * playerChangelingRaceGuide.js
 * Player Mode: Changeling — the shapeshifter
 * Pure JS — no React dependencies.
 */

export const CHANGELING_BASICS = {
  race: 'Changeling',
  source: 'Eberron: Rising from the Last War / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 CHA, +1 any (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium (Small or Medium in MotM)',
  note: 'Shapechanger: change appearance at will as an action. No spell slot, no concentration, no limit. Best social/infiltration race in the game.',
};

export const CHANGELING_TRAITS = [
  { trait: 'Shapechanger', effect: 'Action: change appearance (height, weight, facial features, voice, hair, etc). Must remain same general body type. Reverts on death.', note: 'At-will disguise. No Disguise Self spell needed. Physical change (passes touch). Unlimited uses. Incredible.' },
  { trait: 'Changeling Instincts (legacy)', effect: 'Two of: Deception, Insight, Intimidation, Persuasion.', note: 'Two social skill proficiencies. Perfect for the infiltrator/face.' },
  { trait: 'Fey Ancestry (MotM)', effect: 'Advantage on saves vs charmed.', note: 'Replaced skill proficiencies in MotM. Good defensive trait.' },
];

export const CHANGELING_CLASS_SYNERGY = [
  { class: 'Rogue', priority: 'S', reason: 'CHA for social. Shapechanger + Expertise Deception = perfect infiltrator. Assassin/Mastermind theme.' },
  { class: 'Bard', priority: 'S', reason: 'CHA caster. Shapechanger for performance/social. Actor feat + Shapechanger = undetectable impersonation.' },
  { class: 'Warlock', priority: 'A', reason: 'CHA caster. Mask of Many Faces invocation is redundant (you already shapechange). Frees an invocation slot.' },
  { class: 'Paladin', priority: 'A', reason: 'CHA. Shapechanger for social encounters. Undercover Paladin. Oath of the Crown spy.' },
  { class: 'Sorcerer', priority: 'A', reason: 'CHA. Subtle Spell + Shapechanger = cast spells while disguised. Undetectable spy-caster.' },
];

export const CHANGELING_TACTICS = [
  { tactic: 'Impersonation', detail: 'Study a guard → shapechange into them → walk through security. No spell, no concentration, no time limit.', rating: 'S' },
  { tactic: 'Actor feat combo', detail: 'Actor: advantage on Deception to pass as another person. +CHA to mimic speech. + Shapechanger = unbeatable disguise.', rating: 'S' },
  { tactic: 'Mid-combat deception', detail: 'Shapechange into an enemy\'s ally. Enemies hesitate to attack. Buy time or create confusion.', rating: 'A' },
  { tactic: 'Information gathering', detail: 'Change face between contacts. Different identity for each information source. No one connects the dots.', rating: 'S' },
  { tactic: 'Emergency escape', detail: 'Being chased? Action: shapechange. Walk the other direction. Pursuers lose track.', rating: 'A' },
];

export const CHANGELING_VS_DISGUISE_SELF = {
  changeling: { duration: 'Unlimited', action: '1 action', spellSlot: 'None', detection: 'Physical change (passes Investigation touch)', limits: 'Same body type, no size change' },
  disguiseSelf: { duration: '1 hour', action: '1 action', spellSlot: 'Level 1', detection: 'Illusion (Investigation check reveals)', limits: 'Can change height by 1ft, look thinner/fatter' },
  note: 'Changeling is strictly better than Disguise Self in most cases. Physical change beats illusion.',
};

export function shapechangerVsDisguiseSelf() {
  return { winner: 'Changeling Shapechanger', reason: 'Physical (not illusion), unlimited duration, no spell slot, passes touch inspection' };
}
