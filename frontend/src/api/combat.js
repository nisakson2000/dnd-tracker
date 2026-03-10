import { invoke } from '@tauri-apps/api/core'

export const getAttacks = (id) =>
  invoke('get_attacks', { characterId: id })
export const addAttack = (id, data) =>
  invoke('add_attack', { characterId: id, payload: data })
export const updateAttack = (id, attackId, data) =>
  invoke('update_attack', { characterId: id, attackId, payload: data })
export const deleteAttack = (id, attackId) =>
  invoke('delete_attack', { characterId: id, attackId })
export const getConditions = (id) =>
  invoke('get_conditions', { characterId: id })
export const updateConditions = (id, data) =>
  invoke('update_conditions', { characterId: id, payload: data })
export const getCombatNotes = (id) =>
  invoke('get_combat_notes', { characterId: id })
export const updateCombatNotes = (id, data) =>
  invoke('update_combat_notes', { characterId: id, payload: data })
