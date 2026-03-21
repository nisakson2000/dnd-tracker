/**
 * playerActionDecisionGuide.js
 * Player Mode: When to Disengage, Dodge, Dash, Help, or Attack — decision framework
 * Pure JS — no React dependencies.
 */

export const ACTION_COMPARISON = [
  { action: 'Attack', cost: 'Action', effect: 'Deal damage.', when: 'Default. Most rounds.', note: 'Always the baseline comparison.' },
  { action: 'Dodge', cost: 'Action (BA for Monk)', effect: 'Disadvantage on all attacks vs you. Advantage on DEX saves.', when: 'Multiple enemies attacking you.', note: 'Underrated. Great for tanking.' },
  { action: 'Disengage', cost: 'Action (BA for Rogue/Monk)', effect: 'No OAs this turn.', when: 'Retreating from melee.', note: 'Full action Disengage is rarely optimal. Take the OA.' },
  { action: 'Dash', cost: 'Action (BA for Rogue/Monk)', effect: 'Double movement.', when: 'Closing distance or fleeing.', note: 'Good for reaching distant enemies or escaping.' },
  { action: 'Help', cost: 'Action', effect: 'Ally gets advantage on next attack/check.', when: 'Your attack is weak but ally needs advantage (Rogue SA).', note: 'Familiars can Help. Great support action.' },
  { action: 'Ready', cost: 'Action + Reaction', effect: 'Set trigger and response.', when: 'Enemies haven\'t appeared. Timing matters.', note: 'Readied spells use concentration + slot even if not triggered.' },
  { action: 'Hide', cost: 'Action (BA for Rogue)', effect: 'Unseen = advantage on attacks.', when: 'Rogues: every turn. Others: rarely worth it.', note: 'Need cover/concealment. DM adjudicates.' },
  { action: 'Grapple/Shove', cost: 'Replaces 1 attack', effect: 'Speed 0 / prone / push 5ft.', when: 'Battlefield control > damage.', note: 'Extra Attack lets you grapple + attack.' },
];

export const DECISION_FRAMEWORK = [
  'Can you deal meaningful damage? → Attack.',
  'Are 3+ enemies attacking you? → Dodge may be better than attacking.',
  'Is an ally at 0 HP nearby? → Heal them. Even 1 HP.',
  'Are you a Rogue? → BA Hide/Disengage/Dash. Always have a Cunning Action plan.',
  'Is an ally (Rogue) next to an enemy? → Help action gives them advantage/SA.',
  'Can you control the battlefield? → Grapple, shove into hazards, use items.',
  'Are enemies not in range? → Dash to close, or switch to ranged.',
  'Taking the OA (1d8ish) is usually better than wasting your action on Disengage.',
];

export const ACTION_TIPS = [
  'Dodge is underrated. 3+ attackers = Dodge often outperforms attacking.',
  'Disengage as full action: almost never worth it. Take the OA and attack instead.',
  'Rogues: Cunning Action turns Disengage/Dash/Hide into BA. Massive advantage.',
  'Help the Rogue: advantage → guaranteed Sneak Attack. Better than your d8 attack.',
  'Readied spells are expensive (concentration + slot). Avoid if possible.',
  'Sentinel feat makes Disengage impossible. Your OA = speed 0.',
  'Sometimes not attacking is optimal. Position, protect allies, control.',
];
