/**
 * playerSpellListByLevel.js
 * Player Mode: Must-know spells organized by level with ratings
 * Pure JS — no React dependencies.
 */

export const MUST_KNOW_SPELLS = {
  cantrips: [
    { spell: 'Eldritch Blast', classes: ['Warlock'], rating: 'S', why: 'Best damage cantrip with invocations. Scales at 5/11/17.' },
    { spell: 'Guidance', classes: ['Cleric', 'Druid'], rating: 'S', why: '+1d4 to any ability check. Use it constantly out of combat.' },
    { spell: 'Fire Bolt', classes: ['Sorcerer', 'Wizard'], rating: 'A', why: 'Best pure damage cantrip for most casters. 1d10 fire.' },
    { spell: 'Toll the Dead', classes: ['Cleric', 'Warlock', 'Wizard'], rating: 'A', why: '1d12 vs damaged targets. WIS save (rare proficiency).' },
    { spell: 'Prestidigitation', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A', why: 'Swiss army knife cantrip. Infinite creative uses.' },
    { spell: 'Minor Illusion', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A', why: 'Free cover, distractions, and creative problem solving.' },
  ],
  level1: [
    { spell: 'Shield', classes: ['Sorcerer', 'Wizard'], rating: 'S', why: '+5 AC as reaction. Best defensive spell in the game.' },
    { spell: 'Healing Word', classes: ['Bard', 'Cleric', 'Druid'], rating: 'S', why: 'Bonus action, 60ft range. Picks up downed allies.' },
    { spell: 'Bless', classes: ['Cleric', 'Paladin'], rating: 'S', why: '+1d4 to attacks and saves for 3 creatures. Always good.' },
    { spell: 'Silvery Barbs', classes: ['Bard', 'Sorcerer', 'Wizard'], rating: 'S', why: 'Force enemy reroll + give ally advantage. 1st-level reaction.' },
    { spell: 'Absorb Elements', classes: ['Druid', 'Ranger', 'Sorcerer', 'Wizard'], rating: 'A', why: 'Halve elemental damage as reaction. Essential for dragon fights.' },
    { spell: 'Faerie Fire', classes: ['Bard', 'Druid'], rating: 'A', why: 'Advantage on attacks for entire party. Reveals invisible.' },
  ],
  level2: [
    { spell: 'Web', classes: ['Sorcerer', 'Wizard'], rating: 'S', why: 'Best 2nd-level control spell. Restrained is devastating.' },
    { spell: 'Misty Step', classes: ['Sorcerer', 'Warlock', 'Wizard'], rating: 'S', why: 'Bonus action 30ft teleport. Escape anything.' },
    { spell: 'Spiritual Weapon', classes: ['Cleric'], rating: 'S', why: 'Bonus action attack every turn. No concentration!' },
    { spell: 'Pass Without Trace', classes: ['Druid', 'Ranger'], rating: 'S', why: '+10 Stealth to entire party. Nearly guarantees surprise.' },
    { spell: 'Hold Person', classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A', why: 'Paralyzed = auto-crit in melee. Save-or-suck.' },
  ],
  level3: [
    { spell: 'Fireball', classes: ['Sorcerer', 'Wizard'], rating: 'S', why: '8d6 in 20ft sphere. The AoE damage benchmark.' },
    { spell: 'Counterspell', classes: ['Sorcerer', 'Warlock', 'Wizard'], rating: 'S', why: 'Negate any spell. Essential vs enemy casters.' },
    { spell: 'Spirit Guardians', classes: ['Cleric'], rating: 'S', why: '3d8 damage when enemies enter/start near you. Concentration.' },
    { spell: 'Hypnotic Pattern', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'S', why: 'Incapacitate a group. No repeated saves!' },
    { spell: 'Revivify', classes: ['Cleric', 'Paladin'], rating: 'S', why: 'Bring back the dead within 1 minute. 300gp diamond.' },
    { spell: 'Conjure Animals', classes: ['Druid', 'Ranger'], rating: 'A', why: '8 wolves = 8 attacks with advantage (pack tactics). Broken.' },
  ],
  level4: [
    { spell: 'Polymorph', classes: ['Bard', 'Druid', 'Sorcerer', 'Wizard'], rating: 'S', why: 'Giant Ape = 157 HP. Emergency heal OR disable an enemy.' },
    { spell: 'Greater Invisibility', classes: ['Bard', 'Sorcerer', 'Wizard'], rating: 'S', why: 'Invisible while attacking. Advantage + enemies have disadvantage.' },
    { spell: 'Banishment', classes: ['Cleric', 'Paladin', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A', why: 'Remove a threat for 1 minute. Permanent if extraplanar!' },
    { spell: 'Wall of Fire', classes: ['Druid', 'Sorcerer', 'Wizard'], rating: 'A', why: 'Battlefield control + 5d8 damage. Splits the fight.' },
  ],
  level5: [
    { spell: 'Wall of Force', classes: ['Wizard'], rating: 'S', why: 'Indestructible wall. No save. Split encounters in half.' },
    { spell: 'Animate Objects', classes: ['Bard', 'Sorcerer', 'Wizard'], rating: 'S', why: '10 tiny objects = 10 attacks at +8 for 1d4+4 each.' },
    { spell: 'Holy Weapon', classes: ['Cleric', 'Paladin'], rating: 'A', why: '+2d8 radiant per hit. On a Fighter = devastating.' },
    { spell: 'Greater Restoration', classes: ['Bard', 'Cleric', 'Druid'], rating: 'A', why: 'Cures exhaustion, charm, petrification, curses.' },
  ],
};

export function getTopSpellsForLevel(level) {
  const key = level === 0 ? 'cantrips' : `level${level}`;
  return MUST_KNOW_SPELLS[key] || [];
}

export function getTopSpellsForClass(className, level) {
  const spells = getTopSpellsForLevel(level);
  return spells.filter(s => s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase()));
}

export function getSRatedSpells() {
  const all = [];
  for (const [, spells] of Object.entries(MUST_KNOW_SPELLS)) {
    all.push(...spells.filter(s => s.rating === 'S'));
  }
  return all;
}
