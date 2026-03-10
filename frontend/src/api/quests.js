import { invoke } from '@tauri-apps/api/core'

export const getQuests = (id) =>
  invoke('get_quests', { characterId: id })
export const addQuest = (id, data) =>
  invoke('add_quest', { characterId: id, payload: data })
export const updateQuest = (id, questId, data) =>
  invoke('update_quest', { characterId: id, questId, payload: data })
export const deleteQuest = (id, questId) =>
  invoke('delete_quest', { characterId: id, questId })
