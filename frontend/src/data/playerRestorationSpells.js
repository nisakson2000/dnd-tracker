/**
 * playerRestorationSpells.js
 * Player Mode: Restoration and condition removal spell reference
 * Pure JS — no React dependencies.
 */

export const RESTORATION_SPELLS = [
  { spell: 'Lesser Restoration', level: 2, action: 'Action', range: 'Touch', removes: ['Blinded', 'Deafened', 'Paralyzed', 'Poisoned', 'One disease'], note: 'The go-to for basic condition removal. Doesn\'t remove curses.', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Artificer'] },
  { spell: 'Greater Restoration', level: 5, action: 'Action', range: 'Touch', removes: ['Exhaustion (1 level)', 'Charmed', 'Petrified', 'Curse', 'Ability score reduction', 'Max HP reduction'], note: '100 gp diamond dust consumed. Removes almost anything. The big one.', classes: ['Bard', 'Cleric', 'Druid', 'Artificer'] },
  { spell: 'Remove Curse', level: 3, action: 'Action', range: 'Touch', removes: ['All curses on target', 'Cursed item attunement (but doesn\'t fix the item)'], note: 'Specifically targets curses. Some powerful curses may require higher magic.', classes: ['Cleric', 'Paladin', 'Warlock', 'Wizard'] },
  { spell: 'Heal', level: 6, action: 'Action', range: '60ft', removes: ['Blinded', 'Deafened', 'Any disease'], note: 'Also heals 70 HP. The emergency button. 60ft range is key.', classes: ['Cleric', 'Druid'] },
  { spell: 'Dispel Magic', level: 3, action: 'Action', range: '120ft', removes: ['Any ongoing spell effect of 3rd level or lower (auto)', 'Higher levels with check (DC 10 + spell level)'], note: 'Targets spell effects, not conditions. If the condition is from a spell, this ends it.', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Sorcerer', 'Warlock', 'Wizard'] },
  { spell: 'Protection from Poison', level: 2, action: 'Action', range: 'Touch', removes: ['One poison affecting the target'], note: 'Also gives advantage on saves vs poison and resistance to poison damage for 1 hour.', classes: ['Cleric', 'Druid', 'Paladin', 'Ranger', 'Artificer'] },
  { spell: 'Calm Emotions', level: 2, action: 'Action', range: '60ft', removes: ['Charmed', 'Frightened (suppresses for duration)'], note: 'Concentration. Suppresses, doesn\'t end. Effect returns when spell ends.', classes: ['Bard', 'Cleric'] },
  { spell: 'Heroes\' Feast', level: 6, action: '10 min', range: '30ft', removes: ['All poison and disease', 'Prevents fear and poison for 24 hours'], note: '1000 gp bowl consumed. Cast the night before. Prevents conditions proactively.', classes: ['Cleric', 'Druid'] },
];

export const CONDITION_TO_CURE = {
  'Blinded': ['Lesser Restoration', 'Heal', 'Greater Restoration'],
  'Charmed': ['Calm Emotions (suppress)', 'Greater Restoration', 'Dispel Magic (if from spell)'],
  'Deafened': ['Lesser Restoration', 'Heal', 'Greater Restoration'],
  'Exhaustion': ['Greater Restoration (1 level per cast)', 'Long rest (1 level per rest)'],
  'Frightened': ['Calm Emotions (suppress)', 'Heroes\' Feast (immunity)', 'Remove the source of fear'],
  'Grappled': ['Escape with Athletics/Acrobatics contest', 'Misty Step', 'Freedom of Movement'],
  'Incapacitated': ['End the causing effect (Sleep: damage wakes, Tasha\'s: save each turn)'],
  'Paralyzed': ['Lesser Restoration', 'Greater Restoration', 'Wait for save'],
  'Petrified': ['Greater Restoration'],
  'Poisoned': ['Lesser Restoration', 'Protection from Poison', 'Lay on Hands (5 HP per disease/poison)'],
  'Prone': ['Stand up (costs half movement)', 'Not a condition that needs magical removal'],
  'Restrained': ['STR check vs DC', 'Freedom of Movement', 'Dispel Magic (if from spell)'],
  'Stunned': ['Wait for save', 'Usually ends on its own after a round'],
  'Unconscious': ['Healing spell/potion', 'Stabilize then wait 1d4 hours'],
};

export function getCure(condition) {
  return CONDITION_TO_CURE[condition] || ['Consult your DM for cure options'];
}

export function getSpellInfo(spellName) {
  return RESTORATION_SPELLS.find(s =>
    s.spell.toLowerCase().includes((spellName || '').toLowerCase())
  ) || null;
}

export function canRemoveCondition(condition, availableSpells) {
  const cures = CONDITION_TO_CURE[condition] || [];
  return cures.filter(cure =>
    (availableSpells || []).some(s => cure.toLowerCase().includes(s.toLowerCase()))
  );
}
