import { invoke } from '@tauri-apps/api/core'

export const insertCombatLog = (sessionId, round, turnOrder, entryType, actorName, targetName, description, detailsJson) =>
  invoke('insert_combat_log', {
    sessionId: sessionId || '',
    round: round || 0,
    turnOrder: turnOrder || 0,
    entryType: entryType || 'info',
    actorName: actorName || '',
    targetName: targetName || '',
    description: description || '',
    detailsJson: detailsJson || null,
  })

export const getCombatLog = (sessionId, limit) =>
  invoke('get_combat_log', { sessionId: sessionId || null, limit: limit || 100 })

export const clearCombatLog = (sessionId) =>
  invoke('clear_combat_log', { sessionId: sessionId || null })

export const archiveCombatSession = (sessionId, roundCount, combatants, stats) =>
  invoke('archive_combat_session', {
    sessionId: sessionId || '',
    roundCount: roundCount || 0,
    combatantsJson: typeof combatants === 'string' ? combatants : JSON.stringify(combatants || []),
    combatStatsJson: typeof stats === 'string' ? stats : JSON.stringify(stats || {}),
  })
