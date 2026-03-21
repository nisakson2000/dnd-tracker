/**
 * playerChangelingGuide.js
 * Player Mode: Changeling race guide — the shapeshifter
 * Pure JS — no React dependencies.
 */

export const CHANGELING_BASICS = {
  race: 'Changeling',
  source: 'Eberron: Rising from the Last War / MotM',
  size: 'Medium',
  speed: '30ft',
  asi: '+2 CHA, +1 any (Eberron) or flexible (MotM)',
  theme: 'Natural shapeshifter. Change appearance at will. Ultimate infiltrator.',
  note: 'Best infiltration race. Shapechanger is unlimited Disguise Self that\'s REAL, not an illusion. Undetectable.',
};

export const CHANGELING_TRAITS = [
  { trait: 'Shapechanger', effect: 'Action: change your appearance (height, weight, facial features, voice, hair, etc.). Must stay same general body type. Lasts until you change again or die.', note: 'NOT an illusion. It\'s REAL physical change. No spell, no save, no detection by Detect Magic. Only True Seeing reveals you.' },
  { trait: 'Changeling Instincts', effect: 'Proficiency in two skills: Deception, Insight, Intimidation, Performance, or Persuasion.', note: 'Two free CHA/social skills. Perfect for the face role.' },
  { trait: 'Divergent Persona (Eberron)', effect: 'One tool proficiency. When using that tool in your alternate persona, add double proficiency.', note: 'Double proficiency with one tool. Niche but flavorful.' },
];

export const SHAPECHANGER_VS_DISGUISE_SELF = {
  shapechanger: { method: 'Physical change', detection: 'Only True Seeing', duration: 'Until changed', components: 'None', action: 'Action', note: 'Real body change. Can be touched. Passes physical inspection.' },
  disguiseSelf: { method: 'Illusion', detection: 'Investigation check, Detect Magic, True Seeing', duration: '1 hour', components: 'V, S', action: 'Action + spell slot', note: 'Visual illusion only. Physical inspection reveals mismatch.' },
  disguiseKit: { method: 'Physical disguise', detection: 'Investigation vs your check', duration: 'Until removed', components: 'Kit + 10 min', action: '10 minutes', note: 'Takes time. Can be searched for. But real physical disguise.' },
  verdict: 'Shapechanger is strictly superior. Real change, unlimited, no detection except True Seeing.',
};

export const CHANGELING_TACTICS = [
  { tactic: 'Identity theft', detail: 'See someone → become them. Walk into their house, office, military unit. No spell to detect.', rating: 'S' },
  { tactic: 'Escape pursuit', detail: 'Being chased? Duck behind cover → change appearance → walk out as a different person. Guards run past you.', rating: 'S' },
  { tactic: 'Multiple identities', detail: 'Maintain 3-4 personas. Merchant, noble, guard, beggar. Switch as needed for different social situations.', rating: 'S' },
  { tactic: 'Impersonate authority', detail: 'Become the captain, the noble, the shopkeeper. Give orders. Access restricted areas.', rating: 'A', note: 'You look perfect but you need to ACT the part (Deception/Performance checks).' },
  { tactic: 'Combat deception', detail: 'Change to look like an enemy. Confuse targeting. "Which orc is the adventurer?"', rating: 'B', note: 'DM-dependent. Enemies may figure it out quickly in combat.' },
];

export const CHANGELING_BUILDS = [
  { build: 'Changeling Rogue', detail: '+2 CHA. Shapechanger + Deception proficiency + Expertise. The ultimate spy.', rating: 'S' },
  { build: 'Changeling Bard (Whispers)', detail: '+2 CHA. Shapechanger + Mantle of Whispers (steal dead person\'s identity + memories). Double infiltration.', rating: 'S', note: 'Shapechanger gives the look. Mantle gives the memories. Unstoppable infiltrator.' },
  { build: 'Changeling Warlock (Mask of Many Faces)', detail: '+2 CHA. Already a shapeshifter. Mask of Many Faces is redundant — save the invocation.', rating: 'A', note: 'Shapechanger is better than Mask of Many Faces. Pick other invocations.' },
  { build: 'Changeling Paladin', detail: '+2 CHA. Unexpected. Holy warrior who can look like anyone. Undercover Paladin.', rating: 'A' },
];

export function shapechangerDetectionDC() {
  return Infinity; // Only True Seeing works. No DC to beat.
}
