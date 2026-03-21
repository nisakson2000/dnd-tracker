/**
 * playerCombatPhases.js
 * Player Mode: Combat phase recognition and phase-specific strategies
 * Pure JS — no React dependencies.
 */

export const COMBAT_PHASES = [
  {
    phase: 'Opening',
    rounds: '1-2',
    description: 'Initial contact. Setup buffs, establish positions, make first strikes.',
    priorities: ['Cast concentration buffs (Bless, Spirit Guardians, Haste)', 'Establish positioning and formation', 'Identify enemy types and threats', 'Use surprise round advantage if available'],
    mistakes: ['Wasting big spells on unknown threats', 'Running in without a plan', 'Not using bonus actions for setup'],
    keyActions: { tank: 'Move to front, Rage/Shield of Faith', dps: 'Alpha strike high-priority target', support: 'Bless/Faerie Fire, establish concentration', healer: 'Aid/buff, position within healing range' },
  },
  {
    phase: 'Control',
    rounds: '3-5',
    description: 'Mid-fight. Manage the battlefield. Focus fire. React to threats.',
    priorities: ['Focus fire: kill weakened enemies', 'Maintain concentration spells', 'Respond to enemy tactics', 'Use class resources as needed'],
    mistakes: ['Switching targets too often (spread damage)', 'Letting concentration drop', 'Ignoring positioning changes'],
    keyActions: { tank: 'Hold the line, protect squishies, Sentinel OAs', dps: 'Focused damage on priority targets', support: 'Maintain concentration, Counterspell threats', healer: 'Healing Word on downed allies, damage otherwise' },
  },
  {
    phase: 'Turning Point',
    rounds: 'Variable',
    description: 'The fight\'s outcome becomes clear. Either winning or losing.',
    priorities: ['If winning: press advantage, don\'t relent', 'If losing: assess retreat options', 'Use remaining high-level resources', 'Watch for enemy reinforcements'],
    mistakes: ['Getting complacent when winning', 'Not retreating when losing', 'Hoarding resources past the point of usefulness'],
    keyActions: { tank: 'Push forward or cover retreat', dps: 'Nova remaining resources', support: 'Dispel enemy buffs, maintain your own', healer: 'Big heals if needed, otherwise help finish' },
  },
  {
    phase: 'Cleanup',
    rounds: 'Final 1-2',
    description: 'Mopping up remaining enemies. Transition to post-combat.',
    priorities: ['Finish remaining enemies efficiently', 'Conserve resources for next encounter', 'Begin post-combat procedures', 'Check for fleeing enemies'],
    mistakes: ['Wasting high-level slots on nearly-dead enemies', 'Not securing the area', 'Forgetting to stabilize downed allies'],
    keyActions: { tank: 'Secure the area, check for threats', dps: 'Cantrips to finish stragglers', support: 'Drop concentration if combat is won', healer: 'Heal downed allies, assess party status' },
  },
  {
    phase: 'Post-Combat',
    rounds: 'N/A',
    description: 'After the last enemy falls. Recovery and looting.',
    priorities: ['Stabilize/heal downed allies', 'Search bodies and area', 'Assess resource status', 'Plan next move (rest or continue?)'],
    mistakes: ['Not searching thoroughly', 'Forgetting to heal before moving on', 'Not discussing whether to short rest'],
    keyActions: { tank: 'Guard while party searches', dps: 'Help search, assist with healing', support: 'Detect Magic on loot, ritual spells', healer: 'Heal everyone to reasonable HP, assess rest need' },
  },
];

export const PHASE_INDICATORS = [
  { indicator: 'First enemy drops', transition: 'Opening → Control', note: 'You\'ve established damage. Now focus fire the rest.' },
  { indicator: 'Half enemies dead', transition: 'Control → Turning Point', note: 'Momentum is with you. Don\'t let up.' },
  { indicator: 'Party member drops', transition: 'Any → reassess', note: 'Losing a party member changes everything. Heal and adapt.' },
  { indicator: 'Enemy caster neutralized', transition: 'Control → Cleanup likely', note: 'Without their caster, enemy threat drops dramatically.' },
  { indicator: 'Enemy retreats/flees', transition: 'Turning Point → Cleanup', note: 'Pursue or let them go? Fleeing enemies may return with reinforcements.' },
];

export function getCurrentPhase(roundNumber, enemiesDefeated, totalEnemies, partyDown) {
  if (partyDown > 0 && roundNumber <= 2) return COMBAT_PHASES.find(p => p.phase === 'Control');
  if (roundNumber <= 2) return COMBAT_PHASES.find(p => p.phase === 'Opening');
  if (enemiesDefeated >= totalEnemies * 0.75) return COMBAT_PHASES.find(p => p.phase === 'Cleanup');
  if (enemiesDefeated >= totalEnemies * 0.4) return COMBAT_PHASES.find(p => p.phase === 'Turning Point');
  return COMBAT_PHASES.find(p => p.phase === 'Control');
}

export function getPhaseAdvice(phase, role) {
  const phaseData = COMBAT_PHASES.find(p => p.phase.toLowerCase() === (phase || '').toLowerCase());
  if (!phaseData) return null;
  return {
    priorities: phaseData.priorities,
    action: phaseData.keyActions[role] || 'Follow party lead',
    avoid: phaseData.mistakes,
  };
}
