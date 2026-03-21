/**
 * playerActionSuggestions.js
 * Player Mode: Context-aware action suggestions during combat
 * Pure JS — no React dependencies.
 */

export const SITUATIONAL_SUGGESTIONS = [
  {
    situation: 'low_hp',
    condition: (hp, maxHp) => hp / maxHp < 0.25,
    suggestions: [
      { action: 'Disengage + Retreat', priority: 'high', reason: 'You\'re in danger. Get out of melee range.' },
      { action: 'Dodge', priority: 'high', reason: 'Disadvantage on attacks against you. Survive this round.' },
      { action: 'Healing Potion', priority: 'high', reason: 'Use your action to drink a potion. 2d4+2 HP.' },
      { action: 'Second Wind', priority: 'high', reason: 'Fighter: bonus action 1d10+level HP.' },
    ],
  },
  {
    situation: 'ally_down',
    condition: null,
    suggestions: [
      { action: 'Healing Word', priority: 'critical', reason: 'Bonus action, 60ft range. Pick them up NOW.' },
      { action: 'Spare the Dying', priority: 'medium', reason: 'Stabilize them if you can\'t heal. Touch range.' },
      { action: 'Medicine Check (DC 10)', priority: 'medium', reason: 'No spell slots? Stabilize manually.' },
      { action: 'Potion to Unconscious Ally', priority: 'medium', reason: 'Use your action to pour a potion in their mouth.' },
    ],
  },
  {
    situation: 'surrounded',
    condition: null,
    suggestions: [
      { action: 'Thunderwave', priority: 'high', reason: 'Push all adjacent enemies 10ft away. CON save.' },
      { action: 'Disengage', priority: 'high', reason: 'Move without provoking opportunity attacks.' },
      { action: 'Misty Step', priority: 'high', reason: 'Bonus action teleport 30ft. No opportunity attacks.' },
      { action: 'Dodge', priority: 'medium', reason: 'If you can\'t escape, make yourself harder to hit.' },
    ],
  },
  {
    situation: 'enemy_caster',
    condition: null,
    suggestions: [
      { action: 'Counterspell', priority: 'critical', reason: 'Stop their spell. Save your reaction.' },
      { action: 'Rush Into Melee', priority: 'high', reason: 'Forces concentration checks on every hit.' },
      { action: 'Silence (2nd)', priority: 'high', reason: '20ft sphere — no verbal components, no spells.' },
      { action: 'Grapple', priority: 'medium', reason: 'Lock them in place. Can\'t escape to cast at range.' },
    ],
  },
  {
    situation: 'no_resources',
    condition: null,
    suggestions: [
      { action: 'Attack with Weapon', priority: 'high', reason: 'Martial attacks don\'t cost resources.' },
      { action: 'Cantrips', priority: 'high', reason: 'Free to cast. Eldritch Blast, Fire Bolt, etc.' },
      { action: 'Help Action', priority: 'medium', reason: 'Give advantage to an ally\'s next attack. Free.' },
      { action: 'Dodge', priority: 'medium', reason: 'If you can\'t contribute damage, don\'t die.' },
      { action: 'Shove Prone', priority: 'medium', reason: 'Free (replaces an attack). Gives melee allies advantage.' },
    ],
  },
  {
    situation: 'first_turn',
    condition: null,
    suggestions: [
      { action: 'Best Concentration Spell', priority: 'critical', reason: 'Bless, Spirit Guardians, Hypnotic Pattern — set up for the whole fight.' },
      { action: 'Faerie Fire / Bless', priority: 'high', reason: 'Party-wide advantage or +1d4 to everything.' },
      { action: 'Hunter\'s Mark / Hex', priority: 'high', reason: 'Extra damage on every hit for the whole fight.' },
      { action: 'Position Strategically', priority: 'medium', reason: 'Use movement to get optimal position before fighting.' },
    ],
  },
];

export function getSuggestions(situation) {
  const entry = SITUATIONAL_SUGGESTIONS.find(s => s.situation === situation);
  return entry ? entry.suggestions : [];
}

export function getAutoSuggestions(hpPercent, hasAllyDown, isSurrounded, enemyHasCaster, isFirstTurn, slotsRemaining) {
  if (isFirstTurn) return getSuggestions('first_turn');
  if (hasAllyDown) return getSuggestions('ally_down');
  if (hpPercent < 25) return getSuggestions('low_hp');
  if (isSurrounded) return getSuggestions('surrounded');
  if (enemyHasCaster) return getSuggestions('enemy_caster');
  if (slotsRemaining <= 0) return getSuggestions('no_resources');
  return [];
}
