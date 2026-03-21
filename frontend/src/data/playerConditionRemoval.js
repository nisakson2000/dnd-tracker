/**
 * playerConditionRemoval.js
 * Player Mode: Quick reference for removing conditions
 * Pure JS — no React dependencies.
 */

export const CONDITION_REMOVAL = [
  {
    condition: 'Blinded',
    cures: ['Lesser Restoration (2nd)', 'Heal (6th)', 'Remove the source (Blindness spell ends, darkness dispelled)'],
    selfHelp: 'Blindsight/Tremorsense still detects creatures. Echolocation works.',
  },
  {
    condition: 'Charmed',
    cures: ['Calm Emotions (2nd) — suppresses', 'Dispel Magic (3rd) — on magical charm', 'Damage from the charmer — ends some charms'],
    selfHelp: 'Fey Ancestry (Elf): advantage on saves. Devotion Paladin Aura: immune within 10ft.',
  },
  {
    condition: 'Deafened',
    cures: ['Lesser Restoration (2nd)', 'Heal (6th)'],
    selfHelp: 'Doesn\'t affect most combat. Can\'t hear verbal components for Counterspell identification.',
  },
  {
    condition: 'Exhaustion',
    cures: ['Greater Restoration (5th) — removes 1 level', 'Long rest — removes 1 level', 'Heroes\' Feast — immune for 24h'],
    selfHelp: 'Exhaustion is cumulative and deadly. Avoid sources. Rest often.',
  },
  {
    condition: 'Frightened',
    cures: ['Calm Emotions (2nd)', 'Heroes\' Feast — immune 24h', 'Move out of line of sight of the source'],
    selfHelp: 'Halfling Brave: advantage on saves. Berserker Barbarian: immune while raging.',
  },
  {
    condition: 'Grappled',
    cures: ['Action: STR (Athletics) or DEX (Acrobatics) vs grappler\'s Athletics', 'Misty Step/Dimension Door — teleport out', 'Freedom of Movement — auto-escape'],
    selfHelp: 'Thunderwave pushes grappler away. Being teleported also escapes.',
  },
  {
    condition: 'Incapacitated',
    cures: ['Remove the source (usually ends when a spell ends)', 'Heal the condition causing it'],
    selfHelp: 'Can\'t take actions or reactions. Allies must protect you.',
  },
  {
    condition: 'Invisible',
    cures: ['Faerie Fire — outlines the creature', 'See Invisibility (2nd)', 'True Seeing', 'Blindsight/Tremorsense'],
    selfHelp: 'Invisible ≠ undetectable. Passive Perception can still locate by sound.',
  },
  {
    condition: 'Paralyzed',
    cures: ['Lesser Restoration (2nd)', 'Freedom of Movement (4th)', 'Wait for the spell to end + repeat save'],
    selfHelp: 'Auto-crit if hit within 5ft. Allies should protect you.',
  },
  {
    condition: 'Petrified',
    cures: ['Greater Restoration (5th)', 'Stone to Flesh (homebrew)', 'Some monster abilities reverse it'],
    selfHelp: 'You are effectively a statue. Weight increases ×10. Immune to everything while petrified.',
  },
  {
    condition: 'Poisoned',
    cures: ['Lesser Restoration (2nd)', 'Protection from Poison (2nd)', 'Antitoxin — advantage for 1 hour'],
    selfHelp: 'Dwarven Resilience: advantage + resistance. Purity of Body (Monk 10): immune.',
  },
  {
    condition: 'Prone',
    cures: ['Stand up — costs half your movement speed', 'Can\'t stand if speed is 0 (grappled + prone = stuck)'],
    selfHelp: 'Melee attacks against you have advantage, ranged have disadvantage. Use if fighting archers.',
  },
  {
    condition: 'Restrained',
    cures: ['Break free — usually STR check vs DC', 'Freedom of Movement (4th)', 'Misty Step'],
    selfHelp: 'Attacks against you have advantage. Your attacks and DEX saves have disadvantage.',
  },
  {
    condition: 'Stunned',
    cures: ['Usually wait for the effect to end + repeat save', 'Limited options — mostly high saves'],
    selfHelp: 'Auto-fail STR and DEX saves. Attacks have advantage. Very dangerous.',
  },
  {
    condition: 'Unconscious',
    cures: ['Any healing (Healing Word, potion, etc.)', 'Stabilize + wait to naturally regain 1 HP after 1d4 hours'],
    selfHelp: 'If at 0 HP, you\'re making death saves. Healing Word is the best pick-up spell.',
  },
];

export function getConditionCure(condition) {
  return CONDITION_REMOVAL.find(c => c.condition.toLowerCase() === (condition || '').toLowerCase()) || null;
}

export function searchConditions(query) {
  const q = (query || '').toLowerCase();
  return CONDITION_REMOVAL.filter(c =>
    c.condition.toLowerCase().includes(q) ||
    c.cures.some(cure => cure.toLowerCase().includes(q)) ||
    c.selfHelp.toLowerCase().includes(q)
  );
}
