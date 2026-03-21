/**
 * playerConditionQuickRef.js
 * Player Mode: All 15 conditions with quick-reference format
 * Pure JS — no React dependencies.
 */

export const CONDITIONS = [
  { name: 'Blinded', icon: '👁️‍🗨️', color: '#212121', effects: ['Can\'t see. Auto-fail sight checks.', 'Attacks have DISADVANTAGE.', 'Attacks against you have ADVANTAGE.'], cures: ['Greater Restoration', 'Remove Curse (if cursed)', 'Healing source'] },
  { name: 'Charmed', icon: '💕', color: '#e91e63', effects: ['Can\'t attack the charmer.', 'Charmer has advantage on social checks.'], cures: ['Spell ends', 'Calm Emotions', 'Take damage from charmer\'s allies'] },
  { name: 'Deafened', icon: '🔇', color: '#607d8b', effects: ['Can\'t hear. Auto-fail hearing checks.', 'Can still cast spells (verbal components still work).'], cures: ['Lesser Restoration', 'Healing'] },
  { name: 'Exhaustion', icon: '😫', color: '#795548', effects: ['1: Disadvantage on checks', '2: Speed halved', '3: Disadvantage on attacks/saves', '4: HP max halved', '5: Speed 0', '6: DEATH'], cures: ['Long rest removes 1 level', 'Greater Restoration removes 1', 'Potion of Vitality removes all'] },
  { name: 'Frightened', icon: '😨', color: '#ff9800', effects: ['Disadvantage on checks/attacks while source is in sight.', 'Can\'t willingly move closer to the source.'], cures: ['Remove source from sight', 'Calm Emotions', 'Heroism spell'] },
  { name: 'Grappled', icon: '🤼', color: '#8d6e63', effects: ['Speed = 0.', 'Ends if grappler is incapacitated or forced apart.'], cures: ['Win Athletics/Acrobatics contest', 'Teleport (Misty Step)', 'Shove grappler away'] },
  { name: 'Incapacitated', icon: '💫', color: '#9e9e9e', effects: ['Can\'t take actions or reactions.', 'Can still move (unless also stunned/paralyzed).'], cures: ['Depends on source'] },
  { name: 'Invisible', icon: '👻', color: '#b0bec5', effects: ['Heavily obscured. Can\'t be seen.', 'Attacks have ADVANTAGE.', 'Attacks against you have DISADVANTAGE.'], cures: ['Faerie Fire', 'See Invisibility', 'True Seeing', 'Flour/paint'] },
  { name: 'Paralyzed', icon: '⚡', color: '#ffc107', effects: ['Incapacitated. Can\'t move or speak.', 'Auto-fail STR/DEX saves.', 'Attacks have advantage. Hits within 5ft are AUTO-CRITS.'], cures: ['Lesser Restoration (if disease/poison)', 'Greater Restoration', 'Specific spell ends'] },
  { name: 'Petrified', icon: '🗿', color: '#78909c', effects: ['Turned to stone. Weight ×10.', 'Incapacitated, can\'t move/speak/perceive.', 'Resistance to ALL damage. Immune to poison/disease.'], cures: ['Greater Restoration', 'Stone to Flesh (Transmute Rock)'] },
  { name: 'Poisoned', icon: '☠️', color: '#69f0ae', effects: ['Disadvantage on attack rolls and ability checks.'], cures: ['Lesser Restoration', 'Protection from Poison', 'Antitoxin (prevents)', 'Lay on Hands (5 HP)'] },
  { name: 'Prone', icon: '⬇️', color: '#a1887f', effects: ['Crawling only (double movement cost).', 'Disadvantage on attacks.', 'Melee within 5ft has advantage. Ranged has disadvantage.'], cures: ['Stand up (costs half movement)', 'Can\'t stand if speed = 0'] },
  { name: 'Restrained', icon: '⛓️', color: '#5d4037', effects: ['Speed = 0.', 'Attacks have DISADVANTAGE.', 'Attacks against you have ADVANTAGE.', 'Disadvantage on DEX saves.'], cures: ['Break free (STR check)', 'Cut bindings', 'Misty Step'] },
  { name: 'Stunned', icon: '💫', color: '#ff5722', effects: ['Incapacitated. Can\'t move. Speak falteringly.', 'Auto-fail STR/DEX saves.', 'Attacks against you have ADVANTAGE.'], cures: ['Effect ends (usually end of next turn)', 'Specific ability/spell'] },
  { name: 'Unconscious', icon: '😴', color: '#424242', effects: ['Incapacitated. Can\'t move or speak.', 'Drop what you\'re holding. Fall prone.', 'Auto-fail STR/DEX saves. Attacks have advantage. Hits within 5ft auto-crit.'], cures: ['ANY healing', 'Take damage (wakes up)', 'Stabilize + 1d4 hours'] },
];

export function getCondition(name) {
  return CONDITIONS.find(c => c.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

export function getConditionColor(name) {
  const condition = getCondition(name);
  return condition ? condition.color : '#9e9e9e';
}

export function getWorstConditions() {
  return CONDITIONS.filter(c => ['Paralyzed', 'Stunned', 'Petrified', 'Unconscious'].includes(c.name));
}

export function searchConditions(query) {
  return CONDITIONS.filter(c =>
    c.name.toLowerCase().includes((query || '').toLowerCase()) ||
    c.effects.some(e => e.toLowerCase().includes((query || '').toLowerCase()))
  );
}
