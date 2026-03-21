/**
 * playerTrickeryClericGuide.js
 * Player Mode: Trickery Domain Cleric — the deception and illusion Cleric
 * Pure JS — no React dependencies.
 */

export const TRICKERY_BASICS = {
  class: 'Cleric (Trickery Domain)',
  theme: 'Deception, stealth, and illusions. The un-Cleric Cleric.',
  armorProf: 'Medium armor (no heavy armor).',
  note: 'Often underrated. Excellent spell list and Invoke Duplicity is incredibly creative.',
};

export const TRICKERY_FEATURES = [
  { feature: 'Blessing of the Trickster', level: 1, effect: 'Touch: give a creature advantage on Stealth checks for 1 hour. Not concentration.', note: 'Give the Paladin advantage on Stealth. Party-wide stealth improvement.' },
  { feature: 'Channel Divinity: Invoke Duplicity', level: 2, effect: 'Action: create illusion duplicate within 30ft for 1 minute. Move it 30ft as bonus action. Cast spells as if you were in the duplicate\'s space.', note: 'Cast Inflict Wounds from 60ft away. Cast Touch spells at range. Incredible positioning.' },
  { feature: 'Channel Divinity: Cloak of Shadows', level: 6, effect: 'Action: become invisible until end of next turn or until you attack/cast.', note: 'Free invisibility. One turn. Use to escape, reposition, or set up.' },
  { feature: 'Divine Strike', level: 8, effect: '+1d8 poison damage on weapon hit (2d8 at L14).', note: 'Poison damage is commonly resisted. Weakest Divine Strike.' },
  { feature: 'Improved Duplicity', level: 17, effect: 'Create 4 duplicates instead of 1. Advantage on attacks when you and a duplicate are within 5ft of target.', note: 'Four duplicates = surrounded. Advantage on all attacks.' },
];

export const TRICKERY_SPELLS = {
  domainSpells: [
    { level: 1, spells: 'Charm Person, Disguise Self', note: 'Social infiltration tools.' },
    { level: 2, spells: 'Mirror Image, Pass Without Trace', note: 'Mirror Image (no concentration!) + PWT (+10 stealth party-wide). Excellent.' },
    { level: 3, spells: 'Blink, Dispel Magic', note: 'Blink: 50% chance to vanish each turn. Dispel Magic: always useful.' },
    { level: 4, spells: 'Dimension Door, Polymorph', note: 'Polymorph! Not normally on Cleric list. Huge addition.' },
    { level: 5, spells: 'Dominate Person, Modify Memory', note: 'Mind control spells. Very powerful in social/story situations.' },
  ],
};

export const INVOKE_DUPLICITY_TACTICS = [
  { tactic: 'Ranged Touch spells', detail: 'Cast Inflict Wounds, Bestow Curse, Contagion from the duplicate\'s position (30ft away from you).', note: 'Touch spells become 30ft+ range.' },
  { tactic: 'Flanking buddy', detail: 'Duplicate provides flanking for allies (if your DM uses flanking rules). It\'s an "ally."', note: 'Free advantage for melee allies.' },
  { tactic: 'Distraction', detail: 'Send duplicate around a corner. Enemies waste actions attacking it (it has AC = your AC but pops if hit).', note: 'Wastes enemy actions. Reveals their position.' },
  { tactic: 'Spirit Guardians source', detail: 'Spirit Guardians emanates from YOU, not the duplicate. But you can cast new spells from the duplicate.', note: 'Stay safe behind cover. Duplicate casts for you.' },
  { tactic: 'Scouting', detail: 'Move duplicate 30ft/round. See through its eyes. Check ahead for traps/enemies.', note: 'Safer than sending a familiar (duplicate can\'t die to traps).' },
];

export const TRICKERY_VS_OTHER_CLERICS = {
  pros: ['Best domain spell list (Polymorph, Mirror Image, PWT)', 'Creative CD usage', 'Stealth support', 'Social encounter dominance'],
  cons: ['No heavy armor', 'Poison divine strike (commonly resisted)', 'Duplicate uses bonus action to move', 'Less raw combat power than Twilight/Peace'],
  verdict: 'Not the strongest in combat but the most versatile in and out of combat.',
};

export function duplicityCastRange(yourPosition, duplicatePosition, spellRange) {
  // Spell originates from duplicate's position
  return spellRange; // effective range is spell range from duplicate's position
}

export function passWithoutTraceStealth(stealthMod) {
  return stealthMod + 10; // +10 from PWT
}
