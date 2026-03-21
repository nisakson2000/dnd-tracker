/**
 * playerExhaustionGuide.js
 * Player Mode: Exhaustion levels and management
 * Pure JS — no React dependencies.
 */

export const EXHAUSTION_LEVELS = [
  { level: 1, effect: 'Disadvantage on ability checks.', severity: 'Mild', note: 'Affects skill checks but NOT attacks or saves. Manageable.' },
  { level: 2, effect: 'Speed halved.', severity: 'Moderate', note: 'Half speed hurts melee characters badly. Ranged characters less affected.' },
  { level: 3, effect: 'Disadvantage on attack rolls and saving throws.', severity: 'Severe', note: 'This is where it gets dangerous. Disadvantage on everything important.' },
  { level: 4, effect: 'Hit point maximum halved.', severity: 'Critical', note: 'Your max HP is cut in half. Very easy to die at this point.' },
  { level: 5, effect: 'Speed reduced to 0.', severity: 'Deadly', note: 'You can\'t move. Paralyzed effectively. One more level = death.' },
  { level: 6, effect: 'Death.', severity: 'Fatal', note: 'You die. No death saves. No exceptions. Resurrection required.' },
];

export const EXHAUSTION_SOURCES = [
  { source: 'Forced march', trigger: 'Travel more than 8 hours. CON save (DC 10 + hours beyond 8) each extra hour.', note: 'Long travel without rest. DC increases each hour.' },
  { source: 'No food/water', trigger: 'Going without food (3+ days) or water (1+ day with no water at all).', note: 'Water is more urgent. 1 day without water in hot conditions = exhaustion.' },
  { source: 'Berserker Frenzy', trigger: 'Berserker Barbarian: Frenzy ends = 1 level of exhaustion.', note: 'Main reason Berserker is considered weak. Frenzy tax is harsh.' },
  { source: 'Sickening Radiance', trigger: 'Failed CON save = 1 level per failed save. Can stack quickly.', note: 'Deadly spell. 6 failed saves = death regardless of HP.' },
  { source: 'Haste ending', trigger: 'When Haste ends: can\'t move or take actions for 1 turn. (Not exhaustion but similar debuff.)', note: 'Not technically exhaustion but the lethargy is similar.' },
  { source: 'Dream spell', trigger: 'Nightmare form prevents rest benefits. Messenger can cause exhaustion.', note: 'Prevents long rest recovery. Can stack over multiple nights.' },
];

export const EXHAUSTION_REMOVAL = [
  { method: 'Long rest', effect: 'Remove 1 level of exhaustion (if you have food and water).', note: 'Only removes ONE level per long rest. Multiple levels take multiple days.' },
  { method: 'Greater Restoration (L5)', effect: 'Remove 1 level of exhaustion.', note: '100gp diamond dust consumed. One level per casting.' },
  { method: 'Heroes\' Feast (L6)', effect: 'Cures all diseases and poison. Does NOT cure exhaustion.', note: 'Common misconception. Heroes\' Feast doesn\'t fix exhaustion.' },
  { method: 'Potion of Vitality (Very Rare)', effect: 'Remove all exhaustion levels.', note: 'Very rare magic item. If you find one, save it for emergencies.' },
];

export const EXHAUSTION_TIPS = [
  { tip: 'Avoid Berserker Frenzy', detail: 'If playing Berserker, Frenzy only when it\'s the last fight before long rest. Otherwise the exhaustion stacks.' },
  { tip: 'Track food and water', detail: 'In survival campaigns, track rations. Create Food and Water (L3 Cleric) prevents exhaustion.' },
  { tip: 'Greater Restoration priority', detail: 'At exhaustion 3+, prioritize Greater Restoration. Disadvantage on attacks+saves is nearly fatal.' },
  { tip: 'Sickening Radiance defense', detail: 'If caught in Sickening Radiance, escape immediately. Each failed save = 1 exhaustion. 6 = death.' },
];

export function exhaustionEffects(currentLevel) {
  const effects = [];
  if (currentLevel >= 1) effects.push('Disadvantage on ability checks');
  if (currentLevel >= 2) effects.push('Speed halved');
  if (currentLevel >= 3) effects.push('Disadvantage on attacks and saves');
  if (currentLevel >= 4) effects.push('HP maximum halved');
  if (currentLevel >= 5) effects.push('Speed reduced to 0');
  if (currentLevel >= 6) effects.push('DEATH');
  return effects;
}

export function daysToRecover(exhaustionLevel) {
  return exhaustionLevel; // 1 long rest per level
}
