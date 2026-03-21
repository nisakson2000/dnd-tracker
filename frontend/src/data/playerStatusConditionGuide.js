/**
 * playerStatusConditionGuide.js
 * Player Mode: All 5e conditions explained with tactical implications
 * Pure JS — no React dependencies.
 */

export const CONDITIONS = [
  { condition: 'Blinded', effects: ['Auto-fail sight-based checks', 'Disadvantage on attacks', 'Attacks against you have advantage'], severity: 'High', removal: ['Greater Restoration', 'Lesser Restoration (if disease/curse)', 'End of spell duration'], note: 'Devastating. Both offensive and defensive penalties. Blindsight bypasses.' },
  { condition: 'Charmed', effects: ['Can\'t attack charmer', 'Charmer has advantage on social checks against you'], severity: 'Medium', removal: ['End of spell', 'Taking damage from charmer/allies (some spells)', 'Calm Emotions'], note: 'Prevents attacking one creature. Social disadvantage. Doesn\'t control you outright.' },
  { condition: 'Deafened', effects: ['Auto-fail hearing-based checks'], severity: 'Low', removal: ['Lesser Restoration', 'End of effect'], note: 'Mostly flavor. Can\'t hear verbal commands. Casting spells still works (you can speak even if deaf).' },
  { condition: 'Exhaustion', effects: ['L1: Disadv checks', 'L2: Speed halved', 'L3: Disadv attacks/saves', 'L4: HP max halved', 'L5: Speed 0', 'L6: Death'], severity: 'Scaling (L3+ is devastating)', removal: ['One level per long rest (with food/water)', 'Greater Restoration removes one level'], note: 'Cumulative and deadly. L3+ is fight-ending. Avoid at all costs. Berserker Barbarian\'s biggest weakness.' },
  { condition: 'Frightened', effects: ['Disadvantage on attacks/checks while source of fear is visible', 'Can\'t willingly move closer to source'], severity: 'High', removal: ['End of spell', 'Can\'t see source (break line of sight)', 'Berserker Mindless Rage', 'Aura of Courage (Paladin 10)'], note: 'Can\'t approach + disadvantage. Shuts down melee entirely if source is the target.' },
  { condition: 'Grappled', effects: ['Speed = 0', 'Can\'t benefit from speed bonuses'], severity: 'Medium', removal: ['Escape: action, Athletics/Acrobatics vs grappler Athletics', 'Conditions that remove grappler (incapacitate, move them)', 'Teleportation'], note: 'Speed = 0 but can still attack, cast, and use abilities. Combine with prone for lockdown.' },
  { condition: 'Incapacitated', effects: ['Can\'t take actions or reactions'], severity: 'Very High', removal: ['End of effect'], note: 'No actions/reactions. Can\'t concentrate on spells. Still has movement/bonus action (theoretically).' },
  { condition: 'Invisible', effects: ['Heavily obscured for sight', 'Advantage on attacks', 'Attacks against you have disadvantage'], severity: 'Beneficial', removal: ['See Invisibility', 'True Seeing', 'Faerie Fire', 'Blindsight/Tremorsense'], note: 'Powerful offensive and defensive buff. But enemies can still target your square.' },
  { condition: 'Paralyzed', effects: ['Incapacitated', 'Can\'t move or speak', 'Auto-fail STR/DEX saves', 'Attacks have advantage', 'Hits within 5ft are auto-crits'], severity: 'Critical', removal: ['End of spell (save at end of turns usually)', 'Greater Restoration', 'Lesser Restoration (some causes)'], note: 'THE worst condition. Auto-crit + can\'t act. Hold Person/Monster inflicts this. Target it on enemies.' },
  { condition: 'Petrified', effects: ['Turned to stone', 'Incapacitated', 'Weight × 10', 'Resistance to all damage', 'Immune to poison/disease', 'Auto-fail STR/DEX saves', 'Advantage on attacks against'], severity: 'Critical', removal: ['Greater Restoration', 'Stone to Flesh (if available)'], note: 'Effective removal from combat. You\'re a statue. Only magic reverses it.' },
  { condition: 'Poisoned', effects: ['Disadvantage on attack rolls and ability checks'], severity: 'Medium', removal: ['Lesser Restoration', 'Protection from Poison', 'Lay on Hands (5 HP cost)', 'Short/long rest (poison duration)'], note: 'Most common condition from monsters. Disadvantage on attacks is painful. Dwarven Resilience helps.' },
  { condition: 'Prone', effects: ['Disadvantage on attacks', 'Melee attacks against have advantage', 'Ranged attacks against have disadvantage', 'Standing costs half movement'], severity: 'Low-Medium', removal: ['Stand up (costs half movement)', 'Teleportation (stand in new location)'], note: 'Go prone to dodge ranged. Get knocked prone = easy melee target. If speed = 0, can\'t stand.' },
  { condition: 'Restrained', effects: ['Speed = 0', 'Disadvantage on attacks', 'Attacks against have advantage', 'Disadvantage on DEX saves'], severity: 'High', removal: ['Escape (STR/DEX check vs effect DC)', 'Cutting free (Web, net)', 'Freedom of Movement'], note: 'Like grappled + prone combined. Very debilitating. Web and Entangle cause this.' },
  { condition: 'Stunned', effects: ['Incapacitated', 'Can\'t move', 'Auto-fail STR/DEX saves', 'Attacks against have advantage'], severity: 'Critical', removal: ['End of effect (usually save at end of turns)'], note: 'Like paralyzed but without auto-crits. Still devastating. Stunning Strike inflicts this.' },
  { condition: 'Unconscious', effects: ['Incapacitated', 'Can\'t move or speak', 'Drops everything held', 'Falls prone', 'Auto-fail STR/DEX saves', 'Attacks have advantage', 'Hits within 5ft are auto-crits'], severity: 'Critical', removal: ['Healing', 'Damage (wakes up)', 'Taking damage at 0 HP = death save failure'], note: 'Effectively paralyzed + prone. You drop to this at 0 HP.' },
];

export const CONDITION_TIER_LIST = [
  { tier: 'S (most devastating)', conditions: ['Paralyzed', 'Stunned', 'Petrified'], note: 'Complete shutdown. Target can\'t do anything.' },
  { tier: 'A (very strong)', conditions: ['Restrained', 'Incapacitated', 'Blinded', 'Frightened'], note: 'Major combat impairment.' },
  { tier: 'B (significant)', conditions: ['Grappled', 'Poisoned', 'Charmed', 'Prone'], note: 'Meaningful but manageable penalties.' },
  { tier: 'C (minor)', conditions: ['Deafened', 'Exhaustion L1'], note: 'Mostly cosmetic or minor impact.' },
];

export function conditionSeverity(conditionName) {
  const severities = {
    blinded: 'High', charmed: 'Medium', deafened: 'Low', frightened: 'High',
    grappled: 'Medium', incapacitated: 'Very High', invisible: 'Beneficial',
    paralyzed: 'Critical', petrified: 'Critical', poisoned: 'Medium',
    prone: 'Low-Medium', restrained: 'High', stunned: 'Critical', unconscious: 'Critical',
  };
  return severities[conditionName.toLowerCase()] || 'Unknown';
}
