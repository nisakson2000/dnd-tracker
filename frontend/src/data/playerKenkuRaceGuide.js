/**
 * playerKenkuRaceGuide.js
 * Player Mode: Kenku — the mimicking raven
 * Pure JS — no React dependencies.
 */

export const KENKU_BASICS = {
  race: 'Kenku',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 DEX, +1 WIS (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  note: 'Expert mimicry of sounds. Legacy: can only speak via mimicry (roleplay challenge). MotM: removed speech restriction. Expert Forgery + Kenku Training for skills.',
};

export const KENKU_TRAITS_LEGACY = [
  { trait: 'Mimicry', effect: 'Perfectly mimic sounds you\'ve heard. WIS (Insight) vs CHA (Deception) to detect.', note: 'Mimic any voice, sound, or noise. Incredible for deception. Lure guards with their captain\'s voice.' },
  { trait: 'Expert Forgery', effect: 'Advantage on checks to create duplicates of existing objects (handwriting, craftwork).', note: 'Forge documents, signatures, keys. Great infiltration tool.' },
  { trait: 'Kenku Training', effect: 'Proficiency in two of: Acrobatics, Deception, Stealth, Sleight of Hand.', note: 'Two Rogue-type skills free. Excellent for infiltration builds.' },
  { trait: 'Speech restriction', effect: 'Can only speak using sounds heard before (mimicry). Cannot create original speech.', note: 'Major roleplay challenge. Must piece together sentences from heard phrases. Fun but demanding.' },
];

export const KENKU_TRAITS_MOTM = [
  { trait: 'Expert Duplication', effect: 'Copy writing/craftwork: advantage on checks. Copy spellwork: add PB to Arcana check for spell scrolls.', note: 'Easier spell scroll copying for Wizards. Better forgery.' },
  { trait: 'Kenku Recall', effect: 'Advantage on two skill proficiency checks per PB uses/LR. Must choose skills with proficiency.', note: 'Flexible advantage on skill checks. Use on important Stealth, Perception, etc.' },
  { trait: 'Mimicry', effect: 'Same perfect mimicry. Speech restriction removed in MotM.', note: 'Still mimic sounds. Can also speak normally now.' },
];

export const KENKU_CLASS_SYNERGY = [
  { class: 'Rogue', priority: 'S', reason: 'DEX. Free Stealth/Deception. Mimicry for infiltration. Expert Forgery. Perfect thief/spy.' },
  { class: 'Ranger', priority: 'A', reason: 'DEX+WIS. Mimicry for animal calls (lure prey). Stealth proficiency.' },
  { class: 'Bard', priority: 'A', reason: 'Mimicry for performance (mimic any instrument/voice). DEX for defense. Social spy.' },
  { class: 'Monk', priority: 'A', reason: 'DEX+WIS. Kenku Monk is fast and stealthy. Shadow Monk with Kenku = perfect infiltrator.' },
];

export const KENKU_TACTICS = [
  { tactic: 'Voice mimicry deception', detail: 'Mimic the enemy captain\'s voice: "Fall back!" or "Open the gate!" Incredibly powerful social tool.', rating: 'S' },
  { tactic: 'Sound-based distraction', detail: 'Mimic a scream, explosion, or monster roar to distract enemies. Lure guards away from posts.', rating: 'A' },
  { tactic: 'Forgery infiltration', detail: 'Forge orders, passes, letters. Advantage on the check. Combined with mimicry: impersonate messengers.', rating: 'A' },
  { tactic: 'MotM Kenku Recall', detail: 'Advantage on proficient skill checks PB/LR. Save for critical Stealth, Persuasion, or Perception checks.', rating: 'A' },
];

export function kenkuRecallUses(profBonus) {
  return profBonus;
}
