/**
 * playerDeathAlternatives.js
 * Player Mode: What happens when your character dies and alternatives to death
 * Pure JS — no React dependencies.
 */

export const RESURRECTION_SPELLS = [
  { spell: 'Spare the Dying', level: 'Cantrip', time: '1 action', cost: 'None', restriction: 'Stabilizes a creature at 0 HP. Does NOT restore HP.', window: 'Must be alive (failing death saves).' },
  { spell: 'Healing Word', level: '1st', time: 'Bonus Action', cost: 'Spell slot', restriction: 'Heals 1d4+MOD. Brings unconscious creatures back.', window: 'Must be alive (at 0 HP, not dead).' },
  { spell: 'Revivify', level: '3rd', time: '1 action', cost: '300 gp diamonds (consumed)', restriction: 'Restores 1 HP. Can\'t restore missing body parts.', window: 'Within 1 minute of death.' },
  { spell: 'Raise Dead', level: '5th', time: '1 hour', cost: '500 gp diamond (consumed)', restriction: '-4 penalty to attacks/saves/checks (reduced by 1 per long rest). Can\'t restore missing parts.', window: 'Within 10 days of death.' },
  { spell: 'Reincarnate', level: '5th', time: '1 hour', cost: '1,000 gp oils/unguents (consumed)', restriction: 'Soul returns in a NEW RANDOM BODY (roll on table). Different race possible.', window: 'Within 10 days of death.' },
  { spell: 'Resurrection', level: '7th', time: '1 hour', cost: '1,000 gp diamond (consumed)', restriction: 'Restores missing body parts. -4 penalty (fades over 4 long rests).', window: 'Within 100 years. Body not required if you speak the name.' },
  { spell: 'True Resurrection', level: '9th', time: '1 hour', cost: '25,000 gp diamonds (consumed)', restriction: 'Full restoration. New body if original is destroyed.', window: 'Within 200 years. No body needed.' },
  { spell: 'Wish', level: '9th', time: '1 action', cost: 'None (but risky)', restriction: 'Can duplicate Resurrection or better. But Wish has inherent risks.', window: 'DM discretion.' },
];

export const DEATH_ALTERNATIVES = [
  { alternative: 'Captured', description: 'Instead of dying, the enemy captures you. New quest to escape.', tone: 'Adventure continues with new challenges.' },
  { alternative: 'Divine Intervention', description: 'A god or powerful being intervenes. May come with a price.', tone: 'Creates interesting story obligations.' },
  { alternative: 'Undead Return', description: 'Come back as a Revenant (temporary) seeking to complete unfinished business.', tone: 'Dark and dramatic. Time-limited.' },
  { alternative: 'Lingering Injuries', description: 'Instead of death, suffer a permanent injury (DMG optional rules).', tone: 'Adds realism. Character carries the scar.' },
  { alternative: 'Dark Bargain', description: 'A fiend, fey, or entity offers life in exchange for a favor.', tone: 'Creates future story hooks and moral dilemmas.' },
  { alternative: 'New Character', description: 'Roll a new character. Your old character\'s story ends here.', tone: 'Clean break. New character, new story.' },
];

export const PREVENTING_DEATH = [
  'Keep Revivify prepared and carry 300gp in diamonds AT ALL TIMES.',
  'Death Ward (4th level) prevents going to 0 HP once. Lasts 8 hours.',
  'Heroism (1st level, Paladin/Bard) gives temp HP each turn. Prevents chip damage kills.',
  'Aid (2nd level) increases max HP by 5 per slot level for 8 hours.',
  'Amulet of Proof against Detection and Location prevents scrying-based assassinations.',
  'If someone goes down, Healing Word (bonus action, 60ft range) picks them up immediately.',
  'Contingency (6th, Wizard) can auto-cast a spell when you drop to 0 HP.',
];

export function getResurrectionSpell(spellName) {
  return RESURRECTION_SPELLS.find(s => s.spell.toLowerCase() === (spellName || '').toLowerCase()) || null;
}

export function getCheapestResurrection(daysSinceDeath) {
  if (daysSinceDeath <= 0) return getResurrectionSpell('Healing Word');
  if (daysSinceDeath * 24 * 60 <= 1) return getResurrectionSpell('Revivify');  // within 1 minute
  if (daysSinceDeath <= 10) return getResurrectionSpell('Raise Dead');
  if (daysSinceDeath <= 36500) return getResurrectionSpell('Resurrection');
  return getResurrectionSpell('True Resurrection');
}
