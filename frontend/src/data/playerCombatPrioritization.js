/**
 * playerCombatPrioritization.js
 * Player Mode: Target priority decision framework
 * Pure JS — no React dependencies.
 */

export const TARGET_PRIORITY_FRAMEWORK = [
  {
    priority: 1,
    target: 'Enemy Healers',
    reason: 'Healing undoes your damage. A cleric healing 30 HP negates 3 attacks.',
    tactic: 'Focus fire or Counterspell their heals. Silence (2nd) shuts them down.',
  },
  {
    priority: 2,
    target: 'Enemy Spellcasters',
    reason: 'Spellcasters have the most devastating abilities. One Fireball changes everything.',
    tactic: 'Rush into melee range (concentration checks). Counterspell. Silence.',
  },
  {
    priority: 3,
    target: 'Concentrating Enemies',
    reason: 'Breaking concentration removes their best ongoing effect.',
    tactic: 'Multi-attack fighters and Magic Missile are great for forcing multiple concentration saves.',
  },
  {
    priority: 4,
    target: 'Nearly Dead Enemies',
    reason: 'A creature at 1 HP deals full damage. Finishing it removes actions from the enemy side.',
    tactic: 'Use cantrips or minor abilities to finish low-HP targets. Don\'t waste big abilities.',
  },
  {
    priority: 5,
    target: 'Buffing/Support Enemies',
    reason: 'Bards, leaders, or creatures buffing others multiply enemy effectiveness.',
    tactic: 'Dispel Magic on their buffs. Or just kill the source.',
  },
  {
    priority: 6,
    target: 'High-Damage Threats',
    reason: 'The enemy dealing the most damage to your party.',
    tactic: 'Tank soaks their attacks. DPS burns them down.',
  },
  {
    priority: 7,
    target: 'Minions / Fodder',
    reason: 'Action economy matters, but each weak enemy still gets a turn.',
    tactic: 'AoE spells clear groups. Don\'t waste single-target attacks on CR 1/4 creatures.',
  },
];

export const FOCUS_FIRE_RULES = [
  'Focus fire: entire party attacks the same target. Dead enemies deal zero damage.',
  'Exception: AoE damage is worth splitting if 3+ enemies are clustered.',
  'Don\'t spread damage across 5 targets — kill one at a time.',
  'A damaged enemy attacks just as hard as a healthy one. Dead ones don\'t.',
  'Communicate targets: "I\'m attacking the mage!" so the party coordinates.',
];

export const DISENGAGE_VS_KILL = {
  question: 'Should I attack the enemy next to me or disengage to reach a better target?',
  attackIf: 'The enemy near you is high priority, nearly dead, or you have Extra Attack.',
  disengageIf: 'The enemy near you is low priority and a high-value target is unguarded.',
  tip: 'Rogues: Cunning Action Disengage is free (bonus action). Always reposition.',
};

export function getTargetPriority(targetType) {
  return TARGET_PRIORITY_FRAMEWORK.find(t => t.target.toLowerCase().includes((targetType || '').toLowerCase())) || null;
}

export function suggestTarget(enemies) {
  // enemies: array of { name, type, hpPercent, isConcentrating, isCaster, isHealer }
  if (!enemies || enemies.length === 0) return null;
  const healers = enemies.filter(e => e.isHealer);
  if (healers.length > 0) return { target: healers[0], reason: 'Enemy healer — top priority.' };
  const casters = enemies.filter(e => e.isCaster);
  if (casters.length > 0) return { target: casters[0], reason: 'Enemy spellcaster — high threat.' };
  const concentrating = enemies.filter(e => e.isConcentrating);
  if (concentrating.length > 0) return { target: concentrating[0], reason: 'Break their concentration.' };
  const lowHP = enemies.filter(e => e.hpPercent < 25).sort((a, b) => a.hpPercent - b.hpPercent);
  if (lowHP.length > 0) return { target: lowHP[0], reason: 'Nearly dead — finish them off.' };
  return { target: enemies[0], reason: 'Focus fire on one target.' };
}
