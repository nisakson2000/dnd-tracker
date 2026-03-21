/**
 * playerTurnStructure.js
 * Player Mode: Complete turn structure breakdown and optimization
 * Pure JS — no React dependencies.
 */

export const TURN_STRUCTURE = {
  phases: [
    { phase: 'Start of Turn', triggers: ['Concentration checks (if took damage)', 'Start-of-turn effects (regeneration, auras)', 'Condition save repeats (some end "at the start of your turn")'], action: 'None — these happen automatically' },
    { phase: 'Movement', triggers: ['Move up to your speed', 'Can split before/during/after actions', 'Standing from prone (half speed)', 'Object interaction (one free)'], action: 'No action cost. Just spend speed.' },
    { phase: 'Action', triggers: ['Attack, Cast, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use Object'], action: 'Your main action. One per turn (unless Extra Attack, Action Surge, etc.)' },
    { phase: 'Bonus Action', triggers: ['Only if a feature/spell grants one', 'TWF off-hand attack, Cunning Action, spells with "bonus action" casting time'], action: 'One per turn. Order doesn\'t matter (before or after action).' },
    { phase: 'Free Interaction', triggers: ['Draw/sheathe weapon, open door, pick up item', 'Drop an item (unlimited)', 'Short verbal communication'], action: 'One object interaction free. Additional costs action.' },
    { phase: 'End of Turn', triggers: ['End-of-turn effects', 'Condition save repeats (some end "at the end of your turn")', 'Announce "I end my turn"'], action: 'None — these happen automatically' },
  ],
  reactions: 'One per ROUND. Can happen on anyone\'s turn. Resets at start of YOUR turn.',
};

export const OPTIMAL_TURN_ORDER = [
  { step: 1, action: 'Check start-of-turn effects', detail: 'Do I need to save vs a condition? Do I regenerate? Does my aura trigger?' },
  { step: 2, action: 'Assess the battlefield', detail: 'Who\'s down? Who\'s the biggest threat? Has anything changed since my last turn?' },
  { step: 3, action: 'Announce your plan', detail: '"I\'m going to move here, attack the orc, and Healing Word the Rogue." Clear communication.' },
  { step: 4, action: 'Move (part 1)', detail: 'Move to your desired position. Leave remaining movement for after your action.' },
  { step: 5, action: 'Take your Action', detail: 'Attack, cast a spell, or take another action. Roll attack AND damage together.' },
  { step: 6, action: 'Bonus Action', detail: 'Off-hand attack, Healing Word, Spiritual Weapon, Cunning Action, etc.' },
  { step: 7, action: 'Move (remaining)', detail: 'Use leftover movement for repositioning, cover, or setting up next turn.' },
  { step: 8, action: 'Free object interaction', detail: 'Sheathe weapon, pick up an item, open a door. One free per turn.' },
  { step: 9, action: 'End your turn', detail: 'Say "I end my turn." Check end-of-turn effects. Start planning next turn.' },
];

export const COMMON_TURN_TEMPLATES = [
  { template: 'Martial Standard', actions: 'Move → Attack (Extra Attack) → Bonus action (if available) → End', time: '15-20s' },
  { template: 'Rogue Combo', actions: 'Attack → Cunning Action Hide → (or Disengage and move away)', time: '20-25s' },
  { template: 'Spellcaster Offense', actions: 'Move to position → Cast leveled spell → End (or cantrip if BA spell)', time: '25-35s' },
  { template: 'Cleric Support', actions: 'Spiritual Weapon attack (BA) → Cast/attack (Action) → Move to safety → End', time: '25-30s' },
  { template: 'Paladin Nova', actions: 'Move to target → Attack + Smite → Attack + Smite → BA (if available) → End', time: '25-30s' },
  { template: 'Barbarian Berserker', actions: 'Rage (BA, round 1 only) → Move → Reckless Attack × 2 → Frenzy Attack (BA, later rounds) → End', time: '20-25s' },
  { template: 'Monk Flurry', actions: 'Move → Attack × 2 → Flurry of Blows (BA, 2 unarmed) → Stunning Strike? → End', time: '25-30s' },
  { template: 'Emergency Heal', actions: 'Move to downed ally → Healing Word (BA) → Attack enemy (Action) → End', time: '20-25s' },
];

export function getTurnTemplate(className) {
  const templates = {
    Fighter: COMMON_TURN_TEMPLATES[0],
    Rogue: COMMON_TURN_TEMPLATES[1],
    Wizard: COMMON_TURN_TEMPLATES[2],
    Sorcerer: COMMON_TURN_TEMPLATES[2],
    Cleric: COMMON_TURN_TEMPLATES[3],
    Paladin: COMMON_TURN_TEMPLATES[4],
    Barbarian: COMMON_TURN_TEMPLATES[5],
    Monk: COMMON_TURN_TEMPLATES[6],
  };
  return templates[className] || COMMON_TURN_TEMPLATES[0];
}

export function getPhaseInfo(phaseName) {
  return TURN_STRUCTURE.phases.find(p =>
    p.phase.toLowerCase().includes((phaseName || '').toLowerCase())
  ) || null;
}
