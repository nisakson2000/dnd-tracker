import { invoke } from '@tauri-apps/api/core'

export const getNPCs = (id) =>
  invoke('get_npcs', { characterId: id })
export const addNPC = (id, data) =>
  invoke('add_npc', { characterId: id, payload: data })
export const updateNPC = (id, npcId, data) =>
  invoke('update_npc', { characterId: id, npcId, payload: data })
export const deleteNPC = (id, npcId) =>
  invoke('delete_npc', { characterId: id, npcId })
