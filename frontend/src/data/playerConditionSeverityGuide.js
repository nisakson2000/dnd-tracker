/**
 * playerConditionSeverityGuide.js
 * Player Mode: All D&D 5e conditions ranked by severity
 * Pure JS — no React dependencies.
 */

export const CONDITIONS_BY_SEVERITY = [
  { condition: 'Stunned', severity: 'S+', key: 'Incapacitated. Auto-fail STR/DEX. Advantage to hit.', removal: 'Save next turn.' },
  { condition: 'Paralyzed', severity: 'S+', key: 'Stunned + auto-crit within 5ft.', removal: 'Spell save each turn.' },
  { condition: 'Unconscious', severity: 'S+', key: 'Paralyzed + prone + drop items. 0 HP = death saves.', removal: 'Healing.' },
  { condition: 'Petrified', severity: 'S', key: 'Stone. Removed from play.', removal: 'Greater Restoration.' },
  { condition: 'Exhaustion', severity: 'S (stacking)', key: 'L1-6. L6=death.', removal: '1 level/LR. Greater Restoration.' },
  { condition: 'Incapacitated', severity: 'S', key: 'No actions or reactions.', removal: 'Varies.' },
  { condition: 'Frightened', severity: 'A+', key: 'Disadvantage. Can\'t approach source.', removal: 'Save each turn.' },
  { condition: 'Restrained', severity: 'A+', key: 'Speed 0. Advantage to hit. Own attacks disadvantage.', removal: 'STR/DEX check.' },
  { condition: 'Blinded', severity: 'A+', key: 'Can\'t see. Advantage/disadvantage swap.', removal: 'Lesser Restoration.' },
  { condition: 'Charmed', severity: 'A', key: 'Can\'t attack charmer.', removal: 'Duration or damage.' },
  { condition: 'Invisible', severity: 'A+ (buff)', key: 'Advantage on attacks. Disadvantage vs you.', removal: 'Duration. See Invisibility.' },
  { condition: 'Poisoned', severity: 'B+', key: 'Disadvantage attacks+checks.', removal: 'Lesser Restoration.' },
  { condition: 'Prone', severity: 'B+', key: 'Melee adv vs. Ranged disadv vs.', removal: 'Half movement to stand.' },
  { condition: 'Grappled', severity: 'B', key: 'Speed 0.', removal: 'Athletics/Acrobatics check.' },
  { condition: 'Deafened', severity: 'C+', key: 'Can\'t hear.', removal: 'Lesser Restoration.' },
];

export const CONDITION_REMOVAL_SPELLS = {
  lesserRestoration: 'Blinded, Deafened, Paralyzed, Poisoned.',
  greaterRestoration: 'Charmed, Petrified, Curse, Max HP reduction, Exhaustion (1 level).',
  layOnHands: 'Disease (5HP), Poison (5HP).',
  stillnessOfMind: 'Charmed, Frightened (Monk L7).',
  calmEmotions: 'Suppress Charmed or Frightened.',
};

export const CONDITION_TIPS = [
  'Paralyzed + melee within 5ft = auto-crit. Best combo enabler.',
  'Frightened + Conquest aura = speed 0. Soft lock.',
  'Grapple + prone = can\'t stand. All melee has advantage.',
  'Exhaustion: 1 level/LR removal. Very punishing if stacked.',
  'Stunned is the best debuff. Monk Stunning Strike is incredible.',
  'Lesser Restoration covers 4 conditions. Always prepare it.',
  'Many monsters are immune to conditions. Check before relying on debuffs.',
];
